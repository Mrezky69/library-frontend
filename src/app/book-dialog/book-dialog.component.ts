import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BookService } from '../services/book.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-dialog',
  templateUrl: './book-dialog.component.html',
  styleUrls: ['./book-dialog.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class BookDialogComponent {
  form: FormGroup;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BookDialogComponent>,
    private bookService: BookService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      title: [data?.title || '', Validators.required],
      author: [data?.author || '', Validators.required],
      publicationYear: [data?.publicationYear || '', Validators.required],
      stock: [data?.stock || '', Validators.required],
      coverImageBase64: [''],
    });

    if (data?.coverImageBase64) {
      this.imagePreview = data.coverImageBase64;
      this.form.get('coverImageBase64')?.setValue(data.coverImageBase64);
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.form.get('coverImageBase64')?.setValue(this.imagePreview);
    };
    reader.readAsDataURL(file);
  }

  submit() {
    if (this.form.invalid) return;

    const payload = this.form.value;
    const apiCall = this.data?.id
      ? this.bookService.updateBook(this.data.id, payload)
      : this.bookService.createBook(payload);

    apiCall.subscribe({
      next: () => this.dialogRef.close('refresh'),
      error: (err) =>
        alert('Gagal menyimpan data: ' + (err.error?.message || 'Unknown error')),
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
