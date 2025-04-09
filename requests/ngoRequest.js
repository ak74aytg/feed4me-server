/**
 * @typedef {Object} Location
 * @property {string} address
 * @property {Object} coordinates
 * @property {string} coordinates.type
 * @property {[number, number]} coordinates.coordinates
 */


class NgoRequest{
    /**
     * @param {Location} location
     */
    constructor({
        email, password, contact_person, phone, name, registration_number, focus_area, establishment, location, website
    }){
        this.email = email;
        this.password = password;
        this.contact_person = contact_person;
        this.phone = phone;
        this.name = name;
        this.registration_number = registration_number;
        this.focus_area = focus_area;
        this.establishment = establishment;
        this.location = location;
        this.website = website;
    }
}

module.exports = NgoRequest;