const Discord = require('discord.js');
const bot = new Discord.Client();
let cron = require('node-cron');
require('dotenv').config();
const token = process.env.TOKEN;
const pexelsAPI = process.env.PEXEL;
const fetch = require('node-fetch');

bot.on('ready', () => {
	console.log('Naggy Nemo is alive!');
});

const fetchDog = async () => {
	let url = 'https://random.dog/woof.json';
	let data = await fetch(url);
	let response = await data.json();
	return response.url;
};

const fetchCat = async () => {
	let url = 'https://aws.random.cat/meow';
	let data = await fetch(url);
	let response = await data.json();
	return response.file;
};

const fetchPxels = async (query) => {
	let url = `https://api.pexels.com/v1/search?query=${query}&per_page=10`;
	let data = await fetch(url, {
		method: 'GET',
		headers: { Authorization: pexelsAPI },
	});
	let response = await data.json();
	let photos = response.photos;
	if (photos.length > 0) {
		let random = Math.floor(Math.random() * photos.length);
		console.log(photos);
		console.log(photos[random]);
		return photos[random].src.landscape;
	} else return '';
};

bot.on('message', async (msg) => {
	let message = msg.content.replace(/\s+/g, ' ').trim();
	if (message.startsWith('<@!746413258759602246>')) {
		if (message.startsWith('<@!746413258759602246> show me ') || msg.content.startsWith('<@!746413258759602246> Show me ')) {
			let str = message;
			let keyword = message.split(' ').slice(3).join(' ');
			let url = await fetchPxels(keyword);
			if (!url) {
				msg.channel.send(`I can't find '${keyword}' on Pexels. :(`);
			} else
				msg.channel.send(`I found this on Pexels for '${keyword}':`, {
					files: [url],
				});
			return;
		}
		if (message.includes('dog') || message.includes('cat')) {
			if (message.includes('dog')) {
				let url = await fetchDog();
				msg.channel.send({
					files: [url],
				});
			}
			if (message.includes('cat')) {
				let url = await fetchCat();
				msg.channel.send({
					files: [url],
				});
			}
			return;
		}
		const members = await msg.guild.members.fetch();
		let membersArray = [];
		members.map((member) => {
			membersArray.push(member);
		});
		const random = Math.floor(Math.random() * membersArray.length);
		const person = membersArray[random].user.username;
		if (message.startsWith('<@!746413258759602246> Who is') || message.startsWith('<@!746413258759602246> who is')) {
			await msg.channel.send(`C'mon! Everyone knows it's ${person}!!`);
			// } else if (message.startsWith('<@!746413258759602246>') && message.endsWith('?')) {
			// 	await msg.channel.send(eightball);
		} else msg.reply('Why are you talking to me?! Go do your guild battles!!');
	}
});

bot.once('ready', () => {
	cron.schedule(
		// '0-59 * * * *',
		'0 11 1-31 1-12 0,1,3,4,5,6',
		async () => {
			try {
				const channel = await bot.channels.fetch('698917300040106084');
				if (channel) channel.send('@here 3 hours until GB ends!! Try your best!');
				if (channel) channel.send('<:mongoose:740392968015577121>');
				else console.log('Could not find channel');
			} catch (err) {
				console.error(err);
			}
		},
		{
			scheduled: true,
			timezone: 'Asia/Bangkok',
		}
	);
});

bot.login(token);
