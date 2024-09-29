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

    getHTML() {
        return '<div class="rc-item rc-minecraft_' + (this.item.mat == undefined ? 'unknown' : this.item.mat.toLowerCase()) + '" title="' + this.item.mat + '" style="display: inline-block; vertical-align: top; width: 20px; height: 20px"></div>&nbsp;<div style="display: inline-block; vertical-align: top;" title=' + this.item.item + '>' + this.amount + 'x&nbsp;' + this.item.name + '</div>';
    }
}