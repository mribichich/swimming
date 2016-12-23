
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
    controller: App,
    // $routeConfig: [
    //     { path: '/', component: 'dashboard', name: 'Dashboard', useAsDefault: true },

    //     { path: '/swimmers', component: 'swimmers', name: 'Swimmers' },
    //     { path: '/swimmers/create', component: 'swimmerCreate', name: 'SwimmerCreate' },
    //     { path: '/swimmers/edit/:id', component: 'swimmerCreate', name: 'SwimmerEdit' },
    //     { path: '/swimmers/details/:id', component: 'swimmerDetails', name: 'SwimmerDetails' },

    //     { path: '/tournaments', component: 'tournaments', name: 'Tournaments' },
    //     { path: '/tournaments/create', component: 'tournamentCreate', name: 'TournamentCreate' },
    //     { path: '/tournaments/edit/:id', component: 'tournamentCreate', name: 'TournamentEdit' },
    //     { path: '/tournaments/details/:id', component: 'tournamentDetails', name: 'TournamentDetails' },

    //     // { path: '/tournaments/:tournamentId/categories', component: 'categories', name: 'Categories' },
    //     { path: '/tournaments/:tournamentId/categories/create', component: 'categoryCreate', name: 'CategoryCreate' },
    //     { path: '/tournaments/:tournamentId/categories/edit/:categoryId', component: 'categoryCreate', name: 'CategoryEdit' },
    //     { path: '/tournaments/:tournamentId/categories/details/:categoryId', component: 'categoryDetails', name: 'CategoryDetails' },

    //     { path: '/tournaments/:tournamentId/events', component: 'events', name: 'Events' },
    //     { path: '/tournaments/:tournamentId/events/create', component: 'eventCreate', name: 'EventCreate' },
    //     { path: '/tournaments/:tournamentId/events/edit/:eventId', component: 'eventCreate', name: 'EventEdit' },
    //     { path: '/tournaments/:tournamentId/events/details/:eventId', component: 'eventDetails', name: 'EventDetails' },
    //     { path: '/tournaments/:tournamentId/events/seed/:eventId', component: 'eventSeed', name: 'EventSeed' },

    //     { path: '/tournaments/:tournamentId/swimmers', component: 'tournamentSwimmers', name: 'TournamentSwimmers' },
    //     { path: '/tournaments/:tournamentId/swimmers/details/:swimmerId', component: 'tournamentSwimmerDetails', name: 'TournamentSwimmerDetails' }

    //     // { path: '/**', component: 'notfound', as: 'NotFound' }
    // ]
}