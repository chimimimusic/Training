# Patient Journey Analysis

## Complete Flow from Wireframe

### Stage One: Assessment & Approval
1. Physician referral
2. Patient scans QR code → `/patient-intake`
3. Patient fills out 25-question assessment → `/assessment/patient-intake`
4. Assessment results rendered in real-time → `/assessment-result/:id`
5. **If Approved (≥80%):** Patient/Provider notified → Pre-authorization process begins
6. **If Denied (<80%):** Patient/Provider notified → Provider suggests self-pay option
7. Authorization approved → Patient progresses to Stage Two

### Stage Two: Onboarding & Scheduling
1. Patient completes onboarding questionnaires (medical intake, insurance, emergency contacts)
2. Patient reviews available facilitators (from facilitator directory)
3. Patient selects facilitator
4. Patient directed to scheduling calendar
5. Patient selects appointment time for Session 1
6. Provider/Patient/Facilitator all notified
7. Patient progresses to Stage Three

### Stage Three: 10-Session Protocol + RTM Content
**Pattern repeats 10 times (Sessions 1-10):**

1. Facilitator reviews patient onboarding info before session
2. Session begins (Zoom telehealth)
3. Facilitator follows session script
4. Session ends
5. Session recorded/transcribed/sent to provider
6. Patient schedules next session (1 week later)
7. **RTM (Remote Therapy Monitoring) Week initiated:**
   - Days 2-7: Patient accesses daily content modules
   - 7 days of content between each session
   - 10 sessions × 7 days = 70 days total (but we said 63 modules in wireframe v2, so 9 weeks × 7 days)

## What We've Already Built

✅ **Stage One - Complete:**
- QR code landing page (`/patient-intake`)
- 25-question assessment (`/assessment/patient-intake`)
- Assessment result page (`/assessment-result/:id`)
- Database table: `patientIntakeResponses`
- Scoring logic (80% threshold)
- Google Sheets backup

❌ **Stage Two - Missing:**
- Patient onboarding questionnaires
- Facilitator selection UI (we have facilitator directory for training portal, need patient-facing version)
- Scheduling calendar integration
- Patient account creation (link assessment → user account)

❌ **Stage Three - Missing:**
- Patient dashboard
- RTM content database (63 modules: 9 weeks × 7 days)
- RTM content delivery system (drip after session confirmation)
- Session recording/transcription workflow
- Provider notification system

## Key Questions to Resolve

1. **Patient Accounts:** Should patients be `users` with role="patient" or separate `patients` table?
   - Current `patients` table is for facilitator session management
   - Need to decide: merge or separate?

2. **Onboarding Timing:** When does patient create account?
   - After assessment approval?
   - After insurance pre-auth?
   - Manual admin creation?

3. **RTM Content:** Do you have the 63 modules ready, or should I create placeholder structure?

4. **Session Recording:** How are sessions recorded/transcribed? Manual upload or automated?

5. **Provider Portal:** The wireframe shows provider notifications - is this part of the Provider Portal (coming soon)?
