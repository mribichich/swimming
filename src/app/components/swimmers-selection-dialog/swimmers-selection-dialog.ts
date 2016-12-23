'use strict';

import * as angular from 'angular';
import * as _ from 'underscore';

import { ISwimmerService } from 'app/services/swimmerService';
import { Swimmer } from 'app/entities/swimmer';
import { ListItem } from 'app/entities/listItem';

export class SwimmersSelectionDialogComponent {
    /*@ngInject*/
    constructor(
        // private swimmerService: ISwimmerService,
        private $mdDialog,
        private swimmers: Swimmer[]
    ) {
        this.swimmers.forEach((swimmer) => {
            let item = new ListItem<Swimmer>();
            item.model = swimmer;

            this.swimmerItems.push(item);
        });

        // this.getSwimmers()
        //     .then((swimmers: Swimmer[]) => {
        //         this.excludeSwimmers.forEach((excludeSwimmer) => {
        //             let index = _.findIndex(swimmers, (swimmer) => {
        //                 return swimmer.id === excludeSwimmer.id;
        //             });

        //             swimmers.splice(index, 1);
        //         });

        //         swimmers.forEach((swimmer) => {
        //             let item = new ListItem<Swimmer>();
        //             item.model = swimmer;

        //             this.swimmerItems.push(item);
        //         });
        //     });
    }

    //  swimmers: Swimmer[] = [];
    swimmerItems: ListItem<Swimmer>[] = [];

    // getSwimmers(): ng.IPromise<Swimmer[]> {
    //     return this.swimmerService.getAll();
    // }

    anySelected(): boolean {
        return _.some(this.swimmerItems, (item) => {
            return item.selected;
        });
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    accept() {
        let selectedSwimmers = _.filter(this.swimmerItems, (item) => {
            return item.selected;
        });

        this.$mdDialog.hide(selectedSwimmers.map((item) => {
            return item.model;
        }));
    }
}

export var moduleName = 'swimming.components.tournamentSwimmerRegister';
angular.module(moduleName, []).controller('SwimmersSelectionDialogComponent', SwimmersSelectionDialogComponent);