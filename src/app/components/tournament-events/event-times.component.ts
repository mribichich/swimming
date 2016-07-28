'use strict';

import * as _ from 'underscore';

import {
    ITournamentService
} from 'app/services';
import {
    Tournament,
    TournamentEvent,
    Swimmer,
    Heat
} from 'app/entities';
import * as FeedbackLib from 'app/libs/feedbackLib';

/*@ngInject*/
class EventTimes {
    constructor(
        private $mdDialog,
        private tournamentService: ITournamentService
    ) { }

    submitted: boolean;
    editMode: boolean;

    feedbacks = {
        save: new FeedbackLib.Feedback()
    };

    tournament: Tournament;
    event: TournamentEvent;

    eventHeatsTemp: Heat[];

    onChange: () => void;

    showStartEventDialog(ev) {
        var confirm = this.$mdDialog.confirm()
            .title('Comienzo de Prueba')
            .textContent('Esta seguro que desea comenzar la prueba?')
            .ariaLabel('Comienzo de Prueba')
            .targetEvent(ev)
            .ok('Comenzar')
            .cancel('Cancelar');
        this.$mdDialog.show(confirm).then(() => {
            return this.tournamentService.startEvent(this.tournament.id, this.event.id)
                // .then(() => this.processStartEvent())
                .then(() => this.onChange())
            // .catch((error) => )
            // .finally(() => {
            //     this.feedbacks.save.isWorking = false;
            // });
        }, () => { });
    }

    showStopEventDialog(ev, formInvalid: boolean) {
        this.submitted = true;

        if (formInvalid) {
            return;
        }

        var confirm = this.$mdDialog.confirm()
            .title('Terminacion de Prueba')
            .textContent('Esta seguro que desea terminar la prueba?')
            .ariaLabel('Terminacion de Prueba')
            .targetEvent(ev)
            .ok('Terminar')
            .cancel('Cancelar');
        this.$mdDialog.show(confirm).then(() => {
            this.tournamentService.stopEvent(this.tournament.id, this.event.id, this.event.heats)
                .then(() => this.onChange())
            // .then(() => this.selectedTabIndex = this.tabs.results);
            // .catch((error) => )
            // .finally(() => {
            //     this.feedbacks.save.isWorking = false;
            // });
        }, () => { });
    }

    editTimes() {
        this.editMode = true;

        this.eventHeatsTemp = this.event.heats.map(m => {
            const cloned = _.clone(m);
            cloned.lanes = _.map(cloned.lanes, _.clone);
            return cloned;
        });
    }

    saveTimes(ev, formInvalid: boolean) {
        this.submitted = true;

        if (formInvalid) {
            return;
        }

        var confirm = this.$mdDialog.confirm()
            .title('Cambio de Tiempos')
            .textContent('Esta seguro que desea cambiar los tiempos?')
            .ariaLabel('Cambio de Tiempos')
            .targetEvent(ev)
            .ok('Cambiar')
            .cancel('Cancelar');
        this.$mdDialog.show(confirm).then(() => {
            this.editMode = false;

            const heats = this.event.heats.map(m => {
                return {
                    seriesNumber: m.seriesNumber,
                    lanes: m.lanes.map(ml => {
                        return { number: ml.number, swimmerId: ml.swimmerId, raceTime: ml.raceTime };
                    })
                }
            });

            this.tournamentService.changeEventTimes(this.tournament.id, this.event.id, heats)
                .then(() => this.onChange())
            // .then(() => this.selectedTabIndex = this.tabs.results);
            // .catch((error) => )
            // .finally(() => {
            //     this.feedbacks.save.isWorking = false;
            // });
        }, () => { });
    }

    cancelSaveTimes(ev) {
        var confirm = this.$mdDialog.confirm()
            .title('Cancelacion de Cambios')
            .textContent('Esta seguro que desea cancelar los cambios?')
            .ariaLabel('Cancelacion de Cambios')
            .targetEvent(ev)
            .ok('OK')
            .cancel('Cancelar');
        this.$mdDialog.show(confirm).then(() => {
            this.editMode = false;

            this.eventHeatsTemp.forEach(heat => {
                const heatDb = this.event.heats.find(f => f.seriesNumber === heat.seriesNumber);
                heat.lanes.forEach(lane => {
                    const laneDb = heatDb.lanes.find(f => f.number === lane.number);
                    laneDb.raceTime = lane.raceTime;
                });
            });
        }, () => { });
    }
}

export let eventTimes: ng.IComponentOptions = {
    templateUrl: 'app/components/tournament-events/event-times.component.html',
    controller: EventTimes,
    bindings: {
        tournament: '<',
        event: '<',
        onChange: '&'
    }
};