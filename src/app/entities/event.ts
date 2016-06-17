import _ from 'underscore';
import moment from 'moment';
import humanizeDuration from 'humanize-duration';

// import { EventGenderType } from 'app/enums/eventGenderType';
import { EventGenderType, EventState } from 'app/enums';
import { Category, Swimmer, SeedTime, Lane, Heat } from 'app/entities';

// jspm install angular-timer=npm:angular-timer -o "{ main: 'dist/angular-timer', format: 'global',  shim: { 'dist/angular-timer': { "deps": ["moment"], "exports": "moment" } }, dependencies: { 'moment': '*' }, registry: 'jspm' }"

// jspm install angular-timer=npm:angular-timer -o "{ 'main': 'dist/angular-timer', 'dependencies': {    'moment': '*' }, 'format': 'global', 'shim': { 'deps': ['moment'], 'exports': 'moment' } }"

export class TournamentEvent {
	constructor() {
		this.swimmerIds = [];
		this.swimmers = [];
		this.seedTimes = [];
		this.state = EventState.NotStarted;
	}

	private _durationTime;
	private _results: any[];

	id: string;
	number: number;
	distance: string;
	style: string;
	categoryId: string;
	genderType: EventGenderType;
	swimmerIds: Array<string>;
	swimmers: Array<Swimmer>;
	seedTimes: SeedTime[];
	heats: Heat[];
	startedDateTime: Date;
	finishedDateTime: Date;
	state: EventState;

	category: Category;

	get genderDescription(): string {
		switch (this.genderType) {
			case EventGenderType.Males:
				return 'Hombres';
			case EventGenderType.Females:
				return 'Mujeres';
			case EventGenderType.Mixed:
				return 'Mixto';
		}
    }

	get durationTime(): string {
		if (this._durationTime) {
			return this._durationTime;
		}

		let dur = moment.duration(moment(this.finishedDateTime).diff(this.startedDateTime));

		this._durationTime = humanizeDuration(dur.asMilliseconds(), { language: 'es' });

		return this._durationTime;
    }

	addSwimmer(swimmer: Swimmer) {
		if (_.find(this.swimmerIds, swimmerId => swimmerId === swimmer.id)) {
			return;
		}

		this.swimmerIds.push(swimmer.id);
		this.swimmers.push(swimmer);

		let seedTime = new SeedTime();
		seedTime.swimmerId = swimmer.id;
		seedTime.time = 'S/T';
		this.seedTimes.push(seedTime);
	}

	startEvent() {
		if (this.state !== EventState.NotStarted) {
			throw 'Event already started';
		}

		this.startedDateTime = new Date();
		this.state = EventState.InProgress;
	}

	stopEvent() {
		if (this.state !== EventState.InProgress) {
			throw 'Event not in progress';
		}

		this.finishedDateTime = new Date();
		this.state = EventState.Finished;
	}

	getResults(){
if (this._results){
	return this._results;
}

this._results = this.heats.map(m => m.lanes)
			.reduce((a, b) => a.concat(b), [])
			.map(m=> {
				return {
				swimmer: m.swimmer,
				time: m.raceTime 
			};
			})
			.sort((a, b)=> {
				return a.time.localeCompare(b.time) ;
			});
	}
}