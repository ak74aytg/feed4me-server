/**
 * @typedef {Object} Location
 * @property {string} address
 * @property {Object} coordinates
 * @property {string} coordinates.type
 * @property {[number, number]} coordinates.coordinates
 */


class InventoryRequest {
     /**
     * @param {number} totalQuantity
     * @param {number} pricePerUnit
     * @param {Location} location
     */
    constructor({name, description, crop = 'all', totalQuantity, price, location}){
        this.name = name;
        this.description = description;
        this.crop = crop;
        this.totalQuantity = totalQuantity;
        this.reservedQuantity = 0;
        this.pricePerUnit = price;
        this.owner = null;
        this.takenBy = [];
        this.location = location;
    }
}

module.exports = InventoryRequest;