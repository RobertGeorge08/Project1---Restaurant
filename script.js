// Functia pentru a anima numerele
function animateNumber(elementId, endValue) {
    let startValue = 0; // Startăm de la 0
    const element = document.getElementById(elementId); // Obținem elementul din DOM
    const increment = Math.ceil(endValue / 300); // Cum să creștem numărul treptat
    const interval = setInterval(function() {
        if (startValue < endValue) {
            startValue += increment; // Mărim numărul pas cu pas
            if (startValue > endValue) {
                startValue = endValue; // Nu depășim valoarea finală
            }
            element.innerText = startValue; // Actualizăm numărul în DOM
        } else {
            clearInterval(interval); // Oprim animația când valoarea finală e atinsă
        }
    }, 20); // Intervalul de timp între fiecare increment (20ms pentru o animație mai lină)
}

// Functia de observare a vizibilitatii elementului
function setupObserver() {
    const elementsToAnimate = document.querySelectorAll('.animate-number');

    // Crearea unui Intersection Observer
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Dacă elementul devine vizibil, adăugăm clasa 'visible'
                entry.target.classList.add('visible');
                // Animăm numărul corespunzător
                if (entry.target.id === 'numarExperienta') {
                    animateNumber('numarExperienta', 30);
                } else if (entry.target.id === 'numarMancare') {
                    animateNumber('numarMancare', 50);
                } else if (entry.target.id === 'numarPersonale') { // Dacă ai un ID pentru numărul de persoane
                    animateNumber('numarPersonale', 100); // Exemplu de număr pentru numărul de persoane
                }
            }
        });
    }, { threshold: 0.5 }); // Activăm când 50% din element este vizibil pe ecran

    // Observăm fiecare element cu clasa 'animate-number'
    elementsToAnimate.forEach(element => observer.observe(element));
}

// Asigură-te că observația începe după ce întreaga pagină s-a încărcat
window.onload = function() {
    setupObserver();
};

// Recenzii - Interactive star rating logic
const stars = document.querySelectorAll('#star-rating i');
let selectedRating = 0;

stars.forEach(star => {
    star.addEventListener('mouseover', () => {
        const value = star.getAttribute('data-value');
        highlightStars(value);
    });

    star.addEventListener('mouseout', () => {
        highlightStars(selectedRating); // Reset to selected rating
    });

    star.addEventListener('click', () => {
        selectedRating = star.getAttribute('data-value');
        highlightStars(selectedRating);
    });
});

// Highlight stars up to a specific value
function highlightStars(value) {
    stars.forEach(star => {
        if (star.getAttribute('data-value') <= value) {
            star.classList.remove('text-muted');
            star.classList.add('text-warning');
        } else {
            star.classList.remove('text-warning');
            star.classList.add('text-muted');
        }
    });
}

// Handle form submission
const form = document.getElementById('review-form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const reviewMessage = document.getElementById('review-message').value;
    const name = document.getElementById('review-name').value;

    if (selectedRating === 0) {
        alert('Te rugăm să selectezi o notă!');
        return;
    }

    if (!reviewMessage.trim()) {
        alert('Te rugăm să completezi mesajul recenziei!');
        return;
    }

    // Trimite datele către server
    const reviewData = {
        name: name,
        rating: selectedRating,
        message: reviewMessage
    };

    fetch('/reviews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
    })
    .then(response => response.json()) // Preia răspunsul ca JSON
    .then(data => {
        if (data.message === 'Recenzia a fost salvată cu succes!') {
            alert('Recenzia a fost salvată cu succes!');
            form.reset();
            selectedRating = 0;
            highlightStars(selectedRating); // Reset stars
        } else {
            alert('A apărut o eroare: ' + (data.error || 'Detalii necunoscute.'));
        }
    })
    .catch(error => {
        console.error('Eroare:', error);
        alert('A apărut o eroare la trimiterea recenziei.');
    });
});

// Funcție pentru a anima numărul de persoane din formularul de rezervare
const numarPersonaleInput = document.getElementById('numarPersonale');
numarPersonaleInput.addEventListener('input', () => {
    const numarPersonale = numarPersonaleInput.value;
    if (numarPersonale) {
        animateNumber('numarPersonale', parseInt(numarPersonale)); // Animația pentru numărul de persoane
    }
});
