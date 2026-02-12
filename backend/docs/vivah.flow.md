# 🎯 COMPLETE KUNBI VIVAH SYSTEM FLOW

I'll create comprehensive flow diagrams using **ASCII art** and **tables** for better clarity and copyability.

---

## 📱 1. COMPLETE USER JOURNEY MAP

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          KUNBI VIVAH USER FLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

START: User Opens App
    |
    ├─> [PHASE 1: AUTHENTICATION] ──────────────────────────────────────────┐
    │                                                                        │
    │   Step 1: Enter Phone Number                                          │
    │   ├─> POST /api/v1/auth/send-otp                                     │
    │   │   Input: { phone: "9876543210" }                                 │
    │   │   Backend:                                                        │
    │   │   - Check rate limit (max 3 OTPs/hour)                          │
    │   │   - Generate 6-digit OTP                                         │
    │   │   - Hash OTP with bcrypt                                         │
    │   │   - Save to otp_requests table                                   │
    │   │   - Send SMS via MSG91                                           │
    │   │   Output: { success: true, message: "OTP sent" }                │
    │   │                                                                   │
    │   Step 2: Enter OTP Code                                             │
    │   ├─> POST /api/v1/auth/verify-otp                                  │
    │   │   Input: { phone, otp, deviceFingerprint, fcmToken }           │
    │   │   Backend:                                                       │
    │   │   - Find OTP in database                                        │
    │   │   - Verify with bcrypt.compare()                                │
    │   │   - If wrong: increment attempts, reject                        │
    │   │   - If correct:                                                 │
    │   │     → Check if user exists (SELECT from users)                  │
    │   │     → If new: INSERT into users table                           │
    │   │     → INSERT/UPDATE device in devices table                     │
    │   │     → Generate JWT access token (15min expiry)                  │
    │   │     → Generate refresh token (7 day expiry)                     │
    │   │     → Hash refresh token                                        │
    │   │     → INSERT into sessions table                                │
    │   │   Output: { accessToken, refreshToken }                         │
    │   │                                                                  │
    │   Step 3: Check Profile Status                                       │
    │   ├─> GET /api/v1/profiles/me                                       │
    │   │   Headers: { Authorization: "Bearer {accessToken}" }            │
    │   │   Backend:                                                       │
    │   │   - Verify JWT token                                            │
    │   │   - Extract userId from token                                   │
    │   │   - SELECT profile WHERE user_id = userId                       │
    │   │   Output:                                                        │
    │   │   - If profile exists: { profile data }                         │
    │   │   - If not: { profile: null }                                   │
    │   │                                                                  │
    │   Decision Point: Has Profile?                                       │
    │   ├─> YES: Go to PHASE 4 (Dashboard)                               │
    │   └─> NO:  Go to PHASE 2 (Profile Creation)                        │
    │                                                                       │
    └───────────────────────────────────────────────────────────────────────┘

    ├─> [PHASE 2: PROFILE CREATION] ────────────────────────────────────────┐
    │                                                                        │
    │   STEP 1: Basic Information & Village Verification                    │
    │   ├─> POST /api/v1/profiles/create/step1                            │
    │   │   Input: {                                                       │
    │   │     fullName: "Rahul Kumar",                                    │
    │   │     fatherName: "Ramesh Kumar",                                 │
    │   │     dateOfBirth: "2003-05-15",                                  │
    │   │     gender: "male",                                             │
    │   │     villageId: "uuid-of-mathni-village"                         │
    │   │   }                                                              │
    │   │   Backend Validation:                                            │
    │   │   - Check age >= 18 (calculate from DOB)                        │
    │   │   - Verify village exists in villages table                     │
    │   │   - Check village.district = "Betul"                            │
    │   │   - Check village.state = "Madhya Pradesh"                      │
    │   │   - If validation fails: REJECT with error                      │
    │   │   - If validation passes:                                       │
    │   │     → INSERT into profiles table (partial data)                 │
    │   │     → completed_at = NULL (profile incomplete)                  │
    │   │   Output: { profileId, step: 1 }                                │
    │   │                                                                  │
    │   STEP 2: Education, Career & Family                                 │
    │   ├─> POST /api/v1/profiles/create/step2                            │
    │   │   Input: {                                                       │
    │   │     education: "BTech Computer Science",                        │
    │   │     occupation: "Software Engineer",                            │
    │   │     incomeAnnual: 800000,                                       │
    │   │     heightCm: 175,                                              │
    │   │     maritalStatus: "never_married",                             │
    │   │     siblingsJson: { brothers: 0, sisters: 1, married: 1 }      │
    │   │   }                                                              │
    │   │   Backend:                                                       │
    │   │   - UPDATE profiles SET education=..., occupation=... WHERE id  │
    │   │   Output: { success: true, step: 2 }                            │
    │   │                                                                  │
    │   STEP 3: About Me & Partner Preferences                            │
    │   ├─> POST /api/v1/profiles/create/step3                            │
    │   │   Input: {                                                       │
    │   │     aboutMe: "Traditional values, modern outlook...",           │
    │   │     preferences: {                                               │
    │   │       ageMin: 21, ageMax: 28,                                   │
    │   │       heightMinCm: 150, heightMaxCm: 170,                       │
    │   │       educationPreference: "Graduate,Post Graduate",            │
    │   │       villagePreference: "Betul,Nearby"                         │
    │   │     }                                                            │
    │   │   }                                                              │
    │   │   Backend:                                                       │
    │   │   - UPDATE profiles SET about_me = ...                          │
    │   │   - INSERT into profile_preferences                             │
    │   │   Output: { success: true, step: 3 }                            │
    │   │                                                                  │
    │   STEP 4: Complete Profile                                           │
    │   ├─> POST /api/v1/profiles/complete                                │
    │   │   Backend:                                                       │
    │   │   - Validate all required fields filled                         │
    │   │   - UPDATE profiles SET completed_at = NOW()                    │
    │   │   - UPDATE profiles SET profile_status = 'active'               │
    │   │   Output: { success: true, profile: {full data} }               │
    │   │                                                                  │
    │   STEP 5: Upload Photos (Optional)                                   │
    │   ├─> POST /api/v1/photos/upload                                    │
    │   │   Input: FormData { photo: File, isPrimary: true }              │
    │   │   Backend:                                                       │
    │   │   - Upload to AWS S3 / Cloudinary                               │
    │   │   - Generate watermarked version                                │
    │   │   - INSERT into profile_photos                                  │
    │   │   - status = 'approved' (auto for now)                          │
    │   │   Output: { photoUrl, photoId }                                 │
    │   │                                                                  │
    │   └─> Profile Created Successfully!                                  │
    │       Go to PHASE 4 (Dashboard)                                      │
    │                                                                       │
    └───────────────────────────────────────────────────────────────────────┘

    ├─> [PHASE 3: SEARCH & BROWSE] ─────────────────────────────────────────┐
    │                                                                        │
    │   User Clicks: "Find Matches"                                         │
    │   ├─> GET /api/v1/villages                                           │
    │   │   Purpose: Get village list for filters                          │
    │   │   Output: [{ id, villageName, taluka, district }]               │
    │   │                                                                  │
    │   User Sets Filters & Clicks Search                                  │
    │   ├─> POST /api/v1/search/profiles                                  │
    │   │   Input: {                                                       │
    │   │     gender: "female",                                           │
    │   │     ageMin: 21, ageMax: 28,                                     │
    │   │     heightMinCm: 150, heightMaxCm: 170,                         │
    │   │     education: ["Graduate", "Post Graduate"],                   │
    │   │     occupation: ["Teacher", "Government"],                      │
    │   │     villageIds: ["uuid1", "uuid2"],                             │
    │   │     page: 1, limit: 20                                          │
    │   │   }                                                              │
    │   │   Backend Logic:                                                 │
    │   │   ┌────────────────────────────────────────────────────┐        │
    │   │   │ SELECT p.id, p.gender,                             │        │
    │   │   │   EXTRACT(YEAR FROM AGE(p.date_of_birth)) as age,  │        │
    │   │   │   p.height_cm, p.education, p.occupation,          │        │
    │   │   │   v.village_name, v.taluka                         │        │
    │   │   │ FROM profiles p                                     │        │
    │   │   │ JOIN villages v ON p.village_id = v.id            │        │
    │   │   │ WHERE p.profile_status = 'active'                  │        │
    │   │   │   AND p.completed_at IS NOT NULL                   │        │
    │   │   │   AND p.gender = 'female'                          │        │
    │   │   │   AND EXTRACT(YEAR FROM AGE(p.date_of_birth))      │        │
    │   │   │       BETWEEN 21 AND 28                            │        │
    │   │   │   AND p.height_cm BETWEEN 150 AND 170              │        │
    │   │   │   AND p.education IN ('Graduate', 'Post Graduate') │        │
    │   │   │   AND p.village_id IN ('uuid1', 'uuid2')           │        │
    │   │   │   AND p.id NOT IN (                                │        │
    │   │   │     -- Exclude blocked profiles                    │        │
    │   │   │     SELECT blocked_profile_id FROM blocks          │        │
    │   │   │     WHERE blocker_profile_id = {current_profile_id}│        │
    │   │   │   )                                                 │        │
    │   │   │   AND p.id != {current_profile_id}                 │        │
    │   │   │ ORDER BY p.created_at DESC                         │        │
    │   │   │ LIMIT 20 OFFSET 0                                  │        │
    │   │   └────────────────────────────────────────────────────┘        │
    │   │   Output: {                                                      │
    │   │     profiles: [                                                  │
    │   │       {                                                          │
    │   │         id: "KB-BTL-F-047",  // Anonymous ID                    │
    │   │         age: 24,                                                │
    │   │         heightCm: 163,                                          │
    │   │         education: "Graduate",                                  │
    │   │         occupation: "Teacher",                                  │
    │   │         villageName: "Mathni",                                  │
    │   │         taluka: "Betul"                                         │
    │   │         // NO: name, photos, phone, address                     │
    │   │       }                                                          │
    │   │     ],                                                           │
    │   │     total: 47,                                                   │
    │   │     page: 1,                                                     │
    │   │     totalPages: 3                                                │
    │   │   }                                                              │
    │   │                                                                  │
    │   User Clicks: "View Profile"                                        │
    │   ├─> GET /api/v1/profiles/{profileId}                              │
    │   │   Backend Logic (STAGE 1 - Anonymous View):                     │
    │   │   ┌────────────────────────────────────────────────────┐        │
    │   │   │ 1. Check if blocked:                               │        │
    │   │   │    SELECT * FROM blocks WHERE                      │        │
    │   │   │    blocker_profile_id = {profileId} AND            │        │
    │   │   │    blocked_profile_id = {current_profile_id}       │        │
    │   │   │    → If exists: REJECT (403 Forbidden)             │        │
    │   │   │                                                     │        │
    │   │   │ 2. Check connection status:                        │        │
    │   │   │    SELECT * FROM connections WHERE                 │        │
    │   │   │    (profile1_id = {profileId} AND                  │        │
    │   │   │     profile2_id = {current_profile_id}) OR         │        │
    │   │   │    (profile2_id = {profileId} AND                  │        │
    │   │   │     profile1_id = {current_profile_id})            │        │
    │   │   │                                                     │        │
    │   │   │ 3. Determine unlock stage:                         │        │
    │   │   │    - No connection: STAGE 1 (anonymous)            │        │
    │   │   │    - Connection exists + status='active':          │        │
    │   │   │        STAGE 2 (names + family photos)             │        │
    │   │   │    - Connection + status='family_approved':        │        │
    │   │   │        STAGE 3 (phone numbers)                     │        │
    │   │   │    - Connection + status='engaged':                │        │
    │   │   │        STAGE 4 (full access)                       │        │
    │   │   │                                                     │        │
    │   │   │ 4. Return data based on stage:                     │        │
    │   │   │    STAGE 1: {                                      │        │
    │   │   │      age, height, education, occupation,           │        │
    │   │   │      village, aboutMe, siblings,                   │        │
    │   │   │      preferences, maritalStatus                    │        │
    │   │   │      // Hidden: name, photos, phone                │        │
    │   │   │    }                                                │        │
    │   │   │                                                     │        │
    │   │   │ 5. Log profile view:                               │        │
    │   │   │    INSERT INTO audit_logs (                        │        │
    │   │   │      user_id, action, entity_type, entity_id       │        │
    │   │   │    ) VALUES (                                      │        │
    │   │   │      {current_user_id}, 'PROFILE_VIEW',            │        │
    │   │   │      'profile', {profileId}                        │        │
    │   │   │    )                                                │        │
    │   │   └────────────────────────────────────────────────────┘        │
    │   │   Output (STAGE 1): {                                           │
    │   │     profile: {                                                   │
    │   │       id: "KB-BTL-F-047",                                       │
    │   │       age: 24,                                                  │
    │   │       heightCm: 163,                                            │
    │   │       education: "B.Sc Biology",                               │
    │   │       occupation: "Government Teacher",                        │
    │   │       incomeAnnual: 500000,                                    │
    │   │       villageName: "Mathni",                                   │
    │   │       aboutMe: "Traditional values...",                        │
    │   │       siblings: { brothers: 1, sisters: 0 },                   │
    │   │       maritalStatus: "never_married",                          │
    │   │       preferences: { ageMin: 25, ageMax: 30, ... }             │
    │   │     },                                                           │
    │   │     unlockStage: 1,                                             │
    │   │     canSendInterest: true                                       │
    │   │   }                                                              │
    │   │                                                                  │
    │   └─> User Decides: Send Interest?                                  │
    │       YES: Go to PHASE 4 (Interest System)                          │
    │       NO: Continue browsing                                          │
    │                                                                       │
    └───────────────────────────────────────────────────────────────────────┘

    ├─> [PHASE 4: INTEREST SYSTEM] ─────────────────────────────────────────┐
    │                                                                        │
    │   User Clicks: "Send Interest"                                        │
    │   ├─> POST /api/v1/interests/send                                    │
    │   │   Input: {                                                        │
    │   │     receiverProfileId: "uuid-of-girl-profile",                  │
    │   │     message: "Hello, I found your profile suitable..." (optional)│
    │   │   }                                                               │
    │   │   Backend Validation:                                             │
    │   │   ┌────────────────────────────────────────────────────┐        │
    │   │   │ 1. Check daily limit:                              │        │
    │   │   │    SELECT COUNT(*) FROM interests WHERE            │        │
    │   │   │    sender_profile_id = {current_profile_id} AND    │        │
    │   │   │    DATE(sent_at) = CURRENT_DATE                    │        │
    │   │   │    → If count >= 5: REJECT (Daily limit reached)   │        │
    │   │   │                                                     │        │
    │   │   │ 2. Check duplicate:                                │        │
    │   │   │    SELECT * FROM interests WHERE                   │        │
    │   │   │    sender_profile_id = {current_profile_id} AND    │        │
    │   │   │    receiver_profile_id = {receiverProfileId}       │        │
    │   │   │    → If exists: REJECT (Already sent)              │        │
    │   │   │                                                     │        │
    │   │   │ 3. Check if blocked:                               │        │
    │   │   │    SELECT * FROM blocks WHERE                      │        │
    │   │   │    (blocker_profile_id = {receiverProfileId} AND   │        │
    │   │   │     blocked_profile_id = {current_profile_id})     │        │
    │   │   │    → If exists: REJECT (You are blocked)           │        │
    │   │   │                                                     │        │
    │   │   │ 4. Check receiver profile active:                  │        │
    │   │   │    SELECT profile_status FROM profiles WHERE       │        │
    │   │   │    id = {receiverProfileId}                        │        │
    │   │   │    → If not 'active': REJECT                       │        │
    │   │   │                                                     │        │
    │   │   │ 5. All checks passed:                              │        │
    │   │   │    INSERT INTO interests (                         │        │
    │   │   │      sender_profile_id, receiver_profile_id,       │        │
    │   │   │      message, status, sent_at                      │        │
    │   │   │    ) VALUES (                                      │        │
    │   │   │      {current_profile_id}, {receiverProfileId},    │        │
    │   │   │      {message}, 'pending', NOW()                   │        │
    │   │   │    )                                                │        │
    │   │   │                                                     │        │
    │   │   │ 6. Send notification:                              │        │
    │   │   │    → Get receiver's FCM token from devices         │        │
    │   │   │    → Send push notification                        │        │
    │   │   │    → "You received a new interest!"                │        │
    │   │   └────────────────────────────────────────────────────┘        │
    │   │   Output: {                                                      │
    │   │     success: true,                                               │
    │   │     interestId: "uuid",                                          │
    │   │     status: "pending"                                            │
    │   │   }                                                               │
    │   │                                                                  │
    │   Receiver Gets Notification                                         │
    │   ├─> Opens App → "Interests" Tab                                   │
    │   │   GET /api/v1/interests/received                                │
    │   │   Backend:                                                       │
    │   │   ┌────────────────────────────────────────────────────┐        │
    │   │   │ SELECT i.*, p.id as sender_id,                     │        │
    │   │   │   EXTRACT(YEAR FROM AGE(p.date_of_birth)) as age,  │        │
    │   │   │   p.height_cm, p.education, p.occupation,          │        │
    │   │   │   v.village_name                                   │        │
    │   │   │ FROM interests i                                    │        │
    │   │   │ JOIN profiles p ON i.sender_profile_id = p.id      │        │
    │   │   │ JOIN villages v ON p.village_id = v.id            │        │
    │   │   │ WHERE i.receiver_profile_id = {current_profile_id} │        │
    │   │   │   AND i.status = 'pending'                         │        │
    │   │   │ ORDER BY i.sent_at DESC                            │        │
    │   │   └────────────────────────────────────────────────────┘        │
    │   │   Output: {                                                      │
    │   │     interests: [                                                 │
    │   │       {                                                          │
    │   │         id: "interest-uuid",                                    │
    │   │         senderId: "KB-BTL-M-089",                               │
    │   │         age: 27,                                                │
    │   │         heightCm: 175,                                          │
    │   │         education: "BTech",                                     │
    │   │         occupation: "Software Engineer",                        │
    │   │         villageName: "Betul",                                   │
    │   │         message: "Hello, I found...",                           │
    │   │         sentAt: "2025-02-12T10:30:00Z",                        │
    │   │         status: "pending"                                       │
    │   │       }                                                          │
    │   │     ]                                                            │
    │   │   }                                                              │
    │   │                                                                  │
    │   Receiver Has 3 Options:                                            │
    │   │                                                                  │
    │   OPTION A: Accept Interest                                          │
    │   ├─> PUT /api/v1/interests/{interestId}/accept                     │
    │   │   Backend Logic:                                                 │
    │   │   ┌────────────────────────────────────────────────────┐        │
    │   │   │ 1. Update interest status:                         │        │
    │   │   │    UPDATE interests SET                            │        │
    │   │   │      status = 'accepted',                          │        │
    │   │   │      responded_at = NOW()                          │        │
    │   │   │    WHERE id = {interestId}                         │        │
    │   │   │                                                     │        │
    │   │   │ 2. Check if mutual (both accepted):                │        │
    │   │   │    SELECT * FROM interests WHERE                   │        │
    │   │   │    sender_profile_id = {receiverProfileId} AND     │        │
    │   │   │    receiver_profile_id = {senderProfileId} AND     │        │
    │   │   │    status = 'accepted'                             │        │
    │   │   │                                                     │        │
    │   │   │ 3. If mutual acceptance found:                     │        │
    │   │   │    → Create connection!                            │        │
    │   │   │    → Determine canonical order:                    │        │
    │   │   │      profile1_id = MIN(sender_id, receiver_id)     │        │
    │   │   │      profile2_id = MAX(sender_id, receiver_id)     │        │
    │   │   │                                                     │        │
    │   │   │    INSERT INTO connections (                       │        │
    │   │   │      interest_id, profile1_id, profile2_id,        │        │
    │   │   │      status                                        │        │
    │   │   │    ) VALUES (                                      │        │
    │   │   │      {interestId}, {profile1_id}, {profile2_id},   │        │
    │   │   │      'active'                                      │        │
    │   │   │    )                                                │        │
    │   │   │                                                     │        │
    │   │   │ 4. Send notifications to both:                     │        │
    │   │   │    → "You have a new match! 🎉"                    │        │
    │   │   │    → Unlock STAGE 2 data                           │        │
    │   │   └────────────────────────────────────────────────────┘        │
    │   │   Output: {                                                      │
    │   │     success: true,                                               │
    │   │     connectionCreated: true,                                     │
    │   │     connectionId: "uuid",                                        │
    │   │     unlockStage: 2                                               │
    │   │   }                                                               │
    │   │                                                                  │
    │   OPTION B: Reject Interest                                          │
    │   ├─> PUT /api/v1/interests/{interestId}/reject                     │
    │   │   Input: {                                                       │
    │   │     rejectionReason: "Not looking currently" (optional)         │
    │   │   }                                                               │
    │   │   Backend:                                                       │
    │   │   UPDATE interests SET                                           │
    │   │     status = 'rejected',                                         │
    │   │     responded_at = NOW(),                                        │
    │   │     rejection_reason = {reason}                                  │
    │   │   WHERE id = {interestId}                                        │
    │   │   → Send notification to sender                                  │
    │   │   Output: { success: true, status: "rejected" }                 │
    │   │                                                                  │
    │   OPTION C: Ask Question Before Deciding                             │
    │   ├─> POST /api/v1/interests/{interestId}/question                  │
    │   │   Input: {                                                       │
    │   │     questionText: "What are your future career plans?"          │
    │   │   }                                                               │
    │   │   Backend:                                                       │
    │   │   ┌────────────────────────────────────────────────────┐        │
    │   │   │ 1. Check if question already exists:               │        │
    │   │   │    SELECT * FROM interest_questions WHERE          │        │
    │   │   │    interest_id = {interestId}                      │        │
    │   │   │    → If exists: REJECT (One question only)         │        │
    │   │   │                                                     │        │
    │   │   │ 2. Insert question:                                │        │
    │   │   │    INSERT INTO interest_questions (                │        │
    │   │   │      interest_id, asked_by_profile_id,             │        │
    │   │   │      question_text, asked_at                       │        │
    │   │   │    ) VALUES (                                      │        │
    │   │   │      {interestId}, {receiverProfileId},            │        │
    │   │   │      {questionText}, NOW()                         │        │
    │   │   │    )                                                │        │
    │   │   │                                                     │        │
    │   │   │ 3. Notify sender to answer                         │        │
    │   │   └────────────────────────────────────────────────────┘        │
    │   │   Output: { success: true, questionId: "uuid" }                 │
    │   │                                                                  │
    │   Sender Gets Question Notification                                  │
    │   ├─> PUT /api/v1/interests/{interestId}/answer                     │
    │   │   Input: {                                                       │
    │   │     answerText: "I plan to continue in current field..."        │
    │   │   }                                                               │
    │   │   Backend:                                                       │
    │   │   UPDATE interest_questions SET                                  │
    │   │     answer_text = {answerText},                                  │
    │   │     answered_at = NOW()                                          │
    │   │   WHERE interest_id = {interestId}                               │
    │   │   → Notify receiver (can now decide)                             │
    │   │   Output: { success: true }                                      │
    │   │                                                                  │
    │   └─> Receiver now decides: Accept or Reject                        │
    │                                                                       │
    └───────────────────────────────────────────────────────────────────────┘

    ├─> [PHASE 5: CONNECTION & PROGRESSIVE UNLOCK] ─────────────────────────┐
    │                                                                        │
    │   Both Users Accepted → Connection Created                            │
    │   ├─> GET /api/v1/connections                                        │
    │   │   Backend:                                                        │
    │   │   SELECT c.*, p1.full_name as profile1_name,                     │
    │   │          p2.full_name as profile2_name                           │
    │   │   FROM connections c                                              │
    │   │   JOIN profiles p1 ON c.profile1_id = p1.id                      │
    │   │   JOIN profiles p2 ON c.profile2_id = p2.id                      │
    │   │   WHERE (c.profile1_id = {current_profile_id} OR                 │
    │   │          c.profile2_id = {current_profile_id})                    │
    │   │     AND c.status != 'broken'                                      │
    │   │   ORDER BY c.created_at DESC                                      │
    │   │   Output: {                                                       │
    │   │     connections: [                                                │
    │   │       {                                                           │
    │   │         id: "connection-uuid",                                   │
    │   │         matchedWith: "Priya Sharma",  // Now visible!            │
    │   │         status: "active",                                        │
    │   │         connectedAt: "2025-02-12",                               │
    │   │         unlockStage: 2                                           │
    │   │       }                                                           │
    │   │     ]                                                             │
    │   │   }                                                               │
    │   │                                                                  │
    │   STAGE 2: View Match Profile (Names + Family Photos Unlocked)       │
    │   ├─> GET /api/v1/profiles/{matchedProfileId}                       │
    │   │   Backend checks connection exists → Returns STAGE 2 data:       │
    │   │   Output: {                                                       │
    │   │     profile: {                                                    │
    │   │       fullName: "Priya Sharma",      // NOW VISIBLE              │
    │   │       fatherName: "Rakesh Sharma",   // NOW VISIBLE              │
    │   │       age: 24,                                                   │
    │   │       education: "B.Sc Biology",                                │
    │   │       occupation: "Government Teacher",                         │
    │   │       familyPhotos: [                                            │
    │   │         "url-to-family-photo-1.jpg",  // NOW VISIBLE             │
    │   │         "url-to-family-photo-2.jpg"                             │
    │   │       ],                                                          │
    │   │       // Still hidden: phone, individual photos                  │
    │   │     },                                                            │
    │   │     unlockStage: 2                                               │
    │   │   }                                                               │
    │   │                                                                  │
    │   Both Families Start Talking (Outside App)                          │
    │   User Updates Status:                                                │
    │   ├─> PUT /api/v1/connections/{connectionId}/status                 │
    │   │   Input: {                                                        │
    │   │     newStatus: "family_approved",                                │
    │   │     reason: "Families approved, proceeding forward"             │
    │   │   }                                                               │
    │   │   Backend:                                                        │
    │   │   ┌────────────────────────────────────────────────────┐        │
    │   │   │ 1. Get current connection:                         │        │
    │   │   │    SELECT * FROM connections WHERE id = {id}       │        │
    │   │   │                                                     │        │
    │   │   │ 2. Validate status transition:                     │        │
    │   │   │    active → family_approved → engaged ✓            │        │
    │   │   │    active → broken ✓                               │        │
    │   │   │    family_approved → engaged ✓                     │        │
    │   │   │    family_approved → broken ✓                      │        │
    │   │   │    engaged → broken ✗ (cannot break engagement)    │        │
    │   │   │                                                     │        │
    │   │   │ 3. Update connection:                              │        │
    │   │   │    UPDATE connections SET                          │        │
    │   │   │      status = 'family_approved',                   │        │
    │   │   │      family_approved_at = NOW()                    │        │
    │   │   │    WHERE id = {connectionId}                       │        │
    │   │   │                                                     │        │
    │   │   │ 4. Log status change:                              │        │
    │   │   │    INSERT INTO connection_status_logs (            │        │
    │   │   │      connection_id, from_status, to_status,        │        │
    │   │   │      changed_by_profile_id, reason                 │        │
    │   │   │    ) VALUES (                                      │        │
    │   │   │      {connectionId}, 'active',                     │        │
    │   │   │      'family_approved', {current_profile_id},      │        │
    │   │   │      {reason}                                      │        │
    │   │   │    )                                                │        │
    │   │   │                                                     │        │
    │   │   │ 5. Unlock STAGE 3 (Phone numbers)                  │        │
    │   │   │    → Both users can now see phone numbers          │        │
    │   │   └────────────────────────────────────────────────────┘        │
    │   │   Output: { success: true, unlockStage: 3 }                     │
    │   │                                                                  │
    │   STAGE 3: Phone Numbers Unlocked                                    │
    │   ├─> POST /api/v1/connections/{connectionId}/unlock-contact        │
    │   │   Backend checks: status = 'family_approved'                     │
    │   │   Output: {                                                      │
    │   │     contactInfo: {                                               │
    │   │       phone: "9876543210",        // NOW VISIBLE                 │
    │   │       fatherPhone: "9123456789",  // NOW VISIBLE                 │
    │   │       address: "House 123, Mathni, Betul" // NOW VISIBLE         │
    │   │     }                                                             │
    │   │   }                                                               │
    │   │                                                                  │
    │   Both Families Meet & Decide to Get Engaged                         │
    │   ├─> PUT /api/v1/connections/{connectionId}/engaged                │
    │   │   Input: {                                                        │
    │   │     engagementDate: "2025-03-15"                                 │
    │   │   }                                                               │
    │   │   Backend:                                                        │
    │   │   ┌────────────────────────────────────────────────────┐        │
    │   │   │ 1. Update connection:                              │        │
    │   │   │    UPDATE connections SET                          │        │
    │   │   │      status = 'engaged',                           │        │
    │   │   │      engaged_at = NOW()                            │        │
    │   │   │    WHERE id = {connectionId}                       │        │
    │   │   │                                                     │        │
    │   │   │ 2. Update both profiles:                           │        │
    │   │   │    UPDATE profiles SET                             │        │
    │   │   │      profile_status = 'engaged'                    │        │
    │   │   │    WHERE id IN ({profile1_id}, {profile2_id})      │        │
    │   │   │                                                     │        │
    │   │   │ 3. Hide profiles from search                       │        │
    │   │   │    (profile_status != 'active' excludes them)      │        │
    │   │   │                                                     │        │
    │   │   │ 4. Log status change                               │        │
    │   │   │                                                     │        │
    │   │   │ 5. Unlock STAGE 4 (Individual photos)              │        │
    │   │   └────────────────────────────────────────────────────┘        │
    │   │   Output: {                                                      │
    │   │     success: true,                                               │
    │   │     message: "Congratulations! 🎉",                              │
    │   │     unlockStage: 4                                               │
    │   │   }                                                               │
    │   │                                                                  │
    │   STAGE 4: Full Access (Individual Photos)                           │
    │   ├─> GET /api/v1/photos/profile/{matchedProfileId}                 │
    │   │   Backend checks: connection.status = 'engaged'                  │
    │   │   Output: {                                                      │
    │   │     photos: [                                                    │
    │   │       "url-to-photo-1.jpg",       // NOW VISIBLE                 │
    │   │       "url-to-photo-2.jpg",                                     │
    │   │       "url-to-photo-3.jpg"                                      │
    │   │     ]                                                             │
    │   │   }                                                               │
    │   │                                                                  │
    │   SUCCESS! Marriage Process Complete 💍                              │
    │                                                                       │
    └───────────────────────────────────────────────────────────────────────┘

    ├─> [PHASE 6: BLOCKING & REPORTING] ────────────────────────────────────┐
    │                                                                        │
    │   User Wants to Block Someone                                         │
    │   ├─> POST /api/v1/blocks                                            │
    │   │   Input: {                                                        │
    │   │     blockedProfileId: "uuid-of-profile-to-block",                │
    │   │     reason: "Not interested / Inappropriate behavior"            │
    │   │   }                                                               │
    │   │   Backend:                                                        │
    │   │   ┌────────────────────────────────────────────────────┐        │
    │   │   │ 1. Check if already blocked:                       │        │
    │   │   │    SELECT * FROM blocks WHERE                      │        │
    │   │   │    blocker_profile_id = {current_profile_id} AND   │        │
    │   │   │    blocked_profile_id = {blockedProfileId}         │        │
    │   │   │    → If exists: REJECT (Already blocked)           │        │
    │   │   │                                                     │        │
    │   │   │ 2. Insert block:                                   │        │
    │   │   │    INSERT INTO blocks (                            │        │
    │   │   │      blocker_profile_id, blocked_profile_id,       │        │
    │   │   │      reason, blocked_at                            │        │
    │   │   │    ) VALUES (                                      │        │
    │   │   │      {current_profile_id}, {blockedProfileId},     │        │
    │   │   │      {reason}, NOW()                               │        │
    │   │   │    )                                                │        │
    │   │   │                                                     │        │
    │   │   │ 3. Effect:                                         │        │
    │   │   │    - Blocked profile won't appear in searches      │        │
    │   │   │    - Blocked profile can't send interests          │        │
    │   │   │    - Blocked profile can't view blocker's profile  │        │
    │   │   └────────────────────────────────────────────────────┘        │
    │   │   Output: { success: true, message: "Profile blocked" }         │
    │   │                                                                  │
    │   User Wants to Report Fake/Inappropriate Profile                    │
    │   ├─> POST /api/v1/reports                                          │
    │   │   Input: {                                                        │
    │   │     reportedProfileId: "uuid",                                   │
    │   │     category: "fake_profile",                                    │
    │   │     description: "Using fake photos, suspicious info"           │
    │   │   }                                                               │
    │   │   Backend:                                                        │
    │   │   INSERT INTO reports (                                          │
    │   │     reporter_profile_id, reported_profile_id,                    │
    │   │     category, description, reported_at                           │
    │   │   ) VALUES (                                                      │
    │   │     {current_profile_id}, {reportedProfileId},                   │
    │   │     {category}, {description}, NOW()                             │
    │   │   )                                                               │
    │   │   → Notify admins for review                                     │
    │   │   Output: {                                                       │
    │   │     success: true,                                                │
    │   │     message: "Report submitted. Admin will review."              │
    │   │   }                                                               │
    │   │                                                                  │
    └───────────────────────────────────────────────────────────────────────┘
```

---

## 👮 2. ADMIN/MODERATOR FLOW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ADMIN WORKFLOW                                     │
└─────────────────────────────────────────────────────────────────────────────┘

ADMIN LOGIN (Same as User, but Different Dashboard)
    ├─> POST /api/v1/auth/verify-otp
    │   After login, check admin status:
    │   SELECT * FROM admins WHERE user_id = {userId}
    │   If exists → Redirect to Admin Panel
    │   If not → Regular user dashboard
    │
    ├─> ADMIN DASHBOARD
    │   GET /api/v1/admin/stats
    │   Output: {
    │     totalUsers: 1247,
    │     activeProfiles: 1089,
    │     profilesCreatedToday: 12,
    │     profilesCreatedThisMonth: 143,
    │     totalInterests: 5432,
    │     interestsToday: 67,
    │     totalConnections: 890,
    │     totalEngagements: 127,
    │     engagementsThisMonth: 15,
    │     pendingReports: 5,
    │     pendingPhotoApprovals: 23
    │   }
    │
    ├─> [SECTION 1: USER MANAGEMENT] ───────────────────────────────────────┐
    │   │                                                                    │
    │   │   View All Users                                                  │
    │   │   ├─> GET /api/v1/admin/users?page=1&limit=50&status=active     │
    │   │   │   Output: {                                                   │
    │   │   │     users: [                                                  │
    │   │   │       {                                                       │
    │   │   │         userId: "uuid",                                      │
    │   │   │         phone: "98XXXXXXXX",                                 │
    │   │   │         profileName: "Rahul Kumar",                          │
    │   │   │         village: "Mathni",                                   │
    │   │   │         status: "active",                                    │
    │   │   │         createdAt: "2025-01-15",                             │
    │   │   │         lastActive: "2025-02-12"                             │
    │   │   │       }                                                       │
    │   │   │     ],                                                        │
    │   │   │     total: 1247,                                              │
    │   │   │     page: 1                                                   │
    │   │   │   }                                                           │
    │   │   │                                                               │
    │   │   View User Details                                               │
    │   │   ├─> GET /api/v1/admin/users/{userId}                          │
    │   │   │   Output: {                                                   │
    │   │   │     user: { full user data },                                │
    │   │   │     profile: { full profile data },                          │
    │   │   │     devices: [{ device info }],                              │
    │   │   │     sessions: [{ session info }],                            │
    │   │   │     interests: { sent: 8, received: 12 },                    │
    │   │   │     connections: 3,                                           │
    │   │   │     reportsAgainst: 0,                                        │
    │   │   │     reportsBy: 1                                              │
    │   │   │   }                                                           │
    │   │   │                                                               │
    │   │   Suspend User                                                    │
    │   │   ├─> PUT /api/v1/admin/users/{userId}/suspend                  │
    │   │   │   Input: { reason: "Violating community guidelines" }        │
    │   │   │   Backend:                                                    │
    │   │   │   - UPDATE users SET is_active = false                       │
    │   │   │   - UPDATE profiles SET profile_status = 'inactive'          │
    │   │   │   - DELETE all active sessions (force logout)                │
    │   │   │   - INSERT audit_log                                         │
    │   │   │   Output: { success: true }                                  │
    │   │   │                                                               │
    │   │   Activate User                                                   │
    │   │   ├─> PUT /api/v1/admin/users/{userId}/activate                 │
    │   │   │   Backend:                                                    │
    │   │   │   - UPDATE users SET is_active = true                        │
    │   │   │   - UPDATE profiles SET profile_status = 'active'            │
    │   │   │   - INSERT audit_log                                         │
    │   │   │                                                               │
    │   │   Delete User (Permanent)                                         │
    │   │   ├─> DELETE /api/v1/admin/users/{userId}                       │
    │   │   │   Input: { confirmPassword: "admin password" }               │
    │   │   │   Backend:                                                    │
    │   │   │   - Soft delete (UPDATE users SET deleted_at = NOW())        │
    │   │   │   - Or hard delete (DELETE CASCADE will handle relations)    │
    │   │   │   - INSERT audit_log with all user data before deletion      │
    │   │   │                                                               │
    │   └────────────────────────────────────────────────────────────────────┘
    │
    ├─> [SECTION 2: REPORT MANAGEMENT] ─────────────────────────────────────┐
    │   │                                                                    │
    │   │   View All Reports                                                │
    │   │   ├─> GET /api/v1/admin/reports?status=pending                  │
    │   │   │   Output: {                                                   │
    │   │   │     reports: [                                                │
    │   │   │       {                                                       │
    │   │   │         reportId: "uuid",                                    │
    │   │   │         reporterName: "User A",                              │
    │   │   │         reportedName: "User B",                              │
    │   │   │         reportedPhone: "98XXXXXXXX",                         │
    │   │   │         category: "fake_profile",                            │
    │   │   │         description: "Using fake photos...",                 │
    │   │   │         reportedAt: "2025-02-10",                            │
    │   │   │         status: "pending"                                    │
    │   │   │       }                                                       │
    │   │   │     ]                                                         │
    │   │   │   }                                                           │
    │   │   │                                                               │
    │   │   Review Report                                                   │
    │   │   ├─> GET /api/v1/admin/reports/{reportId}                      │
    │   │   │   Output: {                                                   │
    │   │   │     report: { full report data },                            │
    │   │   │     reporterProfile: { reporter's profile },                 │
    │   │   │     reportedProfile: { reported user's profile },            │
    │   │   │     reportedPhotos: [photos],                                │
    │   │   │     previousReports: [other reports against same user]       │
    │   │   │   }                                                           │
    │   │   │                                                               │
    │   │   Take Action on Report                                           │
    │   │   ├─> PUT /api/v1/admin/reports/{reportId}                      │
    │   │   │   Input: {                                                    │
    │   │   │     action: "suspension",  // no_action/warning/suspension/deletion
    │   │   │     adminNotes: "Verified fake photos, suspending user"      │
    │   │   │   }                                                           │
    │   │   │   Backend:                                                    │
    │   │   │   ┌──────────────────────────────────────────────┐           │
    │   │   │   │ 1. Update report:                            │           │
    │   │   │   │    UPDATE reports SET                        │           │
    │   │   │   │      admin_action = {action},                │           │
    │   │   │   │      admin_reviewed_at = NOW()               │           │
    │   │   │   │    WHERE id = {reportId}                     │           │
    │   │   │   │                                               │           │
    │   │   │   │ 2. Execute action:                           │           │
    │   │   │   │    IF action = 'no_action':                  │           │
    │   │   │   │      → Just mark report as reviewed          │           │
    │   │   │   │                                               │           │
    │   │   │   │    IF action = 'warning':                    │           │
    │   │   │   │      → Send notification to reported user    │           │
    │   │   │   │      → Log warning in audit_logs             │           │
    │   │   │   │                                               │           │
    │   │   │   │    IF action = 'suspension':                 │           │
    │   │   │   │      → UPDATE users SET is_active = false    │           │
    │   │   │   │      → DELETE active sessions                │           │
    │   │   │   │      → Send notification                     │           │
    │   │   │   │                                               │           │
    │   │   │   │    IF action = 'deletion':                   │           │
    │   │   │   │      → Soft delete user account              │           │
    │   │   │   │      → Archive all data                      │           │
    │   │   │   └──────────────────────────────────────────────┘           │
    │   │   │   Output: { success: true, actionTaken: "suspension" }       │
    │   │   │                                                               │
    │   └────────────────────────────────────────────────────────────────────┘
    │
    ├─> [SECTION 3: PHOTO APPROVAL] (If Enabled) ───────────────────────────┐
    │   │                                                                    │
    │   │   View Pending Photos                                             │
    │   │   ├─> GET /api/v1/admin/photos/pending                           │
    │   │   │   Output: {                                                   │
    │   │   │     photos: [                                                 │
    │   │   │       {                                                       │
    │   │   │         photoId: "uuid",                                     │
    │   │   │         profileName: "Rahul Kumar",                          │
    │   │   │         photoUrl: "url-to-photo.jpg",                        │
    │   │   │         uploadedAt: "2025-02-12",                            │
    │   │   │         status: "pending"                                    │
    │   │   │       }                                                       │
    │   │   │     ]                                                         │
    │   │   │   }                                                           │
    │   │   │                                                               │
    │   │   Approve Photo                                                   │
    │   │   ├─> PUT /api/v1/admin/photos/{photoId}/approve                │
    │   │   │   Backend:                                                    │
    │   │   │   UPDATE profile_photos SET status = 'approved'              │
    │   │   │   WHERE id = {photoId}                                        │
    │   │   │   → Notify user: "Photo approved"                            │
    │   │   │                                                               │
    │   │   Reject Photo                                                    │
    │   │   ├─> PUT /api/v1/admin/photos/{photoId}/reject                 │
    │   │   │   Input: { reason: "Inappropriate / Not clear" }             │
    │   │   │   Backend:                                                    │
    │   │   │   UPDATE profile_photos SET status = 'rejected'              │
    │   │   │   → Notify user with reason                                  │
    │   │   │                                                               │
    │   └────────────────────────────────────────────────────────────────────┘
    │
    ├─> [SECTION 4: ANALYTICS & INSIGHTS] ──────────────────────────────────┐
    │   │                                                                    │
    │   │   View Platform Analytics                                         │
    │   │   ├─> GET /api/v1/admin/analytics?period=month                  │
    │   │   │   Output: {                                                   │
    │   │   │     newUsers: [                                               │
    │   │   │       { date: "2025-02-01", count: 12 },                     │
    │   │   │       { date: "2025-02-02", count: 8 },                      │
    │   │   │       ...                                                     │
    │   │   │     ],                                                        │
    │   │   │     activeUsers: [...],                                       │
    │   │   │     interests: [...],                                         │
    │   │   │     connections: [...],                                       │
    │   │   │     engagements: [...],                                       │
    │   │   │     topVillages: [                                            │
    │   │   │       { village: "Mathni", userCount: 143 },                 │
    │   │   │       { village: "Betul", userCount: 98 }                    │
    │   │   │     ],                                                        │
    │   │   │     successRate: {                                            │
    │   │   │       totalConnections: 890,                                  │
    │   │   │       engagements: 127,                                       │
    │   │   │       rate: "14.3%"                                           │
    │   │   │     }                                                          │
    │   │   │   }                                                           │
    │   │   │                                                               │
    │   │   View Audit Logs                                                 │
    │   │   ├─> GET /api/v1/admin/audit-logs?limit=100                    │
    │   │   │   Output: {                                                   │
    │   │   │     logs: [                                                   │
    │   │   │       {                                                       │
    │   │   │         timestamp: "2025-02-12 10:30:45",                    │
    │   │   │         userId: "uuid",                                      │
    │   │   │         action: "USER_SUSPENDED",                            │
    │   │   │         entityType: "user",                                  │
    │   │   │         entityId: "uuid",                                    │
    │   │   │         ipAddress: "192.168.1.1",                            │
    │   │   │         metadata: { reason: "Fake profile" }                 │
    │   │   │       }                                                       │
    │   │   │     ]                                                         │
    │   │   │   }                                                           │
    │   │   │                                                               │
    │   └────────────────────────────────────────────────────────────────────┘
    │
    └─> ADMIN ACTIONS ARE LOGGED IN audit_logs TABLE
```

---

## 📊 3. COMPLETE API ENDPOINT REFERENCE TABLE

| Category | Endpoint | Method | Auth Required | Description |
|----------|----------|--------|---------------|-------------|
| **AUTHENTICATION** |
| | `/auth/send-otp` | POST | No | Send OTP to phone number |
| | `/auth/verify-otp` | POST | No | Verify OTP & login/register |
| | `/auth/refresh` | POST | No | Refresh access token |
| | `/auth/logout` | POST | Yes | Logout current device |
| | `/auth/logout-all` | POST | Yes | Logout all devices |
| | `/auth/sessions` | GET | Yes | Get all active sessions |
| | `/auth/sessions/:id` | DELETE | Yes | Revoke specific session |
| **VILLAGES** |
| | `/villages` | GET | Yes | Get all Betul villages |
| | `/villages/search` | GET | Yes | Search villages by name |
| | `/villages/:id` | GET | Yes | Get village details |
| **PROFILES** |
| | `/profiles/create/step1` | POST | Yes | Create profile - basic info |
| | `/profiles/create/step2` | POST | Yes | Add education & career |
| | `/profiles/create/step3` | POST | Yes | Add about & preferences |
| | `/profiles/complete` | POST | Yes | Mark profile complete |
| | `/profiles/me` | GET | Yes | Get my profile |
| | `/profiles/me` | PUT | Yes | Update my profile |
| | `/profiles/me/stats` | GET | Yes | Get profile stats |
| | `/profiles/me/preferences` | PUT | Yes | Update preferences |
| | `/profiles/me/visibility` | PUT | Yes | Update visibility |
| | `/profiles/me` | DELETE | Yes | Delete profile |
| | `/profiles/:id` | GET | Yes | View another profile (staged) |
| **SEARCH** |
| | `/search/profiles` | POST | Yes | Search with filters |
| | `/search/matches` | GET | Yes | Get AI-matched profiles |
| | `/search/recent-views` | GET | Yes | Profiles I viewed |
| | `/search/viewed-me` | GET | Yes | Who viewed my profile |
| **INTERESTS** |
| | `/interests/send` | POST | Yes | Send interest |
| | `/interests/sent` | GET | Yes | Get sent interests |
| | `/interests/received` | GET | Yes | Get received interests |
| | `/interests/:id/accept` | PUT | Yes | Accept interest |
| | `/interests/:id/reject` | PUT | Yes | Reject interest |
| | `/interests/:id/question` | POST | Yes | Ask question |
| | `/interests/:id/answer` | PUT | Yes | Answer question |
| | `/interests/:id/withdraw` | DELETE | Yes | Withdraw interest |
| | `/interests/:id` | GET | Yes | Get interest details |
| **CONNECTIONS** |
| | `/connections` | GET | Yes | Get all connections |
| | `/connections/:id` | GET | Yes | Get connection details |
| | `/connections/:id/status` | PUT | Yes | Update status |
| | `/connections/:id/unlock-contact` | POST | Yes | Unlock phone numbers |
| | `/connections/:id/family-approve` | PUT | Yes | Mark family approved |
| | `/connections/:id/engaged` | PUT | Yes | Mark engaged |
| | `/connections/:id/break` | PUT | Yes | Break connection |
| | `/connections/:id/logs` | GET | Yes | Get status history |
| **PHOTOS** |
| | `/photos/upload` | POST | Yes | Upload photo |
| | `/photos/me` | GET | Yes | Get my photos |
| | `/photos/:id/primary` | PUT | Yes | Set primary photo |
| | `/photos/:id` | DELETE | Yes | Delete photo |
| | `/photos/profile/:profileId` | GET | Yes | Get profile photos (staged) |
| **BLOCKS** |
| | `/blocks` | POST | Yes | Block profile |
| | `/blocks` | GET | Yes | Get blocked profiles |
| | `/blocks/:id` | DELETE | Yes | Unblock profile |
| **REPORTS** |
| | `/reports` | POST | Yes | Report profile |
| | `/reports/me` | GET | Yes | Get my reports |
| **ADMIN** |
| | `/admin/stats` | GET | Yes (Admin) | Platform statistics |
| | `/admin/users` | GET | Yes (Admin) | Get all users |
| | `/admin/users/:id` | GET | Yes (Admin) | Get user details |
| | `/admin/users/:id/suspend` | PUT | Yes (Admin) | Suspend user |
| | `/admin/users/:id/activate` | PUT | Yes (Admin) | Activate user |
| | `/admin/users/:id` | DELETE | Yes (Admin) | Delete user |
| | `/admin/reports` | GET | Yes (Admin) | Get all reports |
| | `/admin/reports/:id` | GET | Yes (Admin) | Get report details |
| | `/admin/reports/:id` | PUT | Yes (Admin) | Take action on report |
| | `/admin/photos/pending` | GET | Yes (Admin) | Pending photos |
| | `/admin/photos/:id/approve` | PUT | Yes (Admin) | Approve photo |
| | `/admin/photos/:id/reject` | PUT | Yes (Admin) | Reject photo |
| | `/admin/analytics` | GET | Yes (Admin) | Platform analytics |
| | `/admin/audit-logs` | GET | Yes (Admin) | Audit logs |

**Total Endpoints: 70+**

---

This is the complete flow covering every user action, admin action, and system interaction! 🎯