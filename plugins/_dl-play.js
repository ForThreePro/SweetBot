import fetch from "node-fetch"
import yts from 'yt-search'
import moment from 'moment-timezone'
moment.locale('es')

const react = async (conn, m, text) => {
  try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const ownerNum = '573044563583'

    try {
        if (!text.trim()) {
            let menuUso = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗦 ・ ${command.toUpperCase()} 💖
꒰ ◞⁺⊹ ．${fecha}

  ꒱ ׁ. ᘏ 𝗖𝗢𝗠𝗔𝗡𝗗𝗢 ׅ 𝆬 ָ֢ ෆ
🍭 ࣪ ꕀ.${command} ˚. ᵎᵎ
> *"Buscando música como Mary busca la receta perfecta"*

.⃟𖥔 ݁. 𖦹˙— \`\`DESCARGAS\`\` 📥 —˙𖦹.꒷

── *📝 DESCRIPCIÓN* ╏ 🌸
🍬 ➛ Busca y descarga música de YouTube
🎀 ➛ Envía el audio en MP3
💖 ➛ Mary DJ dulce

── *📖 USO* ╏ 🌸
➛.*${command}* <nombre de canción>
➛.*${command}* <link de YouTube>

── *💡 EJEMPLOS* ╏ 🌸
➛.*play* despacito
➛.*play* https://youtu.be/dQw4w9WgXcQ

── *⏱️ LÍMITE* ╏ 🌸
🍪 ➛ Máx duración: *30 minutos*
🍩 ➛ Como hornear pastelitos

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
👑 *Creadora:* Mary 🍩
🍭 +57 3044563583 🍬
━━━━━━━━━━━`
            return conn.sendMessage(m.chat, { text: menuUso, mentions: [ownerNum + '@s.whatsapp.net'] }, { quoted: m })
        }

        await react(conn, m, '🔍')
        await m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗕𝗨𝗦𝗖𝗔𝗡𝗗𝗢 ・ ${command.toUpperCase()} 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`BUSCANDO\`\` 🔍 —˙𖦹.꒷

── *📊 ESTADO* ╏ 🌸
🔍 ➛ Buscando canción...
🍬 ➛ Obteniendo información...
⬇️ ➛ Preparando descarga...
💖 ➛ Mary afinando oídos...

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`)

        const videoMatch = text.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/|v\/))([a-zA-Z0-9_-]{11})/)
        const query = videoMatch? 'https://youtu.be/' + videoMatch[1] : text
        const search = await yts(query)
        const result = videoMatch? search.videos.find(v => v.videoId === videoMatch[1]) || search.all[0] : search.all[0]
        if (!result) throw new Error('No se encontraron resultados.')

        const { title, thumbnail, timestamp, views, videoId, author, seconds } = result
        if (seconds > 1800) throw new Error('El contenido supera el límite de duración de 30 minutos.')

        const vistas = formatViews(views)
        const canal = author.name
        const shortUrl = `https://youtu.be/${videoId}`
        const thumb = (await conn.getFile(thumbnail)).data

        const [_, mediaUrl] = await Promise.all([
            conn.sendMessage(m.chat, {
                image: thumb,
                caption: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗡𝗖𝗢𝗡𝗧𝗥𝗔𝗗𝗢 ・ ${command.toUpperCase()} 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`RESULTADO\`\` 🍭 —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🌸
🍬 ➛ Título: *${title}*
👑 ➛ Canal: *${canal}*
💖 ➛ Vistas: *${vistas}*
⏱️ ➛ Duración: *${timestamp}*
🔗 ➛ Link: ${shortUrl}
🌸 ➛ Encontrado por Mary

── *📥 DESCARGA* ╏ 🌸
⬇️ ➛ Enviando audio...
🍩 ➛ Preparando tu dulce musical...

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
            }, { quoted: m }),
            getMediaUrl(shortUrl)
        ])

        if (!mediaUrl) throw new Error('No se pudo obtener el audio.')

        await react(conn, m, '📥')
        await conn.sendMessage(m.chat, {
            audio: { url: mediaUrl },
            fileName: `${title}.mp3`,
            mimetype: 'audio/mpeg'
        }, { quoted: m })

        await react(conn, m, '✅')

    } catch (e) {
        await react(conn, m, '❌')
        const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
        let menuErr = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗥𝗢𝗥 ・ ${command.toUpperCase()} 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷

── *📝 DESCRIPCIÓN* ╏ 🌸
❌ ➛ ${e.message}
🍪 ➛ Mary se distrajo horneando

── *💡 SOLUCIÓN* ╏ 🌸
🍬 ➛ Usa un nombre o link válido
🍬 ➛ Máx 30 minutos de duración
🍩 ➛ Intenta con otro sabor dulce

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: menuErr }, { quoted: m })
    }
}

async function getMediaUrl(url) {
    try {
        const res = await fetch(`https://api.sventy.store/api/ytdl?url=${encodeURIComponent(url)}`).then(r => r.json())
        return res.data?.download || null
    } catch {
        return null
    }
}

function formatViews(views) {
    if (views === undefined) return "No disponible"
    if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`
    return views.toString()
}

handler.command = handler.help = ['play', 'yta', 'ytmp3', 'playaudio', 'ytaudio']
handler.tags = ['descargas']
handler.group = true
export default handler