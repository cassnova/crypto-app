const url =
  "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

const form = document.getElementById("form-search");
const coin = document.getElementById("coin");
const crypto = document.getElementById("crypto");
const cryptoResponse = document.getElementById("crypto-response");
const errorMessage = document.getElementById("error-response");

const searchObj = {
  coin: "",
  crypto: "",
};

document.addEventListener("DOMContentLoaded", () => {
  getApiCryptos();
  form.addEventListener("submit", submitForm);
  coin.addEventListener("change", getValue);
  crypto.addEventListener("change", getValue);
});

function submitForm(e) {
  e.preventDefault();
  const { coin, crypto } = searchObj;
  coin === "" || crypto === ""
    ? showError("Ey! you must choose both options")
    : null;
  //return;
  checkingApi(coin, crypto);
}

function checkingApi(coin, crypto) {
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${crypto}&tsyms=${coin}`;
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((body) => {
      showCryptos(body.DISPLAY[crypto][coin]);
    })
    .catch((err) => {
      console.error(err);
    });
}

function showCryptos(data) {
  clearHTML();
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = data;
  const result = document.createElement("div");
  result.classList.add("container__result");
  result.innerHTML = `
    <p>Price: <span class="container__result-p">${PRICE}</span></p>
    <p>Highest price of the day: <span class="container__result-p">${HIGHDAY}</span></p>
    <p>Lowest price of the day: <span class="container__result-p">${LOWDAY}</span></p>
    <p>Variation of the last 24 hours: <span class="container__result-p">${CHANGEPCT24HOUR}%</span></p>
    <p>Last update: <span class="container__result-p">${LASTUPDATE}</span></p>
  `;
  cryptoResponse.appendChild(result);
}

function showError(message) {
  const error = document.createElement("p");
  error.classList.add("error");
  error.textContent = message;
  errorMessage.appendChild(error);
  setTimeout(() => {
    error.remove();
  }, 3000);
}

function getValue(e) {
  searchObj[e.target.name] = e.target.value;
}

// This function "getApiCryptos" get the endpoint from the crypto compare api.
function getApiCryptos() {
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((body) => {
      selectCryptos(body.Data);
    })
    .catch((err) => {
      console.error(err);
    });
}

// This function "selectCryptos" receive the parameter cryptos. This parameter is the object from de endpoint and iterate all data and
// create the options in the select form from html
function selectCryptos(cryptos) {
  cryptos.forEach((e) => {
    const { FullName, Name } = e.CoinInfo;
    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    crypto.appendChild(option);
  });
}

function clearHTML() {
  cryptoResponse.innerHTML = "";
}
