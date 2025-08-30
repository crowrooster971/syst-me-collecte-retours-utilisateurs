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

// Route pour créer un nouveau retour
app.post('/retours', async (req, res) => {
  const { utilisateur, commentaire } = req.body;
  // Validation simple des données
  if (!utilisateur || !commentaire) {
    return res.status(400).send({ message: 'Utilisateur et commentaire sont requis.' });
  }
  const nouveauRetour = new Retour(req.body);
  try {
    await nouveauRetour.save();
    res.status(201).send(nouveauRetour);
  } catch (err) {
    // Gérer l'erreur si les données de retour ne sont pas valides
    res.status(400).send({ message: 'Erreur lors de la création du retour.', error: err });
  }
});

// Route pour obtenir tous les retours
app.get('/retours', async (req, res) => {
  try {
    const retours = await Retour.find();
    res.status(200).send(retours);
  } catch (err) {
    // Gérer toute erreur pouvant survenir lors de la récupération des retours
    res.status(500).send({ message: 'Erreur lors de la récupération des retours.', error: err });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});