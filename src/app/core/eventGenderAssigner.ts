import { EventGenderType } from 'app/enums/eventGenderType';
import { Gender } from 'app/enums/gender';

export class EventGenderAssigner {
	static isGender(eventGender: EventGenderType, gender: Gender) {
		if (eventGender === EventGenderType.Males && gender===Gender.Male) {
			return true;
		}

		if (eventGender === EventGenderType.Females && gender===Gender.Female) {
			return true;
		}

		if (eventGender === EventGenderType.Mixed) {
			return true;
		}

		return false;
	}
}