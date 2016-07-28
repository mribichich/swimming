'use strict';

import { ISwimmerService } from 'app/services';
import { IHistoryService } from 'app/services/historyService';
import { Swimmer } from 'app/entities/swimmer';
import { SwimmerFactory } from 'app/factories';
import * as FeedbackLib from 'app/libs/feedbackLib';

/*@ngInject*/
class SwimmerCreate {
    constructor(
        private swimmerService: ISwimmerService,
        private $rootRouter,
        private $window,
        private historyService: IHistoryService
    ) {
    }

    viewAction: string;

    feedbacks = {
        get: new FeedbackLib.Feedback(),
        save: new FeedbackLib.Feedback()
    };

    swimmer: Swimmer;
    submitted: boolean = false;
    modelErrors;

    $routerOnActivate(toRoute, fromRoute) {
        if (angular.isUndefined(toRoute.params.id)) {
            this.viewAction = 'Create';

            this.swimmer = SwimmerFactory.Create();
        } else {
            this.viewAction = 'Edit';

            this.getSwimmer(toRoute.params.id);
        }
    }

    goBack() {
        this.$rootRouter.navigate(['/Swimmers']);
    }

    saveSwimmer(isFormInvalid) {
        this.submitted = true;

        if (isFormInvalid) {
            return;
        }

        if (this.viewAction === 'Create') {
            this.createSwimmer();
        } else {
            this.editSwimmer();
        }
    }

    createSwimmer() {
        this.feedbacks.save.setNone();
        this.feedbacks.save.isWorking = true;

        this.swimmerService.create(this.swimmer)
            .then((data) => this.processCreateSwimmer(data))
            .catch((data) => this.catchCreateSwimmerError(data))
            .finally(() => this.finallyCreateSwimmer());
    }

    private processCreateSwimmer(data) {
        this.feedbacks.save.setSuccess();

        // this.alertService.add(TSS.AngularJs.AlertType.success, "El registro se ha guardado correctamente");

        // this.historyService.back([{ key: 'newSwimmerId', value: this.swimmer.id }]);
        this.goBack();
    }

    private catchCreateSwimmerError(data) {
        console.log(data);

        var msg = 'Ha ocurrido un error guardando los datos';

        this.modelErrors = data.modelErrors;

        this.feedbacks.save.setError(msg);
    }

    private finallyCreateSwimmer() {
        this.feedbacks.save.isWorking = false;
    }

    getSwimmer(id: string) {
        this.feedbacks.get.setNone();
        this.feedbacks.get.isWorking = true;

        this.swimmerService.get(id)
            .then((data) => this.processGetSwimmer(data))
            .catch((data) => this.catchGetSwimmerError(data))
            .finally(() => this.finallyGetSwimmer());
    }

    private processGetSwimmer(data) {
        this.feedbacks.get.setNone();

        this.swimmer = data;
    }

    private catchGetSwimmerError(data) {
        var msg = 'Ha ocurrido un error guardando los datos';

        this.feedbacks.get.setError(msg);
    }

    private finallyGetSwimmer() {
        this.feedbacks.get.isWorking = false;
    }

    editSwimmer() {
        this.feedbacks.save.setNone();
        this.feedbacks.save.isWorking = true;

        this.swimmerService.updateInfo(this.swimmer.id, this.swimmer)
            .then((data) => this.processEditSwimmer(data))
            .catch((data) => this.catchEditSwimmerError(data))
            .finally(() => this.finallyEditSwimmer());
    }

    private processEditSwimmer(data) {
        this.feedbacks.save.setSuccess();

        // this.alertService.add(TSS.AngularJs.AlertType.success, "El registro se ha guardado correctamente");

        this.goBack();
    }

    private catchEditSwimmerError(data) {
        var msg = 'Ha ocurrido un error guardando los datos';

        this.modelErrors = data.modelErrors;

        this.feedbacks.save.setError(msg);
    }

    private finallyEditSwimmer() {
        this.feedbacks.save.isWorking = false;
    }
}

export let swimmerCreate = {
    templateUrl: 'app/components/swimmer-create/swimmer-create.html',
    controller: SwimmerCreate
};