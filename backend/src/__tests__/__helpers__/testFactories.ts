// Test data factories for candidate-related tests

export const createValidCandidate = (overrides: any = {}) => ({
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan.perez@example.com',
  phone: '912345678',
  address: 'Calle Principal 123, Madrid',
  ...overrides
});

export const createValidCandidateWithAllOptionalFields = (overrides: any = {}) => ({
  ...createValidCandidate(),
  educations: [
    {
      institution: 'Universidad de Madrid',
      title: "Bachelor's in Computer Science",
      startDate: '2015-09-01',
      endDate: '2019-06-30'
    }
  ],
  workExperiences: [
    {
      company: 'Tech Company Inc',
      position: 'Senior Software Engineer',
      description: '5 years of experience',
      startDate: '2019-07-01'
    }
  ],
  cv: {
    filePath: '/uploads/cv_juan_perez.pdf',
    fileType: 'application/pdf'
  },
  ...overrides
});

export const createValidEducation = (overrides: any = {}) => ({
  institution: 'Universidad Complutense',
  title: 'Master in Business Administration',
  startDate: '2019-09-01',
  endDate: '2021-06-30',
  ...overrides
});

export const createValidWorkExperience = (overrides: any = {}) => ({
  company: 'Software Solutions Ltd',
  position: 'Senior Developer',
  description: 'Led development of microservices architecture',
  startDate: '2020-01-15',
  endDate: '2023-12-31',
  ...overrides
});

export const createValidCV = (overrides: any = {}) => ({
  filePath: '/uploads/resume.pdf',
  fileType: 'application/pdf',
  ...overrides
});

export const createInvalidCandidate = (field: string, value: any) => {
  const candidate = createValidCandidate();
  candidate[field] = value;
  return candidate;
};

export const createMockCandidate = (id: number = 1, overrides: any = {}) => ({
  id,
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan.perez@example.com',
  phone: '912345678',
  address: 'Calle Principal 123, Madrid',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});

export const validEmailAddresses = [
  'candidate@example.com',
  'user@mail.example.com',
  'user+tag@example.com',
  'candidate123@example.com',
  'test.user@company.co.uk'
];

export const invalidEmailAddresses = [
  'candidateexample.com',       // missing @
  'candidate@@example.com',     // double @
  'candidate@',                 // missing domain
  '@example.com',               // missing local part
  'candidate @example.com',     // space in email
  'candidatö@example.com'       // non-ASCII in local part
];

export const validPhoneFormats = [
  '912345678',
  '612345678',
  '712345678'
];

export const invalidPhoneFormats = [
  '+34912345678',  // international format not supported
  '912#345@678',
  '11234567',      // doesn't start with 6, 7, or 9
  '312345678',     // doesn't start with 6, 7, or 9
  'abc123456'      // non-numeric
];

export const validNameFormats = [
  'José',
  'Juan',
  'María',
  'Óscar'
];

export const invalidNameFormats = [
  '',
  '   ',
  'a'.repeat(101),  // exceeds max length
  'Juan@',
  'Juan#Test',
  '123456',
  'García-López',   // hyphens not supported
  "O'Neill",        // apostrophes not supported
  'Á',              // single character, below min length
  'A'               // single character, below min length
];

export const xssPayloads = [
  "<script>alert('XSS')</script>",
  "<img src=x onerror='alert(\"XSS\")'>",
  "javascript:alert('XSS')",
  '<iframe src="javascript:alert(\'XSS\')"></iframe>',
  '"><script>alert("XSS")</script>',
  '<svg/onload=alert("XSS")>'
];

export const sqlInjectionPayloads = [
  "'; DROP TABLE candidates; --",
  "' OR '1'='1",
  "123 Main St'; UPDATE candidates SET name='hacked' WHERE '1'='1",
  "admin'--",
  "1' UNION SELECT * FROM candidates--"
];

export const invalidFileTypes = [
  { name: 'CV.doc', type: 'application/msword' },
  { name: 'resume.txt', type: 'text/plain' },
  { name: 'cv_image.png', type: 'image/png' },
  { name: 'CV.pdf.exe', type: 'application/x-msdownload' },
  { name: 'malware.exe', type: 'application/x-msdownload' }
];

export const validFileTypes = [
  { name: 'CV.pdf', type: 'application/pdf' },
  { name: 'Resume.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
];
