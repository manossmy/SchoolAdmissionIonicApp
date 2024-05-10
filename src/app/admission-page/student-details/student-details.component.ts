import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PhotoService } from 'src/app/services/photo.service';
import { StudentDetailsService } from 'src/app/services/student-details.service';

import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { TextSpeechRecognitionService } from 'src/app/services/text-speech-recognition.service';


@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss'],
})
export class StudentDetailsComponent implements OnInit {

  @Input() student: any = {};
  speechArray: any;

  constructor(private photoService: PhotoService, public studentDetailsService: StudentDetailsService,
    private textSpeechRecog: TextSpeechRecognitionService) {
    SpeechRecognition.requestPermission();
  }

  ngOnInit() {  }

  async takePhoto() {
    this.student.photo = await this.photoService.takePhoto();
  }

  calculateStudentAge() {
    this.student.age = this.studentDetailsService.calculateAge(this.student.dob);
  }

}
