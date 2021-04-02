import { Token } from "./Token";

export interface Device {
    parse(data: string): Token[]
}
