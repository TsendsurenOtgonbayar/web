function setStatus(row, statusHtml, actionHtml) {
    const statusCell = row.querySelector("td:nth-child(5)");
    const actionCell = row.querySelector("td:last-child");
    if (!statusCell || !actionCell) {
        return;
    }

    statusCell.innerHTML = statusHtml;
    actionCell.innerHTML = actionHtml;
}

function handleApprove(button) {
    const row = button.closest("tr");
    if (!row) {
        return;
    }

    setStatus(
        row,
        '<span style="color: #2e7d32; font-weight: bold;">Баталгаажсан</span>',
        '<button class="action-btn" style="background: #eee;">Дэлгэрэнгүй</button>'
    );
    alert("Захиалгыг амжилттай баталлаа!");
}

function handleReject(button) {
    const row = button.closest("tr");
    if (!row) {
        return;
    }

    const confirmed = confirm("Энэ захиалгыг үнэхээр цуцлах уу?");
    if (!confirmed) {
        return;
    }

    setStatus(
        row,
        '<span style="color: #c62828; font-weight: bold;">Цуцлагдсан</span>',
        '<span style="color: #999;">Үйлдэл хийгдсэн</span>'
    );
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".btn-approve").forEach((button) => {
        button.addEventListener("click", () => handleApprove(button));
    });

    document.querySelectorAll(".btn-reject").forEach((button) => {
        button.addEventListener("click", () => handleReject(button));
    });
});