/*
Base Script Bot Whatsapp By DapszzOfficial
Support Pairing Code
Script No Enc
Youtube: DapszzSamp
*/

//Settings
global.owner = ["6282197991725"] // Ganti Aja Suqi
global.bot = "6282197991725" // Ganti Aja Suqi
global.namabot = "6282197991725" // Ganti Aja Suqi
global.namaown = "Dapszz Official" // Ganti Aja Suqi

//Log Di Perbarui Suqi
let fs = require('fs')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})