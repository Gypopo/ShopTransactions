export class Nav {

    constructor() {
        this.register();
    }

    register() {
        var customLinks = document.querySelectorAll('#customHref');

        customLinks.forEach((element, index) => {
            element.onclick = () => this.forward(element.dataset.link, this.getID());
        });
    }

    forward(link, id) {
        if (link === '#')
            return;

        if (id != null) {
            window.location.href = 'http://127.0.0.1:5500' + link + '?id=' + id;
        } else {
            window.location.href = 'http://127.0.0.1:5500' + link;
        }
    }

    getID() {
        var params = new URLSearchParams(window.location.search);
        if (params.has('id')) {
            return params.get('id');
        } else return null;
    }

}