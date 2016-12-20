import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, PreloadAllModules } from '@angular/router';

import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';

// pages
import { HomeComponent } from './pages/home/home.component';
import { PeopleComponent } from './pages/people/people.component';
import { NewComponent } from './pages/new/new.component';

// components
import { SearchComponent } from './components/search/search.component';
import { MapComponent } from './components/map/map.component';

// providers
import { PeopleService } from './providers/people/people.service';
import { ReportService } from './providers/report/report.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PeopleComponent,
    NewComponent,
    SearchComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],
  providers: [PeopleService, ReportService],
  bootstrap: [AppComponent]
})
export class AppModule { }
