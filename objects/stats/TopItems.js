import { TopItem } from "./TopItem.js";

export class TopItems {
    /**
    * @param {Array<TopItem>} IBM
    * @param {Array<TopItem>} IBW
    * @param {Array<TopItem>} IBD
    * 
    * @param {Array<TopItem>} ISM
    * @param {Array<TopItem>} ISW
    * @param {Array<TopItem>} ISD
    */
    constructor(topItems) {
        for (var object of topItems) {
            var key = Object.keys(object)[0];
            if (key === 'IBM') {
                this.IBM = this.getTopItems(object.IBM);
            } else if (key === 'IBW') {
                this.IBW = this.getTopItems(object.IBW);
            } else if (key === 'IBD') {
                this.IBD = this.getTopItems(object.IBD);
            } else if (key === 'ISM') {
                this.ISM = this.getTopItems(object.ISM);
            } else if (key === 'ISW') {
                this.ISW = this.getTopItems(object.ISW);
            } else if (key === 'ISD') {
                this.ISD = this.getTopItems(object.ISD);
            }
        }
    
    }

    getTopItems(items) {
        var array = new Array();
        for (var item of items) {
            array.push(new TopItem(item.item, item.amount));
        }

        return array;
    }
}