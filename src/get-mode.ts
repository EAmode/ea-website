import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@eamode/eang'

import './site-footer.js'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { Form } from '@eamode/eang'
import { checkMark, error } from './svg.js'

import * as ProgressBar from 'progressbar.js'

// const url = 'https://ea.eamode.cloud'
const url = 'http://localhost:3000'

@customElement('signup-form')
export class SignupForm extends LitElement {
  @property({ type: Number }) pwScore = 0

  @property({ type: Boolean }) creatingEnvironment = false

  @property({ type: Boolean }) ready = false

  duration = 25000

  strength: { [key: number]: string } = {
    1: 'worst ☹',
    2: 'bad ☹',
    3: 'weak ☹',
    4: 'good ☺',
    5: 'strong ☻'
  }

  data: any

  @property({ type: Object }) errors: any

  validations = {
    company: (elem: any) => {
      if (!elem.value) {
        return 'Short Name required!'
      }
      if (this.available === false) {
        return 'Choose a different short name!'
      }
    },
    email: (elem: any) => {
      if (!elem.value) {
        return 'Enter your email address!'
      }
      if (elem.validity.typeMismatch) {
        return 'Valid email address required!'
      }
    },
    password: (elem: any) => {
      if (!elem.value) {
        return 'Password required!'
      }
    },
    password2: (elem: any) => {
      if (!elem.value) {
        return 'Confirm your password!'
      }
      if (this.data.password != this.data.password2) {
        return 'Passwords are not the same!'
      }
    }
  }

  @property({ type: Boolean }) available = true

  companyInputSubject = new Subject()

  @property({ type: String }) companyVal = ''

  sub = this.companyInputSubject.pipe(debounceTime(750)).subscribe(async (e: any) => {
    this.companyVal = e.target.value
    const tenant = e.target.value
    const reservedTenantNames = [
      'ea',
      'mode',
      'eamode',
      'eamodecloud',
      'eamode.cloud',
      'eamodecloud.com'
    ]
    if (!tenant || reservedTenantNames.includes(tenant)) {
      this.available = false
      return
    }
    try {
      const resp = await fetch(`${url}/rest/${tenant}/mode/v1`)
      if (resp.status === 404) {
        this.available = true
        e.target.classList.remove('invalid')
      } else if (resp.status === 200) {
        this.available = false
        e.target.classList.add('invalid')
      } else {
        this.available = false
        e.target.classList.remove('invalid')
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
                      @input=${(e: any) => this.companyInputSubject.next(e)}
                    />
                    <p>.eamode.cloud</p>
                    ${this.available === true && this.companyVal.length > 0
                      ? html`<div class="available">${checkMark} still available!</div>`
                      : undefined}
                    ${this.available === false && this.companyVal.length > 0
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
                  This is your login username. We will send you a confirmation email.
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
    const { data, validity } = Form.parseElements(
      event.target.elements,
      this.data,
      this.validations,
      this.errors
    )
    this.data = data
    this.errors = validity.errors

    if (validity.valid && this.available === true) {
      const body = JSON.stringify(
        {
          instanceOf: 'Event__Mode_Tenant_Create_Request',
          attributes: {
            name: this.data.company,
            user: this.data.email,
            password: this.data.password
          }
        })
      await fetch(`${url}/rest/ea/mode/v1/event`, {
        method: 'post',
        body,
        headers: { 'Content-Type': 'application/json' }
      })
      this.creatingEnvironment = true
      setTimeout(() => {
        const circle = new ProgressBar.Circle('#progress', {
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

  onPw2(e: any) {
    const result = Form.parseElement(e.target, this.data, this.validations.password2, this.errors)
    this.data = result.data
    this.errors = result.errors
  }

  onPw(e: any) {
    const result = Form.parseElement(e.target, this.data, this.validations.password, this.errors)
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

function scorePassword(pass: string) {
  let score = 0
  if (!pass) return score

  // award every unique letter until 5 repetitions
  const letters = {} as any
  for (let i = 0; i < pass.length; i++) {
    letters[pass[i]] = (letters[pass[i]] || 0) + 1
    score += 5.0 / letters[pass[i]]
  }

  // bonus points for mixing it up
  const variations = {
    digits: /\d/.test(pass),
    lower: /[a-z]/.test(pass),
    upper: /[A-Z]/.test(pass),
    nonWords: /\W/.test(pass)
  }

  let variationCount = 0
  for (const check in variations) {
    variationCount += variations[check as keyof typeof variations] ? 1 : 0
  }
  score += (variationCount - 1) * 10

  return score
}
