export function map(source, dest) {
	for (var prop in source) {
		if (source.hasOwnProperty(prop)) {
			dest[prop] = source[prop];
		}
	}
}

// export function mapCollection(source: Array<any>, dest: Array<any>) {
// 	for (var i = 0; i < source.length; i++) {
// 		map(source[i], dest[i]);
// 	}
// }