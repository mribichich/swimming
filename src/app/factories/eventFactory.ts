'use strict';

import * as uuid from 'node-uuid';
import * as _ from 'underscore';

import { TournamentEvent, Category, Swimmer } from 'app/entities';
import * as mapper from 'app/libs/automapper';

export class EventFactory {
	static Create(eventDb?, categories?: Category[], swimmers?: Swimmer[]): TournamentEvent {
		var event = new TournamentEvent();

		if (eventDb) {
			mapper.map(eventDb, event);

			event.category = _.find(categories, (category) => category.id === event.categoryId);

			event.swimmers = event.swimmerIds
				.map(swimmerId => _.find(swimmers, (item) => item.id === swimmerId))
				.sort((a, b) => a.fullName.localeCompare(b.fullName));

			if (event.heats) {
				event.heats.forEach((heat) => {
					if (heat.lanes) {
						heat.lanes.forEach((lane) => {
							lane.swimmer = _.find(event.swimmers, swimmer => swimmer.id === lane.swimmerId);
							lane.seedTime.swimmer = lane.swimmer;
						});
					}
				});
			}
		} else {
			event.id = uuid.v4();
		}

		return event;
	}
}