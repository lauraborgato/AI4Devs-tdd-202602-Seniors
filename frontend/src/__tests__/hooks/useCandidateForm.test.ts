import React, { act } from 'react';
import { renderHook } from '@testing-library/react';
import {
  createValidCandidateFormData,
  validTestEmails,
  invalidTestEmails,
  validPhoneNumbers,
  invalidPhoneNumbers
} from '../__helpers__/testFactories';

// Mock hook - will be created as part of implementation
const useCandidateForm = (initialData: any = {}) => {
  const [formData, setFormData] = React.useState(initialData);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.firstName || formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name is required (minimum 2 characters)';
    }

    if (!formData.lastName || formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name is required (minimum 2 characters)';
    }

    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }

    if (formData.phone && !/^[679]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setFormData(initialData);
    setErrors({});
  };

  return {
    formData,
    errors,
    validateForm,
    updateField,
    reset
  };
};

describe('Feature: Form Validation Hook (useCandidateForm)', () => {
  // ==================== FORM DATA MANAGEMENT ====================
  describe('AC1: Hook manages form data state', () => {
    it('should initialize with provided data', () => {
      // Arrange
      const initialData = createValidCandidateFormData();

      // Act
      const { result } = renderHook(() => useCandidateForm(initialData));

      // Assert
      expect(result.current.formData).toMatchObject(initialData);
    });

    it('should update field value', () => {
      // Arrange
      const { result } = renderHook(() => useCandidateForm({}));

      // Act
      act(() => {
        result.current.updateField('firstName', 'Juan');
      });

      // Assert
      expect(result.current.formData.firstName).toBe('Juan');
    });

    it('should update multiple fields independently', () => {
      // Arrange
      const { result } = renderHook(() => useCandidateForm({}));

      // Act
      act(() => {
        result.current.updateField('firstName', 'Juan');
        result.current.updateField('lastName', 'Pérez');
        result.current.updateField('email', 'juan@example.com');
      });

      // Assert
      expect(result.current.formData.firstName).toBe('Juan');
      expect(result.current.formData.lastName).toBe('Pérez');
      expect(result.current.formData.email).toBe('juan@example.com');
    });

    it('should reset form to initial state', () => {
      // Arrange
      const initialData = createValidCandidateFormData();
      const { result } = renderHook(() => useCandidateForm(initialData));

      // Act
      act(() => {
        result.current.updateField('firstName', 'Modified');
        result.current.reset();
      });

      // Assert
      expect(result.current.formData.firstName).toBe(initialData.firstName);
    });

    it('should clear errors on reset', () => {
      // Arrange
      const { result } = renderHook(() => useCandidateForm({}));

      // Act
      act(() => {
        result.current.updateField('firstName', '');
        result.current.validateForm();
      });

      expect(result.current.errors.firstName).toBeDefined();

      act(() => {
        result.current.reset();
      });

      // Assert
      expect(Object.keys(result.current.errors).length).toBe(0);
    });
  });

  // ==================== MANDATORY FIELD VALIDATION ====================
  describe('AC2: Hook validates mandatory fields', () => {
    it('should reject when firstName is empty', () => {
      // Arrange
      const { result } = renderHook(() => useCandidateForm({ firstName: '' }));

      // Act
      act(() => {
        result.current.validateForm();
      });

      // Assert
      expect(result.current.errors.firstName).toBeDefined();
    });

    it('should reject when lastName is empty', () => {
      // Arrange
      const { result } = renderHook(() => useCandidateForm({ lastName: '' }));

      // Act
      act(() => {
        result.current.validateForm();
      });

      // Assert
      expect(result.current.errors.lastName).toBeDefined();
    });

    it('should reject when email is empty', () => {
      // Arrange
      const { result } = renderHook(() => useCandidateForm({ email: '' }));

      // Act
      act(() => {
        result.current.validateForm();
      });

      // Assert
      expect(result.current.errors.email).toBeDefined();
    });

    it('should reject firstName less than 2 characters', () => {
      // Arrange
      const { result } = renderHook(() => useCandidateForm({ firstName: 'A' }));

      // Act
      act(() => {
        result.current.validateForm();
      });

      // Assert
      expect(result.current.errors.firstName).toBeDefined();
    });

    it('should accept valid mandatory fields', () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      const { result } = renderHook(() => useCandidateForm(candidateData));

      // Act
      act(() => {
        result.current.validateForm();
      });

      // Assert
      expect(result.current.errors.firstName).toBeUndefined();
      expect(result.current.errors.lastName).toBeUndefined();
      expect(result.current.errors.email).toBeUndefined();
    });
  });

  // ==================== EMAIL VALIDATION ====================
  describe('AC3: Hook validates email format', () => {
    validTestEmails.forEach(email => {
      it(`should accept email: ${email}`, () => {
        // Arrange
        const { result } = renderHook(() =>
          useCandidateForm(createValidCandidateFormData({ email }))
        );

        // Act
        act(() => {
          result.current.validateForm();
        });

        // Assert
        expect(result.current.errors.email).toBeUndefined();
      });
    });

    invalidTestEmails.forEach(email => {
      it(`should reject invalid email: ${email}`, () => {
        // Arrange
        const { result } = renderHook(() =>
          useCandidateForm(createValidCandidateFormData({ email }))
        );

        // Act
        act(() => {
          result.current.validateForm();
        });

        // Assert
        expect(result.current.errors.email).toBeDefined();
      });
    });

    it('should reject email without @ symbol', () => {
      // Arrange
      const { result } = renderHook(() =>
        useCandidateForm(createValidCandidateFormData({ email: 'invalid' }))
      );

      // Act
      act(() => {
        result.current.validateForm();
      });

      // Assert
      expect(result.current.errors.email).toBeDefined();
    });
  });

  // ==================== PHONE VALIDATION ====================
  describe('AC4: Hook validates phone format', () => {
    validPhoneNumbers.forEach(phone => {
      it(`should accept phone: ${phone}`, () => {
        // Arrange
        const { result } = renderHook(() =>
          useCandidateForm(createValidCandidateFormData({ phone }))
        );

        // Act
        act(() => {
          result.current.validateForm();
        });

        // Assert
        expect(result.current.errors.phone).toBeUndefined();
      });
    });

    invalidPhoneNumbers.forEach(phone => {
      it(`should reject invalid phone: ${phone}`, () => {
        // Arrange
        const { result } = renderHook(() =>
          useCandidateForm(createValidCandidateFormData({ phone }))
        );

        // Act
        act(() => {
          result.current.validateForm();
        });

        // Assert
        expect(result.current.errors.phone).toBeDefined();
      });
    });

    it('should allow empty phone (optional)', () => {
      // Arrange
      const { result } = renderHook(() =>
        useCandidateForm(createValidCandidateFormData({ phone: '' }))
      );

      // Act
      act(() => {
        result.current.validateForm();
      });

      // Assert
      expect(result.current.errors.phone).toBeUndefined();
    });
  });

  // ==================== OPTIONAL FIELDS ====================
  describe('AC5: Hook handles optional fields', () => {
    it('should allow submission without address', () => {
      // Arrange
      const { result } = renderHook(() =>
        useCandidateForm({
          ...createValidCandidateFormData(),
          address: ''
        })
      );

      // Act
      act(() => {
        result.current.validateForm();
      });

      // Assert
      expect(result.current.errors.address).toBeUndefined();
    });

    it('should allow submission without education', () => {
      // Arrange
      const { result } = renderHook(() =>
        useCandidateForm({
          ...createValidCandidateFormData(),
          education: ''
        })
      );

      // Act
      act(() => {
        result.current.validateForm();
      });

      // Assert
      expect(result.current.errors.education).toBeUndefined();
    });

    it('should allow submission without experience', () => {
      // Arrange
      const { result } = renderHook(() =>
        useCandidateForm({
          ...createValidCandidateFormData(),
          experience: ''
        })
      );

      // Act
      act(() => {
        result.current.validateForm();
      });

      // Assert
      expect(result.current.errors.experience).toBeUndefined();
    });

    it('should allow submission without CV', () => {
      // Arrange
      const { result } = renderHook(() =>
        useCandidateForm({
          ...createValidCandidateFormData(),
          cv: null
        })
      );

      // Act
      act(() => {
        result.current.validateForm();
      });

      // Assert
      expect(result.current.errors.cv).toBeUndefined();
    });
  });

  // ==================== ERROR STATE ====================
  describe('AC6: Hook manages error state', () => {
    it('should track validation errors', () => {
      // Arrange
      const { result } = renderHook(() => useCandidateForm({}));

      // Act
      act(() => {
        result.current.validateForm();
      });

      // Assert
      expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
    });

    it('should clear errors for valid fields', () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      const { result } = renderHook(() => useCandidateForm(candidateData));

      // Act
      act(() => {
        result.current.validateForm();
      });

      // Assert
      expect(Object.keys(result.current.errors).length).toBe(0);
    });

    it('should update errors on field change', () => {
      // Arrange
      const initialData = createValidCandidateFormData();
      initialData.firstName = '';
      const { result } = renderHook(() => useCandidateForm(initialData));

      // Act - validate with empty firstName
      act(() => {
        result.current.validateForm();
      });

      // First assertion: error exists
      expect(result.current.errors.firstName).toBeDefined();

      // Update firstName to valid value
      act(() => {
        result.current.updateField('firstName', 'Juan');
      });

      // Validate again
      act(() => {
        result.current.validateForm();
      });

      // Assert - error should be cleared
      expect(result.current.formData.firstName).toBe('Juan');
      expect(result.current.errors.firstName).toBeUndefined();
    });
  });

  // ==================== WHITESPACE HANDLING ====================
  describe('AC7: Hook trims whitespace from fields', () => {
    it('should reject firstName with only whitespace', () => {
      // Arrange
      const { result } = renderHook(() =>
        useCandidateForm({ firstName: '   ' })
      );

      // Act
      act(() => {
        result.current.validateForm();
      });

      // Assert
      expect(result.current.errors.firstName).toBeDefined();
    });

    it('should trim leading/trailing whitespace', () => {
      // Arrange
      const { result } = renderHook(() =>
        useCandidateForm({ firstName: '  Juan  ' })
      );

      // Act
      act(() => {
        result.current.validateForm();
      });

      // Assert
      expect(result.current.errors.firstName).toBeUndefined();
    });
  });
});
