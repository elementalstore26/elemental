class Shop {

    constructor() {

        // DOM
        this.container = document.getElementById("shopProducts");
        this.filterButtons = document.querySelectorAll(".filter-btn");

        // State
        this.products = this.loadProducts();
        this.filtered = [...this.products];

        this.selectedCategory = this.getCategoryFromURL();

        this.init();
    }

    // =========================
    // INIT
    // =========================

    init() {

        this.bindEvents();
        this.applyInitialFilter();
    }

    // =========================
    // LOAD DATA
    // =========================

    loadProducts() {

        try {

            return JSON.parse(localStorage.getItem("products")) || [];

        } catch (err) {

            console.error("Load error:", err);

            return [];
        }
    }

    getCategoryFromURL() {

        const params = new URLSearchParams(window.location.search);

        return params.get("category");
    }
}
    // =========================
    // RENDER
    // =========================

    render(list = this.filtered) {

        if (!this.container) return;

        if (!list.length) {

            this.container.innerHTML = `
                <div class="empty-products">
                    <h2>محصولی پیدا نشد.</h2>
                </div>
            `;

            return;
        }

        this.container.innerHTML = list
            .map(p => this.createCard(p))
            .join("");
    }

    createCard(p) {

        return `
        <div class="product-card">

            <div class="product-image">
                <img src="${p.image || 'images/product1.jpg'}"
                     alt="${p.name}">
            </div>

            <div class="product-info">

                <span class="product-category">
                    ${p.category}
                </span>

                <h3>${p.name}</h3>

                <p>${p.description || ""}</p>

                <div class="product-price">
                    ${this.formatPrice(p.price)} تومان
                </div>

                <div class="product-buttons">
                    <a href="product.html?id=${p.id}"
                       class="product-btn">
                        مشاهده محصول
                    </a>
                </div>

            </div>

        </div>
        `;
    }
    // =========================
    // FILTER SYSTEM
    // =========================

    applyInitialFilter() {

        if (this.selectedCategory) {

            this.setActiveButton(this.selectedCategory);

            this.filterByCategory(this.selectedCategory);

        } else {

            this.render(this.products);
        }
    }

    filterByCategory(category) {

        this.filtered = this.products.filter(p => {

            return p.category === category;
        });

        this.render();
    }

    setActiveButton(category) {

        this.filterButtons.forEach(btn => {

            btn.classList.remove("active");

            if (btn.textContent.trim() === category) {

                btn.classList.add("active");
            }
        });
    }
    // =========================
    // EVENTS
    // =========================

    bindEvents() {

        this.filterButtons.forEach(btn => {

            btn.addEventListener("click", () => {

                const category = btn.textContent.trim();

                this.handleFilter(category);

                this.setActiveButton(category);
            });
        });
    }

    handleFilter(category) {

        if (category === "همه") {

            this.filtered = [...this.products];

        } else {

            this.filtered = this.products.filter(p => {

                return p.category === category;
            });
        }

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

    new Shop();
});