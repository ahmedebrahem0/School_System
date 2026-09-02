

// features/classes/types.ts

/**
 * Class object from GET /api/Classes (list response)
 * Minimal data for table display
 */
export interface Classes {
  classId: number;
  className: string;
  schoolGradeId: number | null;
  schoolGradeName: string | null;
  students: unknown[];
  teachers: unknown[];
  subjects: unknown[];
  timetables: unknown[];
}

/**
 * Class object from GET /api/Classes/{id}
 * Single class with full details
 */
export interface ClassDetails extends Classes {
  // Same structure for now
  // Will extend with nested data later if needed
}

/**
 * Request body for POST /api/Classes
 * Create new class
 */
export interface CreateClassDto {
  className: string;
}

/**
 * Request body for PUT /api/Classes/{id}
 * Update existing class
 */
export interface UpdateClassDto {
  className: string;
}

/**
 * Form data for create/edit forms
 * Same as UpdateClassDto for frontend use
 */
export interface ClassFormData {
  className: string;
}