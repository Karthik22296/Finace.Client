import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UploadedFile, AdditionalDocItem } from '../../customer-create.component';

@Component({
  selector: 'app-step3-review',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './step3-review.component.html',
  styleUrls: ['./step3-review.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Step3ReviewComponent {
  @Input({ required: true }) customerForm!: FormGroup;
  @Input() selectedBranchName: string = '';
  @Input() idProofFile: UploadedFile | null = null;
  @Input() additionalDocs: AdditionalDocItem[] = [];
  @Input() profilePhotoUrl: string | null = null;
  @Input() isLoading = false;

  @Output() prev = new EventEmitter<void>();
  @Output() editStep = new EventEmitter<number>();

  get f(): Record<string, any> {
    return this.customerForm.getRawValue();
  }
}
