
//https://github.com/CodeSeven/toastr
//https://www.jqueryscript.net/lightbox/Customizable-Animated-Modal-Dialog.html
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

function appendChild() {
  // var button = document.querySelectorAll(".col-md-8 .btn.btn-primary");
  // var button = document.querySelectorAll("a.btn.btn-primary")[0];
  var button = document.querySelectorAll("a.btn.btn-warning.btn-md")[0];
  // var button = $("a.btn.btn-warning.btn-md")[0];
  var sendButton = document.createElement('a');
  var error = document.createElement('div');

  sendButton.innerHTML = "Send to Kindle"
  sendButton.className = 'button-send-kindle';
  sendButton.type = 'button'

  var element = document.getElementsByClassName('col-md-8')[0];
  var elementReadOnline = document.querySelectorAll('a.btn.btn-warning.btn-md')[0];
  error.innerHTML = "Please set up email in setting!"
  error.className = 'error-div'
  // element.insertBefore(sendButton, button);

  const els = document.querySelectorAll("a[href*='https://sachvui.com/download/mobi/']")[0]
    || document.querySelectorAll("a[href*='https://sachvui.com/download/epub/']")[0]
    || document.querySelectorAll("a[href*='https://sachvui.com/download/pdf/']")[0];

  // console.log('els', els.href)
  els && els.href && element.insertBefore(sendButton, button)

  sendButton.addEventListener("click", () => {
    chrome.storage.sync.get('mailAccount', function (result) {
      const checkValidObj = result && result.mailAccount && Object.values(result && result.mailAccount).some(x => x && x.length > 0)
      if (!checkValidObj) {
        element.insertBefore(error, elementReadOnline);
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



appendChild()

