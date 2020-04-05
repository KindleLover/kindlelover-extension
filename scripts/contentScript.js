
//https://github.com/CodeSeven/toastr
//https://www.jqueryscript.net/lightbox/Customizable-Animated-Modal-Dialog.html
//https://gomakethings.com/how-to-insert-an-element-after-another-one-in-the-dom-with-vanilla-javascript/
async function sendLinkToKindle(url, kindleMail, amzMail) {
  try {
    const sendResult = await fetch('https://kindlelover.com/api/send-link', {
      body: JSON.stringify({ kindleMail, amzMail, url }),
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
}

function handleSendButton(sendButton, error, els) {
  sendButton.addEventListener("click", () => {
    chrome.storage.sync.get('mailAccount', function (result) {
      const checkValidObj = result && result.mailAccount && Object.values(result && result.mailAccount).some(x => x && x.length > 0)
      if (!checkValidObj) {
        sendButton.parentNode.insertBefore(error, sendButton.nextSibling)
        toastr.options.closeDuration = 1000;
        toastr.error('Please set up email in extension options setting!')
        return
      }
      if (!els.getAttribute("href")) {
        error.innerHTML = "No link found!"
        toastr.error('No link found!')
        return
      }
      const kindleMail = result.mailAccount && result.mailAccount.kindleMail
      const amzMail = result.mailAccount && result.mailAccount.amzMail

      new Dialog({
        title: 'Kindle Lover',
        bodyContent: 'Are you sure you want to send this ebook <br /> to your kindle?',
        bodyTextAlign: 'center',
        confirmText: 'Send',
        event: {
          // close: function () { alert('ok') },
          // cancel: function () { },
          confirm: function () {
            sendLinkToKindle(els.href, kindleMail, amzMail)
          }
        }
      });

    });
  })
}

function appendChildSachVui() {
  var btnReadOnline = document.querySelectorAll("a.btn.btn-warning.btn-md")[0]; // doc online button
  var sendButton = document.createElement('a');
  var error = document.createElement('div');

  sendButton.innerHTML = "Send to Kindle"
  sendButton.className = 'button-send-kindle';
  sendButton.type = 'button'
  sendButton.id = 'btn-send-kindle'

  var element = document.getElementsByClassName('col-md-8')[0]; //parent
  error.innerHTML = "Please set up email in setting!"
  error.className = 'error-div'

  const els = document.querySelectorAll("a[href*='https://sachvui.com/download/mobi/']")[0]
    || document.querySelectorAll("a[href*='https://sachvui.com/download/epub/']")[0]
    || document.querySelectorAll("a[href*='https://sachvui.com/download/pdf/']")[0];

  els && els.href && element.insertBefore(sendButton, btnReadOnline)

  handleSendButton(sendButton, error, els)
}

function appendChildGenLibRusEc() {
  const referenceNode = document.querySelectorAll("a[href$='.mobi']")[0]
    || document.querySelectorAll("a[href$='.epub']")[0]
    || document.querySelectorAll("a[href$='.pdf']")[0]
    || document.querySelectorAll("a[href$='.azw3']")[0]
    || document.querySelectorAll("a[href$='.prc']")[0]
  console.log('elementPoint', referenceNode)
  var sendButton = document.createElement('div');
  var hrElement = document.createElement('br');
  hrElement.id = 'hrElement'
  sendButton.innerHTML = "Send to Kindle"
  sendButton.className = 'button-send-kindle';
  sendButton.type = 'button'

  referenceNode && referenceNode.href && referenceNode.parentNode.insertBefore(hrElement, referenceNode.nextSibling)
  referenceNode && referenceNode.href && hrElement.parentNode.insertBefore(sendButton, hrElement.nextSibling)

  var error = document.createElement('div');
  error.innerHTML = "Please set up email in setting!"
  error.className = 'error-div'

  handleSendButton(sendButton, error, referenceNode)

}

function displayGenLibRusEc(type) {
  // option 1:
  // const arrATag = document.querySelectorAll(`[title="${type}"]`) || [];
  // // const arrATag = document.querySelectorAll('[title="Gen.lib.rus.ec"]') || [];
  // arrATag = document.querySelectorAll('tr > td:nth-of-type(10) > a')
  // console.log('arrATagarrATag', arrATag)
  // // const prevParentEl = arrATag.parentNode.previousSibling
  // // const prevParentEl = arrATag.length > 0 && arrATag.map(e => e.parentNode.previousSibling.value)
  // for (let el of arrATag) {
  //   let kindleEl = document.createElement('a');
  //   kindleEl.id = 'kindlelover'
  //   kindleEl.innerHTML = "Click here!"
  //   kindleEl.className = 'el-send-to-kindle';
  //   kindleEl.type = 'button'
  //   kindleEl.href = el.href
  //   kindleEl.target = '_blank'
  //   // el && el.href && el.parentNode.insertBefore(kindleEl, el.nextSibling)
  //   // console.log('elll', el.parentNode.previousSibling.previousElementSibling)
  //   let elVariable = el.parentNode.previousElementSibling.innerText
  //   if (elVariable === 'pdf' || elVariable === 'mobi' || elVariable === 'epub') {
  //     el && el.parentNode.insertBefore(kindleEl, el);
  //   }
  // }

  // option 2:
  var list = document.getElementsByTagName("tr")
  for (let el of list) {
    let kindleEl = document.createElement('a');
    kindleEl.id = 'kindlelover'
    kindleEl.innerHTML = "Click here!"
    kindleEl.className = 'button-send-kindle';
    kindleEl.type = 'button'
    let ch = el.children[3]  // get 3rd child element in tr
    const trHasA = el.children[9]
    kindleEl.href = trHasA && trHasA.children[0].href
    kindleEl.target = '_blank'

    // get file type
    let fileType = el.children[8] && el.children[8].innerText
    if (el.rowIndex > 0
      && (fileType === 'pdf'
        || fileType === 'mobi'
        || fileType === 'epub'
        || fileType === 'azw3'
        || fileType === 'prc')) {
      // ch && ch.parentNode.insertBefore(kindleEl, ch.nextSibling);
      ch && ch.insertBefore(kindleEl, ch.firstChild);
    }
  }

}

// https://www.jqueryscript.net/lightbox/Customizable-Animated-Modal-Dialog.html


function appendChildTve4U() {
  chrome.runtime.sendMessage({ greeting: "getCookies" }, function (response) {
    console.log('Greeting'); // connect to background
  });

  const refNode = document.querySelectorAll('.attachment .boxModelFixer')

  refNode && refNode.length > 0 && refNode.forEach(element => {
    if (element.querySelector('a') && element.querySelector('a').innerText === 'mobi'
      || element.querySelector('a') && element.querySelector('a').innerText === 'epub'
      || element.querySelector('a') && element.querySelector('a').innerText === 'azw3'
      || element.querySelector('a') && element.querySelector('a').innerText === 'prc'
      || element.querySelector('a') && element.querySelector('a').innerText === 'pdf'
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


function switchPage() {
  const host = window.location.host
  if (host === 'sachvui.com') return appendChildSachVui();
  if (host === '93.174.95.29') return appendChildGenLibRusEc();
  if (host === 'gen.lib.rus.ec' || 'libgen.is') {
    displayGenLibRusEc()
  };
  if (host === 'tve-4u.org') return appendChildTve4U();
}

switchPage()