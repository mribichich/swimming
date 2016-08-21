'use strict';

import { ITournamentService } from 'app/services';
import { IHistoryService } from 'app/services/historyService';
import { Tournament } from 'app/entities/tournament';
import { TournamentFactory } from 'app/factories';
import * as FeedbackLib from 'app/libs/feedbackLib';
import { Category } from 'app/entities/category';

class TournamentCreate {
/*@ngInject*/
    constructor(
        private tournamentService: ITournamentService,
        private $window,
        private $location,
        private historyService: IHistoryService,
        private $rootRouter,
        private $q:ng.IQService
    ) {
    }

    fromRoute;
    viewAction: string;
    feedbacks = {
        save: new FeedbackLib.Feedback()
    };
    tournament: Tournament;
    submitted: boolean = false;
    modelErrors;

    $routerOnActivate(toRoute, fromRoute) {
        this.fromRoute = fromRoute;

        if (angular.isUndefined(toRoute.params.id)) {
            this.viewAction = 'Create';

            TournamentFactory.Create(null, null, this.$q)
            .then(tournament=> this.tournament = tournament);
        } else {
            this.viewAction = 'Edit';

            this.getTournament(toRoute.params.id);
        }
    }

    goBack() {
        //   this.$window.history.back();
        this.$rootRouter.navigate(['Tournaments']);
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

    saveTournament(isFormInvalid) {
        this.submitted = true;

        if (isFormInvalid) {
            return;
        }

        if (this.viewAction === 'Create') {
            this.createTournament();
        } else {
            this.editTournament();
        }
    }

    createTournament() {
        this.feedbacks.save.setNone();
        this.feedbacks.save.isWorking = true;

        this.tournamentService.create(this.tournament)
            .then((data) => this.processCreateTournament(data))
            .catch((data) => this.catchCreateTournamentError(data))
            .finally(() => this.finallyCreateTournament());
    }

    private processCreateTournament(data) {
        this.feedbacks.save.setSuccess();

        // this.alertService.add(TSS.AngularJs.AlertType.success, "El registro se ha guardado correctamente");

        this.$window.history.back();
    }

    private catchCreateTournamentError(data) {
        console.log(data);

        var msg = 'Ha ocurrido un error guardando los datos';

        this.modelErrors = data.modelErrors;

        this.feedbacks.save.setError(msg);
    }

    private finallyCreateTournament() {
        this.feedbacks.save.isWorking = false;
    }

    editTournament() {
        this.feedbacks.save.setNone();
        this.feedbacks.save.isWorking = true;

        this.tournamentService.updateInfo(this.tournament.id,this.tournament.name, this.tournament.startDateTime )
            .then((data) => this.processEditTournament(data))
            .catch((data) => this.catchEditTournamentError(data))
            .finally(() => this.finallyEditTournament());
    }

    private processEditTournament(data) {
        this.feedbacks.save.setSuccess();

        // this.alertService.add(TSS.AngularJs.AlertType.success, "El registro se ha guardado correctamente");

        this.$window.history.back();
    }

    private catchEditTournamentError(data) {
        var msg = 'Ha ocurrido un error guardando los datos';

        this.modelErrors = data.modelErrors;

        this.feedbacks.save.setError(msg);
    }

    private finallyEditTournament() {
        this.feedbacks.save.isWorking = false;
    }
}

export let tournamentCreate = {
    templateUrl: 'app/components/tournamentCreate/tournamentCreate.html',
    controller: TournamentCreate
};