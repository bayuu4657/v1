
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const path = require('path');

const loadCommands = () => {
  const commands = new Map();
  const commandsPath = path.join(__dirname, 'commands');
  if (!fs.existsSync(commandsPath)) fs.mkdirSync(commandsPath);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const cmd = require(path.join(commandsPath, file));
    if (cmd.name && typeof cmd.execute === 'function') {
      commands.set(cmd.name, cmd);
    }
  }
  return commands;
};

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    auth: state,
    browser: ['DapszzBot', 'Chrome', '1.0'],
    syncFullHistory: true
  });

  const commands = loadCommands();

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    try {
      const m = messages[0];
      if (!m.message) return;
      const msgType = Object.keys(m.message)[0];
      const content = m.message[msgType];
      const text = content?.text || content?.caption || '';

      require('./case')(sock, m, text, commands);
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr, pairingCode } = update;
    if (qr) console.log('Scan QR code:', qr);
    if (pairingCode) console.log('Pairing code:', pairingCode);
    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (reason !== DisconnectReason.loggedOut) startBot();
      else console.log('Logged out.');
    } else if (connection === 'open') {
      console.log('Bot connected.');
    }
  });
}

startBot();
