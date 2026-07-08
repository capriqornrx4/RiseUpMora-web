# Backend Functionalities Through Serverless Functions

This website uses Next.js App Router API routes under `app/api` as serverless backend functions. The backend is built around Prisma/PostgreSQL, NextAuth credential sessions, bcrypt password hashing, Nodemailer email delivery, and Cloudinary file uploads.

## Core Backend Stack

- **Serverless runtime:** Next.js API route handlers in `app/api/**/route.ts` and `route.tsx`.
- **Database access:** Prisma Client through `lib/prisma.ts`.
- **Database models:** `User`, `Candidate`, `Company`, `CompanyCordinator`, `DepartmentCordinator`, `Panelist`, `Allocation`, `Feedback`, plus NextAuth account/session/token models.
- **Authentication:** NextAuth credentials provider at `/api/auth/[...nextauth]`, with JWT sessions and role data added to the session token.
- **Password security:** `bcrypt` hashing for account creation, coordinator/panelist creation, password change, password reset, and password comparison.
- **Email service:** Nodemailer Gmail transport for email verification and password reset emails.
- **File storage:** Cloudinary upload stream for CV/profile uploads.

## Authentication And User Account Functions

| Method | Route | Functionality |
| --- | --- | --- |
| `GET`, `POST` | `/api/auth/[...nextauth]` | Handles NextAuth credential session routes using JWT sessions. |
| `POST` | `/api/v1/user/signup` | Creates a candidate user account, hashes the password, stores an email verification token, and sends a verification email. |
| `POST` | `/api/v1/user/signin` | Validates email/password, checks email verification status, and returns user details plus whether candidate profile registration is complete. |
| `POST` | `/api/v1/user/verify` | Verifies an email token, marks the user email as verified, and deletes the used verification token. |
| `POST` | `/api/v1/user/requestResetPassword` | Creates a password reset token with expiry and emails a reset link to the user. |
| `POST` | `/api/v1/user/resetPassword` | Validates a reset token and updates the user's password with a bcrypt hash. |
| `POST` | `/api/v1/admin/changePassword` | Updates an existing user's password by user id. |
| `GET` | `/api/v1/user/getUser/[id]` | Returns a user by id, including related candidate details. |
| `GET` | `/api/v1/user/getUserByEmail/[email]` | Returns a user by email. |

## Candidate Profile And Registration Functions

| Method | Route | Functionality |
| --- | --- | --- |
| `POST` | `/api/v1/user/registration` | Creates a candidate profile linked to an existing user, stores personal details, university id, department, degree, CV URL, image URL, and updates the user's image. |
| `GET` | `/api/v1/user/getCandidate/[id]` | Returns a candidate profile by candidate/user id. |
| `GET` | `/api/v1/candidate/getCandidates` | Returns all candidates with their linked user records. |
| `POST` | `/api/v1/user/uploadCv` | Updates a candidate's stored CV URL. |
| `POST` | `/api/v1/candidate/updateCompanyPreference` | Updates a candidate's four company preferences after validating all preferences are selected. |

## Company Management Functions

| Method | Route | Functionality |
| --- | --- | --- |
| `POST` | `/api/v1/company/addCompany` | Creates a company record with id, name, and logo URL after checking duplicate company ids. |
| `GET` | `/api/v1/company/getAllCompany` | Returns all companies. |
| `GET` | `/api/v1/company/getfeedback` | Returns all feedback records. |

## Admin User Management Functions

| Method | Route | Functionality |
| --- | --- | --- |
| `POST` | `/api/v1/admin/addCompanyCoordinator` | Creates a verified company coordinator user, hashes the password, enforces one coordinator per company, and links the user to a company. |
| `POST` | `/api/v1/admin/addDepCoordinator` | Creates a verified department coordinator user, hashes the password, and links the user to a Prisma `Department` enum value. |
| `POST` | `/api/v1/admin/addPanelist` | Creates a verified panelist user, hashes the password, prevents duplicate panel number per company, and links the user to the company/panel. |
| `GET` | `/api/v1/admin/getAllCompanyCoordinators` | Returns all company coordinators with selected user and company data, transformed for the admin UI. |
| `GET` | `/api/v1/admin/getAllDepartmentCoordinators` | Returns all department coordinators with selected user data, transformed for the admin UI. |
| `GET` | `/api/v1/admin/getAllPanelists` | Returns all panelists with selected user and company data, transformed for the admin UI. |
| `GET` | `/api/v1/admin/getDepartmentCordinatorById` | Looks up one department coordinator by query parameter and returns coordinator data. |
| `GET` | `/api/v1/admin/getDepartmentCordinatorById.tsx` | Alternate department coordinator lookup route returning matching coordinator records. |
| `GET` | `/api/v1/admin/getPanelistForOneCompany` | Returns panelists for a company by query parameter. |
| `GET` | `/api/v1/admin/getPanelistByCompanyIdAndPanelNumber` | Returns panelists matching a company id and panel number. |

## Interview Allocation Functions

| Method | Route | Functionality |
| --- | --- | --- |
| `POST` | `/api/v1/admin/AllInterviewees` | Processes one or more allocation records for a candidate, deletes removed company allocations, and creates new allocations for companies not already assigned. |
| `PUT` | `/api/v1/admin/UpdateInterviewByCompanyCordinator` | Updates an allocation's date, time slot, panel number, panelist id, status, and resets attendance for a candidate/company pair. |
| `GET` | `/api/v1/admin/getAllInterviewees` | Returns all allocation records. |
| `DELETE` | `/api/v1/admin/deleteAllInterviewees` | Deletes allocation records for a provided candidate id. |
| `DELETE` | `/api/v1/admin/deleteAllTable` | Placeholder maintenance endpoint; destructive delete calls are currently commented out. |
| `GET` | `/api/v1/company/companyAllocationCandidate/[...id]` | Returns all allocations for a company, ordered by allocation status and candidate creation date, with candidate and user details. |
| `GET` | `/api/v1/companyAllocation/getCompanyAllocation/[id]` | Returns all allocations for a candidate, including company details. |
| `GET` | `/api/v1/candidate/getAllocations?panelistId=...` | Returns allocations assigned to a panelist, including company name, panel number, candidate name, degree, candidate id, attendance, date, and time slot. |
| `POST` | `/api/v1/candidate/getCandidateDetails?panelistId=...` | Returns candidate detail records for candidates allocated to a panelist. |
| `POST` | `/api/v1/candidate/updateAttendance` | Updates attendance for a specific allocation id. |
| `GET` | `/api/v1/preference/getFirstPreference` | Groups allocations with `allocation_status = "1"` by company and returns company allocation counts. |

## Feedback Functions

| Method | Route | Functionality |
| --- | --- | --- |
| `POST` | `/api/v1/feedback/addFeedback` | Creates feedback for a candidate from a panelist's company, storing communication, experience/project, problem-solving, technical scores, and written feedback. |
| `GET` | `/api/v1/feedback/getPanelistFeedback?candidateId=...&panalistId=...` | Checks whether feedback already exists for a candidate from the panelist's company. |
| `GET` | `/api/v1/candidate/getFeedback/[id]` | Returns feedback records for a candidate id. |

## File Upload Function

| Method | Route | Functionality |
| --- | --- | --- |
| `POST` | `/api/v1/upload` | Accepts multipart form data containing `file`, `userId`, and `fileType`, uploads the file to Cloudinary under `users/{userId}`, and returns the Cloudinary secure URL. |

## Email Functions

These are not public API routes, but they support the serverless functions:

- `sendVerificationEmail(to, token)` in `lib/nodemailer.ts`: sends an email verification link pointing to `/auth/verify/?token=...`.
- `sendPasswordResetEmail(to, token)` in `lib/nodemailer.ts`: sends a password reset link pointing to `/auth/resetPassword/?token=...`.

## Database-Centered Functional Areas

- **Users and roles:** candidate, admin-related coordinator roles, company coordinator, department coordinator, and panelist.
- **Candidate onboarding:** signup, email verification, profile registration, CV/image URL storage, and company preference selection.
- **Admin setup:** company creation, coordinator creation, panelist creation, password management, and listing administrative users.
- **Interview scheduling:** candidate/company allocation creation, panelist assignment, interview date/time updates, allocation status handling, and attendance tracking.
- **Company coordinator workflows:** company allocation review and allocation updates.
- **Panelist workflows:** viewing assigned candidates, tracking attendance, and submitting candidate feedback.
- **Candidate workflows:** viewing allocations and feedback.
- **Reporting/counts:** first-preference/allocation count aggregation by company.
- **File handling:** Cloudinary-backed upload URL generation for user files.

## Environment Variables Used By Backend Features

- `DATABASE_URL`: PostgreSQL connection string for Prisma.
- `NEXTAUTH_URL`: Base URL used in verification and reset email links.
- `SECRET` / NextAuth secret configuration: used by NextAuth.
- `EMAIL_USER`: Gmail sender account for Nodemailer.
- `EMAIL_PASS`: Gmail app password or mail password for Nodemailer.
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name.
- `CLOUDINARY_API_KEY`: Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Cloudinary API secret.

## Web Application Capabilities

Rise Up Mora is an interview registration, company allocation, and feedback management platform. It supports multiple user types, each with a different workflow around candidate onboarding, company administration, interview scheduling, attendance tracking, and feedback collection.

### User Types

| User Type | Capabilities |
| --- | --- |
| **Candidate / Student** | Signs up, verifies email, signs in, completes candidate registration, uploads CV/profile image, submits academic and contact details, selects company preferences, views allocated companies/interview details, and views feedback received from companies. |
| **Admin** | Manages the operational setup of the platform, including creating companies, adding company coordinators, adding department coordinators, adding panelists, viewing all candidates/interviewees, assigning candidates to companies/panelists, updating allocations, managing passwords, and deleting candidate allocations when needed. |
| **Company Coordinator** | Reviews candidates allocated to their company, updates interview allocation details such as interview date, time slot, panel number, panelist, and allocation status. |
| **Department Coordinator** | Accesses department-related coordination data and supports candidate/interview management for a specific department. |
| **Panelist / Interviewer** | Views assigned interview allocations, checks candidate details, marks candidate attendance, and submits structured interview feedback with ratings and written comments. |

### Overall Application Functionality

- Provides a complete candidate registration flow from account creation to verified profile completion.
- Stores candidate personal details, university details, CV URL, profile image URL, degree, department, and company preferences.
- Maintains company records with company names, ids, and logos.
- Allows admins to create and manage coordinator and panelist accounts with role-based user records.
- Supports interview allocation workflows between candidates, companies, panelists, panel numbers, dates, and time slots.
- Tracks allocation status and candidate attendance for interviews.
- Enables panelists to submit candidate feedback using multiple scoring categories and written feedback.
- Allows candidates and company/admin users to retrieve allocation and feedback data through serverless backend endpoints.
- Provides aggregated allocation counts by company for reporting or dashboard views.
- Uses Cloudinary for file uploads and external file URL storage.
- Uses email delivery for verification and password reset workflows.
- Uses Prisma/PostgreSQL as the source of truth for all users, candidates, companies, allocations, coordinators, panelists, and feedback.