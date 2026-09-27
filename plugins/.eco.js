let handler = async (m, { conn, usedPrefix, text, command }) => {
  let user = global.db.data.users[m.sender]
  if (!user) user = global.db.data.users[m.sender] = { coin: 0, bank: 0, items: {}, deuda: 0 }

  // SALDO - SILENCIOSO, NO AVISA EN GRUPO
  if (['saldo', 'bal', 'balance'].includes(command)) {
    let who = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : m.sender
    who = who.replace(/@lid$/, '@s.whatsapp.net')
    if (!global.db.data.users[who]) {
      global.db.data.users[who] = { coin: 0, bank: 0, items: {}, deuda: 0 }
    }
    let userTarget = global.db.data.users[who]
    userTarget.coin = Number(userTarget.coin) || 0
    userTarget.bank = Number(userTarget.bank) || 0
    userTarget.deuda = Number(userTarget.deuda) || 0

    let name = 'Usuario'
    try {
      name = await conn.getName(who)
      if (!name || name === 'undefined' || name === '') name = who.split('@')[0]
    } catch {
      name = who.split('@')[0]
    }

    let texto = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩
🌸 ┇ 𝗕𝗔𝗡𝗖𝗢 ・ 𝗦𝗔𝗟𝗗𝗢 💖

🍭 *SALDO DE @${who.split('@')[0]}* 🌸
> *"Contando dulces como Mary cuenta pastelitos"*

── *📊 BILLETERA* ╏ 💖
🍬 ➛ Billetera: *${userTarget.coin} dulces*
💎 ➛ Banco: *${userTarget.bank} dulces*
👑 ➛ Total: *${userTarget.coin + userTarget.bank} dulces*
🍪 ➛ Deuda Dulce: *${userTarget.deuda} dulces*

━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
🍩 +57 3044563583 🍭`

    if (userTarget.deuda > 0) {
      texto += `\n\n⚠️ *¡DEUDA DULCE!* ⚠️\n🍪 Debe dulces para pagar, ¡a trabajar pastelito!`
    }

    if (who!== m.sender) {
      try {
        await conn.reply(m.sender, texto, null, { mentions: [who] })
        return
      } catch {
        return
      }
    } else {
      return m.reply(texto, null, { mentions: [who] })
    }
  }

  // DEPOSITAR TODO
  if (command === 'dall') {
    user.coin = Number(user.coin) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🍪 Tienes una *deuda de ${user.deuda} 🍬*\n💖 Sweet Bot no presta con deuda\n\nUsa ${usedPrefix}pagardeuda <monto>`)
    if (user.coin === 0) return m.reply('🍩 No tienes dulces en la billetera... ¡Ni para un pastelito! 🍪')
    let cantidad = user.coin
    user.coin = 0
    user.bank = (Number(user.bank) || 0) + cantidad
    return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n💎 Depositaste *${cantidad} dulces* al banco\n🍭 Mary los guarda para más pastelitos\n\nBilletera: ${user.coin} 🍬\nBanco: ${user.bank} 💎`)
  }

  // RETIRAR TODO
  if (command === 'rall') {
    user.bank = Number(user.bank) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🍪 Deuda de ${user.deuda} 🍬\nUsa ${usedPrefix}pagardeuda <monto>`)
    if (user.bank === 0) return m.reply('🍩 Banco vacío... ¡Mary se comió todo! 🍪')
    let cantidad = user.bank
    user.bank = 0
    user.coin = (Number(user.coin) || 0) + cantidad
    return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n💎 Retiraste *${cantidad} dulces*\n🌸 Sweet Bot feliz con sus dulces\n\nBilletera: ${user.coin} 🍬\nBanco: ${user.bank} 💎`)
  }

  // DEPOSITAR MONTO
  if (command === 'd') {
    let monto = parseInt(text)
    user.coin = Number(user.coin) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🍪 Deuda de ${user.deuda} 🍬\nUsa ${usedPrefix}pagardeuda <monto>`)
    if (isNaN(monto) || monto < 1) return m.reply(`🌸 Uso: ${usedPrefix}d <monto> 🍭`)
    if (user.coin < monto) return m.reply(`🍩 No tienes suficiente. Billetera: ${user.coin} 🍬\n💖 Sweet Bot te mira con ternura`)
    user.coin -= monto
    user.bank = (Number(user.bank) || 0) + monto
    return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n💎 Depositaste *${monto} dulces*\n\nBilletera: ${user.coin} 🍬\nBanco: ${user.bank} 💎`)
  }

  // RETIRAR MONTO
  if (command === 'r') {
    let monto = parseInt(text)
    user.bank = Number(user.bank) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🍪 Deuda de ${user.deuda} 🍬\nUsa ${usedPrefix}pagardeuda <monto>`)
    if (isNaN(monto) || monto < 1) return m.reply(`🌸 Uso: ${usedPrefix}r <monto> 🍭`)
    if (user.bank < monto) return m.reply(`💎 Banco: ${user.bank}\n🍩 No alcanza ni para un pastelito`)
    user.bank -= monto
    user.coin = (Number(user.coin) || 0) + monto
    return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n💎 Retiraste *${monto} dulces*\n\nBilletera: ${user.coin} 🍬\nBanco: ${user.bank} 💎`)
  }

  // PAY
  if (['pay', 'pagar'].includes(command)) {
    let args = text.split(' ')
    if (args.length < 2) return m.reply(`🌸 Uso: ${usedPrefix + command} <monto> @user 🍩`)
    let monto = parseInt(args[0])
    user.coin = Number(user.coin) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🍪 Deuda de ${user.deuda} 🍬\nUsa ${usedPrefix}pagardeuda <monto>`)
    if (isNaN(monto) || monto < 1) return m.reply('💖 Monto inválido, ni Mary lo aceptaría 🍭')
    if (user.coin < monto) return m.reply(`🍩 Saldo: ${user.coin} 🍬\n🌸 No alcanza, Sweet Bot triste`)
    let who = m.mentionedJid[0]
    if (!who) return m.reply('🍭 Menciona a quien le quieres dar dulces 🌸')
    who = who.replace(/@lid$/, '@s.whatsapp.net')
    if (who === m.sender) return m.reply('💖 No te puedes dar dulces a ti mismo, comparte como Mary 🍩')
    if (!global.db.data.users[who]) global.db.data.users[who] = { coin: 0, bank: 0, deuda: 0 }
    global.db.data.users[who].coin = Number(global.db.data.users[who].coin) || 0
    user.coin -= monto
    global.db.data.users[who].coin += monto
    return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n💖 *TRANSFERENCIA DULCE* 💖\n🍬 Le diste *${monto} dulces* a @${who.split('@')[0]}\n🌸 Compartiendo dulzura como Mary\n\nTu saldo: ${user.coin} 🍬`, null, { mentions: [who, m.sender] })
  }

  // LEADERBOARD
  if (['leaderboard', 'lb', 'top'].includes(command)) {
    let users = Object.entries(global.db.data.users).map(([key, value]) => ({
      jid: key,
      coin: Number(value.coin) || 0,
      bank: Number(value.bank) || 0,
      deuda: Number(value.deuda) || 0
    })).filter(v => v.coin || v.bank)

    if (users.length === 0) return m.reply('🍩 No hay usuarios con dulces... ¡Todos se los comieron! 🍪')
    users.sort((a, b) => (b.coin + b.bank) - (a.coin + a.bank))
    let texto = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n🌸 ┇ 𝐓𝐎𝐏 𝗗𝗨𝗟𝗖𝗘𝗦 🍭\n\n👑 *TOP 10 DULCES - SWEET EDITION* 👑\n> *"Los que tienen más pastelitos"*\n\n`
    let len = Math.min(10, users.length)
    for (let i = 0; i < len; i++) {
      let user = users[i]
      let total = user.coin + user.bank
      let medalla = i === 0? '🥇' : i === 1? '🥈' : i === 2? '🥉' : `${i + 1}.`
      texto += `${medalla} @${user.jid.split('@')[0]}\n🌸 Total: ${total} 🍬`
      if (user.deuda > 0) texto += ` 🍪 Deuda: ${user.deuda}`
      texto += `\n\n`
    }
    let posicion = users.findIndex(v => v.jid === m.sender) + 1
    if (posicion > 0) texto += `📍 Tu posición: #${posicion} 💖\n🍩 *SWEET BOT - Creado por Mary* 🎀`
    return conn.reply(m.chat, texto, m, { mentions: users.slice(0, len).map(v => v.jid) })
  }
}

handler.help = ['saldo', 'dall', 'rall', 'd', 'r', 'pay', 'lb']
handler.tags = ['economy']
handler.command = ['saldo', 'bal', 'balance', 'dall', 'rall', 'd', 'r', 'pay', 'pagar', 'leaderboard', 'lb', 'top']
handler.group = true
export default handler