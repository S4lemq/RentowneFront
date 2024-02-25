import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Cropper from 'cropperjs';
import { ImageDataDto } from '../model/image-data';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit, AfterViewInit {

  cropper!: Cropper;
  sanitizedUrl!: SafeUrl;

  constructor(
    public dialogRef: MatDialogRef<ImageCropperComponent>,
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
      aspectRatio: 1,
      viewMode: 1,
      guides: false,
      
    });
  }

  // make the crop box rounded

  getRoundedCanvas(sourceCanvas: any) {
    var canvas = document.createElement('canvas');
    var context: any = canvas.getContext('2d');
    var width = sourceCanvas.width;
    var height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(
      width / 2,
      height / 2,
      Math.min(width, height) / 2,
      0,
      2 * Math.PI,
      true
    );
    context.fill();
    return canvas;
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

  crop() {
    const croppedCanvas = this.cropper.getCroppedCanvas();
    const roundedCanvas = this.getRoundedCanvas(croppedCanvas);
    const roundedImageDataURL = roundedCanvas.toDataURL();
    // Używając funkcji 'dataURLtoFile', konwertujemy dataURL na File
    const file = this.dataURLtoFile(roundedImageDataURL, this.imageData.fileName);
    this.dialogRef.close(file);
  }
  
  // resets the cropper
  reset(){
    this.cropper.clear();
    this.cropper.crop();
  }

}
