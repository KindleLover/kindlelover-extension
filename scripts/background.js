'use strict';
chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        // pageUrl: { hostEquals: 'sachvui.com' },
      })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.greeting == "getCookies")
      chrome && chrome.cookies && chrome.cookies.getAll({ url: 'http://tve-4u.org' },
        function (cookie) {
          chrome.storage.sync.set({
            cookiesTve4U: cookie
          }, function () {
            console.log('save successfully')
            // alertSuccess.classList.remove("hide-div")
          })
        })
  });