export enum MessageType {
    TEXT = "TEXT"
}

export interface Message {
    type: MessageType
    value: string
}