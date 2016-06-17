'use strict';

import * as angular from 'angular';
import * as _ from 'underscore';
import 'rxjs/add/operator/map';
// import 'humanize-duration';

import { ITournamentService } from 'app/services';
import { IHistoryService, ISwimmerService } from 'app/services';
import { Tournament, TournamentEvent, Swimmer } from 'app/entities';
import { SwimmerFactory } from 'app/factories';
import { EventState } from 'app/enums';

/*@ngInject*/
class EventDetails {
    constructor(
        private tournamentService: ITournamentService,
        private $mdDialog,
        private historyService: IHistoryService,
        private swimmerService: ISwimmerService,
        private $window,
        private $q: ng.IQService,
        private $rootRouter
    ) {
    }

    tabs = {
        results: 2
    }

    tournament: Tournament;
    tournament2: Tournament;

    event: TournamentEvent;

    selectedTabIndex: number;

    $routerOnActivate(toRoute, fromRoute) {
        this.tournament2 = this.tournamentService.tournaments$
            .map(tournaments => tournaments.find(item => item.id === toRoute.params.tournamentId));

        this.getTournament(toRoute.params.tournamentId)
            .then(() => this.getEvent(toRoute.params.eventId));
    }

    goBack() {
        // this.$window.history.back();
        // this.$location.path(`/tournaments/${this.tournament.id}/categories`);
        //    this.$window.history.back(); 

        this.$rootRouter.navigate(['Events', { tournamentId: this.tournament.id }]);
    }

    getTournament(id: string) {
        return this.tournamentService.get(id)
            .then((tournament) => {
                this.tournament = tournament;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getEvent(id: string) {
        // this.event = _.find(this.tournament.events, (item) => {
        //     return item.id === id;
        // });

        // let category = _.find(this.tournament.categories, (category) => {
        //     return category.id === this.event.categoryId;
        // });

        // this.event.category = CategoryFactory.Create(category);

        this.tournamentService.getEvent(this.tournament, id)
            .then((tournamentEvent) => {
                this.event = tournamentEvent;

                let swimmersPromises: Array<ng.IPromise<Swimmer>> = [];
                this.event.swimmers = [];

                this.event.swimmerIds.forEach(swimmerId => {
                    let p = this.swimmerService.get(swimmerId);
                    swimmersPromises.push(p);
                });

                this.$q.all(swimmersPromises)
                    .then((swimmers: Array<Swimmer>) => {
                        swimmers.forEach(swimmer => {
                            this.event.swimmers.push(swimmer);
                        });
                    })
                    .then(() => {
                        if (!this.event.heats) {
                            return;
                        }

                        if (this.event.heats.length === 0) {
                            return;
                        }

                        this.event.heats.forEach((heat) => {
                            heat.lanes.forEach((lane) => {
                                lane.swimmer = _.find(this.event.swimmers, swimmer => swimmer.id === lane.swimmerId);
                            });
                        });

                        if (this.event.state === EventState.InProgress) {
                            this.selectedTabIndex = this.tabs.results;
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })


    }

    delete($event) {
        var confirm = this.$mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('Eliminar Prueba')
            .content('Esta seguro que desea eliminar la prueba: ' + this.event.number)
            .ariaLabel('Eliminar Prueba')
            .ok('Eliminar Prueba')
            .cancel('Cancelar')
            .targetEvent($event);
        this.$mdDialog.show(confirm).then(() => {
            var index = this.tournament.events.indexOf(this.event);
            this.tournament.events.splice(index, 1);

            this.tournamentService.edit(this.tournament)
                .then(() => {
                    // this.$location.path(`/tournaments/${this.tournament.id}/events`);
                    this.goBack();
                })
                .catch((error) => {
                    console.log(error);
                });
        }, () => {
            //
        });
    }

    showStartEventDialog(ev) {
        var confirm = this.$mdDialog.confirm()
            .title('Comienzo de Prueba')
            .textContent('Esta seguro que desea comenzar la prueba?')
            .ariaLabel('Comienzo de Prueba')
            .targetEvent(ev)
            .ok('Comenzar')
            .cancel('Cancelar');
        this.$mdDialog.show(confirm).then(() => {
            this.tournamentService.startEvent(this.tournament.id, this.event.id)
                .then(() => this.processStartEvent())
            // .catch((error) => )
            // .finally(() => {
            //     this.feedbacks.save.isWorking = false;
            // });
        }, () => {
        });
    }

    processStartEvent() {
        this.tournamentService.getEvent2(this.tournament.id, this.event.id)
            .then((tournamentEvent: TournamentEvent) => {
                this.event = tournamentEvent;
                
                this.selectedTabIndex = this.tabs.results;
            });
    }

    // showPauseEventDialog(ev) {
    //     var confirm = this.$mdDialog.confirm()
    //         .title('Pausa de Prueba')
    //         .textContent('Esta seguro que desea pausar la prueba?')
    //         .ariaLabel('Pausa de Prueba')
    //         .targetEvent(ev)
    //         .ok('Pausar')
    //         .cancel('Cancelar');
    //     this.$mdDialog.show(confirm).then(() => {
    //         this.tournamentService.pauseEvent(this.tournament.id, this.event.id)
    //             .then(() => this.processPauseEvent())
    //         // .catch((error) => )
    //         // .finally(() => {
    //         //     this.feedbacks.save.isWorking = false;
    //         // });
    //     }, () => {
    //     });
    // }

    // processPauseEvent() {
    //     this.tournamentService.getEvent2(this.tournament.id, this.event.id)
    //         .then((tournamentEvent: TournamentEvent) => {
    //             this.event = tournamentEvent;
                
    //             this.selectedTabIndex = this.tabs.results;
    //         });
    // }

    showStopEventDialog(ev) {
        var confirm = this.$mdDialog.confirm()
            .title('Terminacion de Prueba')
            .textContent('Esta seguro que desea terminar la prueba?')
            .ariaLabel('Terminacion de Prueba')
            .targetEvent(ev)
            .ok('Terminar')
            .cancel('Cancelar');
        this.$mdDialog.show(confirm).then(() => {
            this.tournamentService.stopEvent(this.tournament.id, this.event.id)
                .then(() => this.processStopEvent())
            // .catch((error) => )
            // .finally(() => {
            //     this.feedbacks.save.isWorking = false;
            // });
        }, () => {
        });
    }

    processStopEvent() {
        this.tournamentService.getEvent2(this.tournament.id, this.event.id)
            .then((tournamentEvent: TournamentEvent) => {
                this.event = tournamentEvent;
                
                this.selectedTabIndex = this.tabs.results;
            });
    }
}

export let eventDetails = {
    templateUrl: 'app/components/eventDetails/eventDetails.html',
    controller: EventDetails
    // , $routeConfig: [
    //     { path: '/swimmers', name: 'EventSwimmers', component: 'eventSwimmers', useAsDefault: true }
    // ]
};