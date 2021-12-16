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
};

//Renders error if promise is not fulfilled
const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
};

//displaying the dynamic html
const displayCountry = function (input) {
  getCountryData(input);
};

//Capturing the string
const countryString = function () {
  input = document.getElementById('country-input').value;
  displayCountry(input);
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

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    //throwing an error inside the callback function of the then method
    //immediately rejects the promise, traveling down the chain until it is 'caught'
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

//Getting the data using fetch and promises
const getCountryData = function (country) {
  //Country 1

  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(data => {
      renderCountry(data[0]);
      const neighbor = data[0].borders;
      //showing an error if there is no neighbor
      if (!neighbor) throw new Error('No neighbor found!');
      //Country 2
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbor[0]}`,
        'Country not found'
      );
    })

    .then(data => renderCountry(data[0], 'neighbor'))
    //catching the error anywhere in the promise chain
    .catch(err => {
      console.error(`${err} ❌❌❌`);
      //err.message is what we created in line 65
      renderError(`Something went wrong ❌❌❌ ${err.message}. Try again!`);
    })
    //no matter if fulfilled or rejected, this will always be called
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getCountryData('usa');
});

//executor function
const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('Lottery draw is happening 🔮');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('You Win 🤑');
    } else {
      reject(new Error('You lose 😢'));
    }
  }, 2000);
});

lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));

//promisifying setTimeout
const wait = seconds => {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
};

wait(1)
  .then(() => {
    console.log('1 second passed');
    return wait(1);
  })
  .then(() => {
    console.log('2 second passed');
    return wait(1);
  })
  .then(() => {
    console.log('3 second passed');
    return wait(1);
  })
  .then(() => {
    console.log('4 second passed');
    return wait(1);
  });

//callback hell
// setTimeout(() => {
//   console.log('1 second passed');
//   setTimeout(() => {
//     console.log('2 seconds passed');
//     setTimeout(() => {
//       console.log('3 seconds passed');
//       setTimeout(() => {
//         console.log('4 seconds passed');
//       }, 1000);
//     }, 1000);
//   }, 1000);
// }, 1000);

//resolve is a static method on the promise constructor
Promise.resolve('abc').then(x => console.log(x));
Promise.reject(new Error('Problem!')).catch(x => console.error(x));
