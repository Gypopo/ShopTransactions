import { Logs } from "./objects/Logs.js";

export class LogManager {

    pageSize; // Page size depending on device
    lastIndex = 0; // The last index of the log displayed
    static AMOUNT = !window.matchMedia("(max-width: 800px)").matches;

    timeOffset = new Date().getTimezoneOffset() * 60 * 1000;
    cached_textures = new Map();
    
    logs;
    dates;
    api;

    /**
    * @param {Array<Object>} logs
    * @param {Array<SimpleMonth>} dates
    */
    init(logs, dates, api) {
        this.logs = new Logs(logs, dates);
        this.dates = dates;
        this.api = api;
        this.pageSize = this.getPageSize();
    }

    get() {
        return this.logs;
    }

    /**
     * @return {Array<Object>}
     */
    async getNextPage() {
        return this.splitLogsByDate(this.logs.get());
    }

    /**
     * @return {Array<Object>}
     */
    async getNextPageAndFilter() {
        this.lastIndex = 0; // New filter, also reset last index
        return this.splitLogsByDate(this.logs.getAndFilter());
    }

    async splitLogsByDate(logs) {
        var arr = [];
        const oneDay = 86400000;
        var today = new Date();
        today.setHours(24, 0, 0, 0);
        var prevDate = today.getTime();
        var fakePageSize = this.pageSize; // Make a fake page size which can increase if we didn't reach the amount of logs per day
    
        var i = 0;
        var title = false;
        while (i < fakePageSize && this.lastIndex < logs.length) {
            var log = logs.at(this.lastIndex);
            var date = log.date;
    
            // Check if the log is from today or a previous day
            if (date <= prevDate) {
                if (date > (prevDate - oneDay)) {
                    if (!title) {
                        if (i >= this.pageSize)
                            break;

                        var formatted = this.formatDate(new Date(log.date));
                        var container = document.createElement('div');
                        container.className = 'time-container';
    
                        container.innerHTML = formatted + '<div class="seperator"><hr style="border: 2px solid black; background-color: black;"></div>';
                        arr.push(container);
    
                        title = true;
                    } else fakePageSize++;
    
                    var ele = await this.createLog(log);
                    ele.dataset.index = this.lastIndex;
                    ele.dataset.uuid = log.player.uuid;
                    arr.push(ele);
                } else {
                    const dayDiff = Math.floor((prevDate - date) / oneDay); // The amount of full days which passed without transactions
                    today.setDate(today.getDate() - dayDiff);
                    prevDate = today.getTime();
                    title = false;
    
                    if (!title) {
                        if (i >= this.pageSize)
                            break;

                        var formatted = this.formatDate(new Date(log.date));
                        var container = document.createElement('div');
                        container.className = 'time-container';
    
                        container.innerHTML = formatted + '<div class="seperator"><hr style="border: 2px solid black; background-color: black;"></div>';
                        arr.push(container);
    
                        title = true;
                    } else fakePageSize++;
    
                    var ele = await this.createLog(log);
                    ele.dataset.index = this.lastIndex;
                    ele.dataset.uuid = log.player.uuid;
                    arr.push(ele);
                }
            }
    
            this.lastIndex++;
            i++;
        }
    
        console.log(this.lastIndex)
        this.updateCounter(this.lastIndex, logs.length);
        this.renderPlayerHeadsAsync(arr);

        if (this.lastIndex != logs.length)
            arr.push(this.getMoreButton());
        return Promise.resolve(arr);
    }
    
    updateCounter(displayed, length) {
        const counter = document.getElementById('log-count');
        counter.innerHTML = 'Showing <a style="color: rgb(0, 255, 0);"><stong>' + displayed + '<stong></a> out of ' + length + " log(s)";
    }

    getMoreButton() {
        var button = document.createElement('div');
        button.className = 'more-button';
        button.id = 'more-button';
        button.innerHTML = '<strong>Load more</strong>';
        var instance = this;

        button.addEventListener('click', function (event) {
            var pages = document.getElementById('logs');
    
            instance.splitLogsByDate(instance.get().lastResults)
                .then(arr => {
                    button.remove();
                    arr.forEach(e => pages.appendChild(e));
                });
        });

        return button;
    }
    
    formatDate(date) {
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

    async createLog(log) {
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
        avatar.className = 'avatar';
        //avatar.src = 'https://api.creepernation.net/avatar/' + log.player.uuid;
        avatar.src = null;
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
    
    async getTexture(uuid) {
        var texture = this.cached_textures.get(uuid);
        if (!texture) {
            texture = await this.api.getTexture(uuid);
            this.cached_textures.set(uuid, texture);
        }
    
        return texture;
    }

    renderPlayerHeadsAsync(arr) {
        // Much better performance by rendering the textures async AFTER all logs have been created
        setTimeout(async () => {
            for(var e of arr) {
                if (e.className !== 'log-container')
                    continue;

                var texture = await this.getTexture(e.dataset.uuid);
                e.querySelector('.avatar').src = texture;
            }
        }, 0);
    }

    getPageSize() {
        // Calculate the page size based on the device
        // since browsers can only handle a certain amount of elements on a page before they crash
        const platform = navigator.platform.toLowerCase();

        if (platform.includes("win") || platform.includes("mac") || platform.includes("linux")) {
            return 500;
        } else if (platform.includes("iphone") || platform.includes("ipad") || platform.includes("android")) {
            return 100;
        } else {
            return 100;
        }
    }
}