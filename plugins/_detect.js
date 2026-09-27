
import moment from 'moment-timezone'
moment.locale('es')

let detectEventsRegistered = false

export async function before(m, { conn }) {
  if (!detectEventsRegistered) {
    detectEventsRegistered = true

    conn.ev.on('group-participants.update', async (update) => {
      try {
        let chat = global.db.data.chats[update.id]
        if (!chat?.detect) return

        const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
        let author = update.author || update.participants[0]
        let catalogoImg = { url: 'https://files.evogb.win/EvvgAh.jpg' }

        for (let user of update.participants) {
          if (update.action === 'promote') {
            let txt = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗗𝗘𝗧𝗘𝗖𝗧 ・ ADMIN 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`DADO\`\` 👑 —˙𖦹.꒷

── *👤 ACCION* ╏ 🌸
👑 ➛ Por: @${author.split('@')[0]}
🎀 ➛ Nuevo admin: @${user.split('@')[0]}
💖 ➛ Mary lo aprueba: "Que cuide mis pastelitos"

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
🍭 +57 3044563583 🍩
━━━━━━━━━━━`
            await conn.sendMessage(update.id, {
              image: catalogoImg,
              caption: txt,
              mentions: [author, user]
            })
          }

          if (update.action === 'demote') {
            let txt = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗗𝗘𝗧𝗘𝗖𝗧 ・ ADMIN 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`QUITADO\`\` 💔 —˙𖦹.꒷

── *👤 ACCION* ╏ 🌸
👑 ➛ Por: @${author.split('@')[0]}
💔 ➛ Ex-admin: @${user.split('@')[0]}
🍪 ➛ Mary: "Se quedó sin dulces"

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
🍭 +57 3044563583 🍩
━━━━━━━━━━━`
            await conn.sendMessage(update.id, {
              image: catalogoImg,
              caption: txt,
              mentions: [author, user]
            })
          }
        }
      } catch (e) {
        console.log('Error detect admin:', e)
      }
    })

    conn.ev.on('groups.update', async (updates) => {
      try {
        for (let update of updates) {
          let chat = global.db.data.chats[update.id]
          if (!chat?.detect) continue

          const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
          let author = update.author || 'Desconocido'
          let catalogoImg = { url: 'https://files.evogb.win/EvvgAh.jpg' }

          if (update.subject) {
            let txt = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗗𝗘𝗧𝗘𝗖𝗧 ・ NOMBRE 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`CAMBIADO\`\` 🍬 —˙𖦹.꒷

── *👤 ACCION* ╏ 🌸
👑 ➛ Por: @${author.split('@')[0]}
🍬 ➛ Nuevo: *${update.subject}*
💖 ➛ Mary: "Amo los cambios dulces"

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
🍭 +57 3044563583 🍩
━━━━━━━━━━━`
            await conn.sendMessage(update.id, {
              image: catalogoImg,
              caption: txt,
              mentions: [author].filter(a => a.includes('@'))
            })
          }

          if (update.desc) {
            let txt = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗗𝗘𝗧𝗘𝗖𝗧 ・ DESCRIPCION 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`CAMBIADA\`\` 🍭 —˙𖦹.꒷

── *👤 ACCION* ╏ 🌸
👑 ➛ Por: @${author.split('@')[0]}
🌸 ➛ Nueva: ${update.desc.slice(0, 300) || 'Vacía'}
🍩 ➛ Dulce descripción

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
🍭 +57 3044563583 🍩
━━━━━━━━━━━`
            await conn.sendMessage(update.id, {
              image: catalogoImg,
              caption: txt,
              mentions: [author].filter(a => a.includes('@'))
            })
          }

          if (update.icon || update.picture) {
            let txt = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗗𝗘𝗧𝗘𝗖𝗧 ・ FOTO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`CAMBIADA\`\` 🎀 —˙𖦹.꒷

── *👤 ACCION* ╏ 🌸
👑 ➛ Por: @${author.split('@')[0]}
🎀 ➛ Foto cambiada
💖 ➛ Mary revisando nueva foto

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
🍭 +57 3044563583 🍩
━━━━━━━━━━━`
            await conn.sendMessage(update.id, {
              image: catalogoImg,
              caption: txt,
              mentions: [author].filter(a => a.includes('@'))
            })
          }

          if (update.inviteCode) {
            let txt = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗗𝗘𝗧𝗘𝗖𝗧 ・ LINK 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`RESETEADO\`\` 🔗 —˙𖦹.꒷

── *👤 ACCION* ╏ 🌸
👑 ➛ Por: @${author.split('@')[0]}
🔗 ➛ Nuevo: https://chat.whatsapp.com/${update.inviteCode}
🍬 ➛ Link fresco como pastelito

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
🍭 +57 3044563583 🍩
━━━━━━━━━━━`
            await conn.sendMessage(update.id, {
              image: catalogoImg,
              caption: txt,
              mentions: [author].filter(a => a.includes('@'))
            })
          }
        }
      } catch (e) {
        console.log('Error detect groups:', e)
      }
    })
  }
  return true
}