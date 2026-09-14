import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-step2-documents',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './step2-documents.component.html',
  styleUrls: ['./step2-documents.component.css']
})
export class Step2DocumentsComponent {
  @Input({ required: true }) customerForm!: FormGroup;
  @Input() idTypes: string[] = [];
  @Input() additionalDocTypes: string[] = [];
  @Input() idProofFile: any = null;
  @Input() additionalDocs: any[] = [];
  @Input() profilePhotoUrl: string | null = null;
  @Input() isIdNumberVisible = false;

  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() toggleIdNumber = new EventEmitter<void>();
  @Output() idProofSelected = new EventEmitter<Event>();
  @Output() removeIdProof = new EventEmitter<void>();
  @Output() additionalDocSelected = new EventEmitter<{event: Event, index: number}>();
  @Output() addAnotherDoc = new EventEmitter<void>();
  @Output() removeAdditionalDoc = new EventEmitter<number>();
  @Output() photoSelected = new EventEmitter<Event>();

  get isIdTypeSelected(): boolean {
    return !!this.customerForm.get('idType')?.value;
  }

  get isIdNumberEntered(): boolean {
    return !!this.customerForm.get('idNumber')?.value;
  }

  get isIdProofUploaded(): boolean {
    return !!this.idProofFile;
  }

  get isPhotoUploaded(): boolean {
    return !!this.profilePhotoUrl;
  }

  triggerUpload(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onAdditionalDocSelectedInternal(event: Event, index: number): void {
    this.additionalDocSelected.emit({ event, index });
  }
}
