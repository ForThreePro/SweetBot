import fs from 'fs'
import * as googleTTS from 'google-tts-api'
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import { tmpdir } from 'os'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const ownerNum = '573044563583'

    if (!text) {
        let menuUso = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗜𝗔 𝗩𝗢𝗭 ・ ${command.toUpperCase()} 💖
꒰ ◞⁺⊹ ．${fecha}

  ꒱ ׁ. ᘏ 𝗖𝗢𝗠𝗔𝗡𝗗𝗢 ׅ 𝆬 ָ֢ ෆ
🍭 ࣪ ꕀ.${command} ˚. ᵎᵎ
> *"Hablando como parcera dulce de Medellín"*

.⃟𖥔 ݁. 𖦹˙— \`\`IA\`\` 🤖 —˙𖦹.꒷

── *📝 DESCRIPCIÓN* ╏ 🌸
💖 ➛ Responde con IA estilo colombiano parcero
🔊 ➛ Convierte la respuesta a audio PTT
🌸 ➛ Voz dulce colombiana

── *📖 USO* ╏ 🌸
➛.${command} <tu pregunta>
➛.${command} ¿qué más pues parcero?

── *⚙️ NOTAS* ╏ 🌸
📏 ➛ Máx 2 líneas de respuesta
🗣️ ➛ Jerga colombiana: parce, chimba, bacano
🍩 ➛ Mary responde corto y con dulzura paisa

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
👑 *Creadora:* Mary 🍩
🍭 +57 3044563583 🍬
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: menuUso, mentions: [ownerNum + '@s.whatsapp.net'] }, { quoted: m })
    }

    await m.react('⏳')
    await m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗣𝗥𝗢𝗖𝗘𝗦𝗔𝗡𝗗𝗢 ・ ${command.toUpperCase()} 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`PENSANDO\`\` 🤖 —˙𖦹.꒷

── *📊 ESTADO* ╏ 🌸
🧠 ➛ Consultando a Gemini paisa...
🗣️ ➛ Generando voz colombiana...
🍬 ➛ Enviando audio...
💖 ➛ Mary preparando dulces...

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`)

    try {
        let promptColombiano = `${text}. Responde como colombiana parcera, usa jerga colombiana (parce, chimba, bacano, qué más pues, sisas). Tono dulce y amable como Mary. Máximo 2 líneas.`
        let aiUrl = `https://api.stellarwa.xyz/ai/gemini?text=${encodeURIComponent(promptColombiano)}&key=proyectsV2`
        let aiRes = await fetch(aiUrl)
        let aiJson = await aiRes.json()

        let respuesta = aiJson.result || aiJson.data || aiJson.response || "Uy parce, no te entendí, ¿me repites pues?"

        if(respuesta.length > 200) respuesta = respuesta.substring(0, 200) + "..."

        let url = googleTTS.getAudioUrl(respuesta, {
            lang: 'es',
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000,
        })

        let tmpFilePath = path.join(tmpdir(), `ia-co-${Date.now()}.opus`)

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
        await m.react('✅')

    } catch (e) {
        console.log(e)
        await m.react('❌')
        const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
        await m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ ${command.toUpperCase()} 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷

── *📝 DESCRIPCIÓN* ╏ 🌸
❌ ➛ ${e.message}
🍪 ➛ Mary se enredó parce

── *💡 SOLUCIÓN* ╏ 🌸
🍬 ➛ Intenta con un texto más corto
🍬 ➛ Verifica tu conexión
🍩 ➛ Mary dice: hágale pues otra vez

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`)
    }
}

handler.help = ['ia <texto>']
handler.tags = ['ai']
handler.command = ['ia', 'bot', 'voz']
handler.register = false
export default handler