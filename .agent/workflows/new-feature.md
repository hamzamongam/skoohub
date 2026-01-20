---
description: Create a new feature following the project standards
---

# Creating a New Feature

Follow these steps to ensure the new feature matches the established `auth` and `onboarding` structure.

1. **Define the Schema**: Add necessary models to `prisma/schema.prisma` and run `npm run db:generate`.
2. **Create Feature Directories**:
   ```bash
   mkdir -p src/feature/<name>/{repo,services,contract,procedure}
   ```
3. **Repository**: Implement `src/feature/<name>/repo/<name>.repo.ts` with required Prisma calls.
4. **Contract & Schema**:
   - Define Zod schemas in `src/feature/<name>/contract/<name>.schema.ts`.
   - Define the ORPC contract in `src/feature/<name>/contract/<name>.contract.ts`.
5. **Service**:
   - Implement business logic in `src/feature/<name>/services/<name>.service.ts`.
   - Use constructor injection for the repository.
6. **Unit Tests**:
   - Create `src/feature/<name>/services/<name>.service.spec.ts`.
   - Ensure 100% coverage of service methods.
     // turbo
   - Run `npx vitest src/feature/<name>/services/<name>.service.spec.ts`.
7. **Router**:
   - Implement `src/feature/<name>/procedure/<name>.router.ts`.
   - Register the router in `src/server/orpc/router.ts`.
8. **UI Routes**: Add TanStack Start routes in `src/routes/`.
