class AdminProducts {

    constructor() {

        // عناصر DOM
        this.table = document.getElementById("productsTable");
        this.searchInput = document.getElementById("searchProduct");

        // state
        this.products = this.loadProducts();

        // init
        this.init();
    }

    // ================= INIT =================

    init() {

        this.bindEvents();
        this.render();
    }

    // ================= LOAD =================

    loadProducts() {

        return JSON.parse(localStorage.getItem("products")) || [];
    }

    // ================= SAVE =================

    saveProducts() {

        localStorage.setItem(
            "products",
            JSON.stringify(this.products)
        );
    }

    // ================= EVENTS =================

    bindEvents() {

        // جستجو
        if (this.searchInput) {

            this.searchInput.addEventListener("input", (e) => {

                this.filterProducts(e.target.value);
            });
        }

        // event delegation برای جدول
        if (this.table) {

            this.table.addEventListener("click", (e) => {

                const editBtn = e.target.closest(".edit-btn");
                const deleteBtn = e.target.closest(".delete-btn");

                if (editBtn) {

                    this.editProduct(editBtn.dataset.id);
                }

                if (deleteBtn) {

                    this.deleteProduct(deleteBtn.dataset.id);
                }
            });
        }
    }
}
    // ================= RENDER =================

    render(list = this.products) {

        if (!this.table) return;

        if (list.length === 0) {

            this.table.innerHTML = `
                <tr>
                    <td colspan="5">
                        هیچ محصولی یافت نشد
                    </td>
                </tr>
            `;

            return;
        }

        this.table.innerHTML = list.map((product, index) => {

            return `
                <tr>

                    <td>${index + 1}</td>

                    <td>${product.name}</td>

                    <td>
                        ${this.formatPrice(product.price)} تومان
                    </td>

                    <td>${product.stock}</td>

                    <td>

                        <button
                            class="edit-btn"
                            data-id="${product.id}">

                            ویرایش

                        </button>

                        <button
                            class="delete-btn"
                            data-id="${product.id}">

                            حذف

                        </button>

                    </td>

                </tr>
            `;
        }).join("");
    }

    // ================= FILTER =================

    filterProducts(query) {

        const q = query.toLowerCase().trim();

        const filtered = this.products.filter(product => {

            return product.name.toLowerCase().includes(q);
        });

        this.render(filtered);
    }

    // ================= FORMAT PRICE =================

    formatPrice(price) {

        return Number(price).toLocaleString("fa-IR");
    }
    // ================= EDIT =================

    editProduct(id) {

        const product = this.products.find(p => p.id == id);

        if (!product) return;

        localStorage.setItem(
            "editingProduct",
            JSON.stringify(product)
        );

        // انتقال به صفحه ویرایش
        window.location.href = "add-product.html";
    }

    // ================= DELETE =================

    deleteProduct(id) {

        const confirmDelete = confirm("آیا از حذف محصول مطمئن هستید؟");

        if (!confirmDelete) return;

        this.products = this.products.filter(p => p.id != id);

        this.saveProducts();

        this.render();

        this.showToast("محصول حذف شد");
    }

    // ================= TOAST =================

    showToast(message) {

        const toast = document.createElement("div");

        toast.className = "toast";

        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {

            toast.remove();

        }, 2000);
    }
}
    // ================= ADD PRODUCT (future Firebase ready) =================

    addProduct(product) {

        const newProduct = {

            id: Date.now(),

            name: product.name,

            price: product.price,

            stock: product.stock,

            category: product.category || "general"
        };

        this.products.push(newProduct);

        this.saveProducts();

        this.render();
    }

}

// ================= INIT APP =================

const app = new AdminProducts();