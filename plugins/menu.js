import moment from 'moment-timezone'
import os from 'os'
moment.locale('es')

const CATEGORY_META = {
info: 'INFO', descargas: 'DESCARGAS', buscadores: 'BÚSQUEDA',
grupo: 'GRUPOS', fun: 'DIVERSIÓN', ia: 'INTELIGENCIA',
tools: 'HERRAMIENTAS', sticker: 'STICKERS', config: 'CONFIG',
owner: 'OWNER', main: 'GENERAL', game: 'JUEGOS', rpg: 'RPG',
anime: 'ANIME', internet: 'INTERNET', image: 'IMÁGENES'
}

const ICONOS_CATEGORIA = {
info: 'ℹ️', descargas: '⬇️', buscadores: '🔍', grupo: '👥',
fun: '😂', ia: '🤖', tools: '🛠️', sticker: '🧩',
config: '⚙️', owner: '👑', main: '📋', game: '🎮',
rpg: '⚔️', anime: '🍥', internet: '🌐', image: '🖼️'
}

const TOP_COMANDOS = ['.play', '.sticker', '.ia', '.menu', '.ytmp4']

const FRASES_MARY = [
"Odía los lunes... ama los dulces",
"Dame un cupcake o dame sueño",
"5 minutos más horneando",
"Hoy toca comer postres hasta explotar",
"Si no hay dulces, me voy",
"La dulzura es mi superpoder",
"Sweet Bot - Donde Mary manda 💖",
"Más dulce que Mary un domingo"
]

let handler = async (m, { conn }) => {
try {
let start = performance.now()
await conn.sendMessage(m.chat, { react: { text: '💖', key: m.key } })

const fecha = moment.tz('America/Lima').format('dddd')
const fecha2 = moment.tz('America/Lima').format('DD [de] MMMM [de] YYYY')
const hora = moment.tz('America/Lima').format('hh:mm:ss a')
const uptime = process.uptime()
const dias = Math.floor(uptime / 86400)
const horas = Math.floor((uptime % 86400) / 3600)
const minutos = Math.floor((uptime % 3600) / 60)
const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
const totalram = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)
const plugins = Object.values(global.plugins || {}).filter(p =>!p?.disabled)
const pluginsCount = plugins.length
const totalUsers = Object.keys(global.db.data.users || {}).length

const byTag = {}
for (const plugin of plugins) {
  const tags = Array.isArray(plugin.tags)? plugin.tags : (plugin.tags? [plugin.tags] : [])
  const helps = Array.isArray(plugin.help)? plugin.help : (plugin.help? [plugin.help] : [])
  for (const tag of tags) {
    const t = tag.toLowerCase()
    if (!byTag[t]) byTag[t] = new Set()
    for (const h of helps) if (typeof h === 'string' && h.trim()) byTag[t].add(h.trim())
  }
}

const userName = m.pushName || 'Usuario'
const IMG_MENU = 'https://files.evogb.win/2oSeLs.jpg'
const ping = Math.round(performance.now() - start)
const ownerNum = global.owner?.[0]?.[0] || '51927174369'
const CANAL_LINK = 'https://whatsapp.com/channel/0029Vb8emrOJuyACodGSbP0z'

const hourNow = moment.tz('America/Lima').hour()
let saludo = hourNow < 12? 'Buenos días' : hourNow < 18? 'Buenas tardes' : 'Buenas noches'
const fraseRandom = FRASES_MARY[Math.floor(Math.random() * FRASES_MARY.length)]
const estadoBot = dias > 0? `Estable • ${dias}d ${horas}h` : `Estable • ${horas}h ${minutos}m`

const EMOJIS_EXTRA = ['📌', '🎯', '🎨', '💎', '🔮', '🚀', '💡', '🎪', '🎭', '🏆']
let emojiIndex = 0

let menuTexto = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗩𝗘𝗥𝗦𝗜𝗢𝗡 ・ 3.0 SWEET EDITION 💖
꒰ ◞⁺⊹ ．estado: *${estadoBot}* • Ping: ${ping}ms

  ꒱ ׁ. ᘏ 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 ׅ 𝆬 ָ֢ ෆ
💖 ࣪ ꕀ ${saludo} @${userName}. ˚. ᵎᵎ
> *"${fraseRandom}"*

📢 *CANAL OFICIAL*
${CANAL_LINK}
> _Únete para recibir actualizaciones_

──🔥 *TOP COMANDOS* ╏ Más usados
${TOP_COMANDOS.map((c,i) => `${i+1}. ${c}`).join(' | ')}

──🌸 *INFORMACION* ╏ 💖
*Usuarios*: ${totalUsers} | *Comandos*: ${pluginsCount}
*Owner*: @${ownerNum}
*RAM*: ${ram}mb/${totalram}gb
*Edición*: Sweet Bot x Mary

 ׅ 埃斯 : 𝖲𝖨𝖲𝖳𝖤𝖬𝖠 ﹙ 💻 ﹚
*${fecha}* ─ ${fecha2} ─ ${hora}

> ❍ Usa. antes de cada comando 💖

`

const ordenPrioridad = ['info', 'descargas', 'buscadores', 'grupo', 'fun', 'ia', 'tools', 'sticker', 'game', 'rpg', 'anime', 'internet', 'image', 'config', 'owner', 'main']
const tagsOrdenados = [...new Set([...ordenPrioridad,...Object.keys(byTag)])].filter(t => byTag[t])

for (const tag of tagsOrdenados) {
  const set = byTag[tag]
  if (!set || set.size === 0) continue
  const cmds = [...set].sort()

  const icono = ICONOS_CATEGORIA[tag] || EMOJIS_EXTRA[emojiIndex++ % EMOJIS_EXTRA.length]
  const nombreCat = CATEGORY_META[tag] || tag.toUpperCase()

  menuTexto += `.⃟𖥔 ݁. 𖦹˙— \`\`${nombreCat}\`\` [${cmds.length}] ${icono} —˙𖦹.꒷\n`
  for (const c of cmds) {
    menuTexto += ` ${icono} ➛.${c}\n`
  }
  menuTexto += ` ㅤ└──.✦ ── ⊰ ̟!!.✦. ˙\n\n`
}

menuTexto += `━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
*Owner*: @${ownerNum}
*Version*: 3.0 SWEET EDITION
*${CANAL_LINK}*

> "Dame un cupcake o dame sueño" 💖
> "Sweet Bot - Donde Mary manda"
━━━━━━━━━━━`

await conn.sendMessage(m.chat, {
  image: { url: IMG_MENU },
  caption: menuTexto.trim(),
  mentions: [m.sender, `${ownerNum}@s.whatsapp.net`]
}, { quoted: m })

} catch (e) {
await conn.sendMessage(m.chat, { text: `💖 *ERROR SWEET*: ${e.message}\n🍩 Se le quemó el cupcake al bot...` }, { quoted: m })
}
}

handler.help = ['menu']
handler.tags = ['info']
handler.command = ['menu', 'help', 'menú']

export default handler