import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
  standalone: true,
  pure: true
})
export class PhoneFormatPipe implements PipeTransform {
  transform(num?: string | null): string {
    if (!num) return 'N/A';
    const clean = num.replace(/\D/g, '');
    if (clean.length === 10) {
      return `${clean.substring(0, 5)} ${clean.substring(5)}`;
    }
    return num;
  }
}
