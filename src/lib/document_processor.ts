/**
 * Frontend Document Processor
 * Client-side format detection and validation
 */

export interface FormatResult {
  filename: string;
  format_type: string | null;
  supported: boolean;
  is_scanned: boolean;
  error_message?: string;
}

export class DocumentProcessor {
  /**
   * Detect document format using basic file properties
   * Note: This is basic detection - full detection happens on backend
   */
  static detectFormat(file: File): FormatResult {
    const result: FormatResult = {
      filename: file.name,
      format_type: null,
      supported: false,
      is_scanned: false
    };

    // Basic MIME type detection
    if (file.type === 'application/pdf') {
      result.format_type = 'pdf';
      // We can't detect scanned vs text on frontend, so assume supported for now
      result.supported = true;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
               file.type === 'application/msword') {
      result.format_type = 'docx';
      result.supported = true;
    } else if (file.type.startsWith('image/')) {
      result.format_type = 'image';
      result.supported = false;
      result.error_message = 'Images will be supported in a future update. Please upload PDF or DOCX files.';
    } else {
      result.format_type = 'unknown';
      result.supported = false;
      result.error_message = 'Unsupported file format. Please upload PDF or DOCX files.';
    }

    return result;
  }

  /**
   * Validate multiple files for format compatibility
   */
  static validateFiles(files: File[]): {
    valid: File[];
    invalid: Array<{ file: File; reason: string }>;
  } {
    const valid: File[] = [];
    const invalid: Array<{ file: File; reason: string }> = [];

    files.forEach(file => {
      const format = this.detectFormat(file);
      if (format.supported) {
        valid.push(file);
      } else {
        invalid.push({
          file,
          reason: format.error_message || 'Unsupported format'
        });
      }
    });

    return { valid, invalid };
  }

  /**
   * Get supported file types for input accept attribute
   */
  static getSupportedTypes(): string {
    return '.pdf,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';
  }

  /**
   * Check if file format is supported for document upload (allows all uploads)
   */
  static isSupportedForUpload(file: File): boolean {
    // For document uploads, we allow everything but show warnings
    return true;
  }

  /**
   * Check if file format is supported for template generation (strict)
   */
  static isSupportedForTemplate(file: File): boolean {
    const format = this.detectFormat(file);
    return format.supported;
  }
}
