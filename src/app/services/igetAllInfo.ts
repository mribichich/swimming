export interface IGetAllInfo<T> {
	items: T[];

	totalCount: number;
	filterCount: number;
}