'use strict';

let btnOptions = document.getElementById('change-options');

function constructOptions() {
  btnOptions.addEventListener('click', () => {
    chrome.tabs.create({ url: "options.html" });
  });
}
constructOptions();