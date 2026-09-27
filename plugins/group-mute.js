import moment from 'moment-timezone'
moment.locale('es')

let mutedUsers = new Set()

let handler = async (m, { conn, command, participants }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    let mentionedJid = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : false

    if (!mentionedJid) {
        await react('❌')
        let error = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗦𝗜𝗟𝗘𝗡𝗖𝗜𝗔𝗥 ・ USUARIO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` 🔇 —˙𖦹.꒷

── *📖 USO* ╏ 🌸
➛ Menciona a un usuario
➛ Responde al mensaje del usuario
💖 ➛ Mary: etiqueta o responde porfi

── *💡 COMANDOS* ╏ 🌸
➛.mute @user
➛.unmute @user
➛ Responde con.mute
➛ Responde con.unmute

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }

    let isUserAdmin = participants.find(p => p.id === mentionedJid)?.admin
    if (isUserAdmin) {
        await react('❌')
        return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ MUTE 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n❌ ➛ No puedes silenciar a un administrador\n💖 ➛ Mary protege a los admins\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖` }, { quoted: m })
    }
    if (mentionedJid === conn.user.jid) {
        await react('❌')
        return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ MUTE 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n❌ ➛ No puedo silenciarme a mí mismo\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖` }, { quoted: m })
    }

    if (command === "mute") {
        if (mutedUsers.has(mentionedJid)) {
            await react('⚠️')
            return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗔𝗩𝗜𝗦𝗢 ・ MUTE 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n⚠️ ➛ Este usuario ya está silenciado\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖` }, { quoted: m })
        }
        mutedUsers.add(mentionedJid)
        await react('🔇')

        let muteMsg = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗦𝗜𝗟𝗘𝗡𝗖𝗜𝗔𝗗𝗢 ・ USUARIO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ACTIVADO\`\` 🔇 —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🌸
🔇 ➛ Usuario: @${mentionedJid.split('@')[0]}
👑 ➛ Por: @${m.sender.split('@')[0]}

── *📝 NOTA* ╏ 🌸
🗑️ ➛ Sus mensajes serán eliminados automáticamente
💖 ➛ Mary lo mandó a descansar

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        conn.sendMessage(m.chat, { text: muteMsg, mentions: [mentionedJid, m.sender] }, { quoted: m })
    } else if (command === "unmute") {
        if (!mutedUsers.has(mentionedJid)) {
            await react('⚠️')
            return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗔𝗩𝗜𝗦𝗢 ・ UNMUTE 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n⚠️ ➛ Este usuario no está silenciado\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖` }, { quoted: m })
        }
        mutedUsers.delete(mentionedJid)
        await react('🔊')

        let unmuteMsg = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗗𝗘𝗦𝗜𝗟𝗘𝗡𝗖𝗜𝗔𝗗𝗢 ・ USUARIO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`DESACTIVADO\`\` 🔊 —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🌸
🔊 ➛ Usuario: @${mentionedJid.split('@')[0]}
👑 ➛ Por: @${m.sender.split('@')[0]}

── *📝 NOTA* ╏ 🌸
✅ ➛ Ya puede volver a enviar mensajes
💖 ➛ Mary lo perdonó

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        conn.sendMessage(m.chat, { text: unmuteMsg, mentions: [mentionedJid, m.sender] }, { quoted: m })
    }
}

handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender)) {
        try {
            await conn.sendMessage(m.chat, { delete: m.key })
        } catch (e) {
            console.error(e)
        }
    }
}

handler.help = ['mute @user', 'unmute @user']
handler.tags = ['grupo']
handler.command = /^(mute|unmute)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler