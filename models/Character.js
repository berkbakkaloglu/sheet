const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    name: String,
    height: Number,
    weight: Number,
    gender: String,
    race: String,
    class: String,
    stats: {
        strength: Number,
        dexterity: Number,
        constitution: Number,
        intelligence: Number,
        wisdom: Number,
        charisma: Number,
    },
    inventory: [String],
    spells: [String],
    biography: String,
    avatar: String // Avatar için yeni alan
});

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;
