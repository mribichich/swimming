/*@ngInject*/
class TournamentSeeds {
    constructor(
    ) { }
}

export let tournamentSeeds: ng.IComponentOptions = {
    templateUrl: 'app/components/tournaments/tournament-seeds.component.html',
    controller: TournamentSeeds,
    bindings: {
        tournament: '<'
    }
}; 