import { TopPlayer } from "./TopPlayer.js";

export class TopPlayers {
    /**
    * @param {Array<TopPlayer>} PBM
    * @param {Array<TopPlayer>} PBW
    * @param {Array<TopPlayer>} PBD
    * 
    * @param {Array<TopPlayer>} PSM
    * @param {Array<TopPlayer>} PSW
    * @param {Array<TopPlayer>} PSD
    */
    constructor(topPlayers) {
        for (var object of topPlayers) {
            var key = Object.keys(object)[0];
            if (key === 'PBM') {
                this.PBM = this.getTopPlayers(object.PBM);
            } else if (key === 'PBW') {
                this.PBW = this.getTopPlayers(object.PBW);
            } else if (key === 'PBD') {
                this.PBD = this.getTopPlayers(object.PBD);
            } else if (key === 'PSM') {
                this.PSM = this.getTopPlayers(object.PSM);
            } else if (key === 'PSW') {
                this.PSW = this.getTopPlayers(object.PSW);
            } else if (key === 'PSD') {
                this.PSD = this.getTopPlayers(object.PSD);
            }
        }
    }

    getTopPlayers(players) {
        var array = new Array();
        for (var player of players) {
            array.push(new TopPlayer(player.player, player.amount));
        }

        return array;
    }
}