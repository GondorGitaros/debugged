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
