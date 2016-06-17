'use strict';

import * as _ from 'underscore';

import { ITournamentService } from 'app/services';
import { IHistoryService } from 'app/services/historyService';
import { Tournament } from 'app/entities/tournament';

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

    fromRoute;
    tournament: Tournament;

    $routerOnActivate(toRoute, fromRoute) {
        this.fromRoute = fromRoute;

        this.getTournament(toRoute.params.id)
            .then(() => this.getEventsCategories());
    }

    navigate(to) {
        this.$rootRouter.navigate(to);
    }

    goBack() {
        // this.$location.path(this.fromRoute.urlPath);
        this.$rootRouter.navigate(['/Tournaments']);
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

    getEventsCategories() {
        this.tournament.events.forEach(event => {
            event.category = _.find(this.tournament.categories, (category) => {
                return category.id === event.categoryId;
            });
        });
    }

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
}

export let tournamentDetails = {
    templateUrl: 'app/components/tournamentDetails/tournamentDetails.html',
    controller: TournamentDetails
};