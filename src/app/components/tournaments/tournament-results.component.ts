
class TournamentResults {
/*@ngInject*/
    constructor(
    ) { }

    searchText: string;

    filterResults = (value, index, array) => {
        var patt = new RegExp(this.searchText, 'i');
        return patt.test(value.swimmer.team);
    }
}

export let tournamentResults: ng.IComponentOptions = {
    templateUrl: 'app/components/tournaments/tournament-results.component.html',
    controller: TournamentResults,
    bindings: {
        tournament: '<'
    }
}; 