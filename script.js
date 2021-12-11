'use strict';

const btnInput = document.getElementById('input-btn');
const countriesContainer = document.querySelector('.countries');

let input;

//displaying the dynamic html
const displayCountry = function (input) {
  getCountryAndNeighbour(input);
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

const renderCountry = function (data, className = '') {
  //by adding className, and inserting neighbour, we get the styling from CSS for .neighbour
  const html = `        <article class="country ${className}">
  <img class="country__img" src="${data.flag}" />
  <div class="country__data">
    <h3 class="country__name">${data.name}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${(
      +data.population / 1000000
    ).toFixed(1)} Million people</p>
    <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
    <p class="country__row"><span>💰</span>${data.currencies[0].code}</p>
  </div>
</article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const getCountryAndNeighbour = function (country) {
  const btn = document.querySelector('.btn-country');

  ///////////////////////////////////////
  // https://restcountries.com/v2/

  //AJAX call country 1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v2/name/${country}`);
  //Send off the request fetching the data
  request.send();

  //Once done it will emit the load event, triggering the callback function
  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);
    // Render Country 1
    renderCountry(data);

    // Get neighbour country (2)
    const [neighbour] = data.borders;

    if (!neighbour) return;

    // AJAX call country 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v2/alpha/${neighbour}`);
    //Send off the request fetching the data
    request2.send();
    request2.addEventListener('load', function () {
      const data2 = JSON.parse(this.responseText);
      console.log(data2);

      renderCountry(data2, 'neighbour');
    });
  });
};
getCountryAndNeighbour('usa');
