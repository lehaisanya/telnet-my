import { createFile, timestamp } from "./utils"

const dirs = {
    data: 'data',
    log: 'log',
    dump: 'dump'
}

const filenames = {
    settings: 'settings.json',
    users: 'users.json',
    ip: 'ip.json',
    last: 'last.json',
    log: (name: string) => `[${timestamp()}] ${name}.log`,
    dump: (name: string) => `[${timestamp()}] ${name}.txt`
}

const paths = {
    settings: `${dirs.data}/${filenames.settings}`,
    users: `${dirs.data}/${filenames.users}`,
    ip: `${dirs.data}/${filenames.ip}`,
    last: `${dirs.data}/${filenames.last}`,
    log: (name: string) => `${dirs.log}/${filenames.log(name)}`,
    dump: (name: string) => `${dirs.dump}/${filenames.dump(name)}`,
}

export const files = {
    settings: () => createFile(paths.settings),
    users: () => createFile(paths.users),
    ip: () => createFile(paths.ip),
    last: () => createFile(paths.last),
    log: (name: string) => createFile(paths.log(name)),
    dump: (name: string) => createFile(paths.dump(name))
}