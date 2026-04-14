const BASE_URL = "https://mern-jwt-auth-server.onrender.com";

const responseBox = document.getElementById("response");
const tokenInput = document.getElementById("token");

// Load saved token
const storedToken = localStorage.getItem("accessToken");
if (storedToken) {
  tokenInput.value = storedToken;
}

function showResponse(data) {
  responseBox.textContent = JSON.stringify(data, null, 2);
}

function getToken() {
  return tokenInput.value.trim();
}

function saveToken(token) {
  tokenInput.value = token;
  localStorage.setItem("accessToken", token);
}

// ✅ FIXED request function
async function request(path, options = {}) {
  const res = await fetch(BASE_URL + path, {
    credentials: "include",
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
    data = { status: res.status, message: "No JSON body" };
  }

  if (!res.ok) {
    throw data;
  }

  return data;
}

// ✅ Register
document.getElementById("register-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;

  try {
    const payload = {
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value
    };

    const data = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    if (data.accessToken) {
      saveToken(data.accessToken);
    }

    showResponse(data);
  } catch (err) {
    showResponse(err);
  }
});

// ✅ Login
document.getElementById("login-form").addEventListener("submit", async (event) => {
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

    if (data.accessToken) {
      saveToken(data.accessToken);
    }

    showResponse(data);
  } catch (err) {
    showResponse(err);
  }
});

// ✅ Get Me
document.getElementById("get-me").addEventListener("click", async () => {
  try {
    const token = getToken();

    const data = await request("/api/auth/get-me", {
      headers: {
        Authorization: token ? `Bearer ${token}` : ""
      }
    });

    showResponse(data);
  } catch (err) {
    showResponse(err);
  }
});

// ✅ Refresh Token
document.getElementById("refresh").addEventListener("click", async () => {
  try {
    const data = await request("/api/auth/refresh-token");

    if (data.accessToken) {
      saveToken(data.accessToken);
    }

    showResponse(data);
  } catch (err) {
    showResponse(err);
  }
});

// ✅ Logout
document.getElementById("logout").addEventListener("click", async () => {
  try {
    const data = await request("/api/auth/logout", {
      method: "POST"
    });

    showResponse(data);
  } catch (err) {
    showResponse(err);
  }
});

// ✅ Logout All
document.getElementById("logout-all").addEventListener("click", async () => {
  try {
    const data = await request("/api/auth/logout-all", {
      method: "POST"
    });

    showResponse(data);
  } catch (err) {
    showResponse(err);
  }
});

// ✅ Save Token
document.getElementById("save-token").addEventListener("click", () => {
  const token = getToken();
  if (token) {
    saveToken(token);
  }
});

// ✅ Clear Token
document.getElementById("clear-token").addEventListener("click", () => {
  tokenInput.value = "";
  localStorage.removeItem("accessToken");
});