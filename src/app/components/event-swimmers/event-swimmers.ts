'use strict';

import * as angular from 'angular';
import * as _ from 'underscore';

import { ITournamentService } from 'app/services';
import { IHistoryService, ISwimmerService } from 'app/services';
import { Tournament, TournamentEvent, Swimmer } from 'app/entities';
import { SwimmerFactory } from 'app/factories';

/*@ngInject*/
class EventSwimmers {
    constructor(
        private tournamentService: ITournamentService,
        private $mdDialog,
        // private historyService: IHistoryService,
        private swimmerService: ISwimmerService,
        private $window,
        private $q: ng.IQService
    ) {
    }

    // tournament: Tournament;

    event: TournamentEvent;
    
    // $router;

    // $routerOnActivate(toRoute, fromRoute) {
    //     this.getTournament(toRoute.params.tournamentId)
    //         .then(() => this.getEvent(toRoute.params.eventId));
    // }

    // getTournament(id: string) {
    //     return this.tournamentService.get(id)
    //         .then((tournament) => {
    //             this.tournament = tournament;
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }

    // getEvent(id: string) {
    //     this.tournamentService.getEvent(this.tournament, id)
    //         .then((tournamentEvent) => {
    //             this.event = tournamentEvent;

    //             let swimmersPromises: Array<ng.IPromise<Swimmer>> = [];
    //             this.event.swimmers = [];

    //             this.event.swimmerIds.forEach(swimmerId => {
    //                 let p = this.swimmerService.get(swimmerId);
    //                 swimmersPromises.push(p);
    //             });

    //             this.$q.all(swimmersPromises)
    //                 .then((swimmers: Array<Swimmer>) => {
    //                     swimmers.forEach(swimmer => {
    //                         this.event.swimmers.push(swimmer);
    //                     });
    //                 })
    //                 .then(() => {
    //                     if (!this.event.heats) {
    //                         return;
    //                     }

    //                     if (this.event.heats.length === 0) {
    //                         return;
    //                     }

    //                     this.event.heats.forEach((heat) => {
    //                         heat.lanes.forEach((lane) => {
    //                             lane.swimmer = _.find(this.event.swimmers, swimmer => swimmer.id === lane.swimmerId);
    //                         });
    //                     });
    //                 })
    //                 .catch((error) => {
    //                     console.log(error);
    //                 });
    //         })
    // }
}
 
export let eventSwimmers = {
    templateUrl: 'app/components/event-swimmers/event-swimmers.html',
    controller: EventSwimmers,
    bindings:{
        event: '<'
    }
    // ,    $routeConfig: [
    //     { path: '/swimmers', name: 'EventSwimmers', component: 'eventSwimmers', useAsDefault: true }
    // ]
};