# Testing Guide

This project uses **Jest** with **ts-jest** for running unit and integration tests.

## Setup

The testing framework is already configured with:
- **Jest**: Test runner for JavaScript/TypeScript
- **ts-jest**: TypeScript support for Jest
- **@types/jest**: Type definitions for Jest

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (re-run on file changes)
```bash
npm run test:watch
```

### Run only unit tests
```bash
npm run test:unit
```

### Run only integration tests
```bash
npm run test:integration
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test File Structure

Tests should follow this naming convention:

- **Unit tests**: `*.unit.test.ts`
- **Integration tests**: `*.integration.test.ts`

Example directory structure:
```
src/
├── domain/
│   ├── models/
│   └── __tests__/
│       └── candidate.unit.test.ts
├── application/
│   ├── services/
│   └── __tests__/
│       └── candidateService.integration.test.ts
└── __tests__/
    └── example.unit.test.ts
```

## Writing Tests

### Unit Test Example
```typescript
describe('Unit Test Example', () => {
  it('should demonstrate a passing unit test', () => {
    const sum = (a: number, b: number) => a + b;
    expect(sum(2, 3)).toBe(5);
  });
});
```

### Integration Test Example
```typescript
describe('Integration Test Example', () => {
  it('should perform a multi-step operation', async () => {
    const result = await someService.process(data);
    expect(result).toEqual(expectedValue);
  });
});
```

## Configuration

The Jest configuration is defined in `jest.config.js`:
- **preset**: `ts-jest` - uses ts-jest for TypeScript compilation
- **testEnvironment**: `node` - runs tests in Node.js environment
- **roots**: `src` - looks for tests in the src directory
- **testMatch**: Matches files with `.test.ts` or `.spec.ts` extensions
- **collectCoverageFrom**: Generates coverage reports for source files

## Coverage

Coverage reports are generated in the `coverage/` directory when running:
```bash
npm run test:coverage
```

View the HTML report at `coverage/lcov-report/index.html`

## Debugging Tests

To debug tests, add the `--detectOpenHandles` flag:
```bash
npm test -- --detectOpenHandles
```

Or run with Node debugger:
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Best Practices for TDD

1. **Red-Green-Refactor**: Write failing tests first, then implementation
2. **Test Names**: Use descriptive test names that explain what is being tested
3. **Arrange-Act-Assert**: Structure tests with setup (arrange), action (act), and validation (assert)
4. **Mock External Dependencies**: Use Jest mocks for external services
5. **Keep Tests Focused**: One assertion per test when possible
6. **DRY**: Use `beforeEach` for common setup code

## Mocking

Jest provides built-in mocking utilities:

```typescript
describe('Mocking Example', () => {
  it('should mock a function', () => {
    const mockFn = jest.fn();
    mockFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
  });

  it('should mock modules', () => {
    jest.mock('../path/to/module');
    // Module is mocked for this test
  });
});
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)
- [Testing Library](https://testing-library.com/) - for React components
