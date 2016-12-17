import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, PreloadAllModules } from '@angular/router';

import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';

// pages
import { HomeComponent } from './pages/home/home.component';
import { SurvivorComponent } from './pages/survivor/survivor.component';
import { NewComponent } from './pages/new/new.component';

// components
import { SearchComponent } from './components/search/search.component';

// providers
import { SurvivorService } from './providers/survivor/survivor.service';
import { ReportService } from './providers/report/report.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SurvivorComponent,
    NewComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],
  providers: [SurvivorService, ReportService],
  bootstrap: [AppComponent]
})
export class AppModule { }
