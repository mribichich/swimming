'use strict';

import * as angular from 'angular';
import URI from 'uri';

import { ITournamentService } from 'app/services';
import { IHistoryService } from 'app/services/historyService';
import { Tournament } from 'app/entities/tournament';
import { Swimmer } from 'app/entities/swimmer';
import { SwimmersSelectionDialogComponent } from 'app/components/swimmers-selection-dialog/swimmers-selection-dialog';
import { ISwimmerService } from 'app/services/swimmerService';

class TournamentSwimmers2 {
/*@ngInject*/
    constructor(
        private tournamentService: ITournamentService,
        private $mdDialog,
        private $location: ng.ILocationService,
        private swimmerService: ISwimmerService,
        private $window: ng.IWindowService,
        private $q: ng.IQService,
        private $rootRouter
    ) {
    }

    routeParams;

    tournament: Tournament;

    // $routerOnActivate(toRoute, fromRoute) {
    //     this.routeParams = toRoute.params;

    //     this.refresh();
    // }

    // goBack() {
    //     this.$window.history.back();
    // }

    navigateTo(path) {
        this.$rootRouter.navigate(path);
    }

    navigateToCreateSwimmer() {
        this.$rootRouter.navigate(['/SwimmerCreate']);
    }

    // refresh() {
    //     this.getTournament(this.routeParams.tournamentId)
    //         .then(() => this.registerNewSwimmer());
    // }

    // getTournament(id: string) {
    //     return this.tournamentService.get(id, ['swimmers'])
    //         .then((tournament) => this.tournament = tournament)
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }

    // getSwimmers() {
    //     return this.tournamentService.getTournamentSwimmers(this.tournament);
    // }

    registerNewSwimmer() {
        var uri = URI(this.$location.path());
        var query: any;
        query = uri.query(true);

        if (!query.newSwimmerId) {
            return;
        }

        this.tournament.swimmerIds.push(query.newSwimmerId);

        this.tournamentService.edit(this.tournament);

        this.swimmerService.get(query.newSwimmerId)
            .then((swimmer) => {
                this.tournament.swimmers.push(swimmer);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    registerSwimmers($event) {
        this.swimmerService.getAll()
            .then((swimmerSelection: Swimmer[]) => {
                this.tournament.swimmers.forEach((excludeSwimmer) => {
                    let index = swimmerSelection.findIndex(swimmer => swimmer.id === excludeSwimmer.id);

                    swimmerSelection.splice(index, 1);
                });

                this.$mdDialog.show({
                    controller: SwimmersSelectionDialogComponent,
                    controllerAs: '$ctrl',
                    templateUrl: 'app/components/swimmers-selection-dialog/swimmers-selection-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    bindToController: true,
                    clickOutsideToClose: true,
                    escapeToClose: true,
                    locals: {
                        swimmers: swimmerSelection
                    }
                }).then((selectedSwimmers: Array<Swimmer>) => {
                    // selectedSwimmers.forEach((newSwimmer) => {
                    //     this.tournament.swimmerIds.push(newSwimmer.id);
                    //     this.tournament.swimmers.push(newSwimmer);
                    // });

                    const selectedSwimmerIds = selectedSwimmers.map(m => m.id);

                    this.tournamentService.registerSwimmers(this.tournament.id, selectedSwimmerIds)
                        .then(() => this.onUpdate());
                }, () => {
                    //
                });
            });
    }
}

export let tournamentSwimmers2 = {
    templateUrl: 'app/components/tournament-swimmers/tournament-swimmers.html',
    controller: TournamentSwimmers2,
    bindings: {
        tournament: '=',
        onUpdate: '&',
        onDelete: '&'
    }
};