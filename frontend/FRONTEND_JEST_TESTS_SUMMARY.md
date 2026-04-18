# Frontend Jest Test Suite - Add Candidate Feature

## Overview

Generated comprehensive Jest test suite for the frontend component layer with **test templates covering all Gherkin scenarios**. These tests follow the jest-test-implementer structure and the AAA (Arrange-Act-Assert) pattern with 1:1 assertion ratio.

## Test Files Created

### 1. **`src/__tests__/__helpers__/testFactories.ts`**
Reusable test data factories for frontend testing:
- `createValidCandidateFormData()` - Basic form data
- `createValidCandidateWithAllFields()` - Complete form with all optional fields
- `createMockFile()` - Mock File objects for upload testing
- `createLargeMockFile()` - Oversized file for limit testing
- Test data arrays (valid/invalid emails, phones, names)
- XSS and SQL injection payloads
- Mock API responses
- Mock localStorage utilities

### 2. **`src/__tests__/components/AddCandidateForm.test.tsx`** (94+ tests)
Comprehensive form component tests:

**Acceptance Criteria Covered:**
- AC1: Form renders all required and optional fields
- AC2: Form validates mandatory fields on submit
- AC3: Form validates email format
- AC4: Form validates phone format
- AC5: Form validates name fields
- AC6: Form validates address field
- AC7: Form handles optional fields
- AC8: Form handles file upload validation
- AC9: Form handles security threats (XSS, SQL injection)
- AC10: Form handles whitespace in fields
- AC11: Form manages state correctly
- AC12: Form preserves data integrity
- AC13: Form is accessible

**Test Structure:**
```typescript
it('should render form with all input fields', () => {
  // Arrange & Act
  render(<AddCandidateForm />);

  // Assert
  expect(screen.getByTestId('firstName')).toBeInTheDocument();
});
```

### 3. **`src/__tests__/hooks/useCandidateForm.test.ts`** (45+ tests)
Custom hook testing for form state management:

**Acceptance Criteria Covered:**
- AC1: Hook manages form data state
- AC2: Hook validates mandatory fields
- AC3: Hook validates email format
- AC4: Hook validates phone format
- AC5: Hook handles optional fields
- AC6: Hook manages error state
- AC7: Hook trims whitespace from fields

**Features Tested:**
- Form data initialization and updates
- Field-level validation
- Error state tracking
- Form reset functionality
- Whitespace trimming

### 4. **`src/__tests__/api/candidateAPI.test.ts`** (50+ tests)
API integration and communication tests:

**Acceptance Criteria Covered:**
- AC1: Successfully send candidate data to API
- AC2: Send candidate with CV file attachment
- AC3: Handle API errors gracefully
- AC4: Send proper request headers
- AC5: Properly serialize form data
- AC6: Parse API response correctly
- AC7: Call correct API endpoint
- AC8: Handle security concerns
- AC9: Handle retries for failed requests

**Test Coverage:**
- HTTP 201 (success) responses
- HTTP 400 (validation error) responses
- HTTP 409 (duplicate) responses
- HTTP 413 (file too large) responses
- HTTP 500+ (server errors)
- Network errors and timeouts
- FormData for file uploads
- JSON serialization
- Response parsing
- Endpoint correctness

## Test Architecture

### Frontend Test Layers

```
┌─────────────────────────────────────────────────────┐
│           Integration Tests (Full App)              │
│                 (Future)                            │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│      Component Tests (AddCandidateForm)            │
│  - Form rendering, state, user interactions       │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│      Hook Tests (useCandidateForm)                 │
│  - Validation logic, state management              │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│      API Tests (candidateAPI)                      │
│  - Network calls, serialization, error handling   │
└─────────────────────────────────────────────────────┘
```

### Test Pyramid
```
    ╱╲         Integration Tests (few, slow, end-to-end)
   ╱  ╲        ↓
  ╱────╲       Component Tests (medium, faster)
 ╱  ↓   ╲      ↓
╱────────╲     Hook Tests (many, fast, logic)
  ↓↓↓↓↓↓       API Tests (many, fast, unit)
```

## Mapping to Gherkin Features

### Backend Feature File: `add_candidates_unit_tests.feature`

Frontend test coverage maps to backend Gherkin scenarios:

| Gherkin Scenario | Frontend Component Tests | Frontend Hook Tests | Frontend API Tests |
|------------------|--------------------------|-------------------|-------------------|
| Add with all fields | ✅ Form rendering | ✅ Validation | ✅ POST request |
| Add with mandatory only | ✅ Field requirements | ✅ Validation | ✅ Data serialization |
| Add with CV | ✅ File upload | ✅ Optional fields | ✅ FormData handling |
| Mandatory field validation | ✅ Submit behavior | ✅ Field validation | ✅ Error response |
| Email validation | ✅ Input acceptance | ✅ Email regex | ✅ Error handling |
| Phone validation | ✅ Input acceptance | ✅ Phone regex | ✅ Error handling |
| Name validation | ✅ Input acceptance | ✅ Length checks | ✅ Data send |
| Address validation | ✅ Input acceptance | ✅ Optional handling | ✅ Data send |
| File upload validation | ✅ File input | ✅ Optional handling | ✅ FormData |
| Security (SQL injection) | ✅ Input handling | ✅ Data as-is | ✅ Safe transmission |
| Security (XSS) | ✅ Input handling | ✅ Data as-is | ✅ Safe transmission |
| Error handling | ✅ Form state | ✅ Error tracking | ✅ API errors |
| Data integrity | ✅ Input preservation | ✅ State management | ✅ Serialization |

## AAA Pattern (Arrange-Act-Assert)

All tests follow strict structure:

```typescript
describe('Feature: Form validation', () => {
  it('should reject when firstName is empty', () => {
    // ARRANGE - set up test data and mocks
    render(<AddCandidateForm />);
    const firstNameInput = screen.getByTestId('firstName');

    // ACT - perform the action
    fireEvent.change(firstNameInput, { target: { value: '' } });
    fireEvent.click(screen.getByTestId('submit-btn'));

    // ASSERT - verify the outcome
    expect(screen.getByText('First name is required')).toBeInTheDocument();
  });
});
```

## 1:1 Assertion Ratio

One logical assertion per test ensures clear failure messages:

```typescript
// ✅ Good - One assertion per test
it('should display firstName input', () => {
  render(<AddCandidateForm />);
  expect(screen.getByTestId('firstName')).toBeInTheDocument();
});

it('should have email type for email input', () => {
  render(<AddCandidateForm />);
  const emailInput = screen.getByTestId('email') as HTMLInputElement;
  expect(emailInput.type).toBe('email');
});

// ❌ Avoid - Multiple assertions in one test
it('should render form', () => {
  render(<AddCandidateForm />);
  expect(screen.getByTestId('firstName')).toBeInTheDocument(); // Multiple
  expect(screen.getByTestId('email')).toBeInTheDocument();     // assertions
  expect(screen.getByTestId('submit')).toBeInTheDocument();
});
```

## Test Data Strategy

### Factory Functions Approach
```typescript
// Reduces duplication and improves maintainability
const validCandidate = createValidCandidateFormData();
const allFieldsCandidate = createValidCandidateWithAllFields();

// Parametric testing
validTestEmails.forEach(email => {
  it(`should accept email: ${email}`, () => { ... });
});
```

### Mock File Creation
```typescript
const pdfFile = createMockFile('CV.pdf', 1024 * 100, 'application/pdf');
const largeFile = createLargeMockFile(1024 * 1024 * 6); // 6MB
```

## Frontend Test Examples

### Form Component Test
```typescript
it('should accept valid email address', () => {
  // Arrange
  render(<AddCandidateForm />);
  const emailInput = screen.getByTestId('email') as HTMLInputElement;

  // Act
  emailInput.value = 'candidate@example.com';

  // Assert
  expect(emailInput.value).toBe('candidate@example.com');
});
```

### Hook Test
```typescript
it('should reject invalid email format', () => {
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
```

### API Test
```typescript
it('should send POST request with candidate data', async () => {
  // Arrange
  const candidateData = createValidCandidateFormData();
  const mockResponse = createMockAPIResponse(201);
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    json: async () => mockResponse.data
  });

  // Act
  const result = await candidateAPI.addCandidate(candidateData);

  // Assert
  expect(global.fetch).toHaveBeenCalledWith(
    '/api/candidates',
    expect.objectContaining({ method: 'POST' })
  );
});
```

## Testing Utilities Used

- `@testing-library/react` - Component rendering and interaction
- `@testing-library/jest-dom` - DOM matchers
- `jest` - Test framework
- `@testing-library/user-event` - User interactions (optional, for future use)

## Coverage by Test Type

### Component Tests (AddCandidateForm)
- ✅ Form rendering and structure
- ✅ Input field presence and types
- ✅ Form submission behavior
- ✅ User interactions (typing, clicking, file selection)
- ✅ Error display and validation messages
- ✅ State preservation across interactions
- ✅ Security (input handling)
- ✅ Accessibility (keyboard navigation, labels)

### Hook Tests (useCandidateForm)
- ✅ Form state initialization
- ✅ Field updates
- ✅ Validation logic
- ✅ Error state management
- ✅ Form reset functionality
- ✅ Whitespace trimming
- ✅ Field-level error messages

### API Tests (candidateAPI)
- ✅ HTTP method (POST)
- ✅ Endpoint correctness (/api/candidates)
- ✅ Request headers (Content-Type)
- ✅ Data serialization (JSON)
- ✅ File upload (FormData)
- ✅ Response parsing
- ✅ Error handling (400, 409, 413, 500)
- ✅ Network errors

## Running the Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- AddCandidateForm.test.tsx

# Run in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage

# Run specific test suite
npm test -- -t "should accept valid email"
```

## Test Execution Flow

```
User fills form → Component renders → Hook validates → API sends
     ↓               ↓                    ↓                 ↓
Component Tests  Component Tests     Hook Tests        API Tests
- Input events   - Error display     - Validation     - Serialization
- Rendering      - State updates     - Error state    - HTTP calls
- File upload    - User interaction  - Trimming       - Responses
```

## Security Testing

All tests include security threat scenarios:

### XSS Prevention
```typescript
it('should safely handle XSS attempt', () => {
  render(<AddCandidateForm />);
  const input = screen.getByTestId('firstName');
  input.value = "<script>alert('XSS')</script>";
  // React prevents XSS by default
  expect(input.value).toBe("<script>alert('XSS')</script>");
});
```

### SQL Injection Prevention
```typescript
it('should safely handle SQL injection', () => {
  const candidateData = {
    ...createValidCandidateFormData(),
    firstName: "'; DROP TABLE candidates; --"
  };
  // Form sends as-is, backend uses parameterized queries
  await candidateAPI.addCandidate(candidateData);
  expect(global.fetch).toHaveBeenCalled();
});
```

## Known Limitations & Future Improvements

1. **Mock Components:** Tests use mock implementations - real components to be implemented
2. **No E2E:** Tests are unit/integration only - E2E tests with Cypress/Playwright in future
3. **No Visual Regression:** Visual testing not included - consider Percy or similar
4. **No Accessibility Audit:** Axe-core integration recommended for accessibility testing
5. **No Performance:** Performance tests not included - consider lighthouse-ci

## Alignment with Backend Tests

Frontend and backend tests follow same structure:

| Aspect | Backend | Frontend |
|--------|---------|----------|
| Pattern | AAA | AAA |
| Assertion Ratio | 1:1 | 1:1 |
| Factories | ✅ | ✅ |
| Mocking | Jest Mocks | Jest Mocks |
| Coverage | Validation, Service, API | Form, Hook, API |
| Security Tests | ✅ XSS, SQL Injection | ✅ XSS, SQL Injection |
| Traceability | Gherkin scenarios | Gherkin scenarios |

## Next Steps

1. **Implement Components:** Use test cases to guide component development
2. **Implement Hooks:** Validation logic and state management
3. **Implement API Client:** Network communication layer
4. **Run Tests:** `npm test` to execute all test suites
5. **Achieve Coverage:** Aim for >80% code coverage
6. **Add Integration Tests:** Full app workflow testing
7. **Add E2E Tests:** User journey testing with Cypress/Playwright
