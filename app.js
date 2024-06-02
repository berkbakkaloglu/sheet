const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Character = require('./models/Character');

const app = express();
const port = 3000;

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/characterdb', { useNewUrlParser: true, useUnifiedTopology: true });

// Orta katmanlar
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Multer yapılandırması
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// EJS şablon motorunu ayarlama
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Karakter oluşturma sayfası
app.get('/create-character', (req, res) => {
    res.render('new-character');
});

// Aktif oyuncular sayfası
app.get('/characters', async (req, res) => {
    const characters = await Character.find();
    res.render('characters', { characters });
});

// Karakter detayları sayfası
app.get('/characters/:id', async (req, res) => {
    const character = await Character.findById(req.params.id);
    if (!character) {
        return res.status(404).send('Karakter bulunamadı.');
    }
    res.render('character-details', { character });
});

// Yeni karakter oluşturma
app.post('/api/characters', async (req, res) => {
    const { name, height, weight, gender, race, class: charClass, stats, inventory, spells, biography } = req.body;
    
    const character = new Character({
        name,
        height,
        weight,
        gender,
        race,
        class: charClass,
        stats,
        inventory: JSON.parse(inventory),
        spells: JSON.parse(spells),
        biography
    });
    
    await character.save();
    res.status(201).send('Karakter oluşturuldu.');
});

// Karakter güncelleme
app.post('/api/characters/:id', async (req, res) => {
    const { height, weight, gender, stats, inventory, spells, biography } = req.body;

    const character = await Character.findById(req.params.id);
    if (!character) {
        return res.status(404).send('Karakter bulunamadı.');
    }

    character.height = height;
    character.weight = weight;
    character.gender = gender;
    character.stats = stats;
    character.inventory = JSON.parse(inventory);
    character.spells = JSON.parse(spells);
    character.biography = biography;

    await character.save();
    res.status(200).send('Karakter güncellendi.');
});

// Avatar yükleme
app.post('/api/characters/:id/avatar', upload.single('avatar'), async (req, res) => {
    try {
        const character = await Character.findById(req.params.id);
        if (!character) {
            return res.status(404).send('Karakter bulunamadı.');
        }

        character.avatar = `/uploads/${req.file.filename}`;
        await character.save();

        res.status(200).send('Avatar yüklendi.');
    } catch (error) {
        res.status(500).send('Bir hata oluştu.');
    }
});

app.listen(port, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${port}`);
});
