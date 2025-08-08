import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Player from './models/Player.js';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Charger toutes les commandes
const commands = [];
client.commands = new Map();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = (await import(`./commands/${file}`)).default;
    commands.push({ name: command.name, description: command.description });
    client.commands.set(command.name, command);
}

// Enregistrement des commandes slash
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.once('ready', async () => {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);

    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        console.log('📜 Commandes slash enregistrées.');
    } catch (err) {
        console.error(err);
    }
});

// Gestion des commandes slash
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (command) {
        try {
            await command.execute(interaction);
        } catch (err) {
            console.error(err);
            interaction.reply('❌ Erreur lors de l’exécution de la commande.');
        }
    }
});

// Boucle idle (1 min)
setInterval(async () => {
    const players = await Player.find();
    for (const player of players) {
        player.coins += 1; // Gain par minute
        player.lastUpdate = Date.now();
        await player.save();
    }
}, 60000);

// Connexion MongoDB puis au bot
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('📦 Connecté à MongoDB');
        client.login(process.env.DISCORD_TOKEN);
    })
    .catch(err => console.error(err));
