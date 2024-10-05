import { API } from "./api.js";
import { LogsProvider } from "./LogsProvider.js";
import { Nav } from "./nav.js";
import { Stats } from "./objects/Stats.js";
import { GeneralStats } from "./objects/stats/GeneralStats.js";
import { TopItem } from "./objects/stats/TopItem.js";
import { TopItems } from "./objects/stats/TopItems.js";
import { TopPlayer } from "./objects/stats/TopPlayer.js";

var api = new API();
var nav = new Nav();
var stats;
var cached_textures = new Map();
var logsProvider;

init();

async function init() {
    setLoading();

    var params = new URLSearchParams(window.location.search);
    if (params.has("id")) {
        try {
            var exported = await api.getExported(params.get('id'));
            var raw = JSON.stringify(exported.stats);

            stats = new Stats(JSON.parse(raw));
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
    var loaderFrame = document.getElementById('loader');
    var loader = document.createElement('div');
    loader.className = 'loader';

    loaderFrame.appendChild(loader);
    loading = true;
}

async function completeLoading() {
    //var page = createPage(1);

    var loader = document.getElementById('loader')
    loader.remove();

    var container = document.getElementById('container');
    container.style.display = 'block';

    fillPage();
}

function fillPage() {
    fillGeneralStats();
    fillTopItems();
    fillTopPlayers();
}

function fillGeneralStats() {
    var generalStats = stats.getGeneralStats();

    var tt = document.getElementById('total-transactions');
    tt.innerText = generalStats.getTotalTransactions();

    var list = generalStats.getCashIn().length >= 1 || generalStats.getCashOut().length >= 1;

    var TCI = document.getElementById('total-cashflow-in');
    if (generalStats.getCashIn().length != 0) {
        if (list) {
            var TCI_list = '<ul>';
            for (var price of generalStats.getCashIn()) {
                TCI_list = TCI_list + '<li>' + price.formatted + '</li>';
            }
            TCI.style.fontSize = '18px';
            TCI.innerHTML = TCI_list + '</ul>';
        } else {
            TCI.innerHTML = generalStats.getCashIn().get(0).formatted;
        }
    } else {
        TCI.innerText = 'No data yet';
    }

    var TCO = document.getElementById('total-cashflow-out');
    if (generalStats.getCashOut().length != 0) {
        if (list) {
            var TCO_list = '<ul>';
            for (var price of generalStats.getCashOut()) {
                TCO_list = TCO_list + '<li>' + price.formatted + '</li>';
            }
            TCO.style.fontSize = '18px';
            TCO.innerHTML = TCO_list + '</ul>';
        } else {
            TCO.innerHTML = generalStats.getCashOut().get(0).formatted;
        }
    } else {
        TCO.innerText = 'No data yet';
    }
}

function fillTopItems() {
    var topItems = stats.getTopItems();

    // Buy transactions
    var IBM = document.getElementById('top-bought-items-month');
    var IBM_list = '<ul>';
    if (topItems.IBM.length != 0) {
        for (var item of topItems.IBM) {
            IBM_list = IBM_list + '<li>' + item.getHTML() + '</li>';
        }
    } else {
        IBM_list = IBM_list + '<li>No data yet</li>';
    }
    IBM.innerHTML = IBM_list + '</ul>';

    var IBW = document.getElementById('top-bought-items-week');
    var IBW_list = '<ul>';
    if (topItems.IBW.length != 0) {
        for (var item of topItems.IBW) {
            IBW_list = IBW_list + '<li>' + item.getHTML() + '</li>';
        }
    } else {
        IBW_list = IBW_list + '<li>No data yet</li>';
    }
    IBW.innerHTML = IBW_list + '</ul>';

    var IBD = document.getElementById('top-bought-items-day');
    var IBD_list = '<ul>';
    if (topItems.IBD.length != 0) {
        for (var item of topItems.IBD) {
            IBD_list = IBD_list + '<li>' + item.getHTML() + '</li>';
        }
    } else {
        IBD_list = IBD_list + '<li>No data yet</li>';
    }
    IBD.innerHTML = IBD_list + '</ul>';

    // Sell transactions
    var ISM = document.getElementById('top-sold-items-month');
    var ISM_list = '<ul>';
    if (topItems.ISM.length != 0) {
        for (var item of topItems.ISM) {
            ISM_list = ISM_list + '<li>' + item.getHTML() + '</li>';
        }
    } else {
        ISM_list = ISM_list + '<li>No data yet</li>';
    }
    ISM.innerHTML = ISM_list + '</ul>';

    var ISW = document.getElementById('top-sold-items-week');
    var ISW_list = '<ul>';
    if (topItems.ISW.length != 0) {
        for (var item of topItems.ISW) {
            ISW_list = ISW_list + '<li>' + item.getHTML() + '</li>';
        }
    } else {
        ISW_list = ISW_list + '<li>No data yet</li>';
    }
    ISW.innerHTML = ISW_list + '</ul>';

    var ISD = document.getElementById('top-sold-items-day');
    var ISD_list = '<ul>';
    if (topItems.ISD.length != 0) {
        for (var item of topItems.ISD) {
            ISD_list = ISD_list + '<li>' + item.getHTML() + '</li>';
        }
    } else {
        ISD_list = ISD_list + '<li>No data yet</li>';
    }
    ISD.innerHTML = ISD_list + '</ul>';

}

function fillTopPlayers() {
    var topPlayers = stats.getTopPlayers();

    // Buy transactions
    var PBM = document.getElementById('top-players-purchased-month');
    var PBM_list = '<ul>';
    if (topPlayers.PBM.length != 0) {
        for (var player of topPlayers.PBM) {
            PBM_list = PBM_list + '<li>' + player.getHTML() + '</li>';
        }
    } else {
        PBM_list = PBM_list + '<li>No data yet</li>';
    }
    PBM.innerHTML = PBM_list + '</ul>';

    var PBW = document.getElementById('top-players-purchased-week');
    var PBW_list = '<ul>';
    if (topPlayers.PBW.length != 0) {
        for (var player of topPlayers.PBW) {
            PBW_list = PBW_list + '<li>' + player.getHTML() + '</li>';
        }
    } else {
        PBW_list = PBW_list + '<li>No data yet</li>';
    }
    PBW.innerHTML = PBW_list + '</ul>';

    var PBD = document.getElementById('top-players-purchased-day');
    var PBD_list = '<ul>';
    if (topPlayers.PBD.length != 0) {
        for (var player of topPlayers.PBD) {
            PBD_list = PBD_list + '<li>' + player.getHTML() + '</li>';
        }
    } else {
        PBD_list = PBD_list + '<li>No data yet</li>';
    }
    PBD.innerHTML = PBD_list + '</ul>';

    // Sell transactions
    var PSM = document.getElementById('top-players-sold-month');
    var PSM_list = '<ul>';
    if (topPlayers.PSM.length != 0) {
        for (var player of topPlayers.PSM) {
            PSM_list = PSM_list + '<li>' + player.getHTML() + '</li>';
        }
    } else {
        PSM_list = PSM_list + '<li>No data yet</li>';
    }
    PSM.innerHTML = PSM_list + '</ul>';

    var PSW = document.getElementById('top-players-sold-week');
    var PSW_list = '<ul>';
    if (topPlayers.PSW.length != 0) {
        for (var player of topPlayers.PSW) {
            PSW_list = PSW_list + '<li>' + player.getHTML() + '</li>';
        }
    } else {
        PSW_list = PSW_list + '<li>No data yet</li>';
    }
    PSW.innerHTML = PSW_list + '</ul>';

    var PSD = document.getElementById('top-players-sold-day');
    var PSD_list = '<ul>';
    if (topPlayers.PSD.length != 0) {
        for (var player of topPlayers.PSD) {
            PSD_list = PSD_list + '<li>' + player.getHTML() + '</li>';
        }
    } else {
        PSD_list = PSD_list + '<li>No data yet</li>';
    }
    PSD.innerHTML = PSD_list + '</ul>';
}