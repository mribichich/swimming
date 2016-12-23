'use strict';

import * as angular from 'angular';
import * as _ from 'underscore';

import { ITournamentService } from 'app/services';
import { IHistoryService } from 'app/services/historyService';
import { Tournament } from 'app/entities/tournament';
import { Swimmer } from 'app/entities/swimmer';

class TournamentSwimmerDetails {
    /*@ngInject*/
    constructor(
        private tournamentService: ITournamentService,
        private $window,
        private $location: ng.ILocationService,
        private $mdDialog,
        private historyService: IHistoryService,
        private $routeParams
    ) {
    }

    tournament: Tournament;

    swimmer: Swimmer;

    $onInit() {
        this.getTournament(this.$routeParams.tournamentId)
            // .then(() => this.getTournamentSwimmers())
            .then(() => this.getSwimmer(this.$routeParams.swimmerId));
    }

    goBack() {
        // this.$window.history.back();
        // this.$location.path(`/tournaments/${this.tournament.id}/swimmers`);
        this.$window.history.back();
    }

    getTournament(id: string) {
        return this.tournamentService.get(id, ['swimmers'])
            .then((tournament) => this.tournament = tournament)
            .catch((error) => {
                console.log(error);
            });
    }

    getTournamentSwimmers() {
        return this.tournamentService.getTournamentSwimmers(this.tournament);
    }

    getSwimmer(id: string) {
        this.swimmer = _.find(this.tournament.swimmers, (item) => {
            return item.id === id;
        });
    }

    remove($event, swimmer: Swimmer) {
        var confirm = this.$mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('Quitar Nadador')
            .content('Esta seguro que desea quitar el nadador: ' + swimmer.fullName)
            .ariaLabel('Quitar Nadador')
            .ok('Quitar Nadador')
            .cancel('Cancelar')
            .targetEvent($event);
        this.$mdDialog.show(confirm).then(() => {
            var index = _.findIndex(this.tournament.swimmers, (item) => {
                return item.id === swimmer.id;
            });

            this.tournament.swimmers.splice(index, 1);

            this.tournamentService.edit(this.tournament);

            this.goBack();
        }, () => {
            //
        });
    }
}

export let tournamentSwimmerDetails = {
    templateUrl: 'app/components/tournamentSwimmerDetails/tournamentSwimmerDetails.html',
    controller: TournamentSwimmerDetails
};