'use strict';

const btnInput = document.getElementById('input-btn');
const countriesContainer = document.querySelector('.countries');

let input;

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

// Getting data using fetch and promises
const getCountryData = function (country) {
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(response => response.json())
    .then(data => renderCountry(data[0]));
};
