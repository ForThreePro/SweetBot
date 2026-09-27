import fs from 'fs'
import path from 'path'
import moment from 'moment-timezone'
moment.locale('es')

const DB_FOLDER = './src/database/listas'

if (!fs.existsSync(DB_FOLDER)) fs.mkdirSync(DB_FOLDER, { recursive: true })

let handler = async (m, { conn, text }) => {
    const chatId = m.chat
    const db = path.join(DB_FOLDER, `${chatId}.json`)
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const ownerNum = '573044563583'

    if (!fs.existsSync(db)) fs.writeFileSync(db, JSON.stringify([]))

    let data = JSON.parse(fs.readFileSync(db))

    let now = moment.tz('America/Lima')
    let fechaFormato = now.format('dddd, DD/MM/YYYY')
    let diaSemana = now.format('dddd').toLowerCase()

    let diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    if (m.message?.extendedTextMessage?.text?.includes('verlista') || m.text?.includes('verlista')) {
        await react('📋')
        let tabla = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗟𝗜𝗦𝗧𝗔 𝗦𝗘𝗠𝗔𝗡𝗔𝗟 ・ LISTA 💖
꒰ ◞⁺⊹ ．${fechaFormato}

.⃟𖥔 ݁. 𖦹˙— \`\`REGISTROS\`\` 📅 —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🌸
🍬 ➛ Periodo: *Lunes a Sábado*
🕒 ➛ Actualizado: *${fechaFormato}*
💖 ➛ Mary controlando la lista

━━━━━━━━━━━
`

        diasSemana.forEach(dia => {
            let anotadosDelDia = data.filter(v => v.dia.toLowerCase().includes(dia))
            tabla += `── *${dia.toUpperCase()}* ╏ 🌸\n`

            if (anotadosDelDia.length === 0) {
                tabla += `🍪 ➛ Sin anotados - Mary horneando\n\n`
            } else {
                anotadosDelDia.forEach((v, i) => {
                    tabla += `${i+1}️⃣ ➛ *${v.nombre}* [${v.rol}]\n`
                    tabla += `   🍭 ➛ ${v.numero}\n`
                    tabla += `   📅 ➛ ${v.dia}\n\n`
                })
            }
        })
        tabla += `━━━━━━━━━━━
🍩 ➛ Total: *${data.length}* registro${data.length !== 1 ? 's' : ''}
💖 ➛ Lista supervisada por Mary

🌸 *SWEET BOT - Creado por Mary* 💖
👑 *Creadora:* Mary 🍩
🍭 +57 3044563583 🍬`
        return conn.sendMessage(m.chat, { text: tabla.trim(), mentions: [ownerNum + '@s.whatsapp.net'] }, { quoted: m })
    }

    if (m.message?.extendedTextMessage?.text?.includes('lista') || m.text?.includes('lista')) {
        if (!diasSemana.includes(diaSemana)) {
            await react('⛔')
            let fueraHorario = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗙𝗨𝗘𝗥𝗔 𝗗𝗘 𝗛𝗢𝗥𝗔𝗥𝗜𝗢 ・ LISTA 💖
꒰ ◞⁺⊹ ．${fechaFormato}

.⃟𖥔 ݁. 𖦹˙— \`\`AVISO\`\` ⛔ —˙𖦹.꒷

── *📝 AVISO* ╏ 🌸
❌ ➛ Solo se puede anotar de
❌ ➛ *Lunes a Sábado*
🍪 ➛ Domingo Mary descansa

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
            return conn.sendMessage(m.chat, { text: fueraHorario }, { quoted: m })
        }

        if (!text) {
            await react('❌')
            let formato = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗙𝗢𝗥𝗠𝗔𝗧𝗢 ・ LISTA 💖
꒰ ◞⁺⊹ ．${fechaFormato}

.⃟𖥔 ݁. 𖦹˙— \`\`USO\`\` 📝 —˙𖦹.꒷

── *📖 USO* ╏ 🌸
➛ Envía: .lista Nombre/Numero/Premio

── *💡 EJEMPLO* ╏ 🌸
➛ .lista Mary/+57 304 456 3583/Dulce
🍩 ➛ Premio: pastelitos infinitos

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
            return conn.sendMessage(m.chat, { text: formato }, { quoted: m })
        }

        let [nombre, numero, rol] = text.split('/').map(v => v.trim())
        if (!nombre ||!numero ||!rol) {
            await react('❌')
            let faltan = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗙𝗔𝗟𝗧𝗔𝗡 𝗗𝗔𝗧𝗢𝗦 ・ LISTA 💖
꒰ ◞⁺⊹ ．${fechaFormato}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷

── *📖 FORMATO* ╏ 🌸
➛ Nombre/Numero/Rol
💔 ➛ Mary: "Faltan datos como faltan dulces"

── *💡 EJEMPLO* ╏ 🌸
➛ fetsy/618282/bot

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
            return conn.sendMessage(m.chat, { text: faltan }, { quoted: m })
        }

        let yaAnotado = data.find(v => v.numero === numero && v.dia === fechaFormato)
        if (yaAnotado) {
            await react('⚠️')
            let duplicado = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗬𝗔 𝗔𝗡𝗢𝗧𝗔𝗗𝗢 ・ LISTA 💖
꒰ ◞⁺⊹ ．${fechaFormato}

.⃟𖥔 ݁. 𖦹˙— \`\`AVISO\`\` ⚠️ —˙𖦹.꒷

── *📝 AVISO* ╏ 🌸
⚠️ ➛ ${nombre} ya fue anotado hoy
📅 ➛ *${fechaFormato}*
💖 ➛ Mary dice: ya está en la lista

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
            return conn.sendMessage(m.chat, { text: duplicado }, { quoted: m })
        }

        data.push({ nombre, numero, rol, dia: fechaFormato })
        fs.writeFileSync(db, JSON.stringify(data, null, 2))
        await react('✅')

        let ok = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗔𝗡𝗢𝗧𝗔𝗗𝗢 ・ LISTA 💖
꒰ ◞⁺⊹ ．${fechaFormato}

.⃟𖥔 ݁. 𖦹˙— \`\`REGISTRO\`\` ✅ —˙𖦹.꒷

── *📊 DATOS* ╏ 🌸
👑 ➛ Nombre: *${nombre}*
🍭 ➛ Número: *${numero}*
💼 ➛ Rol: *${rol}*
📅 ➛ Día: *${fechaFormato}*
💖 ➛ Aprobado por Mary

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: ok }, { quoted: m })
    }
}

handler.help = ['lista nombre/numero/premio', 'verlista']
handler.tags = ['sorteos']
handler.command = /^(lista|verlista)$/i
handler.group = true
export default handler