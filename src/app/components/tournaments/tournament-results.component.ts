
class TournamentResults {
/*@ngInject*/
    constructor(
    ) { }
}

export let tournamentResults: ng.IComponentOptions = {
    templateUrl: 'app/components/tournaments/tournament-results.component.html',
    controller: TournamentResults,
    bindings: {
        tournament: '<'
    }
}; 