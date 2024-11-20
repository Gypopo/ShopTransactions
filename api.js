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
  async getExported(id, type) {
    var response = await this.fetchWithTimeout(this.API_URL + 'getLogs?id=' + id, {
      method: 'GET',
      timeout: 15000
    });

    if (response.status == 404)
      return null;

    var raw = await response.text();
    var json = JSON.parse(raw);

    return json;
  }

  async getPlayer(uuid) {
    var response = await this.fetchWithTimeout('https://sessionserver.mojang.com/session/minecraft/profile/' + uuid, {
      method: 'GET',
      timeout: 15000
    });

    var json = await response.json();

    return new Player(json.name, uuid);
  }

  async getTexture(uuid) {
    try {
      var response = await this.fetchWithTimeout('https://crafthead.net/helm/' + uuid, {
        method: 'GET',
        timeout: 15000
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve skull texture for player ' + uuid);
      }

      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = () => {
          reject(new Error('Failed to read blob as Data URL'));
        };

        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Failed to retrieve skull texture for player ' + uuid, error);
      throw error;
    }
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