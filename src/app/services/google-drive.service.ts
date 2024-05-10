import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import '@codetrix-studio/capacitor-google-auth';
import { Plugins } from '@capacitor/core';

import * as moment from 'moment';
import { StorageService } from './storage.service';
import { StudentDetailsService } from './student-details.service';



@Injectable({
    providedIn: 'root'
})
export class GoogleDriveService {

    boundary = 'foo_bar_baz';
    access_token: string = null;
    share_email_id = environment.share_email_id;
    parent_folder_name = environment.parent_folder_name;

    constructor(private http: HttpClient, private storageService: StorageService, private toasterService: StudentDetailsService) { }

    async loginWithGoogle() {
        try {
            var storageAccessToken = await this.storageService.storage.get("storage_access_token");
            if (storageAccessToken) {
                this.access_token = storageAccessToken;
            } else {
                const googleUser = await Plugins.GoogleAuth.signIn();
                this.access_token = googleUser.authentication.accessToken;
                await this.storageService.storage.set('storage_access_token', this.access_token);
            }
        } catch (err) {
            throw this.toasterService.toster.error('Something Went Wrong');
        }
    }

    async googleDriveUploadAndSharePdf(studentDetails: any, attachments: any, fullName: any, isRetry: boolean = false): Promise<any> {
        try {
            const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.access_token).set('Content-Type', `multipart/related; this.boundary=${this.boundary}`);
            var parent_folder_id = await this.findFolderId(this.parent_folder_name);

            const createFolderRequestBody = {
                name: `${studentDetails.first_name} ${studentDetails.last_name} [${moment().format("DD-MMM-YYYY HH:MM:ss")}]`,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [parent_folder_id],
            };

            const folderResponse = await this.http.post('https://www.googleapis.com/drive/v3/files?fields=id', createFolderRequestBody, { headers }).toPromise();
            console.log(folderResponse, 'FOLDER RESPONSE');
            const new_folder_id = folderResponse['id'];

            await Promise.all(attachments.map(async (attachment: any) => {
                const body = `--${this.boundary}\r\n` + `Content-Type: application/json; charset=UTF-8\r\n\r\n` + JSON.stringify({ name: attachment.name, parents: [new_folder_id] }) + '\r\n' + `--${this.boundary}\r\n` + `Content-Type: ${attachment.contentType}\r\n` + `Content-Transfer-Encoding: base64\r\n\r\n` + attachment.path + '\r\n' + `--${this.boundary}--\r\n`;
                return this.http.post('https://www.googleapis.com/upload/drive/v3/files' + '?uploadType=multipart', body, { headers: headers }).toPromise();
            }));
            await this.shareFolder(new_folder_id, this.access_token);

        } catch(error: any) {
            if (!isRetry && error.code === 401) {
                await this.storageService.storage.remove("storage_access_token");
                await this.loginWithGoogle();
                await this.googleDriveUploadAndSharePdf(studentDetails, studentDetails, fullName, true);
            } else {
                throw this.toasterService.toster.error('Something Went Wrong');
            }
        }

    }

    async shareFolder(new_folder_id: any, access_token: any) {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + access_token).set('Content-Type', 'application/json');
        const permission = {
            'type': 'user',
            'role': 'writer',
            'emailAddress': this.share_email_id
        };
        return this.http.post(`https://www.googleapis.com/drive/v3/files/${new_folder_id}/permissions`, permission, { headers: headers }).toPromise();
    }

    async findFolderId(folderName: string) {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.access_token);
        const query = `'root' in parents and mimeType='application/vnd.google-apps.folder' and name='${folderName}'`;
        const endpoint = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=*`;
        const response = await this.http.get(endpoint, { headers }).toPromise();
        var parent_folder_id = (response['files'][0] || {}).id;
        if (!parent_folder_id) {
            const createNewFolder = {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder'
            };
            const newFolderResponse = await this.http.post('https://www.googleapis.com/drive/v3/files?fields=id', createNewFolder, { headers }).toPromise();
            console.log(newFolderResponse, 'New folder response');
            parent_folder_id = newFolderResponse['id'];
        }
        return parent_folder_id;
    }

}
