import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  year = new Date().getFullYear()

  changeColorScheme() {
    const element = document.getElementsByTagName('app-root')
    element[0].classList.toggle('ea-color-scheme-dark')
  }
}
