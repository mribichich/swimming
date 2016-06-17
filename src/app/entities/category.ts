import { CategoryType } from 'app/enums/categoryType';

export class Category {
	id: string;
	name: string;
	type: CategoryType;
	from: number;
	to: number;

	get typeDescription(): string {
		switch (this.type) {
			case CategoryType.ByYear:
				return 'Por Año';
			case CategoryType.ByAge:
				return 'Por Edad';
		}
    }
}