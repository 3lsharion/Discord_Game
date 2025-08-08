import Player from '../models/Player.js';

export default {
    name: 'stats',
    description: 'Affiche tes pièces',
    async execute(interaction) {
        const userId = interaction.user.id;
        const player = await Player.findOne({ userId });

        if (!player) {
            return interaction.reply("❌ Tu n'as pas encore de profil. Utilise `/start`.");
        }

        interaction.reply(`💰 Tu as **${player.coins}** pièces.`);
    }
};
