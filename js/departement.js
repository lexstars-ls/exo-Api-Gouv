let urlDepartement = "https://geo.api.gouv.fr/departements";

export function departement() {
    const departementPromise = new Promise(function (resolve, reject) {
        // promesse qui vérifie si url département est bien présente
        if (urlDepartement !== undefined) {
            resolve(urlDepartement);
            console.log('Département disponible');
        } else {
            reject("Erreur: URL de département non définie");
            console.log('Département indisponible');
        }
    });

    departementPromise
        .then(function (departementUrl) {
            return fetch(departementUrl);
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (departements) {

            const selectElement = document.getElementById("departementArea");

            // Boucle à travers les départements
            for (let i = 0; i < departements.length; i++) {
                const departement = departements[i];
                const option = document.createElement("option");
                const departementInfo = `${departement.code} - ${departement.nom}`;
                option.textContent = departementInfo;
                selectElement.appendChild(option);

                // IMPORTANT permet a mon event target de récupérer la bonne valeur
                option.value = departement.code;
            }

            // A chaque changement de valeur je récup option value et fetch sur celui si.
            // Le fetch me permet de recupérer toutes les communes qui ont le meme code de département
            selectElement.addEventListener('change', function (event) {
                // Récupérer la valeur sélectionnée
                const selectedValue = event.target.value;
                const urlCity = `https://geo.api.gouv.fr/departements/${selectedValue}/communes`;

                // Appel de ma function qui s'occuper de récupérer les infos des villes ect
                fetchCity(urlCity);

                return departement.length;
            });
        })
        .catch(function (error) {
            console.error(error);
        });
}
// function pour le clonage et la création de mes li et des valeurs des villes
// function qui gère la phrase et le calcul du nbr total hbt
function fetchCity(urlCity) {
    fetch(urlCity)
        .then(function (response) {
            return response.json();
        })
        .then(function (cities) {
            const templateHtml = document.querySelector('#cities');
            const divContainer = document.createElement('div')
            divContainer.classList.add('divContainer');

            const body = document.querySelector('body');
            let totalPopulation = 0;

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
            const phraseNbrVille = document.querySelector('#nombre');
            phraseNbrVille.textContent = cities.length + " " +"villes";
            const phraseNbr = document.querySelector('#habitants');
            phraseNbr.textContent = totalPopulation;

            console.log('Population totale:', totalPopulation);
            body.appendChild(divContainer);

        })

        .catch(function (error) {
            console.error(error + "fetch introuvable");
        });

}

