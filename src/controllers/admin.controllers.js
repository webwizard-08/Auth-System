import userModel from "../models/user.model.js";
import expenseModel from "../models/expense.model.js";

export async function getUsers(req, res) {
  const { page = 1, limit = 10, search } = req.query;
  const query = {};
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    userModel.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    userModel.countDocuments(query)
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

export async function setUserBlocked(req, res) {
  const { id } = req.params;
  const { blocked } = req.body;
  const user = await userModel.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.isBlocked = Boolean(blocked);
  await user.save();
  return res.status(200).json({ message: "User updated", user: { id: user._id, isBlocked: user.isBlocked } });
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  const user = await userModel.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  await expenseModel.deleteMany({ user: id });
  return res.status(200).json({ message: "User deleted" });
}

export async function getAllExpenses(req, res) {
  const { page = 1, limit = 10, category, userId, search } = req.query;
  const query = {};
  if (category) query.category = category;
  if (userId) query.user = userId;
  if (search) query.title = { $regex: search, $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    expenseModel.find(query).populate("user", "username email").sort({ date: -1 }).skip(skip).limit(Number(limit)),
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

export async function getAnalytics(req, res) {
  const [userCount, expenseCount, categoryStats] = await Promise.all([
    userModel.countDocuments(),
    expenseModel.countDocuments(),
    expenseModel.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ])
  ]);

  return res.status(200).json({
    totalUsers: userCount,
    totalExpenses: expenseCount,
    categoryStats
  });
}
