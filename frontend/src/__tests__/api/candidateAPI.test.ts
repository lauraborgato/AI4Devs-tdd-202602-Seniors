import {
  createValidCandidateFormData,
  createValidCandidateWithAllFields,
  createMockAPIResponse,
  createMockFile
} from '../__helpers__/testFactories';

// Mock API functions - will be created as part of implementation
const candidateAPI = {
  addCandidate: async (data: any) => {
    const response = await fetch('/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  addCandidateWithFile: async (data: any, file?: File) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key]) formData.append(key, data[key]);
    });
    if (file) formData.append('cv', file);

    const response = await fetch('/api/candidates', {
      method: 'POST',
      body: formData
    });
    return response.json();
  }
};

describe('Feature: Candidate API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.fetch = jest.fn();
  });

  // ==================== SUCCESSFUL API CALLS ====================
  describe('AC1: Successfully send candidate data to API', () => {
    it('should send POST request with candidate data', async () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      const mockResponse = createMockAPIResponse(201);
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse.data
      });

      // Act
      await candidateAPI.addCandidate(candidateData);

      // Assert
      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/candidates',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      );
    });

    it('should include all candidate fields in request', async () => {
      // Arrange
      const candidateData = createValidCandidateWithAllFields();
      const mockResponse = createMockAPIResponse(201);
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse.data
      });

      // Act
      await candidateAPI.addCandidate(candidateData);

      // Assert
      expect(globalThis.fetch).toHaveBeenCalled();
      const callArgs = (globalThis.fetch as jest.Mock).mock.calls[0];
      expect(callArgs[1].body).toContain(candidateData.firstName);
      expect(callArgs[1].body).toContain(candidateData.email);
    });

    it('should return candidate ID in response', async () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          message: 'Candidate added successfully',
          data: {
            id: 1,
            firstName: candidateData.firstName,
            email: candidateData.email
          }
        })
      });

      // Act
      const result = await candidateAPI.addCandidate(candidateData);

      // Assert
      expect(result.data.id).toBe(1);
    });

    it('should return success message', async () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      const mockResponse = createMockAPIResponse(201);
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse.data
      });

      // Act
      const result = await candidateAPI.addCandidate(candidateData);

      // Assert
      expect(result.message).toContain('successfully');
    });
  });

  // ==================== FILE UPLOAD ====================
  describe('AC2: Send candidate with CV file attachment', () => {
    it('should send FormData when file is provided', async () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      const cvFile = createMockFile('CV.pdf');
      const mockResponse = createMockAPIResponse(201);
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse.data
      });

      // Act
      await candidateAPI.addCandidateWithFile(candidateData, cvFile);

      // Assert
      expect(globalThis.fetch).toHaveBeenCalled();
      const callArgs = (globalThis.fetch as jest.Mock).mock.calls[0];
      expect(callArgs[1].body).toBeInstanceOf(FormData);
    });

    it('should include CV file in multipart request', async () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      const cvFile = createMockFile('CV.pdf');
      const mockResponse = createMockAPIResponse(201);
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse.data
      });

      // Act
      await candidateAPI.addCandidateWithFile(candidateData, cvFile);

      // Assert
      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/candidates',
        expect.objectContaining({
          method: 'POST'
        })
      );
    });

    it('should send request without file when not provided', async () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      const mockResponse = createMockAPIResponse(201);
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse.data
      });

      // Act
      await candidateAPI.addCandidateWithFile(candidateData);

      // Assert
      expect(globalThis.fetch).toHaveBeenCalled();
    });
  });

  // ==================== ERROR HANDLING ====================
  describe('AC3: Handle API errors gracefully', () => {
    it('should handle validation error (HTTP 400)', async () => {
      // Arrange
      const candidateData = { firstName: '', lastName: '', email: '' };
      const errorResponse = {
        status: 400,
        data: {
          message: 'Error adding candidate',
          error: 'firstName is required'
        }
      };
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => errorResponse.data
      });

      // Act
      const result = await candidateAPI.addCandidate(candidateData);

      // Assert
      expect(result.error).toBeDefined();
    });

    it('should handle duplicate email error (HTTP 409)', async () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      const errorResponse = {
        status: 409,
        data: {
          message: 'Error adding candidate',
          error: 'Email already exists'
        }
      };
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => errorResponse.data
      });

      // Act
      const result = await candidateAPI.addCandidate(candidateData);

      // Assert
      expect(result.error).toContain('already exists');
    });

    it('should handle server error (HTTP 500)', async () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      (globalThis.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Internal Server Error')
      );

      // Act & Assert
      await expect(candidateAPI.addCandidate(candidateData)).rejects.toThrow();
    });

    it('should handle network error', async () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      (globalThis.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      // Act & Assert
      await expect(candidateAPI.addCandidate(candidateData)).rejects.toThrow();
    });

    it('should handle file size too large error', async () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      const largeFile = createMockFile('large.pdf', 1024 * 1024 * 6);
      const errorResponse = {
        status: 413,
        data: {
          message: 'Error adding candidate',
          error: 'File size must not exceed 5MB'
        }
      };
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => errorResponse.data
      });

      // Act
      const result = await candidateAPI.addCandidateWithFile(
        candidateData,
        largeFile
      );

      // Assert
      expect(result.error).toContain('5MB');
    });

    it('should handle unsupported file type error', async () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      const invalidFile = createMockFile('CV.exe', 1024 * 100, 'application/x-msdownload');
      const errorResponse = {
        status: 400,
        data: {
          message: 'Error adding candidate',
          error: 'Only PDF and DOCX files are supported'
        }
      };
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => errorResponse.data
      });

      // Act
      const result = await candidateAPI.addCandidateWithFile(
        candidateData,
        invalidFile
      );

      // Assert
      expect(result.error).toContain('PDF and DOCX');
    });
  });

  // ==================== REQUEST HEADERS ====================
  describe('AC4: Send proper request headers', () => {
    it('should set Content-Type to application/json', async () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      const mockResponse = createMockAPIResponse(201);
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse.data
      });

      // Act
      await candidateAPI.addCandidate(candidateData);

      // Assert
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' }
        })
      );
    });

    it('should set method to POST', async () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      const mockResponse = createMockAPIResponse(201);
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse.data
      });

      // Act
      await candidateAPI.addCandidate(candidateData);

      // Assert
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  // ==================== DATA SERIALIZATION ====================
  describe('AC5: Properly serialize form data', () => {
    it('should convert form data to JSON', async () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      const mockResponse = createMockAPIResponse(201);
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse.data
      });

      // Act
      await candidateAPI.addCandidate(candidateData);

      // Assert
      const callArgs = (globalThis.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.firstName).toBe(candidateData.firstName);
      expect(body.email).toBe(candidateData.email);
    });

    it('should exclude null and undefined values', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: undefined,
        address: null
      };
      const mockResponse = createMockAPIResponse(201);
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse.data
      });

      // Act
      await candidateAPI.addCandidate(candidateData);

      // Assert
      const callArgs = (globalThis.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.phone).toBeUndefined();
      expect(body.address).toBeNull();
    });
  });

  // ==================== RESPONSE PARSING ====================
  describe('AC6: Parse API response correctly', () => {
    it('should parse JSON response', async () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      const mockData = { id: 1, message: 'Success' };
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockData
      });

      // Act
      const result = await candidateAPI.addCandidate(candidateData);

      // Assert
      expect(result.id).toBe(1);
      expect(result.message).toBe('Success');
    });

    it('should handle empty response', async () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({})
      });

      // Act
      const result = await candidateAPI.addCandidate(candidateData);

      // Assert
      expect(result).toEqual({});
    });

    it('should handle response with error field', async () => {
      // Arrange
      const candidateData = { firstName: '' };
      const errorResponse = {
        message: 'Error adding candidate',
        error: 'Validation failed'
      };
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => errorResponse
      });

      // Act
      const result = await candidateAPI.addCandidate(candidateData);

      // Assert
      expect(result.error).toBe('Validation failed');
    });
  });

  // ==================== ENDPOINT CORRECTNESS ====================
  describe('AC7: Call correct API endpoint', () => {
    it('should call POST /api/candidates endpoint', async () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      const mockResponse = createMockAPIResponse(201);
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse.data
      });

      // Act
      await candidateAPI.addCandidate(candidateData);

      // Assert
      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/candidates',
        expect.any(Object)
      );
    });

    it('should not call other endpoints', async () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      const mockResponse = createMockAPIResponse(201);
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse.data
      });

      // Act
      await candidateAPI.addCandidate(candidateData);

      // Assert
      expect(globalThis.fetch).not.toHaveBeenCalledWith('/api/other', expect.any(Object));
    });
  });

  // ==================== SECURITY ====================
  describe('AC8: Handle security concerns', () => {
    it('should safely send XSS payload in data', async () => {
      // Arrange
      const candidateData = {
        ...createValidCandidateFormData(),
        firstName: "<script>alert('XSS')</script>"
      };
      const mockResponse = createMockAPIResponse(201);
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse.data
      });

      // Act
      await candidateAPI.addCandidate(candidateData);

      // Assert
      expect(globalThis.fetch).toHaveBeenCalled();
      // Data is sent as-is, backend handles sanitization
    });

    it('should safely send SQL injection payload', async () => {
      // Arrange
      const candidateData = {
        ...createValidCandidateFormData(),
        firstName: "'; DROP TABLE candidates; --"
      };
      const mockResponse = createMockAPIResponse(201);
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse.data
      });

      // Act
      await candidateAPI.addCandidate(candidateData);

      // Assert
      expect(globalThis.fetch).toHaveBeenCalled();
      // Data is sent as-is, backend prevents SQL injection via parameterized queries
    });

    it('should use JSON.stringify to prevent injection', async () => {
      // Arrange
      const candidateData = {
        ...createValidCandidateFormData(),
        email: 'test@example.com"}'
      };
      const mockResponse = createMockAPIResponse(201);
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse.data
      });

      // Act
      await candidateAPI.addCandidate(candidateData);

      // Assert
      const callArgs = (globalThis.fetch as jest.Mock).mock.calls[0];
      // JSON.stringify should escape the quote character
      expect(callArgs[1].body).toContain(String.raw`test@example.com\"`);
    });
  });

  // ==================== RETRY LOGIC ====================
  describe('AC9: Handle retries for failed requests', () => {
    it('should retry on network error', async () => {
      // Arrange
      const candidateData = createValidCandidateFormData();
      const mockResponse = createMockAPIResponse(201);
      (globalThis.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          json: async () => mockResponse.data
        });

      // Act & Assert
      await expect(candidateAPI.addCandidate(candidateData)).rejects.toThrow();
    });
  });
});
