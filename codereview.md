# Code Review Guide

Last reviewed: 2026-05-17

This document records the current application review and the standards to use when updating the app. Keep it current as issues are fixed or new architecture decisions are made.

## Application Summary

This is a Next.js 15 App Router job board for Jobs in Central Illinois. The app uses:

- Next.js server components, server actions, and route handlers
- Prisma with PostgreSQL
- NextAuth v5 beta with Google authentication
- Stripe Checkout and Stripe webhooks for paid job listings
- UploadThing for company logos, resumes, and cover letters
- Inngest for delayed job expiration and email jobs
- Arcjet for bot and abuse protection
- shadcn/Radix UI components with Tailwind CSS

Core workflows are:

- Company onboarding
- Job seeker onboarding
- Job creation, payment, activation, editing, deletion, and expiration
- Saving jobs
- Applying to jobs
- Viewing submitted applications and personal applications

## Current Review Findings

### High Priority

1. Job application counts use the wrong relation.
   - Files: `prisma/schema.prisma`, `app/(mainLayout)/my-jobs/page.tsx`
   - `JobPost` has both `applications Application[]` and `JobApplication JobApplication[]`.
   - Submitted applications are written to `JobApplication`, but the "My Jobs" table counts `_count.applications`, which counts the unused `Application` model.
   - Required fix: remove the unused `Application` model/relation and count `JobApplication`, or rename relations so the domain model is unambiguous.

### Medium Priority

1. Application validation is duplicated and inconsistent.
   - Files: `app/utils/zodSchemas.ts`, `app/utils/submitApplication.ts`
   - `applicationSchema` in `zodSchemas.ts` treats `coverLetter` as text with `min(10)`, while `submitApplication.ts` requires it to be a URL.
   - Required fix: keep one exported schema and use it in both forms and server actions.

2. Job creation stores only job fields even though the schema validates company fields.
   - Files: `app/utils/zodSchemas.ts`, `app/actions.ts`, `components/forms/CreateJobForm.tsx`, `components/forms/EditJobForm.tsx`
   - `jobSchema` requires company fields, but `createJob` and `editJobPost` ignore those fields.
   - Required fix: either move company editing to a separate workflow, or update company data intentionally in the same transaction.

3. `saveJobPost` can throw on duplicate saves.
   - File: `app/actions.ts`
   - The database has `@@unique([userId, jobPostId])`, but the action uses `create` without handling duplicates.
   - Required fix: use `upsert`, catch Prisma unique constraint errors, or make the UI/action idempotent.

4. Job creation is not transactional across Stripe customer creation, database job creation, and Inngest scheduling.
   - File: `app/actions.ts`
   - A failure after job creation can leave draft jobs or missing expiration jobs.
   - Required fix: use a Prisma transaction for related database writes, and make follow-up actions retryable/idempotent.

5. The Stripe webhook should be idempotent and stricter about event shape.
   - File: `app/api/webhook/stripe/route.ts`
   - It updates the job on `checkout.session.completed`, but does not store processed event IDs.
   - Required fix: add an event log or idempotency guard before mutating job state, and verify `payment_status === "paid"`.

6. Inngest job seeker emails appear hardcoded to a developer email.
   - File: `app/api/inngest/functions.ts`
   - `sendPeriodicJobListings` receives `email` but sends to `john.rak.fisher@gmail.com`.
   - Required fix: send to the event email after consent rules are defined, or disable this function until the email product behavior is complete.

### Low Priority / Consistency

1. `pnpm lint` passes with one warning.
   - File: `components/richTextEditor.tsx/JobDescriptionEditor.tsx`
   - Warning: unused eslint-disable directive.

2. Debug logging is present in client and server paths.
   - Examples: create/edit forms, UploadThing route, Inngest route, selectors.
   - Required fix: replace noisy logs with user-facing errors, structured server logging, or remove them.

3. Several UI strings have typos.
   - Examples: "Emplyoment", "permentanly", "Opportniues", "expried".
   - Required fix: clean copy as part of affected feature changes.

4. `README.md` is still the default create-next-app README.
   - Required fix: document app setup, required environment variables, migrations, webhook setup, and verification commands.

## Review Gates For Every Change

Run these commands before considering a change ready:

```bash
pnpm lint
pnpm build
```

If the change touches Prisma schema or generated Prisma types:

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

If the change touches Stripe, UploadThing, NextAuth, Arcjet, Inngest, or external network calls, test the relevant happy path and at least one failure path locally or in a staging environment.

## Security And Authorization Checklist

Every mutation must answer these questions in code:

- Is the user authenticated with `requireUser()` or an equivalent guard?
- Is the user authorized for the exact resource being changed?
- Does the Prisma `where` clause include ownership, such as `userId`, `Company.userId`, or a relation scoped to the current user?
- Does the action handle missing records without leaking private data?
- Is the action idempotent where users can double-submit?
- Are uploaded file URLs validated before storing or displaying?
- Are webhooks verified with provider signatures before processing?

Do not add route handlers or server actions that mutate user data without ownership checks.

## Data Model Standards

- Keep one clear model for each domain concept. Avoid parallel models such as both `Application` and `JobApplication`.
- Prefer explicit relation names when a model has multiple relations to the same domain area.
- Add unique constraints for business rules that must survive concurrent requests, such as one application per user per job.
- Align Prisma field names with UI language. For example, use either `updatedAt` consistently or document any exception.
- When deleting parent records, define whether child records should cascade, be restricted, or be deleted manually.

## Validation Standards

- Keep shared Zod schemas in `app/utils/zodSchemas.ts` unless there is a strong reason for a local schema.
- Use the same schema on the form and in the server action.
- Validate enums as enums, not open strings, when the allowed values are known.
- Validate cross-field rules, such as `salaryFrom <= salaryTo`.
- Validate uploaded document fields consistently as URLs if they store UploadThing URLs.

## Server Action Standards

- Start with authentication and abuse protection when the action is user-triggered.
- Parse inputs with Zod before database writes.
- Scope all updates/deletes to the authenticated user.
- Return structured results for recoverable form errors.
- Use `redirect()` only after successful mutations.
- Revalidate all affected pages after mutation.
- Avoid swallowing errors with generic `console.log`; return a user-safe message and log useful server context.

## Payments And Webhooks

- Treat Stripe checkout creation and webhook processing as separate, retryable steps.
- Store pending jobs as `DRAFT`; activate only from a verified paid webhook.
- Use `metadata.jobId`, but verify that the Stripe customer belongs to the company that owns the job.
- Make webhook processing idempotent by storing processed Stripe event IDs.
- Never trust client-provided payment status.
- Keep `NEXT_PUBLIC_URL`, `SECRET_STRIPE_KEY`, and `STRIPE_WEBHOOK_SECRET` documented in setup instructions.

## Upload Standards

- Keep upload routes authenticated.
- Limit file types and sizes by route.
- Avoid logging file URLs in production.
- Store only URLs that come from trusted upload callbacks.
- For resumes and cover letters, keep the product decision clear: uploaded PDF URL vs typed text. Do not mix the two in validation.

## Frontend Consistency

- Preserve the existing shadcn/Radix component style.
- Prefer existing shared components in `components/ui` and `components/general`.
- Keep loading, empty, pending, and error states visible for user-triggered workflows.
- Do not rely on console output for user feedback.
- Use accessible buttons and links with clear labels.
- Keep tables and cards responsive on small screens.

## Documentation To Add

The README should eventually include:

- Node and pnpm versions
- Required environment variables
- Database setup and migration steps
- Google OAuth setup
- Stripe checkout and webhook setup
- UploadThing setup
- Inngest local/dev setup
- Arcjet setup
- Standard verification commands

## Current Verification Results

As of 2026-05-17:

- `pnpm lint`: passes with one warning for an unused eslint-disable directive.
- `pnpm build`: passes.
- Local endpoint checks passed for the home page, NextAuth session/signin, UploadThing GET, protected job deletion, Stripe invalid-signature rejection, Inngest GET, login, onboarding redirect, payment success redirect, post-job redirect, and submissions redirect.
- Inngest returns an SDK error for a malformed empty POST without a function ID; valid Inngest function invocation still needs provider-signed/staging verification.

## Resolved Findings

Resolved on 2026-05-17:

- Added `deleteJobApplication` in `app/actions.ts`, scoped to the authenticated user's application.
- Updated `app/api/delete-job-post/route.ts` to return JSON `401` for unauthenticated requests and verify company ownership before deletion.
- Updated job deletion to remove related saved jobs, job applications, and legacy `Application` rows before deleting the job post.

## Update Policy

When a finding is fixed:

1. Update this document in the same pull request.
2. Move the item to a resolved section or remove it if the fix is obvious from git history.
3. Record any new convention that prevented the issue from recurring.
4. Keep this document focused on actionable review guidance, not historical noise.
