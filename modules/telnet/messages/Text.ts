import { Message, MessageType } from "../Message";

export class TextMessage implements Message {
    type = MessageType.TEXT

    constructor(
        public value: string
    ) {}
}