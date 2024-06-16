export class Player {
    /**
    * @param {string} name
    * @param {string} uuid
    */
    constructor(name, uuid) {
        this.name = name;
        this.uuid = uuid;
    }

    /**
     * @returns {string}
     */
    getName() {
        return this.name;
    }

    /**
     * @returns {string}
     */
    getUUID() {
        return this.uuid;
    }
}