class OrdersManager {

    constructor() {

        // DOM
        this.table = document.getElementById("ordersTable");
        this.modal = document.getElementById("orderModal");
        this.details = document.getElementById("orderDetails");
        this.closeBtn = document.getElementById("closeModal");

        // state
        this.orders = this.loadOrders();

        this.init();
    }

    // =========================
    // INIT
    // =========================

    init() {

        this.bindEvents();
        this.renderOrders();
    }

    // =========================
    // LOAD ORDERS
    // =========================

    loadOrders() {

        try {

            return JSON.parse(localStorage.getItem("orders")) || [];

        } catch (error) {

            console.error("خطا در خواندن سفارش‌ها", error);

            return [];
        }
    }

    // =========================
    // SAVE ORDERS
    // =========================

    saveOrders() {

        localStorage.setItem(
            "orders",
            JSON.stringify(this.orders)
        );
    }
}
    // =========================
    // RENDER ORDERS
    // =========================

    renderOrders() {

        if (!this.table) return;

        this.table.innerHTML = "";

        if (this.orders.length === 0) {

            this.table.innerHTML = `
                <tr>
                    <td colspan="7">
                        هیچ سفارشی ثبت نشده است
                    </td>
                </tr>
            `;

            return;
        }

        this.table.innerHTML = this.orders.map(order => {

            return `
                <tr>

                    <td>#${order.id}</td>

                    <td>${order.customerName}</td>

                    <td>${order.customerPhone}</td>

                    <td>${this.formatPrice(order.total)} تومان</td>

                    <td>${order.date}</td>

                    <td>

                        <select class="status-select" data-id="${order.id}">

                            ${this.renderStatusOptions(order.status)}

                        </select>

                    </td>

                    <td>

                        <button class="view-btn" data-id="${order.id}">
                            مشاهده
                        </button>

                        <button class="delete-btn" data-id="${order.id}">
                            حذف
                        </button>

                    </td>

                </tr>
            `;
        }).join("");
    }

    // =========================
    // STATUS OPTIONS
    // =========================

    renderStatusOptions(current) {

        const statuses = [
            "در انتظار بررسی",
            "در حال آماده سازی",
            "ارسال شد",
            "تحویل داده شد"
        ];

        return statuses.map(status => {

            return `
                <option ${status === current ? "selected" : ""}>
                    ${status}
                </option>
            `;
        }).join("");
    }

    // =========================
    // FORMAT PRICE
    // =========================

    formatPrice(price) {

        return Number(price || 0).toLocaleString("fa-IR");
    }
    // =========================
    // EVENTS
    // =========================

    bindEvents() {

        // close modal
        if (this.closeBtn) {

            this.closeBtn.addEventListener("click", () => {

                this.closeModal();
            });
        }

        // click events (delegation)
        if (this.table) {

            this.table.addEventListener("click", (e) => {

                const viewBtn = e.target.closest(".view-btn");
                const deleteBtn = e.target.closest(".delete-btn");

                if (viewBtn) {

                    this.showOrder(viewBtn.dataset.id);
                }

                if (deleteBtn) {

                    this.deleteOrder(deleteBtn.dataset.id);
                }
            });

            // status change
            this.table.addEventListener("change", (e) => {

                if (e.target.classList.contains("status-select")) {

                    this.changeStatus(
                        e.target.dataset.id,
                        e.target.value
                    );
                }
            });
        }

        // modal outside click
        window.addEventListener("click", (e) => {

            if (e.target === this.modal) {

                this.closeModal();
            }
        });
    }
    // =========================
    // SHOW ORDER
    // =========================

    showOrder(id) {

        const order = this.orders.find(o => o.id == id);

        if (!order) return;

        this.details.innerHTML = `
            <p><b>نام:</b> ${order.customerName}</p>
            <p><b>شماره:</b> ${order.customerPhone}</p>

            <p>
                <b>آدرس:</b>
                ${order.customerProvince} - ${order.customerCity}
                <br>
                ${order.customerAddress}
            </p>

            <hr>

            ${order.items.map(i => `
                <p>${i.name} × ${i.quantity}</p>
            `).join("")}

            <hr>

            <b>${this.formatPrice(order.total)} تومان</b>
        `;

        this.openModal();
    }

    // =========================
    // STATUS CHANGE
    // =========================

    changeStatus(id, status) {

        const order = this.orders.find(o => o.id == id);

        if (!order) return;

        order.status = status;

        this.saveOrders();
    }

    // =========================
    // DELETE ORDER
    // =========================

    deleteOrder(id) {

        const ok = confirm("حذف سفارش؟");

        if (!ok) return;

        this.orders = this.orders.filter(o => o.id != id);

        this.saveOrders();

        this.renderOrders();
    }

    // =========================
    // MODAL
    // =========================

    openModal() {

        this.modal.style.display = "flex";
    }

    closeModal() {

        this.modal.style.display = "none";
    }
}