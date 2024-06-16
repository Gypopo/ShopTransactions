export class Logs {

    pageSize;
    logs;

    /**
     * @param {Array<Object>} logs
     */
    init(logs) {
        this.logs = logs;
        this.pageSize = 5;
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