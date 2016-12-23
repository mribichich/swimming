'use strict';

import * as angular from 'angular';
import * as URI from 'urijs';

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
        private $routeParams
    ) {
    }

    tournament: Tournament;

    navigateTo(path) {
        this.$location.path(path);
    }

    navigateToCreateSwimmer() {
        this.$location.path('/swimmers/create');
    }

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