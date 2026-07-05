class Cart {

    constructor() {

        // عناصر DOM
        this.itemsContainer = document.getElementById("cartItems");
        this.totalElement = document.getElementById("cartTotal");

        // state سبد خرید
        this.cart = this.loadCart();

        this.init();
    }

    // ===========================
    // INIT
    // ===========================

    init() {

        this.normalizeCart();
        this.render();
    }

    // ===========================
    // LOAD CART
    // ===========================

    loadCart() {

        try {

            return JSON.parse(localStorage.getItem("cart")) || [];

        } catch (err) {

            console.error("خطا در خواندن سبد خرید", err);

            return [];
        }
    }

    // ===========================
    // SAVE CART
    // ===========================

    saveCart() {

        localStorage.setItem(
            "cart",
            JSON.stringify(this.cart)
        );
    }

    // ===========================
    // NORMALIZE DATA
    // ===========================

    normalizeCart() {

        this.cart = this.cart.map(item => {

            return {
                ...item,
                quantity: item.quantity || 1
            };
        });
    }
}
    // ===========================
    // RENDER CART
    // ===========================

    render() {

        if (!this.itemsContainer || !this.totalElement) return;

        this.itemsContainer.innerHTML = "";

        if (this.cart.length === 0) {

            this.itemsContainer.innerHTML = `
                <div class="empty-cart">
                    <h2>سبد خرید شما خالی است</h2>
                    <a href="shop.html" class="btn-primary">
                        رفتن به فروشگاه
                    </a>
                </div>
            `;

            this.totalElement.textContent = "0 تومان";

            return;
        }

        let total = 0;

        const html = this.cart.map(item => {

            const price = Number(item.price);
            const subtotal = price * item.quantity;

            total += subtotal;

            return `
                <div class="cart-item">

                    <div class="cart-image">
                        <img src="${item.image || 'images/product1.jpg'}"
                             alt="${item.name}">
                    </div>

                    <div class="cart-info">
                        <h3>${item.name}</h3>
                        <span>${item.category || ''}</span>
                        <p>${price.toLocaleString()} تومان</p>
                    </div>

                    <div class="cart-qty">

                        <button class="qty-btn" data-action="minus" data-id="${item.id}">
                            -
                        </button>

                        <span>${item.quantity}</span>

                        <button class="qty-btn" data-action="plus" data-id="${item.id}">
                            +
                        </button>

                    </div>

                    <button class="delete-btn" data-action="remove" data-id="${item.id}">
                        حذف
                    </button>

                </div>
            `;
        }).join("");

        this.itemsContainer.innerHTML = html;

        this.totalElement.textContent =
            total.toLocaleString() + " تومان";
    }
    // ===========================
    // EVENT HANDLER (PRO)
    // ===========================

    bindEvents() {

        this.itemsContainer.addEventListener("click", (e) => {

            const btn = e.target.closest("[data-action]");

            if (!btn) return;

            const id = Number(btn.dataset.id);
            const action = btn.dataset.action;

            switch (action) {

                case "plus":
                    this.increase(id);
                    break;

                case "minus":
                    this.decrease(id);
                    break;

                case "remove":
                    this.remove(id);
                    break;
            }
        });
    }

    // ===========================
    // INCREASE
    // ===========================

    increase(id) {

        const item = this.cart.find(p => p.id === id);

        if (!item) return;

        item.quantity++;

        this.update();
    }

    // ===========================
    // DECREASE
    // ===========================

    decrease(id) {

        const item = this.cart.find(p => p.id === id);

        if (!item) return;

        if (item.quantity > 1) {

            item.quantity--;

        } else {

            this.remove(id);

            return;
        }

        this.update();
    }

    // ===========================
    // REMOVE ITEM
    // ===========================

    remove(id) {

        const ok = confirm("این محصول حذف شود؟");

        if (!ok) return;

        this.cart = this.cart.filter(p => p.id !== id);

        this.update();
    }

    // ===========================
    // UPDATE
    // ===========================

    update() {

        this.saveCart();
        this.render();
    }
}
    // ===========================
    // START APP
    // ===========================

}

// اجرای سبد خرید
const cartApp = new Cart();