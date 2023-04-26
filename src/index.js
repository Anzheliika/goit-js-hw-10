import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  event.preventDefault();
  const inputValue = refs.input.value.trim();
  console.log(inputValue);

  if (inputValue.length === 0) {
    clearCountryList();
    return;
  }

  fetchCountries(inputValue).then(onSearchCountry).catch(onError);
}

function onSearchCountry(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    clearCountryList();
  } else if (countries.length >= 2 && countries.length <= 10) {
    clearCountryInfo();
    markupList = createCoutriesList(countries);
    updateCoutriesList(markupList);
  } else if (countries.length === 1) {
    clearCountryList();
    markupInfo = createCoutryInfo(countries);
    updateCoutryInfo(markupInfo);
  }
}

function createCoutriesList(countries) {
  return countries
    .map(({ flags, name }) => {
      return `
        <li class="country-item">
        <img src=${flags.svg} class="country-img">
        <h2 class="country-name-list">${name.official}</h2>
        </li>
        `;
    })
    .join('');
}

function createCoutryInfo(countries) {
  return countries
    .map(({ flags, name, capital, population, languages }) => {
      return `
      <div class="basic-info">
    <img src=${flags.svg} class="country-img">
    <h2 class="country-name">${name.official}</h2>
      </div>
    <ul class="secondary-info">
    <li class="country-info">Capital: <span class="country-span">${capital}</span></li>
    <li class="country-info">Population: <span class="country-span">${population}</span></li>
    <li class="country-info">Languages: <span class="country-span">${Object.values(
      languages
    )}</span></li>
    </ul>
    `;
    })
    .join('');
}

function updateCoutriesList(markup) {
  refs.countryList.innerHTML = markup;
}

function updateCoutryInfo(markup) {
  refs.countryInfo.innerHTML = markup;
}

function clearCountryList() {
  refs.countryList.innerHTML = '';
}

function clearCountryInfo() {
  refs.countryInfo.innerHTML = '';
}
function onError() {
  clearCountryList();
  Notify.failure('Oops, there is no country with that name');
}
