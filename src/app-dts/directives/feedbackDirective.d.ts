import { Feedback } from 'app/components/feedback/feedback';
export declare class FeedbackDirective implements ng.IDirective {
    'use strict': any;
    restrict: string;
    scope: boolean;
    require: string;
    controller: typeof Feedback;
    controllerAs: string;
    bindToController: {
        model: string;
    };
    templateUrl: string;
    link(scope: any, element: ng.IAugmentedJQuery, attrs: any, ctrl: any): void;
    static factory(): ng.IDirectiveFactory;
}
