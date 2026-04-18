---
name: gherkin-test-generator
description: Generate exhaustive Gherkin BDD test suites from user story tickets. Use this skill whenever a user asks to define, create, or generate test cases for a backend endpoint or feature within this ATS project. The skill automatically covers all acceptance criteria, edge cases (boundary values, null/empty handling, concurrency), security scenarios (SQL injection, XSS, authentication), and data integrity concerns to ensure 100% logic coverage. Accepts user story markdown files and produces comprehensive .feature files ready for implementation.
compatibility: Requires Gherkin/Cucumber knowledge; works with any tech stack (output is behavior-driven)
---

## Overview

This skill transforms user story tickets into comprehensive, production-ready Gherkin feature files that achieve **100% logic coverage** through exhaustive test case generation.

**When to use this skill:**
- Converting Jira/user story tickets into executable BDD test specifications
- Defining test cases for new backend endpoints or features
- Ensuring security, edge cases, and data integrity are tested
- Creating specifications that guide development in a TDD workflow

## Input Requirements

**User Story Markdown File** containing:
- User story format: "As a [role], I want [action], So that [benefit]"
- **Acceptance Criteria (AC):** Clear, testable conditions
- **Technical Tasks:** Implementation details and constraints
- **Context notes:** Business rules, constraints, integrations

Example structure:
```markdown
# Feature Name
As a [role],
I want to [action],
So that [benefit].

## Acceptance Criteria
- AC1: [Specific testable requirement]
- AC2: [Another requirement]

## Technical Tasks
- Handle X format
- Validate Y constraints
- Secure against Z vulnerability

## Notes
- Business rule details
- Integration points
```

## Output Structure

### Generated `.feature` File Contains:

1. **Feature Description** - User story mapped to Gherkin Feature
2. **Background** - Shared preconditions (auth, system state)
3. **Happy Path Scenarios** - Standard success flows per acceptance criterion
4. **Validation Scenarios** - Input validation (mandatory fields, formats, constraints)
5. **Security Scenarios** - SQL injection, XSS, authentication, authorization
6. **Edge Cases** - Boundary values, null/empty handling, special characters
7. **Error Handling** - Database failures, service unavailability, timeouts
8. **Concurrency** - Race conditions, duplicate prevention, idempotency
9. **Data Integrity** - Encoding, case sensitivity, type handling
10. **Integration** - End-to-end workflows, audit logging
11. **Boundary Analysis** - Min/max values, length limits

### File Organization:
```
backend/test-cases/
└── [feature_name]_unit_tests.feature
```

## Test Case Generation Strategy

### Standard Scenarios (Happy Path)
For each acceptance criterion, create 1-3 scenarios covering:
- Success with all fields
- Success with only mandatory fields
- Success with optional fields

### Validation Scenarios
For each input field (name, email, phone, address, etc.):
- **Mandatory field tests:** Empty, null, whitespace-only
- **Format validation:** Valid formats, invalid formats, edge cases
- **Length constraints:** Minimum, maximum, boundary+1
- **Character validation:** Special characters, accents, internationalization
- **Type validation:** Correct type, wrong type

### Security Scenarios
- **SQL Injection:** Attempt in each string field (name, address, notes)
- **XSS Attacks:** Script tags, event handlers, encoded attacks
- **Authentication:** Missing token, invalid token, expired token
- **Authorization:** Insufficient permissions, correct permissions
- **Input Sanitization:** Trimming, escaping, normalization

### Edge Cases & Boundary Analysis
- **Null vs Empty Strings:** Distinguish between NULL and ""
- **Whitespace:** Leading, trailing, internal
- **Special Characters:** Hyphens, apostrophes, accents, emoji
- **Internationalization:** UTF-8, non-ASCII, multiple scripts
- **File Uploads:** Format validation, size limits, malware detection
- **Concurrency:** Race conditions, duplicate prevention, idempotency
- **Case Sensitivity:** Email normalization, case-insensitive comparison
- **Data Encoding:** UTF-8 encoding, unicode, emoji handling

### Error Handling Scenarios
- **Database Failures:** Connection loss, timeout, constraint violation
- **Service Unavailability:** File storage down, external API timeout
- **Invalid State:** Duplicate records, missing prerequisites
- **Rate Limiting:** Excessive requests, throttling response

## Gherkin Best Practices

### Scenario Structure
```gherkin
Scenario: [Clear, specific test description]
  Given [precondition]
  When [action by user/system]
  Then [expected outcome]
```

### Field-by-Field Testing
For each input field, test individually:
```gherkin
Scenario: Reject [feature] when [field] is empty
  Given [precondition]
  When the user submits with [field] = (empty)
  And all other mandatory fields are valid
  Then the system should return [error code]
  And the error should contain "[field] is required"
```

### Boundary Value Testing
```gherkin
Scenario: Accept [field] at maximum allowed length
Scenario: Reject [field] exceeding maximum allowed length
```

### Security Testing Pattern
```gherkin
Scenario: Safely handle [attack type] in [field]
  When the user submits [malicious payload]
  Then the system should [sanitize/reject]
  And [security guarantee] should be maintained
```

## Coverage Checklist

Before finalizing the feature file, verify:

- [ ] **AC Coverage:** Every acceptance criterion has ≥1 scenario
- [ ] **Happy Paths:** Success flows with all, mandatory-only, optional fields
- [ ] **Validation:** Each input field tested for empty, invalid format, boundary values
- [ ] **Security:** SQL injection, XSS, auth/authz for each field/role
- [ ] **Edge Cases:** Null vs empty, whitespace, special characters, internationalization
- [ ] **Concurrency:** Duplicate prevention, race conditions, idempotency
- [ ] **Error Handling:** Database, service, validation, rate limiting errors
- [ ] **Data Integrity:** Encoding, case sensitivity, type coercion
- [ ] **Audit/Logging:** Success and failure tracking
- [ ] **Response Format:** Standard HTTP status codes, error response structure
- [ ] **Integration:** End-to-end workflows combining multiple steps

## Project-Specific Context

This project is a **TypeScript/Node.js ATS (Applicant Tracking System)** with:
- **Backend:** Express.js + TypeScript
- **Database:** Prisma ORM + PostgreSQL
- **Testing:** Jest
- **Features:** Candidate management, recruiter workflows

When generating test cases:
- Reference HTTP status codes (201 Created, 400 Bad Request, 409 Conflict, etc.)
- Use database terminology (Prisma models, constraints, relations)
- Include Prisma-specific concerns (unique constraints, foreign keys)
- Reference file storage patterns used in the project
- Match authentication/authorization patterns in the codebase

## Generation Process

### Step 1: Analyze the Ticket
- Read the user story description and acceptance criteria
- Identify all input fields and their constraints
- Note business rules and technical requirements
- List security/privacy concerns

### Step 2: Organize Scenarios
Group test cases by category:
1. Happy path (2-3 scenarios)
2. Mandatory field validation (1 per field)
3. Format validation (2-3 per field)
4. Security (5+ scenarios)
5. Edge cases (boundary, special characters, etc.)
6. Error handling (5+ scenarios)
7. Concurrency & idempotency
8. Integration & audit

### Step 3: Write Scenarios
- Use clear, specific descriptions
- Each scenario should test ONE thing
- Use Given-When-Then structure consistently
- Include data tables for multiple similar tests
- Document expected status codes and error messages

### Step 4: Review Coverage
- Verify each AC is tested
- Check for gaps in security/validation
- Ensure boundary values are covered
- Confirm edge cases are included

## Example: Testing an Email Field

```gherkin
# Valid format tests
Scenario: Accept valid email with standard domain
  Given preconditions
  When user submits email "user@example.com"
  Then accept with HTTP 201

# Invalid format tests
Scenario: Reject email without @ symbol
  When user submits email "userexample.com"
  Then reject with HTTP 400 and "Invalid email format"

# Boundary tests
Scenario: Accept email at maximum allowed length (254 chars)
Scenario: Reject email exceeding maximum length (255+ chars)

# Security tests
Scenario: Safely handle SQL injection attempt in email field
  When user submits email "test' OR '1'='1@example.com"
  Then store safely without code execution

# Duplicate prevention
Scenario: Prevent duplicate email in concurrent submissions
  When two users simultaneously submit same email
  Then first succeeds (201), second fails (409 Conflict)
```

## Output Example

The generated `.feature` file will have:
- 150-200+ scenarios depending on feature complexity
- Organized by test category with clear section headers
- Each scenario with descriptive Given-When-Then steps
- Data tables for parametric testing
- Comments explaining intent where needed
- HTTP status codes and error messages aligned with API spec

## Tips for Best Results

1. **Be specific in the input:** Provide complete acceptance criteria and technical constraints
2. **Include examples:** If you have specific valid/invalid values, include them
3. **Note edge cases:** Call out if certain scenarios are critical to your business logic
4. **Security context:** Mention if the feature handles PII or sensitive data
5. **Concurrent access:** Note if multiple users might access simultaneously

## Files Generated

- `backend/test-cases/[feature_name]_unit_tests.feature` - Main test specification file
