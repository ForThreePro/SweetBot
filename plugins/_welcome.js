import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'
import moment from 'moment-timezone'
moment.locale('es')

const handler = async (m, { conn, args, isAdmin, isOwner }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  if (!isAdmin &&!isOwner) return

  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  if (/on/i.test(args[0])) {
    chat.bienvenida = true
    return conn.sendMessage(m.chat, { text: '🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🟢 Bienvenida activada - Mary despertó 💖' }, { quoted: m })
  } else if (/off/i.test(args[0])) {
    chat.bienvenida = false
    return conn.sendMessage(m.chat, { text: '🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🔴 Bienvenida desactivada - Mary a hornear 🍩' }, { quoted: m })
  }
}

handler.help = ['bienvenida <on/off>']
handler.tags = ['configuración']
handler.command = /^(bienvenida|welcome|bye)$/i
handler.group = true
handler.admin = true

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType ||!m.isGroup) return!0
  const chat = global.db?.data?.chats?.[m.chat]
  if (!chat ||!chat.bienvenida) return!0

  const userJid = m.messageStubParameters?.[0] || m.participant
  if (!userJid) return!0

  const DEFAULT_IMG = 'https://files.evogb.win/2oSeLs.jpg'
  let imgBuffer = null
  try {
    let userPP = await conn.profilePictureUrl(userJid, 'image')
    let res = await fetch(userPP)
    imgBuffer = await res.buffer()
  } catch {
    try {
      let res = await fetch(DEFAULT_IMG)
      imgBuffer = await res.buffer()
    } catch {}
  }

  const userTag = `@${userJid.split('@')[0]}`
  const groupName = groupMetadata.subject
  const groupDesc = groupMetadata.desc || 'Sin descripción'
  const membersCount = groupMetadata.participants.length

  let txt = '', audio = null

  switch (m.messageStubType) {
    case WAMessageStubType.GROUP_PARTICIPANT_ADD:
      audio = chat.audiowelcome
      txt = chat.customWelcome? chat.customWelcome.replace(/@user/gi, userTag).replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc) :
`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗢 ・ WELCOME 💖

👋 ➛ ${userTag} llegó a *${groupName}*
👥 ➛ Miembro N°: *${membersCount}*
🍩 ➛ Mary dice: trae dulces

🌸 *SWEET BOT - Creado por Mary* 💖`
      break
    case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
      audio = chat.audiobye
      txt = chat.customBye? chat.customBye.replace(/@user/gi, userTag).replace(/@group/gi, groupName) :
`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗗𝗘𝗦𝗣𝗘𝗗𝗜𝗗𝗔 ・ BYE 💖

💤 ➛ ${userTag} salió de *${groupName}*
🍪 ➛ Mary: "Uno menos que pide dulces"

🌸 *SWEET BOT - Creado por Mary* 💖`
      break
    case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
      audio = chat.audiokick
      txt = chat.customKick? chat.customKick.replace(/@user/gi, userTag).replace(/@group/gi, groupName) :
`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗫𝗣𝗨𝗟𝗦𝗔𝗗𝗢 ・ KICK 💖

🥊 ➛ ${userTag} fue expulsado de *${groupName}*
💖 ➛ Mary: "Se robó mis dulces"

🌸 *SWEET BOT - Creado por Mary* 💖`
      break
  }

  if (txt) {
    if (imgBuffer) {
      await conn.sendMessage(m.chat, { image: imgBuffer, caption: txt, mentions: [userJid] })
    } else {
      await conn.sendMessage(m.chat, { text: txt, mentions: [userJid] })
    }

    if (audio) {
      try {
        let audioBuffer = typeof audio === 'string'? Buffer.from(audio, 'base64') : audio
        await conn.sendMessage(m.chat, {
          audio: audioBuffer,
          mimetype: 'audio/mpeg',
          ptt: false
        })
      } catch (e) {
        console.log('Error audio:', e)
      }
    }
  }
  return!0
}

export default handler