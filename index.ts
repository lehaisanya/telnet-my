// import { Telnet } from "./modules/telnet/Telnet";

// const telnet = new Telnet('192.168.1.1', 23)

// telnet.onMessage(msg => console.log(msg))

// const intervalId = setInterval(() => telnet.emulateData('Interval'), 3000)

// setTimeout(() => clearInterval(intervalId), 10000)

// setTimeout(() => telnet.emulateData('Hello world'), 7000)

import { ConsoleUI } from './modules/ConsoleUI'

const consoleUI = new ConsoleUI(process.stdin, process.stdout)

async function main() {
    const data = await consoleUI.menu('Hello?', [
        'Punkt1',
        'Punkt2',
        'Punkt3',
        'Punkt4',
        'Punkt5',
        'Punkt6',
        'Punkt7',
    ])

    console.log('You are write ' + data);
}

main()
