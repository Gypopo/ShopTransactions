export class SingleItem {
    /**
    * @param {string} item
    * @param {string} name
    * @param {string} mat
    */
    constructor(name, item, mat) {
        this.name = name;
        this.item = item;
        this.mat = mat;
    }

    /**
     * @returns {string}
     */
    getItem() {
        return this.item;
    }

    /**
     * @returns {string}
     */
    getName() {
        return this.name;
    }

    /**
     * @returns {string}
     */
    getMat() {
        return this.mat;
    }
}