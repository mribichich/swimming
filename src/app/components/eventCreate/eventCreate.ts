import * as angular from 'angular';
import * as _ from 'underscore';

import { TournamentService } from 'app/services';
import { IHistoryService } from 'app/services/historyService';
import { Tournament } from 'app/entities/tournament';
import { TournamentEvent } from 'app/entities/event';
import { Category } from 'app/entities/category';
import { EventFactory } from 'app/factories';
import * as FeedbackLib from 'app/libs/feedbackLib';

class EventCreate {
    /*@ngInject*/
    constructor(
        private tournamentService: TournamentService,
        private $location: ng.ILocationService,
        private $window,
        private historyService: IHistoryService,
        private $routeParams
    ) {
    }

    viewAction: string;

    feedbacks = {
        save: new FeedbackLib.Feedback()
    };

    tournament: Tournament;
    event: TournamentEvent;
    selectedCategory: Category;
    submitted: boolean = false;

    $onInit() {
        var promise = this.getTournament(this.$routeParams.tournamentId);

        if (angular.isUndefined(this.$routeParams.eventId)) {
            this.viewAction = 'Create';

            this.event = EventFactory.Create();
        } else {
            this.viewAction = 'Edit';

            promise
                .then(() => {
                    this.getEvent(this.$routeParams.eventId);
                    this.setSelectedCategory();
                });
        }
    }

    goBack() {
        this.$location.path(`/tournaments/details/${this.tournament.id}`);
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
        var events = this.tournament.events.filter((item) => {
            return item.id === id;
        });

        this.event = events[0];
    }

    setSelectedCategory() {
        this.selectedCategory = _.find(this.tournament.categories, (item) => {
            return item.id === this.event.categoryId;
        });
    }

    saveEvent(isFormInvalid) {
        this.submitted = true;

        if (isFormInvalid) {
            return;
        }

        this.event.categoryId = this.selectedCategory.id;

        if (this.viewAction === 'Create') {
            this.createEvent();
        } else {
            this.editEvent();
        }
    }

    createEvent() {
        this.feedbacks.save.setNone();
        this.feedbacks.save.isWorking = true;

        // this.tournament.events.push(this.event);

        this.tournamentService.addEvent(this.tournament.id, this.event)
            .then((data) => this.processCreateEvent(data))
            .catch((error) => this.catchCreateEventError(error))
            .finally(() => {
                this.feedbacks.save.isWorking = false;
            });
    }

    private processCreateEvent(data) {
        this.feedbacks.save.setSuccess();
        // this.alertService.add(TSS.AngularJs.AlertType.success, "El registro se ha guardado correctamente");
        // this.$location.path(`/tournaments/${this.tournament.id}/events`);
        this.goBack();
    }

    private catchCreateEventError(error) {
        console.error(error);
        this.feedbacks.save.setError('Ha ocurrido un error guardando los datos');
    }

    private finallyCreateEvent() {
        this.feedbacks.save.isWorking = false;
    }

    editEvent() {
        this.feedbacks.save.setNone();
        this.feedbacks.save.isWorking = true;

        this.tournamentService.updateEvent(this.tournament.id, this.event)
            .then((data) => this.processEditEvent(data))
            .catch((error) => this.catchEditEventError(error))
            .finally(() => {
                this.feedbacks.save.isWorking = false;
            });
    }

    private processEditEvent(data) {
        this.feedbacks.save.setSuccess();
        // this.alertService.add(TSS.AngularJs.AlertType.success, "El registro se ha guardado correctamente");
        // this.$location.path(`/tournaments/${this.tournament.id}/events`);
        this.goBack();
    }

    private catchEditEventError(error) {
        console.error(error);
        this.feedbacks.save.setError('Ha ocurrido un error guardando los datos');
    }
}

export let eventCreate = {
    templateUrl: 'app/components/eventCreate/eventCreate.html',
    controller: EventCreate
};
