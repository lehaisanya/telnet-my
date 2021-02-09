const files = require('./modules/files')
const Telnet = require('./modules/telnet')
const { setTitle, question, menu } = require("./modules/utils")

async function main() {
	setTitle('telnetMY');

	const device = await getDevice()
	const user = await getUser(device)
	saveLast(device)

	setTitle(device.ip + (device.name !== device.ip ? (' ' + device.name) : '' ) )

	const telnet = new Telnet({
		user,
		device
	})
}

main()

async function getDevice() {
	const devices = files.ip.map((item) => item.name
		.padEnd(20) + ('' + item.ip).replace(/^10.0./, ''))

	const punkts = [
		'Ввести вручну',
		'Предыдущие',
		...devices
	];

	let select = await menu('SELECT IP', punkts);

	if (select === 0) {
		const ip = await question('IP: ')
		return {
			name: ip,
			ip,
			type: "Unknow"
		}
	} else if (select === 1) {
		const lastIP = files.last.map(item => item.name)

		let selectLastIP = await menu('Предыдущие:', lastIP);

		return files.last[selectLastIP]
	} else {
		return files.ip[select-2]
	}
}

async function getUser(device) {
	let usernames = []
	
	for (let username in files.users) {
		usernames.push(username)
	}

	if (device.user) {
		return files.users[device.user]
	}

	switch (device.type) {
		case 'Huawei': return files.users[files.settings.defaultOltUser]
		case 'P3310': return files.users['tacacs:switch']
	}

	const selectUser = await menu('Users', usernames)

	return files.users[usernames[selectUser]]
}

function saveLast(device) {
	const last = [...files.last]

	if (last.length > files.settings.saveLast) {
		last.pop()
	}

	last.unshift(device)
	
	files.saveToFile('last.json', last)
}
