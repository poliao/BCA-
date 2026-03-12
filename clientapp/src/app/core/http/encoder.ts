import { HttpParameterCodec } from '@angular/common/http';

export class Encoder implements HttpParameterCodec {
  encodeKey(key: string): string { return encodeURIComponent(key); }
  encodeValue(value: string): string { return this.serializeValue(value); }
  decodeKey(key: string): string { return decodeURIComponent(key); }
  decodeValue(value: string): string { return decodeURIComponent(value); }

  serializeValue(value: string) {
    if (value === null || value === undefined) return '';
    return encodeURIComponent(value);
  }
}
