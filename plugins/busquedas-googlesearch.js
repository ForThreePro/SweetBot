import ytSearch from 'yt-search'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    let user = `@${m.sender.split('@')[0]}`
    let groupName = m.isGroup? (await conn.groupMetadata(m.chat)).subject : 'Privado'

    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    if (!text) {
        await react('❌')
        let error = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ BUSCAR 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷

── *📝 AVISO* ╏ 🌸
❌ ➛ ¿Qué quieres buscar?
💖 ➛ Mary: dime que buscar porfi

── *💡 EJEMPLO* ╏ 🌸
➛.google recetas de pastelitos

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
⏳ ➛ Obteniendo resultados...
💖 ➛ Mary buscando con dulzura

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`)

    try {
        let search = await ytSearch(text)
        let results = search.videos.slice(0, 5)

        if (!results.length) {
            await react('❌')
            let vacio = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗦𝗜𝗡 𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢𝗦 ・ BUSCAR 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`VACIO\`\` 📭 —˙𖦹.꒷

── *📝 AVISO* ╏ 🌸
🍪 ➛ No encontré resultados para: *${text}*
💔 ➛ Mary: ni dulces hay

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
            return conn.sendMessage(m.chat, { text: vacio }, { quoted: m })
        }

        let txt = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢𝗦 ・ YOUTUBE 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`TOP 5\`\` 📺 —˙𖦹.꒷

── *📊 BÚSQUEDA* ╏ 🌸
🔎 ➛ ${text}

${results.map((v, i) => {
            return `── *${i + 1}* ╏ 🌸
📺 ➛ *${v.title}*
⏱️ ➛ Duración: *${v.timestamp}*
👁️ ➛ Vistas: *${v.views.toLocaleString()}*
👤 ➛ Canal: *${v.author.name}*
🔗 ➛ ${v.url}`
        }).join('\n\n')}

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
━━━━━━━━━━━`

        await conn.sendMessage(m.chat, { text: txt, mentions: [m.sender] }, { quoted: m })
        await react('✅')

    } catch (e) {
        console.error(e)
        await react('❌')
        let error = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ BUSCAR 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷

── *📝 AVISO* ╏ 🌸
❌ ➛ No se pudo realizar la búsqueda
🔧 ➛ Intenta más tarde
🍪 ➛ Mary se quedó horneando buscando

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }
}

handler.help = ['google <busqueda>']
handler.tags = ['búsqueda']
handler.command = /^google$/i

export default handler