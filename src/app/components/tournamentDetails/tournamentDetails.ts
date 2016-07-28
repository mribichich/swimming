'use strict';

import * as _ from 'underscore';

import { ITournamentService } from 'app/services';
import { IHistoryService } from 'app/services/historyService';
import { Tournament, Swimmer } from 'app/entities';
import { EventState } from 'app/enums';

/*@ngInject*/
class TournamentDetails {
    constructor(
        private tournamentService: ITournamentService,
        private $window,
        private $mdDialog,
        private $location,
        private $rootRouter
    ) {
    }

    routeParams;
    fromRoute;
    tournament: Tournament;
    selectedTabIndex: number = 0;

    tabs = {
        swimmersTab: 0,
        categoriesTab: 1,
        eventsTab: 2,
        seedTimesTab: 3,
        resultsTab: 4
    };

    $routerOnActivate(toRoute, fromRoute) {
        this.routeParams = toRoute.params;
        this.fromRoute = fromRoute;

        this.refresh();
    }

    navigate(to) {
        this.$rootRouter.navigate(to);
    }

    goBack() {
        // this.$location.path(this.fromRoute.urlPath);
        this.$rootRouter.navigate(['/Tournaments']);
    }

    refresh() {
        this.getTournament(this.routeParams.id)
            .then(() => {
                if (this.tournament.events.some(m => m.state !== EventState.NotStarted)) {
                    this.selectedTabIndex = this.tabs.eventsTab;
                }
            });
        // .then(() => this.getEventsCategories());
    }

    getTournament(id: string) {
        return this.tournamentService.get(id)
            .then((tournament) => {
                this.tournament = tournament;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // getEventsCategories() {
    //     this.tournament.events.forEach(event => {
    //         event.category = _.find(this.tournament.categories, (category) => {
    //             return category.id === event.categoryId;
    //         });
    //     });
    // }

    delete($event) {
        var confirm = this.$mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('Eliminar Torneo')
            .content('Esta seguro que desea eliminar el torneo: ' + this.tournament.name)
            .ariaLabel('Eliminar Torneo')
            .ok('Eliminar Torneo')
            .cancel('Cancelar')
            .targetEvent($event);
        this.$mdDialog.show(confirm).then(() => {
            this.tournamentService.delete(this.tournament.id)
                .then(() => {
                    this.$window.history.back();
                })
                .catch((error) => {
                    console.log(error);
                });
        }, () => {
            //
        });
    }

    removeSwimmer($event, swimmer: Swimmer) {
        var confirm = this.$mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('Quitado de Nadador del Torneo')
            .content('Esta seguro que desea quitar el nadador: ' + swimmer.fullName)
            .ariaLabel('Quitar Nadador')
            .ok('Quitar Nadador')
            .cancel('Cancelar')
            .targetEvent($event);
        this.$mdDialog.show(confirm).then(() => {
            // var index = _.findIndex(this.tournament.swimmers, (item) => {
            //     return item.id === swimmer.id;
            // });

            // this.tournament.swimmers.splice(index, 1);

            this.tournamentService.removeSwimmer(this.tournament.id, swimmer.id)
                .then(() => this.refresh());
        }, () => {
            //
        });
    }
}

export let tournamentDetails = {
    templateUrl: 'app/components/tournamentDetails/tournamentDetails.html',
    controller: TournamentDetails
};