const user = localStorage.getItem("currentUser");
if (user) {
  console.log(`Welcome back, ${user}!`);
} else {
  window.location.href = "./login.html";
  console.log("Please log in or register.");
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "./";
}

document.getElementById("logout-button").addEventListener("click", () => {
  logout();
});

document
  .getElementById("reset-progress-button")
  .addEventListener("click", async () => {
    if (
      confirm(
        "Are you sure you want to reset your progress? This cannot be undone."
      )
    ) {
      try {
        const res = await fetch("resetProgress.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: user }),
        });
        const data = await res.json();
        if (data.success) {
          alert("Progress reset successfully!");
          window.location.reload();
        } else {
          alert("Failed to reset progress: " + (data.error || "Unknown error"));
        }
      } catch (err) {
        alert("Network error while resetting progress.");
      }
    }
  });
