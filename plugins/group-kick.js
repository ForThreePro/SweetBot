import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, participants }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    let mentionedJid = m.mentionedJid && m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : null

    if (!mentionedJid) {
        await react('❌')
        let error = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗫𝗣𝗨𝗟𝗦𝗔𝗥 ・ USUARIO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` 👢 —˙𖦹.꒷

── *📖 USO* ╏ 🌸
➛ Menciona a un usuario
➛ Responde al mensaje del usuario
💖 ➛ Mary: apunta bien porfi

── *📝 AVISO* ╏ 🌸
🔒 ➛ Solo admins

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }

    try {
        let groupMetadata = await conn.groupMetadata(m.chat)
        let ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
        let ownerBot = global.owner[0][0] + '@s.whatsapp.net'

        let user = participants.find(p => p.id === mentionedJid)
        let isAdmin = user?.admin

        if (mentionedJid === conn.user.jid) {
            await react('❌')
            return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ KICK 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n❌ ➛ No puedo eliminarme a mí mismo\n💖 ➛ Mary no se auto-banea\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖` }, { quoted: m })
        }
        if (mentionedJid === ownerGroup) {
            await react('❌')
            return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ KICK 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n❌ ➛ No puedo expulsar al propietario del grupo\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖` }, { quoted: m })
        }
        if (mentionedJid === ownerBot) {
            await react('❌')
            return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ KICK 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n❌ ➛ No puedo expulsar al dueño del bot\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖` }, { quoted: m })
        }
        if (isAdmin) {
            await react('❌')
            return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ KICK 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n❌ ➛ No puedo expulsar a un administrador\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖` }, { quoted: m })
        }

        await react('👢')
        await conn.groupParticipantsUpdate(m.chat, [mentionedJid], 'remove')

        let kickMsg = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗫𝗣𝗨𝗟𝗦𝗔𝗗𝗢 ・ USUARIO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`EXITO\`\` 👢 —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🌸
👢 ➛ Usuario: @${mentionedJid.split('@')[0]}
👑 ➛ Por: @${m.sender.split('@')[0]}
💖 ➛ Mary le dio su patada dulce

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        conn.sendMessage(m.chat, { text: kickMsg, mentions: [mentionedJid, m.sender] }, { quoted: m })
    } catch (e) {
        await react('❌')
        let error = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ KICK 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷

── *📝 AVISO* ╏ 🌸
❌ ➛ Se ha producido un problema
🔧 ➛ ${e.message}
🍪 ➛ Mary se quedó horneando

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }
}

handler.help = ['kick @user']
handler.tags = ['grupo']
handler.command = ['kick', 'echar', 'hechar', 'sacar', 'ban']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler