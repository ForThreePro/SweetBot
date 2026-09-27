import fs from 'fs'
import os from 'os'
import * as googleTTS from 'google-tts-api'
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import { tmpdir } from 'os'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, command, text, usedPrefix }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    // OWNER
    if (command === 'owner' || command === 'creator') {
        let owner = '573005337612@s.whatsapp.net'
        let texto = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗢𝗪𝗡𝗘𝗥 ・ CONTACTO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`INFORMACIÓN\`\` 👑 —˙𖦹.꒷

── *📊 CONTACTO* ╏ 🌸
👑 ➛ Owner: @${owner.split('@')[0]}
📱 ➛ Número: +57 300 5337612
💖 ➛ Estado: Horneando dulces

── *📝 NOTA* ╏ 🌸
💬 ➛ Contacta solo para cosas importantes
🍩 ➛ Sweet Bot a tu servicio

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        await react('👑')
        return conn.sendMessage(m.chat, { text: texto, mentions: [owner] }, { quoted: m })
    }

    // PING
    if (command === 'ping' || command === 'p') {
        let start = new Date * 1
        await conn.reply(m.chat, `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🌸 ┇ 𝗣𝗜𝗡𝗚 ・ CALCULANDO 💖\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📊 ESTADO* ╏ 🌸\n⏳ ➛ Calculando... 💖\n🍩 ➛ Mary está corriendo...`, m)
        let end = new Date * 1
        let speed = end - start
        let texto = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗣𝗜𝗡𝗚 ・ VELOCIDAD 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ESTADO\`\` 📡 —˙𖦹.꒷

── *📊 ESTADÍSTICAS* ╏ 🌸
📡 ➛ Velocidad: ${speed}ms
✅ ➛ Estado: Activo
💖 ➛ Mary: Más rápida que un cupcake

── *📝 NOTA* ╏ 🌸
🌐 ➛ Servidor estable y dulce

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        await react('⚡')
        return conn.sendMessage(m.chat, { text: texto }, { quoted: m })
    }

    if (command === 'cleartmp') {
        const tmpPath = './tmp'
        if (fs.existsSync(tmpPath)) {
            fs.readdirSync(tmpPath).forEach(file => fs.unlinkSync(`${tmpPath}/${file}`))
        }
        let texto = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗟𝗜𝗠𝗣𝗜𝗘𝗭𝗔 ・ CACHE 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`LIMPIADO\`\` 🗑️ —˙𖦹.꒷

── *📊 RESULTADO* ╏ 🌸
🗑️ ➛ Caché temporal eliminado
💾 ➛ Memoria liberada con éxito
💖 ➛ Mary limpió su cocina

── *📝 NOTA* ╏ 🌸
✅ ➛ El bot está más ligero que un merengue

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        await react('🗑️')
        return m.reply(texto)
    }

    if (command === 'cpu') {
        let cpu = os.loadavg()[0].toFixed(2)
        let texto = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗖𝗣𝗨 ・ PROCESADOR 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ESTADO\`\` 💻 —˙𖦹.꒷

── *📊 ESTADÍSTICAS* ╏ 🌸
💻 ➛ Carga CPU: ${cpu}%
💖 ➛ Mary dice: no me hagan trabajar mucho

── *📝 NOTA* ╏ 🌸
⚠️ ➛ Si supera 90% el bot va lento

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        await react('💻')
        return m.reply(texto)
    }

    if (command === 'ram') {
        const used = process.memoryUsage()
        let ram = (used.heapUsed / 1024 / 1024).toFixed(2)
        let texto = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗥𝗔𝗠 ・ MEMORIA 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ESTADO\`\` 💾 —˙𖦹.꒷

── *📊 ESTADÍSTICAS* ╏ 🌸
💾 ➛ Consumo RAM: ${ram} MB
🍩 ➛ Equivale a ${Math.floor(ram/5)} cupcakes en memoria

── *📝 NOTA* ╏ 🌸
📊 ➛ Memoria usada por el proceso

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        await react('💾')
        return m.reply(texto)
    }

    if (command === 'uptime') {
        let _uptime = process.uptime() * 1000
        let uptime = clockString(_uptime)
        let texto = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗨𝗣𝗧𝗜𝗠𝗘 ・ TIEMPO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ACTIVO\`\` ⏱️ —˙𖦹.꒷

── *📊 ESTADÍSTICAS* ╏ 🌸
⏱️ ➛ Tiempo activo: ${uptime}
💖 ➛ Mary despierta desde hace: ${uptime}

── *📝 NOTA* ╏ 🌸
🔄 ➛ Desde que se inició el bot
🍩 ➛ Sin pausas de horneado... por ahora

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        await react('⏱️')
        return m.reply(texto)
    }

    if (command === 'info') {
        let _muptime = process.uptime() * 1000
        let muptime = clockString(_muptime)
        const used = process.memoryUsage()
        let cpu = os.loadavg()[0].toFixed(2)
        let ram = (used.heapUsed / 1024 / 1024).toFixed(2)

        let texto = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗜𝗡𝗙𝗢 ・ SISTEMA 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`REPORTE\`\` 📊 —˙𖦹.꒷
💖 Mary presenta el informe

── *📊 ESTADÍSTICAS* ╏ 🌸
⏱️ ➛ Uptime: ${muptime}
💾 ➛ Memoria RAM: ${ram} MB
💻 ➛ Carga CPU: ${cpu}%

── *📝 DETALLES* ╏ 🌸
👑 ➛ Desarrollado por: Mary
✨ ➛ Edición: Sweet Bot
✅ ➛ Estado: Operativo y dulce

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
        await react('📊')
        return m.reply(texto)
    }

    if (command === 'tts' || command === 'gtts' || command === 'ttss') {
        let q = m.quoted? m.quoted : m
        let txt = text || q.text || q.caption || q.body || ''

        if (!txt) {
            await react('❌')
            let texto = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗧𝗦 ・ ERROR 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷

── *📖 USO* ╏ 🌸
➛ Escribe el texto que deseas convertir
➛ O responde a un mensaje
💖 ➛ Mary quiere escucharte

── *💡 EJEMPLO* ╏ 🌸
➛ ${usedPrefix}tts Hola, ¿cómo estás?

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
            return m.reply(texto)
        }

        await react('🎙️')

        let lang = 'es'
        let url = googleTTS.getAudioUrl(txt, {
            lang: lang,
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000,
        })

        let tmpFilePath = path.join(tmpdir(), `tts-${Date.now()}.opus`)

        await new Promise((resolve, reject) => {
            ffmpeg(url)
     .audioCodec('libopus')
     .toFormat('opus')
     .outputOptions([
                    '-avoid_negative_ts make_zero',
                    '-ac 1',
                    '-b:a 64k'
                ])
     .on('end', () => resolve(true))
     .on('error', (err) => reject(err))
     .save(tmpFilePath)
        })

        let audioBuffer = fs.readFileSync(tmpFilePath)

        await conn.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
        }, { quoted: m })

        if (fs.existsSync(tmpFilePath)) fs.unlinkSync(tmpFilePath)
        await react('✅')
    }
}

function clockString(ms) {
    let d = Math.floor(ms / 86400000)
    let h = Math.floor(ms / 3600000) % 24
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return `${d}d ${h}h ${m}m ${s}s`
}

handler.help = ['owner', 'ping', 'cleartmp', 'cpu', 'ram', 'uptime', 'info', 'tts <texto>']
handler.tags = ['main']
handler.command = /^(owner|creator|ping|p|cleartmp|cpu|ram|uptime|info|g?tts|ttss)$/i
handler.rowner = false

export default handler