
//https://github.com/CodeSeven/toastr
//https://www.jqueryscript.net/lightbox/Customizable-Animated-Modal-Dialog.html
//https://gomakethings.com/how-to-insert-an-element-after-another-one-in-the-dom-with-vanilla-javascript/
async function sendLinkToKindle(url, kindleMail, amzMail) {
  try {
    const sendResult = await fetch('http://localhost:5000/api/send-link', {
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
        // element.insertBefore(error, elementReadOnline);
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
      // sendLinkToKindle(els.href, kindleMail, amzMail)

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
  // var button = document.querySelectorAll(".col-md-8 .btn.btn-primary");
  // var button = document.querySelectorAll("a.btn.btn-primary")[0];
  var btnReadOnline = document.querySelectorAll("a.btn.btn-warning.btn-md")[0]; // doc online button
  // var button = $("a.btn.btn-warning.btn-md")[0];
  var sendButton = document.createElement('a');
  var error = document.createElement('div');

  sendButton.innerHTML = "Send to Kindle"
  sendButton.className = 'button-send-kindle';
  sendButton.type = 'button'
  sendButton.id = 'btn-send-kindle'

  var element = document.getElementsByClassName('col-md-8')[0]; //parent
  // var elementReadOnline = document.querySelectorAll('a.btn.btn-warning.btn-md')[0];
  error.innerHTML = "Please set up email in setting!"
  error.className = 'error-div'
  // element.insertBefore(sendButton, button);

  const els = document.querySelectorAll("a[href*='https://sachvui.com/download/mobi/']")[0]
    || document.querySelectorAll("a[href*='https://sachvui.com/download/epub/']")[0]
    || document.querySelectorAll("a[href*='https://sachvui.com/download/pdf/']")[0];

  // console.log('els', els.href)
  els && els.href && element.insertBefore(sendButton, btnReadOnline)

  handleSendButton(sendButton, error, els)
}

function appendChildGenLibRusEc() {
  const referenceNode = document.querySelectorAll("a[href$='.mobi']")[0]
    || document.querySelectorAll("a[href$='.epub']")[0]
    || document.querySelectorAll("a[href$='.pdf']")[0]
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


// https://freetuts.net/bom-location-dieu-huong-va-xu-ly-url-trong-javascript-386.html
function switchPage() {
  const host = window.location.host
  switch (host) {
    case 'sachvui.com':
      console.log('sachvui.com')
      appendChildSachVui()
      break;
    case 'library1.org':
      console.log('library1.org')
      appendChildGenLibRusEc()
      break;

    default:
      break;
  }
}

switchPage()