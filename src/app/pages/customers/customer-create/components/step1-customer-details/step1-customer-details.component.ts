import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { BranchOption } from '../../customer-create.component';

@Component({
  selector: 'app-step1-customer-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './step1-customer-details.component.html',
  styleUrls: ['./step1-customer-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Step1CustomerDetailsComponent {
  @Input({ required: true }) customerForm!: FormGroup;
  @Input() branches: BranchOption[] = [];
  @Input() statesList: string[] = [];
  @Input() profilePhotoUrl: string | null = null;
  @Input() registrationDate: Date = new Date();
  @Input() selectedBranchName: string = '';

  @Output() next = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() photoSelected = new EventEmitter<Event>();

  triggerPhotoUpload(fileInput: HTMLInputElement): void {
    fileInput.click();
  }
}
