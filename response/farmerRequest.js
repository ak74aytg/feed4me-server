class FarmerResponse {
    constructor(name, age, location, mobile, email) {
        this.name = name;
        this.age = age;
        this.location = location;
        this.mobile = mobile;
        this.email = email;
        this.crops = [];
        this.customers = [];
    }

    addCrop(cropName, MRP, stock) {
        this.crops.push({ name: cropName, MRP:MRP, stock: stock });
    }

    addCustomer(customerName) {
        this.customers.push({ name: customerName });
    }
}

module.exports = FarmerResponse;