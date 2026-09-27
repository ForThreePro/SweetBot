import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    let user = m.sender
    let nombre = conn.getName(user)
    let groupName = await conn.getName(m.chat)

    if (!m.isGroup) {
        let error = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ SALIR 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷

── *📝 AVISO* ╏ 🌸
❌ ➛ Este comando solo funciona en grupos
🍪 ➛ Mary no sale de su pastelería, solo de grupos

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }

    let miNumero = '573044563583@s.whatsapp.net'
    if (user!== miNumero) {
        let error = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗔𝗖𝗘𝗦𝗢 𝗗𝗘𝗡𝗘𝗚𝗔𝗗𝗢 ・ SALIR 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 🔒 —˙𖦹.꒷

── *📝 AVISO* ╏ 🌸
🔒 ➛ Este comando es exclusivo de la dueña
💖 ➛ Solo Mary puede irse a hornear

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }

    let pp
    try {
        pp = await conn.profilePictureUrl(user, 'image')
    } catch {
        pp = 'https://files.evogb.win/YhR5LZ.jpg'
    }

    let texto = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗗𝗘𝗦𝗣𝗘𝗗𝗜𝗗𝗔 ・ ADIOS 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`SALIENDO\`\` 👋 —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🌸
👋 ➛ *${nombre}* se despide de: *${groupName}*
💖 ➛ Mary se va por más dulces

── *📝 MENSAJE* ╏ 🌸
✨ ➛ Gracias por la confianza depositada
✨ ➛ Cada momento compartido en este grupo
✨ ➛ Por elegirnos como su Bot #1 de WhatsApp 2026
🍩 ➛ Me llevo los mejores recuerdos y olor a pastelitos
💌 ➛ Si necesitan volver a contar conmigo, aquí estaré
🌸 ➛ Amo los dulces, y amo este grupo

── *📞 SOPORTE* ╏ 🌸
🍭 ➛ Soporte 24/7: *+57 3044563583*
🍬 ➛ Soporte con dulces incluidos

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
👑 *Creadora:* Mary 🍩
━━━━━━━━━━━`

    await conn.sendMessage(m.chat, {
        image: { url: pp },
        caption: texto,
        mentions: [user]
    })

    await conn.sendMessage(m.chat, { text: `🍩 Saliendo en 3... Mary terminando pastelitos` })
    await new Promise(r => setTimeout(r, 1000))
    await conn.sendMessage(m.chat, { text: `🍭 Saliendo en 2... Guardando recetas` })
    await new Promise(r => setTimeout(r, 1000))
    await conn.sendMessage(m.chat, { text: `💖 Saliendo en 1... Adiós, dulces sueños!` })
    await new Promise(r => setTimeout(r, 1000))

    await conn.groupParticipantsUpdate(m.chat, [user], "remove")
}

handler.help = ['salir']
handler.tags = ['owner']
handler.command = /^salir$/i
handler.group = true
handler.botAdmin = true
export default handler