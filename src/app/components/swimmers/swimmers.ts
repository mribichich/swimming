'use strict';

import { ISwimmerService } from 'app/services/swimmerService';
import { IHistoryService } from 'app/services/historyService';
import { Swimmer } from 'app/entities/swimmer';

class Swimmers {
    /*@ngInject*/
    constructor(
        private swimmerService: ISwimmerService,
        private historyService: IHistoryService,
        private $location: ng.ILocationService,
    ) {
        this.getSwimmers();
    }

    swimmers: Swimmer[] = [];

    getSwimmers() {
        this.swimmerService.getAll()
            .then((swimmers) => {
                this.swimmers = swimmers;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    navigateTo(to) {
        this.$location.path(to);
    }
}

export let swimmers = {
    templateUrl: 'app/components/swimmers/swimmers.html',
    controller: Swimmers
};