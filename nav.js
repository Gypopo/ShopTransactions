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
            window.location.href = 'https://logs.gpplugins.com' + link + '?id=' + id;
        } else {
            window.location.href = 'https://logs.gpplugins.com' + link;
        }
    }

    getID() {
        var params = new URLSearchParams(window.location.search);
        if (params.has('id')) {
            return params.get('id');
        } else return null;
    }

}