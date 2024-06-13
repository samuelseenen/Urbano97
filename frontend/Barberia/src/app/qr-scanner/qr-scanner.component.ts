import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class QrScannerComponent implements OnInit {
  qrResultSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  scannedResult: string | null = null;
  decryptedResult: { nombreCliente: string, apellidoCliente: string, nombrePeluquero: string, fecha: string, hora: string } | null = null;
  showScanner: boolean = false;

  formats: BarcodeFormat[] = [BarcodeFormat.QR_CODE];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  startScanning(): void {
    this.showScanner = true; // Mostrar el componente zxing-scanner al hacer clic en el boton
  }

  onScanSuccess(result: string): void {
    this.qrResultSubject.next(result);
    this.scannedResult = result;
    alert('Código QR escaneado correctamente');
    this.decryptQrCode(result);
    this.showScanner = false;
  }

  decryptQrCode(encryptedData: string): void {
    this.http.post<{ message: string, data: { nombreCliente: string, apellidoCliente: string, nombrePeluquero: string, fecha: string, hora: string } }>('http://localhost:3000/decrypt-qr/decrypt-qr', { encryptedData })
      .subscribe(
        response => {
          this.decryptedResult = response.data;
        },
        error => {
          console.error('Error al desencriptar el código QR:', error);
        }
      );
  }
}
