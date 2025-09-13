class FarmerResponse {
    constructor(_id, name, age, location, mobile, email, profile_image) {
        this._id = _id;
        this.name = name;
        this.age = age;
        this.location = location;
        this.mobile = mobile;
        this.email = email;
        this.profile_image = profile_image
        // this.crops = [];
        // this.inventory = [];
    }

    // addCrop(cropId, cropName, MRP, stock) {
    //     this.crops.push({ _id: cropId, name: cropName, MRP:MRP, stock: stock });
    // }

    // addInventory(id, name, crop, area, cost, owner){
    //     this.inventory.push({
    //         id: id,
    //         name: name,
    //         crop: crop,
    //         area: area,
    //         cost: cost,
    //         owner: owner
    //     });
    // }
}

module.exports = FarmerResponse;