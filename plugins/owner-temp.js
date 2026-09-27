import fs from 'fs'
import moment from 'moment-timezone'
moment.locale('es')

const filePath = './temp_groups.json'

const OWNER_NUMBERS = [
  '573005337612'
]

if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]')
global.tempGroups = JSON.parse(fs.readFileSync(filePath))

function saveTempGroups() {
  fs.writeFileSync(filePath, JSON.stringify(global.tempGroups, null, 2))
}

setInterval(async () => {
  if (!global.conn) return
  const now = Date.now()
  let toRemove = []

  for (let i of global.tempGroups) {
    const timeLeft = i.exitTime - now
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')

    if (timeLeft <= 300000 && timeLeft > 0 &&!i.warned) {
      try {
        await global.conn.sendMessage(i.id, {
          text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗧𝗘𝗠𝗣𝗢𝗥𝗜𝗭𝗔𝗗𝗢𝗥 ・ AVISO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`5 MINUTOS\`\` ⏰ —˙𖦹.꒷
💖 Mary se está despidiendo...

── *📝 AVISO* ╏ 🌸
⏰ ➛ El bot se saldrá de este grupo en 5 minutos
🍩 ➛ Última porción de dulce servida

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        })
        i.warned = true
        saveTempGroups()
      } catch {}
    }

    if (now >= i.exitTime) {
      let attempts = 0
      while (attempts < 3) {
        try {
          await global.conn.sendMessage(i.id, {
            text: `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗧𝗘𝗠𝗣𝗢𝗥𝗜𝗭𝗔𝗗𝗢𝗥 ・ SALIDA 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`SALIENDO\`\` 👋 —˙𖦹.꒷
💖 Mary se va a hornear a otro grupo

── *📝 AVISO* ╏ 🌸
⏰ ➛ Temporizador finalizado. Saliendo...
🍩 ➛ Gracias por los dulces

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
          })
          await new Promise(r => setTimeout(r, 1500))
          await global.conn.groupLeave(i.id)
          console.log(`[TEMP] Sali del grupo: ${i.name}`)
          break
        } catch (e) {
          attempts++
          await new Promise(r => setTimeout(r, 2000))
        }
      }
      toRemove.push(i.id)
    }
  }

  if (toRemove.length > 0) {
    global.tempGroups = global.tempGroups.filter(v =>!toRemove.includes(v.id))
    saveTempGroups()
  }
}, 30000)

const react = async (conn, m, text) => {
  try { await conn.sendMessage(m.chat, { react: { text, key: m.key } }) } catch {}
}

function msToTime(ms) {
  if (ms < 0) ms = 0
  let d = Math.floor(ms / 86400000)
  let h = Math.floor((ms % 86400000) / 3600000)
  let m = Math.floor((ms % 3600000) / 60000)
  let s = Math.floor((ms % 60000) / 1000)
  let result = []
  if (d > 0) result.push(`${d}d`)
  if (h > 0) result.push(`${h}h`)
  if (m > 0) result.push(`${m}m`)
  if (s > 0 && d === 0) result.push(`${s}s`)
  return result.join(' ') || '0s'
}

function isOwner(m) {
  let sender = m.sender.replace('@s.whatsapp.net', '')
  return OWNER_NUMBERS.includes(sender)
}

let handler = async (m, { conn, args, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')

  if (!isOwner(m)) {
    await react(conn, m, "❌")
    return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ TEMP 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n❌ ➛ No tienes permiso para usar este comando\n💖 ➛ Solo la jefa de Mary puede usar esto\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖`)
  }

  if (command === 'templist') {
    if (global.tempGroups.length === 0) {
      await react(conn, m, "⚠️")
      return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗟𝗜𝗦𝗧𝗔 ・ TEMP 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n⚠️ ➛ No hay grupos con temporizador activo\n🍪 ➛ Mary está sin tareas por ahora\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖`)
    }

    let list = global.tempGroups.map((v, i) => {
      let timeLeft = v.exitTime - Date.now()
      return `│ ${i+1}. *${v.name}*\n│ ⏰ Falta: ${msToTime(timeLeft)}`
    }).join('\n')

    let texto = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗟𝗜𝗦𝗧𝗔 ・ ACTIVA 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`GRUPOS\`\` 📋 —˙𖦹.꒷
💖 Grupos donde Mary está de visita

── *📊 GRUPOS* ╏ 🌸
${list}

── *📝 NOTA* ╏ 🌸
💡 ➛ Usa tempcancel para cancelar
🍩 ➛ Sweet Bot controla todo

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
    await react(conn, m, "📋")
    return m.reply(texto)
  }

  if (!m.isGroup) {
    await react(conn, m, "❌")
    return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ TEMP 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n❌ ➛ Solo funciona en grupos\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖`)
  }

  if (!args[0]) {
    await react(conn, m, "❌")
    let error = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗧𝗘𝗠𝗣𝗢𝗥𝗜𝗭𝗔𝗗𝗢𝗥 ・ FORMATO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`USO\`\` ⏰ —˙𖦹.꒷
💖 Configura cuánto se quedará Mary

── *📖 USO* ╏ 🌸
➛.temporizador 30d
➛.temporizador 5h
➛.temporizador 1d5h30m

── *💡 EJEMPLOS* ╏ 🌸
➛ 1m = 1 minuto
➛ 2h = 2 horas
➛ 3d = 3 días

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
    return m.reply(error)
  }

  let time = args[0].toLowerCase()
  let ms = 0
  let regex = /(\d+)([dhm])/g
  let match
  while ((match = regex.exec(time))!== null) {
    let val = parseInt(match[1])
    let type = match[2]
    if (type === 'd') ms += val * 86400000
    if (type === 'h') ms += val * 3600000
    if (type === 'm') ms += val * 60000
  }
  if (ms < 60000) {
    await react(conn, m, "❌")
    return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ TEMP 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n❌ ➛ Mínimo 1 minuto\n💖 ➛ Mary necesita al menos comer algo porfi\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖`)
  }

  const exitTime = Date.now() + ms
  const groupId = m.chat
  const groupName = await conn.getName(groupId)

  let index = global.tempGroups.findIndex(v => v.id === groupId)
  if (index!== -1) global.tempGroups.splice(index, 1)

  global.tempGroups.push({ id: groupId, name: groupName, exitTime, addedBy: m.sender, warned: false })
  saveTempGroups()

  const fechaSalida = moment.tz(exitTime, 'America/Lima').format('DD/MM/YYYY hh:mm:ss a')

  let ok = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗧𝗘𝗠𝗣𝗢𝗥𝗜𝗭𝗔𝗗𝗢𝗥 ・ ACTIVADO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`PROGRAMADO\`\` ⏰ —˙𖦹.꒷
💖 Mary se quedará un rato

── *📊 INFORMACIÓN* ╏ 🌸
🏠 ➛ Grupo: ${groupName}
⏰ ➛ Salida en: ${msToTime(ms)}
📅 ➛ Fecha: ${fechaSalida}

── *📝 NOTA* ╏ 🌸
🗑️ ➛ Usa tempcancel para cancelar
🍩 ➛ Sweet Bot programó la visita

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
  await react(conn, m, "✅")
  return m.reply(ok)
}

handler.before = async (m, { conn, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  if (command === 'tempcancel') {

    if (!isOwner(m)) {
      await react(conn, m, "❌")
      return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ TEMP 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n❌ ➛ No tienes permiso para usar este comando\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖`)
    }

    if (!m.isGroup) {
      await react(conn, m, "❌")
      return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ TEMP 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n❌ ➛ Solo funciona en grupos\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖`)
    }

    let index = global.tempGroups.findIndex(v => v.id === m.chat)
    if (index === -1) {
      await react(conn, m, "⚠️")
      return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗔𝗩𝗜𝗦𝗢 ・ TEMP 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🌸\n⚠️ ➛ No hay temporizador activo\n━━━━━━━━━━━\n🌸 *SWEET BOT - Creado por Mary* 💖`)
    }

    const groupName = global.tempGroups[index].name
    global.tempGroups.splice(index, 1)
    saveTempGroups()

    let cancel = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗧𝗘𝗠𝗣𝗢𝗥𝗜𝗭𝗔𝗗𝗢𝗥 ・ CANCELADO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ELIMINADO\`\` 🗑️ —˙𖦹.꒷
💖 Mary decidió quedarse más tiempo

── *📊 INFORMACIÓN* ╏ 🌸
🏠 ➛ Grupo: ${groupName}
✅ ➛ Estado: Cancelado

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
    await react(conn, m, "🗑️")
    return m.reply(cancel)
  }
}

handler.help = ['temporizador 30d', 'tempcancel', 'templist'];
handler.tags = ['grupo'];
handler.command = ['temporizador', 'temp', 'tempcancel', 'templist'];
handler.admin = false

export default handler;