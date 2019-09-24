import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConsultingComponent } from './components/consulting/consulting.component';
import { SoftwareComponent } from './components/software/software.component';
import { ModeComponent } from './mode/mode.component';
import { BannerComponent } from './components/banner/banner.component';
import { PanelModule, AutoCompleteModule, LayoutModule, MenuModule, TabsModule } from '@eamode/eang';
import { CtaComponent } from './cta/cta.component';
import { NewsComponent } from './components/news/news.component';

@NgModule({
  declarations: [
    AppComponent,
    ConsultingComponent,
    SoftwareComponent,
    ModeComponent,
    BannerComponent,
    CtaComponent,
    NewsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PanelModule,
    AutoCompleteModule,
    LayoutModule,
    MenuModule,
    TabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
