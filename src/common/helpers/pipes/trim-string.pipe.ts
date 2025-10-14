import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class TrimStringPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  }
}
