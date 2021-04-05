import { Socket, createConnection } from "net";
import { State } from "./State";
import { Message } from "./Message";
import { Device } from "./Device";
import { Connecting } from "./states/Connecting";
import { Closed } from "./states/Closed";
import { TextDevice } from "./devices/Text";

type MessageListener = (message: Message) => void;

export class Telnet {
  private listeners: MessageListener[] = [];
  private state: State;
  private host: string;
  private port: number;
  private device: Device;
  private socket: Socket;

  constructor(host: string, port: number) {
    this.host = host
    this.port = port
    this.connect()
  }

  public connect() {
    this.state = new Connecting(this)
    this.device = new TextDevice()
    this.socket = createConnection(this.port, this.host)
    this.configSoket()
  }

  public reconnect() {
    this.socket.end(() => this.connect());
  }

  public close() {
    this.socket.end();
  }

  public write(data: string) {
    this.processInput(data);
  }

  public onMessage(listener: MessageListener) {
    this.listeners = [...this.listeners, listener];
  }

  public emulateData(data: string) {
    this.onData(data)
  }

  public setState(state: State) {
    this.state = state
  }

  private emitListeners(messages: Message[]) {
    messages.forEach((message) => 
      this.listeners.forEach(listener =>
        listener(message)))
  }

  private parseData(data: string): Message[] {
    return this.device.parse(data);
  }

  private processOutput(messages: Message[]): void {
    messages.forEach(message => {
      this.state = this.state.read(message)
    })
  }

  private processInput(data: string) {
    return this.state.write(data);
  }

  private configSoket() {
    this.emulateData('Connection open')
    this.socket.setEncoding("utf-8");
    this.socket.on("data", (data: string) => this.onData(data));
    this.socket.on("close", (hasError: boolean) => this.onClose(hasError));
    this.socket.on("error", (error: Error) => this.emulateData('Connection error'));
    this.socket.on("timeout", () => this.emulateData('Connection timeout'));
  }

  private onData(newData: string) {
    const messages = this.parseData(newData);
    this.processOutput(messages);
    this.emitListeners(messages)
  }

  private onClose(hasError: boolean) {
    this.emulateData('Connection close')
    this.setState(new Closed(this))
  }
}
