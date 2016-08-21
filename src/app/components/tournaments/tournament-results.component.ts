import './tournament-results.component.css!';

class TournamentResults {
/*@ngInject*/
    constructor(
        private currentWebContents
    ) { }

    searchText: string;

    filterResults = (value, index, array) => {
        var patt = new RegExp(this.searchText, 'i');
        return patt.test(value.swimmer.team);
    }

    printResults() {
        this.currentWebContents.print();
    }
}

export let tournamentResults: ng.IComponentOptions = {
    templateUrl: 'app/components/tournaments/tournament-results.component.html',
    controller: TournamentResults,
    bindings: {
        tournament: '<'
    }
}; 