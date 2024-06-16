import { MultipleItem } from "../items/MultipleItem.js";
import { Price } from "../Price.js";

export class MultipleTransaction {
    /**
    * @param {number} date
    * @param {Player} player
    * @param {Array<MultipleItem>} items
    * @param {Array<Price>} prices
    * @param {number} amount
    * @param {string} action
    * @param {string} type
    */
    constructor(date, player, items, prices, amount, action, type) {
        this.date = date;
        this.player = player;
        this.items = items;
        this.prices = prices;
        this.amount = amount;
        this.action = action;
        this.type = type;
    }

    /**
     * @returns {number}
     */
    getDate() {
        return this.date;
    }

    /**
     * @returns {string}
     */
    getUUID() {
        return this.uuid;
    }

    /**
     * @returns {string}
     */
    getItems() {
        var msg = '';
        var i = 0;
        for (var item of this.items) {
            msg += item.amount + 'x <a title=' + item.item + '>' + item.name + '</a>';

            if (i != this.items.length-1) msg += ", ";
            i++;
        }
        return msg;
    }

    /**
     * @returns {string}
     */
    getPrices() {
        var msg = '';
        var i = 0;
        for (var price of this.prices) {
            msg += '<a title=' + price.ecoType + '>' + price.formatted + '</a>';

            if (i != this.prices.length-1) msg += ", ";
            i++;
        }
        return msg;
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
    getAction() {
        return this.action;
    }

    /**
     * @returns {string}
     */
    getType() {
        return this.type;
    }
}