import { CategoryType } from 'app/enums/categoryType';

export class CategoryDb {
	id: string;
	name: string;
	type: CategoryType;
	from: number;
	to: number;
}