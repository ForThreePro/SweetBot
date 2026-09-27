import moment from 'moment-timezone'
moment.locale('es')

const handler = async (m, { conn, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const react = async (text) => {
    try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
  }

  if (!m.mentionedJid[0] &&!m.quoted) {
    await react('❌')
    let texto = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗔𝗗𝗠𝗜𝗡𝗜𝗦𝗧𝗥𝗔𝗖𝗜𝗢𝗡 ・ PROMOTE 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` 👑 —˙𖦹.꒷

── *📖 USO* ╏ 🌸
➛ Menciona a un usuario
➛ Responde al mensaje del usuario
💖 ➛ Mary: menciona porfi

── *💡 EJEMPLOS* ╏ 🌸
➛.promote @user
➛.demote @user

── *📝 AVISO* ╏ 🌸
🔒 ➛ Solo admins
💖 ➛ Solo los que traen dulces

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
    return conn.sendMessage(m.chat, { text: texto }, { quoted: m })
  }

  let user = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted.sender
  let action = command === 'promote' || command === 'promover' || command === 'daradmin'? 'promote' : 'demote'

  await react(action === 'promote'? '👑' : '📉')

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], action)
  } catch {
    await react('❌')
    let error = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ ADMIN 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷

── *📝 AVISO* ╏ 🌸
❌ ➛ No se pudo completar la acción
🔒 ➛ Verifica permisos del bot
🍪 ➛ Mary dice: el bot no es admin porfi

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
    return conn.sendMessage(m.chat, { text: error }, { quoted: m })
  }

  let msgAccion = action === 'promote'
? `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗣𝗥𝗢𝗠𝗢𝗩𝗜𝗗𝗢 ・ NUEVO ADMIN 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`EXITO\`\` 👑 —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🌸
👑 ➛ Nuevo Admin: @${user.split('@')[0]}
👤 ➛ Por: @${m.sender.split('@')[0]}
💖 ➛ Mary aprobó al nuevo admin

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
    : `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗗𝗘𝗚𝗥𝗔𝗗𝗢 ・ QUITAR ADMIN 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`EXITO\`\` 📉 —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🌸
📉 ➛ Ya no es Admin: @${user.split('@')[0]}
👤 ➛ Por: @${m.sender.split('@')[0]}
💖 ➛ Mary le quitó el poder

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`

  await conn.sendMessage(m.chat, { text: msgAccion, mentions: [user, m.sender] }, { quoted: m })
}

handler.help = ['promote @user', 'demote @user']
handler.tags = ['grupo']
handler.command = /^(promote|promover|daradmin|demote|degradar|quitaradmin)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler