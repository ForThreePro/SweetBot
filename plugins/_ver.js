import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn }) => {
const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')

if (!m.quoted) {
  let error = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ VER 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷

── *📝 AVISO* ╏ 🌸
❌ ➛ Responde a una imagen/video ViewOnce
💖 ➛ Mary: "Ni veo si no respondes"

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
  return conn.reply(m.chat, error, m)
}

if (!m?.quoted || !m?.quoted?.viewOnce) {
  let error = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ VER 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷

── *📝 AVISO* ╏ 🌸
❌ ➛ El mensaje no es ViewOnce
🍪 ➛ Mary dice: "Eso no se borra solo"

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
  return conn.reply(m.chat, error, m)
}

let buffer = await m.quoted.download(false);

let ok = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗗𝗘𝗦𝗕𝗟𝗢𝗤𝗨𝗘𝗔𝗗𝗢 ・ VIEWONCE 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`EXITO\`\` ✅ —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🌸
✅ ➛ Imagen/Video desbloqueado
💖 ➛ Mary lo vio todo
🍩 ➛ Nada se esconde de los dulces

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`

if (/videoMessage/.test(m.quoted.mtype)) {
  await conn.sendFile(m.chat, buffer, 'media.mp4', m.quoted.caption || ok, m)
} else if (/imageMessage/.test(m.quoted.mtype)) {
  await conn.sendFile(m.chat, buffer, 'media.jpg', m.quoted?.caption || ok, m)
}}

handler.help = ['ver']
handler.tags = ['tools']
handler.command = ['readviewonce', 'read', 'ver'] 
handler.register = false 

export default handler