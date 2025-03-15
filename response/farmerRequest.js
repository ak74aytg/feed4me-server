class FarmerResponse {
    constructor(name, age, location, mobile, email) {
        this.name = name;
        this.age = age;
        this.location = location;
        this.mobile = mobile;
        this.email = email;
        this.crops = [];
        this.customers = [];
        this.inventory = [];
    }

    addCrop(cropName, MRP, stock) {
        this.crops.push({ name: cropName, MRP:MRP, stock: stock });
    }

    addCustomer(customerName) {
        this.customers.push({ name: customerName });
    }

    addInventory(id, name, crop, area, cost, owner){
        this.inventory.push({
            id: id,
            name: name,
            crop: crop,
            area: area,
            cost: cost,
            owner: owner
        });
    }
}

module.exports = FarmerResponse;