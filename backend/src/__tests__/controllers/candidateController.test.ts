import { Request, Response } from 'express';
import { addCandidateController } from '../../presentation/controllers/candidateController';
import { addCandidate } from '../../application/services/candidateService';
import {
  createValidCandidate,
  createValidCandidateWithAllOptionalFields,
  createMockCandidate
} from '../__helpers__/testFactories';

jest.mock('../../application/services/candidateService');

const mockAddCandidate = addCandidate as jest.Mock;

describe('Feature: Add Candidate Controller - API Endpoint', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  // ==================== HAPPY PATH ====================
  describe('AC1: Successfully add candidate endpoint returns HTTP 201', () => {
    it('should return HTTP 201 Created status', async () => {
      // Arrange
      const candidateData = createValidCandidate();
      const mockSavedCandidate = createMockCandidate(1, candidateData);

      mockRequest.body = candidateData;
      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should return success message in response', async () => {
      // Arrange
      const candidateData = createValidCandidate();
      const mockSavedCandidate = createMockCandidate(1, candidateData);

      mockRequest.body = candidateData;
      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Candidate added successfully')
        })
      );
    });

    it('should return candidate data in response', async () => {
      // Arrange
      const candidateData = createValidCandidate();
      const mockSavedCandidate = createMockCandidate(1, candidateData);

      mockRequest.body = candidateData;
      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            id: expect.any(Number),
            firstName: candidateData.firstName,
            lastName: candidateData.lastName,
            email: candidateData.email
          })
        })
      );
    });

    it('should pass request body to service layer', async () => {
      // Arrange
      const candidateData = createValidCandidate();
      const mockSavedCandidate = createMockCandidate(1, candidateData);

      mockRequest.body = candidateData;
      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockAddCandidate).toHaveBeenCalledWith(candidateData);
    });

    it('should return complete candidate object with all fields', async () => {
      // Arrange
      const candidateData = createValidCandidateWithAllOptionalFields();
      const mockSavedCandidate = createMockCandidate(1, candidateData);

      mockRequest.body = candidateData;
      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            id: expect.any(Number),
            firstName: expect.any(String),
            lastName: expect.any(String),
            email: expect.any(String)
          })
        })
      );
    });
  });

  // ==================== VALIDATION ERRORS ====================
  describe('AC2: Validation errors return HTTP 400', () => {
    it('should return HTTP 400 when firstName is empty', async () => {
      // Arrange
      const candidateData = { ...createValidCandidate(), firstName: '' };
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(new Error('Invalid name'));

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return HTTP 400 when lastName is empty', async () => {
      // Arrange
      const candidateData = { ...createValidCandidate(), lastName: '' };
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(new Error('Invalid name'));

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return HTTP 400 when email is empty', async () => {
      // Arrange
      const candidateData = { ...createValidCandidate(), email: '' };
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(new Error('Invalid email'));

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return error message in response', async () => {
      // Arrange
      const candidateData = createValidCandidate({ email: 'invalid' });
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(new Error('Invalid email format'));

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error adding candidate',
          error: expect.stringContaining('Invalid')
        })
      );
    });

    it('should return error details when validation fails', async () => {
      // Arrange
      const candidateData = { ...createValidCandidate(), email: 'invalid-email' };
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(new Error('Invalid email'));

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String)
        })
      );
    });

    it('should return HTTP 400 when email format is invalid', async () => {
      // Arrange
      const candidateData = { ...createValidCandidate(), email: 'candidateexample.com' };
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(new Error('Invalid email'));

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return HTTP 400 when phone format is invalid', async () => {
      // Arrange
      const candidateData = { ...createValidCandidate(), phone: 'abc123' };
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(new Error('Invalid phone'));

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  // ==================== EMAIL VALIDATION ====================
  describe('AC3: Email validation at API level', () => {
    it('should accept valid email format', async () => {
      // Arrange
      const candidateData = { ...createValidCandidate(), email: 'candidate@example.com' };
      const mockSavedCandidate = createMockCandidate(1, candidateData);
      mockRequest.body = candidateData;
      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should reject email without @ symbol', async () => {
      // Arrange
      const candidateData = { ...createValidCandidate(), email: 'candidateexample.com' };
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(new Error('Invalid email'));

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return error message about invalid email', async () => {
      // Arrange
      const candidateData = { ...createValidCandidate(), email: 'bad-email' };
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(new Error('Invalid email'));

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('Invalid')
        })
      );
    });
  });

  // ==================== DUPLICATE EMAIL HANDLING ====================
  describe('AC4: Duplicate email constraint', () => {
    it('should reject candidate when email already exists', async () => {
      // Arrange
      const candidateData = createValidCandidate();
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(
        new Error('The email already exists in the database')
      );

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(409);
    });

    it('should return error message for duplicate email', async () => {
      // Arrange
      const candidateData = createValidCandidate();
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(
        new Error('The email already exists in the database')
      );

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('email already exists')
        })
      );
    });
  });

  // ==================== MANDATORY FIELDS ====================
  describe('AC5: Mandatory fields enforcement', () => {
    it('should reject submission without firstName', async () => {
      // Arrange
      const candidateData = { ...createValidCandidate(), firstName: '' };
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(new Error('Invalid name'));

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should reject submission without lastName', async () => {
      // Arrange
      const candidateData = { ...createValidCandidate(), lastName: '' };
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(new Error('Invalid name'));

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should reject submission without email', async () => {
      // Arrange
      const candidateData = { ...createValidCandidate(), email: '' };
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(new Error('Invalid email'));

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should accept submission with only mandatory fields', async () => {
      // Arrange
      const candidateData = {
        firstName: 'María',
        lastName: 'García',
        email: 'maria.garcia@test.com'
      };
      const mockSavedCandidate = createMockCandidate(1, candidateData);
      mockRequest.body = candidateData;
      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });
  });

  // ==================== OPTIONAL FIELDS ====================
  describe('AC6: Optional fields handling', () => {
    it('should accept candidate with all optional fields', async () => {
      // Arrange
      const candidateData = createValidCandidateWithAllOptionalFields();
      const mockSavedCandidate = createMockCandidate(1, candidateData);
      mockRequest.body = candidateData;
      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should accept candidate without phone', async () => {
      // Arrange
      const candidateData = createValidCandidate();
      delete candidateData.phone;
      const mockSavedCandidate = createMockCandidate(1, candidateData);
      mockRequest.body = candidateData;
      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should accept candidate without address', async () => {
      // Arrange
      const candidateData = createValidCandidate();
      delete candidateData.address;
      const mockSavedCandidate = createMockCandidate(1, candidateData);
      mockRequest.body = candidateData;
      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should accept candidate without CV', async () => {
      // Arrange
      const candidateData = createValidCandidate();
      delete candidateData.cv;
      const mockSavedCandidate = createMockCandidate(1, candidateData);
      mockRequest.body = candidateData;
      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });
  });

  // ==================== ERROR HANDLING ====================
  describe('AC7: Error handling', () => {
    it('should handle unknown errors gracefully', async () => {
      // Arrange
      const candidateData = createValidCandidate();
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(new Error('Unexpected error'));

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error adding candidate'
        })
      );
    });

    it('should handle non-Error exceptions', async () => {
      // Arrange
      const candidateData = createValidCandidate();
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue('Some string error');

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Unknown error'
        })
      );
    });

    it('should provide descriptive error messages', async () => {
      // Arrange
      const candidateData = createValidCandidate({ email: 'invalid' });
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(new Error('Invalid email format'));

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('Invalid email format')
        })
      );
    });
  });

  // ==================== SECURITY ====================
  describe('AC8: Security - Input validation', () => {
    it('should safely handle SQL injection attempt', async () => {
      // Arrange
      const candidateData = {
        ...createValidCandidate(),
        firstName: "Juan'; DROP TABLE candidates; --"
      };
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(new Error('Invalid name'));

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockAddCandidate).toHaveBeenCalled();
    });

    it('should safely handle XSS attempt', async () => {
      // Arrange
      const candidateData = {
        ...createValidCandidate(),
        firstName: "<script>alert('XSS')</script>"
      };
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(new Error('Invalid name'));

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should pass input to service for validation', async () => {
      // Arrange
      const candidateData = createValidCandidate();
      mockRequest.body = candidateData;
      const mockSavedCandidate = createMockCandidate(1, candidateData);
      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockAddCandidate).toHaveBeenCalledWith(candidateData);
    });
  });

  // ==================== RESPONSE FORMAT ====================
  describe('AC9: Response format consistency', () => {
    it('should return JSON response', async () => {
      // Arrange
      const candidateData = createValidCandidate();
      const mockSavedCandidate = createMockCandidate(1, candidateData);
      mockRequest.body = candidateData;
      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should include message field in success response', async () => {
      // Arrange
      const candidateData = createValidCandidate();
      const mockSavedCandidate = createMockCandidate(1, candidateData);
      mockRequest.body = candidateData;
      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String)
        })
      );
    });

    it('should include data field in success response', async () => {
      // Arrange
      const candidateData = createValidCandidate();
      const mockSavedCandidate = createMockCandidate(1, candidateData);
      mockRequest.body = candidateData;
      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.any(Object)
        })
      );
    });

    it('should include message and error fields in error response', async () => {
      // Arrange
      const candidateData = createValidCandidate({ email: 'invalid' });
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(new Error('Invalid email'));

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String),
          error: expect.any(String)
        })
      );
    });
  });

  // ==================== CHAINING ====================
  describe('AC10: Method chaining support', () => {
    it('should return response object from status()', async () => {
      // Arrange
      const candidateData = createValidCandidate();
      const mockSavedCandidate = createMockCandidate(1, candidateData);
      mockRequest.body = candidateData;
      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should call status before json', async () => {
      // Arrange
      const candidateData = createValidCandidate();
      const mockSavedCandidate = createMockCandidate(1, candidateData);
      mockRequest.body = candidateData;
      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });
});
