class DashboardStats {

    constructor() {

        this.products = [];
        this.init();
    }

    init() {

        this.load();
    }

    load() {

        try {

            this.products = JSON.parse(
                localStorage.getItem("products")
            ) || [];

        } catch (e) {

            this.products = [];
        }

        this.render();
    }

    render() {

        this.updateProductsCount();
        this.updateOrdersCount?.();
    }

    updateProductsCount() {

        const el = document.getElementById("productsCount");

        if (el) {

            el.textContent = this.products.length;
        }
    }
}

const dashboardStats = new DashboardStats();