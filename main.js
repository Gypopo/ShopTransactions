import { API } from "./api.js";
import { Logs } from "./objects/Logs.js";
import { TransactionMode } from "./objects/TransactionMode.js";
import { TransactionType } from "./objects/TransactionType.js";
import { MultipleTransaction } from "./objects/transactions/MultipleTransaction.js";
import { SingleTransaction } from "./objects/transactions/SingleTransaction.js";

var pages = document.getElementById('logs');
var api = new API();
var logs = new Logs();

init();

async function init() {
    setLoading();

    var params = new URLSearchParams(window.location.search);
    if (params.has("id")) {
        try {
            await api.getLogs(params.get('id')).then(v => {
                logs.init(v);
                completeLoading();
            });
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

    var avatarFrame = document.createElement('div');
    avatarFrame.className = 'icon-frame';

    var avatar = document.createElement('img');
    avatar.style.height = '100%';
    avatar.src = 'https://api.creepernation.net/avatar/' + log.player.uuid;
    avatarFrame.appendChild(avatar);

    var column = '<div class="log-item"></div>';

    var contentTop = document.createElement('div');
    contentTop.className = 'log-content';

    var userObj = document.createElement('div');
    userObj.className = 'log-item-user';
    var pName = document.createElement('div');
    pName.innerHTML = " " + log.player.name;

    userObj.appendChild(avatarFrame);
    userObj.appendChild(pName);

    var quantityObj = document.createElement('div');
    quantityObj.className = 'log-item-quantity';
    quantityObj.innerHTML = log.amount;

    var actionObj = document.createElement('div');
    actionObj.className = 'log-item-action';
    actionObj.innerHTML = log.action;

    var typeObj = document.createElement('div');
    typeObj.className = 'log-item-type';
    typeObj.innerHTML = log.type;

    var itemsObj = document.createElement('div');
    itemsObj.className = 'log-item-items';
    itemsObj.innerHTML = log.getItems();

    var pricesObj = document.createElement('div');
    pricesObj.className = 'log-item-prices';
    pricesObj.innerHTML = log.getPrices();


    var gap = '<div></div>';

    contentTop.appendChild(userObj);
    //contentTop.innerHTML = contentTop.innerHTML + gap;
    contentTop.appendChild(quantityObj);
    //contentTop.innerHTML = contentTop.innerHTML + gap;
    contentTop.appendChild(actionObj);
    //contentTop.innerHTML = contentTop.innerHTML + gap;
    contentTop.appendChild(typeObj);

    //contentTop.innerHTML = contentBottom.innerHTML + gap;
    contentTop.appendChild(itemsObj);
    //contentTop.innerHTML = contentBottom.innerHTML + gap;
    //contentTop.innerHTML = contentBottom.innerHTML + gap;
    //contentTop.innerHTML = contentBottom.innerHTML + gap;
    contentTop.appendChild(pricesObj);
    //contentTop.innerHTML = contentBottom.innerHTML + gap;

    container.appendChild(contentTop);
    //container.appendChild(contentBottom);

    //container.innerHTML = container.innerHTML + getTransactionMessage(log);

    return container;
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