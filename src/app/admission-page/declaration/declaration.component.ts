/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable quote-props */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad';

@Component({
  selector: 'app-declaration',
  templateUrl: './declaration.component.html',
  styleUrls: ['./declaration.component.scss'],
})
export class DeclarationComponent implements OnInit {
  @Input() signature: any;
  @Input() student: any;

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @ViewChild('father') father: SignaturePad;
  @ViewChild('mother') mother: SignaturePad;
  @ViewChild('mother') guardian: SignaturePad;

  public signaturePadOptions: any = {
    'minWidth': 1,
    'canvasWidth': window.innerWidth - 90,
    'canvasHeight': 180
  };

  date: any = new Date().toLocaleDateString();

  constructor() { }

  ngOnInit() {
    // this.father.toDataURL(this.signature.father);
  }

  ionViewWillEnter() {
  }



  drawClear(type: string) {
    switch (type) {
      case 'father': this.father.clear();
        break;
      case 'mother': this.mother.clear();
        break;
      case 'guardian': this.guardian.clear();
        break;
    };
    delete this.signature[type];
  }

  drawStart(event: any) {
    console.log('Start drawing', event);
  }

  drawComplete(type: any, ref: any) {
    this.signature[type] = ref.toDataURL('image/png');
  }
}
