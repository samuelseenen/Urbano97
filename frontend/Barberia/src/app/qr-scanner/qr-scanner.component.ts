import { Component, OnInit } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
})
export class QrScannerComponent implements OnInit {
  scannedResult: string | null = null;
  decryptedResult: string = ''; // Cambia 'string | null' a 'string'

  formats: BarcodeFormat[] = [BarcodeFormat.QR_CODE];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  onScanSuccess(result: string): void {
    this.scannedResult = result;
    console.log(result);
    alert('Código QR escaneado correctamente');
    this.decryptQrCode(result);
  }

  decryptQrCode(encryptedData: string): void {
    this.http.post<{ message: string, data: string }>('http://localhost:3000/decrypt-qr/decrypt-qr', { encryptedData })
      .subscribe(
        response => {
          this.decryptedResult = response.data;
          console.log('Datos desencriptados:', this.decryptedResult);
        },
        error => {
          console.error('Error al desencriptar el código QR:', error);
        }
      );
  }
}
