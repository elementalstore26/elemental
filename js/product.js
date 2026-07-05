class ProductPage {

    constructor() {

        // state
        this.products = this.loadProducts();
        this.cart = this.loadCart();

        // DOM
        this.ui = {
            image: document.getElementById("productImage"),
            category: document.getElementById("productCategory"),
            name: document.getElementById("productName"),
            price: document.getElementById("productPrice"),
            description: document.getElementById("productDescription"),
            stock: document.getElementById("productStock"),
            addToCart: document.getElementById("addToCart"),
            related: document.getElementById("relatedProducts"),
        };

        this.productId = this.getProductId();

        this.init();
    }

    // =========================
    // INIT
    // =========================

    init() {

        this.product = this.getProduct();

        if (!this.product) {

            this.renderNotFound();

            return;
        }

        this.renderProduct();
        this.renderRelated();
        this.bindEvents();
    }

    // =========================
    // LOAD DATA
    // =========================

    loadProducts() {

        try {

            return JSON.parse(localStorage.getItem("products")) || [];

        } catch {

            return [];
        }
    }

    loadCart() {

        try {

            return JSON.parse(localStorage.getItem("cart")) || [];

        } catch {

            return [];
        }
    }

    getProductId() {

        const params = new URLSearchParams(window.location.search);

        return Number(params.get("id"));
    }

    getProduct() {

        return this.products.find(p => p.id === this.productId);
    }
}
    // =========================
    // NOT FOUND
    // =========================

    renderNotFound() {

        document.querySelector(".product-details").innerHTML = `
            <div class="empty-products">
                <h2>محصول مورد نظر پیدا نشد.</h2>
                <a href="shop.html" class="btn-primary">بازگشت به فروشگاه</a>
            </div>
        `;
    }

    // =========================
    // PRODUCT UI
    // =========================

    renderProduct() {

        const p = this.product;

        this.ui.image.src = p.image || "images/product1.jpg";
        this.ui.image.alt = p.name;

        this.ui.category.textContent = p.category || "عمومی";
        this.ui.name.textContent = p.name;

        this.ui.price.textContent =
            this.formatPrice(p.price) + " تومان";

        this.ui.description.textContent =
            p.description || "بدون توضیحات";

        this.renderStock();
    }

    renderStock() {

        const stock = Number(this.product.stock || 0);

        if (stock > 0) {

            this.ui.stock.textContent = `موجودی: ${stock} عدد`;

        } else {

            this.ui.stock.textContent = "ناموجود";

            this.ui.addToCart.disabled = true;

            this.ui.addToCart.textContent = "ناموجود";
        }
    }
    // =========================
    // CART
    // =========================

    bindEvents() {

        this.ui.addToCart.addEventListener("click", () => {

            this.addToCart();
        });
    }

    addToCart() {

        const existing = this.cart.find(
            item => item.id === this.product.id
        );

        if (existing) {

            existing.quantity++;

        } else {

            this.cart.push({
                id: this.product.id,
                name: this.product.name,
                price: this.product.price,
                category: this.product.category,
                stock: this.product.stock,
                quantity: 1
            });
        }

        this.saveCart();

        alert("محصول به سبد خرید اضافه شد.");
    }

    saveCart() {

        localStorage.setItem(
            "cart",
            JSON.stringify(this.cart)
        );
    }
    // =========================
    // RELATED PRODUCTS
    // =========================

    renderRelated() {

        const related = this.products
            .filter(p =>
                p.category === this.product.category &&
                p.id !== this.product.id
            )
            .slice(0, 4);

        this.ui.related.innerHTML = "";

        if (!related.length) return;

        this.ui.related.innerHTML = related
            .map(p => this.createCard(p))
            .join("");
    }

    createCard(product) {

        return `
            <div class="product-card">

                <div class="product-image">
                    <img src="${product.image || 'images/product1.jpg'}"
                         alt="${product.name}">
                </div>

                <div class="product-info">

                    <span class="product-category">
                        ${product.category}
                    </span>

                    <h3>${product.name}</h3>

                    <div class="product-price">
                        ${this.formatPrice(product.price)} تومان
                    </div>

                    <a href="product.html?id=${product.id}"
                       class="product-btn">
                        مشاهده محصول
                    </a>

                </div>

            </div>
        `;
    }

    // =========================
    // FORMAT
    // =========================

    formatPrice(price) {

        return Number(price || 0).toLocaleString("fa-IR");
    }
}

// =========================
// START APP
// =========================

new ProductPage();