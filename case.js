/*
Base Script Bot Whatsapp By DapszzOfficial
Support Pairing Code
Script No Enc
Youtube: DapszzSamp
*/

require('./config');
const fs = require('fs');
const util = require('util');
const moment = require('moment-timezone');
const { performance } = require('perf_hooks');
const axios = require('axios');

const dbFile = './database/users.json';

// ====== Fungsi load/save user JSON ======
const loadUsers = () => {
  try {
    if (!fs.existsSync(dbFile)) {
      fs.writeFileSync(dbFile, '{}');
    }
    const data = fs.readFileSync(dbFile);
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
};

const saveUsers = (data) => {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
};

// ====== Fungsi format runtime ======
const formatRuntime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs} hour${hrs !== 1 ? 's' : ''}, ${mins} minute${mins !== 1 ? 's' : ''}, ${secs} second${secs !== 1 ? 's' : ''}`;
};

global.startTime = global.startTime || new Date();

const getRuntime = () => {
  const now = new Date();
  const uptime = (now - global.startTime) / 1000;
  return formatRuntime(uptime);
};

module.exports = async (Dapszz, m) => {
  try {
    const body = (
      (m.mtype === 'conversation' && m.message.conversation) ||
      (m.mtype === 'imageMessage' && m.message.imageMessage.caption) ||
      (m.mtype === 'documentMessage' && m.message.documentMessage.caption) ||
      (m.mtype === 'videoMessage' && m.message.videoMessage.caption) ||
      (m.mtype === 'extendedTextMessage' && m.message.extendedTextMessage.text) ||
      (m.mtype === 'buttonsResponseMessage' && m.message.buttonsResponseMessage.selectedButtonId) ||
      (m.mtype === 'templateButtonReplyMessage' && m.message.templateButtonReplyMessage.selectedId)
    ) || '';

    const budy = (typeof m.text === 'string') ? m.text : '';
    const prefixRegex = /^[\u00b0zZ#$@*+,.?=''():\u221a%!\u00a2\u00a3\u00a5\u20ac\u03c0\u00a4\u03a0\u03a6_&><`\u2122\u00a9\u00ae\u0394^\u03b2\u03b1~\u00a6|/\\\u00a9^]/;
    const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : '.';
    const isCmd = body.startsWith(prefix);
    const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
    const args = body.trim().split(/ +/).slice(1);
    const text = q = args.join(" ");
    const sender = m.key.fromMe ? (Dapszz.user.id.split(':')[0] + '@s.whatsapp.net' || Dapszz.user.id) : (m.key.participant || m.key.remoteJid);
    const botNumber = await Dapszz.decodeJid(Dapszz.user.id);
    const senderNumber = sender.split('@')[0];
    const isCreator = (m && m.sender && [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)) || false;
    const pushname = m.pushName || `${senderNumber}`;
    const isBot = botNumber.includes(senderNumber);

    // ====== Simpan user baru ke JSON ======
    let users = loadUsers();
    if (!users[senderNumber]) {
      users[senderNumber] = {
        name: pushname,
        premium: false,
        registered: true,
        lastSeen: new Date().toISOString()
      };
      saveUsers(users);
    }

    // ====== Handle command ======
    switch (command) {
      case "menu": {
        const start = performance.now();

        const imageUrl = 'https://raw.githubusercontent.com/bayuu4657/v1/main/profile.jpg';
        let buffer;

        try {
          const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          buffer = Buffer.from(response.data, 'binary');
        } catch (err) {
          const localPath = './media/profile.jpg';
          if (fs.existsSync(localPath)) {
            buffer = fs.readFileSync(localPath);
          } else {
            return Dapszz.sendMessage(m.chat, { text: '❌ Gagal mengambil gambar dari GitHub & file lokal tidak ditemukan.' }, { quoted: m });
          }
        }

        const now = moment().tz("Asia/Jakarta");
        const wib = now.format("HH : mm : ss");
        const wita = moment().tz("Asia/Makassar").format("HH : mm : ss");
        const wit = moment().tz("Asia/Jayapura").format("HH : mm : ss");
        const hariini = now.format("dddd, DD MMMM YYYY");
        const runtime = getRuntime();
        const totalUser = Object.keys(users).length;

        const end = performance.now();
        const speedSec = Math.floor((end - start) / 1000);
        const speedMs = Math.floor(end - start);

        let teksnya = `
Hai haii Selamat ${now.hour() < 10 ? 'Pagi ☀️' : now.hour() < 15 ? 'Siang 🌤️' : now.hour() < 18 ? 'Sore 🌅' : 'Malam 🏙️'} 👋

*[ I N F O - B O T ]*
*Name*: Dread
*Speed*: ${speedSec} detik / ${speedMs} ms
*totalUser*: ${totalUser}

*[ T I M E ]*
*hariini*: ${hariini}
*wib*: ${wib}
*wita*: ${wita}
*wit*: ${wit}
`;

        await Dapszz.sendMessage(m.chat, {
          image: buffer,
          caption: teksnya,
          footer: `Powered By DapszzOfficial`
        }, { quoted: m });
      }
        break;

      default:
      // Tambahkan handler lain jika dibutuhkan
    }

  } catch (err) {
    console.log(util.format(err));
  }
};

// ====== Auto reload saat file diubah ======
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(`Update ${__filename}`);
  delete require.cache[file];
  require(file);
});