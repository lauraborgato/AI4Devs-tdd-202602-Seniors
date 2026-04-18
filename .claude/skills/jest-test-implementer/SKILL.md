---
name: jest-test-implementer
description: Convert Gherkin BDD scenarios into production-ready Jest unit tests. Use this skill whenever you have Gherkin feature files (from gherkin-test-generator or any source) and need to implement actual Jest/TypeScript test code. The skill automatically generates AAA (Arrange-Act-Assert) pattern tests with 1:1 assertion-to-test ratio, intelligent mocking of external dependencies (database, file storage, APIs), sophisticated matchers (toMatchObject, expect.any), test factories, and helper functions. Test files are organized to match your source code folder structure. Accepts .feature files from disk and produces complete, production-ready test files ready to run with `npm test`. Handles all test categories: happy paths, validation, security (SQL injection, XSS), error handling, edge cases, concurrency, and data integrity.
compatibility: Requires Jest testing framework, TypeScript/JavaScript project, existing .feature file from gherkin-test-generator
---

## Overview

This skill transforms Gherkin BDD scenarios into production-ready Jest unit tests that follow strict architectural patterns and best practices. It's the implementation complement to the **gherkin-test-generator** skill.

**Workflow:**
1. Generate Gherkin test specifications (using gherkin-test-generator skill)
2. Implement Jest tests from Gherkin scenarios (THIS SKILL)
3. Run tests and verify coverage

## Input Options

The skill accepts Gherkin scenarios in two ways:

### Option 1: From a Feature File
Provide the path to a `.feature` file:
```
"Please implement Jest tests from the feature file at: backend/test-cases/add_candidate_unit_tests.feature"
```

### Option 2: Gherkin Text Directly
Paste Gherkin scenarios directly in your prompt:
```
"Convert these Gherkin scenarios to Jest tests:

Feature: User Authentication
  Scenario: Login with valid credentials
    Given the user is on the login page
    When the user enters valid credentials
    Then the user should be authenticated
"
```

### Option 3: Mixed (Recommended)
Combine both for best results:
```
"Read the feature file at backend/test-cases/add_candidate.feature 
and generate Jest tests, organizing them in backend/src/__tests__/services/ to match our source structure."
```

## Output Structure

### Test File Organization

Tests are organized to match your source code folder structure:

```
Source Code:                    Test Files:
src/
├── services/                   src/__tests__/
│   └── candidateService.ts     └── services/
│                                   └── candidateService.test.ts
├── controllers/                └── controllers/
│   └── candidateController.ts      └── candidateController.test.ts
└── utils/                      └── utils/
    └── validation.ts               └── validation.test.ts
```

**Rule:** One test file (`.test.ts` or `.test.js`) per source file, in parallel folder structure.

### Test File Structure

Each test file follows this organization:

```typescript
// File: src/__tests__/services/candidateService.test.ts

// 1. IMPORTS & SETUP
import { candidateService } from '../../services/candidateService';
import { database } from '../../db';
import { fileStorage } from '../../storage';

// 2. MOCK DECLARATIONS (at module level)
jest.mock('../../db');
jest.mock('../../storage');

// 3. TYPE DEFINITIONS (if needed)
type MockDatabase = jest.Mocked<typeof database>;

// 4. TEST UTILITIES & FACTORIES
const createMockCandidate = (...) => { ... };
const createMockDatabase = () => { ... };

// 5. TEST SUITES (describe blocks)
describe('Feature: Add New Candidate', () => {
  // 5a. Setup & teardown
  let mockDb: MockDatabase;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockDb = database as MockDatabase;
  });

  // 5b. Test cases (Arrange-Act-Assert pattern)
  describe('AC1: Successfully add candidate with all fields', () => {
    it('should return HTTP 201 Created with candidateId', async () => {
      // Arrange
      const candidateData = { ... };
      mockDb.candidates.create.mockResolvedValue({ id: 'test-id', ...candidateData });

      // Act
      const response = await candidateService.addCandidate(candidateData);

      // Assert
      expect(response).toMatchObject({
        status: 201,
        data: expect.objectContaining({ id: 'test-id' })
      });
      expect(mockDb.candidates.create).toHaveBeenCalledWith(candidateData);
    });
  });
});
```

## Implementation Patterns

### 1. Arrange-Act-Assert (AAA) Structure

Every test follows this strict pattern:

```typescript
it('should validate email format', () => {
  // ARRANGE: Set up test data and mocks
  const invalidEmail = 'not-an-email';
  
  // ACT: Execute the function/method
  const result = validation.validateEmail(invalidEmail);
  
  // ASSERT: Verify the outcome
  expect(result).toMatchObject({
    isValid: false,
    error: expect.stringContaining('Invalid email format')
  });
});
```

**Why:** Clear separation makes tests maintainable and failures obvious.

### 2. One Assertion Per Test (1:1 Ratio)

❌ **Bad** - Multiple assertions in one test:
```typescript
it('should add candidate', async () => {
  const result = await addCandidate(data);
  expect(result.id).toBeDefined();           // Assertion 1
  expect(result.status).toBe(201);           // Assertion 2
  expect(result.email).toBe(data.email);     // Assertion 3
});
```

✅ **Good** - One logical assertion per test:
```typescript
it('should return HTTP 201 Created status', async () => {
  const result = await addCandidate(data);
  expect(result).toMatchObject({ status: 201 });
});

it('should return candidateId in response', async () => {
  const result = await addCandidate(data);
  expect(result).toMatchObject({
    data: expect.objectContaining({ candidateId: expect.any(String) })
  });
});

it('should preserve submitted email address', async () => {
  const result = await addCandidate(data);
  expect(result.data.email).toBe(data.email);
});
```

**Why:** Precise failure reporting. If assertion 1 fails, you know exactly which assertion broke without running the test again.

### 3. Intelligent Mocking with jest.mock()

Mock external dependencies at the module level:

```typescript
// Module-level mocks
jest.mock('../../db');                    // Database
jest.mock('../../storage');               // File storage
jest.mock('../../email');                 // Email service
jest.mock('../../logger');                // Logging

import { database } from '../../db';
import { fileStorage } from '../../storage';

// Type the mocks
type MockDatabase = jest.Mocked<typeof database>;
type MockStorage = jest.Mocked<typeof fileStorage>;

// In tests, configure mocks
beforeEach(() => {
  jest.clearAllMocks();
  
  // Setup default mock behavior
  (database.candidates.create as jest.Mock).mockResolvedValue({
    id: 'candidate-123',
    email: 'test@example.com'
  });
  
  (fileStorage.uploadFile as jest.Mock).mockResolvedValue({
    url: 'https://storage.example.com/file.pdf'
  });
});
```

**Mock Stubs Provided:** The skill generates mock stubs with realistic behavior:
```typescript
// Provided mock stub - user customizes as needed
(database.candidates.create as jest.Mock).mockResolvedValue({
  id: expect.any(String),
  email: expect.any(String),
  createdAt: expect.any(Date)
});
```

User then adapts based on actual implementation.

### 4. Sophisticated Matchers

Use advanced Jest matchers for precise validation:

```typescript
// Basic matcher
expect(status).toBe(201);

// Object matching
expect(response).toMatchObject({
  status: 201,
  data: expect.objectContaining({
    candidateId: expect.any(String),
    email: expect.any(String),
    createdAt: expect.any(Date)
  })
});

// Array matching
expect(errors).toEqual(
  expect.arrayContaining([
    expect.objectContaining({ field: 'email', message: expect.any(String) })
  ])
);

// Function call verification
expect(database.candidates.create).toHaveBeenCalledWith(
  expect.objectContaining({ email: 'test@example.com' })
);
expect(fileStorage.uploadFile).toHaveBeenCalledTimes(1);

// String patterns
expect(error.message).toMatch(/email.*format/i);

// Error matching
expect(() => validation.validateEmail('')).toThrow(
  expect.objectContaining({ code: 'VALIDATION_ERROR' })
);
```

**Pattern:** Use `toMatchObject()` for partial matching and `expect.any(Type)` for type-flexible assertions.

### 5. Test Helpers & Factories

Generate reusable test utilities:

```typescript
// Factory function for creating valid test data
const createValidCandidate = (overrides?: Partial<Candidate>): Candidate => ({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+34 912 345 678',
  address: 'Calle Principal 123',
  ...overrides
});

// Helper for common assertions
const expectValidResponse = (response: any) => {
  expect(response).toMatchObject({
    status: expect.any(Number),
    data: expect.any(Object),
    timestamp: expect.any(Date)
  });
};

// Mock factory
const createMockDatabase = () => ({
  candidates: {
    create: jest.fn(),
    findByEmail: jest.fn(),
    delete: jest.fn()
  }
});

// Usage in tests
it('should create candidate with defaults', async () => {
  const candidate = createValidCandidate({ email: 'custom@example.com' });
  const result = await candidateService.addCandidate(candidate);
  expect(result).toMatchObject({ status: 201 });
});
```

### 6. Naming Convention

Test structure mirrors Gherkin naming for traceability:

```typescript
// From Gherkin:
// Feature: Add New Candidate to ATS System
// Scenario: Successfully add candidate with all required and optional fields
// AC1: Some acceptance criterion

// Generated Jest:
describe('Feature: Add New Candidate to ATS System', () => {
  describe('AC1: Some acceptance criterion', () => {
    it('should successfully add candidate with all required and optional fields', async () => {
      // test implementation
    });
  });
});
```

**Benefit:** Test failures are immediately traceable to Gherkin requirements.

### 7. Error Handling Tests

Test both success and failure paths:

```typescript
describe('Error Handling: Database failures', () => {
  it('should return HTTP 503 when database is unavailable', async () => {
    // Arrange
    (database.candidates.create as jest.Mock).mockRejectedValue(
      new Error('Connection timeout')
    );

    // Act & Assert
    await expect(candidateService.addCandidate(data)).rejects.toThrow(
      expect.objectContaining({ code: 'SERVICE_UNAVAILABLE' })
    );
  });

  it('should handle constraint violations gracefully', async () => {
    // Arrange
    (database.candidates.create as jest.Mock).mockRejectedValue(
      { code: 'UNIQUE_CONSTRAINT_VIOLATION' }
    );

    // Act
    const result = await candidateService.addCandidate(data);

    // Assert
    expect(result).toMatchObject({
      status: 409,
      error: expect.stringContaining('already exists')
    });
  });
});
```

### 8. Validation & Security Tests

Test input validation thoroughly:

```typescript
describe('Validation: Email format', () => {
  it('should reject email without @ symbol', () => {
    const result = validation.validateEmail('invalidemail.com');
    expect(result).toMatchObject({
      isValid: false,
      error: expect.stringContaining('@ symbol')
    });
  });

  it('should safely handle SQL injection attempt in email', () => {
    const maliciousEmail = "test' OR '1'='1@example.com";
    const result = candidateService.addCandidate({ 
      email: maliciousEmail 
    });
    // Email should be stored as-is, no SQL execution
    expect(result).toMatchObject({ status: expect.any(Number) });
    expect(database.candidates.create).toHaveBeenCalledWith(
      expect.objectContaining({ email: maliciousEmail })
    );
  });
});
```

## Generation Strategy

### Step 1: Analyze Gherkin Scenarios
- Extract Feature name → Test suite name (`describe`)
- Extract Acceptance Criteria (AC) → Nested `describe` blocks
- Extract Scenarios → Individual test cases (`it`)
- Identify Given/When/Then → AAA pattern components

### Step 2: Identify Dependencies to Mock
- Read the Gherkin steps
- Infer what needs mocking: database, file storage, APIs, external services
- Generate `jest.mock()` declarations
- Create mock type definitions

### Step 3: Generate Test Structure
- Create imports section (framework + service under test + mocks)
- Create mock setup in `beforeEach`
- Implement Arrange phase (test data creation, factory functions)
- Implement Act phase (function calls)
- Implement Assert phase (sophisticated matchers)

### Step 4: Create Helpers & Factories
- Extract common test data patterns → factory functions
- Extract common assertions → helper functions
- Create mock configuration utilities

## File Generation

### Target Directory Specification

User specifies where to save generated tests:

```
"Generate Jest tests from backend/test-cases/add_candidate_unit_tests.feature
and save them to backend/src/__tests__/ matching the source folder structure"
```

The skill will:
1. Parse the target directory structure
2. Determine which source files to test
3. Generate test files in parallel locations
4. Use proper `.test.ts` or `.test.js` extensions

### Output Example Structure

```
Generated for: Add Candidate feature

backend/src/
├── __tests__/
│   ├── services/
│   │   ├── candidateService.test.ts (187 test cases across 25 describe blocks)
│   │   ├── validationService.test.ts (optional, if validation is separate)
│   │   └── fileService.test.ts (optional, if file handling is separate)
│   ├── controllers/
│   │   └── candidateController.test.ts
│   └── __helpers__/
│       ├── testFactories.ts (createValidCandidate, createMockDatabase, etc.)
│       └── testAssertions.ts (expectValidResponse, etc.)
```

## Coverage Mapping

The skill generates tests covering:

✅ **Happy Paths** - Success scenarios from Gherkin  
✅ **Validation Tests** - Field-by-field validation with 1:1 assertions  
✅ **Security Tests** - SQL injection, XSS, auth/authz tests  
✅ **Error Handling** - Database failures, timeouts, service unavailability  
✅ **Edge Cases** - Boundary values, special characters, internationalization  
✅ **Concurrency** - Race conditions, duplicate prevention  
✅ **Data Integrity** - Encoding, case sensitivity, trimming  
✅ **Integration** - End-to-end flows with mock chains  

## Customization Points

The skill provides **mock stubs** for user customization:

```typescript
// Generated - user adapts to actual implementation
(database.candidates.create as jest.Mock).mockResolvedValue({
  id: 'mock-id',
  // User adds actual default values here
});

(fileStorage.uploadFile as jest.Mock).mockImplementation(async (file) => {
  // User can add custom logic or keep stub behavior
  return { url: `file-${Date.now()}` };
});
```

**User's Role:** Customize mock implementations to match actual service behavior.

## Best Practices Enforced

✅ **Isolation:** Each test is independent; `beforeEach` clears mocks  
✅ **Clarity:** AAA pattern makes test flow obvious  
✅ **Precision:** 1:1 assertion ratio ensures clear failure messages  
✅ **Maintainability:** Gherkin naming provides traceability  
✅ **Reusability:** Factories and helpers reduce duplication  
✅ **Type Safety:** TypeScript types for mocks and test data  
✅ **Coverage:** Every Gherkin scenario → Jest test  

## Integration with Development Workflow

1. **Generate Gherkin specs** → `gherkin-test-generator` skill
2. **Implement Jest tests** → THIS SKILL (jest-test-implementer)
3. **Run tests** → `npm test` or `jest`
4. **View coverage** → `npm run test:coverage`
5. **Implement production code** → Guided by failing tests (TDD)
6. **Watch tests pass** → Validation of implementation

## Dependencies

- **Jest:** Testing framework (already in your project)
- **TypeScript:** Type safety (optional but recommended)
- **Source code:** The actual service/controller files being tested

No additional packages required beyond what's in `package.json`.

## Example: Generated Test File

Given the Add Candidate Gherkin feature, here's a sample of what the skill generates:

```typescript
// File: backend/src/__tests__/services/candidateService.test.ts

import { candidateService } from '../../services/candidateService';
import { database } from '../../db';
import { fileStorage } from '../../storage';
import { validation } from '../../utils/validation';

jest.mock('../../db');
jest.mock('../../storage');

type MockDatabase = jest.Mocked<typeof database>;

// Test Factories
const createValidCandidate = (overrides?: Partial<any>) => ({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+34 912 345 678',
  address: 'Calle Principal 123',
  ...overrides
});

describe('Feature: Add New Candidate to ATS System', () => {
  let mockDb: MockDatabase;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDb = database as MockDatabase;
    mockDb.candidates.create.mockResolvedValue({
      id: 'cand-001',
      ...createValidCandidate()
    });
  });

  describe('AC1: Happy Path - Successfully add candidate', () => {
    it('should return HTTP 201 Created status', async () => {
      // Arrange
      const candidate = createValidCandidate();

      // Act
      const response = await candidateService.addCandidate(candidate);

      // Assert
      expect(response).toMatchObject({ status: 201 });
    });

    it('should return candidateId in response', async () => {
      // Arrange
      const candidate = createValidCandidate();

      // Act
      const response = await candidateService.addCandidate(candidate);

      // Assert
      expect(response.data).toMatchObject({
        candidateId: expect.any(String)
      });
    });
  });

  describe('AC2: Mandatory Field Validation', () => {
    it('should reject when firstName is empty', async () => {
      // Arrange
      const invalidCandidate = createValidCandidate({ firstName: '' });
      mockDb.candidates.create.mockRejectedValue({
        code: 'VALIDATION_ERROR',
        field: 'firstName',
        message: 'firstName is required'
      });

      // Act
      const response = await candidateService.addCandidate(invalidCandidate);

      // Assert
      expect(response).toMatchObject({
        status: 400,
        error: expect.objectContaining({
          message: expect.stringContaining('required')
        })
      });
    });
  });

  // ... many more tests following same pattern
});
```

---

## Generation Process

When invoked with arguments `<feature-file-path> <target-directory>`, execute this process:

1. **Read the feature file** from the provided path
2. **Parse Gherkin scenarios** — extract Feature name, Scenarios with Given/When/Then steps
3. **Analyze source code structure** — examine `backend/src/` to find services, controllers, utilities  
4. **Identify dependencies** — infer what to mock (database, file storage, APIs, validation) from scenario steps
5. **Generate test files** in `<target-directory>/src/__tests__/` matching source structure:
   - `services/candidateService.test.ts` with all test cases
   - `__helpers__/testFactories.ts` with factory functions
   - `__helpers__/testAssertions.ts` with helper functions
6. **For each Gherkin scenario**, create 1-3 Jest tests:
   - **Arrange** (Given steps) — setup test data and mock returns
   - **Act** (When steps) — call the function/endpoint
   - **Assert** (Then steps) — verify with Jest matchers (toMatchObject, expect.any(), toHaveBeenCalledWith())
7. **Test patterns**:
   - One logical assertion per test (1:1 ratio)
   - Validation: one test per field + validation rule
   - Security: SQL injection and XSS for each string field
   - Error handling: one test per HTTP status code (400, 401, 403, 409, 500, 503, etc.)
   - Edge cases: boundary values, special characters, whitespace, case sensitivity
8. **Mock setup** — use module-level `jest.mock()` with TypeScript types for mocks
9. **Write files to disk** using absolute paths
10. **Report completion** with file count and instructions to run `npm test`

## Next Steps

1. Provide a Gherkin feature file (path or text)
2. Specify target test directory (e.g., `backend/src/__tests__/`)
3. The skill will generate organized, production-ready Jest tests
4. Customize mock implementations as needed
5. Run tests with `npm test`

The skill ensures every Gherkin scenario becomes a verified, maintainable Jest test.
