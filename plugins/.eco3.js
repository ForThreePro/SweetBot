let handler = async (m, { conn, usedPrefix, text, command }) => {
  let user = global.db.data.users[m.sender]
  if (!user) user = global.db.data.users[m.sender] = { coin: 0, bank: 0, items: {} }

  const items = {
    'pico': { nombre: 'Pico Dulce 🍩', precio: 500, desc: 'Para minar más dulces como Mary hornea pastelitos' },
    'escudo': { nombre: 'Escudo Mary 🛡️', precio: 1000, desc: 'Protege contra robos, ni un antojo te roba' },
    'vip': { nombre: 'VIP Sweet 👑', precio: 5000, desc: 'Ganancias x2 - Modo Sweet premium' },
    'cofre': { nombre: 'Cofre de Dulces 🎀', precio: 300, desc: 'Premio 100-1000 dulces, sorpresa de Mary' },
    'pocion': { nombre: 'Poción Rosa 🌸', precio: 800, desc: '+20% suerte, dulzura de Sweet Bot' }
  }

  if (!text || ['shop', 'tienda'].includes(command)) {
    let texto = `🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩
🌸 ┇ 𝗧𝗜𝗘𝗡𝗗𝗔 ・ 𝗗𝗨𝗟𝗖𝗘 💖
> *"La tienda de pastelitos de Mary está abierta"*

── *💰 TU SALDO* ╏ 🌸
🍬 ➛ Saldo: *${user.coin} dulces*
💖 ➛ Cliente: Mary te atiende

── *🛒 PRODUCTOS* ╏ 🍭

`
    for (let [id, item] of Object.entries(items)) {
      texto += `🍩 *${item.nombre}*\n   💎 Precio: ${item.precio} 🍬\n   🌸 ${item.desc}\n   🎀 Comprar: ${usedPrefix}buy ${id}\n\n`
    }
    texto += `━━━━━━━━━━━
🌸 *SWEET BOT - Creado por Mary* 💖
🍭 +57 3044563583 🍩
> "Lo dulce siempre gana" 💖`
    return m.reply(texto)
  }

  if (['buy', 'comprar'].includes(command)) {
    let item = items[text.toLowerCase()]
    if (!item) return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n💖 Item no encontrado, ni Mary lo tiene\n🍭 Usa ${usedPrefix}shop para ver la tienda`)
    if (user.coin < item.precio) return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🍪 No tienes suficiente, te faltan ${item.precio - user.coin} 🍬\n🌸 Mary: "Sin dulces no hay pastelitos"`)

    user.coin -= item.precio
    user.items = user.items || {}
    user.items[text.toLowerCase()] = (user.items[text.toLowerCase()] || 0) + 1

    if (text.toLowerCase() === 'cofre') {
      let premio = Math.floor(Math.random() * 901) + 100
      user.coin += premio
      return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n🎀 ¡Abriste un *Cofre de Dulces*! 🍭\n🌸 Mary te premió con *${premio} dulces* 🍬\n> *"Este pastelito es especial"* 💖\n\n💎 Saldo: ${user.coin} 🍬`)
    }
    return m.reply(`🍩🎀 𝗦𝗪𝗘𝗘𝗧 𝗕𝗢𝗧 🎀🍩\n\n✅ ¡Compra dulce perfecta! 🌸\n🍩 Compraste *${item.nombre}* por ${item.precio} 🍬\n💖 Mary: "Buena elección, pastelito"\n\n💎 Saldo: ${user.coin} 🍬`)
  }
}

handler.help = ['shop', 'buy']
handler.tags = ['economy']
handler.command = ['shop', 'tienda', 'buy', 'comprar']
handler.group = true
handler.register = false
export default handler