import { ISwimmerService } from 'app/services/swimmerService';
import { Swimmer } from 'app/entities/swimmer';
import { ListItem } from 'app/entities/listItem';
export declare class TournamentSwimmerRegisterController {
    private swimmerService;
    private $mdDialog;
    private excludeSwimmers;
    static $inject: string[];
    constructor(swimmerService: ISwimmerService, $mdDialog: any, excludeSwimmers: Swimmer[]);
    swimmerItems: ListItem<Swimmer>[];
    getSwimmers(): ng.IPromise<Swimmer[]>;
    anySelected(): boolean;
    cancel(): void;
    accept(): void;
}
export declare var moduleName: string;
