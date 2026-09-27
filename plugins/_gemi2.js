import axios from 'axios'

// VIDEOS - Se mandan primero
let videos = [
    'https://telegra.ph/file/e278ca6dc7d26a2cfda46.mp4' // Video 2
]

// AUDIOS - Van después del video
let audios = [
    'https://files.evogb.win/UbhAVn.opus' // Audio 1 // Audio 2
]

// MENSAJES - Van al final
let mensajes = [
    '🍩🎀 Aquí tienes tu dulce 💖',
    // '🌸 Segundo dulce para ti 🍭',
]

let indice = 0 // Para rotar

let handler = async (m, { conn }) => {

    let videoUrl = videos[indice % videos.length] // Toma el video actual
    let audioUrl = audios[indice % audios.length] // Toma el audio actual
    let texto = mensajes[indice % mensajes.length] || '✅ Listo dulce 🌸' // Toma el mensaje

    indice = (indice + 1) // Siguiente

    try {
        await m.react('⏳')

        // 1. DESCARGAR Y ENVIAR VIDEO PRIMERO
        let resVideo = await axios.get(videoUrl, { responseType: 'arraybuffer', timeout: 120000 })
        let videoBuffer = Buffer.from(resVideo.data)

        await conn.sendMessage(m.chat, {
            video: videoBuffer,
            mimetype: 'video/mp4',
            caption: '🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩' // Caption opcional
        }, { quoted: m })

        await new Promise(resolve => setTimeout(resolve, 800)) // Pausa de 0.8s

        // 2. DESCARGAR Y ENVIAR AUDIO
        let resAudio = await axios.get(audioUrl, { responseType: 'arraybuffer', timeout: 120000 })
        let audioBuffer = Buffer.from(resAudio.data)

        await conn.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/ogg; codecs=opus', // Por tu archivo.opus
            ptt: false // pon true si quieres que salga como nota de voz
        }, { quoted: m })

        await new Promise(resolve => setTimeout(resolve, 500)) // Pausa de 0.5s

        // 3. ENVIAR MENSAJE AL FINAL
        await conn.reply(m.chat, texto, m)

        await m.react('✅')

    } catch (err) {
        await m.react('❌')
        await m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n❌ Error: ${err.message || err}`)
    }
}

handler.help = ['gemidos - Manda video + audio + mensaje']
handler.tags = ['Nsfw']
handler.command = /^(gemidos)$/i
export default handler