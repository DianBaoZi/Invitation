# Email/Password Authentication Design

## Overview
Add email/password authentication alongside existing Google OAuth for the Valentine's invitation app.

## Decisions Made
- **Identifier**: Email address (enables password recovery, familiar to users)
- **Auth options**: Both Google OAuth and email/password available
- **Email verification**: Required before accessing app
- **Password requirements**: Minimum 8 characters

## Architecture
- Uses Supabase Auth (existing infrastructure)
- Both auth methods use same `auth.users` table
- Session management handled by Supabase automatically

## Files to Create
1. `/src/app/signup/page.tsx` - Sign up page
2. `/src/app/reset-password/page.tsx` - Password reset page

## Files to Modify
1. `/src/app/login/page.tsx` - Add email/password form

## User Flows

### Sign Up
1. User enters email/password on `/signup`
2. Validate: email format, 8+ chars password, passwords match
3. Call `supabase.auth.signUp()`
4. Show "Check your email" message
5. User clicks verification link
6. Redirects to `/auth/callback` → logged in

### Sign In
1. User enters credentials on `/login`
2. Call `supabase.auth.signInWithPassword()`
3. Handle errors (unverified email, wrong credentials)
4. Success → redirect to dashboard

### Password Reset
1. Click "Forgot password?" on login
2. Enter email → `supabase.auth.resetPasswordForEmail()`
3. Click link in email → `/reset-password`
4. Enter new password → `supabase.auth.updateUser()`

## Supabase Configuration Required
1. Enable Email provider in Authentication → Providers
2. Ensure redirect URLs are configured
