import { Price } from './objects/Price.js';
import { SingleItem } from './objects/items/SingleItem.js';
import { SingleTransaction } from './objects/transactions/SingleTransaction.js';
import { MultipleTransaction } from './objects/transactions/MultipleTransaction.js';
import { MultipleItem } from './objects/items/MultipleItem.js';
import { Player } from './objects/Player.js';

export class API {

  /**
  * @returns {Promise<Array<Object>>}
  */
  async getLogs(id) {
    var response = await this.fetchWithTimeout(this.API_URL + 'getLogs?id=' + id, {
      method: 'GET',
      timeout: 15000
    });

    var raw = await response.text();
    var map = JSON.parse(raw, (key, value) => this.customReviver(key, value));

    return map;
  }

  async getPlayer(uuid) {
    var response = await this.fetchWithTimeout('https://sessionserver.mojang.com/session/minecraft/profile/' + uuid, {
      method: 'GET',
      timeout: 15000
    });

    var json = await response.json();

    return new Player(json.name, uuid);
  }

  customReviver(key, value) {
    if (typeof value === 'object' && value !== null) {
      // Check if the object has specific keys to determine if it needs to be converted to a CustomObject
      if ('date' in value && 'player' in value && 'prices' in value && 'amount' in value && 'action' in value && 'type' in value) {
        if (Array.isArray(value.items)) {
          return new MultipleTransaction(
            value.date,
            new Player(value.player.name, value.player.uuid),
            value.items.map(item => new MultipleItem(item.amount, item.name, item.item, item.mat)),
            value.prices.map(obj => new Price(obj.formatted, obj.ecoType)),
            value.amount,
            value.action,
            value.type
          );
        } else {
          return new SingleTransaction(
            value.date,
            new Player(value.player.name, value.player.uuid),
            new SingleItem(value.items.name, value.items.item, value.items.mat),
            value.prices.map(obj => new Price(obj.formatted, obj.ecoType)),
            value.amount,
            value.action,
            value.type
          );
        }
      }
    }
    return value;
  }

  recursivelyDeserializePrices(prices) {
    let deserializedPrices = {};
    for (let key in prices) {
      if (prices.hasOwnProperty(key)) {
        deserializedPrices[key] = new Price(
          prices[key].name,
          prices[key].ecoType
        );
      }
    }
    return deserializedPrices;
  }

  priceReviver(key, value) {
    if (Array.isArray(value)) {
        // If the value is an array, map each element to a Price object
        return value.map(obj => new Price(obj.formatted, obj.ecoType));
    }
    // If the value is not an array, return it as is
    return value;
}

  /**
 * @returns {Promise<Array<Object>>}
 */
  async getAvatar(uuid) {
    var response = await this.fetchWithTimeout('https://mc-heads.net/avatar/' + uuid, {
      method: 'GET',
      timeout: 15000
    });

    var raw = await response.text();
    console.log(response.blob);
    console.log(raw);

    return raw;
  }

  /**
  * @returns {Promise<Response>}
  */
  async fetchWithTimeout(resource, options = {}) {
    var { timeout = 8000 } = options;

    var controller = new AbortController();
    var id = setTimeout(() => controller.abort(), timeout);
    var response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);

    return response;
  }

  API_URL = 'http://127.0.0.1:8085/val/'/*'https://api.gpplugins.com:2096/val/'*/;

}