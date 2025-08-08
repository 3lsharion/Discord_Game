import Player from '../models/Player.js';

export default {
    name: 'start',
    description: 'Crée ton profil idle',
    async execute(interaction) {
        const userId = interaction.user.id;

        let player = await Player.findOne({ userId });
        if (player) {
            return interaction.reply('❌ Tu as déjà un profil.');
        }

        player = new Player({ userId });
        await player.save();

        interaction.reply('🚀 Profil créé ! Tes pièces vont commencer à augmenter toutes les minutes.');
    }
};
