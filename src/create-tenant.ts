declare const ProgressBar

import { LitElement, html, property, customElement } from 'lit-element'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { checkMark, error } from './svg'

const url = 'https://mode.eamode.cloud/'
// const url = 'http://localhost:4001/'

@customElement('signup-form')
export class SignupForm extends LitElement {
  @property({ type: Number }) pwScore = 0

  @property({ type: Boolean }) creatingEnvironment = false

  @property({ type: Boolean }) ready = false

  duration = 25000

  strength = {
    1: 'worst ☹',
    2: 'bad ☹',
    3: 'weak ☹',
    4: 'good ☺',
    5: 'strong ☻'
  }

  data

  @property({ type: Object }) errors

  validations = {
    company: (elem, data) => {
      if (!elem.value) {
        return 'Short Name required!'
      }
    },
    email: (elem, data) => {
      if (!elem.value) {
        return 'Enter your email address!'
      }
      if (elem.validity.typeMismatch) {
        return 'Valid email address required!'
      }
    },
    password: (elem, data) => {
      if (!elem.value) {
        return 'Password required!'
      }
    },
    password2: (elem, data) => {
      if (!elem.value) {
        return 'Confirm your password!'
      }
      if (data.password != data.password2) {
        return 'Passwords are not the same!'
      }
    }
  }

  @property({ type: Boolean }) available: boolean

  companyInputSubject = new Subject()
  sub = this.companyInputSubject.pipe(debounceTime(750)).subscribe(async (e: any) => {
    const tenant = e.target.value
    if(!tenant){
      this.available = undefined
      return
    }
    try {
      const resp = await fetch(url + tenant)
      if (resp.status === 404) {
        this.available = true
      } else if (resp.status === 200) {
        this.available = false
      } else {
        this.available = undefined
      }
    } catch (err) {
      console.log(err)
    }
  })

  disconnectedCallback() {
    if (this.sub) {
      this.sub.unsubscribe()
    }
  }

  render() {
    return html` ${this.creatingEnvironment
      ? html`<section class="creatingEnvironment">
          <div class="container">
            <div class="ea-card">
              <div class="ea-card-header">
                <p class="title">Creating your Environment</p>
              </div>
              <div class="ea-card-content">
                <div id="progress"></div>
                <p>${this.data.company}.eamode.cloud</p>
              </div>
              ${this.ready
                ? html` <div class="ea-card-footer">
                    <button class="ea-button" primary lg @click=${this.login}>
                      Login to your Mode
                    </button>
                  </div>`
                : undefined}
            </div>
          </div>
        </section>`
      : html` <section class="signup">
          <form id="create-tenant" @submit=${this.onSubmit} novalidate>
            <div class="container">
              <h2>Try Mode for Free</h2>
              <p>No credit card required. Cancel anytime.</p>

              <div class="row company">
                <div class="col-md-8">
                  <hr />
                  <label for="company" class="form-label">Organization Short Name</label>
                  <div class="company-input">
                    <input
                      name="company"
                      type="text"
                      class="form-control"
                      id="company"
                      placeholder="company"
                      aria-describedby="shortname-constraints"
                      required
                      @input=${e => this.companyInputSubject.next(e)}
                    />
                    <p>.eamode.cloud</p>
                    ${this.available === true
                      ? html`<div class="available">${checkMark} still available!</div>`
                      : undefined}
                    ${this.available === false
                      ? html`<div class="taken">${error} name already taken!</div>`
                      : undefined}
                  </div>
                  ${this.errors?.company
                    ? html`<div class="error" aria-live="polite">${this.errors?.company}</div>`
                    : undefined}
                  <div id="shortname-constraints" class="form-text">
                    One word, no spaces, no special characters! Becomes part of your individual URL.
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-4">
                  <label for="email" class="form-label">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autocomplete="username"
                    class="form-control"
                    placeholder="you@example.com"
                    aria-describedby="email-constraints"
                    required
                  />
                </div>
                ${this.errors?.email
                  ? html` <div class="error" aria-live="polite">${this.errors?.email}</div>`
                  : undefined}
                <div id="email-constraints" class="form-text">
                  This is your login username. We will never share it with anybody.
                </div>
              </div>

              <div class="row gy-3">
                <div class="col-md-4">
                  <label for="password" class="form-label">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autocomplete="new-password"
                    class="form-control"
                    @input=${this.onPw}
                    required
                  />
                  ${this.errors?.password
                    ? html`<div class="error" aria-live="polite">${this.errors?.password}</div>`
                    : undefined}
                  <div id="password-meter">
                    ${this.pwScore > 0
                      ? html`<meter
                            max="5"
                            id="password-strength-meter"
                            value="${this.pwScore}"
                          ></meter>
                          <p id="password-strength-text">${this.strength[this.pwScore]}</p>`
                      : ''}
                  </div>
                </div>
                <div class="col-md-4">
                  <label for="password" class="form-label">Confirm Password</label>
                  <input
                    id="password2"
                    name="password2"
                    type="password"
                    autocomplete="new-password"
                    class="form-control"
                    @change=${this.onPw2}
                  />
                  ${this.errors?.password2
                    ? html`<div class="error">${this.errors?.password2}</div>`
                    : ''}
                </div>
              </div>
              <div class="row">
                <div class="col-md-8">
                  <hr />
                </div>
              </div>

              <button class="ea-button" primary lg type="submit">Create your Mode</button>
            </div>
          </form>
        </section>`}`
  }

  createRenderRoot() {
    return this
  }

  login() {
    window.location.href = `https://${this.data.company}.eamode.cloud`
  }

  async onSubmit(event: any) {
    event.preventDefault()
    const { data, validity } = parseElements(
      event.target.elements,
      this.data,
      this.validations,
      this.errors
    )
    this.data = data
    this.errors = validity.errors

    if (validity.valid) {
      const body = JSON.stringify({
        events: [
          {
            id: '123',
            data: {
              name: this.data.company,
              email: this.data.email,
              password: this.data.password
            }
          }
        ]
      })
      const createTenantResp = await fetch(url + 'ea/event', {
        method: 'post',
        body,
        headers: { 'Content-Type': 'application/json' }
      })
      this.creatingEnvironment = true
      setTimeout(() => {
        var circle = new ProgressBar.Circle('#progress', {
          strokeWidth: 8,
          easing: 'linear',
          duration: this.duration,
          color: '#425b9a',
          trailColor: '#eee',
          trailWidth: 7
        })
        circle.animate(1)
      }, 50)
      setTimeout(() => {
        this.ready = true
      }, this.duration)
    }
  }

  async onCompany(e: any) {
    console.log(e.target.value)
    try {
      const resp = await fetch(url + e.target.value)
      console.log(resp)
    } catch (err) {
      console.log(err)
    }
  }

  onPw2(e: any) {
    const result = parseElement(e.target, this.data, this.validations.password2, this.errors)
    this.data = result.data
    this.errors = result.errors
  }

  onPw(e: any) {
    const result = parseElement(e.target, this.data, this.validations.password, this.errors)
    this.data = result.data
    this.errors = result.errors

    const score = scorePassword(this.data.password)
    if (score < 20) {
      this.pwScore = 1
    } else if (score < 30) {
      this.pwScore = 2
    } else if (score < 60) {
      this.pwScore = 3
    } else if (score < 75) {
      this.pwScore = 4
    } else {
      this.pwScore = 5
    }
  }
}

function parseElement(elem, data = {}, validation = undefined, errors = {}) {
  if (elem.name === undefined) {
    throw 'Element needs a name!'
  }

  data[elem.name] = elem.value

  if (validation) {
    errors[elem.name] = validation(elem, data)
  }

  return {
    data,
    errors: Object.assign({}, errors)
  }
}

function parseElements(elems, data = {}, validations = undefined, errors = {}) {
  for (const elem of elems) {
    if (elem.name) {
      data[elem.name] = elem.value
    }
  }
  let valid = true
  if (validations) {
    for (const [key, validation] of Object.entries(validations) as [string, any]) {
      const elem = elems[key]
      if (elem) {
        const errMsg = validation(elem, data)
        errors[elem.name] = errMsg
        if (errMsg) {
          elem.classList.add('invalid')
          valid = false
        } else {
          elem.classList.remove('invalid')
        }
      }
    }
  }

  return {
    data: Object.assign({}, data),
    validity: {
      valid,
      errors: Object.assign({}, errors)
    }
  }
}

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
    nonWords: /\W/.test(pass)
  }

  let variationCount = 0
  for (var check in variations) {
    variationCount += variations[check] == true ? 1 : 0
  }
  score += (variationCount - 1) * 10

  return score
}
