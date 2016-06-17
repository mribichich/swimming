import * as FeedbackLib from 'app/libs/feedbackLib';

export class Feedback {
    'use strict';
    
    model: FeedbackLib.Feedback;

    feedbackType = FeedbackLib.FeedbackType;

    showError: boolean = true;

    showErrorAsTooltip: boolean = false;

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