// Frontend test data factories for candidate form tests

export const createValidCandidateFormData = (overrides: any = {}) => ({
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan.perez@example.com',
  phone: '912345678',
  address: 'Calle Principal 123, Madrid',
  education: '',
  experience: '',
  cv: null as File | null,
  ...overrides
});

export const createValidCandidateWithAllFields = (overrides: any = {}) => ({
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan.perez@example.com',
  phone: '912345678',
  address: 'Calle Principal 123, Madrid',
  education: "Bachelor's in Computer Science",
  experience: 'Senior Software Engineer, 5 years',
  cv: null,
  ...overrides
});

export const createMockFile = (
  name: string = 'CV.pdf',
  size: number = 1024 * 100,
  type: string = 'application/pdf'
): File => {
  const blob = new Blob(['test content'], { type });
  const file = new File([blob], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

export const createLargeMockFile = (
  size: number = 1024 * 1024 * 6
): File => {
  const blob = new Blob(['x'.repeat(size)], { type: 'application/pdf' });
  return new File([blob], 'large.pdf', { type: 'application/pdf' });
};

export const validTestEmails = [
  'candidate@example.com',
  'user@mail.example.com',
  'user+tag@example.com',
  'candidate123@example.com'
];

export const invalidTestEmails = [
  'candidateexample.com',
  'candidate@@example.com',
  'candidate@',
  '@example.com',
  'candidate @example.com'
];

export const validPhoneNumbers = [
  '912345678',
  '612345678',
  '712345678'
];

export const invalidPhoneNumbers = [
  '912#345@678',
  '312345678',
  'abc123456'
];

export const validNames = [
  'Juan',
  'María',
  'José',
  'Óscar',
  'Núria'
];

export const invalidNames = [
  '',
  'A',
  'a'.repeat(101),
  'Juan@',
  'Juan#'
];

export const xssTestPayloads = [
  "<script>alert('XSS')</script>",
  "<img src=x onerror='alert(\"XSS\")'>",
  // eslint-disable-next-line no-script-url
  "javascript:alert('XSS')",
  '<svg/onload=alert("XSS")>'
];

export const sqlInjectionTestPayloads = [
  "'; DROP TABLE candidates; --",
  "' OR '1'='1",
  "admin'--"
];

export const validCVFiles = [
  { name: 'CV.pdf', type: 'application/pdf' },
  { name: 'Resume.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
];

export const invalidCVFiles = [
  { name: 'CV.doc', type: 'application/msword' },
  { name: 'resume.txt', type: 'text/plain' },
  { name: 'cv_image.png', type: 'image/png' },
  { name: 'malware.exe', type: 'application/x-msdownload' }
];

export const createMockAPIResponse = (status: number = 201, data: any = {}) => ({
  status,
  data: {
    message: status === 201 ? 'Candidate added successfully' : 'Error adding candidate',
    data: {
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      ...data
    },
    error: status === 201 ? null : 'Validation error'
  }
});

export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => {
        delete store[key];
      });
    }
  };
};

export const createFormValidationErrors = (fields: string[]) => {
  return fields.map(field => ({
    field,
    message: `${field} is required or invalid`
  }));
};
