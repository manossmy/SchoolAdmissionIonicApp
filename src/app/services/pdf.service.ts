import { Injectable } from '@angular/core';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';

@Injectable({
  providedIn: 'root'
})
export class PDFService {

  constructor(private pdfGenerator: PDFGenerator) { }

  async generatePDF() {
    try {
      const data = document.querySelector("app-preview-data").innerHTML;
      return await this.pdfGenerator.fromData(data, { documentSize: "A4", type: "base64" });
    } catch (e) {
      throw e;
    }
  }

}
