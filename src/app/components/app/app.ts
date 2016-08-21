// import 'material-design-lite/material.css!';

import 'app/styles/roboto-font.css!';
import './app.css!';
// import 'app/styles/demo-site.css!';

// import 'material-design-lite/material';
import * as angular from 'angular';
import 'angular-i18n/angular-locale_es-ar';
import 'angular-material';
import 'angular-messages';
import 'angular-animate';
import 'angular-aria';
import 'ngcomponentrouter';
import 'angular-indexedDB';
import moment from 'moment';
import 'moment/locale/es';
import * as timerModule from 'angular-timer';
import 'angular-electron';

import 'app/templates';
import * as data from 'app/data';
import * as services from 'app/services';
import * as directives from 'app/directives';
import * as components from 'app/components';

import {upgradeAdapter} from 'app/upgrade_adapter';
import {HeroDetailComponent} from 'app/components/test/test';

export class App {
/*@ngInject*/
    constructor(
        private $rootRouter,
        private $mdSidenav
    ) {
    }

    toggleMenu() {
        this.$mdSidenav('left').toggle();
    }

    navigateTo(to) {
        this.$rootRouter.navigate(to);

        this.$mdSidenav('left').close();
    }
}

let AppComponent = {
    templateUrl: 'app/components/app/app.html',
    controller: App,
    $routeConfig: [
        { path: '/', component: 'dashboard', name: 'Dashboard', useAsDefault: true },

        { path: '/swimmers', component: 'swimmers', name: 'Swimmers' },
        { path: '/swimmers/create', component: 'swimmerCreate', name: 'SwimmerCreate' },
        { path: '/swimmers/edit/:id', component: 'swimmerCreate', name: 'SwimmerEdit' },
        { path: '/swimmers/details/:id', component: 'swimmerDetails', name: 'SwimmerDetails' },

        { path: '/tournaments', component: 'tournaments', name: 'Tournaments' },
        { path: '/tournaments/create', component: 'tournamentCreate', name: 'TournamentCreate' },
        { path: '/tournaments/edit/:id', component: 'tournamentCreate', name: 'TournamentEdit' },
        { path: '/tournaments/details/:id', component: 'tournamentDetails', name: 'TournamentDetails' },

        // { path: '/tournaments/:tournamentId/categories', component: 'categories', name: 'Categories' },
        { path: '/tournaments/:tournamentId/categories/create', component: 'categoryCreate', name: 'CategoryCreate' },
        { path: '/tournaments/:tournamentId/categories/edit/:categoryId', component: 'categoryCreate', name: 'CategoryEdit' },
        { path: '/tournaments/:tournamentId/categories/details/:categoryId', component: 'categoryDetails', name: 'CategoryDetails' },

        { path: '/tournaments/:tournamentId/events', component: 'events', name: 'Events' },
        { path: '/tournaments/:tournamentId/events/create', component: 'eventCreate', name: 'EventCreate' },
        { path: '/tournaments/:tournamentId/events/edit/:eventId', component: 'eventCreate', name: 'EventEdit' },
        { path: '/tournaments/:tournamentId/events/details/:eventId', component: 'eventDetails', name: 'EventDetails' },
        { path: '/tournaments/:tournamentId/events/seed/:eventId', component: 'eventSeed', name: 'EventSeed' },

        { path: '/tournaments/:tournamentId/swimmers', component: 'tournamentSwimmers', name: 'TournamentSwimmers' },
        { path: '/tournaments/:tournamentId/swimmers/details/:swimmerId', component: 'tournamentSwimmerDetails', name: 'TournamentSwimmerDetails' }

        // { path: '/**', component: 'notfound', as: 'NotFound' }
    ]
}

angular.module('swimming',
    [
        'ngAnimate',
        'ngMaterial',
        'ngLocale',
        'ngMessages',
        'ngComponentRouter',
        'indexedDB',
        'templates',
        timerModule.name,
        'angular-electron'
    ])

    .config(function ($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function (date) {
            if (!date) {
                return '';
            }

            return moment(date).format('L');
        };
    })

    .value('$routerRootComponent', 'app')

    .service('storage', data.Storage)
    .service('tournamentRepository', data.TournamentRepository)
    .service('swimmerRepository', data.SwimmerRepository)

    .service('swimmerService', services.SwimmerService)
    .service('historyService', services.HistoryService)
    .service('tournamentService', services.TournamentService)

    .component('app', AppComponent)
    .directive('feedback', directives.FeedbackDirective.factory())

    .component('dashboard', components.dashboard)

    .component('swimmers', components.swimmers)
    .component('swimmerCreate', components.swimmerCreate)
    .component('swimmerDetails', components.swimmerDetails)

    .component('tournaments', components.tournaments)
    .component('tournamentCreate', components.tournamentCreate)
    .component('tournamentDetails', components.tournamentDetails)
    .component('tournamentResults', components.tournamentResults)
    .component('tournamentSeeds', components.tournamentSeeds)
    .component('tournamentEvents', components.tournamentEvents)

    //  .component('categories', components.categories)
    .component('tournamentCategoryList', components.tournamentCategoryList)
    .component('categoryCreate', components.categoryCreate)
    .component('categoryDetails', components.categoryDetails)

    // .component('events', components.events)
    .component('eventCreate', components.eventCreate)
    .component('eventDetails', components.eventDetails)
    .component('eventSwimmers', components.eventSwimmers)
    // .component('eventSeed', components.eventSeed)
    .component('eventResults', components.eventResults)
    .component('eventTimes', components.eventTimes)
    .component('eventSeeds', components.eventSeeds)

    // .component('tournamentSwimmers', components.tournamentSwimmers)
    .component('tournamentSwimmers2', components.tournamentSwimmers2)
    .component('tournamentSwimmerDetails', components.tournamentSwimmerDetails)

    .directive('heroDetail', upgradeAdapter.downgradeNg2Component(HeroDetailComponent));