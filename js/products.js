class ProductManager {

    constructor() {

        // DOM
        this.table = document.getElementById("productsTable");
        this.searchInput = document.getElementById("searchProduct");

        // State
        this.products = this.loadProducts();
        this.filteredProducts = [...this.products];

        this.init();
    }

    // =========================
    // INIT
    // =========================

    init() {

        this.bindEvents();
        this.render();
    }

    // =========================
    // LOAD DATA
    // =========================

    loadProducts() {

        try {

            return JSON.parse(localStorage.getItem("products")) || [];

        } catch (err) {

            console.error("Load Error:", err);

            return [];
        }
    }

    saveProducts() {

        localStorage.setItem(
            "products",
            JSON.stringify(this.products)
        );
    }
}
    // =========================
    // EVENTS
    // =========================

    bindEvents() {

        // Search
        if (this.searchInput) {

            this.searchInput.addEventListener("input", (e) => {

                this.filter(e.target.value);
            });
        }

        // Event Delegation (حرفه‌ای‌ترین روش)
        if (this.table) {

            this.table.addEventListener("click", (e) => {

                const editBtn = e.target.closest("[data-edit]");
                const deleteBtn = e.target.closest("[data-delete]");

                if (editBtn) {

                    this.editProduct(editBtn.dataset.id);
                }

                if (deleteBtn) {

                    this.deleteProduct(deleteBtn.dataset.id);
                }
            });
        }
    }
    // =========================
    // RENDER
    // =========================

    render(list = this.filteredProducts) {

        if (!this.table) return;

        if (!list.length) {

            this.table.innerHTML = `
                <tr>
                    <td colspan="5">هیچ محصولی ثبت نشده است</td>
                </tr>
            `;

            return;
        }

        this.table.innerHTML = list
            .map((p, index) => this.createRow(p, index))
            .join("");
    }

    createRow(product, index) {

        return `
            <tr>

                <td>
                    <img src="images/product1.jpg"
                         width="40"
                         alt="${product.name}">
                </td>

                <td>${product.name}</td>

                <td>${this.formatPrice(product.price)} تومان</td>

                <td>${product.stock}</td>

                <td>

                    <button data-edit="${product.id}">
                        ویرایش
                    </button>

                    <button data-delete="${product.id}">
                        حذف
                    </button>

                </td>

            </tr>
        `;
    }    // =========================
    // FILTER
    // =========================

    filter(query) {

        const q = query.toLowerCase().trim();

        this.filteredProducts = this.products.filter(p => {

            return p.name.toLowerCase().includes(q) ||
                   p.category.toLowerCase().includes(q);
        });

        this.render();
    }

    // =========================
    // EDIT
    // =========================

    editProduct(id) {

        localStorage.setItem("editingProduct", id);

        window.location.href = "add-product.html";
    }

    // =========================
    // DELETE
    // =========================

    deleteProduct(id) {

        const ok = confirm("آیا مطمئن هستی؟");

        if (!ok) return;

        this.products = this.products.filter(
            p => p.id != id
        );

        this.filteredProducts = [...this.products];

        this.saveProducts();
        this.render();
    }
    // =========================
    // UTIL
    // =========================

    formatPrice(price) {

        return Number(price || 0).toLocaleString("fa-IR");
    }
}

// =========================
// START APP
// =========================

document.addEventListener("DOMContentLoaded", () => {

    new ProductManager();
});
