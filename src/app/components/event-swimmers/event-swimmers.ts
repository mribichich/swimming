'use strict';

import * as angular from 'angular';
import * as _ from 'underscore';

import {
    TournamentService
} from 'app/services';
import {
    IHistoryService,
    ISwimmerService
} from 'app/services';
import {
    Tournament,
    TournamentEvent,
    Swimmer
} from 'app/entities';
import {
    SwimmerFactory
} from 'app/factories';

class EventSwimmers {
/*@ngInject*/
    constructor(
        private tournamentService: TournamentService,
        private $mdDialog,
        // private historyService: IHistoryService,
        private swimmerService: ISwimmerService,
        private $window,
        private $q: ng.IQService
    ) { }

    // tournament: Tournament;

    event: TournamentEvent;
}

export let eventSwimmers: ng.IComponentOptions = {
    templateUrl: 'app/components/event-swimmers/event-swimmers.html',
    controller: EventSwimmers,
    bindings: {
        event: '<',
        onRemove: '&'
    }
};
