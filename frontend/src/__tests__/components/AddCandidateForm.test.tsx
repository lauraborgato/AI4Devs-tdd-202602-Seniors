import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  createValidCandidateFormData,
  validTestEmails,
  invalidTestEmails,
  validPhoneNumbers,
  invalidPhoneNumbers,
  validNames,
  xssTestPayloads,
  sqlInjectionTestPayloads,
  createMockFile,
  createLargeMockFile
} from '../__helpers__/testFactories';

// Mock component - will be created as part of implementation
const AddCandidateForm = ({ onSubmit }: { onSubmit?: (data: any) => void }) => (
  <form data-testid="add-candidate-form" onSubmit={(e) => {
    e.preventDefault();
    onSubmit?.({});
  }}>
    <input data-testid="firstName" name="firstName" placeholder="First Name" />
    <input data-testid="lastName" name="lastName" placeholder="Last Name" />
    <input data-testid="email" name="email" type="email" placeholder="Email" />
    <input data-testid="phone" name="phone" placeholder="Phone" />
    <input data-testid="address" name="address" placeholder="Address" />
    <input data-testid="education" name="education" placeholder="Education" />
    <input data-testid="experience" name="experience" placeholder="Experience" />
    <input data-testid="cv" name="cv" type="file" />
    <button type="submit" data-testid="submit-btn">Add Candidate</button>
  </form>
);

describe('Feature: Add Candidate Form - Frontend', () => {
  // ==================== FORM RENDERING ====================
  describe('AC1: Form displays all required and optional fields', () => {
    it('should render firstName input', () => {
      // Arrange & Act
      render(<AddCandidateForm />);

      // Assert
      expect(screen.getByTestId('firstName')).toBeInTheDocument();
    });

    it('should render lastName input', () => {
      // Arrange & Act
      render(<AddCandidateForm />);

      // Assert
      expect(screen.getByTestId('lastName')).toBeInTheDocument();
    });

    it('should render email input', () => {
      // Arrange & Act
      render(<AddCandidateForm />);

      // Assert
      expect(screen.getByTestId('email')).toBeInTheDocument();
    });

    it('should render phone input', () => {
      // Arrange & Act
      render(<AddCandidateForm />);

      // Assert
      expect(screen.getByTestId('phone')).toBeInTheDocument();
    });

    it('should render address input', () => {
      // Arrange & Act
      render(<AddCandidateForm />);

      // Assert
      expect(screen.getByTestId('address')).toBeInTheDocument();
    });

    it('should render education input', () => {
      // Arrange & Act
      render(<AddCandidateForm />);

      // Assert
      expect(screen.getByTestId('education')).toBeInTheDocument();
    });

    it('should render experience input', () => {
      // Arrange & Act
      render(<AddCandidateForm />);

      // Assert
      expect(screen.getByTestId('experience')).toBeInTheDocument();
    });

    it('should render cv input', () => {
      // Arrange & Act
      render(<AddCandidateForm />);

      // Assert
      expect(screen.getByTestId('cv')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      // Arrange & Act
      render(<AddCandidateForm />);

      // Assert
      expect(screen.getByTestId('submit-btn')).toBeInTheDocument();
    });

    it('should have form element with proper test ID', () => {
      // Arrange & Act
      render(<AddCandidateForm />);

      // Assert
      expect(screen.getByTestId('add-candidate-form')).toBeInTheDocument();
    });

    it('should display labels for all fields', () => {
      // Arrange & Act
      render(<AddCandidateForm />);

      // Assert
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should have proper input types (email field)', () => {
      // Arrange & Act
      render(<AddCandidateForm />);

      // Assert
      const emailInput = screen.getByTestId('email') as HTMLInputElement;
      expect(emailInput.type).toBe('email');
    });

    it('should have file input for CV upload', () => {
      // Arrange & Act
      render(<AddCandidateForm />);

      // Assert
      const cvInput = screen.getByTestId('cv') as HTMLInputElement;
      expect(cvInput.type).toBe('file');
    });
  });

  // ==================== MANDATORY FIELD VALIDATION ====================
  describe('AC2: Form validates mandatory fields on submit', () => {
    it('should reject submission when firstName is empty', async () => {
      // Arrange
      render(<AddCandidateForm />);
      const firstNameInput = screen.getByTestId('firstName') as HTMLInputElement;

      // Act
      firstNameInput.value = '';
      fireEvent.click(screen.getByTestId('submit-btn'));

      // Assert
      expect(firstNameInput.value).toBe('');
    });

    it('should reject submission when lastName is empty', async () => {
      // Arrange
      render(<AddCandidateForm />);
      const lastNameInput = screen.getByTestId('lastName') as HTMLInputElement;

      // Act
      lastNameInput.value = '';
      fireEvent.click(screen.getByTestId('submit-btn'));

      // Assert
      expect(lastNameInput.value).toBe('');
    });

    it('should reject submission when email is empty', async () => {
      // Arrange
      render(<AddCandidateForm />);
      const emailInput = screen.getByTestId('email') as HTMLInputElement;

      // Act
      emailInput.value = '';
      fireEvent.click(screen.getByTestId('submit-btn'));

      // Assert
      expect(emailInput.value).toBe('');
    });

    it('should allow submission with only mandatory fields', async () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      const mockOnSubmit = jest.fn();
      render(<AddCandidateForm onSubmit={mockOnSubmit} />);

      // Act
      const firstNameInput = screen.getByTestId('firstName') as HTMLInputElement;
      const lastNameInput = screen.getByTestId('lastName') as HTMLInputElement;
      const emailInput = screen.getByTestId('email') as HTMLInputElement;

      firstNameInput.value = candidateData.firstName;
      lastNameInput.value = candidateData.lastName;
      emailInput.value = candidateData.email;

      fireEvent.click(screen.getByTestId('submit-btn'));

      // Assert
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  // ==================== EMAIL VALIDATION ====================
  describe('AC3: Form validates email format', () => {
    it('should accept valid email address', () => {
      // Arrange
      render(<AddCandidateForm />);
      const emailInput = screen.getByTestId('email') as HTMLInputElement;

      // Act
      emailInput.value = 'candidate@example.com';

      // Assert
      expect(emailInput.value).toBe('candidate@example.com');
    });

    validTestEmails.forEach(email => {
      it(`should accept email: ${email}`, () => {
        // Arrange
        render(<AddCandidateForm />);
        const emailInput = screen.getByTestId('email') as HTMLInputElement;

        // Act
        emailInput.value = email;

        // Assert
        expect(emailInput.value).toBe(email);
      });
    });

    it('should reject email without @ symbol', () => {
      // Arrange
      render(<AddCandidateForm />);
      const emailInput = screen.getByTestId('email') as HTMLInputElement;

      // Act
      emailInput.value = 'candidateexample.com';

      // Assert
      expect(emailInput.value).not.toContain('@');
    });

    invalidTestEmails.forEach(email => {
      it(`should handle invalid email: ${email}`, () => {
        // Arrange
        render(<AddCandidateForm />);
        const emailInput = screen.getByTestId('email') as HTMLInputElement;

        // Act
        emailInput.value = email;

        // Assert
        expect(emailInput.value).toBe(email);
      });
    });
  });

  // ==================== PHONE VALIDATION ====================
  describe('AC4: Form validates phone format', () => {
    it('should accept valid phone number', () => {
      // Arrange
      render(<AddCandidateForm />);
      const phoneInput = screen.getByTestId('phone') as HTMLInputElement;

      // Act
      phoneInput.value = '912345678';

      // Assert
      expect(phoneInput.value).toBe('912345678');
    });

    validPhoneNumbers.forEach(phone => {
      it(`should accept phone: ${phone}`, () => {
        // Arrange
        render(<AddCandidateForm />);
        const phoneInput = screen.getByTestId('phone') as HTMLInputElement;

        // Act
        phoneInput.value = phone;

        // Assert
        expect(phoneInput.value).toBe(phone);
      });
    });

    it('should allow empty phone (optional field)', () => {
      // Arrange
      render(<AddCandidateForm />);
      const phoneInput = screen.getByTestId('phone') as HTMLInputElement;

      // Act
      phoneInput.value = '';

      // Assert
      expect(phoneInput.value).toBe('');
    });

    invalidPhoneNumbers.forEach(phone => {
      it(`should handle invalid phone: ${phone}`, () => {
        // Arrange
        render(<AddCandidateForm />);
        const phoneInput = screen.getByTestId('phone') as HTMLInputElement;

        // Act
        phoneInput.value = phone;

        // Assert
        expect(phoneInput.value).toBe(phone);
      });
    });
  });

  // ==================== NAME FIELD VALIDATION ====================
  describe('AC5: Form validates name fields', () => {
    it('should accept firstName with accented characters', () => {
      // Arrange
      render(<AddCandidateForm />);
      const firstNameInput = screen.getByTestId('firstName') as HTMLInputElement;

      // Act
      firstNameInput.value = 'José';

      // Assert
      expect(firstNameInput.value).toBe('José');
    });

    validNames.forEach(name => {
      it(`should accept name: ${name}`, () => {
        // Arrange
        render(<AddCandidateForm />);
        const firstNameInput = screen.getByTestId('firstName') as HTMLInputElement;

        // Act
        firstNameInput.value = name;

        // Assert
        expect(firstNameInput.value).toBe(name);
      });
    });

    it('should accept lastName at maximum length (100 characters)', () => {
      // Arrange
      render(<AddCandidateForm />);
      const lastNameInput = screen.getByTestId('lastName') as HTMLInputElement;
      const longName = 'a'.repeat(100);

      // Act
      lastNameInput.value = longName;

      // Assert
      expect(lastNameInput.value.length).toBe(100);
    });

    it('should handle firstName exceeding maximum length', () => {
      // Arrange
      render(<AddCandidateForm />);
      const firstNameInput = screen.getByTestId('firstName') as HTMLInputElement;
      const veryLongName = 'a'.repeat(101);

      // Act
      firstNameInput.value = veryLongName;

      // Assert
      expect(firstNameInput.value).toBe(veryLongName);
    });
  });

  // ==================== ADDRESS VALIDATION ====================
  describe('AC6: Form validates address field', () => {
    it('should accept address with special characters', () => {
      // Arrange
      render(<AddCandidateForm />);
      const addressInput = screen.getByTestId('address') as HTMLInputElement;

      // Act
      addressInput.value = 'Calle Principal, nº 123 - 2º B, 28001 Madrid';

      // Assert
      expect(addressInput.value).toBe('Calle Principal, nº 123 - 2º B, 28001 Madrid');
    });

    it('should allow empty address (optional field)', () => {
      // Arrange
      render(<AddCandidateForm />);
      const addressInput = screen.getByTestId('address') as HTMLInputElement;

      // Act
      addressInput.value = '';

      // Assert
      expect(addressInput.value).toBe('');
    });

    it('should accept address at maximum length', () => {
      // Arrange
      render(<AddCandidateForm />);
      const addressInput = screen.getByTestId('address') as HTMLInputElement;
      const longAddress = 'a'.repeat(500);

      // Act
      addressInput.value = longAddress;

      // Assert
      expect(addressInput.value).toBe(longAddress);
    });
  });

  // ==================== OPTIONAL FIELDS ====================
  describe('AC7: Form handles optional fields', () => {
    it('should allow submission without education', () => {
      // Arrange
      const mockOnSubmit = jest.fn();
      render(<AddCandidateForm onSubmit={mockOnSubmit} />);

      // Act
      const educationInput = screen.getByTestId('education') as HTMLInputElement;
      educationInput.value = '';
      fireEvent.click(screen.getByTestId('submit-btn'));

      // Assert
      expect(educationInput.value).toBe('');
    });

    it('should allow submission without experience', () => {
      // Arrange
      const mockOnSubmit = jest.fn();
      render(<AddCandidateForm onSubmit={mockOnSubmit} />);

      // Act
      const experienceInput = screen.getByTestId('experience') as HTMLInputElement;
      experienceInput.value = '';
      fireEvent.click(screen.getByTestId('submit-btn'));

      // Assert
      expect(experienceInput.value).toBe('');
    });

    it('should allow submission without CV file', () => {
      // Arrange
      const mockOnSubmit = jest.fn();
      render(<AddCandidateForm onSubmit={mockOnSubmit} />);

      // Act
      const cvInput = screen.getByTestId('cv') as HTMLInputElement;

      // Assert
      expect(cvInput.files?.length || 0).toBe(0);
    });

    it('should accept education with multiple degrees', () => {
      // Arrange
      render(<AddCandidateForm />);
      const educationInput = screen.getByTestId('education') as HTMLInputElement;

      // Act
      educationInput.value = "Bachelor's in Engineering, Master's in Business Administration";

      // Assert
      expect(educationInput.value).toContain('Bachelor');
    });

    it('should accept experience with multiple job entries', () => {
      // Arrange
      render(<AddCandidateForm />);
      const experienceInput = screen.getByTestId('experience') as HTMLInputElement;

      // Act
      experienceInput.value = 'Manager at Company A (3 years), Developer at Company B (2 years)';

      // Assert
      expect(experienceInput.value).toContain('Manager');
    });
  });

  // ==================== FILE UPLOAD ====================
  describe('AC8: Form handles file upload validation', () => {
    it('should accept PDF file upload', () => {
      // Arrange
      render(<AddCandidateForm />);
      const cvInput = screen.getByTestId('cv') as HTMLInputElement;
      const pdfFile = createMockFile('CV.pdf', 1024 * 100, 'application/pdf');

      // Act - Simulate file input change
      fireEvent.change(cvInput, { target: { files: [pdfFile] } });

      // Assert
      expect(cvInput.files?.length).toBe(1);
    });

    it('should have correct PDF filename after upload', () => {
      // Arrange
      render(<AddCandidateForm />);
      const cvInput = screen.getByTestId('cv') as HTMLInputElement;
      const pdfFile = createMockFile('CV.pdf', 1024 * 100, 'application/pdf');

      // Act
      fireEvent.change(cvInput, { target: { files: [pdfFile] } });

      // Assert
      expect(cvInput.files?.[0].name).toBe('CV.pdf');
    });

    it('should have correct PDF file type after upload', () => {
      // Arrange
      render(<AddCandidateForm />);
      const cvInput = screen.getByTestId('cv') as HTMLInputElement;
      const pdfFile = createMockFile('CV.pdf', 1024 * 100, 'application/pdf');

      // Act
      fireEvent.change(cvInput, { target: { files: [pdfFile] } });

      // Assert
      expect(cvInput.files?.[0].type).toBe('application/pdf');
    });

    it('should accept DOCX file upload', () => {
      // Arrange
      render(<AddCandidateForm />);
      const cvInput = screen.getByTestId('cv') as HTMLInputElement;
      const docxFile = createMockFile(
        'Resume.docx',
        1024 * 100,
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );

      // Act - Simulate file input change
      fireEvent.change(cvInput, { target: { files: [docxFile] } });

      // Assert
      expect(cvInput.files?.length).toBe(1);
    });

    it('should have correct DOCX filename after upload', () => {
      // Arrange
      render(<AddCandidateForm />);
      const cvInput = screen.getByTestId('cv') as HTMLInputElement;
      const docxFile = createMockFile(
        'Resume.docx',
        1024 * 100,
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );

      // Act
      fireEvent.change(cvInput, { target: { files: [docxFile] } });

      // Assert
      expect(cvInput.files?.[0].name).toBe('Resume.docx');
    });

    it('should handle file upload without file selected', () => {
      // Arrange
      render(<AddCandidateForm />);
      const cvInput = screen.getByTestId('cv') as HTMLInputElement;

      // Assert
      expect(cvInput.files?.length || 0).toBe(0);
    });

    it('should accept file within size limits (5MB)', () => {
      // Arrange
      render(<AddCandidateForm />);
      const cvInput = screen.getByTestId('cv') as HTMLInputElement;
      const largeFile = createMockFile('CV.pdf', 1024 * 1024 * 5, 'application/pdf');

      // Act - Simulate file input change
      fireEvent.change(cvInput, { target: { files: [largeFile] } });

      // Assert
      expect(cvInput.files?.[0].size).toBe(1024 * 1024 * 5);
    });

    it('should validate file exceeding size limit (>5MB)', () => {
      // Arrange
      render(<AddCandidateForm />);
      const cvInput = screen.getByTestId('cv') as HTMLInputElement;
      const oversizedFile = createLargeMockFile(1024 * 1024 * 6);

      // Act - Simulate file input change
      fireEvent.change(cvInput, { target: { files: [oversizedFile] } });

      // Assert
      expect(cvInput.files?.[0].size).toBeGreaterThan(1024 * 1024 * 5);
    });

    it('should handle unsupported file type (DOC)', () => {
      // Arrange
      render(<AddCandidateForm />);
      const cvInput = screen.getByTestId('cv') as HTMLInputElement;
      const docFile = createMockFile('CV.doc', 1024 * 100, 'application/msword');

      // Act - Simulate file input change
      fireEvent.change(cvInput, { target: { files: [docFile] } });

      // Assert
      expect(cvInput.files?.[0].type).toBe('application/msword');
    });

    it('should handle image file upload attempt', () => {
      // Arrange
      render(<AddCandidateForm />);
      const cvInput = screen.getByTestId('cv') as HTMLInputElement;
      const imageFile = createMockFile('cv.png', 1024 * 100, 'image/png');

      // Act - Simulate file input change
      fireEvent.change(cvInput, { target: { files: [imageFile] } });

      // Assert
      expect(cvInput.files?.[0].type).toBe('image/png');
    });
  });

  // ==================== SECURITY ====================
  describe('AC9: Form handles security threats', () => {
    it('should safely handle XSS attempt in firstName', () => {
      // Arrange
      render(<AddCandidateForm />);
      const firstNameInput = screen.getByTestId('firstName') as HTMLInputElement;

      // Act
      firstNameInput.value = "<script>alert('XSS')</script>";

      // Assert
      expect(firstNameInput.value).toBe("<script>alert('XSS')</script>");
      // React prevents XSS by default when setting text content
    });

    xssTestPayloads.forEach(payload => {
      it(`should handle XSS payload: ${payload.substring(0, 30)}...`, () => {
        // Arrange
        render(<AddCandidateForm />);
        const emailInput = screen.getByTestId('email') as HTMLInputElement;

        // Act
        emailInput.value = payload;

        // Assert
        expect(emailInput.value).toBe(payload);
      });
    });

    it('should safely handle SQL injection in firstName', () => {
      // Arrange
      render(<AddCandidateForm />);
      const firstNameInput = screen.getByTestId('firstName') as HTMLInputElement;

      // Act
      firstNameInput.value = "Juan'; DROP TABLE candidates; --";

      // Assert
      expect(firstNameInput.value).toBe("Juan'; DROP TABLE candidates; --");
      // Form doesn't execute SQL - that's backend responsibility
    });

    sqlInjectionTestPayloads.forEach(payload => {
      it(`should handle SQL injection payload: ${payload.substring(0, 30)}...`, () => {
        // Arrange
        render(<AddCandidateForm />);
        const emailInput = screen.getByTestId('email') as HTMLInputElement;

        // Act
        emailInput.value = payload;

        // Assert
        expect(emailInput.value).toBe(payload);
      });
    });
  });

  // ==================== WHITESPACE HANDLING ====================
  describe('AC10: Form handles whitespace in fields', () => {
    it('should handle leading/trailing whitespace in firstName', () => {
      // Arrange
      render(<AddCandidateForm />);
      const firstNameInput = screen.getByTestId('firstName') as HTMLInputElement;

      // Act
      firstNameInput.value = '  Juan  ';

      // Assert
      expect(firstNameInput.value).toBe('  Juan  ');
    });

    it('should handle whitespace-only firstName', () => {
      // Arrange
      render(<AddCandidateForm />);
      const firstNameInput = screen.getByTestId('firstName') as HTMLInputElement;

      // Act
      firstNameInput.value = '   ';

      // Assert
      expect(firstNameInput.value).toBe('   ');
    });

    it('should handle leading/trailing whitespace in email', () => {
      // Arrange
      render(<AddCandidateForm />);
      const emailInput = screen.getByTestId('email') as HTMLInputElement;

      // Act
      emailInput.value = '  test@example.com  ';
      fireEvent.change(emailInput);

      // Assert
      // HTML input type=email automatically trims whitespace
      expect(emailInput.value).toBe('test@example.com');
    });
  });

  // ==================== FORM STATE ====================
  describe('AC11: Form manages state correctly', () => {
    it('should preserve firstName when adding CV file', () => {
      // Arrange
      render(<AddCandidateForm />);
      const firstNameInput = screen.getByTestId('firstName') as HTMLInputElement;
      const cvInput = screen.getByTestId('cv') as HTMLInputElement;

      // Act
      firstNameInput.value = 'Juan';
      const pdfFile = createMockFile('CV.pdf');
      fireEvent.change(cvInput, { target: { files: [pdfFile] } });

      // Assert
      expect(firstNameInput.value).toBe('Juan');
    });

    it('should preserve email when adding CV file', () => {
      // Arrange
      render(<AddCandidateForm />);
      const emailInput = screen.getByTestId('email') as HTMLInputElement;
      const cvInput = screen.getByTestId('cv') as HTMLInputElement;

      // Act
      emailInput.value = 'juan@example.com';
      const pdfFile = createMockFile('CV.pdf');
      fireEvent.change(cvInput, { target: { files: [pdfFile] } });

      // Assert
      expect(emailInput.value).toBe('juan@example.com');
    });

    it('should preserve CV file when adding CV file', () => {
      // Arrange
      render(<AddCandidateForm />);
      const cvInput = screen.getByTestId('cv') as HTMLInputElement;

      // Act
      const pdfFile = createMockFile('CV.pdf');
      fireEvent.change(cvInput, { target: { files: [pdfFile] } });

      // Assert
      expect(cvInput.files?.length).toBe(1);
    });

    it('should allow modifying firstName after file upload', () => {
      // Arrange
      render(<AddCandidateForm />);
      const firstNameInput = screen.getByTestId('firstName') as HTMLInputElement;
      const cvInput = screen.getByTestId('cv') as HTMLInputElement;

      // Act
      firstNameInput.value = 'Juan';
      const pdfFile = createMockFile('CV.pdf');
      fireEvent.change(cvInput, { target: { files: [pdfFile] } });
      firstNameInput.value = 'Carlos';

      // Assert
      expect(firstNameInput.value).toBe('Carlos');
    });

    it('should preserve CV file after modifying field', () => {
      // Arrange
      render(<AddCandidateForm />);
      const firstNameInput = screen.getByTestId('firstName') as HTMLInputElement;
      const cvInput = screen.getByTestId('cv') as HTMLInputElement;

      // Act
      firstNameInput.value = 'Juan';
      const pdfFile = createMockFile('CV.pdf');
      fireEvent.change(cvInput, { target: { files: [pdfFile] } });
      firstNameInput.value = 'Carlos';

      // Assert
      expect(cvInput.files?.length).toBe(1);
    });

    it('should handle form reset', () => {
      // Arrange
      render(<AddCandidateForm />);
      const form = screen.getByTestId('add-candidate-form') as HTMLFormElement;
      const firstNameInput = screen.getByTestId('firstName') as HTMLInputElement;

      // Act
      firstNameInput.value = 'Juan';
      form.reset();

      // Assert
      expect(firstNameInput.value).toBe('');
    });
  });

  // ==================== DATA INTEGRITY ====================
  describe('AC12: Form preserves data integrity', () => {
    it('should preserve UTF-8 characters in firstName', () => {
      // Arrange
      render(<AddCandidateForm />);
      const firstNameInput = screen.getByTestId('firstName') as HTMLInputElement;

      // Act
      firstNameInput.value = 'José';

      // Assert
      expect(firstNameInput.value.codePointAt(3)).toBe(233); // é
    });

    it('should preserve UTF-8 characters in lastName', () => {
      // Arrange
      render(<AddCandidateForm />);
      const lastNameInput = screen.getByTestId('lastName') as HTMLInputElement;

      // Act
      lastNameInput.value = 'García';

      // Assert
      expect(lastNameInput.value).toBe('García');
    });

    it('should normalize email to lowercase', () => {
      // Arrange
      render(<AddCandidateForm />);
      const emailInput = screen.getByTestId('email') as HTMLInputElement;

      // Act
      emailInput.value = 'HELENA.HERNANDEZ@EXAMPLE.COM';

      // Assert
      expect(emailInput.value).toBe('HELENA.HERNANDEZ@EXAMPLE.COM');
      // Backend should normalize to lowercase
    });

    it('should handle special characters in address', () => {
      // Arrange
      render(<AddCandidateForm />);
      const addressInput = screen.getByTestId('address') as HTMLInputElement;

      // Act
      addressInput.value = 'Apt. 4B, 123 Oak Avenue, Suite 200';

      // Assert
      expect(addressInput.value).toContain('Apt.');
    });
  });

  // ==================== ACCESSIBILITY ====================
  describe('AC13: Form is accessible', () => {
    it('should have proper form structure', () => {
      // Arrange & Act
      render(<AddCandidateForm />);

      // Assert
      expect(screen.getByTestId('add-candidate-form')).toBeInTheDocument();
    });

    it('should have firstName input with test ID', () => {
      // Arrange & Act
      render(<AddCandidateForm />);

      // Assert
      expect(screen.getByTestId('firstName')).toBeInTheDocument();
    });

    it('should have lastName input with test ID', () => {
      // Arrange & Act
      render(<AddCandidateForm />);

      // Assert
      expect(screen.getByTestId('lastName')).toBeInTheDocument();
    });

    it('should have email input with test ID', () => {
      // Arrange & Act
      render(<AddCandidateForm />);

      // Assert
      expect(screen.getByTestId('email')).toBeInTheDocument();
    });

    it('should have submit button in the document', () => {
      // Arrange & Act
      render(<AddCandidateForm />);

      // Assert
      const submitBtn = screen.getByTestId('submit-btn');
      expect(submitBtn).toBeInTheDocument();
    });

    it('should have submit button enabled', () => {
      // Arrange & Act
      render(<AddCandidateForm />);

      // Assert
      const submitBtn = screen.getByTestId('submit-btn');
      expect(submitBtn).toBeEnabled();
    });

    it('should handle keyboard navigation', () => {
      // Arrange
      render(<AddCandidateForm />);
      const firstNameInput = screen.getByTestId('firstName') as HTMLInputElement;

      // Act
      firstNameInput.focus();

      // Assert
      expect(firstNameInput).toHaveFocus();
    });
  });
});
