import { API } from "./api.js";
import { Nav } from "./nav.js";
import { Stats } from "./objects/Stats.js";
import { GeneralStats } from "./objects/stats/GeneralStats.js";
import { TopItems } from "./objects/stats/TopItems.js";
import { TopPlayer } from "./objects/stats/TopPlayer.js";

var api = new API();
var nav = new Nav();
var stats;
var cached_textures = new Map();

init();

async function init() {
    setLoading();

    var params = new URLSearchParams(window.location.search);
    if (params.has("id")) {
        try {
            var rawStats;
            if (sessionStorage.getItem('stats')) {
                rawStats = sessionStorage.getItem('stats');
            } else {
                rawStats = await api.getExported(params.get('id'));
            }
            stats = new Stats(JSON.parse(rawStats));
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

}