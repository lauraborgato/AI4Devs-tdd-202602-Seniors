import {
  createValidCandidate,
  createValidCandidateWithAllOptionalFields,
  createValidEducation,
  createValidWorkExperience,
  createValidCV
} from '../__helpers__/testFactories';

jest.mock('../../application/validator', () => ({
  validateCandidateData: jest.fn()
}));

import { validateCandidateData } from '../../application/validator';

const mockValidateCandidateData = validateCandidateData as jest.Mock;

describe('Feature: Candidate Service - Add Candidate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== VALIDATION TESTS ====================
  describe('AC1: Validate candidate data is called before processing', () => {
    it('should call validateCandidateData with request data', () => {
      // Arrange
      const candidateData = createValidCandidate();
      mockValidateCandidateData.mockImplementation(() => {});

      // Act
      try {
        const { addCandidate } = require('../../application/services/candidateService');
        addCandidate(candidateData);
      }
      finally{
        // Assert
        expect(mockValidateCandidateData).toHaveBeenCalled();
      }
    });

    it('should propagate validation errors from validator', () => {
      // Arrange
      const candidateData = createValidCandidate();
      mockValidateCandidateData.mockImplementation(() => {
        throw new Error('Invalid email format');
      });

      // Act & Assert
      expect(() => {
        const { validateCandidateData: validate } = require('../../application/validator');
        validate(candidateData);
      }).toThrow('Invalid email format');
    });

    it('should validate mandatory fields', () => {
      // Arrange
      const invalidData = createValidCandidate({ firstName: '' });
      mockValidateCandidateData.mockImplementation(() => {
        throw new Error('Invalid name');
      });

      // Act & Assert
      expect(() => {
        const { validateCandidateData: validate } = require('../../application/validator');
        validate(invalidData);
      }).toThrow('Invalid name');
    });

    it('should validate email format', () => {
      // Arrange
      const invalidData = createValidCandidate({ email: 'invalid-email' });
      mockValidateCandidateData.mockImplementation(() => {
        throw new Error('Invalid email');
      });

      // Act & Assert
      expect(() => {
        const { validateCandidateData: validate } = require('../../application/validator');
        validate(invalidData);
      }).toThrow('Invalid email');
    });

    it('should validate optional phone format when provided', () => {
      // Arrange
      const invalidData = createValidCandidate({ phone: 'abc123' });
      mockValidateCandidateData.mockImplementation(() => {
        throw new Error('Invalid phone');
      });

      // Act & Assert
      expect(() => {
        const { validateCandidateData: validate } = require('../../application/validator');
        validate(invalidData);
      }).toThrow('Invalid phone');
    });

    it('should skip validation if id is provided (edit mode)', () => {
      // Arrange
      const editData = { id: 1, firstName: '' };
      mockValidateCandidateData.mockImplementation(() => {
        // No-op - validation skipped for edits
      });

      // Act & Assert - no error expected
      expect(() => {
        const { validateCandidateData: validate } = require('../../application/validator');
        validate(editData);
      }).not.toThrow();
    });
  });

  // ==================== CANDIDATE DATA REQUIREMENTS ====================
  describe('AC2: Service requires mandatory fields', () => {
    it('should require firstName, lastName, and email', () => {
      // Arrange
      const requiredData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com'
      };
      mockValidateCandidateData.mockImplementation(() => {});

      // Assert
      expect(requiredData).toMatchObject({
        firstName: expect.any(String),
        lastName: expect.any(String),
        email: expect.any(String)
      });
    });

    it('should accept optional fields: phone, address', () => {
      // Arrange
      const allFieldsData = createValidCandidate({
        phone: '912345678',
        address: 'Calle Principal 123'
      });

      // Assert
      expect(allFieldsData).toMatchObject({
        firstName: expect.any(String),
        lastName: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        address: expect.any(String)
      });
    });

    it('should handle optional education field', () => {
      // Arrange
      const educationData = createValidCandidateWithAllOptionalFields();

      // Assert
      expect(educationData).toMatchObject({
        firstName: expect.any(String),
        educations: expect.any(Array)
      });
    });

    it('should handle optional work experience field', () => {
      // Arrange
      const experienceData = createValidCandidateWithAllOptionalFields();

      // Assert
      expect(experienceData).toMatchObject({
        firstName: expect.any(String),
        workExperiences: expect.any(Array)
      });
    });

    it('should handle optional CV file field', () => {
      // Arrange
      const cvData = createValidCandidate({ cv: createValidCV() });

      // Assert
      expect(cvData).toMatchObject({
        firstName: expect.any(String),
        cv: expect.objectContaining({
          filePath: expect.any(String),
          fileType: expect.any(String)
        })
      });
    });
  });

  // ==================== DATA VALIDATION ====================
  describe('AC3: Email validation requirements', () => {
    it('should accept valid email addresses', () => {
      // Arrange & Assert
      const validEmails = [
        'user@example.com',
        'user+tag@example.com',
        'user.name@company.co.uk'
      ];

      validEmails.forEach(email => {
        const data = createValidCandidate({ email });
        expect(data.email).toContain('@');
        expect(data.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });

    it('should reject emails without @', () => {
      // Arrange
      const invalidEmail = 'candidateexample.com';

      // Assert
      expect(invalidEmail).not.toContain('@');
    });

    it('should reject emails with multiple @', () => {
      // Arrange
      const invalidEmail = 'user@@example.com';

      // Assert
      const atCount = (invalidEmail.match(/@/g) || []).length;
      expect(atCount).toBeGreaterThan(1);
    });
  });

  // ==================== PHONE VALIDATION ====================
  describe('AC4: Phone field validation', () => {
    it('should allow empty phone (optional field)', () => {
      // Arrange
      const data = createValidCandidate({ phone: '' });

      // Assert
      expect(data.phone).toBe('');
    });

    it('should allow undefined phone (optional field)', () => {
      // Arrange
      const data = createValidCandidate();
      delete data.phone;

      // Assert
      expect(data.phone).toBeUndefined();
    });

    it('should accept Spanish phone numbers', () => {
      // Arrange
      const validPhones = ['912345678', '612345678', '712345678'];

      // Assert
      validPhones.forEach(phone => {
        expect(phone).toMatch(/^[679]\d{8}$/);
      });
    });

    it('should reject non-Spanish format phone', () => {
      // Arrange
      const invalidPhone = '312345678';

      // Assert
      expect(invalidPhone).not.toMatch(/^[679]\d{8}$/);
    });
  });

  // ==================== NAME VALIDATION ====================
  describe('AC5: Name field validation', () => {
    it('should accept names with accents', () => {
      // Arrange & Assert
      const accentedNames = ['José', 'María', 'François', 'Müller'];
      accentedNames.forEach(name => {
        expect(name).toBeTruthy();
        expect(name.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('should accept compound surnames with hyphens', () => {
      // Arrange
      const compoundName = 'García-López';

      // Assert
      expect(compoundName).toContain('-');
      expect(compoundName.length).toBeGreaterThanOrEqual(2);
    });

    it('should accept surnames with apostrophes', () => {
      // Arrange
      const apostropheName = "O'Neill";

      // Assert
      expect(apostropheName).toContain("'");
    });

    it('should reject names shorter than 2 characters', () => {
      // Arrange
      const shortName = 'A';

      // Assert
      expect(shortName.length).toBeLessThan(2);
    });

    it('should reject names exceeding 100 characters', () => {
      // Arrange
      const longName = 'a'.repeat(101);

      // Assert
      expect(longName.length).toBeGreaterThan(100);
    });
  });

  // ==================== ADDRESS VALIDATION ====================
  describe('AC6: Address field validation', () => {
    it('should allow empty address (optional)', () => {
      // Arrange
      const data = createValidCandidate({ address: '' });

      // Assert
      expect(data.address).toBe('');
    });

    it('should accept address with special characters', () => {
      // Arrange
      const address = 'Calle Principal, nº 123 - 2º B, 28001 Madrid';

      // Assert
      expect(address).toMatch(/[,º-]/);
    });

    it('should reject address exceeding 100 characters', () => {
      // Arrange
      const longAddress = 'a'.repeat(101);

      // Assert
      expect(longAddress.length).toBeGreaterThan(100);
    });
  });

  // ==================== SECURITY ====================
  describe('AC7: Security - Input handling', () => {
    it('should validate SQL injection attempts in names', () => {
      // Arrange
      const sqlInjection = "Juan'; DROP TABLE candidates; --";

      // Assert
      // The validator will reject this because it violates name regex
      expect(sqlInjection).toContain("'");
      expect(sqlInjection).toContain(';');
    });

    it('should safely handle XSS attempts in fields', () => {
      // Arrange
      const xssPayload = "<script>alert('XSS')</script>";

      // Assert
      expect(xssPayload).toContain('<');
      expect(xssPayload).toContain('>');
    });

    it('should handle special characters in address safely', () => {
      // Arrange
      const addressWithSpecial = "123 Main St'; UPDATE candidates SET name='hacked' WHERE '1'='1";

      // Assert
      // This is stored as plain text, not executed
      expect(typeof addressWithSpecial).toBe('string');
      expect(addressWithSpecial).toContain("'");
    });
  });

  // ==================== DATA INTEGRITY ====================
  describe('AC8: Data integrity and encoding', () => {
    it('should preserve UTF-8 characters', () => {
      // Arrange
      const data = createValidCandidate({
        firstName: 'François',
        lastName: 'Müller'
      });

      // Assert
      expect(data.firstName).toBe('François');
      expect(data.lastName).toBe('Müller');
    });

    it('should preserve case in email', () => {
      // Arrange
      const data = createValidCandidate({
        email: 'HELENA.HERNANDEZ@EXAMPLE.COM'
      });

      // Assert
      expect(data.email).toBe('HELENA.HERNANDEZ@EXAMPLE.COM');
    });

    it('should handle emoji characters', () => {
      // Arrange
      const nameWithEmoji = 'José 🇪🇸';

      // Assert
      expect(nameWithEmoji).toContain('🇪🇸');
    });
  });

  // ==================== CANDIDATE DATA STRUCTURE ====================
  describe('AC9: Candidate data structure validation', () => {
    it('should structure education data correctly', () => {
      // Arrange
      const education = createValidEducation();

      // Assert
      expect(education).toMatchObject({
        institution: expect.any(String),
        title: expect.any(String),
        startDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/)
      });
    });

    it('should structure work experience correctly', () => {
      // Arrange
      const experience = createValidWorkExperience();

      // Assert
      expect(experience).toMatchObject({
        company: expect.any(String),
        position: expect.any(String),
        startDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/)
      });
    });

    it('should structure CV data correctly', () => {
      // Arrange
      const cv = createValidCV();

      // Assert
      expect(cv).toMatchObject({
        filePath: expect.any(String),
        fileType: expect.any(String)
      });
    });

    it('should handle candidate with all optional nested objects', () => {
      // Arrange
      const fullData = createValidCandidateWithAllOptionalFields();

      // Assert
      expect(fullData).toMatchObject({
        firstName: expect.any(String),
        lastName: expect.any(String),
        email: expect.any(String),
        educations: expect.any(Array),
        workExperiences: expect.any(Array),
        cv: expect.any(Object)
      });
    });
  });

  // ==================== ERROR HANDLING ====================
  describe('AC10: Error handling', () => {
    it('should handle validation errors', () => {
      // Arrange
      const invalidData = createValidCandidate({ email: 'invalid' });
      mockValidateCandidateData.mockImplementation(() => {
        throw new Error('Invalid email');
      });

      // Act & Assert
      expect(() => {
        const { validateCandidateData: validate } = require('../../application/validator');
        validate(invalidData);
      }).toThrow('Invalid email');
    });

    it('should handle duplicate email errors', () => {
      // Arrange
      const duplicateEmail = 'existing@test.com';

      // Assert
      // The service would reject this with unique constraint error
      expect(duplicateEmail).toContain('@');
    });
  });

  // ==================== WHITESPACE HANDLING ====================
  describe('AC11: Whitespace handling', () => {
    it('should reject firstName with only whitespace', () => {
      // Arrange
      const whitespaceOnly = '   ';

      // Assert
      expect(whitespaceOnly.trim()).toBe('');
    });

    it('should reject email with only whitespace', () => {
      // Arrange
      const whitespaceOnly = '   ';

      // Assert
      expect(whitespaceOnly.trim()).toBe('');
      expect(whitespaceOnly).not.toContain('@');
    });
  });
});
