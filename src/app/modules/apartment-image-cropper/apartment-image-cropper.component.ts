import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Cropper from 'cropperjs';
import { ImageDataDto } from '../profile-edit/model/image-data';

@Component({
  selector: 'app-apartment-image-cropper',
  templateUrl: './apartment-image-cropper.component.html',
  styleUrls: ['./apartment-image-cropper.component.scss']
})
export class ApartmentImageCropperComponent implements OnInit, AfterViewInit {

  cropper!: Cropper;
  sanitizedUrl!: SafeUrl;

  constructor(
    public dialogRef: MatDialogRef<ApartmentImageCropperComponent>,
    @Inject(MAT_DIALOG_DATA) public imageData: ImageDataDto,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.imageData.image);
  }

  ngAfterViewInit() {
    this.initCropper();
  }

  initCropper() {
    const image = document.getElementById('image') as HTMLImageElement;
    this.cropper = new Cropper(image, {
      aspectRatio: 4 / 3,
      viewMode: 1,
      guides: false,
    });
  }

  crop() {
    const croppedCanvas = this.cropper.getCroppedCanvas();
    const roundedImageDataURL = croppedCanvas.toDataURL();
    const file = this.dataURLtoFile(roundedImageDataURL, this.imageData.fileName);
    this.dialogRef.close(file);
  }

  dataURLtoFile(dataurl: string, filename: string): File {
    let arr = dataurl.split(',');
    // Dodajemy weryfikację, aby upewnić się, że match nie zwraca null
    let match = arr[0].match(/:(.*?);/);
    if (!match) {
        throw new Error('Invalid format');
    }
    let mime = match[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
  }

  // resets the cropper
  reset(){
    this.cropper.clear();
    this.cropper.crop();
  }


}
