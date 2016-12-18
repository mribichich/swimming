export function map(source, dest) {
	for (var prop in source) {
		if (source.hasOwnProperty(prop)) {
			dest[prop] = source[prop];
		}
	}
}