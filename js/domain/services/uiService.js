export function showNotification(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast-msg ${type}`;
  toast.textContent = message;

  if (type === "error") toast.style.backgroundColor = "#ff4757";
  if (type === "success") toast.style.backgroundColor = "#2ed573";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}