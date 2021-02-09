const {
    existsSync,
    writeFileSync,
    readFileSync,
    mkdirSync,
    createWriteStream
} = require('fs')

const dataDir = 'data/'
const logDir  = 'log/'
const dumpDir = 'dump/'

const getNowDateTime = () => {
    const now = new Date()
    const date = now.toLocaleDateString()
    const time = now.toLocaleTimeString()
        .replace(/\:/g, '-')
    return date + ' ' + time
}

const dataFile = filename => dataDir + filename

const getFile = filename => createWriteStream(filename)

const logFile = name => {
    const now = getNowDateTime()
    return getFile(`${logDir}[${now}] ${name}.log`)
}

const dumpFile = name => {
    const now = getNowDateTime()
    return getFile(`${dumpDir}[${now}] ${name}.txt`)
}

const initDir = (directory) => {
    if (!existsSync(directory)) mkdirSync(directory)
}

const init = (filename, defaultData = '') => {
    if (!existsSync(filename)) writeFileSync(filename, defaultData)
}

const getFileData = (filename) => {
    return JSON.parse(readFileSync(filename))
}

const saveToFile = (filename, data) => {
    writeFileSync(dataFile(filename), JSON.stringify(data))
}

const filenames = {
    settings: dataFile('settings.json'),
    users: dataFile('users.json'),
    ip: dataFile('ip.json'),
    last: dataFile('last.json'),
}

const initDataFiles = () => {
    init(filenames.settings, "{}")
    init(filenames.users, "{}")
    init(filenames.ip, "[]")
    init(filenames.last, "[]")
}

initDir(dataDir)
initDir(logDir)
initDir(dumpDir)
initDataFiles()

module.exports = {
    settings: getFileData(filenames.settings),
    users: getFileData(filenames.users),
    ip: getFileData(filenames.ip),
    last: getFileData(filenames.last),
    log: logFile,
    dump: dumpFile,
    saveToFile
}