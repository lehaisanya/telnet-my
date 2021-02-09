const { menu } = require('./pages')

/**
 * Устанавливает заголовок окна терминала
 * @param {string} title Заголовок окна
 */
function setTitle(title) {
	if (process.platform == 'win32') {
		process.title = title;
	} else {
		process.stdout.write('\x1b]2;' + title + '\x1b\x5c');
	}
}

async function question(q) {
	return new Promise(function(resolve, reject) {
		process.stdout.write(q);
		process.stdin.once('data', function(data) {
			resolve(String(data).trim());
		});
	});
}

module.exports = {
	setTitle,
	question,
	menu
}