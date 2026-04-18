# Frontend Testing Guide

This project uses **Jest** with **ts-jest** and **React Testing Library** for testing React components.

## Setup

The testing framework includes:
- **Jest**: Test runner for JavaScript/TypeScript
- **ts-jest**: TypeScript support for Jest
- **React Testing Library**: Testing utilities for React components
- **@testing-library/jest-dom**: Custom Jest matchers for DOM elements

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

- **Unit tests**: `*.unit.test.tsx` or `*.unit.test.ts`
- **Integration tests**: `*.integration.test.tsx` or `*.integration.test.ts`

Example directory structure:
```
src/
├── components/
│   ├── AddCandidateForm.tsx
│   └── __tests__/
│       └── AddCandidateForm.unit.test.tsx
├── services/
│   └── __tests__/
│       └── candidateService.unit.test.ts
└── __tests__/
    ├── App.unit.test.tsx
    └── integration.test.tsx
```

## Writing Component Tests

### Unit Test Example (Component)
```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Test Example
```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form from '../Form';

describe('Form Integration', () => {
  it('should submit form with user data', async () => {
    const handleSubmit = jest.fn();
    render(<Form onSubmit={handleSubmit} />);

    await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({ name: 'John Doe' });
    });
  });
});
```

## Configuration

The Jest configuration is defined in `jest.config.js`:
- **preset**: `ts-jest` - uses ts-jest for TypeScript compilation
- **testEnvironment**: `jsdom` - runs tests in a browser-like environment
- **roots**: `src` - looks for tests in the src directory
- **moduleNameMapper**: Handles CSS and image imports in tests

## Testing Library Best Practices

1. **Query by Accessible Roles**: Use `getByRole`, `getByLabelText`, `getByText`
   ```typescript
   // ✅ Good
   screen.getByRole('button', { name: 'Submit' })
   screen.getByLabelText('Email')
   
   // ❌ Avoid
   screen.getByTestId('submit-btn')
   ```

2. **Use `userEvent` for User Interactions**: More realistic than `fireEvent`
   ```typescript
   import userEvent from '@testing-library/user-event';
   
   await userEvent.type(inputElement, 'text');
   await userEvent.click(buttonElement);
   ```

3. **Wait for Async Updates**: Use `waitFor` for async operations
   ```typescript
   await waitFor(() => {
     expect(screen.getByText('Loaded')).toBeInTheDocument();
   });
   ```

4. **Test Behavior, Not Implementation**: Focus on what users see and do
   ```typescript
   // ✅ Good - tests behavior
   expect(screen.getByText('Welcome')).toBeInTheDocument();
   
   // ❌ Avoid - tests implementation
   expect(component.state.isLoaded).toBe(true);
   ```

## Mocking

### Mocking Functions
```typescript
const mockCallback = jest.fn();
mockCallback('arg1');
expect(mockCallback).toHaveBeenCalledWith('arg1');
```

### Mocking Modules
```typescript
jest.mock('../api', () => ({
  fetchData: jest.fn(() => Promise.resolve({ data: 'test' }))
}));
```

### Mocking Services
```typescript
jest.mock('../services/candidateService', () => ({
  getCandidate: jest.fn(() => Promise.resolve({ id: 1, name: 'John' }))
}));
```

## Coverage

Coverage reports are generated in the `coverage/` directory when running:
```bash
npm run test:coverage
```

View the HTML report at `coverage/lcov-report/index.html`

## Common Assertions

```typescript
// Existence
expect(element).toBeInTheDocument()
expect(element).toBeVisible()

// Text Content
expect(screen.getByText('Hello')).toBeInTheDocument()

// Attributes
expect(element).toHaveAttribute('href', '/path')
expect(element).toHaveClass('active')

// Values
expect(input).toHaveValue('text')

// Disabled State
expect(button).toBeDisabled()
expect(button).toBeEnabled()

// Form Elements
expect(checkbox).toBeChecked()
expect(select).toHaveValue('option1')
```

## Debugging Tests

Print the DOM:
```typescript
const { debug } = render(<App />);
debug(); // prints the DOM
```

Or use `screen.debug()`:
```typescript
screen.debug(); // prints all rendered elements
```

## Resources

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
