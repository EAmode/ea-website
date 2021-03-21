import { range } from 'rxjs'
import { map, filter } from 'rxjs/operators'
// import * as zxcvbn from 'zxcvbn'
// declare module 'zxcvbn'
import { html, render } from 'lit-html'

function scorePassword(pass: string) {
  var score = 0
  if (!pass) return score

  // award every unique letter until 5 repetitions
  var letters = new Object()
  for (var i = 0; i < pass.length; i++) {
    letters[pass[i]] = (letters[pass[i]] || 0) + 1
    score += 5.0 / letters[pass[i]]
  }

  // bonus points for mixing it up
  var variations = {
    digits: /\d/.test(pass),
    lower: /[a-z]/.test(pass),
    upper: /[A-Z]/.test(pass),
    nonWords: /\W/.test(pass),
  }

  let variationCount = 0
  for (var check in variations) {
    variationCount += variations[check] == true ? 1 : 0
  }
  score += (variationCount - 1) * 10

  return score
}

// range(1, 200)
//   .pipe(
//     filter(x => x % 2 === 1),
//     map(x => x + x)
//   )
//   .subscribe(x => console.log(x));

const url = 'http://localhost:4001/ea/event'

const form = document.getElementById('create-tenant') as any

form.onsubmit = async (event: any) => {
  // For this example, don't actually submit the form
  event.preventDefault()
  const sayHi = (val, msg) => html`
    <meter max="4" id="password-strength-meter" value="${val}"></meter>
    <p id="password-strength-text">${msg}</p>`
  render(sayHi(2, 'Amy'), document.getElementById('password-meter'))
  // const fd = new FormData(form) as any
  // const body = JSON.stringify({
  //   events: [
  //     {
  //       id: '123',
  //       data: {
  //         name: fd.get('company'),
  //         email: fd.get('email'),
  //         password: fd.get('password'),
  //       },
  //     },
  //   ],
  // })
  // const createTenantResp = await fetch(url, {
  //   method: 'post',
  //   body,
  //   headers: { 'Content-Type': 'application/json' },
  // })
  // console.log(createTenantResp.json())
}
