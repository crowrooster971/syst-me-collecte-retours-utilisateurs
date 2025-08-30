const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/retours', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie!'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Modèle de retour
const retourSchema = new mongoose.Schema({
  utilisateur: String,
  commentaire: String,
  date: { type: Date, default: Date.now }
});
const Retour = mongoose.model('Retour', retourSchema);

// Routes
app.post('/retours', async (req, res) => {
  const nouveauRetour = new Retour(req.body);
  try {
    await nouveauRetour.save();
    res.status(201).send(nouveauRetour);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/retours', async (req, res) => {
  const retours = await Retour.find();
  res.status(200).send(retours);
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
