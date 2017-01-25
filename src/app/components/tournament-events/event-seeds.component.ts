'use strict';

import * as _ from 'underscore';

import {
    TournamentService
} from 'app/services';
import {
    Tournament,
    TournamentEvent,
    Swimmer,
    Heat,
    SeedTime
} from 'app/entities';
import { EventState } from 'app/enums';
import * as FeedbackLib from 'app/libs/feedbackLib';

class EventSeeds {
/*@ngInject*/
    constructor(
        private $mdDialog,
        private tournamentService: TournamentService
    ) { }

    submitted: boolean;
    editMode: boolean;

    feedbacks = {
        save: new FeedbackLib.Feedback()
    };

    tournament: Tournament;
    event: TournamentEvent;

    eventSeedTimesTemp: SeedTime[];
    eventSeedTimes: SeedTime[];

    seedTimes: SeedTime[];

    onChange: () => void;

    $onInit() {
        // if (this.event.heats.length > 0) {

        // }
    }

    $onChanges(changesObj) {
        if (changesObj.event.currentValue) {
            this.eventSeedTimes = changesObj.event.currentValue.getSeedTimes();
        }
    }

    editTimes(ev) {
        if (this.event.state !== EventState.NotStarted) {
            let eventText = 'La prueba ya ha comenzado';

            if (this.event.state === EventState.Finished) {
                eventText = 'La prueba ya ha terminado';
            }

            let text = `${eventText}. Esta seguro que desea cambiar los tiempos?`;

            var confirm = this.$mdDialog.confirm()
                .title('Cambio de Tiempos')
                .textContent(text)
                .ariaLabel('Cambio de Tiempos')
                .targetEvent(ev)
                .ok('Cambiar')
                .cancel('Cancelar');
            this.$mdDialog.show(confirm).then(() => {
                this.showEditMode();
            }, () => { });
        } else {
            this.showEditMode();
        }
    }

    showEditMode() {
        this.editMode = true;

        this.eventSeedTimesTemp = this.eventSeedTimes.map(m => _.clone(m));
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

            this.feedbacks.save.setNone();
            this.feedbacks.save.isWorking = true;

            const seedTimes = this.eventSeedTimesTemp.map(m => {
                return {
                    swimmerId: m.swimmerId,
                    time: m.time,
                    swimmer: undefined
                }
            });

            this.tournamentService.changeEventSeedTimes(this.tournament.id, this.event.id, seedTimes)
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

            this.eventSeedTimesTemp = null;

            // this.eventSeedTimes.forEach(tempSeedTime => {
            //     const seedTime = this.event.seedTimes.find(f => f.swimmer.id === tempSeedTime.swimmer.id);
            //     seedTime.time = tempSeedTime.time;
            // });
        }, () => { });
    }
}

export let eventSeeds: ng.IComponentOptions = {
    templateUrl: 'app/components/tournament-events/event-seeds.component.html',
    controller: EventSeeds,
    bindings: {
        tournament: '<',
        event: '<',
        onChange: '&'
    }
};