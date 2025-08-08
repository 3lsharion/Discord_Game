import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    coins: { type: Number, default: 0 },
    lastUpdate: { type: Date, default: Date.now }
});

export default mongoose.model('Player', playerSchema);
