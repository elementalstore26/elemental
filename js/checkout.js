// =============================
// checkout.js
// =============================

const checkoutItems = document.getElementById("checkoutItems");
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutForm = document.getElementById("checkoutForm");

// محصولات و سبد خرید
let products =
JSON.parse(localStorage.getItem("products")) || [];

let cart =
JSON.parse(localStorage.getItem("cart")) || [];

let orders =
JSON.parse(localStorage.getItem("orders")) || [];

// -----------------------------
// نمایش محصولات
// -----------------------------

function renderCheckout(){

    if(cart.length === 0){

        checkoutItems.innerHTML = `

        <p>

            سبد خرید خالی است.

        </p>

        `;

        checkoutSubtotal.textContent = "0 تومان";
        checkoutTotal.textContent = "0 تومان";

        return;

    }

    checkoutItems.innerHTML = "";

    let total = 0;

    cart.forEach(product=>{

        const price =
        Number(product.price);

        const quantity =
        Number(product.quantity);

        total +=
        price * quantity;

        checkoutItems.innerHTML += `

        <div class="checkout-item">

            <div>

                <strong>

                    ${product.name}

                </strong>

                <br>

                <small>

                    ${quantity} عدد

                </small>

            </div>

            <div>

                ${(price * quantity).toLocaleString()} تومان

            </div>

        </div>

        `;

    });

    checkoutSubtotal.textContent =
    total.toLocaleString() + " تومان";

    checkoutTotal.textContent =
    total.toLocaleString() + " تومان";

}

renderCheckout();

// -----------------------------
// ثبت سفارش
// -----------------------------

checkoutForm.addEventListener("submit",function(e){

    e.preventDefault();

    if(cart.length === 0){

        alert("سبد خرید خالی است.");

        return;

    }

    const customerName =
    document.getElementById("customerName").value.trim();

    const customerPhone =
    document.getElementById("customerPhone").value.trim();

    const customerProvince =
    document.getElementById("customerProvince").value.trim();

    const customerCity =
    document.getElementById("customerCity").value.trim();

    const customerAddress =
    document.getElementById("customerAddress").value.trim();

    const customerPostalCode =
    document.getElementById("customerPostalCode").value.trim();

    const customerNote =
    document.getElementById("customerNote").value.trim();

    if(

        !customerName ||

        !customerPhone ||

        !customerProvince ||

        !customerCity ||

        !customerAddress ||

        !customerPostalCode

    ){

        alert("تمام اطلاعات الزامی را وارد کنید.");

        return;

    }

    // بررسی موجودی

    for(const cartItem of cart){

        const product =
        products.find(item=>item.id == cartItem.id);

        if(!product){

            alert(cartItem.name + " پیدا نشد.");

            return;

        }

        if(

            Number(product.stock) <

            Number(cartItem.quantity)

        ){

            alert(

                "موجودی "

                + product.name +

                " کافی نیست."

            );

            return;

        }

    }

    // کم کردن موجودی

    cart.forEach(cartItem=>{

        const product =
        products.find(item=>item.id == cartItem.id);

        product.stock =

        Number(product.stock)

        -

        Number(cartItem.quantity);

    });

    // مبلغ

    let total = 0;

    cart.forEach(item=>{

        total +=

        Number(item.price)

        *

        Number(item.quantity);

    });

    // ثبت سفارش

    const order = {

        id: Date.now(),

        date: new Date().toLocaleString("fa-IR"),

        customerName,

        customerPhone,

        customerProvince,

        customerCity,

        customerAddress,

        customerPostalCode,

        customerNote,

        total,

        status:"در انتظار بررسی",

        items:[...cart]

    };

    orders.push(order);

    // ذخیره

    localStorage.setItem(

        "orders",

        JSON.stringify(orders)

    );

    localStorage.setItem(

        "products",

        JSON.stringify(products)

    );

    localStorage.removeItem("cart");

    alert("سفارش با موفقیت ثبت شد.");

    window.location.href =

    "success.html";

});
    // =========================
    // RENDER CHECKOUT
    // =========================

    render() {

        if (!this.itemsContainer) return;

        if (this.cart.length === 0) {

            this.itemsContainer.innerHTML = `
                <p class="empty">
                    سبد خرید خالی است
                </p>
            `;

            this.updateTotals(0);

            return;
        }

        let total = 0;

        this.itemsContainer.innerHTML = this.cart.map(item => {

            const price = Number(item.price);
            const qty = Number(item.quantity);
            const subtotal = price * qty;

            total += subtotal;

            return `
                <div class="checkout-item">

                    <div>
                        <strong>${item.name}</strong>
                        <br>
                        <small>${qty} عدد</small>
                    </div>

                    <div>
                        ${subtotal.toLocaleString()} تومان
                    </div>

                </div>
            `;
        }).join("");

        this.updateTotals(total);
    }

    // =========================
    // TOTALS
    // =========================

    updateTotals(total) {

        this.subtotalEl.textContent =
            total.toLocaleString() + " تومان";

        this.totalEl.textContent =
            total.toLocaleString() + " تومان";
    }
    // =========================
    // EVENTS
    // =========================

    bindEvents() {

        if (!this.form) return;

        this.form.addEventListener("submit", (e) => {

            e.preventDefault();

            this.createOrder();
        });
    }

    // =========================
    // CREATE ORDER
    // =========================

    createOrder() {

        if (this.cart.length === 0) {

            alert("سبد خرید خالی است");
            return;
        }

        const formData = this.getFormData();

        if (!this.validate(formData)) return;

        if (!this.checkStock()) return;

        const total = this.calculateTotal();

        const order = this.buildOrder(formData, total);

        this.saveOrder(order);

        this.updateStock();

        this.clearCart();

        alert("سفارش با موفقیت ثبت شد");

        window.location.href = "success.html";
    }
    // =========================
    // FORM DATA
    // =========================

    getFormData() {

        return {

            name: document.getElementById("customerName").value.trim(),
            phone: document.getElementById("customerPhone").value.trim(),
            province: document.getElementById("customerProvince").value.trim(),
            city: document.getElementById("customerCity").value.trim(),
            address: document.getElementById("customerAddress").value.trim(),
            postal: document.getElementById("customerPostalCode").value.trim(),
            note: document.getElementById("customerNote").value.trim()
        };
    }

    // =========================
    // VALIDATION
    // =========================

    validate(data) {

        const required = Object.entries(data)
            .filter(([k]) => k !== "note");

        for (let [key, value] of required) {

            if (!value) {

                alert("لطفاً تمام فیلدهای ضروری را پر کنید");
                return false;
            }
        }

        return true;
    }

    // =========================
    // STOCK CHECK
    // =========================

    checkStock() {

        for (let item of this.cart) {

            const product = this.products.find(p => p.id == item.id);

            if (!product) {

                alert("محصول یافت نشد: " + item.name);
                return false;
            }

            if (Number(product.stock) < Number(item.quantity)) {

                alert("موجودی کافی نیست: " + product.name);
                return false;
            }
        }

        return true;
    }

    // =========================
    // TOTAL CALC
    // =========================

    calculateTotal() {

        return this.cart.reduce((sum, item) => {

            return sum + (item.price * item.quantity);

        }, 0);
    }

    // =========================
    // ORDER BUILDER
    // =========================

    buildOrder(data, total) {

        return {

            id: Date.now(),
            date: new Date().toLocaleString("fa-IR"),

            customer: data,
            items: [...this.cart],
            total,
            status: "در انتظار بررسی"
        };
    }
