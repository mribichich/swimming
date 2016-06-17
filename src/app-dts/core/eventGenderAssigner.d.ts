import { EventGenderType } from 'app/enums/eventGenderType';
import { Gender } from 'app/enums/gender';
export declare class EventGenderAssigner {
    static isGender(eventGender: EventGenderType, gender: Gender): boolean;
}
