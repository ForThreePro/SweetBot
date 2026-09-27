import axios from 'axios'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    let user = `@${m.sender.split('@')[0]}`
    let groupName = m.isGroup? (await conn.groupMetadata(m.chat)).subject : 'Privado'
    const APIKEY = 'proyectsV2'

    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    if (!text) {
        await react('❌')
        let error = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ YOUTUBE 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷

── *📝 AVISO* ╏ 🌸
❌ ➛ ¿Qué deseas buscar en YouTube?
💖 ➛ Mary dice: escribe algo porfi

── *💡 EJEMPLO* ╏ 🌸
➛.ytsearch recetas dulces

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }

    await react('🔍')
    await m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗕𝗨𝗦𝗖𝗔𝗡𝗗𝗢 ・ YOUTUBE 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`BUSCANDO\`\` 🔍 —˙𖦹.꒷

── *📊 ESTADO* ╏ 🌸
🔍 ➛ Buscando: *${text}*
⏳ ➛ Conectando a StellarWA...
💖 ➛ Mary buscando mientras hornea

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`)

    try {
        let { data } = await axios.get(`https://api.stellarwa.xyz/search/yt?query=${encodeURIComponent(text)}&key=${APIKEY}`)

        if (!data.status ||!data.result || data.result.length === 0) {
            await react('❌')
            let vacio = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗦𝗜𝗡 𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢𝗦 ・ YOUTUBE 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`VACIO\`\` 📭 —˙𖦹.꒷

── *📝 AVISO* ╏ 🌸
🍪 ➛ No se encontraron resultados para: *${text}*
💔 ➛ Mary no encontró ni las migajas

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
            return conn.sendMessage(m.chat, { text: vacio }, { quoted: m })
        }

        let res = data.result.slice(0, 5).map((v, i) => 
`── *${i+1}* ╏ 🌸
📺 ➛ *${v.title}*
⏱️ ➛ Duración: *${v.duration}*
👁️ ➛ Vistas: *${v.views}*
👤 ➛ Canal: *${v.author}*
🔗 ➛ ${v.url}`).join('\n\n')

        let caption = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗧𝗢𝗣 𝟱 ・ RESULTADOS 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`RESULTADOS\`\` 📺 —˙𖦹.꒷

── *📊 BÚSQUEDA* ╏ 🌸
🔎 ➛ ${text}

${res}

━━━━━━━━━━━
── *📋 INFORMACIÓN* ╏ 🌸
👤 ➛ Solicitado por: ${user}
👥 ➛ Grupo: *${groupName}*
💖 ➛ Buscado por Mary

── *💡 TIP* ╏ 🌸
➛.ytmp4 + link
➛.ytmp3 + link

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
👑 *Creadora:* Mary 🍩
━━━━━━━━━━━`

        await conn.sendMessage(m.chat, { text: caption, mentions: [m.sender] }, { quoted: m })
        await react('✅')
    } catch (e) { 
        console.error(e)
        await react('❌')
        let error = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ YOUTUBE 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷

── *📝 AVISO* ╏ 🌸
❌ ➛ Error al conectar con StellarWA
🔧 ➛ Intenta más tarde
💖 ➛ Mary dice: el api se fue a hornear

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }
}

handler.help = ['yts <busqueda>']
handler.tags = ['búsqueda']
handler.command = /^(yts|ytsearch)$/i
export default handler