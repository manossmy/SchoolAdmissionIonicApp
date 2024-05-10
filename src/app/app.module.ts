import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SignaturePadModule } from 'angular2-signaturepad';

import { IonicModule, IonicRouteStrategy, AlertController } from '@ionic/angular';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AdmissionPageComponent } from './admission-page/admission-page.component';
import { EmergencyDetailsComponent } from './admission-page/emergency-details/emergency-details.component';
import { ParentDetailsComponent } from './admission-page/parent-details/parent-details.component';
import { SchoolHistoryDetailsComponent } from './admission-page/school-history-details/school-history-details.component';
import { SiblingDetailsComponent } from './admission-page/sibling-details/sibling-details.component';
import { StudentDetailsComponent } from './admission-page/student-details/student-details.component';
import { TermsandconditionsComponent } from './admission-page/termsandconditions/termsandconditions.component';
import { DeclarationComponent } from './admission-page/declaration/declaration.component';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { StudentHealthDetailsComponent } from './admission-page/student-health-details/student-health-details.component';
import { DocumentsInfoComponent } from './admission-page/documents-info/documents-info.component';
import { PreviewDataComponent } from './admission-page/preview-data/preview-data.component';

import { DocumentScanner } from '@ionic-native/document-scanner/ngx';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';

import { OCR } from '@awesome-cordova-plugins/ocr/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ModalSelectManuallyComponent } from './admission-page/modal-select-manually/modal-select-manually.component';

defineCustomElements(window);

@NgModule({
  declarations: [
    AppComponent,
    AdmissionPageComponent,
    StudentHealthDetailsComponent,
    StudentDetailsComponent,
    ParentDetailsComponent,
    EmergencyDetailsComponent,
    SiblingDetailsComponent,
    SchoolHistoryDetailsComponent,
    TermsandconditionsComponent,
    DeclarationComponent,
    DocumentsInfoComponent,
    PreviewDataComponent,
    ModalSelectManuallyComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    SignaturePadModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    InAppBrowser, AlertController, PDFGenerator, DocumentScanner, OCR, DocumentsInfoComponent],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
