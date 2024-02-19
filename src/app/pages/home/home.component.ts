import { MatIconModule } from '@angular/material/icon';
import { XmlService } from './../../services/xml.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FileData } from '../../interfaces/file-data';
import { SaveResponse } from '../../interfaces/save-response';
import { HeaderComponent } from '../../template/header/header.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  xmlList: FileData[] = [];
  selectedFiles: File[] = [];

  constructor(private xmlService: XmlService) {}

  ngOnInit(): void {
    this.getSavedXmls();
  }

  getSavedXmls() {
    this.xmlService.getXmlList().subscribe({
      next: (response: FileData[]) => {
        this.xmlList = response;
      },
      error: (error) => {
        console.error('Erro ao obter xmlList', error);
      },
    });
  }

  onFileSelected(event: any) {
    Array.from(event.target.files).forEach((element) => {
      this.selectedFiles.push(element as File);
    });
  }

  saveDocuments() {
    if (this.selectedFiles.length > 0) {
      this.xmlService.saveXmlFiles(this.selectedFiles).subscribe({
        next: (response: SaveResponse) => {
          console.log(response);
          this.selectedFiles = [];
          this.getSavedXmls();
        },
        error: (error) => {
          console.error('Error saving documents:', error);
        },
      });
    }
  }

  removeFile(file: File) {
    this.selectedFiles = this.selectedFiles.filter(
      (selectedFile) => selectedFile !== file
    );
  }

  extractFilenameFromHeaders(headers: HttpHeaders): string | null {
    const contentDisposition = headers.get('Content-Disposition');
    if (contentDisposition) {
      const regex = /filename="([^"]+)"/;
      const matches = regex.exec(contentDisposition);
      return matches && matches.length > 1 ? matches[1] : null;
    }
    return null;
  }

  downloadFileFromUrl(url: string, filename: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
  }

  downloadFile(id: number) {
    this.xmlService.downloadXmlFile(id).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const blob = response.body;
        const headers = response.headers;

        if (blob && headers) {
          const filename = this.extractFilenameFromHeaders(headers);
          const downloadFilename = filename ? filename : 'NAME INVALID';
          const url = window.URL.createObjectURL(blob);
          this.downloadFileFromUrl(url, downloadFilename);
        }
      },
      error: (error) => {
        console.error('Error downloading document:', error);
      },
    });
  }
}
