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
  getCountryData(input);
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

// Getting the data using fetch and promises
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

const getNeighbor = async function (data) {
  try {
    if (!data[0].borders) throw new Error('No borders exist');
    const neighborAlpha = data[0].borders[0];
    const getNeighbor = await fetch(
      `https://restcountries.com/v3.1/alpha/${neighborAlpha}`
    );
    if (!getNeighbor.ok) throw new Error('Problem getting neighbor');
    //using new data to run render country with neighbor
    const neighborData = await getNeighbor.json();
    renderCountry(neighborData[0], 'neighbor');
  } catch (err) {
    renderError(`❌ ${err.message} `);
  }
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function () {
  try {
    //Geolocation
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    //Reverse Geocoding
    const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    if (!resGeo.ok) throw new Error('Problem getting location data');
    const dataGeo = await resGeo.json();

    //Country Data
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.country}`
    );
    if (!res.ok) throw new Error('Problem getting country');

    const data = await res.json();
    renderCountry(data[0]);
    getNeighbor(data);
  } catch (err) {
    console.error(`${err} ❌`);
    renderError(`❌ ${err.message} `);

    //Reject promise returned from async function
    throw err;
  }
};
btn.addEventListener('click', whereAmI);

const getCountryData = async function (country) {
  //Fetch country data
  try {
    const getCountry = await fetch(
      `https://restcountries.com/v3.1/name/${country}`
    );
    //error handling
    if (!getCountry.ok) throw new Error('Problem getting country');
    const countryData = await getCountry.json();
    console.log(countryData);
    //using previous data to get neighbor alphacode
    renderCountry(countryData[0]);
    getNeighbor(countryData);
  } catch (err) {
    console.error(`${err} ❌`);
    renderError(`❌ ${err.message} `);
  }
};
/*
console.log('1: Will get location');


//convert to all async await
// .then(city => console.log(`2: ${city}`))
// .catch(err => )
// .finally(() => console.log('3: Finished getting location '));

//IIFE 
(async function() {
  try {
    const city = await whereAmI()
    console.log(`2: ${city}`)
  } catch(err) {
    console.error(`2: ${err.message} ❌`)
  } 
  console.log('3: Finished getting location ')
})();



const get3Countries = async function (c1, c2, c3) {
  try {
    // const [data1] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`)
    // const [data2] = await getJSON(`https://restcountries.com/v3.1/name/${c2}`)
    // const [data3] = await getJSON(`https://restcountries.com/v3.1/name/${c3}`)

    //static method on promise constructor, 
    // if one promise rejects, it rejects the whole promise, combinator function
    const data = await Promise.all([
    getJSON(`https://restcountries.com/v3.1/name/${c1}`), 
    getJSON(`https://restcountries.com/v3.1/name/${c2}`),
    getJSON(`https://restcountries.com/v3.1/name/${c3}`),
  ]);
console.log(data.flatMap(d => d[0].capital));
} catch(err) {
    console.error(err);
  }
};

get3Countries('portugal', 'canada', 'tanzania')



//Practice with Promise combinators

// Promise.race (recieves an array of promises and also returns a promise, the
// promise is settled as soon as 1 of the input promises is settled "first
// settled promise wins the race", short circuits whenever one of the promises
// gets settled, fulfilled or rejected, good for long promises)

(async function () {
  const res = await Promise.race([
    getJSON(`https://restcountries.com/v3.1/name/italy`),
    getJSON(`https://restcountries.com/v3.1/name/egypt`),
    getJSON(`https://restcountries.com/v3.1/name/mexico`),
  ]);
  console.log(res[0]);
})();

const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error('Request took too long!'));
    }, sec * 1000);
  });
};

Promise.race([
  getJSON(`https://restcountries.com/v3.1/name/mexico`),
  timeout(1),
])
  .then(res => console.log(res[0]))
  .catch(err => console.error(err));

//Promise.allSettled (ES2020 recieves an array of promises and also returns all the
//settled promises, rejected or not, never short cicuits)
Promise.allSettled([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another Success'),
]).then(res => console.log(res));

//Promise.all comparison(short circuits if there is 1 error)
Promise.all([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another Success'),
])
  .then(res => console.log(res))
  .catch(err => console.error(err));

//Promise.any (ES2021 recieves an array of promises, return the first fulfilled
//promise, and ignore rejections, will always be fulfilled promise, unless all reject)

Promise.any([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another Success'),
])
  .then(res => console.log(res))
  .catch(err => console.error(err));
*/
