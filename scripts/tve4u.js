// https://www.jqueryscript.net/lightbox/Customizable-Animated-Modal-Dialog.html


function appendChildTve4U() {
  chrome.runtime.sendMessage({ greeting: "getCookies" }, function (response) {
    console.log('sent =>>');
  });

  const refNode = document.querySelectorAll('.attachment .boxModelFixer')

  refNode && refNode.length > 0 && refNode.forEach(element => {
    if (element.querySelector('a') && element.querySelector('a').innerText === 'mobi'
      || element.querySelector('a') && element.querySelector('a').innerText === 'epub'
      || element.querySelector('a') && element.querySelector('a').innerText === 'azw3'
      || element.querySelector('a') && element.querySelector('a').innerText === 'prc'
    ) {
      var sendButton = document.createElement('div');
      sendButton.innerHTML = "Send to Kindle"
      sendButton.className = 'button-send-kindle';
      sendButton.type = 'button'

      var error = document.createElement('div');
      error.innerHTML = "Please set up email in setting!"
      error.className = 'error-div'

      element && element.parentNode.insertBefore(sendButton, element.nextSibling)

      sendButton.addEventListener("click", () => {
        chrome.storage.sync.get('mailAccount', function (result) {
          const checkValidObj = result && result.mailAccount && Object.values(result && result.mailAccount).some(x => x && x.length > 0)
          if (!checkValidObj) {
            sendButton.parentNode.insertBefore(error, sendButton.nextSibling)
            toastr.options.closeDuration = 1000;
            toastr.error('Please set up email in extension options setting!')
            return
          }
          if (!element.querySelector('a').getAttribute('href')) {
            error.innerHTML = "No link found!"
            toastr.error('No link found!')
            return
          }
          const kindleMail = result.mailAccount && result.mailAccount.kindleMail
          const amzMail = result.mailAccount && result.mailAccount.amzMail
          // sendLinkToKindle(referenceNode.href, kindleMail, amzMail)

          new Dialog({
            title: 'Kindle Lover',
            bodyContent: 'Are you sure you want to send this ebook <br /> to your kindle?',
            bodyTextAlign: 'center',
            buttonClassName: 'button-css',
            confirmText: 'Send',
            event: {
              // close: function () { alert('ok') },
              // cancel: function () { },
              confirm: function () {
                chrome.storage.sync.get('cookiesTve4U', async function (result) {
                  let cookie = ''
                  result && result.cookiesTve4U && result.cookiesTve4U.forEach(element => {
                    cookie += `${element.name}=${element.value}; `
                  });
                  var cipherCookie = CryptoJS.AES.encrypt(JSON.stringify(cookie), 'kindleloverScret').toString();
                  try {
                    const sendResult = await fetch('https://kindlelover.com/api/send-link', {
                      body: JSON.stringify({ kindleMail, amzMail, url: window.location.origin + '/' + element.querySelector('a').getAttribute('href'), randomCode: cipherCookie }),
                      method: "POST",
                      headers: {
                        "content-type": "application/json",
                      },
                    });
                    console.log('sendResult', sendResult)
                    if (sendResult && sendResult.ok) {
                      toastr.success(`We're processing your e-book right now, and we'll email you as soon as it's been delivered to your Kindle.`)
                    } else {
                      toastr.error('Error! Please contact develop!')
                    }
                  } catch (e) {
                    console.log('err send link', e)
                  }
                });
              }
            }
          });

        });
      })
    }
  });
}
