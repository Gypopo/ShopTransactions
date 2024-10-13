export class GeneralStats {
    /**
    * @param {number} totalTransactions
    * @param {Array<string>} cashIn
    * @param {Array<string>} cashOut
    */
    constructor(generalStats) {
        this.totalTransactions = generalStats.transactions;
        this.cashIn = generalStats.cashIn;
        this.cashOut = generalStats.cashOut;
    }

    /**
     * @returns {number}
     */
    getTotalTransactions() {
        return this.totalTransactions;
    }

    /**
     * @returns {Array<string>}
     */
    getCashIn() {
        return this.cashIn;
    }

    /**
     * @returns {Array<string>}
     */
    getCashOut() {
        return this.cashOut;
    }
}