import APIGateway from "../gateway/apiGateway.js";

async function guardDashboardAccess() {
    const currentUser = await APIGateway.getCurrentUser();
    if (!currentUser) {
        window.location.href = "/UI/logIn.html";
        return false;
    }

    if (!APIGateway.isAdmin(currentUser)) {
        window.location.href = "/UI/profile.html";
        return false;
    }

    return true;
}

document.addEventListener("DOMContentLoaded", async () => {
    if (!(await guardDashboardAccess())) {
        return;
    }

    const logoutButton = document.querySelector("#logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", (event) => {
            event.preventDefault();
            APIGateway.logout();
            window.location.href = "/index.html";
        });
    }
});