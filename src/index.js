import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('input#search-box');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

const searchInput = e => {
  const searchCountry = e.target.value.trim();
  if (searchCountry === '') {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    return;
  }

  fetchCountries(searchCountry)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      let result = countries.findIndex(
        el => el.name.official.toUpperCase() === searchCountry.toUpperCase()
      );
      if (countries.length > 1 && countries.length <= 10 && result) {
        countryInfo.innerHTML = '';
        countryList.innerHTML = countries
          .map(
            e =>
              `<li><img src="${e.flags.svg}" alt="flag" width="20"> <span>${e.name.official}</span></li>`
          )
          .join('');
        return;
      }
      if (result) {
        result = 0;
      }

      const country = countries[result];
      countryList.innerHTML = '';
      countryInfo.innerHTML = `<p><img src="${
        country.flags.svg
      }" alt="flag" height="25">
<span class="title"> ${country.name.official}</span></p>
<p><strong>Capital:</strong> ${country.capital.join(', ')}</p>
<p><strong>Population:</strong> ${country.population}</p>
<p><strong>Languages:</strong> ${Object.keys(country.languages)}</p>`;
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      return;
    });
};

searchBox.addEventListener('keydown', debounce(searchInput, DEBOUNCE_DELAY));
