document.addEventListener("DOMContentLoaded", () => {
    // Хүснэгт доторх Батлах, Цуцлах товчнуудын үйлдэл
    const approveBtns = document.querySelectorAll(".btn-approve");
    const rejectBtns = document.querySelectorAll(".btn-reject");

    // Батлах товч
    approveBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const tr = this.closest("tr"); // Товч байрлаж буй мөрийг (хүснэгтийн мөр) олох
            const statusCell = tr.querySelector("td:nth-child(5)"); // Төлөв байрлаж буй нүд
            
            // Төлөвийг өөрчлөх
            statusCell.innerHTML = '<span style="color: #2e7d32; font-weight: bold;">Баталгаажсан</span>';
            
            // Товчнуудыг устгах эсвэл идэвхгүй болгох
            const actionCell = tr.querySelector("td:last-child");
            actionCell.innerHTML = '<button class="action-btn" style="background: #eee;">Дэлгэрэнгүй</button>';
            
            alert("Захиалгыг амжилттай баталлаа!");
            // Энд Backend рүү захиалга батлагдсан төлөвийг явуулах логик бичигдэнэ
        });
    });

    // Цуцлах товч
    rejectBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const confirmReject = confirm("Энэ захиалгыг үнэхээр цуцлах уу?");
            if (confirmReject) {
                const tr = this.closest("tr");
                const statusCell = tr.querySelector("td:nth-child(5)");
                
                statusCell.innerHTML = '<span style="color: #c62828; font-weight: bold;">Цуцлагдсан</span>';
                
                const actionCell = tr.querySelector("td:last-child");
                actionCell.innerHTML = '<span style="color: #999;">Үйлдэл хийгдсэн</span>';
            }
        });
    });
});