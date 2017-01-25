import { TournamentService, IHistoryService } from 'app/services';
import { Tournament } from 'app/entities/tournament';

class Tournaments {
    /*@ngInject*/
    constructor(
        private tournamentService: TournamentService,
        private historyService: IHistoryService,
        private $location: ng.ILocationService,
    ) {
    }

    tournaments: Tournament[] = [];

    $onInit() {
        this.getTournaments();
    }

    getTournaments() {
        this.tournamentService.getAll()
            .then((getAllInfo) => {
                this.tournaments = getAllInfo.items;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    navigateTo(to) {
        this.$location.path(to);
    }
}

export let tournaments = {
    templateUrl: 'app/components/tournaments/tournaments.html',
    controller: Tournaments
};
