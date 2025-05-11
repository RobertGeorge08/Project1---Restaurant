const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Importăm uuid pentru generarea unui ID unic

const app = express();
const PORT = 3000;

// Folosim body-parser pentru a analiza datele din formular
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servim fișierele statice din folderul proiectului
app.use(express.static(path.join(__dirname)));

// Ruta pentru servirea fișierului HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Asigură-te că index.html este în folderul principal
});

// *** Secțiunea pentru formularul existent ***
app.post('/submit', (req, res) => {
  const formData = {
    id: uuidv4(), // Generăm un ID unic
    name: req.body.name, // Nume
    email: req.body.email, // Email
    datetime: req.body.datetime, // Data/Ora
    numPersons: req.body.numPersons, // Număr persoane
    observations: req.body.observations, // Observații
  };

  // Calea către fișierul JSON în același director
  const filePath = path.join(__dirname, 'data.json');

  // Citim fișierul data.json pentru a salva datele
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Dacă fișierul nu există, creăm unul nou cu răspunsul
      const newData = [formData];
      fs.writeFile(filePath, JSON.stringify(newData, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ message: 'Eroare la salvarea datelor.', error: err });
        } else {
          return res.status(200).json({ message: 'Datele au fost salvate cu succes!' });
        }
      });
    } else {
      const existingData = JSON.parse(data);
      existingData.push(formData); // Adăugăm răspunsul în lista existentă
      fs.writeFile(filePath, JSON.stringify(existingData, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ message: 'Eroare la salvarea datelor.', error: err });
        } else {
          return res.status(200).json({ message: 'Datele au fost salvate cu succes!' });
        }
      });
    }
  });
});

// *** Secțiunea nouă pentru recenzii ***
app.post('/reviews', (req, res) => {
  const reviewData = {
      id: uuidv4(), // Generăm un ID unic
      name: req.body.name, // Numele utilizatorului
      rating: req.body.rating, // Rating-ul (stele)
      message: req.body.message, // Mesajul recenziei
  };

  // Calea către fișierul reviews.json
  const filePath = path.join(__dirname, 'reviews.json');

  fs.readFile(filePath, (err, data) => {
      if (err) {
          const newReviews = [reviewData];
          fs.writeFile(filePath, JSON.stringify(newReviews, null, 2), (err) => {
              if (err) {
                  return res.status(500).json({ message: 'Eroare la salvarea recenziei.', error: err });
              } else {
                  return res.status(200).json({ message: 'Recenzia a fost salvată cu succes!' });
              }
          });
      } else {
          const existingReviews = JSON.parse(data);
          existingReviews.push(reviewData);
          fs.writeFile(filePath, JSON.stringify(existingReviews, null, 2), (err) => {
              if (err) {
                  return res.status(500).json({ message: 'Eroare la salvarea recenziei.', error: err });
              } else {
                  return res.status(200).json({ message: 'Recenzia a fost salvată cu succes!' });
              }
          });
      }
  });
});

// Pornim serverul
app.listen(PORT, () => {
  console.log(`Serverul rulează pe http://localhost:${PORT}`);
});