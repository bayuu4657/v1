// Silahkan Ubah Sesuka Hati Jangan Hapus Tanda ' ' agar script tidak eror.

const fs = require('fs')
const chalk = require('chalk')

global.owner = '6285190090045'
global.name = 'Lins Official'

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.blueBright(`Update File Terbaru ${__filename}`))
delete require.cache[file]
require(file)
})
/**
  * this script cretae for free
  * don't for to sell
  * youtube @LinsOfficiall
  * insragram @rijalsavior
  * whatsapp 6281911317205
  * © Lins Official
*/