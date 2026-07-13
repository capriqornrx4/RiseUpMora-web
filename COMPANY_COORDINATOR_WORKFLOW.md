# Company Coordinator Role Workflow

This document explains the privileges of the `company_coordinator` role and the workflow for creating one in the current Rise Up Mora codebase.

## Role Purpose

A company coordinator represents one company in the platform. The role is intended to let a company-side user review and manage interview allocation details for candidates assigned to that company.

## Current Privileges

The current implementation gives a company coordinator these privileges:

| Area | Current behavior |
| --- | --- |
| Authentication | Can authenticate through the shared NextAuth credentials provider because `company_coordinator` is included in the allowed login roles. |
| Role identity | Has `users.role = 'company_coordinator'`. |
| Company link | Has one row in `company_coordinators` linking the user to a `companies.id`. |
| Account setup | Receives an invitation link, sets a password, and has `email_verified_at` populated during setup. |
| Admin visibility | Appears in the admin User Management page under the Company Co. tab. |
| Admin deletion | Can be deleted by an admin through `/api/v1/user?id=<user_id>`. The role-specific row is removed through `ON DELETE CASCADE`. |

## Intended Privileges

Based on the existing schema and backend functionality notes, the company coordinator should have these business privileges once the company dashboard APIs are completed:

| Capability | Scope |
| --- | --- |
| View allocated candidates | Only candidates allocated to the coordinator's linked company. |
| Review allocation details | Candidate, company, panel, status, interview date, and time slot data for the linked company. |
| Update interview scheduling | Interview date, time slot, panel number, panelist, and allocation status for candidates allocated to the linked company. |
| Coordinate panel assignments | Assign or update panel details for the linked company. |

Important: these intended privileges are not fully enforced by active API routes in this checkout. The company dashboard files are currently empty, and only the generic role management API exists under `app/api/v1/user/route.ts`.

## Creation Workflow

### 1. Admin signs in

The admin signs in through `/admin/login`. Admin-only pages and APIs require the session role to be `admin`.

Relevant files:

- `app/api/auth/[...nextauth]/route.ts`
- `proxy.ts`

### 2. Admin opens User Management

The admin goes to `/admin/dashboard/users` and selects the Company Co. tab.

Relevant file:

- `app/admin/dashboard/users/page.tsx`

### 3. Admin loads company options

When the Company Co. tab is selected, the UI fetches companies from:

```text
GET /api/v1/company/getAllCompany
```

Only admins can call this route.

### 4. Admin submits the invitation form

The admin enters:

- full name
- email address
- assigned company

The UI sends:

```text
POST /api/v1/user
```

with a body like:

```json
{
  "name": "Coordinator Name",
  "email": "coordinator@example.com",
  "company_id": "<company_uuid>",
  "role": "company_coordinator"
}
```

### 5. Backend creates the user

The API:

1. Confirms the requester is an admin.
2. Generates a random temporary password.
3. Hashes the password with bcrypt.
4. Inserts the user into `users` with `role = 'company_coordinator'`.
5. Inserts the company link into `company_coordinators`.
6. Generates a seven-day JWT invitation token.
7. Sends the invitation email.

Relevant files:

- `app/api/v1/user/route.ts`
- `utils/email.ts`
- `database/schema.sql`

### 6. Coordinator sets a password

The coordinator opens the invitation link and submits a new password through:

```text
POST /api/v1/user/setupAccount
```

The API validates the token, checks that the invitation was not already used, hashes the new password, updates `users.password_hash`, and marks the email as verified.

Relevant files:

- `app/setup-account/SetupAccountClient.tsx`
- `app/api/v1/user/setupAccount/route.ts`

### 7. Coordinator signs in

After account setup, the coordinator can sign in with email and password. The credentials provider allows only these roles:

- `admin`
- `company_coordinator`

Current note: the admin route proxy only allows `admin` into `/admin/dashboard`. A separate company route guard and dashboard workflow still need to be implemented for `/company/dashboard`.

## Database Records Created

Creating a company coordinator writes to two tables:

```sql
INSERT INTO users (name, email, password_hash, role)
VALUES (..., ..., ..., 'company_coordinator');
```

```sql
INSERT INTO company_coordinators (user_id, company_id)
VALUES (<new_user_id>, <selected_company_id>);
```

The schema enforces one coordinator profile per user through:

```sql
user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE
```

## Required Follow-Up Implementation

To make the company coordinator role fully useful, implement:

1. A `/company` route guard that allows only `company_coordinator` users.
2. A company dashboard UI in `app/company/dashboard/page.tsx`.
3. APIs that resolve the coordinator's `company_id` from the session user id.
4. Allocation list and update APIs scoped to that `company_id`.
5. Server-side authorization checks on every company coordinator API so coordinators cannot read or update another company's data.
