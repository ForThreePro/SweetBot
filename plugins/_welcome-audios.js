import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')

  if (!global.db.data.chats) global.db.data.chats = {}
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  let chat = global.db.data.chats[m.chat]

  let q = m.quoted || m
  let mime = (q.msg || q).mimetype || ''

  let type = ''
  if (command.includes('welcome')) type = 'welcome'
  else if (command.includes('bye')) type = 'bye'
  else if (command.includes('kick')) type = 'kick'
  else return m.reply('❌ Comando no válido')

  const react = async (text) => {
    try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
  }

  if (command.startsWith('audio')) {
    await react('🎵')

    if (!m.quoted) {
      let uso = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗔𝗨𝗗𝗜𝗢 ・ ${type.toUpperCase()} 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷

── *📝 AVISO* ╏ 🌸
❌ ➛ Debes responder a un audio
💖 ➛ Mary dice: responde al audio porfi

── *📖 USO* ╏ 🌸
➛ Envía o reenvía un audio
➛ Responde al audio con:.${command}

── *💡 EJEMPLO* ╏ 🌸
➛ Manda un audio → responde → .${command}

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
      return conn.sendMessage(m.chat, { text: uso }, { quoted: m })
    }

    if (!mime ||!/audio/.test(mime)) {
      await react('❌')
      return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n❌ Responde a un audio válido porfi - Mary quiere escuchar`, { quoted: m })
    }

    let buffer = await q.download()
    chat[`audio${type}`] = buffer.toString('base64')

    let ok = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗚𝗨𝗔𝗥𝗗𝗔𝗗𝗢 ・ ${type.toUpperCase()} 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`AUDIO GUARDADO\`\` ✅ —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🌸
✅ ➛ Audio de *${type}* guardado
🔊 ➛ Se reproducirá cuando alguien ${type === 'welcome'? 'entre' : type === 'bye'? 'salga' : 'sea kickeado'}
💖 ➛ Mary aprobó el audio

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
    return conn.sendMessage(m.chat, { text: ok }, { quoted: m })
  }

  if (command.startsWith('delaudio')) {
    await react('🗑️')
    if (!chat[`audio${type}`]) {
      let vacio = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗡𝗢 𝗖𝗢𝗡𝗙𝗜𝗚𝗨𝗥𝗔𝗗𝗢 ・ ${type.toUpperCase()} 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`AVISO\`\` 📭 —˙𖦹.꒷

── *📝 AVISO* ╏ 🌸
🍪 ➛ No hay un audio de *${type}* configurado
💔 ➛ Mary dice: no hay nada que borrar

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
      return conn.sendMessage(m.chat, { text: vacio }, { quoted: m })
    }

    delete chat[`audio${type}`]
    let del = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗟𝗜𝗠𝗜𝗡𝗔𝗗𝗢 ・ ${type.toUpperCase()} 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`AUDIO ELIMINADO\`\` 🗑️ —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🌸
🗑️ ➛ Audio de *${type}* eliminado
✅ ➛ Ya no se reproducirá
💖 ➛ Mary lo borró horneando

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
    return conn.sendMessage(m.chat, { text: del }, { quoted: m })
  }
}

handler.help = ['audiowelcome', 'audiobye', 'audiokick', 'delaudiowelcome', 'delaudiobye', 'delaudiokick']
handler.tags = ['configuración']
handler.command = /^(audio(welcome|bye|kick)|delaudio(welcome|bye|kick))$/i
handler.group = true
handler.admin = true
export default handler