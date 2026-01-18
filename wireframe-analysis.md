# Patient Portal Wireframe Analysis

## Overview
The wireframe shows a unified SoundBridge Health platform with 4 portals accessed from a single homepage.

## User Flows

### Flow 1: Patient Journey (QR Code Entry)
1. **QR Code Landing Page** → Scan QR code
2. **Patient Landing Page** → "Healing Through the Power of Music" hero section
3. **Take Assessment Button** → Start 25-question assessment (75 points total)
4. **Assessment Scoring**:
   - ≥80% (60+ points) → Approved → Patient notified → Insurance pre-auth begins
   - <80% → Denied → Referred to provider for self-pay option
5. **Patient Onboarding** → Medical intake + profile information
6. **Patient Profile** → EHR-compatible fields
7. **Patient Dashboard** → Track progress, schedule sessions, access care plan

### Flow 2: Homepage Entry (All Users)
1. **Homepage** → "Healing Through the Power of Music" + 4 portal cards
2. **Create Account / Sign In** → OAuth authentication
3. **Portal Selection Dashboard** → 4 cards:
   - **Patient Portal** (Blue) → "Track your progress, schedule sessions, and manage your care plan" → BUILT
   - **Training Academy** (Green) → "Become a certified facilitator through our comprehensive training program" → BUILT (current system)
   - **Facilitator Portal** (Purple) → "Manage your patients, track sessions, and track" → COMING SOON
   - **Provider Portal** (Orange) → "Oversee your organization's facilitators, analytics, and compliance" → COMING SOON

## Key Features

### Patient Dashboard (Page 6)
- **Sidebar Navigation**: Dashboard, Settings
- **Upcoming Session Card**: Shows next session date/time, facilitator, "Join Zoom Session" button, "Add to Calendar" button
- **Schedule Sessions Button** → Opens calendar picker
- **9-Week RTM Protocol Grid**: 9 weeks × 7 days = 63 days of content modules
- **Contact Section**: Contact Facilitator, Contact Provider, Crisis Support (Call 988)

### Session Scheduling (Page 7)
- **Calendar Picker**: Month view with date selection
- **Time Picker**: Dropdown for time slots
- **Appointment Confirmation**: Shows date, time, facilitator ID
- **Confirm Appointment** → Triggers RTM content drip (days 2-7)
- **Dashboard Button** → Returns to patient dashboard

## Assessment Details (Page 4)
- **25 questions**
- **75 points total** (3 points per question)
- **Passing threshold**: 80% (60 points)
- **Approval triggers**: Real-time notification + insurance pre-auth process
- **Denial triggers**: Provider referral for self-pay option

## Technical Requirements

### Database Schema Additions Needed
1. **Patient Assessment**:
   - `patientAssessments` table (25 questions, scoring, approval status)
   - Assessment questions table
   - Assessment responses table

2. **Patient Onboarding**:
   - Medical intake fields (EHR-compatible)
   - Insurance information
   - Emergency contacts

3. **RTM Content**:
   - 9-week × 7-day content modules (63 modules total)
   - Content delivery scheduling
   - Progress tracking per day

4. **Session Scheduling**:
   - Available time slots
   - Facilitator availability
   - Calendar integration

### UI Components Needed
1. **QR Code Landing Page** (public, no auth)
2. **Patient Landing Page** (public, no auth)
3. **Assessment Flow** (multi-step form, 25 questions)
4. **Patient Onboarding** (medical intake form)
5. **Patient Dashboard** (authenticated, patient role)
6. **Session Scheduling Modal** (calendar + time picker)
7. **Portal Selection Dashboard** (authenticated, all roles)
8. **Coming Soon Pages** (Facilitator Portal, Provider Portal)

### Homepage Structure
- **Hero Section**: "Healing Through the Power of Music"
- **4 Portal Cards**: Patient, Training, Facilitator, Provider
- **Quick Actions**: View Training Videos, View Session Recordings, Contact Support
- **CTA**: Sign Up / Sign In buttons

## Implementation Strategy

### Phase 1: Homepage + Portal Router
- Create new homepage with 4 portal cards
- Add portal selection dashboard after authentication
- Route users based on role + selection

### Phase 2: Patient Assessment
- Build 25-question assessment
- Implement scoring logic (80% threshold)
- Add approval/denial workflow
- Send notifications

### Phase 3: Patient Onboarding
- Medical intake form
- Insurance information capture
- Profile creation

### Phase 4: Patient Dashboard
- Dashboard layout with sidebar
- Upcoming session card
- 9-week RTM protocol grid
- Contact section

### Phase 5: Session Scheduling
- Calendar picker component
- Time slot selection
- Facilitator assignment
- Zoom link generation
- RTM content drip trigger

### Phase 6: Coming Soon Pages
- Facilitator Portal placeholder
- Provider Portal placeholder
