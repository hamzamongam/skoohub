# Service Development Standards

## Overview

All new services, repositories, contracts, and routers in the `src/feature` directory must adhere to the following standards to ensure consistency, maintainability, and testability.

## 1. Documentation (JSDoc)

Every exported class, interface, and public method MUST have a JSDoc comment.

### Requirements:

- **Classes**: Brief description of the class's responsibility.
- **Methods**: Brief description of the operation, parameter descriptions (`@param`), return value description (`@returns`), and any potential errors thrown (`@throws`).

### Example:

```typescript
/**
 * AuthService handles authentication logic.
 */
export class AuthService {
    /**
     * Authenticates a user.
     * @param input - Login credentials.
     * @returns The session object.
     * @throws {UnauthorizedError} If login fails.
     */
    async login(input: TLoginSchema) { ... }
}
```

## 2. Unit Testing

Every Service class MUST have a corresponding `.spec.ts` or `.test.ts` file in the same directory.

### Requirements:

- **Coverage**: Tests should cover successful execution paths and known error scenarios (e.g., duplicate entries, validation failures).
- **Mocking**: Use `vitest` mocks (`vi.mock`, `vi.spyOn`) to isolate the service from repositories and external dependencies.
- **Assertions**: Verify that dependencies are called with correct arguments and that the return value matches the expected standardized response.

## 3. Standardized API Responses

Services MUST return a `SuccessResponse` object.

### Structure:

```typescript
{
  success: true,
  message: string, // "Action completed successfully" (default) or specific message
  data: T
}
```

### Requirements:

- Use the `toSuccessResponse` helper from `@/server/orpc/utils`.
- Do NOT return raw data or plain objects from public service methods that are called by routers.
- Routers should simply pass the service result through.

## 4. Clean Code Pattern

- **Fat Service / Thin Controller**: Put business logic, response formatting, and error handling in the Service. Keep the Router (Controller) minimal.
