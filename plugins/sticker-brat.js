import fetch from 'node-fetch'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const react = async (text) => {
    try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
  }

  let q = m.quoted ? m.quoted : m
  let txt = text || q.text || q.caption || q.body || ''

  if (!txt) {
    await react('❌')
    return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗕𝗥𝗔𝗧 ・ ERROR 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR DE USO\`\` ⚠️ —˙𖦹.꒷

── *📖 USO* ╏ 🌸
➛ Escribe el texto para generar el sticker
➛ Ejemplo: ${usedPrefix}${command} Sweet Bot

── *💡 NOTA* ╏ 💖
🍩 ➛ Mary hará tu sticker porfi

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`)
  }

  await react('🖌️')

  let apiUrl = `https://api.stellarwa.xyz/tools/brat?text=${encodeURIComponent(txt)}&key=proyectsV2`

  try {
    let response = await fetch(apiUrl)
    if (!response.ok) throw new Error(`API ${response.status}`)

    let inputBuffer = await response.buffer()

    let tmpInput = path.join(tmpdir(), `brat-${Date.now()}.gif`)
    let tmpOutput = path.join(tmpdir(), `brat-${Date.now()}.webp`)

    fs.writeFileSync(tmpInput, inputBuffer)

    await new Promise((resolve, reject) => {
      ffmpeg(tmpInput)
        .frames(1)
        .size('512x512')
        .aspect('1:1')
        .autopad()
        .outputOptions('-vcodec', 'libwebp')
        .outputOptions('-lossless', '0')
        .outputOptions('-q:v', '50')
        .outputOptions('-preset', 'picture')
        .outputOptions('-an')
        .outputOptions('-vsync', '0')
        .toFormat('webp')
        .on('end', () => resolve(true))
        .on('error', (err) => reject(err))
        .save(tmpOutput)
    })

    let stickerBuffer = fs.readFileSync(tmpOutput)

    await conn.sendMessage(m.chat, {
      sticker: stickerBuffer,
      packname: 'SWEET BOT',
      author: 'MARY EDITION 💖'
    }, { quoted: m })

    if (fs.existsSync(tmpInput)) fs.unlinkSync(tmpInput)
    if (fs.existsSync(tmpOutput)) fs.unlinkSync(tmpOutput)
    await react('✅')

  } catch (e) {
    console.error("[BRAT ERROR]:", e)
    await react('❌')
    return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗕𝗥𝗔𝗧 ・ ERROR 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷
💖 Se le quemó el cupcake a la API

── *📝 DETALLE* ╏ 🌸
❌ ➛ ${e.message}
💡 ➛ Ejecuta: apt install ffmpeg -y

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`)
  }
}

handler.help = ['brat <texto>']
handler.tags = ['sticker']
handler.command = /^brat$/i

export default handler