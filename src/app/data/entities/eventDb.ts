import * as _ from 'underscore';
import * as moment from 'moment';
import humanizeDuration from 'humanize-duration';

import { EventGenderType, EventState } from 'app/enums';
import { HeatDb } from 'app/data/entities';

export class TournamentEventDb {
	id: string;
	number: number;
	distance: string;
	style: string;
	categoryId: string;
	genderType: EventGenderType;
	swimmerIds: Array<string>;

	heats: HeatDb[];
	startedDateTime: Date;
	finishedDateTime: Date;
	state: EventState;
}