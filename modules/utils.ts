import { createWriteStream, WriteStream } from "fs"

export function timestamp(): string {
    const now = new Date()
    const date = now.toLocaleDateString()
    const time = now.toLocaleTimeString()
        .replace(':', '-')
    return date + ' ' + time
}

export function createFile(filename: string): WriteStream {
    return createWriteStream(filename)
}

export function max(arr: string[]): number {
    let maxv = arr[0].length
    for (let i = 1; i < arr.length; i++) {
        if (arr[i].length > maxv) maxv = arr[i].length
    }
    return maxv
}

export function repeat(str: string, count: number): string {
    let res = ''
    for (let i = 0; i < count; i++) {
        res += str
    }
    return res
}