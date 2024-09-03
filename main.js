import { API } from "./api.js";
import { Logs } from "./objects/Logs.js";
import { TransactionMode } from "./objects/TransactionMode.js";
import { TransactionType } from "./objects/TransactionType.js";
import { MultipleTransaction } from "./objects/transactions/MultipleTransaction.js";
import { SingleTransaction } from "./objects/transactions/SingleTransaction.js";
import { Nav } from "./nav.js";

var pages = document.getElementById('logs');
var api = new API();
var nav = new Nav();
var logs = new Logs();
var cached_textures = new Map();

init();

async function init() {
    setLoading();

    var params = new URLSearchParams(window.location.search);
    if (params.has("id")) {
        try {
            var rawLogs;
            if (sessionStorage.getItem('logs')) {
                rawLogs = sessionStorage.getItem('logs');
            } else {
                rawLogs = await api.getExported(params.get('id'));
            }
            logs.init(JSON.parse(rawLogs, customReviver));
            completeLoading();
        } catch (e) {
            if (e.name === 'AbortError') {
                alert('A timeout exception occured while trying to reach the backend server, please report this issue to: https://discord.gpplugins.com');
            } else {
                alert('It looks like there was an error while trying to load this page, please report this to our discord at: https://discord.gpplugins.com');
            }
            console.log(e);
        }
    } else {
        alert('Missing ID');
    }
}

var loading = false;

function setLoading() {
    var loaderFrame = document.createElement('div');
    loaderFrame.className = 'loader-frame';
    loaderFrame.id = 'loader';

    var loader = document.createElement('div');
    loader.className = 'loader';

    loaderFrame.appendChild(loader);
    document.getElementById('logs').appendChild(loaderFrame);
    loading = true;
}

async function completeLoading() {
    //var page = createPage(1);

    var loader = document.getElementById('loader')
    loader.remove();

    for (var i in logs.get()) {
        pages.appendChild(createLog(logs.get()[i]));
    }

}

function customReviver(key, value) {
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

/**
 * @param {Number} i
 * @returns {HTMLElement}
 */
function createPage(i) {
    var page = document.createElement('div');
    page.className = 'page';
    page.id = 'page' + i;

    logs.getAll().forEach(log => {
        //console.log(id);
        //console.log(id);
        page.appendChild(cardhelper.createCard(id, card));
    });

    return page;
}

/**
 * @param {Object} log
 * @returns {HTMLElement}
 */
/*
function createLog(log) {
    var container = document.createElement('div');
    container.className = 'log-container';
    //container.id = 'page' + i;

    var avatarFrame = document.createElement('div');
    avatarFrame.className = 'icon-frame';

    var avatar = document.createElement('img');
    avatar.style.height = '100%';
    avatar.src = 'https://api.creepernation.net/avatar/' + log.player.uuid;
    avatarFrame.appendChild(avatar);

    var column = '<div class="log-item"></div>';

    var contentTop = document.createElement('div');
    contentTop.className = 'log-content-top';

    var contentBottom = document.createElement('div');
    contentBottom.className = 'log-content-bottom';

    var userObj = document.createElement('div');
    userObj.className = 'log-item-user';
    userObj.innerHTML = 'Player: ' + log.player.name + " ";
    //userObj.appendChild(avatarFrame);

    var quantityObj = document.createElement('div');
    quantityObj.className = 'log-item-quantity';
    quantityObj.innerHTML = 'Amount: ' + log.amount;

    var actionObj = document.createElement('div');
    actionObj.className = 'log-item-action';
    actionObj.innerHTML = 'Action: ' + log.action;

    var typeObj = document.createElement('div');
    typeObj.className = 'log-item-type';
    typeObj.innerHTML = 'Method: ' + log.type;

    var itemsObj = document.createElement('div');
    itemsObj.className = 'log-item-items';
    itemsObj.innerHTML = 'Items: ' + log.getItems();

    var pricesObj = document.createElement('div');
    pricesObj.className = 'log-item-prices';
    pricesObj.innerHTML = 'Prices: ' + log.getItems();


    var gap = '<div></div>';

    contentTop.appendChild(userObj);
    contentTop.innerHTML = contentTop.innerHTML + gap;
    contentTop.appendChild(quantityObj);
    contentTop.innerHTML = contentTop.innerHTML + gap;
    contentTop.appendChild(actionObj);
    contentTop.innerHTML = contentTop.innerHTML + gap;
    contentTop.appendChild(typeObj);

    contentBottom.innerHTML = contentBottom.innerHTML + gap;
    contentBottom.appendChild(itemsObj);
    contentBottom.innerHTML = contentBottom.innerHTML + gap;
    contentBottom.innerHTML = contentBottom.innerHTML + gap;
    contentBottom.innerHTML = contentBottom.innerHTML + gap;
    contentBottom.appendChild(pricesObj);
    contentBottom.innerHTML = contentBottom.innerHTML + gap;

    container.appendChild(contentTop);
    container.appendChild(contentBottom);

    //container.innerHTML = container.innerHTML + getTransactionMessage(log);

    return container;
}
    */

/**
 * @param {Object} log
 * @returns {HTMLElement}
 */
function createLog(log) {
    var container = document.createElement('div');
    container.className = 'log-container';
    //container.id = 'page' + i;

    var contentTop = document.createElement('div');
    contentTop.className = 'log-content';

    // Player avatar
    var avatarFrame = document.createElement('div');
    avatarFrame.className = 'icon-frame';

    var avatar = document.createElement('img');
    avatar.style.height = '100%';
    avatar.src = 'https://api.creepernation.net/avatar/' + log.player.uuid;
    avatarFrame.appendChild(avatar);

    // Transaction owner
    var userItem = document.createElement('div');
    userItem.className = 'log-item';
    var userObj = document.createElement('div');
    userObj.className = 'log-text log-item-user';
    userObj.appendChild(avatarFrame);
    userObj.innerHTML = userObj.innerHTML + '&nbsp;' + log.player.name;
    userItem.appendChild(userObj);

    // Transaction Amount
    var quantityItem = document.createElement('div');
    quantityItem.className = 'log-item';
    var quantityObj = document.createElement('div');
    quantityObj.className = 'log-text log-item-quantity';
    quantityObj.innerHTML = log.amount;
    quantityItem.appendChild(quantityObj);

    // Transaction type
    var actionItem = document.createElement('div');
    actionItem.className = 'log-item';
    var actionObj = document.createElement('div');
    actionObj.className = 'log-text log-item-action';
    actionObj.innerHTML = log.action;
    actionItem.appendChild(actionObj);

    // Transaction Type
    var typeItem = document.createElement('div');
    typeItem.className = 'log-item';
    var typeObj = document.createElement('div');
    typeObj.className = 'log-text log-item-type';
    typeObj.innerHTML = log.type;
    typeItem.appendChild(typeObj);

    // Transaction item(s)
    var itemsItem = document.createElement('div');
    itemsItem.className = 'log-item';
    var itemsObj = document.createElement('div');
    itemsObj.className = 'log-text log-item-items';
    itemsObj.innerHTML = log.getItems();
    itemsItem.appendChild(itemsObj);

    // Transaction price(s)
    var pricesItem = document.createElement('div');
    pricesItem.className = 'log-item';
    var pricesObj = document.createElement('div');
    pricesObj.className = 'log-text log-item-prices';
    pricesObj.innerHTML = log.getPrices();
    pricesItem.appendChild(pricesObj);

    contentTop.appendChild(userItem);
    contentTop.appendChild(quantityItem);
    contentTop.appendChild(actionItem);
    contentTop.appendChild(typeItem);

    contentTop.appendChild(itemsItem);
    contentTop.appendChild(pricesItem);

    container.appendChild(contentTop);

    //container.style.title = container.innerHTML + getTransactionMessage(log);

    return container;
}

async function setTexture(div, uuid) {
    var texture = await api.getTexture(uuid);
    cached_textures.set(uuid, texture);

    div.src = texture;
}

function getTransactionMessage(log) {
    var transactionMSG;
    if (log instanceof MultipleTransaction) {
        transactionMSG = log.uuid + ' ' + TransactionMode[log.action] + ' ' + log.getItems() + ' for ' + log.getPrices() + ' with the ' + TransactionType[log.type];
    } else if (log instanceof SingleTransaction) {
        transactionMSG = log.uuid + ' ' + TransactionMode[log.action] + ' ' + log.amount + ' x ' + log.getItems() + ' for ' + log.getPrices() + ' with the ' + TransactionType[log.type];
    }

    return transactionMSG;
}