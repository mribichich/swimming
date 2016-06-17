import * as _ from 'underscore';
import { Swimmer, Heat, Lane, SeedTime } from 'app/entities';

const LanesPerHeat = 6;
const MinLanesPerHeat = 3;
const LanesOrder = [3, 4, 2, 5, 1, 6];
const NoTime = 'S/T';

export class HeatAssigner {
	'use strict';

	assignSwimmers(seedTimes: SeedTime[]): Heat[] {
		seedTimes.forEach(seedTime=> {
			if (seedTime.time === NoTime) {
				return;
			}

			let splits = seedTime.time.split(':');

			if (splits[0].length < 2) {
				return;
			}

			if (splits[0][0] !== '0') {
				return;
			}

			splits[0] = splits[0][1];

			seedTime.time = splits.join(':');
		});

        seedTimes = _.sortBy(seedTimes, seedTime => seedTime.time);

		let lanesToCreate = this.calculateLanes(seedTimes.length);

		let heats: Heat[] = [];

		let seedTimeCurrentIndex = 0;

		for (let i = lanesToCreate.length - 1; i >= 0; i--) {
			let heat = new Heat();
            heat.seriesNumber = i + 1;

            heat.lanes = [];

			for (var y = 0; y < lanesToCreate[i]; y++) {
				let lane = new Lane();
				lane.number = LanesOrder[y];
				let seedTime = seedTimes[seedTimeCurrentIndex];
				lane.swimmer = seedTime.swimmer;
				lane.swimmerId = seedTime.swimmerId;
				lane.seedTime = seedTime;

				heat.lanes.push(lane);

				seedTimeCurrentIndex++;
			}

			heat.lanes = _.sortBy(heat.lanes, lane => lane.number);

			heats.push(heat);
		}

		heats = _.sortBy(heats, heat => heat.seriesNumber);

		return heats;
	}

	calculateLanes(swimmersCount: number): number[] {
		if (swimmersCount <= LanesPerHeat) {
			return [swimmersCount];
		}

		var heats = Math.ceil(swimmersCount / LanesPerHeat);
		var rem = swimmersCount % LanesPerHeat;

		if (rem === 0) {
			let result = [];

			for (let i = 0; i < heats; i++) {
				result.push(LanesPerHeat);
			}

			return result;
		}

		let result = [];

		for (let i = 0; i < heats; i++) {
			result.push(MinLanesPerHeat);
		}

		let resultIndex = result.length - 1;

		for (var i = 0; i < swimmersCount - (heats * MinLanesPerHeat); i++) {
			if (result[resultIndex] < LanesPerHeat) {
				result[resultIndex]++;
			} else {
				resultIndex--;
				result[resultIndex]++;
			}
		}

		return result;
	}
}