
import './app.css!';

class App {
    /*@ngInject*/
    constructor(
        private $location: ng.ILocationService,
        private $mdSidenav
    ) {
    }

    toggleMenu() {
        this.$mdSidenav('left').toggle();
    }

    navigateTo(to) {
        this.$location.path(to);

        this.$mdSidenav('left').close();
    }
}

export const app = {
    templateUrl: 'app/components/app/app.html',
    controller: App
}
