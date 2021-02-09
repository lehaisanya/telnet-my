const net = require('net')
const highlights = require('./highlights')

/*
    options
        ip: number
        port: number = 23
        highlights: function(string) => string = null
        log: WriteStream = null
        dump: WriteStream = null
        autonext: boolean = false
        dataWait: number = 300
        device: string = "Unknow"
        user: User = null  
*/

const regexp = {
    login: /(Username)|(User name)|(login)\:/gim,
    password: /(Password)|(>>User password)\:/gim,
    guest: /^[^>]*>$/gim,
    enable: /^[^#]*#$/gim,
    more: /More/gim
}

class Telnet {
    constructor (options) {
        this.ip = options.device.ip
        this.port = options.port || 23
        this.highlights = options.highlights || null
        this.log = options.log || null
        this.dump = options.dump || null
        this.autonext = options.autonext || false
        this.dataWait = options.dataWait || 300
        this.user = options.user
        this.device = options.device
        this.middlewares = []

        this.authorize = false
        this.enable = false
        this.tryes = 0
        this.currentData = ''

        const authMiddleware = this.authMiddleware.bind(this)
        const enableMiddleware = this.enableMiddleware.bind(this)
        const moreMiddleware = this.moreMiddleware.bind(this)
        
        this.addMiddleware(authMiddleware, enableMiddleware)
        if (this.autonext) this.addMiddleware(moreMiddleware)

        process.stdout.write(JSON.stringify(this.device) + '\n')

        this.socket = net.createConnection(this.port, this.ip, (error) => {
            if (error) throw error
            this.configSocket()
        })
    }

    configSocket () {
        this.socket.setEncoding('utf-8')
        process.stdin.setRawMode(true)
        process.stdin.pipe(this.socket)
        process.stdin.on('keypress', (ch, key) => {
            if (key.sequence === '\x03') this.close()
        });
        
        if (this.log) socket.pipe(this.log)

        this.socket.on('data', (newData) => {
            // if (this.dump) this.dump()
            process.stdout.write(highlights(newData))
            this.currentData += newData
        })


        this.socket.on('close', () => this.close())
        this.socket.on('error', () => this.close())
        this.socket.on('timeout', () => this.close())

        setInterval(() => {
            this.workData()
        }, this.dataWait)

    }

    // dump () {
    //     const buffer = Array.from(Buffer.from(this.currentData))

    //     buffer.map(charCode => {
    //         switch (charCode) {
    //             case 255: return "<command>"
    //             case ' '.charCodeAt(0): return 
    //         }
    //     })

    //     let res = ''
	// 	for (let i = 0; i < this.currentData.length; i++) {
    //         let char = this.currentData.charAt(i)
    //             .replace(String.fromCharCode(255), )
    //             .replace(' ', '<space>')
    //             .replace('\r', '<return>')
    //             .replace('\n', '<newline>')
	// 		res += `${str.charCodeAt(i)}(${char}) `;
	// 	}
	// 	return JSON.stringify(res).replace(/^"(.*)"$/, '$1') + '\n';
    // }

    addMiddleware (...newMiddlewares) {
        this.middlewares = [...this.middlewares, ...newMiddlewares]
    }

    removeMiddleware (middleware) {
        this.middlewares = this.middlewares.filter(val => val === middleware)
    }

    write (data) {
        this.socket.write(data)
    }

    sendLine (data) {
        this.write(data + '\n')
    }

    writeLogin () {
        this.sendLine(this.user.login)
    }

    writePassword () {
        if (this.user.password instanceof Array) {
            this.sendLine(this.user.password[this.tryes])
            if (this.tryes < this.user.password.length) this.tryes++
        } else {
            this.sendLine(this.user.password)
        }
    }

    authMiddleware (off) {
        if (!this.authorize) {
            if (this.currentData.match(regexp.login)) {
                this.writeLogin()
            } else if (this.currentData.match(regexp.password)) {
                // Задержка нужна ибо у меня были сбои, я решил поставить задержку
                setTimeout(() => { this.writePassword() }, 100)
            } else if (this.currentData.match(regexp.guest)) {
                this.authorize = true
                off()
            }
        }
    }

    enableMiddleware (off) {
        if (this.authorize && !this.enable) {
            if (this.currentData.match(regexp.guest)) {
                switch (this.device.type) {
                    case  'Huawei':
                    case  'BDCOM ':
                        this.sendLine('enable')
                }
            } else if (this.currentData.match(regexp.enable)) {
                this.enable = true
                off()
            }
        }
        
    }

    moreMiddleware (off) {
        if (this.currentData.match(regexp.more)) {
            if (this.device.type === 'Huawei') process.stdout.write('\n')
            this.write(' ')
        }
    }

    workData () {
        for (let middleware of this.middlewares) {
            middleware(() => {
                this.removeMiddleware(middleware)
            })
        }
        
        this.currentData = ''
    }

    close () {
        process.stdout.write('\n')
        process.stdout.write(JSON.stringify(this.device) + '\n')
        process.exit()
    }
}

module.exports = Telnet