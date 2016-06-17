// import { directivesModule } from 'app/directives/directives.module';
import { Feedback } from 'app/components/feedback/feedback';

export class FeedbackDirective implements ng.IDirective {
    'use strict';
    
    restrict = 'AE';
    scope =true;
    require = 'ngModel';
    controller = Feedback;
    controllerAs = 'feedback';
    bindToController = {
        model: '=ngModel'
    };
    templateUrl = 'app/components/feedback/feedback.html';

    //scope: ng.IScope
    // attrs: ng.IAttributes

    link(scope, element: ng.IAugmentedJQuery, attrs, ctrl: any) {
        // scope.feedbackType = FeedbackType;

        // if (angular.isDefined(attrs.feedbackShowError)) {
        //     scope.showError = eval(attrs.feedbackShowError);
        // } else {
        //     scope.showError = true;
        // }

        // if (angular.isDefined(attrs.feedbackShowErrorAsTooltip)) {
        //     scope.showErrorAsTooltip = eval(attrs.feedbackShowErrorAsTooltip);
        // } else {
        //     scope.showErrorAsTooltip = false;
        // }
    }

    static factory(): ng.IDirectiveFactory {
        const directive = () => new FeedbackDirective();
        directive.$inject = [];
        return directive;
    }
}

// directivesModule.directive('feedback', FeedbackDirective.factory());