import { Player } from "../Player.js";

export class TopPlayer {
    /**
    * @param {Player} player
    * @param {number} amount
    */
    constructor(player, amount) {
        this.player = new Player(player.name, player.uuid);
        this.amount = amount;
    }

    getHTML() {
        return '<div class="icon-frame">' +
                    '<img height="100%" src="https://crafthead.net/helm/' + this.player.uuid + '">' +
                    '</img>' +
                '</div>' +
                '&nbsp;' +
                this.player.name + ' - ' + this.amount;
    }
}