import { SingleItem } from "../items/SingleItem.js";
import { Player } from "../Player.js";
import { Price } from "../Price.js";

export class SingleTransaction {
    /**
    * @param {number} date
    * @param {Player} player
    * @param {SingleItem} item
    * @param {Array<Price>} prices
    * @param {number} amount
    * @param {string} action
    * @param {string} type
    */
    constructor(date, player, item, prices, amount, action, type) {
        this.date = date;
        this.player = player;
        this.item = item;
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
        return '<div class="rc-item rc-minecraft_' + this.item.mat.toLowerCase() + '" style="width: 20px; height: 20px"></div>' + this.amount + 'x <a title=' + this.item.item + '>' + this.item.name + '</a>';
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