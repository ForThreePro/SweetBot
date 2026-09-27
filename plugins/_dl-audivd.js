import { join } from 'path'
import { promises as fs } from 'fs'
import { execFile } from 'child_process'
import { promisify } from 'util'
import moment from 'moment-timezone'
moment.locale('es')

const execFileAsync = promisify(execFile)

const react = async (conn, m, text) => {
  try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
}

const handler = async (m, { conn }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const ownerNum = '573044563583'
    const q = m.quoted? m.quoted : m
    const mime = (q.msg || q).mimetype || ''

    if (!/video/.test(mime)) {
        let menuUso = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗛𝗘𝗥𝗥𝗔𝗠𝗜𝗘𝗡𝗧𝗔 ・ AUDIVD 💖
꒰ ◞⁺⊹ ．${fecha}

  ꒱ ׁ. ᘏ 𝗖𝗢𝗠𝗔𝗡𝗗𝗢 ׅ 𝆬 ָ֢ ෆ
🍭 ࣪ ꕀ.audivd ˚. ᵎᵎ
> *"Sacando el audio como Mary saca pastelitos del horno"*

.⃟𖥔 ݁. 𖦹˙— \`\`HERRAMIENTA\`\` ⚙️ —˙𖦹.꒷

── *📝 DESCRIPCIÓN* ╏ 🌸
🍬 ➛ Extrae el audio de un video
🎀 ➛ Convierte a MP3 192kbps
💖 ➛ Mary escuchando mientras hornea

── *📖 USO* ╏ 🌸
1️⃣ ➛ Responde a un video con:.*audivd*
2️⃣ ➛ O usa el alias:.*audio*

── *📦 FORMATO* ╏ 🌸
⬇️ ➛ Salida: *MP3 44.1kHz Stereo*
🍩 ➛ Calidad dulce premium

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
👑 *Creadora:* Mary 🍩
🍭 +57 3044563583 🍬
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: menuUso, mentions: [ownerNum + '@s.whatsapp.net'] }, { quoted: m })
    }

    let tempVideo
    let tempAudio
    try {
        await react(conn, m, "⏳")
        await m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗣𝗥𝗢𝗖𝗘𝗦𝗔𝗡𝗗𝗢 ・ AUDIVD 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`PROCESANDO\`\` ⚙️ —˙𖦹.꒷

── *📊 ESTADO* ╏ 🌸
🍬 ➛ Descargando video...
🍭 ➛ Extrayendo audio...
⚙️ ➛ Convirtiendo a MP3...
🌸 ➛ Mary espera con dulzura...

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`)

        const videoBuffer = await q.download()
        if (!videoBuffer) throw new Error('No se pudo obtener el buffer del video.')

        const tempDir = join(process.cwd(), './tmp')
        await fs.stat(tempDir).catch(() => fs.mkdir(tempDir, { recursive: true }))

        tempVideo = join(tempDir, `${Date.now()}.mp4`)
        tempAudio = join(tempDir, `${Date.now()}.mp3`)

        await fs.writeFile(tempVideo, videoBuffer)

        await execFileAsync('ffmpeg', [
            '-y',
            '-i', tempVideo,
            '-vn',
            '-ar', '44100',
            '-ac', '2',
            '-b:a', '192k',
            tempAudio
        ], { timeout: 120000 })

        const audioBuffer = await fs.readFile(tempAudio)

        await conn.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: 'audio_extraido.mp3',
            ptt: false
        }, { quoted: m })

        await react(conn, m, "✅")
        let menuOk = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗔𝗗𝗢 ・ AUDIVD 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`RESULTADO\`\` 🍭 —˙𖦹.꒷

── *📊 RESULTADO* ╏ 🌸
✅ ➛ Audio extraído correctamente
🍬 ➛ Formato: *MP3 192kbps*
💖 ➛ Calidad: *44.1kHz Stereo*
🌸 ➛ Mary aprueba este audio

── *📥 DESCARGA* ╏ 🌸
⬇️ ➛ Archivo enviado arriba
🍩 ➛ Listo para escuchar comiendo pastelitos

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: menuOk }, { quoted: m })

    } catch (e) {
        console.error(e)
        await react(conn, m, "❌")
        const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
        let menuErr = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ AUDIVD 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷

── *📝 DESCRIPCIÓN* ╏ 🌸
❌ ➛ ${e.message}
🍪 ➛ Mary se distrajo horneando

── *💡 SOLUCIÓN* ╏ 🌸
🍬 ➛ Usa un video válido
🍬 ➛ Máx 2 minutos recomendado
🍩 ➛ Intenta con menos peso que un pastelito

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: menuErr }, { quoted: m })
    } finally {
        await fs.unlink(tempVideo).catch(() => {})
        await fs.unlink(tempAudio).catch(() => {})
    }
}

handler.help = ['audivd']
handler.tags = ['tools']
handler.command = ['audivd', 'audio']
handler.limit = true
export default handler