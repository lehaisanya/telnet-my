const readline = require('readline');
const colors = require('colors');

const w = process.stdout.columns;
const h = process.stdout.rows - 2;

function max(arr) {
	let maxv = arr[0].length;
	for (let i = 1; i < arr.length; i++) {
		if (arr[i].length > maxv) maxv = arr[i].length;
	}
	return maxv;
}

function repeat(str, count) {
	let res = '';
	for (let i = 0; i < count; i++) {
		res += str;
	}
	return res;
}

function formatIP(str) {
	return str
		.replace(/\d+|\./g, (prev) => prev.bold.green)
		.replace(/\b(ZTE)|(HUAWEI)|(BDCM)|(TEST)|(NEW)|(I+)\b/gi, (prev) => prev.yellow);
}

const draw = {
	paren(title, list, select, page, pages, len, last, format) {
		const width = max([ ...list, title ]) + 10;
		const pagination = ' ' + (page + 1) + '/' + pages + ' ';
		const fill = width - title.length - pagination.length;
		const selectIndex = page * len + select;
		const isLast = page === pages - 1;
		const pageLen = isLast ? last + 1 : len;

		console.log('-- ' + title + ' ' + repeat('-', fill - 4) + pagination + '--');

		for (let i = 0; i < pageLen; i++) {
			let index = page * len + i;
			if (index === selectIndex) {
				console.log('['.red + format(list[index]) + ']'.red);
			} else {
				console.log(' ' + format(list[index]));
			}
		}
	},
	dot(title, list, select, page, pages, len, last, format) {
		const width = max([ ...list, title ]) + 10;
		const pagination = ' ' + (page + 1) + '/' + pages + ' ';
		const fill = width - title.length - pagination.length;
		const selectIndex = page * len + select;
		const isLast = page === pages - 1;
		const pageLen = isLast ? last + 1 : len;

		console.log('-- ' + title + ' ' + repeat('-', fill - 4) + pagination + '--');

		for (let i = 0; i < pageLen; i++) {
			let index = page * len + i;
			if (index === selectIndex) {
				console.log(' o '.red + format(list[index]));
			} else {
				console.log('   ' + format(list[index]));
			}
		}
	},
	lines(title, list, select, page, pages, len, last, format) {
		const width = max([ ...list, title ]) + 10;
		const pagination = '\u2524' + (page + 1) + '/' + pages + '\u251C';
		const fill = width - title.length - pagination.length;
		const selectIndex = page * len + select;
		const isLast = page === pages - 1;
		const pageLen = isLast ? last + 1 : len;

		console.log(
			'\u250C\u2500' +
				(' ' + title + ' ').bgWhite.black +
				repeat('\u2500', fill - 4) +
				pagination +
				'\u2500\u2510'
		);

		for (let i = 0; i < pageLen; i++) {
			let index = page * len + i;
			if (index === selectIndex) {
				console.log('\u2502' + format(list[index].padEnd(width)).bgCyan + '\u2502');
			} else {
				console.log('\u2502' + format(list[index].padEnd(width)) + '\u2502');
			}
		}

		if (isLast) {
			let remain = len - last - 1;
			for (let i = 0; i < remain; i++) {
				console.log('\u2502' + ''.padEnd(width) + '\u2502');
			}
		}

		console.log('\u2514' + repeat('\u2500', width) + '\u2518');
	}
};

async function menu(title = 'NO NAME', list = [], drawF = draw.lines) {
	let select = 0;
	let page = 0;
	const len = h - 2;
	const last = list.length % len - 1;
	const pages = Math.floor(list.length / len + 1);

	function draw() {
		process.stdout.write('\x1Bc');
		drawF(title, list, select, page, pages, len, last, formatIP);
	}

	return new Promise(function(resolve, reject) {
		readline.emitKeypressEvents(process.stdin);
		process.stdin.setRawMode(true);

		draw();

		process.stdin.on('keypress', onKey);

		function onKey(ch, key) {
			if (key.name === 'down') {
				if (page !== pages - 1) {
					if (select !== len - 1) {
						select++;
					} else {
						select = 0;
					}
				} else {
					if (select !== last) {
						select++;
					} else {
						select = 0;
					}
				}
				draw();
			} else if (key.name === 'up') {
				if (select !== 0) {
					select--;
				} else if (page === pages - 1) {
					select = last;
				} else {
					select = len - 1;
				}
				draw();
			} else if (key.name === 'right') {
				if (page !== pages - 1) {
					page++;
				} else {
					page = 0;
				}
				select = 0;
				draw();
			} else if (key.name === 'left') {
				if (page !== 0) {
					page--;
				} else {
					page = pages - 1;
				}
				select = 0;
				draw();
			} else if (key.name === 'return') {
				process.stdout.write('\x1Bc');
				process.stdin.removeListener('keypress', onKey);
				process.stdin.setRawMode(false);
				return resolve(page * len + select);
			} else if (key.sequence === '\u0003') {
				process.stdout.write('\x1Bc');
				process.exit();
			}
		}
	});
}

module.exports = {
	draw,
	menu
};
