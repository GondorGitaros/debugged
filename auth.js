function showLogin() {
  document.getElementById("auth-container").innerHTML = `
          <h2>Login</h2>
          <form id="login-form">
            <label>Username<br><input type="text" id="login-username" required></label><br>
            <label>Password<br><input type="password" id="login-password" required></label><br>
            <button type="submit">Login</button>
          </form>
          <button class="switch-link" onclick="showRegister()">Don't have an account? Register</button>
          <button class="demo-link" onclick="window.location.href='./Demo/'">Don't want to sign up? Play Demo</button>
        `;
  document.getElementById("login-form").onsubmit = async function (e) {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    try {
      const res = await fetch("login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("currentUser", username);
        window.location.href = "./";
      } else {
        alert(data.error || "Invalid username or password");
      }
    } catch (err) {
      alert("Network error");
    }
  };
}

function showRegister() {
  document.getElementById("auth-container").innerHTML = `
          <h2>Register</h2>
          <form id="register-form">
            <label>Username<br><input type="text" id="register-username" required></label><br>
            <label>Password<br><input type="password" id="register-password" required></label><br>
            <button type="submit">Register</button>
          </form>
          <button class="switch-link" onclick="showLogin()">Already have an account? Login</button>
          <button class="demo-link" onclick="window.location.href='./Demo/'">Don't want to sign up? Play Demo</button>
        `;
  document.getElementById("register-form").onsubmit = async function (e) {
    e.preventDefault();
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    try {
      const res = await fetch("register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Registration successful! Please login.");
        showLogin();
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      alert("Network error");
    }
  };
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "./";
}

window.onload = function () {
  const user = localStorage.getItem("currentUser");
  if (user) {
    // User is already logged in, redirect to the game or dashboard
    window.location.href = "./";
  } else {
    // Show login/register form
    showLogin();
  }
};
