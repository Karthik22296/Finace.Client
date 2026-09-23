import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customerCode',
  standalone: true,
  pure: true
})
export class CustomerCodePipe implements PipeTransform {
  transform(id?: number | null): string {
    if (!id) return 'CUST-000';
    return `CUST-${String(id).padStart(3, '0')}`;
  }
}
