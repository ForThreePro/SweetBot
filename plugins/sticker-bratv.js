import { sticker } from '../lib/sticker.js'
import axios from 'axios'
import moment from 'moment-timezone'
moment.locale('es')

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const fetchStickerVideo = async (text) => {
  const response = await axios.get(`https://skyzxu-brat.hf.space/brat-animated`, {
    params: { text },
    responseType: 'arraybuffer'
  })
  if (!response.data) throw new Error('Error al obtener el video de la api.')
  return response.data
}

const handler = async (m, { conn, text }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const react = async (text) => {
    try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
  }

  try {
    let userId = m.sender
    let packstickers = global.db.data.users[userId] || {}
    let texto1 = packstickers.text1 || global.packsticker || 'SWEET BOT'
    let texto2 = packstickers.text2 || global.packsticker2 || 'MARY EDITION 💖'

    text = m.quoted?.text || text
    if (!text) {
      await react('❌')
      return conn.sendMessage(m.chat, {
        text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗕𝗥𝗔𝗧𝗩 ・ ERROR 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR DE USO\`\` ⚠️ —˙𖦹.꒷

── *📖 USO* ╏ 🌸
➛ Responde a un mensaje o escribe texto
➛ Ejemplo:.bratv Sweet Bot
💖 ➛ Mary animará tu texto porfi

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
      }, { quoted: m })
    }

    await react('🕒')
    const videoBuffer = await fetchStickerVideo(text)
    const stickerBuffer = await sticker(videoBuffer, null, texto1, texto2)
    await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })
    await react('✅')

  } catch (e) {
    console.error("[BRATV ERROR]:", e)
    await react('❌')
    conn.sendMessage(m.chat, {
      text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗕𝗥𝗔𝗧𝗩 ・ ERROR 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷
💖 Mary se quedó horneando y la API también

── *📝 AVISO* ╏ 🌸
❌ ➛ Se produjo un problema
💡 ➛ La API puede estar caída

── *📊 DETALLE* ╏ 🌸
\`\`${e.message}\`\`

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
    }, { quoted: m })
  }
}

handler.tags = ['sticker']
handler.help = ['bratv <texto>']
handler.command = ['bratv']

export default handler