import * as uuid from 'node-uuid';

import { Category } from 'app/entities/category';
import * as mapper from 'app/libs/automapper';

export class CategoryFactory {
	'use strict';

	static Create(categoryDb?): Category {
		var category = new Category();

		if (categoryDb) {
			mapper.map(categoryDb, category);
		} else {
			category.id = uuid.v4();
		}

		return category;
	}
}