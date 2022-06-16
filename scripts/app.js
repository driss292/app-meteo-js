import tabJoursEnOrdre from "./Utilitaire/gestionTemps.js";
import WEATHER_API_KEY from "./Utilitaire/apiKey.js";
// console.log(tabJoursEnOrdre);

const API_KEY = WEATHER_API_KEY;

const temps = document.querySelector(".temps");
const temperature = document.querySelector(".temperature");
const localisation = document.querySelector(".localisation");
const heure = document.querySelectorAll(".heure-nom-prevision");
const tempPourH = document.querySelectorAll(".heure-prevision-valeur");
const logoMeteo = document.querySelector(".logo-meteo");
const joursDiv = document.querySelectorAll(".jour-prevision-nom");
const tempJourDiv = document.querySelectorAll(".jour-prevision-temp");
const chargementContainer = document.querySelector(".overlay-icone-chargement");

let resultatsAPI;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            // console.log(position);
            let long = position.coords.longitude;
            let lat = position.coords.latitude;
            appelAPI(long, lat);
        },
        () => {
            alert(
                `Vous avez refusé la géolocalisation, l'application ne peut pas fonctionner, veuillez l'activer !`
            );
        }
    );
}

function appelAPI(long, lat) {
    fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${API_KEY}`
    )
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // console.log(data);
            resultatsAPI = data;
            temps.innerText = resultatsAPI.current.weather[0].description;
            temperature.innerText = `${Math.round(
                resultatsAPI.current.temp
            )}°C`;
            localisation.innerText = resultatsAPI.timezone;

            // Les heures par tranches de trois, avec leur température

            let heureActuelle = new Date().getHours();

            for (let i = 0; i < heure.length; i++) {
                let heureIncr = heureActuelle + i * 3;
                if (heureIncr > 24) {
                    heure[i].innerText = `${heureIncr - 24}h`;
                } else if (heureIncr === 24) {
                    heure[i].innerText = `0h`;
                } else {
                    heure[i].innerText = `${heureIncr}h`;
                }
            }

            // températures par tranche de trois heures

            for (let j = 0; j < tempPourH.length; j++) {
                tempPourH[j].innerText = `${Math.round(
                    resultatsAPI.hourly[j * 3].temp
                )}°C`;
            }

            // Trois premières lettres du jours

            for (let k = 0; k < tabJoursEnOrdre.length; k++) {
                joursDiv[k].innerText = tabJoursEnOrdre[k].slice(0, 3);
            }

            // Température par jour

            for (let m = 0; m < 7; m++) {
                tempJourDiv[m].innerText = `${Math.trunc(
                    resultatsAPI.daily[m + 1].temp.day
                )}°C`;
            }

            // Icon dynamique
            if (heureActuelle >= 6 && heureActuelle < 21) {
                logoMeteo.src = `./ressources/jour/${resultatsAPI.current.weather[0].icon}.svg`;
            } else {
                logoMeteo.src = `./ressources/nuit/${resultatsAPI.current.weather[0].icon}.svg`;
            }
            chargementContainer.classList.add("disparition");
        });
}
