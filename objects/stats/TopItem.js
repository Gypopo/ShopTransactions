import { SingleItem } from "../items/SingleItem.js";

export class TopItem {
    /**
    * @param {SingleItem} item
    * @param {number} amount
    */
    constructor(item, amount) {
        this.item = new SingleItem(item.name, item.item, item.mat);
        this.amount = amount;
    }
}