import { Socket, createConnection } from "net";
import { State } from "./State";
import { Message } from "./Message";
import { Token } from "./Token";
import { Device } from "./Device";

type MessageListener = (message: Message) => void;

export class Telnet {
  private listeners: MessageListener[] = [];
  private state: State;
  private host: string;
  private port: number;
  private device: Device;
  private socket: Socket;

  constructor() {
    this.connect();
  }

  public write(data: string) {
    this.processInput(data);
  }

  public close() {
    this.socket.end();
  }

  public reconnect() {
    this.socket.end(() => this.connect());
  }

  public onMessage(listener: MessageListener) {
    this.listeners = [...this.listeners, listener];
  }

  private onData(newData: string) {
    const tokens = this.parseData(newData);
    const messages = this.processOutput(tokens);
    messages.forEach((message) => {
      this.listeners.forEach((listener) => {
        listener(message);
      });
    });
  }

  private parseData(data: string): Token[] {
    return this.device.parse(data);
  }

  private processOutput(tokens: Token[]): Message[] {
    return this.state.read(tokens);
  }

  private processInput(data: string) {
    return this.state.write(data);
  }

  private connect() {
    this.socket = createConnection(this.port, this.host, () =>
      this.configSoket()
    );
  }

  private configSoket() {
    this.socket.setEncoding("utf-8");
    this.socket.on("data", (data: string) => this.onData(data));
    this.socket.on("close", (hasError: boolean) => {});
    this.socket.on("error", (error: Error) => {});
    this.socket.on("timeout", () => {});
  }
}
