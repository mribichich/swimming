'use strict';

import { FeedbackType } from 'app/libs/feedback/feedbackType';

export interface IFeedback {
    isWorking: boolean;
    text: string;
    type: FeedbackType;

    clear();
    setNone(text?: string): void;
    setInfo(text?: string): void;
    setError(text?: string): void;
    setSuccess(text?: string): void;
    isInfo(): boolean;
    isError(): boolean;
    isSuccess(): boolean;
}

export class Feedback implements IFeedback {
    isWorking = false;
    text: string;
    type: FeedbackType;

    clear() {
        this.isWorking = false;
        this.text = '';
        this.type = FeedbackType.None;
    }

    setNone(text?: string) {
        this.setText(text);
        this.type = FeedbackType.None;
    }

    setInfo(text?: string) {
        this.setText(text);
        this.type = FeedbackType.Info;
    }

    setError(text?: string) {
        this.setText(text);
        this.type = FeedbackType.Error;
    }

    setSuccess(text?: string) {
        this.setText(text);
        this.type = FeedbackType.Success;
    }

    isInfo(): boolean {
        return this.type === FeedbackType.Info;
    }

    isError(): boolean {
        return this.type === FeedbackType.Error;
    }

    isSuccess(): boolean {
        return this.type === FeedbackType.Success;
    }

    private setText(text?: string) {
        this.text = text ? text : '';
    }
}