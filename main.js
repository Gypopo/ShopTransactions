import { API } from "./api.js";
import { LogManager } from "./logManager.js";
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
var logManager = new LogManager();

init();

async function init() {
    setLoading();

    var params = new URLSearchParams(window.location.search);
    if (params.has("id")) {
        try {
            var exported = await api.getExported(params.get('id'));
            if (exported != null) {
                var raw = JSON.stringify(exported.logs);
                logManager.init(JSON.parse(raw, customReviver), null, api);

                completeLoading();
            } else alert('Log ID not found or expired, check the link and try again');
        } catch (e) {
            if (e.name.includes('404')) {
                alert('Log ID not found or expired, check the link and try again');
            } else if (e.name === 'AbortError') {
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
    loadFilters();
    registerFilters();
    const logsListener = document.getElementById('logs');

    // Add a one central click event to the parent to listern for log clicks
    logsListener.addEventListener('click', function (event) {
        const log = event.target.closest('.log-container');
        if (log) {
            const overlay = document.createElement('div');
            overlay.className = 'detail-overlay';

            const detailMSG = document.createElement('div');
            detailMSG.className = 'detail-message';
            detailMSG.innerHTML = getTransactionMessage(logManager.get().lastResults[log.dataset.index]);
            setView(detailMSG);
            overlay.appendChild(detailMSG);

            overlay.addEventListener("click", function (e) {
                if (e.target == overlay) {
                    document.body.removeChild(overlay);
                }
            });

            document.body.appendChild(overlay);
        }
    });
    //var page = createPage(1);

    logManager.getNextPage().then(arr => {
        var loader = document.getElementById('loader')
        loader.remove();

        arr.forEach(e => pages.appendChild(e));
    });
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
                    value.prices.map(obj => new Price(obj.formatted, obj.ecoType, obj.amount)),
                    value.amount,
                    value.action,
                    value.type
                );
            } else {
                return new SingleTransaction(
                    value.date,
                    new Player(value.player.name, value.player.uuid),
                    new SingleItem(value.items.name, value.items.item, value.items.mat),
                    value.prices.map(obj => new Price(obj.formatted, obj.ecoType, obj.amount)),
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
        logManager.get().playerFilter = event.target.value;

        pages.innerHTML = '';
        logManager.getNextPageAndFilter()
            .then(arr => arr.forEach(e => pages.appendChild(e)));
    });

    // Filter toggler
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
        logManager.get().actionFilter = event.target.value;

        pages.innerHTML = '';
        logManager.getNextPageAndFilter()
            .then(arr => arr.forEach(e => pages.appendChild(e)));
    });

    // Method filter
    const methodFilter = document.getElementById('method-filter');

    methodFilter.addEventListener('change', function (event) {
        logManager.get().methodFilter = event.target.value;

        pages.innerHTML = '';
        logManager.getNextPageAndFilter()
            .then(arr => arr.forEach(e => pages.appendChild(e)));
    });

    // Item filter
    const itemFilter = document.getElementById('item-filter');

    itemFilter.addEventListener('change', function (event) {
        logManager.get().itemFilter = event.target.value;

        pages.innerHTML = '';
        logManager.getNextPageAndFilter()
            .then(arr => arr.forEach(e => pages.appendChild(e)));
    });

    // Prices filter
    document.getElementById("price-slider1").addEventListener("input", function () {
        updatePricesSlider('min');
    });

    document.getElementById("price-slider2").addEventListener("input", function () {
        updatePricesSlider('max');
    });

    // Currency filter
    const currencyFilter = document.getElementById('currency-filter');

    currencyFilter.addEventListener('change', function (event) {
        logManager.get().currencyFilter = event.target.value;

        pages.innerHTML = '';
        logManager.getNextPageAndFilter()
            .then(arr => arr.forEach(e => pages.appendChild(e)));
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

    logManager.get().amountFilterMin = finalMin;
    logManager.get().amountFilterMax = finalMax;

    setTimeout(function () {
        if (finalMin == logManager.get().amountFilterMin && finalMax == logManager.get().amountFilterMax) {
            pages.innerHTML = '';
            logManager.getNextPageAndFilter()
                .then(arr => arr.forEach(e => pages.appendChild(e)));
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

    document.getElementById('price-slider-value').textContent = `Price range: ${getFormatted(finalMin)} - ${getFormatted(finalMax)}`;

    const range = minSlider.max - minSlider.min;
    const minPercent = ((min - minSlider.min) / range) * 100;
    const maxPercent = ((max - maxSlider.min) / range) * 100;

    minSlider.style.background = `linear-gradient(to right, #ccc ${minPercent}%, blue ${minPercent}%, blue ${maxPercent}%, #ccc ${maxPercent}%)`;

    logManager.get().pricesFilterMin = finalMin;
    logManager.get().pricesFilterMax = finalMax;

    setTimeout(function () {
        if (finalMin == logManager.get().pricesFilterMin && finalMax == logManager.get().pricesFilterMax) {
            pages.innerHTML = '';
            logManager.getNextPageAndFilter()
                .then(arr => arr.forEach(e => pages.appendChild(e)));
        }
    }, 2000);
}

function pricesIncrement(i) {
    if (i == 0)
        return 0;

    if (i <= 10) {
        return i * 10;
    } else {
        const range = Math.floor((i - 10) / 10);
        const baseIncrement = Math.pow(10, range + 2);

        const incrementInCurrentRange = baseIncrement * ((i % 10) || 1);
        return baseIncrement + incrementInCurrentRange;
    }
}

function getFormatted(i) {
    if (i == 0)
        return i;

    const suffixes = ["", "k", "M", "B", "T"];
    const order = Math.floor(Math.log10(Math.abs(i)) / 3);
    const suffix = suffixes[order] || '';
    const shortNumber = i / Math.pow(10, order * 3);

    return shortNumber % 1 === 0
        ? shortNumber + suffix
        : shortNumber.toFixed(1) + suffix;
}

function loadFilters() {
    // Player options
    const playerFilter = document.getElementById('player-filter');

    var players = '';
    for (const p of logManager.get().getPlayers()) {
        players += '<option value="' + p + '">' + p + '</option>';
    }
    playerFilter.innerHTML = players;

    // Item options
    const itemFilter = document.getElementById('item-filter');

    var items = '';
    var s = 0;
    for (let [key, value] of logManager.get().getItems()) {
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

    // Currency options
    const currencyFilter = document.getElementById('currency-filter');

    var currencies = '';
    for (const p of logManager.get().getCurrencys()) {
        currencies += '<option value="' + p + '">' + p + '</option>';
    }
    currencyFilter.innerHTML = currencies;
}

function getTransactionMessage(log) {
    var transactionMSG = '[' + new Date(log.date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) + '] - ';
    if (log instanceof MultipleTransaction) {
        transactionMSG += log.player.name + ' ' + TransactionMode[log.action] + ' ' + log.getItems() + ' for ' + log.getPrices() + ' with the ' + TransactionType[log.type];
    } else if (log instanceof SingleTransaction) {
        transactionMSG += log.player.name + ' ' + TransactionMode[log.action] + ' ' + log.amount + ' x ' + log.getItemsWithoutAmount() + ' for ' + log.getPrices() + ' with the ' + TransactionType[log.type];
    }

    return transactionMSG;
}

// Displays the div at the current scrollheight so the user can see it
function setView(div) {
    var scrollPosition = window.scrollY || document.documentElement.scrollTop;
    var pos = (window.innerHeight - div.offsetHeight) / 2 + scrollPosition;
    div.style.top = pos + 'px';
}