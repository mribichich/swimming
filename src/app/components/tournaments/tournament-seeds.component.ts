/*@ngInject*/
class TournamentSeeds {
    constructor(
    ) { }

    searchText: string;

    filterLanes = (value, index, array) => {
        var patt = new RegExp(this.searchText, 'i');
        return patt.test(value.swimmer.team);
    }
}

export let tournamentSeeds: ng.IComponentOptions = {
    templateUrl: 'app/components/tournaments/tournament-seeds.component.html',
    controller: TournamentSeeds,
    bindings: {
        tournament: '<'
    }
}; 