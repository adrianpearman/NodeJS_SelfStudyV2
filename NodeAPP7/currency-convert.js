// This function is used to grab the currency difference
const axios = require('axios')

// Non ASYNC Version
// const getExchangeRate = (from, to) => {
//   return axios.get(`https://api.fixer.io/latest?base=${from}`).then((res) => {
//     return res.data.rates[to.toUpperCase()]
//   })
// }

// ASYNC Version
const getExchangeRate = async(from, to) => {
  try {
    const res = await axios.get(`https://api.fixer.io/latest?base=${from}`)
    const rate = res.data.rates[to.toUpperCase()]
    if (rate) {
      return rate
    } else {
      throw new Error()
    }
  } catch (e) {
    throw new Error(`Unable to get exchange rate for ${from} and ${to}`)
  }

}

// Non ASYNC Version
// const getCountries = (currencyCode) => {
//   return axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`).then((res) => {
//     return res.data.map((country) => {
//       return country.name
//     })
//   })
// }

// ASYNC Version
const getCountries = async(countryCode) => {
  try {
    const res = await axios.get(`https://restcountries.eu/rest/v2/currency/${countryCode}`)
    return res.data.map((country) => {
      return country.name
    })
  } catch (e) {
    throw new Error(`Unable to get countries that use the currency: ${countryCode}`)
  }
}

const convertCurrency = (from,to,amount) => {
  let countries;
  return getCountries(to.toUpperCase()).then((tempCountries) => {
    countries = tempCountries
    return getExchangeRate(from.toUpperCase(),to.toUpperCase())
  }).then((rate) => {
    const exchangedAmount = amount * rate

    return`${amount} ${from.toUpperCase()} is worth ${exchangedAmount} ${to.toUpperCase()}. ${to.toUpperCase()} can be used in the following countries: ${countries.join(', ')}`
  })
}

const altConvertCurrency = async(from,to,amount) => {
  const countries = await getCountries(to)
  const rate = await getExchangeRate(from, to)
  const exchangedAmount = amount * rate

  return`${amount} ${from.toUpperCase()} is worth ${exchangedAmount} ${to.toUpperCase()}. ${to.toUpperCase()} can be used in the following countries: ${countries.join(', ')}`
}


// getExchangeRate('USD', 'cad').then((rate) => {
//   console.log(rate);
// })
//
// getCountries('USD').then((countries) => {
//   console.log(countries);
// }).catch((e) => {
//   console.log(e.message);
// })
//
// convertCurrency('usd', 'eur', 100).then((countries) => {
//   console.log(countries);
// }).catch((e) => {
//   console.log(e.message);
// })

altConvertCurrency('CAD', 'usd', 100).then((countries) => {
  console.log(countries);
}).catch((e) => {
  console.log(e.message);
})
