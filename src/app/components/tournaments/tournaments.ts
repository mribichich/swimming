import { ITournamentService, IHistoryService } from 'app/services';
import { Tournament } from 'app/entities/tournament';

/*@ngInject*/
class Tournaments {
    constructor(
        private tournamentService: ITournamentService,
        private historyService: IHistoryService,
        private $rootRouter
    ) {
        this.getTournaments();
    }

    tournaments: Tournament[] = [];

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
        this.$rootRouter.navigate(to);
    }
}

export let tournaments = {
    templateUrl: 'app/components/tournaments/tournaments.html',
    controller: Tournaments
};