import './tournament-seeds.component.css!';

class TournamentSeeds {
    /*@ngInject*/
    constructor(
        private $window,
        private currentWebContents
    ) { }

    searchText: string;

    filterLanes = (value, index, array) => {
        var patt = new RegExp(this.searchText, 'i');
        return patt.test(value.swimmer.team);
    }

    printSeeds() {
        this.currentWebContents.print();
    }
}

export let tournamentSeeds: ng.IComponentOptions = {
    templateUrl: 'app/components/tournaments/tournament-seeds.component.html',
    controller: TournamentSeeds,
    bindings: {
        tournament: '<'
    }
}; 