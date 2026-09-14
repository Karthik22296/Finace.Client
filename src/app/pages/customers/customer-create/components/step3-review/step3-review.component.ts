import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  styleUrls: ['./step3-review.component.css']
})
export class Step3ReviewComponent {
  @Input({ required: true }) customerForm!: FormGroup;
  @Input() selectedBranchName: string = '';
  @Input() idProofFile: any = null;
  @Input() additionalDocs: any[] = [];
  @Input() profilePhotoUrl: string | null = null;
  @Input() isLoading = false;

  @Output() prev = new EventEmitter<void>();
  @Output() editStep = new EventEmitter<number>();
}
