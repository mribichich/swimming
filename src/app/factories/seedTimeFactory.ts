'use strict';

import { SeedTime, Swimmer } from 'app/entities';
import * as mapper from 'app/libs/automapper';

export class SeedTimeFactory {
	static CreateFromDb(seedTimeDb): SeedTime {
		var seedTime = new SeedTime();

		mapper.map(seedTimeDb, seedTime);

		return seedTime;
	}

	static Create(swimmer: Swimmer): SeedTime {
		var seedTime = new SeedTime();
		seedTime.swimmerId = swimmer.id;
		seedTime.swimmer = swimmer;
		seedTime.time = 'S/T';

		return seedTime;
	}
}