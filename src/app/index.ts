
// deps css
import 'angular-material/angular-material.css!';
import 'bootstrap/css/bootstrap.css!';
import 'angular-toastr/angular-toastr.css!';
// import 'material-design-lite/material.css!';

// app css
import 'app/styles/material-design-custom.css!';
import 'app/styles/styles.css!';
import 'app/styles/roboto-font.css!';
// import 'app/styles/demo-site.css!';

// deps js
import 'jquery';
import 'bootstrap';
// import 'material-design-lite/material';
import * as angular from 'angular';
import 'angular-i18n/angular-locale_es-ar';
import 'angular-material';
import 'angular-messages';
import 'angular-animate';
import 'angular-aria';
import 'angular-indexedDB';
import * as moment from 'moment';
import 'moment/locale/es';
import * as timerModule from 'angular-timer';
import 'angular-electron';
import 'angular-toastr/angular-toastr.tpls';
import 'angular-bootstrap';
import 'angular-sanitize';
import 'angular-route';

// app js
import * as data from 'app/data';
import * as services from 'app/services';
import * as directives from 'app/directives';
import * as components from 'app/components';
import './app-templates';
// import './libs/angular_1_router';

const ModuleName = 'rtu-config-tool';

angular.module('swimming', [
    'app.templates',
    'ngAnimate',
    'ngMaterial',
    'ngLocale',
    'ngMessages',
    'ui.bootstrap',
    'indexedDB',
    timerModule.name,
    'angular-electron',
    'ngSanitize',
    'toastr',
    'ngRoute'
])

    .config(function ($routeProvider, $locationProvider: ng.ILocationProvider) {
        $routeProvider
            .when('/', { redirectTo: '/tournaments' })
            .when('/dashboard', { template: '<dashboard></dashboard>' })

            .when('/swimmers', { template: '<swimmers></swimmers>' })
            .when('/swimmers/create', { template: '<swimmer-create></swimmer-create>' })
            .when('/swimmers/edit/:id', { template: '<swimmer-create></swimmer-create>' })
            .when('/swimmers/details/:id', { template: '<swimmer-details></swimmer-details>' })

            .when('/tournaments', { template: '<tournaments />' })
            .when('/tournaments/create', { template: '<tournament-create />' })
            .when('/tournaments/edit/:id', { template: '<tournament-create />' })
            .when('/tournaments/details/:id', { template: '<tournament-details />' })

            .when('/tournaments/:tournamentId/categories/create', { template: '<category-create />' })
            .when('/tournaments/:tournamentId/categories/edit/:categoryId', { template: '<category-create />' })
            .when('/tournaments/:tournamentId/categories/details/:categoryId', { template: '<category-details />' })

            .when('/tournaments/:tournamentId/events', { template: '<events />' })
            .when('/tournaments/:tournamentId/events/create', { template: '<event-create />' })
            .when('/tournaments/:tournamentId/events/edit/:eventId', { template: '<event-create />' })
            .when('/tournaments/:tournamentId/events/details/:eventId', { template: '<event-details />' })
            .when('/tournaments/:tournamentId/events/seed/:eventId', { template: '<event-seed />' })

            .when('/tournaments/:tournamentId/swimmers', { template: '<tournament-swimmers />' })
            .when('/tournaments/:tournamentId/swimmers/details/:swimmerId', { template: '<tournament-swimmer-details />' })

            .otherwise({ redirectTo: '/dashboard' });

        $locationProvider.html5Mode(false).hashPrefix('!');
    })

    .config(function ($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function (date) {
            if (!date) {
                return '';
            }

            return moment(date).format('L');
        };
    })

    .config(['$mdThemingProvider', $mdThemingProvider => {
        $mdThemingProvider.theme('default')
            .primaryPalette('orange')
            .accentPalette('blue');
    }])

    .config((toastrConfig: angular.toastr.IToastrConfig) => {
        angular.extend(toastrConfig, {
            autoDismiss: false,
            positionClass: 'toast-top-right',
            target: 'body',
            closeButton: true,
            progressBar: true
        });
    })

    .service('storage', data.Storage)
    .service('tournamentRepository', data.TournamentRepository)
    .service('swimmerRepository', data.SwimmerRepository)

    .service('swimmerService', services.SwimmerService)
    .service('historyService', services.HistoryService)
    .service('tournamentService', services.TournamentService)

    .component('app', components.app)
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
    .component('tournamentSwimmerDetails', components.tournamentSwimmerDetails);

angular.bootstrap(document, ['swimming']);