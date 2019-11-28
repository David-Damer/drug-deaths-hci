import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';

import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MainAppComponent } from './main-app/main-app.component';
import { DataService} from './data.service';
import { PopUpService} from './pop-up.service';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonToggleModule, MatCardModule, MatTableModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    MainAppComponent
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonToggleModule,
    MatTableModule,
  ],
  providers: [
    DataService,
    PopUpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
