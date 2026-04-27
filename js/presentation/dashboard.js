import AuthService from "../domain/services/AuthenticationService.js";

function guardDashboardAccess() {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
        window.location.href = "logIn.html";
        return false;
    }

    if (!AuthService.isAdmin(currentUser)) {
        window.location.href = "profile.html";
        return false;
    }

    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    if (!guardDashboardAccess()) {
        return;
    }

    const logoutButton = document.querySelector("#logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", (event) => {
            event.preventDefault();
            AuthService.logout();
            window.location.href = "index.html";
        });
    }
});