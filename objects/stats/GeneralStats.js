export class GeneralStats {
    /**
    * @param {number} totalTransactions
    * @param {Array<string>} cashIn
    * @param {Array<string>} cashOut
    */
    constructor(generalStats) {
        for (var object of generalStats) {
            var key = Object.keys(object)[0];
            if (key === 'transactions') {
                this.totalTransactions = object.transactions;
            } else if (key === 'cashIn') {
                this.cashIn = object.cashIn;
            } else if (key === 'cashOut') {
                this.cashOut = object.cashOut;
            }
        }
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