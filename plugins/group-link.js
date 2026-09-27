import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    try {
        await react('🔗')
        let link = await conn.groupInviteCode(m.chat)
        let groupMetadata = await conn.groupMetadata(m.chat)

        let texto = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗟𝗜𝗡𝗞 ・ DEL GRUPO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`INVITACIÓN\`\` 🔗 —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🌸
👥 ➛ Grupo: *${groupMetadata.subject}*
💖 ➛ Mary te pasa el link

── *🔗 ENLACE* ╏ 🌸
https://chat.whatsapp.com/${link}

── *📝 NOTAS* ╏ 🌸
🔒 ➛ Solo admins pueden resetear el link
⚠️ ➛ No lo compartas con desconocidos
💖 ➛ Mary lo aprueba

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`

        await conn.sendMessage(m.chat, { text: texto }, { quoted: m })
    } catch (e) {
        await react('❌')
        let error = `🍩🎀 𝗦𝗪𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ LINK 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷

── *📝 AVISO* ╏ 🌸
❌ ➛ No pude obtener el link
🔒 ➛ ¿Soy admin del grupo?
🍪 ➛ Mary dice: hazme admin porfi

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link', 'linkgroup', 'grouplink']
handler.group = true
handler.admin = true

export default handler