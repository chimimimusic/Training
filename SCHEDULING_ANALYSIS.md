# Custom Scheduling System - Development Analysis

## Executive Summary

This document provides a comprehensive analysis of building a custom scheduling system for SoundBridge Health, including development timeline, costs, integration requirements, and a detailed cost comparison with Calendly.

---

## 1. Development Time & Cost Estimate

### Phase 1: Core Scheduling Features (2-3 weeks)

**Week 1: Foundation & Availability Management**
- Database schema for appointments, availability, and time slots
- Facilitator availability interface (set weekly schedule)
- Timezone handling and conversion logic
- **Estimated Hours:** 40 hours
- **Cost at $100/hr:** $4,000
- **Cost at $150/hr:** $6,000

**Week 2: Patient Booking & Calendar UI**
- Browse available facilitators
- View available time slots in patient's timezone
- Book 30-minute appointment
- Booking confirmation page
- **Estimated Hours:** 40 hours
- **Cost at $100/hr:** $4,000
- **Cost at $150/hr:** $6,000

**Week 3: Notifications & Management**
- Email confirmation system
- Reminder emails (24hr before appointment)
- Cancellation and rescheduling logic
- Admin appointment dashboard
- **Estimated Hours:** 40 hours
- **Cost at $100/hr:** $4,000
- **Cost at $150/hr:** $6,000

**Phase 1 Total:**
- **Time:** 2-3 weeks (120 hours)
- **Cost Range:** $12,000 - $18,000

### Phase 2: Advanced Features (1-2 weeks)

**Google Calendar Integration**
- OAuth setup for facilitator calendar access
- Two-way sync to prevent double-booking
- Automatic event creation/updates
- **Estimated Hours:** 30 hours
- **Cost at $100/hr:** $3,000
- **Cost at $150/hr:** $4,500

**Buffer Times & Business Rules**
- Configurable buffer between appointments
- Minimum advance booking time
- Maximum booking window
- Block-out dates for holidays/PTO
- **Estimated Hours:** 20 hours
- **Cost at $100/hr:** $2,000
- **Cost at $150/hr:** $3,000

**Phase 2 Total:**
- **Time:** 1-2 weeks (50 hours)
- **Cost Range:** $5,000 - $7,500

### Phase 3: LMS Integration & Tracking (1 week)

**Attendance Tracking**
- Mark appointments as completed/no-show
- Link appointments to patient records
- Session notes and documentation
- **Estimated Hours:** 20 hours
- **Cost at $100/hr:** $2,000
- **Cost at $150/hr:** $3,000

**Reporting & Analytics**
- Facilitator utilization reports
- Patient attendance rates
- Revenue tracking
- Export functionality
- **Estimated Hours:** 20 hours
- **Cost at $100/hr:** $2,000
- **Cost at $150/hr:** $3,000

**Phase 3 Total:**
- **Time:** 1 week (40 hours)
- **Cost Range:** $4,000 - $6,000

### Total Development Investment

| Phase | Time | Cost Range |
|-------|------|------------|
| Phase 1: Core Features | 2-3 weeks | $12,000 - $18,000 |
| Phase 2: Advanced Features | 1-2 weeks | $5,000 - $7,500 |
| Phase 3: LMS Integration | 1 week | $4,000 - $6,000 |
| **TOTAL** | **4-6 weeks** | **$21,000 - $31,500** |

### Ongoing Maintenance Costs

**Annual Maintenance (estimated):**
- Bug fixes and minor updates: $2,000 - $4,000/year
- Email service (SendGrid/AWS SES): $200 - $500/year
- Server/infrastructure: Included in current hosting
- **Total Annual Maintenance:** $2,200 - $4,500/year

---

## 2. LMS Integration for Attendance Tracking

### Integration Architecture

```
Patient Booking Flow:
1. Patient browses facilitators → 2. Selects time slot → 3. Books appointment
                                                                    ↓
4. Appointment record created ← 5. Email confirmation sent ← 6. Calendar event created
                ↓
7. Linked to patient's user record in LMS
```

### Data Points Required

#### A. Appointment Record (New Table: `appointments`)
```sql
CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  facilitatorId INT NOT NULL,           -- Links to users table
  patientId INT,                        -- Links to users table (if registered)
  patientName VARCHAR(255),             -- For non-registered patients
  patientEmail VARCHAR(320) NOT NULL,
  patientPhone VARCHAR(20),
  
  -- Scheduling Details
  appointmentDate DATETIME NOT NULL,
  durationMinutes INT DEFAULT 30,
  timezone VARCHAR(50) NOT NULL,
  
  -- Status Tracking
  status ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'),
  bookingSource ENUM('web', 'admin', 'referral'),
  
  -- Attendance Tracking
  attendedAt DATETIME,                  -- When patient joined
  completedAt DATETIME,                 -- When session ended
  sessionDurationMinutes INT,           -- Actual duration
  facilitatorNotes TEXT,                -- Post-session notes
  
  -- Metadata
  createdAt DATETIME DEFAULT NOW(),
  updatedAt DATETIME DEFAULT NOW() ON UPDATE NOW(),
  cancelledAt DATETIME,
  cancellationReason TEXT
);
```

#### B. Integration Points with Existing LMS

**1. User Module Progress Tracking**
- After appointment marked "completed", trigger progress update
- Link appointment to specific training module (if applicable)
- Update `userModuleProgress.lastActivityAt`

**2. Engagement Logging**
- Create engagement log entry when appointment is booked
- Log type: `appointment_scheduled`
- Track: facilitator chosen, date selected, booking source

**3. Provider Dashboard**
- Show appointments for patients referred by each provider
- Display completion rates and attendance statistics
- Link to patient training progress

**4. Facilitator Dashboard**
- View upcoming appointments
- Mark attendance (completed/no-show)
- Add session notes
- View patient's training progress before session

#### C. Attendance Tracking Workflow

**Step 1: Pre-Appointment (24 hours before)**
- Send reminder email to patient
- Send reminder email to facilitator
- Update status to "confirmed" if patient clicks confirmation link

**Step 2: During Appointment Window**
- Facilitator marks patient as "attended" when they join
- System records `attendedAt` timestamp
- Timer starts for session duration tracking

**Step 3: Post-Appointment**
- Facilitator marks session as "completed"
- Adds session notes (optional)
- System records `completedAt` timestamp
- Calculates actual session duration
- Updates patient engagement metrics

**Step 4: No-Show Handling**
- If 15 minutes past appointment time with no attendance mark
- System automatically marks as "no_show"
- Sends follow-up email to patient offering rescheduling

#### D. API Endpoints Needed

```typescript
// Booking
POST /api/appointments/book
GET /api/appointments/availability/:facilitatorId
POST /api/appointments/:id/cancel
POST /api/appointments/:id/reschedule

// Attendance Tracking
POST /api/appointments/:id/mark-attended
POST /api/appointments/:id/mark-completed
POST /api/appointments/:id/mark-no-show
PUT /api/appointments/:id/notes

// Reporting
GET /api/appointments/facilitator/:id/upcoming
GET /api/appointments/patient/:id/history
GET /api/appointments/provider/:id/referrals
GET /api/reports/attendance-summary
```

#### E. Automated Triggers

1. **On Appointment Booked:**
   - Create appointment record
   - Send confirmation email to patient
   - Send notification to facilitator
   - Create calendar event
   - Log engagement activity

2. **On Appointment Completed:**
   - Update appointment status
   - Calculate session duration
   - Update patient engagement metrics
   - Trigger follow-up email (optional)
   - Update provider dashboard statistics

3. **On No-Show:**
   - Mark appointment as no_show
   - Send rescheduling offer to patient
   - Notify facilitator
   - Update attendance rate metrics

---

## 3. Cost Comparison: Calendly vs. Custom System

### Calendly Pricing Structure

**Professional Plan:** $12/user/month (billed annually)
- Unlimited event types
- Calendar integrations
- Email reminders and notifications
- Customizable booking pages
- Payment processing integration

**Teams Plan:** $16/user/month (billed annually)
- Everything in Professional
- Round-robin scheduling
- Admin controls
- Team analytics

### Cost Comparison Table

| Facilitators | Calendly Professional (Monthly) | Calendly Professional (Annual) | Calendly Teams (Monthly) | Calendly Teams (Annual) |
|--------------|--------------------------------|-------------------------------|-------------------------|------------------------|
| 10 | $120 | $1,440 | $160 | $1,920 |
| 25 | $300 | $3,600 | $400 | $4,800 |
| 50 | $600 | $7,200 | $800 | $9,600 |
| 75 | $900 | $10,800 | $1,200 | $14,400 |
| **100** | **$1,200** | **$14,400** | **$1,600** | **$19,200** |
| 150 | $1,800 | $21,600 | $2,400 | $28,800 |
| 200 | $2,400 | $28,800 | $3,200 | $38,400 |

### Custom System Costs

| Cost Component | One-Time | Annual | 5-Year Total |
|----------------|----------|--------|--------------|
| **Initial Development** | $21,000 - $31,500 | - | $21,000 - $31,500 |
| **Maintenance & Updates** | - | $2,200 - $4,500 | $11,000 - $22,500 |
| **Email Service (SendGrid)** | - | $200 - $500 | $1,000 - $2,500 |
| **TOTAL** | $21,000 - $31,500 | $2,400 - $5,000 | $33,000 - $56,500 |

### Break-Even Analysis

#### Scenario 1: 100 Facilitators (Calendly Professional @ $14,400/year)

| Year | Calendly Cost | Custom System Cost | Cumulative Savings |
|------|--------------|-------------------|-------------------|
| Year 1 | $14,400 | $26,500 (dev) + $2,500 (maint) = $29,000 | -$14,600 |
| Year 2 | $14,400 | $2,500 | -$2,700 |
| Year 3 | $14,400 | $2,500 | +$9,200 |
| Year 4 | $14,400 | $2,500 | +$21,100 |
| Year 5 | $14,400 | $2,500 | +$32,900 |

**Break-even point:** ~2.2 years

#### Scenario 2: 50 Facilitators (Calendly Professional @ $7,200/year)

| Year | Calendly Cost | Custom System Cost | Cumulative Savings |
|------|--------------|-------------------|-------------------|
| Year 1 | $7,200 | $29,000 | -$21,800 |
| Year 2 | $7,200 | $2,500 | -$17,100 |
| Year 3 | $7,200 | $2,500 | -$12,400 |
| Year 4 | $7,200 | $2,500 | -$7,700 |
| Year 5 | $7,200 | $2,500 | -$3,000 |

**Break-even point:** ~5.2 years

### 5-Year Total Cost Comparison

| Facilitator Count | Calendly (5 years) | Custom System (5 years) | Savings |
|-------------------|-------------------|------------------------|---------|
| 25 | $18,000 | $33,000 | -$15,000 (Calendly cheaper) |
| 50 | $36,000 | $33,000 | +$3,000 (Custom cheaper) |
| 75 | $54,000 | $33,000 | +$21,000 (Custom cheaper) |
| **100** | **$72,000** | **$33,000** | **+$39,000 (Custom cheaper)** |
| 150 | $108,000 | $33,000 | +$75,000 (Custom cheaper) |
| 200 | $144,000 | $33,000 | +$111,000 (Custom cheaper) |

---

## 4. Recommendation Matrix

### Use Calendly If:
- ✅ You have fewer than 30 facilitators
- ✅ You need to launch quickly (within 1-2 weeks)
- ✅ You want facilitators to manage their own schedules independently
- ✅ You prefer proven, reliable infrastructure with no maintenance burden
- ✅ You're still validating the business model

### Build Custom System If:
- ✅ You have 50+ facilitators (or plan to within 2 years)
- ✅ You need tight integration with LMS for attendance tracking
- ✅ You want full control over patient data for HIPAA compliance
- ✅ You need custom business rules (e.g., require training completion before booking)
- ✅ You want to avoid $10k-20k/year recurring costs long-term

### Hybrid Approach (Recommended):
1. **Start with Calendly** for first 20-30 facilitators
2. **Collect data** on booking patterns, no-show rates, and feature requests
3. **Build custom system** when you hit 30-50 facilitators
4. **Migrate gradually** - keep Calendly as backup during transition

---

## 5. Additional Considerations

### Calendly Advantages
- **Reliability:** 99.9% uptime SLA
- **Support:** 24/7 customer support
- **Features:** Payment processing, SMS reminders, video conferencing integration
- **Mobile apps:** Native iOS/Android apps for facilitators
- **Integrations:** Zoom, Google Meet, Salesforce, HubSpot, etc.

### Custom System Advantages
- **Data ownership:** All patient data stays in your database
- **Customization:** Build exactly what you need (group sessions, smart matching, etc.)
- **Branding:** Fully white-labeled experience
- **Cost savings:** Significant at scale (100+ facilitators)
- **LMS integration:** Seamless attendance tracking and progress linking

### Risk Factors

**Calendly Risks:**
- Price increases (Calendly has raised prices 20-30% in past 3 years)
- Vendor lock-in (hard to migrate off once established)
- Limited customization for complex business rules
- Data privacy concerns (patient info in third-party system)

**Custom System Risks:**
- Development delays or cost overruns
- Bugs and reliability issues in early stages
- Ongoing maintenance burden
- Need technical expertise for updates
- Feature parity takes time to achieve

---

## Conclusion

**For SoundBridge Health's current stage (launching with test facilitators), I recommend:**

1. **Use Calendly for initial launch** - Fast, reliable, and cost-effective for <30 facilitators
2. **Monitor growth** - Track when you approach 30-50 facilitators
3. **Build custom system** when you hit 40-50 facilitators (break-even at ~2 years)
4. **Budget $25k-30k** for custom development when the time comes

This approach minimizes upfront risk while positioning you for long-term cost savings and better LMS integration as you scale.
