'use strict';

const btn = document.querySelector('.btn-country');
const btnInput = document.getElementById('input-btn');
const countriesContainer = document.querySelector('.countries');

let input;

const renderCountry = function (data, className = '') {
  //by adding className, and inserting neighbor, we get the styling from CSS for .neighbor
  const html = `        
  <article class="country ${className}">
    <img class="country__img" src="${data.flags.png}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} Million people</p>
      <p class="country__row"><span>🗣️</span>${
        Object.values(data.languages)[0]
      }</p>
      <p class="country__row"><span>💰</span>${
        Object.values(data.currencies)[0].name
      }</p>
    </div>
  </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

//Renders error if promise is not fulfilled
const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
};

//Capturing the string
const countryString = function () {
  input = document.getElementById('country-input').value;
  whereAmI(input);
  clearString();
};

// clears the input to an empty string
const clearString = function () {
  document.getElementById('country-input').value = '';
};

// using enter to submit input
const enterKeyPressed = function (e) {
  if (e.keyCode == 13) {
    countryString();
  }
};
btnInput.addEventListener('click', countryString);

// const getJSON = function (url, errorMsg = 'Something went wrong') {
//   return fetch(url).then(response => {
//     //throwing an error inside the callback function of the then method
//     //immediately rejects the promise, traveling down the chain until it is 'caught'
//     if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

//     return response.json();
//   });
// };

//Getting the data using fetch and promises
// const getCountryData = function (country) {
//   //Country 1

//   getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
//     .then(data => {
//       renderCountry(data[0]);
//       const neighbor = data[0].borders;
//       //showing an error if there is no neighbor
//       if (!neighbor) throw new Error('No neighbor found!');
//       //Country 2
//       return getJSON(
//         `https://restcountries.com/v3.1/alpha/${neighbor[0]}`,
//         'Country not found'
//       );
//     })

//     .then(data => renderCountry(data[0], 'neighbor'))
//     //catching the error anywhere in the promise chain
//     .catch(err => {
//       console.error(`${err} ❌❌❌`);
//       //err.message is what we created in line 65
//       renderError(`Something went wrong ❌❌❌ ${err.message}. Try again!`);
//     })
//     //no matter if fulfilled or rejected, this will always be called
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     });
// };

// btn.addEventListener('click', function () {
//   getCountryData('usa');
// });

// const getPosition = function () {
//   return new Promise(function (resolve, reject) {
//     // navigator.geolocation.getCurrentPosition(
//     //   position => resolve(position),
//     //   err => reject(err)
//     // );
//     navigator.geolocation.getCurrentPosition(resolve, reject);
//   });
// };

// getPosition().then(pos => console.log(pos));

// const whereAmI = function () {
//   getPosition()
//     .then(pos => {
//       const { latitude: lat, longitude: lng } = pos.coords;

//       return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
//     })

//     .then(response => {
//       if (!response.ok) {
//         throw new Error(`Problem with geocoding ${response.status}`);
//       }
//       return response.json();
//     })
//     .then(data => {
//       console.log(data);
//       console.log(`You are in ${data.city}, ${data.country}`);
//     })
//     .catch(err => {
//       console.error(`${err} ❌❌❌`);
//       renderError(`Something went wrong ❌❌❌ ${err.message}. Try again!`);
//     });
// };

const whereAmI = async function (country) {
  const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
  const data = await res.json();
  console.log(data);
  renderCountry(data[0]);
};

whereAmI('usa');
console.log('First');
// btn.addEventListener('click', whereAmI);
