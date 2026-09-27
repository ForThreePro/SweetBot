import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, args, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')

  if (!global.db.data.chats) global.db.data.chats = {}
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  let chat = global.db.data.chats[m.chat]

  let type = ''
  if (command.includes('welcome')) type = 'welcome'
  else if (command.includes('bye')) type = 'bye'
  else if (command.includes('kick')) type = 'kick'
  else return m.reply('❌ Comando no válido')

  let text = args.join(' ').trim()
  let key = `custom${type.charAt(0).toUpperCase() + type.slice(1)}`

  const react = async (text) => {
    try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
  }

  if (command.startsWith('set')) {
    await react('📝')
    if (!text) {
      let uso = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗠𝗘𝗡𝗦𝗔𝗝𝗘 ・ ${type.toUpperCase()} 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` ✏️ —˙𖦹.꒷

── *📖 USO* ╏ 🌸
➛.${command} <texto del mensaje>

── *💡 VARIABLES* ╏ 🌸
👤 ➛ @user = Menciona al usuario
👥 ➛ @group = Nombre del grupo
📄 ➛ @desc = Descripción del grupo
💖 ➛ @mary = Frase dulce de Mary

── *💡 EJEMPLOS* ╏ 🌸
➛.setwelcome Bienvenido @user a @group
➛.setbye Se fue @user de @group
➛.setkick @user fue kickeado de @group

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
      return conn.sendMessage(m.chat, { text: uso }, { quoted: m })
    }

    chat[key] = text
    let ok = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗚𝗨𝗔𝗥𝗗𝗔𝗗𝗢 ・ ${type.toUpperCase()} 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`TEXTO GUARDADO\`\` ✅ —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🌸
✅ ➛ Mensaje de *${type}* guardado
💖 ➛ Mary aprobó el texto

── *📝 VISTA PREVIA* ╏ 🌸
💬 ➛ ${text}

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
    return conn.sendMessage(m.chat, { text: ok }, { quoted: m })
  }

  if (command.startsWith('del')) {
    await react('🗑️')
    if (!chat[key]) {
      let vacio = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗡𝗢 𝗖𝗢𝗡𝗙𝗜𝗚𝗨𝗥𝗔𝗗𝗢 ・ ${type.toUpperCase()} 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`AVISO\`\` 📭 —˙𖦹.꒷

── *📝 AVISO* ╏ 🌸
🍪 ➛ No hay un mensaje de *${type}* personalizado
💔 ➛ Mary dice: no hay nada configurado

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
      return conn.sendMessage(m.chat, { text: vacio }, { quoted: m })
    }

    delete chat[key]
    let del = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗟𝗜𝗠𝗜𝗡𝗔𝗗𝗢 ・ ${type.toUpperCase()} 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`TEXTO ELIMINADO\`\` 🗑️ —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🌸
🗑️ ➛ Mensaje de *${type}* eliminado
✅ ➛ Volverá al mensaje por defecto
💖 ➛ Mary borró el texto y se fue a hornear

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
    return conn.sendMessage(m.chat, { text: del }, { quoted: m })
  }
}

handler.help = ['setwelcome', 'setbye', 'setkick', 'delwelcome', 'delbye', 'delkick']
handler.tags = ['configuración']
handler.command = /^(setwelcome|setbye|setkick|delwelcome|delbye|delkick)$/i
handler.group = true
handler.admin = true
export default handler