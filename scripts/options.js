'use strict';
let saveButton = document.getElementById('btn-save');
let mailKindleErr = document.getElementById('mail-kindle-err');
let mailAmzErr = document.getElementById('mail-amz-err');
let kindleMail = document.getElementById("kindle-mail")
let amzMail = document.getElementById("amz-mail")
let alertSuccess = document.getElementById("alert-success")

function getMailAccount() {
  chrome.storage.sync.get('mailAccount', function (result) {
    kindleMail.value = result.mailAccount && result.mailAccount.kindleMail || ''
    amzMail.value = result.mailAccount && result.mailAccount.amzMail || ''
  });
}

function validMail(kindleMail, amzMail) {
  const data = {
    kindleMail: kindleMail,
    amzMail: amzMail,
  }
  const schema = Joi.object().keys({
    kindleMail: Joi.string().email().required().regex(/@kindle.com$/),
    amzMail: Joi.string().email().required(),
  });

  const valid = Joi.validate(data, schema, { abortEarly: false })
  if (valid && valid.error && valid.error.details) {
    const errors = valid && valid.error && valid.error.details &&
      valid.error.details.map(e => ({ ...e, name: e.path[0] }))
    return errors;
  }
  return [];
}
function constructOptions() {
  let button = document.createElement('button');
  button.style.backgroundColor = '#3aa757';
  saveButton.addEventListener('click', () => {
    mailKindleErr.innerHTML = ''
    mailAmzErr.innerHTML = ''
    if (validMail(kindleMail.value, amzMail.value).length > 0) {
      const errors = validMail(kindleMail.value, amzMail.value)
      const messKindleErr = errors.find(e => e.name === 'kindleMail')
      const messAmzErr = errors.find(e => e.name === 'amzMail')
      mailKindleErr.innerHTML = messKindleErr && messKindleErr.message && messKindleErr.message.replace(/.kindleMail"/g, 'Kindle mail') || ''
      mailAmzErr.innerHTML = messAmzErr && messAmzErr.message && messAmzErr.message.replace(/.amzMail"/g, 'Amazon mail') || ''
      return
    }

    chrome.storage.sync.set({
      mailAccount: {
        kindleMail: kindleMail.value,
        amzMail: amzMail.value
      }
    }, function () {
      toastr.options.closeDuration = 300;
      toastr.success('Save successfully!')
      console.log('save successfully')
      // alertSuccess.classList.remove("hide-div")
    })
  });


}
getMailAccount()
constructOptions();
