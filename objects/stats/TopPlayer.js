import { Player } from "../Player.js";

export class TopPlayer {
    /**
    * @param {Player} player
    * @param {number} amount
    */
    constructor(player, amount) {
        this.player = player;
        this.amount = amount;
    }
}