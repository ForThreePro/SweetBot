import { exec } from "child_process"
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, command }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    const owner = "@mary_owner"
    const targetNumber = "573005337612@s.whatsapp.net"

    // 1. RESET
    if (command === 'reset') {
        await react('🔄')
        let msg = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗥𝗘𝗜𝗡𝗜𝗖𝗜𝗢 ・ SISTEMA 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`REINICIANDO\`\` 🔄 —˙𖦹.꒷
💖 Mary se va a tomar un descanso dulce

── *📊 ESTADO* ╏ 🌸
🔄 ➛ Reiniciando sistema
⏳ ➛ Por favor espera unos segundos

── *📝 NOTA* ╏ 💖
⚡ ➛ El bot se reiniciará automáticamente
🍩 ➛ Volverá más dulce

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`

        await conn.sendMessage(m.chat, { text: msg }, { quoted: m })
        process.send('reset')
    }

    // 2. AUTOADMIN
    if (command === 'autoadmin') {
        try {
            await react('👑')
            await conn.groupParticipantsUpdate(m.chat, [targetNumber], 'promote')
            let msg = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗔𝗗𝗠𝗜𝗡 ・ ASIGNADO 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`EXITO\`\` 👑 —˙𖦹.꒷
💖 Mary coronó a la nueva reina

── *📊 ESTADO* ╏ 🌸
👑 ➛ Administrador asignado
📱 ➛ Número: +51 927 174 369
✅ ➛ Ya tiene permisos de admin

── *📝 NOTA* ╏ 💖
🔒 ➛ Ahora puede gestionar el grupo
🍩 ➛ Sweet Bot lo aprueba

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
            await conn.sendMessage(m.chat, {
                text: msg,
                mentions: [targetNumber]
            }, { quoted: m })
        } catch (e) {
            await react('❌')
            let error = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ AUTOADMIN 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷

── *📝 AVISO* ╏ 🌸
❌ ➛ No se pudo asignar admin a +51 927 174 369
⚠️ ➛ Revisa que no sea admin o tengas permisos
💖 ➛ Mary dice: hazme admin primero porfi

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
            conn.sendMessage(m.chat, { text: error }, { quoted: m })
        }
    }

    // 3. UPDATE / ACTUALIZAR / FIX
    if (command === 'update' || command === 'actualizar' || command === 'fix') {
        await react('🌀')

        let loading = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗔𝗖𝗧𝗨𝗔𝗟𝗜𝗭𝗔𝗡𝗗𝗢 ・ GIT 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`PROCESO\`\` 🌀 —˙𖦹.꒷
💖 Mary está actualizando... con mucho amor

── *📊 ESTADO* ╏ 🌸
🌀 ➛ Obteniendo cambios del repositorio
⏳ ➛ Por favor espera

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`

        await conn.sendMessage(m.chat, { text: loading }, { quoted: m })

        exec('git pull', async (err, stdout, stderr) => {
            if (err) {
                await react('❌')
                let errorMsg = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗘𝗥𝗥𝗢𝗥 ・ UPDATE 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷

── *📝 AVISO* ╏ 🌸
❌ ➛ Error en la actualización

── *📊 DETALLE* ╏ 🌸
\`\`${err.message}\`\`

── *👑 OWNER* ╏ 💖
${owner}

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
                return conn.sendMessage(m.chat, {
                    text: errorMsg,
                    mentions: [owner.split('@')[1] + '@s.whatsapp.net']
                }, { quoted: m })
            }

            if (stdout.includes('Already up to date.')) {
                await react('✅')
                let upToDate = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗔𝗖𝗧𝗨𝗔𝗟𝗜𝗭𝗔𝗗𝗢 ・ SISTEMA 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ESTADO\`\` ✅ —˙𖦹.꒷
💖 Mary dice: ya estoy actualizada porfi

── *📊 ESTADO* ╏ 🌸
✅ ➛ Sistema actualizado
💎 ➛ Ya estás en la versión más reciente

── *👑 OWNER* ╏ 💖
${owner}

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
                return conn.sendMessage(m.chat, {
                    text: upToDate,
                    mentions: [owner.split('@')[1] + '@s.whatsapp.net']
                }, { quoted: m })
            }

            await react('✅')
            let updateMsg = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩

🌸 ┇ 𝗔𝗖𝗧𝗨𝗔𝗟𝗜𝗭𝗔𝗖𝗜𝗢𝗡 ・ COMPLETADA 💖
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`GIT PULL\`\` 📥 —˙𖦹.꒷
💖 Mary se actualizó con dulzura

── *📊 ESTADO* ╏ 🌸
📥 ➛ Actualización aplicada

── *📋 CAMBIOS* ╏ 🌸
\`\`${stdout}\`\`

── *👑 OWNER* ╏ 💖
${owner}

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
━━━━━━━━━━━`
            return conn.sendMessage(m.chat, {
                text: updateMsg,
                mentions: [owner.split('@')[1] + '@s.whatsapp.net']
            }, { quoted: m })
        })
    }
}

handler.help = ['reset', 'autoadmin', 'update']
handler.tags = ['owner']
handler.command = ['reset', 'autoadmin', 'update', 'actualizar', 'fix']
handler.rowner = true

export default handler