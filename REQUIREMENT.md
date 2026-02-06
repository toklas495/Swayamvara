# Requirements Specification - Kunbi Samaj Matrimony Platform

## 1. Overview

A structured, community-focused matrimony application designed for the Kunbi Samaj. Includes identity verification, family-driven approvals, match discovery, interest workflow, media sharing, and a full admin review system. Built as a monolithic Node.js-based architecture with web + mobile interfaces.

---

## 2. Core Objectives

* Provide a secure, verified matrimony platform.
* Keep onboarding simple and authenticate via mobile number.
* Enable document-driven community verification.
* Offer deep profile data capture for high-quality matching.
* Implement interest, approval, and connection workflows.
* Provide full admin review for authenticity and safety.
* Maintain user privacy with staged unlocking of sensitive information.
* Support both web and Android/iOS clients.

---

## 3. Platform Components

* User Web Application (Next.js)
* Mobile Application (React Native)
* Backend API (Node.js + Fastify)
* PostgreSQL Database
* Redis (cache, OTP rate limit)
* File Storage (Cloudflare R2 / S3-compatible)
* Admin Panel (Next.js)
* Notification System (SMS, Email, Push)

---

## 4. Functional Requirements

### 4.1 User Registration & Authentication

* OTP login via mobile number.
* Automatic account creation if new.
* Basic information capture on first login.
* Duplicate mobile number prevention.
* Device history tracking.

### 4.2 Profile Creation

Mandatory profile sections:

* Personal Information
* Education & Occupation
* Family Details
* Lifestyle & Preferences
* Languages
* Religion & Caste (Kunbi specific)
* Horoscope (optional)
* Partner Expectations
* Profile Photos (5–8 images)
* Intro Video (optional)
* Social Media Links

### 4.3 Document Verification

* Upload ID proof (Aadhaar/PAN/etc.).
* Automatic checklist for required fields.
* Admin/Committee manual approval or rejection.
* Status tracking (Pending, Approved, Rejected).

### 4.4 Family Approval

* User nominates a family member.
* Family member receives a verification link.
* Profile only becomes public after family approval.

### 4.5 Profile Browsing & Matching

* Home feed with browseable profiles.
* Filters:

  * Age range
  * Height
  * Education
  * Occupation
  * Marital status
  * Location
  * Community-specific fields
* Shortlist feature.

### 4.6 Profile Viewing

* Multi-step privacy:

  1. Basic Info: Visible to all.
  2. Full Info: Visible after interest acceptance.
  3. Contact/Social: Visible after mutual acceptance.
* Photo watermarking.
* Restricted screenshot areas (mobile).

### 4.7 Interest Workflow

* Send Interest.
* Ask-a-question-before-accept feature.
* Accept / Reject.
* Automatic notification flow.
* Reminders for unanswered interests.

### 4.8 Connection System

* When interest is mutually accepted:

  * Contact number unlock.
  * Social media unlock.
  * Private chat option (optional future module).
* Connection states:

  * New
  * In Discussion
  * Meeting Scheduled
  * Closed / Not Moving Forward
  * Engaged

### 4.9 Meeting & Feedback

* Schedule meeting via in-app interface.
* Location/time notes.
* Optional feedback form.

### 4.10 Success Stories

* Users can submit engagement/marriage success.
* Admin-verification for approval.
* Photo + story text.

### 4.11 Notifications

* SMS for OTP and approval updates.
* Push notifications for interest actions.
* Email for administrative updates.

### 4.12 Admin Panel Features

* Member list with filters.
* Document verification module.
* Profile edit/view.
* Flagged profiles and reports.
* Success story moderation.
* Analytics dashboard:

  * Total profiles
  * Approved / Pending
  * Interests sent/received
  * Matches formed
* Logs and audit history.

---

## 5. Non-Functional Requirements

### 5.1 Security

* OTP authentication with rate limiting.
* Encrypted media storage.
* Server-side validation for all requests.
* SQL injection & XSS protection.
* Strong RBAC (User, Admin, Committee).
* Secure API with JWT + refresh token.

### 5.2 Performance

* Handle 5,000–10,000 registered users.
* 150–300 concurrent active users.
* API response time < 200ms under normal load.

### 5.3 Reliability

* Daily automated backups.
* Basic monitoring (CPU, DB, storage).
* Error tracking via Sentry.

### 5.4 Privacy

* Photos watermarked.
* Contact details hidden until mutual acceptance.
* Family approval mandatory before visibility.

---

## 6. System Architecture

* Monolithic backend app.
* CDN-based content delivery.
* Redis for caching and OTP throttling.
* PostgreSQL for relational data.
* Object storage for photos/videos.

---

## 7. API Requirements

* Auth & OTP APIs
* Profile CRUD APIs
* Document upload & verification APIs
* Interest system APIs
* Connection workflow APIs
* Admin APIs
* Notification APIs

(A complete API contract can be produced separately.)

---

## 8. Mobile App Requirements

* Android first (React Native)
* iOS optional in Phase 2
* Offline caching for profile browsing
* Push notification integration

---

## 9. Web App Requirements

* Responsive UI
* SEO-friendly landing pages
* Full profile editing capability
* Admin Panel on web only

---

## 10. Deployment Requirements

* Hosting: DigitalOcean / Hetzner
* CI/CD for smooth deployment
* Environment separation (dev/prod)
* SSL certificate

---

## 11. Storage Requirements

* Photo storage ~100–200 MB/user (max)
* Video storage optional for intro clips
* Daily backups with 30-day retention

---

## 12. Logging & Monitoring

* Error tracking
* Request logging
* Admin audit logs

---

## 13. Future Enhancements (Phase 2/3)

* iOS application
* Video calls (approval-based)
* Subscription plans
* In-app chat
* Community-wide announcements
* Matrimony event management

---

## 14. Acceptance Criteria

* All required flows functional end-to-end
* Admin panel operational
* 99% uptime target
* Secure OTP & document verification
* Minimal page load < 2 seconds

---

## 15. Pricing

### 15.1 Development Costs

* MVP (3 months): ₹3,00,000 – ₹3,50,000
* Phase 2 Enhancements (3 months): ₹2,00,000 – ₹2,50,000
* Phase 3 Polish + Optimization (3 months): ₹1,50,000 – ₹2,00,000
* **Total Year 1 Development:** ₹7,00,000 – ₹8,00,000

### 15.2 Monthly Operational Costs (Launch Stage)

For 500–2,000 active users:

* Server (4–8 GB): ₹2,000 – ₹4,000
* DB (managed): ₹1,200 – ₹2,000
* Storage (photos/videos): ₹0 – ₹50
* SMS (OTP + alerts): ₹150 – ₹600
* Monitoring & backups: ₹300 – ₹500
* **Total Monthly:** ₹5,000 – ₹7,500

### 15.3 Monthly Operational Costs (Scaled Stage)

For 2,000–5,000 active users:

* Larger server + DB: ₹7,000 – ₹10,000
* Higher SMS volume: ₹1,000 – ₹1,500
* Storage & CDN: ₹300 – ₹600
* Monitoring + logs: ₹1,000
* **Total Monthly:** ₹16,000 – ₹17,500

### 15.4 High Scale Costs

For 5,000–10,000 active users:

* Server + DB heavy: ₹15,000 – ₹20,000
* SMS: ₹1,500 – ₹3,000
* Storage + CDN: ₹700 – ₹1,200
* Monitoring + backups: ₹1,000
* **Total Monthly:** ₹25,000 – ₹35,000

### 15.5 Year 1 Total Investment

* Development: ₹7–8 lakh
* Operations (12 months avg ₹7,000): ₹84,000
* Domain + setup: ₹25,000
* Contingency: ₹70,000 – ₹80,000
* **Year 1 Total:** ₹9–10 lakh

## 16. Final Notes

This requirements document defines the full scope needed to build the Kunbi Samaj Matrimony Platform using a monolithic architecture, supporting both web and mobile clients with robust verification and structured match workflows.
