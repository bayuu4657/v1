
const fs = require('fs');
const path = require('path');
module.exports = (sock, m, text, commands) => {
  const prefix = '.';
  if (!text.startsWith(prefix)) return;
  const args = text.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  if (commands.has(command)) {
    commands.get(command).execute(sock, m, args, text).catch(err => console.error(err));
  }
};
