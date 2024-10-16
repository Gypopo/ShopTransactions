import { MultipleItem } from "./items/MultipleItem.js";
import { MultipleTransaction } from "./transactions/MultipleTransaction.js";

export class Logs {

    logs;
    dates;
    lastResults; // Log results of previous actions

    // Active filters
    playerFilter = "all";
    amountFilterMin = 1;
    amountFilterMax = 4096;
    actionFilter = "BUY/SELL";
    methodFilter = "ALL";
    itemFilter = "all";
    pricesFilterMin = 0;
    pricesFilterMax = 1000000000;
    currencyFilter = 'ALL';

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

        if (this.actionFilter !== 'BUY/SELL')
            filtered = filtered.filter(log => log.action === this.actionFilter);

        if (this.methodFilter !== 'ALL')
            filtered = filtered.filter(log => log.type === this.methodFilter);

        if (this.itemFilter !== 'all')
            filtered = filtered.filter(log => (log instanceof MultipleTransaction ? log.items.some(item => item.item === this.itemFilter) : log.item.item === this.itemFilter));

        if (this.pricesFilterMin != 0 || this.pricesFilterMax != 1000000000)
            filtered = filtered.filter(log => log.prices.some(price => price.amount >= this.pricesFilterMin && price.amount <= this.pricesFilterMax));

        if (this.currencyFilter !== 'ALL')
            filtered = filtered.filter(log => log.prices.some(price => price.ecoType === this.currencyFilter));

        return this.lastResults = filtered;
    }

    /**
     * @return {Array<Object>}
     */
    get() {
        return this.lastResults = this.logs;
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
        arr.sort();
        arr.unshift("all");

        return new Set(arr);
    }

    getByAmount(min, max) {
        return this.logs.filter(log => log.amount >= min && log.amount <= max);
    }

    getItems() {
        let logsMap = new Map();

        this.logs.forEach(log => {
            if (log instanceof MultipleTransaction) {
                log.items.forEach(item => {
                    if (!logsMap.has(item.item))
                        logsMap.set(item.item, item.name + '(' + item.item + ')');
                });
            } else {
                if (!logsMap.has(log.item.item))
                    logsMap.set(log.item.item, log.item.name + '(' + log.item.item + ')');
            }
        });

        let sorted = Array.from(logsMap.entries()).sort((a, b) => {
            let path1 = a[0].split('.');
            let path2 = b[0].split('.');

            if (path1[0] < path2[0]) return -1;
            if (path1[0] > path2[0]) return 1;

            if (path1[1] < path2[1]) return -1;
            if (path1[1] > path2[1]) return 1;

            return parseInt(path1[3]) - parseInt(path2[3]);
        });

        sorted.unshift(["all", "all"]);

        let sortedItems = new Map();
        let currentSection = null;

        sorted.forEach(([key, value]) => {
            let s = key.split('.')[0];

            if (s !== currentSection) {
                sortedItems.set(s, s);
                currentSection = s;
            }

            sortedItems.set(key, value);
        });

        //sortedItems.forEach(s => console.log(s));

        return sortedItems;
    }

    getCurrencys() {
        var arr = this.logs.flatMap(log => log.prices.flatMap(price => price.ecoType));
        arr.sort();
        arr.unshift("ALL");

        return new Set(arr);
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
        var i = p * this.pageSize - this.pageSize;
        while (logs.size < this.pageSize) {
            logs.add(this.logs.get(i++));
        }
        return logs;
    }

    getSize() {
        return this.logs.length;
    }
}