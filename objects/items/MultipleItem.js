export class MultipleItem {
    /**
    * @param {number} amount
    * @param {string} item
    * @param {string} name
    * @param {string} mat
    */
    constructor(amount, name, item, mat) {
        this.amount = amount;
        this.name = name;
        this.item = item;
        this.mat = mat;
    }

    /**
     * @returns {number}
     */
    getAmount() {
        return this.amount;
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