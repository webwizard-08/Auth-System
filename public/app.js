const toast = document.getElementById("toast");
const page = document.body.dataset.page;

function showToast(type, message) {
  if (!toast) {
    return;
  }
  toast.className = `toast show ${type}`;
  toast.textContent = message;
  setTimeout(() => {
    toast.className = "toast";
    toast.textContent = "";
  }, 2500);
}

async function request(path, options = {}) {
  const res = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = { message: "No JSON body" };
  }

  if (!res.ok) {
    const error = new Error(data?.message || "Request failed");
    error.response = data;
    throw error;
  }

  return data;
}

function getToken() {
  return localStorage.getItem("accessToken") || "";
}

function setToken(token) {
  localStorage.setItem("accessToken", token);
}

function clearToken() {
  localStorage.removeItem("accessToken");
}

async function handleLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;

  try {
    const payload = {
      email: form.email.value.trim(),
      password: form.password.value
    };

    const data = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    if (!data.accessToken) {
      throw new Error("Token not found in response");
    }

    setToken(data.accessToken);
    showToast("success", "Login successful. Redirecting...");
    setTimeout(() => {
      window.location.href = "./dashboard.html";
    }, 700);
  } catch (err) {
    showToast("error", err.response?.message || err.message || "Login failed");
  }
}

async function handleSignup(event) {
  event.preventDefault();
  const form = event.currentTarget;

  try {
    const payload = {
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value
    };

    await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    showToast("success", "Signup successful. Please log in.");
    setTimeout(() => {
      window.location.href = "./index.html";
    }, 900);
  } catch (err) {
    showToast("error", err.response?.message || err.message || "Signup failed");
  }
}

async function loadProfile() {
  const output = document.getElementById("profile-output");
  const token = getToken();

  if (!token) {
    window.location.href = "./index.html";
    return;
  }

  try {
    const data = await request("/api/auth/get-me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = err.response?.message || err.message || "Failed to load profile";
  }
}

function handleLogout() {
  clearToken();
  window.location.href = "./index.html";
}

if (page === "login") {
  const form = document.getElementById("login-form");
  form?.addEventListener("submit", handleLogin);
}

if (page === "signup") {
  const form = document.getElementById("signup-form");
  form?.addEventListener("submit", handleSignup);
}

if (page === "dashboard") {
  const logout = document.getElementById("logout");
  logout?.addEventListener("click", handleLogout);
  loadProfile();
}
