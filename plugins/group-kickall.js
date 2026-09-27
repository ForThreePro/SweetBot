import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const ownerNumber = '51927174369@s.whatsapp.net'

    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    if (m.sender !== ownerNumber) {
        await react('❌')
        return conn.sendMessage(m.chat, { 
            text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗦𝗜𝗦𝗧𝗘𝗠𝗔 ・ ACCESO DENEGADO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`DENEGADO\`\` 🔴 —˙𖦹.꒷
💖 Solo mi dueña puede usar esto porfi

── *📊 INFO* ╏ 🌸
🔒 ➛ Comando: *.kickall*
👑 ➛ Solo: Mary

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`, mentions: [m.sender] }, { quoted: m })
    }

    if (!m.isGroup) return m.reply('💖 Solo en grupos porfi')

    try {
        await react('💖')
        let groupMetadata = await conn.groupMetadata(m.chat)
        let botId = conn.user.jid
        let botLid = conn.user.lid || ''

        // BLINDAJE EXTRA: EL BOT NUNCA SE VA
        let toKick = groupMetadata.participants
            .map(p => p.id)
            .filter(id => {
                if (id === botId) return false
                if (id === botLid) return false
                if (id === ownerNumber) return false
                if (id.includes('51927174369')) return false
                return true
            })

        if (!toKick.length) {
            await react('🍪')
            return m.reply('💖 No hay nadie para sacar porfi, solo estamos tú y yo 🍩')
        }

        await conn.sendMessage(m.chat, { 
            text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗚𝗥𝗨𝗣𝗢 ・ KICKALL INICIADO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`PURGA\`\` 🔴 —˙𖦹.꒷
💖 Sacando a todos menos a la jefa y a Mary porfi

── *📊 INFO* ╏ 🌸
🔴 ➛ Total: *${toKick.length}*
👑 ➛ Se quedan: *Tú y el bot*
💖 ➛ El bot: *NO se sale*

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`, mentions: [m.sender] }, { quoted: m })

        for (let id of toKick) {
            try {
                await conn.groupParticipantsUpdate(m.chat, [id], 'remove')
                await new Promise(r => setTimeout(r, 800))
            } catch {}
        }

        await react('🔥')
        await conn.sendMessage(m.chat, { 
            text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗚𝗥𝗨𝗣𝗢 ・ COMPLETADO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`LIMPIO\`\` 🟢 —˙𖦹.꒷
💖 Listo porfi, solo quedamos nosotros

── *📊 RESULTADO* ╏ 🌸
🗑️ ➛ Eliminados: *${toKick.length}*
👑 ➛ Quedan: *Tú y yo (bot)*

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━` 
        })

    } catch (e) {
        return m.reply(`❌ ${e.message}\n💖 El bot debe ser admin porfi`)
    }
}

handler.help = ['kickall']
handler.tags = ['owner']
handler.command = ['kickall', 'sacartodos', 'kicktodos']
handler.group = true
handler.botAdmin = true

export default handler