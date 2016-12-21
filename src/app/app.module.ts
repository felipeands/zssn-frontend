import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, PreloadAllModules } from '@angular/router';

import { LocalStorageModule } from 'angular-2-local-storage';
import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';

// pages
import { HomeComponent } from './pages/home/home.component';
import { PeopleComponent } from './pages/people/people.component';
import { NewComponent } from './pages/new/new.component';

// components
import { SearchComponent } from './components/search/search.component';
import { MapComponent } from './components/map/map.component';
import { MyInventoryComponent } from './components/my-inventory/my-inventory.component';
import { InventoryComponent } from './components/inventory/inventory.component';

// providers
import { PeopleService } from './providers/people/people.service';
import { InventoryService } from './providers/inventory/inventory.service';
import { ReportService } from './providers/report/report.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PeopleComponent,
    NewComponent,
    SearchComponent,
    MapComponent,
    MyInventoryComponent,
    InventoryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    LocalStorageModule.withConfig({
      prefix: 'zssn',
      storageType: 'localStorage'
    })
  ],
  providers: [PeopleService, ReportService, InventoryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
