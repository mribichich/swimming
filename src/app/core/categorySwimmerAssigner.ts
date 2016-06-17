import { CategoryType } from 'app/enums/categoryType';
import { Category, Swimmer } from 'app/entities';

export class CategorySwimmerAssigner {
	static isCategory(category: Category, swimmer: Swimmer) {
		if (category.type === CategoryType.ByAge) {
			if (swimmer.age >= category.from && swimmer.age <= category.to) {
				return true;
			}

			return false;
		}

		if (swimmer.birthDate.getFullYear() >= category.from && swimmer.birthDate.getFullYear() <= category.to) {
			return true;
		}

		return false;
	}
}