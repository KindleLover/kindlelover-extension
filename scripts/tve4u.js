function appendChildTve4U() {
  const referenceNode = document.querySelectorAll("a[href*='-mobi.']")[0]
    || document.querySelectorAll("a[href*='-epub.']")[0]
    || document.querySelectorAll("a[href*='-azw3.']")[0]
    || document.querySelectorAll("a[href*='-pdf.']")[0]

  let attachFile = document.getElementsByClassName('attachedFilesHeader')[0];

  var sendButton = document.createElement('div');
  // var hrElement = document.createElement('br');
  sendButton.innerHTML = "Send to Kindle"
  sendButton.className = 'button-send-kindle';
  sendButton.type = 'button'

  referenceNode && referenceNode.href && attachFile && attachFile.parentNode.insertBefore(sendButton, attachFile.nextSibling)

  chrome.runtime.sendMessage({ greeting: "getCookies" }, function (response) {
    console.log('sent =>>');
  });

  var error = document.createElement('div');
  error.innerHTML = "Please set up email in setting!"
  error.className = 'error-div'

  sendButton.addEventListener("click", () => {
    chrome.storage.sync.get('mailAccount', function (result) {
      const checkValidObj = result && result.mailAccount && Object.values(result && result.mailAccount).some(x => x && x.length > 0)
      if (!checkValidObj) {
        // element.insertBefore(error, elementReadOnline);
        sendButton.parentNode.insertBefore(error, sendButton.nextSibling)
        toastr.options.closeDuration = 1000;
        toastr.error('Please set up email in extension options setting!')
        return
      }
      if (!referenceNode.getAttribute("href")) {
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
        confirmText: 'Send',
        event: {
          // close: function () { alert('ok') },
          // cancel: function () { },
          confirm: function () {
            chrome.storage.sync.get('cookiesTve4U', async function (result) {
              console.log('resultresult', result)
              let cookie = ''
              result && result.cookiesTve4U && result.cookiesTve4U.forEach(element => {
                cookie += `${element.name}=${element.value}; `
              });
              var cipherCookie = CryptoJS.AES.encrypt(JSON.stringify(cookie), 'kindleloverScret').toString();
              try {
                const sendResult = await fetch('http://localhost:5000/api/send-link', {
                  body: JSON.stringify({ kindleMail, amzMail, url: referenceNode.href, randomCode: cipherCookie }),
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
