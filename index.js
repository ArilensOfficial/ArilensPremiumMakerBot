const { Client, GatewayIntentBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const config = require('./config.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// Bot hazır olduğunda çalışacak
client.once('ready', () => {
  console.log('Bot aktif.');
  console.log('Komutlar hatasız çalışıyor.');
  console.log('Prefix hatasız çalışıyor.');
});

// Mesajları dinliyoruz
client.on('messageCreate', async message => {
  // Eğer mesaj bir bot tarafından gönderilmişse işlem yapma
  if (message.author.bot) return;

  // Mesajın prefix ile başlayıp başlamadığını kontrol et
  if (!message.content.startsWith('!')) return; // Örneğin, '!' prefix olarak kullanılıyor

  // Komutları ayır
  const args = message.content.slice(1).trim().split(/ +/); // prefix'i ve boşlukları ayır
  const command = args.shift().toLowerCase(); // İlk kelime komut

  // Premium komutu
  if (command === 'premium') {
    // Kullanıcının premium rolü olup olmadığını kontrol et
    if (!message.member.roles.cache.has(config.roles.premium)) {
      await message.reply({
        content: 'Bu komutu kullanmak için premium rolüne sahip olmalısınız!',
        ephemeral: true // Gizli mesaj
      });

      // Ek mesajı gönder
      return message.reply({
        content: 'Satın alımlar için **discord arilensofficial** yazın.',
        ephemeral: true // Gizli mesaj
      });
    }

    // Premium butonları oluştur
    const premiumFullUnlockButton = new ButtonBuilder()
      .setLabel('Premium Full Unlock') // Butonun metni
      .setStyle(ButtonStyle.Link) // Butonun stili
      .setURL(config.links.premiumFullUnlock); // Buton tıklandığında yönlendirilecek link

    const autoAddTimerButton = new ButtonBuilder()
      .setLabel('Auto Add Timer') // Butonun metni
      .setStyle(ButtonStyle.Link) // Butonun stili
      .setURL(config.links.autoAddTimer); // Buton tıklandığında yönlendirilecek link

    // Butonları aynı satıra eklemek için bir ActionRow oluştur
    const row = new ActionRowBuilder()
      .addComponents(premiumFullUnlockButton, autoAddTimerButton); // Butonları satıra ekle

    await message.reply({
      content: `**Premium Seçenekleri:**`,
      components: [row], // Butonları mesajla birlikte gönder
      ephemeral: true // Gizli mesaj
    });

  // Free komutu
  } else if (command === 'free') {
    // Kullanıcının free rolü olup olmadığını kontrol et
    if (!message.member.roles.cache.has(config.roles.free)) {
      await message.reply({
        content: 'Bu komutu kullanmak için free rolüne sahip olmalısınız!',
        ephemeral: true // Gizli mesaj
      });

      // Ek mesajı gönder
      return message.reply({
        content: 'abone ss kanalına ss atarak kullanabilirsin dostum.',
        ephemeral: true // Gizli mesaj
      });
    }

    // Free butonunu oluştur
    const addTimerButton = new ButtonBuilder()
      .setLabel('Add Timer') // Butonun metni
      .setStyle(ButtonStyle.Link) // Butonun stili
      .setURL(config.links.addTimer); // Buton tıklandığında yönlendirilecek link

    const removeLicenseButton = new ButtonBuilder()
      .setLabel('Remove License') // Butonun metni
      .setStyle(ButtonStyle.Link) // Butonun stili
      .setURL(config.links.removeLicense); // Buton tıklandığında yönlendirilecek link

    const row = new ActionRowBuilder()
      .addComponents(addTimerButton, removeLicenseButton); // Butonları satıra ekle

    await message.reply({
      content: `**Free Seçenekleri:**`,
      components: [row], // Butonları mesajla birlikte gönder
      ephemeral: true // Gizli mesaj
    });

  // Premium rolü verme komutu
  } else if (command === 'premium-ver') {
    const roleId = args[0]; // Argüman olarak rol ID'sini al
    const member = message.mentions.members.first() || message.member; // Mesajı atan kullanıcıyı veya belirtilen kullanıcıyı al

    // Kullanıcının zaten premium rolü olup olmadığını kontrol et
    if (member.roles.cache.has(config.roles.premium)) {
      return message.reply({
        content: 'Bu kullanıcı zaten premium rolüne sahip!',
        ephemeral: true // Gizli mesaj
      });
    }

    // Kullanıcıya rol ekle
    const role = message.guild.roles.cache.get(roleId);
    if (role) {
      await member.roles.add(role);
      return message.reply({
        content: `Başarıyla ${role.name} rolü verildi!`,
        ephemeral: true // Gizli mesaj
      });
    } else {
      return message.reply({
        content: 'Geçersiz rol ID\'si!',
        ephemeral: true // Gizli mesaj
      });
    }

  // Free rolü verme komutu
  } else if (command === 'free-ver') {
    const roleId = args[0]; // Argüman olarak rol ID'sini al
    const member = message.mentions.members.first() || message.member; // Mesajı atan kullanıcıyı veya belirtilen kullanıcıyı al

    // Kullanıcının zaten free rolü olup olmadığını kontrol et
    if (member.roles.cache.has(config.roles.free)) {
      return message.reply({
        content: 'Bu kullanıcı zaten free rolüne sahip!',
        ephemeral: true // Gizli mesaj
      });
    }

    // Kullanıcıya rol ekle
    const role = message.guild.roles.cache.get(roleId);
    if (role) {
      await member.roles.add(role);
      return message.reply({
        content: `Başarıyla ${role.name} rolü verildi!`,
        ephemeral: true // Gizli mesaj
      });
    } else {
      return message.reply({
        content: 'Geçersiz rol ID\'si!',
        ephemeral: true // Gizli mesaj
      });
    }
  }
});

// Botu başlat
client.login(config.token);
