/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/quotes */
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { PDFService } from '../services/pdf.service';
import { Filesystem, Directory } from '@capacitor/filesystem';

import { GoogleDriveService } from '../services/google-drive.service';
import { OCRService } from '../services/ocr.service';

import * as moment from 'moment';
import { StudentDetailsService } from '../services/student-details.service';
import { EmailComposerService } from '../services/email-composer.service';
import { TextSpeechRecognitionService } from '../services/text-speech-recognition.service';

@Component({
  selector: 'app-admission-page',
  templateUrl: './admission-page.component.html',
  styleUrls: ['./admission-page.component.scss'],
  animations: [
    trigger('animation', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void => *', animate('0.8s ease-in'))
    ])
  ]
})
export class AdmissionPageComponent implements OnInit {

  @ViewChild("admissionStateStepper", { read: ElementRef }) admissionStateStepper: ElementRef;

  activeStep: any = {};
  alertMessage = 'Please accept the Tearms and Conditions';
  isDownloadButton = false;
  isModuleOpen = false;
  base64Content: string;
  student: any = {
    relationType: 'parents',
    isAgreeTAC: false,
    documents: {},
    signature: {},
    siblings: [{}],
    schoolHistories: [{}]
  };
  dateFieldList: any = ['dob'];
  steps: any = [
    {
      stepIndex: 0,
      name: 'Documents',
      type: 'DOCMT',
      icon: 'document-attach-outline',
      title: 'Documents'
    },
    {
      stepIndex: 1,
      name: 'Student\'s Personal Details',
      type: 'PERSONAL',
      icon: 'person-outline',
      title: 'Personal Details'
    },
    {
      stepIndex: 2,
      name: 'Student\'s Health Details',
      type: 'HEALTH',
      icon: 'medkit-outline',
      title: 'Medical Details'
    },
    {
      stepIndex: 3,
      name: 'Parent / Guardian Information',
      type: 'PARENT',
      icon: 'people-outline',
      title: 'Parent / Guardian '
    },
    {
      stepIndex: 4,
      name: 'Emergency Contact Details',
      type: 'CONTACT',
      icon: 'call-outline',
      title: 'Emergency Contact '
    },
    {
      stepIndex: 5,
      name: 'Sibling Details',
      type: 'SIBLING',
      icon: 'people-circle-outline',
      title: 'Sibling Details '
    },
    {
      stepIndex: 6,
      name: 'School History',
      type: 'SCHOOL',
      icon: 'school-outline',
      title: 'School History'
    },

    {
      stepIndex: 7,
      name: 'Terms and Conditions',
      type: 'TAC',
      icon: 'book-outline',
      title: 'Terms and Conditions'

    },
    {
      stepIndex: 8,
      name: 'Declaration',
      type: 'DECLARATION',
      icon: 'document-text-outline',
      title: 'Declaration'

    },
    {
      stepIndex: 9,
      name: 'Preview',
      type: 'PREVIEW',
      icon: 'receipt-outline',
      title: 'Preview'

    }
  ];

  constructor(private alertController: AlertController, private pdfService: PDFService, private ocrService: OCRService,
    private studentDetailsService: StudentDetailsService, private emailComposer: EmailComposerService, private googleDriveService: GoogleDriveService,
    public textSpeechRecognitionService: TextSpeechRecognitionService) {
    this.activeStep = this.steps[0];
  }

  ngOnInit() {
    this.googleDriveService.loginWithGoogle();
    this.studentDetailsService.init(this.student);
  }

  ionViewDidEnter() {
    this.admissionStateStepper.nativeElement.stepNext('success');
  }

  isValidForm() {
    try {
      var documents = this.student.documents;
      switch (this.activeStep.type) {
        case "DOCMT":
          if (documents.student_aadhar_frontView && !documents.student_aadhar_backView) {
            this.showErrorAlert('Student back view aadhar should be manditory');
            return false;
          } else if (documents.student_aadhar_backView && !documents.student_aadhar_frontView) {
            this.showErrorAlert('Student front view aadhar should be manditory');
            return false;
          } else if (documents.father_aadhar_frontView && !documents.father_aadhar_backView) {
            this.showErrorAlert('Father back view aadhar should be manditory');
            return false;
          } else if (documents.father_aadhar_backView && !documents.father_aadhar_frontView) {
            this.showErrorAlert('Father front view aadhar should be manditory');
            return false;
          } else if (documents.mother_aadhar_frontView && !documents.mother_aadhar_backView) {
            this.showErrorAlert('Mother back view aadhar should be manditory');
            return false;
          } else if (documents.mother_aadhar_backView && !documents.mother_aadhar_frontView) {
            this.showErrorAlert('Mother front view aadhar should be manditory');
            return false;
          } else if (documents.guardian_aadhar_frontView && !documents.guardian_aadhar_backView) {
            this.showErrorAlert('Guardian back view aadhar should be manditory');
            return false;
          } else if (documents.guardian_aadhar_backView && !documents.guardian_aadhar_frontView) {
            this.showErrorAlert('Guardian front view aadhar should be manditory');
            return false;
          }
          break;
        case "PERSONAL":

          break;
        case "HEALTH":

          break;
        case "PARENT":

          break;
        case "CONTACT":

          break;
        case "SIBLING":

          break;
        case "SCHOOL":

          break;
        case "TAC": {
          if (!this.student.isAgreeTAC) {
            this.acceptTACAlert();
            return false;
          }
          break;
        }
        case "DECLARATION":
          break;
        case "PREVIEW":
          break;
        default: break;
      }
    } catch (err: any) {
      return false;
    }
    return true;
  }

  async next() {
    console.log("Student Details", this.student);
    if (this.isValidForm()) {
      if (this.activeStep.stepIndex == 0) {
        await this.processDocument();
        this.admissionStateStepper.nativeElement.stepNext('success');
        this.activeStep = this.steps[this.activeStep.stepIndex + 1];
      } else if (this.activeStep.stepIndex == (this.steps.length - 1)) {
        await this.submit();
        await this.studentDetailsService.startRecording(10);
      } else {
        this.admissionStateStepper.nativeElement.stepNext('success');
        this.activeStep = this.steps[this.activeStep.stepIndex + 1];
      }
      await this.startVoiceFormFilling();
    } else {
      this.admissionStateStepper.nativeElement.stepNext('danger', true);
    }
  }

  async previous() {
    this.isDownloadButton = false;
    this.alertMessage = 'Please accept the Tearms and Conditions';
    if (this.activeStep.stepIndex != 0) {
      this.admissionStateStepper.nativeElement.stepBack();
      this.activeStep = this.steps[this.activeStep.stepIndex - 1];
      await this.startVoiceFormFilling();
    }
  }

  async processDocument() {
    this.studentDetailsService.showLoader();
    try {
      var documents = this.student.documents;

      if (documents.student_aadhar_frontView && documents.student_aadhar_backView) {
        var studentAadharDetails: any = await this.ocrService.scanAadhar({
          front: documents.student_aadhar_frontView.dataUrl.split("base64,")[1],
          back: documents.student_aadhar_backView.dataUrl.split("base64,")[1]
        });

        if (studentAadharDetails.name && !this.student.first_name) {
          this.student.first_name = studentAadharDetails.first_name;
          this.student.last_name = studentAadharDetails.last_name;
        }
        if (studentAadharDetails.dob && !this.student.dob) {
          this.student.dob = moment(studentAadharDetails.dob, 'DD/MM/YYYY').format("YYYY-MM-DD");
          this.student.age = this.studentDetailsService.calculateAge(this.student.dob);
        }
        if (studentAadharDetails.aadharNumber && !this.student.aadhar_number) {
          this.student.aadhar_number = studentAadharDetails.aadharNumber;
        }
        if (studentAadharDetails.gender && !this.student.gender) {
          this.student.gender = studentAadharDetails.gender == "MALE" ? "M" : "F";
        }
        if (studentAadharDetails.address && !this.student.address) {
          this.student.address = studentAadharDetails.address;
        }
      }

      if (this.student.relationType == 'parents') {
        if (documents.father_aadhar_frontView && documents.father_aadhar_backView) {
          var fatherAadharDetails: any = await this.ocrService.scanAadhar({
            front: documents.father_aadhar_frontView.dataUrl.split("base64,")[1],
            back: documents.father_aadhar_backView.dataUrl.split("base64,")[1]
          });
          if (fatherAadharDetails.name && !this.student.father_first_name) {
            this.student.father_first_name = fatherAadharDetails.first_name;
            this.student.father_last_name = fatherAadharDetails.last_name;
            this.student.father_address = fatherAadharDetails.address || '';
          }
        }

        if (documents.mother_aadhar_frontView && documents.mother_aadhar_backView) {
          var motherAadharDetails: any = await this.ocrService.scanAadhar({
            front: documents.mother_aadhar_frontView.dataUrl.split("base64,")[1],
            back: documents.mother_aadhar_backView.dataUrl.split("base64,")[1]
          });
          if (motherAadharDetails.name && !this.student.mother_first_name) {
            this.student.mother_first_name = motherAadharDetails.first_name;
            this.student.mother_last_name = motherAadharDetails.last_name;
            this.student.mother_address = motherAadharDetails.address || '';
          }
        }
      } else {
        if (documents.guardian_aadhar_frontView && documents.guardian_aadhar_backView) {
          var gaurdianAadharDetails: any = await this.ocrService.scanAadhar({
            front: documents.guardian_aadhar_frontView.dataUrl.split("base64,")[1],
            back: documents.guardian_aadhar_backView.dataUrl.split("base64,")[1]
          });
          if (gaurdianAadharDetails.name && !this.student.gaurdian_first_name) {
            this.student.gaurdian_first_name = gaurdianAadharDetails.first_name;
            this.student.gaurdian_last_name = gaurdianAadharDetails.last_name;
            this.student.gaurdian_address = gaurdianAadharDetails.address || '';
          }
        }
      }
    } catch (error: any) {
      console.log(error, 'ERROR');
    }

    this.studentDetailsService.hideLoader();
  }

  async submit() {
    this.studentDetailsService.showLoader();
    try {
      var student = JSON.parse(JSON.stringify(this.student));
      this.dateFieldList.forEach((dateField: any) => {
        if (student[dateField]) {
          student[dateField] = moment(student[dateField]).format('DD/MM/YYYY');
        }
        this.isDownloadButton = true;
      });

      if (student.schoolHistories.length > 0) {
        student.previous_school = student.schoolHistories[student.schoolHistories.length - 1].last_school_name || '';
      }

      var attachment = [];

      attachment.push({ type: 'base64', name: `Student-Admission-Form.pdf`, contentType: 'application/pdf', path: await this.pdfService.generatePDF() });
      this.base64Content = attachment[0].path;

      if (student.photo && student.photo.dataUrl) {
        attachment.push({ type: 'base64', name: `Student-Photo.jpeg`, contentType: 'image/jpeg', path: student.photo.dataUrl.split("base64,")[1] });
      }

      var documents = student.documents;

      if (documents.student_aadhar_frontView && documents.student_aadhar_backView) {
        attachment.push({ type: 'base64', name: `AadharCard-FrontView.jpeg`, contentType: 'image/jpeg', path: documents.student_aadhar_frontView.dataUrl.split("base64,")[1] });
        attachment.push({ type: 'base64', name: `AadharCard-BackView.jpeg`, contentType: 'image/jpeg', path: documents.student_aadhar_backView.dataUrl.split("base64,")[1] });
      }

      (documents.medicalReports || []).forEach((document: any, index: number) => {
        attachment.push({ type: 'base64', name: `Medical-Report-${index + 1}.jpeg`, contentType: 'image/jpeg', path: document.dataUrl.split("base64,")[1] });
      });

      (documents.passportOrBirthCertificate || []).forEach((document: any, index: number) => {
        attachment.push({ type: 'base64', name: `Passport-or-Birth-Certificate-${index + 1}.jpeg`, contentType: 'image/jpeg', path: document.dataUrl.split("base64,")[1] });
      });

      (documents.schoolRecord || []).forEach((document: any, index: number) => {
        attachment.push({ type: 'base64', name: `School-Record-${index + 1}.jpeg`, contentType: 'image/jpeg', path: document.dataUrl.split("base64,")[1] });
      });

      if (student.relationType == "parents") {
        if (documents.father_aadhar_frontView && documents.father_aadhar_backView) {
          attachment.push({ type: 'base64', name: `Father-AadharCard-FrontView.jpeg`, contentType: 'image/jpeg', path: documents.father_aadhar_frontView.dataUrl.split("base64,")[1] });
          attachment.push({ type: 'base64', name: `Father-AadharCard-BackView.jpeg`, contentType: 'image/jpeg', path: documents.father_aadhar_backView.dataUrl.split("base64,")[1] });
        }

        if (documents.mother_aadhar_frontView && documents.mother_aadhar_frontView) {
          attachment.push({ type: 'base64', name: `Mother-AadharCard-FrontView.jpeg`, contentType: 'image/jpeg', path: documents.mother_aadhar_frontView.dataUrl.split("base64,")[1] });
          attachment.push({ type: 'base64', name: `Mother-AadharCard-BackView.jpeg`, contentType: 'image/jpeg', path: documents.mother_aadhar_backView.dataUrl.split("base64,")[1] });
        }

        if (student.signature.father) {
          attachment.push({ type: 'base64', name: 'Father-Signature.png', contentType: 'image/jpeg', path: student.signature.father.split("base64,")[1] });
        }
        if (student.signature.mother) {
          attachment.push({ type: 'base64', name: 'Mother-Signature.png', contentType: 'image/jpeg', path: student.signature.mother.split("base64,")[1] });
        }
      } else {
        if (documents.guardian_aadhar_frontView && documents.guardian_aadhar_backView) {
          attachment.push({ type: 'base64', name: `Guardian-AadharCard-FrontView.jpeg`, contentType: 'image/jpeg', path: documents.guardian_aadhar_frontView.dataUrl.split("base64,")[1] });
          attachment.push({ type: 'base64', name: `Guardian-AadharCard-BackView.jpeg`, contentType: 'image/jpeg', path: documents.guardian_aadhar_backView.dataUrl.split("base64,")[1] });
        }
        if (student.signature.guardian) {
          attachment.push({ type: 'base64', name: 'Guardian-Signature.png', contentType: 'image/jpeg', path: student.signature.guardian.split("base64,")[1] });
        }
      }

      ["relationType", "isAgreeTAC", "photo", "signature", "siblings", "schoolHistories", "documents"].forEach((key: string) => delete student[key]);

      attachment.unshift({ type: 'base64', name: 'Student-Details.json', contentType: 'application/json', path: btoa(JSON.stringify(student, null, '\t')) });

      let fullName: any = student.first_name + student.last_name

      // await this.emailComposer.sendEmail(student, attachment);
      await this.googleDriveService.googleDriveUploadAndSharePdf(student, attachment, fullName);
      this.studentDetailsService.hideLoader();
      this.modalPopup();

    } catch (err: any) {
      this.acceptTACAlert(err);
    }
  }

  async acceptTACAlert(error?: any) {
    if (error) {
      this.alertMessage = error;
    }
    const alert = await this.alertController.create({
      subHeader: this.alertMessage,
      cssClass: 'custom-alert-style',
      mode: 'md',
      buttons: [
        {
          text: 'Ok',
          cssClass: 'alert-button-confirm'
        }
      ],
    });

    await alert.present();
  }
  saveAsPdf() {
    Filesystem.writeFile({
      path: 'Students/StudentDetailFile.pdf',
      data: this.base64Content,
      directory: Directory.Documents,
      recursive: true
    }).then((res) => {
      console.log(res, "file save succesfully");
    }).catch((err) => {
      this.acceptTACAlert(err.toString());
    });
  }


  async showErrorAlert(error?: any) {
    if (error) {
      this.alertMessage = error;
    }
    const alert = await this.alertController.create({
      subHeader: this.alertMessage,
      cssClass: 'custom-alert-style',
      mode: 'md',
      buttons: [
        {
          text: 'Ok',
          cssClass: 'alert-button-confirm'
        }
      ],
    });

    await alert.present();
  }

  modalPopup() {
    this.isModuleOpen = true;
  }


  backToHome() {
    location.href = '/home';
  }

  async sendStudentDetails() {
    this.textSpeechRecognitionService.isVoiceEnabled = true;
    await this.textSpeechRecognitionService.enableVoice();
    await this.startVoiceFormFilling();
  }

  async voiceStopBtn() {
    this.textSpeechRecognitionService.isVoiceEnabled = false;
    this.textSpeechRecognitionService.disableVoice();
  }

  async startVoiceFormFilling() {
    if (this.textSpeechRecognitionService.isVoiceEnabled) {
      if (this.activeStep.stepIndex == 3) {
        var speechDetails = this.studentDetailsService.speechArray[this.activeStep.stepIndex];
        if (this.student.relationType == "parents") {
          speechDetails.fields = [].concat(speechDetails.father, speechDetails.mother);
        } else {
          speechDetails.fields = [].concat(speechDetails.guardian);
        }
      }
      await this.studentDetailsService.startRecording(this.activeStep.stepIndex);
    }
  }

}
