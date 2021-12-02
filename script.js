'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
// https://restcountries.com/v2/

//Asynchronous Javascript and XML

//old way
const request = new XMLHttpRequest();
request.open('GET', '');
