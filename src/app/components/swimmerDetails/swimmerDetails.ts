'use strict';

import { ISwimmerService } from 'app/services/swimmerService';
import { Swimmer } from 'app/entities/swimmer';
import { IHistoryService } from 'app/services/historyService';

 class SwimmerDetails {
    static $inject: string[] = [
        'swimmerService',
        '$rootRouter',
        '$window',
        '$mdDialog',
        'historyService'
    ];

    constructor(
        private swimmerService: ISwimmerService,
        private $rootRouter,
        private $window,
        private $mdDialog,
        private historyService: IHistoryService
        ) {
    }

    swimmer: Swimmer;

    $routerOnActivate(toRoute, fromRoute) {
        this.getSwimmer(toRoute.params.id);
    }

    goBack() {
        this.$rootRouter.navigate(['/Swimmers']);
    }

    getSwimmer(id: string) {
        this.swimmerService.get(id)
            .then((swimmer) => {
                this.swimmer = swimmer;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    delete($event) {
        // var confirm = this.$mdDialog.confirm()
        //     .parent(angular.element(document.body))
        //     .title('Eliminar Nadador')
        //     .content('Esta seguro que desea eliminar al nadador: ' + this.swimmer.fullName)
        //     .ariaLabel('Eliminar Nadador')
        //     .ok('Eliminar Nadador')
        //     .cancel('Cancelar')
        //     .targetEvent($event);
        // this.$mdDialog.show(confirm).then(() => {
        //     this.swimmerService.delete(this.swimmer.id)
        //         .then(() => {
        //            this.$window.history.back();
        //         })
        //         .catch((error) => {
        //             console.log(error);
        //         });
        // }, () => {
        //     //
        // });
    }
}

export let swimmerDetails = {
	templateUrl: 'app/components/swimmerDetails/swimmerDetails.html',
	controller: SwimmerDetails
};