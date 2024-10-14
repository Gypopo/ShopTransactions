import { API } from "./api.js";
import { Logs } from "./objects/Logs.js";
import { TransactionMode } from "./objects/TransactionMode.js";
import { TransactionType } from "./objects/TransactionType.js";
import { MultipleTransaction } from "./objects/transactions/MultipleTransaction.js";
import { SingleTransaction } from "./objects/transactions/SingleTransaction.js";
import { Nav } from "./nav.js";
import { Player } from "./objects/Player.js";
import { SingleItem } from "./objects/items/SingleItem.js";
import { MultipleItem } from "./objects/items/MultipleItem.js";
import { Price } from "./objects/Price.js";

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
            var exported = await api.getExported(params.get('id'));
            var raw = JSON.stringify(exported.logs);

            logs.init(JSON.parse(raw, customReviver));

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

var timeOffset = new Date().getTimezoneOffset() * 60 * 1000;

async function completeLoading() {
    loadFilters();
    registerFilters();
    //var page = createPage(1);

    var loader = document.getElementById('loader')
    loader.remove();

    splitLogsByDate(logs.get());
}

async function splitLogsByDate(logs) {
    const oneDay = 86400000;
    var today = new Date();
    today.setHours(12, 0, 0, 0);
    var prevDate = today.getTime() - timeOffset;

    var title = false;
    for (var log of logs) {
        var date = log.date - timeOffset;

        // Check if the log is from today or a previous day
        if (date <= prevDate) {
            if (date > (prevDate - oneDay)) {
                if (!title) {
                    var formatted = formatDate(today);
                    var container = document.createElement('div');
                    container.className = 'time-container';

                    container.innerHTML = formatted + '<hr style="border: 2px solid black; background-color: black;">';
                    pages.appendChild(container);

                    title = true;
                }

                var ele = await createLog(log);
                pages.appendChild(ele);
            } else {
                const dayDiff = Math.floor((prevDate - date) / oneDay); // The amount of full days which passed without transactions
                today.setDate(today.getDate() - dayDiff);
                prevDate = today.getTime() - timeOffset;
                title = false;

                if (!title) {
                    var formatted = formatDate(today);
                    var container = document.createElement('div');
                    container.className = 'time-container';

                    container.innerHTML = formatted + '<div class="seperator"><hr style="border: 2px solid black; background-color: black;"></div>';
                    pages.appendChild(container);

                    title = true;
                }

                var ele = await createLog(log);
                pages.appendChild(ele);
            }
        }
    }
}

function formatDate(date) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const formatStrippedDate = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

    if (formatStrippedDate(date).getTime() === formatStrippedDate(today).getTime()) {
        return "Today";
    }
    else if (formatStrippedDate(date).getTime() === formatStrippedDate(yesterday).getTime()) {
        return "Yesterday";
    }
    else {
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        return date.toLocaleDateString(undefined, options);
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

function registerFilters() {
    // Player filter
    const playerFilter = document.getElementById('player-filter');

    playerFilter.addEventListener('change', function (event) {
        logs.playerFilter = event.target.value;

        pages.innerHTML = '';
        splitLogsByDate(logs.getAndFilter());
    });

    // Amount filter toggler
    const filterTogglers = document.querySelectorAll('.filter-toggler');
    filterTogglers.forEach(toggler => {
        console.log(toggler.dataset.filterType)
        const sliderContainer = document.getElementById(toggler.dataset.filterType + "-slider-container");
        toggler.addEventListener("click", function () {
            if (sliderContainer.style.display === 'none') {
                sliderContainer.style.display = 'block';

                const sliderCanceller = document.createElement('div');
                sliderCanceller.className = 'slider-canceller';
                sliderCanceller.id = 'slider-canceller';
                document.body.appendChild(sliderCanceller);
                sliderCanceller.addEventListener("click", function (e) {
                    if (e.target != sliderContainer) {
                        sliderContainer.style.display = 'none';
                        document.body.removeChild(sliderCanceller);
                    }
                });
            } else {
                sliderContainer.style.display = 'none';
                document.getElementById("slider-canceller").remove();
            }
        });
    });

    // Amount filter
    const minSlider = document.getElementById("amt-slider1");
    const maxSlider = document.getElementById("amt-slider2");

    minSlider.addEventListener("input", function () {
        updateAmountSlider('min');
    });

    maxSlider.addEventListener("input", function () {
        updateAmountSlider('max');
    });

    // Action filter
    const actionFilter = document.getElementById('action-filter');

    actionFilter.addEventListener('change', function (event) {
        logs.actionFilter = event.target.value;

        pages.innerHTML = '';
        splitLogsByDate(logs.getAndFilter());
    });

    // Method filter
    const methodFilter = document.getElementById('method-filter');

    methodFilter.addEventListener('change', function (event) {
        logs.methodFilter = event.target.value;

        pages.innerHTML = '';
        splitLogsByDate(logs.getAndFilter());
    });

    // Item filter
    const itemFilter = document.getElementById('item-filter');

    itemFilter.addEventListener('change', function (event) {
        logs.itemFilter = event.target.value;

        pages.innerHTML = '';
        splitLogsByDate(logs.getAndFilter());
    });

    // Prices filter
    document.getElementById("price-slider1").addEventListener("input", function () {
        updatePricesSlider('min');
    });

    document.getElementById("price-slider2").addEventListener("input", function () {
        updatePricesSlider('max');
    });
}

function updateAmountSlider(sliderType) {
    const minSlider = document.getElementById("amt-slider1");
    const maxSlider = document.getElementById("amt-slider2");

    var min = parseInt(minSlider.value);
    var max = parseInt(maxSlider.value);

    if (sliderType === 'min') {
        if (min >= max) {
            minSlider.value = max;
            min = max;
        }
    } else {
        if (max <= min) {
            maxSlider.value = min;
            max = min;
        }
    }

    let finalMin = min <= 64 ? min : (min > 64 ? 0 : 64) + (min - 64) * 64;
    let finalMax = max <= 64 ? max : (max > 64 ? 0 : 64) + (max - 64) * 64;

    document.getElementById('amt-slider-value').textContent = `Amount: ${finalMin} - ${finalMax}`;

    const range = minSlider.max - minSlider.min;
    const minPercent = ((min - minSlider.min) / range) * 100;
    const maxPercent = ((max - maxSlider.min) / range) * 100;

    minSlider.style.background = `linear-gradient(to right, #ccc ${minPercent}%, blue ${minPercent}%, blue ${maxPercent}%, #ccc ${maxPercent}%)`;

        logs.amountFilterMin = finalMin;
        logs.amountFilterMax = finalMax;

        setTimeout(function () {
            if (finalMin == logs.amountFilterMin && finalMax == logs.amountFilterMax) {
                pages.innerHTML = '';
                splitLogsByDate(logs.getAndFilter());
            }
        }, 2000);
}

function updatePricesSlider(sliderType) {
    const minSlider = document.getElementById("price-slider1");
    const maxSlider = document.getElementById("price-slider2");

    var min = parseInt(minSlider.value);
    var max = parseInt(maxSlider.value);

    if (sliderType === 'min') {
        if (min >= max) {
            minSlider.value = max;
            min = max;
        }
    } else {
        if (max <= min) {
            maxSlider.value = min;
            max = min;
        }
    }

    let finalMin = pricesIncrement(min);
    let finalMax = pricesIncrement(max);

    document.getElementById('price-slider-value').textContent = `Price range: ${getFormatted(finalMin)}$ - ${getFormatted(finalMax)}$`;

    const range = minSlider.max - minSlider.min;
    const minPercent = ((min - minSlider.min) / range) * 100;
    const maxPercent = ((max - maxSlider.min) / range) * 100;

    minSlider.style.background = `linear-gradient(to right, #ccc ${minPercent}%, blue ${minPercent}%, blue ${maxPercent}%, #ccc ${maxPercent}%)`;

    logs.pricesFilterMin = finalMin;
    logs.pricesFilterMax = finalMax;

    setTimeout(function () {
        if (finalMin == logs.pricesFilterMin && finalMax == logs.pricesFilterMax) {
            pages.innerHTML = '';
            splitLogsByDate(logs.getAndFilter());
        }
    }, 2000);
}

function pricesIncrement(i) {
    if (i == 0)
        return 0;
    
    if (i <= 10) {
        return i * 10; // Increments of 10 for n <= 10
    } else {
        // Calculate the power of ten based on how many ranges have passed
        const range = Math.floor((i - 10) / 10);
        const baseIncrement = Math.pow(10, range + 2); // 10^2 = 100, 10^3 = 1000, etc.
        
        // Calculate the increment for the current range
        const incrementInCurrentRange = baseIncrement * ((i % 10) || 1); // Ensure at least 1 for increments
        return baseIncrement + incrementInCurrentRange; // Base + Increment for the range
    }
}

function getFormatted(i) {
    if (i == 0)
        return i;
    // Define the suffixes for thousands, millions, billions, etc.
    const suffixes = ["", "k", "M", "B", "T"];
    // Determine the order of magnitude of the number
    const order = Math.floor(Math.log10(Math.abs(i)) / 3);
    // Determine the suffix based on the order of magnitude
    const suffix = suffixes[order] || '';
    // Calculate the short number by dividing the original number by 1000^order
    const shortNumber = i / Math.pow(10, order * 3);
    // Format the short number to one decimal place and add the suffix
    return shortNumber % 1 === 0
        ? shortNumber + suffix
        : shortNumber.toFixed(1) + suffix;
}

function loadFilters() {
    const playerFilter = document.getElementById('player-filter');

    var players = '';
    for (const p of logs.getPlayers()) {
        players += '<option value="' + p + '">' + p + '</option>';
    }
    playerFilter.innerHTML = players;

    const itemFilter = document.getElementById('item-filter');

    var items = '';
    var s = 0;
    for (let [key, value] of logs.getItems()) {
        if (!key.includes('.') && key !== "all") {
            if (s != 0)
                items += '</optgroup>';

            items += `<optgroup label="${key}">`
            s++;
        } else {
            items += `<option value='${key}'>${value}</option>`;
        }
    }
    itemFilter.innerHTML = items;
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
async function createLog(log) {
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
    //avatar.src = 'https://api.creepernation.net/avatar/' + log.player.uuid;
    var texture = await getTexture(log.player.uuid);
    avatar.src = texture;
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

async function getTexture(uuid) {
    var texture = cached_textures.get(uuid);
    if (!texture) {
        texture = 'null'/*await api.getTexture(uuid)*/;
        cached_textures.set(uuid, texture);
    }

    return texture;
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