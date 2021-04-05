import { Message } from "./Message";

export interface Device {
    parse(data: string): Message[]
}
