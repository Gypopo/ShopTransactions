import { GeneralStats } from "./stats/GeneralStats.js";
import { TopItems } from "./stats/TopItems.js";
import { TopPlayers } from "./stats/TopPlayers.js";

export class Stats {
    /**
    * @param {GeneralStats} generalStats
    * @param {TopItems} topItems
    * @param {TopPlayers} topPlayers
    */
    constructor(stats) {
        for (var stat of stats) {
            if (Object.keys(stat)[0] === 'generalStats') {
                this.generalStats = new GeneralStats(stat.generalStats);
            } else if (Object.keys(stat)[0] === 'topPlayers') {
                this.topPlayers = new TopPlayers(stat.topPlayers);
            } else if (Object.keys(stat)[0] === 'topItems') {
                this.topItems = new TopItems(stat.topItems);
            }
        }
    }

    /**
     * @returns {GeneralStats}
     */
    getGeneralStats() {
        return this.generalStats;
    }

    /**
     * @returns {TopItems}
     */
    getTopItems() {
        return this.topItems;
    }

    /**
     * @returns {TopPlayers}
     */
    getTopPlayers() {
        return this.topPlayers;
    }
}