const { default: makeWASocket, useMultiFileAuthState, makeInMemoryStore, DisconnectReason, fetchLatestBaileysVersion, useSingleFileAuthState } = require('@whiskeysockets/baileys')
const P = require('pino')
const fs = require('fs')
const path = require('path')
const { Boom } = require('@hapi/boom')

// Pairing code WA
async function startBot() {
    const { state, saveState } = await useSingleFileAuthState('./session.json')
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version,
        printQRInTerminal: false,
        logger: P({ level: 'silent' }),
        auth: state,
        browser: ['Cheall Bot', 'Chrome', '1.0.0']
    })

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr, pairingCode } = update
        if (qr) {
            console.log(`Scan QR untuk masuk:\n${qr}`)
        }
        if (pairingCode) {
            console.log(`Pairing Code WA: ${pairingCode}`)
        }

        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
            if (reason !== DisconnectReason.loggedOut) {
                startBot()
            } else {
                console.log('Logged out.')
            }
        } else if (connection === 'open') {
            console.log('Bot sudah tersambung')
        }
    })

    sock.ev.on('creds.update', saveState)

    // Load semua command dari folder commands
    const commands = new Map()
    const commandsPath = path.join(__dirname, 'commands')
    if (!fs.existsSync(commandsPath)) fs.mkdirSync(commandsPath)
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
    for (const file of commandFiles) {
        const cmd = require(path.join(commandsPath, file))
        if (cmd.name && typeof cmd.execute === 'function') {
            commands.set(cmd.name, cmd)
        }
    }

    // Handler pesan
    sock.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const m = messages[0]
            if (!m.message) return
            const msgType = Object.keys(m.message)[0]
            const content = m.message[msgType]
            const text = content?.text || content?.caption || ''
            const from = m.key.remoteJid
            const sender = m.key.participant || m.key.remoteJid

            if (text.startsWith('.')) {
                const command = text.slice(1).trim().split(' ')[0].toLowerCase()
                if (commands.has(command)) {
                    await commands.get(command).execute(sock, m, [], text)
                }
            }
        } catch (err) {
            console.error('Error processing message:', err)
        }
    })
}

startBot()