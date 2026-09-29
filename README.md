# SOAIR Admin Page

This project is a Vite + React frontend with an Express admin backend. It includes:

- a public content/news experience
- an admin login flow with OTP email verification
- PostgreSQL-backed content storage
- optional email delivery via Resend
- local development support with Vite and Express running together

## Project structure

- `src/` — frontend React app
- `server/` — Express API and admin logic
- `.env` — local environment configuration
- `package.json` — scripts and dependencies

## Prerequisites

Before starting, install:

- Node.js 18+
- PostgreSQL (if you want database-backed content storage)
- A Resend account and API key (if you want real email OTP delivery)

## 1) Install dependencies

```bash
npm install
```

## 2) Create your .env file

Create a file named `.env` in the project root.

Example:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/soair"
RESEND_API_KEY="your_resend_api_key"
ADMIN_USERNAME="Glint"
ADMIN_EMAIL="martins.me1@proton.me"
SESSION_SECRET="replace-with-a-long-random-secret"
APP_URL="http://localhost:4100"
PORT="4101"
NODE_ENV="development"
```

## 3) Environment variables explained

### Required for normal app operation

#### `DATABASE_URL`
The PostgreSQL connection string used by the server.

Example:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/soair"
```

This is used in `server/db.ts` to connect to PostgreSQL and create the required tables.

If this is missing, database-backed content features will not work.

#### `RESEND_API_KEY`
Your API key from Resend, used to send the one-time password (OTP) email during admin login.

Example:

```env
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxx"
```

The backend uses this in `server/index.ts` when sending login emails.

If you do not set it in development, the server logs the OTP in the terminal instead of sending an email.

#### `SESSION_SECRET`
This is the secret key used to sign and verify the admin session cookie and OTP challenge data.

It must be:

- long
- random
- unique to this project
- kept private

Example generation:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Example:

```env
SESSION_SECRET="a7d4f9c5b1e0af3a91f4a59d8dca4b1d7c2e5f1290c83b24d2a5ea9080dc6ef"
```

#### `ADMIN_USERNAME`
The username required for admin login.

Example:

```env
ADMIN_USERNAME="Glint"
```

#### `ADMIN_EMAIL`
The email address where OTP login emails are sent.

Example:

```env
ADMIN_EMAIL="martins.me1@proton.me"
```

### Optional or app-level variables

#### `APP_URL`
The public base URL for the app.

Example:

```env
APP_URL="http://localhost:4100"
```

#### `PORT`
The backend port used by the Express server.

Default in the project:

```env
PORT="4101"
```

#### `NODE_ENV`
Environment mode used by the app.

Typical values:

```env
NODE_ENV="development"
```

or in production:

```env
NODE_ENV="production"
```

### Optional Resend sender settings
These are also supported by the config file and have defaults if you do not add them:

```env
RESEND_FROM_EMAIL="onboarding@resend.dev"
RESEND_FROM_NAME="NexTake Admin"
```

## 4) Database setup

If you are using PostgreSQL, create a database and set `DATABASE_URL` to match it.

Example:

```bash
createdb soair
```

Then use a connection string like:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/soair"
```

The server will automatically create the required tables on startup if the database is available.

## 5) Resend setup

To enable real OTP emails:

1. Create a Resend account
2. Create an API key
3. Add the key to `RESEND_API_KEY`
4. Verify an email sender in Resend
5. Set `RESEND_FROM_EMAIL` to that verified sender address if needed

In development, if `RESEND_API_KEY` is missing, the server will print the OTP in the console instead of sending email.

## 6) Run the app locally

Start the frontend and backend together:

```bash
npm run dev
```

This runs:

- Vite frontend on port `4100`
- Express backend on port `4101`

Then open:

```text
http://localhost:4100
```

## 7) Admin login

The admin login flow expects:

- username: `ADMIN_USERNAME`
- OTP sent to: `ADMIN_EMAIL`

Example login flow:

1. Visit the admin area
2. Enter the configured admin username
3. Receive the OTP by email
4. Enter the OTP to log in

## 8) Production notes

For production:

- set `NODE_ENV="production"`
- use a real `SESSION_SECRET`
- use a real PostgreSQL URL
- use a valid Resend API key and verified sender
- configure `APP_URL` to your deployed domain

## 9) Useful commands

```bash
npm install
npm run dev
npm run build
npm run test
npm run server
```

## Troubleshooting

### Login email not sending
Check:

- `RESEND_API_KEY`
- `ADMIN_EMAIL`
- `RESEND_FROM_EMAIL` is verified in Resend

### Database errors
Check:

- `DATABASE_URL`
- PostgreSQL server is running
- database exists and credentials are correct

### Session issues
Check:

- `SESSION_SECRET` is set and long/random
- `.env` is loaded correctly

## Final note

The most important values to complete before running the app are:

- `DATABASE_URL`
- `RESEND_API_KEY`
- `SESSION_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_EMAIL`

If you want, I can also prepare a ready-to-copy `.env.example` file for this project.
