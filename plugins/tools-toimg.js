import { webp2mp4 } from '../lib/webp2mp4.js'
import { ffmpeg, toAudio } from '../lib/converter.js'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')

  const react = async (text) => {
    try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
  }

  const error = (msg) => {
    return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗜𝗗𝗢𝗥 ・ ERROR 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷

── *📝 AVISO* ╏ 💖
❌ ➛ ${msg}

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`)
  }

  if (['tovid', 'tovideo'].includes(command)) {
    if (!m.quoted) return error('Responde a un *sticker animado*')
    let mime = m.quoted.mimetype || ''
    if (!/webp/.test(mime)) return error('Solo acepto *stickers animados* .webp')
    try {
      await react('⏳')
      let media = await m.quoted.download()
      let out = await webp2mp4(media)
      await conn.sendFile(m.chat, out, 'video.mp4', `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗧𝗢𝗩𝗜𝗗𝗘𝗢 ・ COMPLETADO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`CONVERTIDO\`\` ✅ —˙𖦹.꒷

── *📊 ESTADO* ╏ 🌸
✅ ➛ Conversión completada
🎬 ➛ Sticker animado a Video MP4
👤 ➛ SWEET BOT 💖

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`, m)
      await react('✅')
    } catch (e) {
      console.error(e)
      await react('❌')
      return error('No se pudo convertir el sticker')
    }
  }

  if (['tomp3', 'toaudio'].includes(command)) {
    let q = m.quoted ? m.quoted : m
    let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
    if (!/video|audio/.test(mime)) return error('Responde a un *video* o *nota de voz*')
    try {
      await react('⏳')
      let media = await q.download?.()
      let audio = await toAudio(media, 'mp4')
      await conn.sendFile(m.chat, audio.data, 'audio.mp3', `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗧𝗢𝗠𝗣𝟑 ・ COMPLETADO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`EXTRAIDO\`\` ✅ —˙𖦹.꒷

── *📊 ESTADO* ╏ 🌸
✅ ➛ Audio extraído
🎵 ➛ Formato: MP3
👤 ➛ SWEET BOT 💖

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`, m, null, { mimetype: 'audio/mp4' })
      await react('✅')
    } catch (e) {
      console.error(e)
      await react('❌')
      return error('No se pudo convertir a audio')
    }
  }

  if (['toimg', 'stickerimg', 'simg'].includes(command)) {
    let q = m.quoted ? m.quoted : m
    let isSticker = q.mtype === 'stickerMessage' || (q.mimetype || '').includes('webp')
    if (!isSticker) return error('Responde a un *sticker*')
    try {
      await react('🖼️')
      let media = await q.download()
      await conn.sendMessage(m.chat, { 
        image: media, 
        caption: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗧𝗢𝗜𝗠𝗚 ・ COMPLETADO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`CONVERTIDO\`\` ✅ —˙𖦹.꒷

── *📊 ESTADO* ╏ 🌸
✅ ➛ Conversión completada
🖼️ ➛ Sticker a Imagen JPG
👤 ➛ SWEET BOT 💖

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━` 
      }, { quoted: m })
      await react('✅')
    } catch (e) {
      console.error(e)
      await react('❌')
      error('No pude convertir el *sticker*')
    }
  }
}

handler.help = ['tovid', 'tomp3', 'toimg']
handler.tags = ['tools']
handler.command = ['tovid', 'tovideo', 'tomp3', 'toaudio', 'toimg', 'stickerimg', 'simg']
export default handler