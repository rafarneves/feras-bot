const { Client, IntentsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');
const moment = require('moment');

let idCanal = '';

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent
	],
});

// const ROLES = {
// 	disponivel: '1110024036991377499',
// 	indisponivel: '1110024610734407720',
// };

function callRowButtons(id) {
	const channel = client.channels.cache.get(`${id}`);
	const iniciar = new ButtonBuilder().setCustomId('inicio').setLabel('Iniciar').setStyle(ButtonStyle.Success);
	const pausar = new ButtonBuilder().setCustomId('pausa').setLabel('Pausar').setStyle(ButtonStyle.Danger);
	const voltar = new ButtonBuilder().setCustomId('volta').setLabel('Voltar').setStyle(ButtonStyle.Primary);
	const finalizar = new ButtonBuilder().setCustomId('final').setLabel('Finalizar').setStyle(ButtonStyle.Secondary);
	const row = new ActionRowBuilder().addComponents(iniciar, pausar, voltar, finalizar);

	channel.send({ components: [row] });
}

client.on('ready', () => {
	console.log('Bot iniciado!');
});

client.on('interactionCreate', async (interaction) => {
	interaction.deferUpdate();
	if(!interaction.isButton()) return;
	if(interaction.isButton()) {
		idCanal = interaction.channelId;
		const channel = await client.channels.cache.get(`${idCanal}`);
		const horas = await moment().get('hour') < 10 ? `0${moment().get('hour')}` : `${moment().get('hour')}`;
		const minutos = await moment().get('minute') < 10 ? `0${moment().get('minute')}` : `${moment().get('minute')}`;
		await interaction.message.delete();
		if(interaction.customId === 'inicio') {
			await channel.send(`🟢 ${interaction.user.username} iniciou o expediente às ${horas}h${minutos}min`);
			// if(interaction.member.roles.cache.find(role => role.name === 'Indisponivel')) {
			// 	await interaction.member.roles.remove(ROLES.indisponivel);
			// }
			// await interaction.member.roles.add(ROLES.disponivel);
		}else if(interaction.customId === 'pausa') {
			await channel.send(`🔴 ${interaction.user.username} pausou às ${horas}h${minutos}min`);
			// if(interaction.member.roles.cache.find(role => role.name === 'Disponivel')) {
			// 	await interaction.member.roles.remove(ROLES.disponivel);
			// }
			// await interaction.member.roles.add(ROLES.indisponivel);
		} else if(interaction.customId === 'volta') {
			await channel.send(`🟢 ${interaction.user.username} voltou às ${horas}h${minutos}min`);
			// if(interaction.member.roles.cache.find(role => role.name === 'Indisponivel')) {
			// 	await interaction.member.roles.remove(ROLES.indisponivel);
			// }
			// await interaction.member.roles.add(ROLES.disponivel);
		} else if(interaction.customId === 'final') {
			await channel.send(`🔴 ${interaction.user.username} finalizou o expediente por hoje às ${horas}h${minutos}min. Até amanhã!`);
			// if(interaction.member.roles.cache.find(role => role.name === 'Disponivel')) {
			// 	await interaction.member.roles.remove(ROLES.disponivel);
			// }
			// await interaction.member.roles.add(ROLES.indisponivel);
		}
		callRowButtons(`${idCanal}`);
	}
})

client.on('messageCreate', (message) => {
	if(message.content === '!ponto') {
		const idChannel = message.channelId;
		callRowButtons(idChannel);
	}
})

client.login(token);