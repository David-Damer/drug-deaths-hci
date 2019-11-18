import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';

import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { ShapeService} from './shape.service';
import { PopUpService} from './pop-up.service';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    BarChartComponent,
    LineChartComponent
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
  ],
  providers: [
    ShapeService,
    PopUpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
