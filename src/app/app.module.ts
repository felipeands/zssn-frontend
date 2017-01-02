import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, PreloadAllModules } from '@angular/router';

import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';

// pages
import { HomeComponent } from './pages/home/home.component';
import { NewComponent } from './pages/new/new.component';
import { PeopleComponent } from './pages/people/people.component';

// components
import { MapComponent } from './components/map/map.component';
import { SearchComponent } from './components/search/search.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { MyInventoryComponent } from './components/my-inventory/my-inventory.component';

// providers
import { PeopleService } from './providers/people/people.service';
import { InventoryService } from './providers/inventory/inventory.service';
import { ReportService } from './providers/report/report.service';

// pipes
import { GenderPipe } from './pipes/gender/gender.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PeopleComponent,
    NewComponent,
    SearchComponent,
    MapComponent,
    MyInventoryComponent,
    InventoryComponent,
    GenderPipe
  ],
  exports: [
    MapComponent,
    SearchComponent,
    InventoryComponent,
    MyInventoryComponent
  ],
  imports: [
    HttpModule,
    FormsModule,
    BrowserModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],
  providers: [PeopleService, ReportService, InventoryService],
  bootstrap: [AppComponent],
})
export class AppModule { }
