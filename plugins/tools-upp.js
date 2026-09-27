import crypto from "crypto"
import { FormData, Blob } from "formdata-node"
import { fileTypeFromBuffer } from "file-type"
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')

  const react = async (text) => {
    try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
  }

  let q = m.quoted? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) {
    await react('❌')
    return conn.reply(m.chat, `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗨𝗣𝗟𝗢𝗔𝗗𝗘𝗥 ・ USO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`COMO USAR\`\` ⚠️ —˙𖦹.꒷

── *📖 INSTRUCCIONES* ╏ 🌸
➛ Responde a una *imagen, video, audio o documento*
➛ Formatos: Imagen | Video | Audio | Doc
💖 ➛ Mary lo subirá a la nube porfi

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`, m)
  }

  try {
    await react('⏳')
    await m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗨𝗣𝗟𝗢𝗔𝗗𝗘𝗥 ・ SUBIENDO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`PROCESANDO\`\` ☁️ —˙𖦹.꒷

── *📊 ESTADO* ╏ 💖
⏳ ➛ Subiendo archivo a la nube evogb.win...
⚡ ➛ Generando enlace...
🍩 ➛ Mary está trabajando... casi

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`)

    let media = await q.download()
    let link = await myCloud(media)
    if (!link.url) throw new Error('Sin URL')

    let txt = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗨𝗣𝗟𝗢𝗔𝗗𝗘𝗥 ・ COMPLETADO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`RESULTADO\`\` ✅ —˙𖦹.꒷
💖 Mary subió tu archivo horneando

── *📊 DATOS DEL ARCHIVO* ╏ 🌸
🔗 ➛ Enlace: ${link.url}
🆔 ➛ ID: ${link.id || 'N/A'}
📦 ➛ Peso: ${formatBytes(media.length)}
🖥️ ➛ Servidor: evogb.win
👤 ➛ SWEET BOT 💖

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`

    await conn.sendFile(m.chat, media, 'sweet-bot-' + crypto.randomBytes(3).toString("hex") + '.' + link.url.split('.').pop(), txt, m)
    await react('✅')
  } catch (e) {
    console.error(e)
    await react('❌')
    await conn.reply(m.chat, `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗨𝗣𝗟𝗢𝗔𝗗𝗘𝗥 ・ ERROR 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷
💖 Se le quemó el cupcake al servidor

── *📝 AVISO* ╏ 🌸
❌ ➛ No se pudo subir el archivo
💡 ➛ El servidor puede estar saturado

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`, m)
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}

async function myCloud(content) {
  const fileType = await fileTypeFromBuffer(content)
  const ext = fileType? fileType.ext : 'bin'
  const mime = fileType? fileType.mime : 'application/octet-stream'
  const formData = new FormData()
  formData.append("file", new Blob([content], { type: mime }), `${crypto.randomBytes(5).toString("hex")}.${ext}`)
  const response = await fetch("https://evogb.win/api/upload", { method: "POST", body: formData })
  if (!response.ok) throw new Error('Error en el servidor')
  return await response.json()
}

handler.help = ['upp', 'tourl'];
handler.tags = ['tools'];
handler.command = ['upp', 'tourl'];
export default handler