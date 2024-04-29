export function codePostal() {
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', function (event) {
        const inputValue = event.target.value;
        // Sécurité : vérifie que le code postal saisi a 5 chiffres
        if (inputValue.length === 5) {
            const urlCodePostal = `https://geo.api.gouv.fr/communes?codePostal=${inputValue}`;
            console.log(urlCodePostal);

            const codePostalPromise = new Promise(function (resolve, reject) {
                // Vérification si l'URL du code postal est bien définie
                if (urlCodePostal !== undefined) {
                    resolve(urlCodePostal);
                } else {
                    reject("Erreur:  URL dosn't work");
                }
            });

            codePostalPromise
            // récupération de mon url dans ma promesse 
                .then(function (codePostalUrl) {
                        // Fetch de l'URL pour récupérer les données
                    return fetch(codePostalUrl);
                })
                .then(function (response) {
                     // Retourne la réponse de mon url sous forme de JSON
                    return response.json();
                })
                .then(function (cities) {

                    const templateHtml = document.querySelector('#cities');
                    const divContainer = document.createElement('div');
                    divContainer.classList.add('firstDivContainer');
                    // valeur def pour ccl du total de la population
                    let totalPopulation = 0;
                    // clonage du template

                    for (let i = 0; i < cities.length; i++) {
                        let cloneTemplate = document.importNode(templateHtml.content, true);
                        const cityContainer = cloneTemplate.querySelector('.cityWrapper');
                        const cityCode = cloneTemplate.querySelector('.CP');
                        const cityName = cloneTemplate.querySelector('.cityName');
                        const cityPopulation = cloneTemplate.querySelector('.cityLiving');

                        cityCode.textContent = cities[i].code;
                        cityName.textContent = cities[i].nom;
                        cityPopulation.textContent = cities[i].population;

                        // calcul population total d'un département
                        totalPopulation += cities[i].population;

                        divContainer.appendChild(cityContainer);
                    }
                    // Affichage de messages en fonction du nombre de villes trouvées
                    const phrase = document.createElement('p');
                    if (cities.length === 0) {
                        phrase.textContent = 'Aucune ville trouvée avec ce code postal.';
                    } else if (cities.length === 1) {
                        phrase.textContent = 'Une seule ville trouvée avec ce code postal.';
                    } else {
                        phrase.textContent = `Il y a ${cities.length} villes possédant ce code postal, pour un total de ${totalPopulation} habitants.`;
                    }
                    searchInput.after(phrase)
                    phrase.after(divContainer);
                })
                .catch(function (error) {
                    console.error('Erreur:', error);
                });
        }
        // si il n'y a pas 5 chiffres dans mon input utilisation de ma function clearresults
        else if (inputValue.length !== 5) {
            clearResults();
        }
    });
    
    // création d'une function pour vider le contenu de mon template et de ma phrase au besoin
    function clearResults() {
        const divContainer = document.querySelector('.firstDivContainer');
        const deletePhrase = document.querySelector('p')
        if (divContainer) {
            divContainer.innerHTML = ''; // Vide le contenu du template
            deletePhrase.innerHTML = '';
        }
    }

}
