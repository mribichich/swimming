import * as _ from 'underscore';
import * as moment from 'moment';
import humanizeDuration from 'humanize-duration';

// import { EventGenderType } from 'app/enums/eventGenderType';
import { EventGenderType, EventState } from 'app/enums';
import { Category, Swimmer, SeedTime, Lane, Heat } from 'app/entities';
import { SeedTimeFactory } from 'app/factories';

export class TournamentEvent {
	constructor() {
		this.swimmerIds = [];
		this.swimmers = [];
		// this.seedTimes = [];
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
	_seedTimes: SeedTime[];
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

		// let seedTime = new SeedTime();
		// seedTime.swimmerId = swimmer.id;
		// seedTime.time = 'S/T';
		// this.seedTimes.push(seedTime);
	}

	startEvent() {
		if (this.state !== EventState.NotStarted) {
			throw 'Event already started';
		}

		this.startedDateTime = new Date();
		this.state = EventState.InProgress;
	}

	stopEvent(newHeats: Heat[]) {
		if (this.state !== EventState.InProgress) {
			throw 'Event not in progress';
		}

		this.finishedDateTime = new Date();
		this.state = EventState.Finished;

		this.heats.forEach(heat => {
			const heatDb = newHeats.find(f => f.seriesNumber === heat.seriesNumber);
			heat.lanes.forEach(lane => {
				const laneDb = heatDb.lanes.find(f => f.number === lane.number);
				laneDb.raceTime = lane.raceTime;
			});
		});
	}

	changeTimes(newHeats: Heat[]) {
		if (this.state !== EventState.Finished) {
			throw 'Event not finished';
		}

		this.heats.forEach(heat => {
			const heatDb = newHeats.find(f => f.seriesNumber === heat.seriesNumber);
			heat.lanes.forEach(lane => {
				const laneDb = heatDb.lanes.find(f => f.number === lane.number);
				laneDb.raceTime = lane.raceTime;
			});
		});
	}

	getResults() {
		if (this._results) {
			return this._results;
		}

		if (!this.heats) {
			return undefined;
		}

		this._results = this.heats.map(m => m.lanes)
			.reduce((a, b) => a.concat(b), [])
			.map(m => {
				return {
					swimmer: m.swimmer,
					time: m.raceTime
				};
			})
			.sort((a, b) => {
				if (!a.time) {
					return 0;
				}

				return a.time.localeCompare(b.time);
			});

		for (var i = 0; i < this._results.length; i++) {
			this._results[i].pos = i + 1;
		}
	}

	getSeedTimes() {
		const seedTimes: SeedTime[] = [];

		if (this.heats && this.heats.length) {
			this.heats.forEach(heat => {
				heat.lanes.forEach(lane => {
					// const seedTime = new SeedTime();
					// seedTime.swimmer = lane.swimmer;
					// seedTime. = lane.swimmer;

					// const swimmerTemp = this.swimmers.find(f => f.id === lane.swimmerId);
					// lane.seedTime.swimmer = lane.swimmer;
					seedTimes.push(lane.seedTime);
				});
			});
		} else {
			this.swimmers.forEach(m => {
				const seedTime = SeedTimeFactory.Create(m);

				seedTimes.push(seedTime);
			});
		}

		return seedTimes
			.sort((a, b) => {
				return a.swimmer.fullName.localeCompare(b.swimmer.fullName);
			});
	}
}