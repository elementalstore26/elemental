class FeaturedProducts {

    constructor() {

        // state
        this.products = this.loadProducts();

        // DOM
        this.container = document.getElementById("featuredProducts");

        this.init();
    }

    // =========================
    // INIT
    // =========================

    init() {

        if (!this.container) return;

        this.render();
    }

    // =========================
    // LOAD DATA
    // =========================

    loadProducts() {

        try {

            return JSON.parse(localStorage.getItem("products")) || [];

        } catch (error) {

            console.error("خطا در خواندن محصولات", error);

            return [];
        }
    }
}
    // =========================
    // RENDER
    // =========================

    render() {

        this.container.innerHTML = "";

        if (this.products.length === 0) {

            this.container.innerHTML = `
                <div class="empty-products">
                    <h3>هنوز محصولی ثبت نشده است.</h3>
                </div>
            `;

            return;
        }

        const latestProducts = this.getLatestProducts(8);

        const html = latestProducts
            .map(product => this.createProductCard(product))
            .join("");

        this.container.innerHTML = html;
    }

    // =========================
    // GET LATEST PRODUCTS
    // =========================

    getLatestProducts(limit = 8) {

        return [...this.products]
            .sort((a, b) => (b.id || 0) - (a.id || 0))
            .slice(0, limit);
    }
    // =========================
    // PRODUCT CARD
    // =========================

    createProductCard(product) {

        return `
            <div class="product-card">

                <div class="product-image">

                    <img
                        src="${product.image || 'images/product1.jpg'}"
                        alt="${product.name}">

                </div>

                <div class="product-info">

                    <span class="product-category">
                        ${product.category || 'عمومی'}
                    </span>

                    <h3>
                        ${product.name}
                    </h3>

                    <div class="product-price">
                        ${this.formatPrice(product.price)} تومان
                    </div>

                    <div class="product-buttons">

                        <a
                            href="product.html?id=${product.id}"
                            class="product-btn">

                            مشاهده محصول

                        </a>

                    </div>

                </div>

            </div>
        `;
    }

    // =========================
    // FORMAT PRICE
    // =========================

    formatPrice(price) {

        return Number(price || 0).toLocaleString("fa-IR");
    }
}
// =========================
// APP START
// =========================

const featuredProducts = new FeaturedProducts();