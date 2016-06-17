import { FeedbackType } from 'app/libs/feedback/feedbackType';
export interface IFeedback {
    isWorking: boolean;
    text: string;
    type: FeedbackType;
    clear(): any;
    setNone(text?: string): void;
    setInfo(text?: string): void;
    setError(text?: string): void;
    setSuccess(text?: string): void;
    isInfo(): boolean;
    isError(): boolean;
    isSuccess(): boolean;
}
export declare class Feedback implements IFeedback {
    isWorking: boolean;
    text: string;
    type: FeedbackType;
    clear(): void;
    setNone(text?: string): void;
    setInfo(text?: string): void;
    setError(text?: string): void;
    setSuccess(text?: string): void;
    isInfo(): boolean;
    isError(): boolean;
    isSuccess(): boolean;
    private setText(text?);
}
