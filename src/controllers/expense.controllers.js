import expenseModel from "../models/expense.model.js";

function buildDateFilter(startDate, endDate) {
  const filter = {};
  if (startDate) filter.$gte = new Date(startDate);
  if (endDate) filter.$lte = new Date(endDate);
  return Object.keys(filter).length ? filter : null;
}

export async function createExpense(req, res) {
  const { title, amount, category, date, notes } = req.body;
  if (!title || amount === undefined || !category || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const expense = await expenseModel.create({
    user: req.user._id,
    title,
    amount,
    category,
    date,
    notes
  });

  return res.status(201).json({ message: "Expense created", expense });
}

export async function getExpenses(req, res) {
  const { page = 1, limit = 10, category, startDate, endDate, search } = req.query;
  const query = { user: req.user._id };

  if (category) query.category = category;
  const dateFilter = buildDateFilter(startDate, endDate);
  if (dateFilter) query.date = dateFilter;
  if (search) query.title = { $regex: search, $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    expenseModel.find(query).sort({ date: -1 }).skip(skip).limit(Number(limit)),
    expenseModel.countDocuments(query)
  ]);

  return res.status(200).json({
    items,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)) || 1
    }
  });
}

export async function updateExpense(req, res) {
  const { id } = req.params;
  const expense = await expenseModel.findOne({ _id: id, user: req.user._id });
  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }

  const { title, amount, category, date, notes } = req.body;
  if (title !== undefined) expense.title = title;
  if (amount !== undefined) expense.amount = amount;
  if (category !== undefined) expense.category = category;
  if (date !== undefined) expense.date = date;
  if (notes !== undefined) expense.notes = notes;

  await expense.save();
  return res.status(200).json({ message: "Expense updated", expense });
}

export async function deleteExpense(req, res) {
  const { id } = req.params;
  const expense = await expenseModel.findOneAndDelete({ _id: id, user: req.user._id });
  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }
  return res.status(200).json({ message: "Expense deleted" });
}

export async function getSummary(req, res) {
  const { range = "monthly" } = req.query;
  const now = new Date();
  const start = new Date(now);
  if (range === "weekly") {
    start.setDate(now.getDate() - 7);
  } else {
    start.setMonth(now.getMonth() - 1);
  }

  const data = await expenseModel.aggregate([
    { $match: { user: req.user._id, date: { $gte: start } } },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    },
    { $sort: { total: -1 } }
  ]);

  const total = data.reduce((acc, item) => acc + item.total, 0);
  return res.status(200).json({ range, total, breakdown: data });
}
