import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ea-mode'

  changeColorScheme() {
    const element = document.getElementsByTagName('app-root')
    element[0].classList.toggle('ea-color-scheme-dark')
  }
}
