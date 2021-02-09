const colors = require('colors')

const regexps = {
    prompt: /^(\[.*\])|(.*(\>|\#))/gm,
    sfp: /\d+\s?\/\s?\d+\s?\/\s?\d+/g,
    intrfs: /(?<!\x1b\[\d+m)(?<!\/\s?)\d+\s?\/\s?\d+(?!.*[#>])/g,
    sn: /(?<!\.)(?<!\/\s?)\b(?<!\x1b\[)(\d|[a-fA-F]){16}\b/g,
    mac: /(?<!\.)(?<!\/\s?)\b(?<!\x1b\[)(\d|[a-fA-F]){2}(\.|\:)?(\d|[a-fA-F]){2}(\.|\:|\-)?(\d|[a-fA-F]){2}(\.|\:)?(\d|[a-fA-F]){2}(\.|\:|\-)?(\d|[a-fA-F]){2}(\.|\:)?(\d|[a-fA-F]){2}\b/g,
    number: /(?<!\.)(?<!\/\s?)\b(?<!\x1b\[)(?<!\-)\d+(\-\d+)*[hms]?\b(?![\.\/])/g,
    float: /(?<!-\d*)\d+\.\d+/g,
    port: /(?<!\.)\b[eg]\d+\b(?!\.)/g,
    ontFirst: /\bont first\b/g,
    los : /\b(LOSi\/LOBi|LOFi|LOSi|LOS|SFi)\b/g,
    reset : /\breset\b/g,
    snString : /\b(TPLG|HWTC|ZTEG|NGPN|ALCL|FGTM)\w+\b/g,
    dyingGasp : /\bdying-gasp\b/g,
    stateOnline : /\b(online|normal|match|active|Enabled|Full|Up)\b/gi,
    stateNormal : /\b(initial|Auto)\b/gi,
    stateOffline : /\b(offline|failed|Disabled|Link Down|Down)\b/gi,
    gigaEth : /1000M/g,
    fastEth : /100M/g,
    signal : /-\d+\.\d+/g,
}

const highlights = (data) => data
    .replace(regexps.prompt, (text) => text.green.bold)
    .replace(regexps.sfp, (sfp) => sfp.blue.bold)
    .replace(regexps.intrfs, (intrf) => intrf.yellow)
    .replace(regexps.sn, (n) => n.magenta.bold)
    .replace(regexps.mac, (n) => n.magenta.bold)
    .replace(regexps.number, (n) => n.yellow)
    .replace(regexps.float, (s) => s.yellow)
    .replace(regexps.port, (p) => p.blue.bold)
    .replace(regexps.ontFirst, (s) => s.red.bold)
    .replace(regexps.los, (s) => s.red)
    .replace(regexps.reset, (s) => s.yellow.bold)
    .replace(regexps.snString, (s) => s.magenta.bold)
    .replace(regexps.dyingGasp, (s) => s.green)
    .replace(regexps.stateOnline, (s) => s.green.bold)
    .replace(regexps.stateNormal, (s) => s.yellow.bold)
    .replace(regexps.stateOffline, (s) => s.red.bold)
    .replace(regexps.gigaEth, (s) => '1000'.green.bold + 'M'.bgGreen.black)
    .replace(regexps.fastEth, (s) => '100'.yellow.bold + 'M'.bgGreen.black)
    .replace(regexps.signal, (s) => {
        // Проверяем сигнал
        let num = Number.parseFloat(s);
        if (num < -28) {
            return s.red.bold;
        } else if (num > -25) {
            return s.green.bold;
        } else {
            return s.yellow.bold;
        }
    })
    // .replace(/\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d\+\d\d:\d\d/g, (s) => {
    // 	let now = Date.now();
    // 	let past = Date.parse(s);

    // 	return s + ' ' + now.toLocaleString('ua');
    // })

    module.exports = highlights