import { Telnet } from "./modules/telnet/Telnet";

const telnet = new Telnet('192.168.1.1', 23)

telnet.onMessage(msg => console.log(msg))

const intervalId = setInterval(() => telnet.emulateData('Interval'), 3000)

setTimeout(() => clearInterval(intervalId), 10000)

setTimeout(() => telnet.emulateData('Hello world'), 7000)
