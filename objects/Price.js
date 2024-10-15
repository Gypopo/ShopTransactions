export class Price {
    /**
    * @param {string} formatted
    * @param {string} ecoType
    */
    constructor(formatted, ecoType, amount) {
        this.formatted = formatted;
        this.ecoType = ecoType;
        this.amount = amount;
    }

    /**
     * @returns {string}
     */
    getEcoType() {
        return this.ecoType;
    }

    /**
     * @returns {string}
     */
    getFormatted() {
        return this.formatted;
    }
}