'use strict';

// import * as angular from 'angular';
// import * as URI from 'urijs';

// import { TournamentService } from 'app/services';
// import { IHistoryService } from 'app/services/historyService';
// import { Tournament } from 'app/entities/tournament';
// import { Swimmer } from 'app/entities/swimmer';
// import { SwimmersSelectionDialogComponent } from 'app/components/swimmers-selection-dialog/swimmers-selection-dialog';
// import { ISwimmerService } from 'app/services/swimmerService';

class EventResults {
    /*@ngInject*/
    constructor(
    ) { }
}

export let eventResults: ng.IComponentOptions = {
    templateUrl: 'app/components/tournament-events/event-results.component.html',
    controller: EventResults,
    bindings: {
        event: '<'
    }
};
