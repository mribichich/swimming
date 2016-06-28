'use strict';

import * as angular from 'angular';
import * as _ from 'underscore';
import 'rxjs/add/operator/map';
// import 'humanize-duration';

import {
    ITournamentService
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
import {
    EventState
} from 'app/enums';
import {
    SwimmersSelectionDialogComponent
} from 'app/components/swimmers-selection-dialog/swimmers-selection-dialog';

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
    ) { }

    tabs = {
        swimmers: 0,
        seeds: 1,
        times: 2,
        results: 3
    }

    routeParams;

    tournament: Tournament;
    tournament2: Tournament;

    event: TournamentEvent;

    selectedTabIndex: number;

    $routerOnActivate(toRoute, fromRoute) {
        this.tournament2 = this.tournamentService.tournaments$
            .map(tournaments => tournaments.find(item => item.id === toRoute.params.tournamentId));

        this.routeParams = toRoute.params;

        this.refresh();
    }

    goBack() {
        // this.$window.history.back();
        // this.$location.path(`/tournaments/${this.tournament.id}/categories`);
        //    this.$window.history.back(); 

        this.$rootRouter.navigate(['Events', {
            tournamentId: this.tournament.id
        }]);
    }

    refresh() {
        return this.getTournament(this.routeParams.tournamentId)
            .then(() => this.getEvent(this.routeParams.eventId));
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

                switch (this.event.state) {
                    case EventState.NotStarted:

                        break;

                    case EventState.InProgress:
this.selectedTabIndex=this.tabs.times;
                        break;

                    case EventState.Finished:
this.selectedTabIndex=this.tabs.results;
                        break;
                }

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

            this.tournamentService.delete(this.tournament.id)
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

    showSwimmersSelectionDialog(ev) {
        const swimmerSelection = this.tournament.swimmers;

        this.event.swimmers.forEach((excludeSwimmer) => {
            let index = swimmerSelection.findIndex(swimmer => swimmer.id === excludeSwimmer.id);

            swimmerSelection.splice(index, 1);
        });

        this.$mdDialog.show({
            controller: SwimmersSelectionDialogComponent,
            controllerAs: '$ctrl',
            templateUrl: 'app/components/swimmers-selection-dialog/swimmers-selection-dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            locals: {
                swimmers: swimmerSelection
            }
        }).then((selectedSwimmers: Array<Swimmer>) => {
            const selectedSwimmerIds = selectedSwimmers.map(m => m.id);

            this.tournamentService.addSwimmersToEvent(this.tournament.id, this.event.id, selectedSwimmerIds)
                .then(() => {
                    this.refresh();
                });
        }, () => {
            //
        });
    }

    removeSwimmer(ev, swimmerToRemove) {
        var confirm = this.$mdDialog.confirm()
            .title(`Quitado de Nadador: ${swimmerToRemove.fullName}`)
            .textContent('Esta apunto de quitar el nadador de la prueba. Esta seguro que desea continuar?')
            .ariaLabel('Quitado de Nadador')
            .targetEvent(ev)
            .ok('Quitar Nadador')
            .cancel('Cancelar');
        this.$mdDialog.show(confirm).then(() => {
            this.tournamentService.removeSwimmerFromEvent(this.tournament.id, this.event.id, swimmerToRemove.id)
                .then(() => this.refresh());
        }, () => {
            //
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