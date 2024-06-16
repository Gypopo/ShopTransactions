export class Price {
    /**
    * @param {string} formatted
    * @param {string} ecoType
    */
    constructor(formatted, ecoType) {
        this.formatted = formatted;
        this.ecoType = ecoType;
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