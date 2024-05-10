import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmailComposer } from 'capacitor-email-composer';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailComposerService {

  share_email_id: string = environment.share_email_id

  constructor(private http: HttpClient, private iab: InAppBrowser) { }

  async sendEmail(studentDetails: any, attachments: any = []) {
    try {
      const pdf: any = await EmailComposer.open({
        to: [this.share_email_id],
        subject: (studentDetails.first_name || '') + ' ' + (studentDetails.last_name || ''),
        body: 'PFA',
        attachments
      });
      console.log(pdf, 'PDF const');
    } catch (err: any) {
      console.error(err, 'PDF ERROR');
    }
  }



}
