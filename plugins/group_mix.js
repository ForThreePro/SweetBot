
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, usedPrefix, text, command, isAdmin, isOwner, quoted }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const react = async (text) => {
    try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
  }

  if (!isAdmin &&!isOwner) {
    await react('💔')
    return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ GRUPO 💖
꒰ ◞⁺⊹ ．${fecha}

── *📝 AVISO* ╏ 🌸
💔 ➛ ¡Oye! Solo los admins pueden tocar mis dulces... digo, el grupo
💖 ➛ Mary solo obedece a admins

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━` }, { quoted: m })
  }

  if (['resetlink', 'revokelink'].includes(command)) {
    try {
      await react('🔗')
      await conn.groupRevokeInvite(m.chat)
      let newLink = await conn.groupInviteCode(m.chat)
      return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗥𝗘𝗦𝗘𝗧𝗟𝗜𝗡𝗞 ・ GRUPO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`REVOCADO\`\` 🍩 —˙𖦹.꒷
💖 El link viejo ya se lo comió Mary

── *🔗 NUEVO LINK* ╏ 🌸
https://chat.whatsapp.com/${newLink}

── *📝 NOTA* ╏ 💖
🍩 ➛ Link fresquito servido
🎀 ➛ Dulce y nuevo como un cupcake

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━` }, { quoted: m })
    } catch (e) {
      await react('❌')
      return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ LINK 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n💔 ➛ ¡Ups! Error al revocar el link\n🔒 ➛ Necesito ser admin para cambiar el link\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖` }, { quoted: m })
    }
  }

  if (['setname', 'setgroupname'].includes(command)) {
    if (!text) {
      await react('❌')
      return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗦𝗘𝗧𝗡𝗔𝗠𝗘 ・ GRUPO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` 🍩 —˙𖦹.꒷

── *📖 USO* ╏ 🌸
➛ ${usedPrefix}setname <nuevo nombre>
💖 ➛ Ejemplo: ${usedPrefix}setname Club de Fans de los Cupcakes

── *📝 NOTA* ╏ 💖
🍩 ➛ No me hagas escribir por gusto...

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━` }, { quoted: m })
    }
    if (text.length > 100) {
      await react('❌')
      return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ NOMBRE 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n💔 ➛ ¡Ese nombre es más largo que mi receta!\n📏 ➛ Máximo 100 caracteres\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖` }, { quoted: m })
    }

    try {
      let oldName = await conn.groupMetadata(m.chat).then(res => res.subject)
      await conn.groupUpdateSubject(m.chat, text)
      await react('✅')
      return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗡𝗢𝗠𝗕𝗥𝗘 ・ CAMBIADO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ACTUALIZADO\`\` 🍩 —˙𖦹.꒷

── *📊 INFO* ╏ 🌸
📛 ➛ Antes: *${oldName}*
✨ ➛ Ahora: *${text}*

── *📝 NOTA* ╏ 💖
💖 ➛ Espero que haya dulces en el nuevo nombre...

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━` }, { quoted: m })
    } catch (e) {
      await react('❌')
      return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ NOMBRE 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n💔 ➛ ¡Ups! No pude cambiar el nombre\n🔒 ➛ Asegúrate de que sea admin\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖` }, { quoted: m })
    }
  }

  if (['setdesc', 'setgroupdesc'].includes(command)) {
    if (!text) {
      await react('❌')
      return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗦𝗘𝗧𝗗𝗘𝗦𝗖 ・ GRUPO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` 🍩 —˙𖦹.꒷

── *📖 USO* ╏ 🌸
➛ ${usedPrefix}setdesc <nueva descripción>

── *💡 EJEMPLO* ╏ 🌸
💖 REGLAS 💖
1. No molestar a Mary
2. Traer dulces obligatorio
3. Ser kawaii siempre

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━` }, { quoted: m })
    }
    if (text.length > 2048) {
      await react('❌')
      return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ DESC 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n💔 ➛ ¡Eso es más largo que mi lista de postres!\n📏 ➛ Máximo 2048 caracteres\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖` }, { quoted: m })
    }

    try {
      await conn.groupUpdateDescription(m.chat, text)
      await react('✅')
      return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗗𝗘𝗦𝗖 ・ ACTUALIZADA 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`GUARDADO\`\` 🍩 —˙𖦹.꒷

── *📊 NUEVA DESCRIPCIÓN* ╏ 🌸
${text}

── *📝 NOTA* ╏ 💖
💖 ➛ ¿Mencionaron dulces?

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━` }, { quoted: m })
    } catch (e) {
      await react('❌')
      return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ DESC 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n💔 ➛ ¡Ups! No pude cambiar la descripción\n🔒 ➛ Dame admin o me voy a hornear...\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖` }, { quoted: m })
    }
  }

  if (['setfoto', 'setppgroup', 'setppgc'].includes(command)) {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (text && /https?:\/\//.test(text)) {
      try {
        await react('🖼️')
        await conn.updateProfilePicture(m.chat, { url: text })
        return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗙𝗢𝗧𝗢 ・ CAMBIADA 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ACTUALIZADO\`\` 🍩 —˙𖦹.꒷
💖 Mary aprobó la nueva foto

── *📝 NOTA* ╏ 💖
🖼️ ➛ Foto instalada con link
🍩 ➛ Espero que sea una foto de dulces...

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━` }, { quoted: m })
      } catch (e) {
        await react('❌')
        return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ FOTO 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n💔 ➛ No pude cambiar la foto con ese link\n🔒 ➛ Asegúrate de que sea válida y sea admin\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖` }, { quoted: m })
      }
    }

    if (/image/.test(mime)) {
      try {
        await react('🖼️')
        let img = await q.download()
        await conn.updateProfilePicture(m.chat, img)
        return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗙𝗢𝗧𝗢 ・ CAMBIADA 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ACTUALIZADO\`\` 🍩 —˙𖦹.꒷
💖 Nueva foto del grupo instalada

── *📝 NOTA* ╏ 💖
🍩 ➛ Si no es dulce me decepciono...
🎀 ➛ Lo kawaii siempre gana

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━` }, { quoted: m })
      } catch (e) {
        await react('❌')
        return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ FOTO 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n💔 ➛ ¡Ups! No pude cambiar la foto\n🔒 ➛ Dame admin o me voy a comer dulces\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖` }, { quoted: m })
      }
    } else {
      await react('❌')
      return conn.sendMessage(m.chat, { text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗦𝗘𝗧𝗙𝗢𝗧𝗢 ・ GRUPO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` 🖼️ —˙𖦹.꒷

── *📖 USO* ╏ 🌸
1. Responde a una imagen con ${usedPrefix}setfoto
2. ${usedPrefix}setfoto <link de imagen>
💖 ➛ Mary quiere ver dulces porfi

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━` }, { quoted: m })
    }
  }
}

handler.help = ['resetlink', 'setname', 'setdesc', 'setfoto']
handler.tags = ['group']
handler.command = ['resetlink', 'revokelink', 'setname', 'setgroupname', 'setdesc', 'setgroupdesc', 'setfoto', 'setppgroup', 'setppgc']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler