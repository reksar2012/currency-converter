const axios = require('axios');
const privateKey = '4b8614857b6521c042b5d7cee5a773ce';
const getExchangeRate = async (fromCurrency, toCurrency) => {
    try {
        const response = await axios.get(
            `http://www.apilayer.net/api/live?access_key=${privateKey}`,
        );
        const rate = response.data.quotes;
        const baseCurrency = response.data.source;
        const usd = 1 / rate[`${baseCurrency}${fromCurrency}`];
        const exchangeRate = usd * rate[`${baseCurrency}${toCurrency}`];

        return exchangeRate;
    } catch (error) {
        throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`);
    }
};

const getCountries = async currencyCode => {
    try {
        const response = await axios.get(
            `https://restcountries.eu/rest/v2/currency/${currencyCode}`,
        );

        return response.data.map(country => country.name);
    } catch (error) {
        throw new Error(`Unable to get countries that use ${currencyCode}`);
    }
};

const getCountriesList = async () => {
    try {
        const response = await axios.get(`http://apilayer.net/api/list?access_key=${privateKey}`);
        return response.data.currencies;
    } catch (error) {
        throw new Error(`Unable to get countries`);
    }
};

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
    const countries = await getCountries(toCurrency);
    const convertedAmount = (amount * exchangeRate).toFixed(2);

    return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can spend these in the following countries: ${countries}`;
};

var Converter = {
    convertCurrency: convertCurrency,
    getCountriesList: getCountriesList,
};

module.exports = Converter;
