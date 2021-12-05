'use strict';

const countryBtn = document.getElementById('country-btn');

let input;

//displaying the dynamic html
const displayCountry = function (input) {
  getCountryData(input);
};

//Capturing the string function
const countryString = function () {
  input = document.getElementById('country-input').value;
  console.log(input);
  displayCountry(input);
  clearString();
};

const clearString = function () {
  document.getElementById('country-input').value = '';
};
countryBtn.addEventListener('click', countryString);

const getCountryData = function (country) {
  const btn = document.querySelector('.btn-country');
  const countriesContainer = document.querySelector('.countries');

  ///////////////////////////////////////
  // https://restcountries.com/v2/

  //Asynchronous Javascript and XML

  //old way
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v2/name/${country}`);
  //Send off the request fetching the data
  request.send();

  //Once done it will emit the load event, triggering the callback function
  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    //Copied from commented section
    const html = `        <article class="country">
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
  });
};

// no string restrictions implemented yet
