export class Logs {

    logs;
    dates;

     // Active filters
     playerFilter = "all";
     amountFilterMin = 1;
     amountFilterMax = 4096;
 
     /**
     * @param {Array<Object>} logs
     * @param {Array<SimpleMonth>} dates
     */
     init(logs, dates) {
         this.logs = logs;
         this.dates = dates;
     }
 
     getAndFilter() {
         var filtered = this.logs;
 
         if (this.playerFilter !== 'all')
             filtered = filtered.filter(log => log.player.name === this.playerFilter);
 
         if (this.amountFilterMin != 1 || this.amountFilterMax != 4096)
             filtered = filtered.filter(log => log.amount >= this.amountFilterMin && log.amount <= this.amountFilterMax);

         return filtered;
     }

    /**
     * @return {Array<Object>}
     */
    get() {
        return this.logs;
    }

    /**
     * @param {string} id
     * @return {Card}
     */
    getByAuthor(id) {
        return Array.from(this.cards).filter(function ([id, card]) {
            return card.getAuthor().isDiscord() && card.getAuthor().getData() === id;
        });
    }

    getByPlayer(name) {
        return this.logs.filter(log => log.player.name === name);
    }

    getPlayers() {
        var arr = this.logs.map(log => log.player.name);
        arr.unshift("all");

        return new Set(arr);
    }

    getByAmount(min, max) {
        return this.logs.filter(log => log.amount >= min && log.amount <= max);
    }

    /**
     * @param {string} id
     * @param {Card} card
     */
    add(id, card) {
        this.cards.set(id, card);
    }

    /**
     * @param {number} p
     * @param {SearchResults} filter
     * @return {Array<Object>}
     */
    getPage(p, filter) {
        var logs = new Array();
        var i = p*this.pageSize-this.pageSize;
        while (logs.size < this.pageSize) {
            logs.add(this.logs.get(i++));
        }
        return logs;
    }
}