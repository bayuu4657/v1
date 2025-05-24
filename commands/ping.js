
module.exports = {
  name: 'ping',
  async execute(sock, m, args, text) {
    await sock.sendMessage(m.key.remoteJid, { text: 'Pong!' });
  }
};
