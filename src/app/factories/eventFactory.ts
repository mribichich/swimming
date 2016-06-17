'use strict';

import uuid = require('node-uuid');
import * as _ from 'underscore';

import { TournamentEvent, Category } from 'app/entities';
import * as mapper from 'app/libs/automapper';

export class EventFactory {
	static Create(eventDb?, categories?: Category[]): TournamentEvent {
		var event = new TournamentEvent();

		if (eventDb) {
			mapper.map(eventDb, event);

			event.category = _.find(categories, (category) => category.id === event.categoryId);
		} else {
			event.id = uuid.v4();
		}

		return event;
	}
}