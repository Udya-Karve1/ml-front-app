import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import { AppComponent } from './app.component';
import { MainComponent } from './header/main.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { AppConstants } from './app.constants';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MlMatComponent } from './ml-mat/ml-mat.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    MlMatComponent    
  ],
  imports: [
    CollapseModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgScrollbarModule,
    BsDropdownModule,
    ModalModule,
    MatGridListModule,
    MatSidenavModule,
    BrowserAnimationsModule
  ],
  providers: [ BsModalService, AppConstants ],
  bootstrap: [AppComponent]
})
export class AppModule { }
