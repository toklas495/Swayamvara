# Kunbi Samaj Matrimony Application - Design Phase Documentation

## Table of Contents
1. [System Architecture](#system-architecture)
2. [User Flow Diagram](#user-flow-diagram)
3. [Sequence Diagrams](#sequence-diagrams)
4. [Entity Relationship Diagram](#entity-relationship-diagram)
5. [State Diagrams](#state-diagrams)
6. [Component Architecture](#component-architecture)

---

## 1. System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Web[Web Application]
        Mobile[Mobile App]
        Admin[Admin Panel]
    end
    
    subgraph "API Gateway"
        Gateway[API Gateway<br/>Authentication & Routing]
    end
    
    subgraph "Application Layer"
        Auth[Authentication Service]
        Profile[Profile Service]
        Match[Matching Engine]
        Interest[Interest Service]
        Notif[Notification Service]
        Media[Media Service]
        Verify[Verification Service]
    end
    
    subgraph "Data Layer"
        DB[(PostgreSQL<br/>Main Database)]
        Cache[(Redis Cache)]
        S3[S3/Cloud Storage<br/>Photos & Videos]
        Queue[Message Queue<br/>RabbitMQ/Kafka]
    end
    
    subgraph "External Services"
        SMS[SMS Gateway]
        Email[Email Service]
        Social[Social Media APIs]
        Aadhaar[Aadhaar Verification]
    end
    
    Web --> Gateway
    Mobile --> Gateway
    Admin --> Gateway
    
    Gateway --> Auth
    Gateway --> Profile
    Gateway --> Match
    Gateway --> Interest
    Gateway --> Notif
    Gateway --> Media
    Gateway --> Verify
    
    Auth --> DB
    Profile --> DB
    Match --> DB
    Interest --> DB
    Verify --> DB
    
    Auth --> Cache
    Match --> Cache
    
    Media --> S3
    Notif --> Queue
    
    Notif --> SMS
    Notif --> Email
    Media --> Social
    Verify --> Aadhaar
```

---

## 2. User Flow Diagram

### 2.1 Complete User Journey

```mermaid
flowchart TD
    Start([User Downloads App]) --> Register[Register with Mobile]
    Register --> OTP{OTP Verification}
    OTP -->|Failed| Register
    OTP -->|Success| BasicInfo[Enter Basic Info]
    
    BasicInfo --> UploadDocs[Upload Documents<br/>Aadhaar, Photos]
    UploadDocs --> AddRef[Add 2 References<br/>from Samaj]
    AddRef --> Submit1[Submit for Verification]
    
    Submit1 --> AdminVerify{Admin Committee<br/>Verification}
    AdminVerify -->|Rejected| Notify1[Notify User<br/>with Reason]
    Notify1 --> End1([Profile Rejected])
    
    AdminVerify -->|Approved| CompleteProfile[Complete Detailed Profile]
    CompleteProfile --> Upload[Upload Photos & Video]
    Upload --> LinkSocial[Link Social Media<br/>Optional]
    LinkSocial --> FamilyApproval{Family Member<br/>Approval}
    
    FamilyApproval -->|Rejected/Edit| CompleteProfile
    FamilyApproval -->|Approved| ProfileLive[Profile Goes Live]
    
    ProfileLive --> Browse[Browse Other Profiles]
    Browse --> Filter[Apply Filters]
    Filter --> ViewProfile[View Profile Details]
    
    ViewProfile --> Decision1{Decision}
    Decision1 -->|Send Interest| SendInterest[Send Interest<br/>with Message]
    Decision1 -->|Shortlist| Shortlist[Add to Shortlist]
    Decision1 -->|Not Interested| Browse
    
    SendInterest --> WaitResponse[Wait for Response]
    
    subgraph "Receiving Interest Flow"
        ReceiveInt[Receive Interest] --> ViewInt[View Interest Details]
        ViewInt --> Decision2{Decision}
        Decision2 -->|Accept| Accept[Accept Interest]
        Decision2 -->|Reject| Reject[Reject with Reason]
        Decision2 -->|Ask Question| Question[Send Question]
        Question --> WaitAnswer[Wait for Answer]
        WaitAnswer --> Decision2
    end
    
    WaitResponse --> Response{Response Received}
    Response -->|Accepted| Mutual[Mutual Interest]
    Response -->|Rejected| Browse
    Response -->|Question| AnswerQ[Answer Question]
    AnswerQ --> WaitResponse
    
    Accept --> Mutual
    
    Mutual --> Unlock[Unlock Contact Details<br/>Phone, Social Media]
    Unlock --> Connect[Direct Contact<br/>Call/WhatsApp]
    Connect --> Meeting[Arrange Meeting]
    
    Meeting --> MeetOutcome{Meeting Outcome}
    MeetOutcome -->|Positive| Proceed[Proceed Further]
    MeetOutcome -->|Need More Time| Meeting
    MeetOutcome -->|Not Interested| MarkEnd[Mark Not Interested]
    
    Proceed --> Engagement[Engagement]
    Engagement --> Success[Mark as Success<br/>Share Story]
    Success --> End2([Success Story])
    
    MarkEnd --> Browse
```

---

## 3. Sequence Diagrams

### 3.1 Registration & Verification Flow

```mermaid
sequenceDiagram
    actor User
    participant App
    participant API
    participant SMS
    participant DB
    participant Admin
    participant Reference
    
    User->>App: Enter Mobile Number
    App->>API: Request OTP
    API->>SMS: Send OTP
    SMS->>User: Receive OTP
    User->>App: Enter OTP
    App->>API: Verify OTP
    API->>DB: Create User Record
    API-->>App: OTP Verified
    
    User->>App: Enter Basic Info
    User->>App: Upload Documents (Aadhaar, Photos)
    User->>App: Add 2 References
    App->>API: Submit Registration
    API->>DB: Save Registration
    API->>Admin: Notify New Registration
    
    Admin->>API: Review Profile
    API->>DB: Fetch Profile & Documents
    DB-->>API: Profile Data
    API-->>Admin: Display Profile
    
    Admin->>Reference: Call Reference 1
    Reference-->>Admin: Confirm Details
    Admin->>Reference: Call Reference 2
    Reference-->>Admin: Confirm Details
    
    Admin->>API: Approve Profile
    API->>DB: Update Status to 'Verified'
    API->>SMS: Send Approval SMS
    SMS->>User: Profile Approved
    
    User->>App: Login & Complete Profile
```

### 3.2 Interest Sending & Acceptance Flow

```mermaid
sequenceDiagram
    actor UserA as User A (Sender)
    participant AppA as App A
    participant API
    participant DB
    participant Notify
    participant AppB as App B
    actor UserB as User B (Receiver)
    actor FamilyB as User B Family
    
    UserA->>AppA: Browse Profiles
    AppA->>API: Get Filtered Profiles
    API->>DB: Query Profiles
    DB-->>API: Matching Profiles
    API-->>AppA: Profile List
    
    UserA->>AppA: View Profile Details
    AppA->>API: Get Full Profile (Public)
    API->>DB: Fetch Profile (Hide Private)
    DB-->>API: Public Profile Data
    API-->>AppA: Display Profile
    
    UserA->>AppA: Send Interest
    UserA->>AppA: Write Introduction Message
    AppA->>API: Submit Interest Request
    API->>DB: Create Interest Record
    API->>Notify: Trigger Notification
    
    Notify->>AppB: Push Notification
    Notify->>UserB: SMS Alert
    Notify->>FamilyB: SMS Alert
    
    UserB->>AppB: View Interest
    AppB->>API: Get Interest Details
    API->>DB: Fetch Interest + Sender Profile
    DB-->>API: Interest Data
    API-->>AppB: Display Interest
    
    UserB->>AppB: Accept Interest
    AppB->>API: Accept Interest Request
    API->>DB: Update Interest Status
    API->>DB: Unlock Private Data
    
    API->>Notify: Notify Acceptance
    Notify->>AppA: Push Notification
    Notify->>UserA: SMS with Phone Number
    
    API-->>AppB: Unlock UserA Details
    API-->>AppA: Unlock UserB Details
    
    UserA->>UserB: Direct Contact (Phone/WhatsApp)
```

### 3.3 Profile Completion & Family Approval Flow

```mermaid
sequenceDiagram
    actor User
    participant App
    participant API
    participant DB
    participant SMS
    actor Family
    participant FamilyApp as Family App
    
    User->>App: Complete All Profile Sections
    User->>App: Upload Photos (5-8)
    User->>App: Record Video Introduction
    User->>App: Link Social Media (Optional)
    
    App->>API: Submit Complete Profile
    API->>DB: Save Profile (Status: Pending Approval)
    
    User->>App: Enter Family Mobile Number
    App->>API: Send Approval Request
    API->>SMS: Send SMS to Family
    SMS->>Family: Profile Approval Request + App Link
    
    Family->>FamilyApp: Download & Login
    FamilyApp->>API: Login with Mobile
    API->>SMS: Send OTP
    SMS->>Family: OTP
    Family->>FamilyApp: Enter OTP
    
    FamilyApp->>API: Get Pending Profiles
    API->>DB: Fetch User's Profile
    DB-->>API: Complete Profile Data
    API-->>FamilyApp: Display Profile for Review
    
    Family->>FamilyApp: Review All Details
    Family->>FamilyApp: Edit/Add Information
    Family->>FamilyApp: Add "Message from Parents"
    Family->>FamilyApp: Approve Photos
    
    FamilyApp->>API: Approve Profile
    API->>DB: Update Status to 'Live'
    API->>SMS: Send Confirmation
    SMS->>User: Profile is Live
    
    User->>App: Start Browsing Profiles
```

### 3.4 Meeting & Success Flow

```mermaid
sequenceDiagram
    actor UserA as User A
    participant App
    participant API
    participant DB
    participant Calendar
    actor UserB as User B
    
    UserA->>App: Mark "Meeting Arranged"
    UserA->>App: Enter Meeting Details
    App->>API: Save Meeting Info
    API->>DB: Store Meeting Details
    API->>Calendar: Set Reminder
    
    Calendar-->>UserA: Reminder (1 day before)
    Calendar-->>UserB: Reminder (1 day before)
    
    Note over UserA,UserB: Meeting Happens
    
    UserA->>App: Update Meeting Feedback
    UserA->>App: Select Outcome (Positive/Neutral/Negative)
    App->>API: Submit Feedback
    API->>DB: Update Connection Status
    
    alt Outcome: Positive
        UserA->>App: Mark "Proceed Further"
        UserA->>App: Select Next Steps (Kundali/Engagement)
        App->>API: Update Status
        API->>DB: Update to "In Progress"
        
        UserA->>App: Mark "Engaged"
        UserA->>App: Enter Engagement Date
        UserA->>App: Upload Photos (Optional)
        UserA->>App: Share Success Story
        
        App->>API: Mark as Success
        API->>DB: Update Profile Status to "Engaged"
        API->>DB: Hide Profile from Search
        API->>DB: Add to Success Stories
        
        API-->>App: Congratulations Message
        
    else Outcome: Not Interested
        UserA->>App: Mark "Not Interested"
        UserA->>App: Select Reason
        App->>API: Close Connection
        API->>DB: Update Status to "Closed"
        UserA->>App: Continue Browsing
    end
```

---

## 4. Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ PROFILE : has
    USER ||--o{ LOGIN_SESSION : has
    USER ||--o{ NOTIFICATION : receives
    
    PROFILE ||--|| PERSONAL_DETAILS : contains
    PROFILE ||--|| EDUCATION : contains
    PROFILE ||--|| OCCUPATION : contains
    PROFILE ||--|| FAMILY_BACKGROUND : contains
    PROFILE ||--|| RELIGIOUS_DETAILS : contains
    PROFILE ||--|| LIFESTYLE : contains
    PROFILE ||--|| PARTNER_EXPECTATIONS : contains
    PROFILE ||--o{ PHOTO : has
    PROFILE ||--o| VIDEO : has
    PROFILE ||--o{ SOCIAL_MEDIA : links
    PROFILE ||--o{ VERIFICATION_DOCUMENT : has
    
    PROFILE ||--o{ INTEREST_SENT : sends
    PROFILE ||--o{ INTEREST_RECEIVED : receives
    PROFILE ||--o{ SHORTLIST : creates
    PROFILE ||--o{ BLOCKED_USER : blocks
    
    INTEREST_SENT ||--|| INTEREST_RECEIVED : matches
    INTEREST_SENT ||--o| CONNECTION : creates
    
    CONNECTION ||--o{ MESSAGE : contains
    CONNECTION ||--o{ MEETING : schedules
    
    ADMIN ||--o{ PROFILE_VERIFICATION : performs
    ADMIN ||--o{ REPORT_REVIEW : handles
    ADMIN ||--o{ ANNOUNCEMENT : creates
    
    PROFILE ||--o{ REPORT : reported_in
    
    SUCCESS_STORY ||--|| CONNECTION : created_from

    USER {
        int user_id PK
        string mobile_number UK
        string email
        datetime created_at
        datetime last_login
        enum user_type "self/son/daughter/brother/sister"
        enum status "pending/verified/suspended/deleted"
    }
    
    PROFILE {
        int profile_id PK
        int user_id FK
        enum status "draft/pending_family/pending_admin/live/engaged/hidden"
        datetime verified_at
        int verified_by FK
        datetime last_updated
        int view_count
        boolean is_premium
    }
    
    PERSONAL_DETAILS {
        int detail_id PK
        int profile_id FK
        string full_name
        date date_of_birth
        int age
        string height
        int weight_kg
        enum complexion "fair/wheatish/dusky/dark"
        enum body_type "slim/average/athletic/heavy"
        string blood_group
        boolean physically_challenged
        string health_details
        boolean spectacles
    }
    
    EDUCATION {
        int education_id PK
        int profile_id FK
        string highest_education
        string college_university
        int year_of_passing
        string percentage_cgpa
        string additional_qualifications
        boolean currently_studying
        string current_course
    }
    
    OCCUPATION {
        int occupation_id PK
        int profile_id FK
        enum occupation_type "private/government/business/professional/farmer/not_working/student"
        string job_title
        string company_name
        int experience_years
        decimal monthly_income
        string job_location
        enum job_stability "permanent/contract/temporary"
        text future_plans
    }
    
    FAMILY_BACKGROUND {
        int family_id PK
        int profile_id FK
        string father_name
        int father_age
        string father_occupation
        decimal father_income
        string mother_name
        int mother_age
        string mother_occupation
        int num_brothers
        int num_sisters
        enum family_type "nuclear/joint"
        string native_place
        string native_district
        string current_address
        enum residential_status "own/rented/family_property"
        text property_assets
        decimal family_annual_income
    }
    
    FAMILY_MEMBER {
        int member_id PK
        int family_id FK
        enum relation "brother/sister"
        string name
        int age
        string occupation
        boolean is_married
        string spouse_name
        string spouse_occupation
        string settled_location
    }
    
    RELIGIOUS_DETAILS {
        int religious_id PK
        int profile_id FK
        string religion
        string caste
        string sub_caste
        string gotra
        enum manglik "yes/no/dont_know/dont_believe"
        string nakshatra
        string rashi
        time birth_time
        string birth_place
        boolean show_kundali
    }
    
    LIFESTYLE {
        int lifestyle_id PK
        int profile_id FK
        enum food_preference "pure_veg/veg_egg/non_veg"
        enum smoking "no/occasionally/regularly"
        enum drinking "no/occasionally/regularly"
        enum religiousness "very/religious/moderate/not"
        time wake_up_time
        time sleep_time
        boolean exercise
        text hobbies
        text languages_known
        enum computer_knowledge "expert/good/basic/none"
    }
    
    PARTNER_EXPECTATIONS {
        int expectation_id PK
        int profile_id FK
        int age_min
        int age_max
        string height_min
        string height_max
        string minimum_education
        text occupation_preference
        decimal minimum_income
        text location_preference
        enum manglik_preference "only_manglik/only_non_manglik/doesnt_matter"
        enum family_type_preference "nuclear/joint/both"
        text description
    }
    
    PHOTO {
        int photo_id PK
        int profile_id FK
        string file_path
        enum photo_type "individual_traditional/individual_casual/family/full_body/additional"
        int display_order
        boolean is_primary
        datetime uploaded_at
        enum status "pending/approved/rejected"
    }
    
    VIDEO {
        int video_id PK
        int profile_id FK
        string file_path
        int duration_seconds
        datetime uploaded_at
        enum status "pending/approved/rejected"
    }
    
    SOCIAL_MEDIA {
        int social_id PK
        int profile_id FK
        enum platform "instagram/facebook/linkedin/youtube"
        string profile_url
        boolean is_verified
        json selected_posts
        datetime linked_at
    }
    
    VERIFICATION_DOCUMENT {
        int doc_id PK
        int profile_id FK
        enum doc_type "aadhaar_front/aadhaar_back/selfie_aadhaar/family_photo"
        string file_path
        datetime uploaded_at
        enum status "pending/verified/rejected"
    }
    
    REFERENCE {
        int reference_id PK
        int profile_id FK
        string reference_name
        string reference_mobile
        boolean is_verified
        datetime verified_at
        int verified_by FK
        text admin_notes
    }
    
    INTEREST_SENT {
        int interest_id PK
        int sender_profile_id FK
        int receiver_profile_id FK
        text introduction_message
        datetime sent_at
        enum status "pending/accepted/rejected/question_asked"
        datetime status_updated_at
    }
    
    INTEREST_RECEIVED {
        int interest_id PK
        int receiver_profile_id FK
        int sender_profile_id FK
        boolean is_read
        datetime read_at
        text question
        text answer
        string rejection_reason
    }
    
    CONNECTION {
        int connection_id PK
        int profile_a_id FK
        int profile_b_id FK
        datetime connected_at
        enum status "active/meeting_arranged/in_progress/engaged/closed"
        text status_notes
        datetime last_updated
    }
    
    MESSAGE {
        int message_id PK
        int connection_id FK
        int sender_profile_id FK
        text message_content
        datetime sent_at
        boolean is_read
    }
    
    MEETING {
        int meeting_id PK
        int connection_id FK
        date meeting_date
        time meeting_time
        string venue
        enum meeting_type "our_place/their_place/neutral"
        text notes
        enum outcome "very_positive/positive/neutral/not_interested"
        text feedback
        datetime created_at
    }
    
    SHORTLIST {
        int shortlist_id PK
        int profile_id FK
        int shortlisted_profile_id FK
        datetime added_at
        text notes
    }
    
    BLOCKED_USER {
        int block_id PK
        int blocker_profile_id FK
        int blocked_profile_id FK
        datetime blocked_at
        text reason
    }
    
    ADMIN {
        int admin_id PK
        string name
        string mobile
        string email
        enum role "super_admin/committee_member/moderator"
        datetime created_at
    }
    
    PROFILE_VERIFICATION {
        int verification_id PK
        int profile_id FK
        int admin_id FK
        datetime verified_at
        enum action "approved/rejected/need_more_info"
        text admin_notes
        text rejection_reason
    }
    
    REPORT {
        int report_id PK
        int reported_profile_id FK
        int reporter_profile_id FK
        enum reason "fake/wrong_info/inappropriate/harassment/other"
        text details
        string proof_file_path
        datetime reported_at
        enum status "pending/under_review/action_taken/dismissed"
        int reviewed_by FK
        text admin_action
    }
    
    ANNOUNCEMENT {
        int announcement_id PK
        int created_by FK
        string title
        text content
        datetime published_at
        boolean is_active
    }
    
    SUCCESS_STORY {
        int story_id PK
        int connection_id FK
        date engagement_date
        text story_description
        json photos
        boolean is_published
        datetime created_at
        int likes_count
    }
    
    NOTIFICATION {
        int notification_id PK
        int user_id FK
        enum type "interest_received/interest_accepted/profile_viewed/message/meeting_reminder/admin"
        text content
        boolean is_read
        datetime created_at
    }
    
    LOGIN_SESSION {
        int session_id PK
        int user_id FK
        string device_id
        string device_type
        string fcm_token
        datetime login_at
        datetime last_active
    }
```

---

## 5. State Diagrams

### 5.1 Profile Status State Machine

```mermaid
stateDiagram-v2
    [*] --> Draft: User Registers
    
    Draft --> PendingVerification: User Submits for Verification
    
    PendingVerification --> Rejected: Admin Rejects
    PendingVerification --> Verified: Admin Approves
    
    Rejected --> [*]: User Can Re-register
    
    Verified --> PendingCompletion: User Completes Profile
    
    PendingCompletion --> PendingFamilyApproval: User Requests Family Approval
    
    PendingFamilyApproval --> PendingCompletion: Family Requests Changes
    PendingFamilyApproval --> Live: Family Approves
    
    Live --> Hidden: User Hides Profile
    Hidden --> Live: User Unhides Profile
    
    Live --> Suspended: Admin Suspends (Report)
    Suspended --> Live: Admin Reinstates
    Suspended --> [*]: Permanently Banned
    
    Live --> Engaged: User Marks Engaged
    Engaged --> [*]: Success Story
    
    Live --> Deleted: User Deletes
    Hidden --> Deleted: User Deletes
    Deleted --> [*]
```

### 5.2 Interest Status State Machine

```mermaid
stateDiagram-v2
    [*] --> Sent: User A Sends Interest
    
    Sent --> Read: User B Views Interest
    Read --> Sent: User B Doesn't Respond Yet
    
    Sent --> QuestionAsked: User B Asks Question
    QuestionAsked --> QuestionAnswered: User A Answers
    QuestionAnswered --> Sent: Back to Pending
    
    Sent --> Accepted: User B Accepts
    Sent --> Rejected: User B Rejects
    
    Accepted --> Connection: Mutual Interest Created
    Connection --> Active: Both Users Communicating
    
    Active --> MeetingArranged: Meeting Scheduled
    MeetingArranged --> Active: After Meeting
    
    Active --> InProgress: Moving Towards Engagement
    InProgress --> Engaged: Engagement Confirmed
    InProgress --> Closed: Not Interested After Meeting
    
    Active --> Closed: Either Party Not Interested
    
    Rejected --> [*]: Interest Declined
    Closed --> [*]: Connection Ended
    Engaged --> [*]: Success
```

### 5.3 Admin Verification Flow

```mermaid
stateDiagram-v2
    [*] --> NewRegistration: User Submits
    
    NewRegistration --> UnderReview: Admin Opens Case
    
    UnderReview --> CallingReferences: Admin Contacts References
    CallingReferences --> Reference1Called: First Reference
    Reference1Called --> Reference2Called: Second Reference
    
    Reference2Called --> DocumentVerification: Verify Aadhaar
    
    DocumentVerification --> ApprovalDecision: All Checks Done
    
    ApprovalDecision --> Approved: Everything Valid
    ApprovalDecision --> NeedMoreInfo: Missing Info
    ApprovalDecision --> Rejected: Invalid/Fake
    
    NeedMoreInfo --> UnderReview: User Provides Info
    
    Approved --> NotifyUser: Send Approval SMS
    Rejected --> NotifyUser: Send Rejection SMS
    
    NotifyUser --> [*]
```

---

## 6. Component Architecture

### 6.1 Frontend Component Hierarchy

```mermaid
graph TD
    App[App Root]
    
    App --> Auth[Auth Module]
    App --> Main[Main Application]
    
    Auth --> Login[Login Screen]
    Auth --> Register[Registration Flow]
    Auth --> OTPVerify[OTP Verification]
    
    Main --> Home[Home Dashboard]
    Main --> Profile[Profile Module]
    Main --> Search[Search & Browse]
    Main --> Interest[Interest Management]
    Main --> Settings[Settings]
    
    Home --> Stats[Statistics Widget]
    Home --> Notifications[Notification Center]
    Home --> QuickActions[Quick Action Buttons]
    Home --> SuccessStories[Success Stories Feed]
    
    Profile --> ViewProfile[View Own Profile]
    Profile --> EditProfile[Edit Profile]
    Profile --> PhotoGallery[Photo Management]
    Profile --> VideoUpload[Video Upload]
    Profile --> SocialLink[Social Media Linking]
    
    Search --> Filters[Search Filters]
    Search --> ProfileList[Profile List View]
    Search --> ProfileDetail[Profile Detail View]
    Search --> SendInterest[Send Interest Form]
    
    Interest --> Received[Received Interests]
    Interest --> Sent[Sent Interests]
    Interest --> Connections[Active Connections]
    Interest --> InterestDetail[Interest Detail View]
    
    Connections --> ContactInfo[Contact Information]
    Connections --> SocialPreview[Social Media Preview]
    Connections --> MeetingScheduler[Meeting Scheduler]
    Connections --> StatusUpdate[Status Update]
    
    Settings --> Privacy[Privacy Controls]
    Settings --> Notifications2[Notification Settings]
    Settings --> BlockedUsers[Blocked Users]
    Settings --> Help[Help & Support]
```

### 6.2 Backend Service Architecture

```mermaid
graph TB
    subgraph "API Layer"
        Gateway[API Gateway]
        Auth[Auth Controller]
        Profile[Profile Controller]
        Interest[Interest Controller]
        Search[Search Controller]
        Admin[Admin Controller]
    end
    
    subgraph "Business Logic Layer"
        AuthService[Authentication Service]
        ProfileService[Profile Service]
        MatchService[Matching Service]
        InterestService[Interest Service]
        VerifyService[Verification Service]
        NotificationService[Notification Service]
        MediaService[Media Service]
        SocialService[Social Media Service]
    end
    
    subgraph "Data Access Layer"
        UserRepo[User Repository]
        ProfileRepo[Profile Repository]
        InterestRepo[Interest Repository]
        ConnectionRepo[Connection Repository]
        MediaRepo[Media Repository]
    end
    
    subgraph "Infrastructure"
        Cache[Redis Cache]
        Queue[Message Queue]
        Storage[Cloud Storage]
        Search_Engine[Search Engine]
    end
    
    Gateway --> Auth
    Gateway --> Profile
    Gateway --> Interest
    Gateway --> Search
    Gateway --> Admin
    
    Auth --> AuthService
    Profile --> ProfileService
    Profile --> MediaService
    Interest --> InterestService
    Search --> MatchService
    
    AuthService --> UserRepo
    ProfileService --> ProfileRepo
    InterestService --> InterestRepo
    MediaService --> MediaRepo
    
    ProfileService --> Cache
    MatchService --> Cache
    MatchService --> Search_Engine
    
    NotificationService --> Queue
    MediaService --> Storage
    SocialService --> Storage
```

### 6.3 Mobile App Architecture (MVVM Pattern)

```mermaid
graph TB
    subgraph "View Layer"
        UI[UI Components<br/>Activities/Fragments]
        Layout[XML Layouts]
    end
    
    subgraph "ViewModel Layer"
        AuthVM[Auth ViewModel]
        ProfileVM[Profile ViewModel]
        SearchVM[Search ViewModel]
        InterestVM[Interest ViewModel]
    end
    
    subgraph "Model Layer"
        UserModel[User Model]
        ProfileModel[Profile Model]
        InterestModel[Interest Model]
        ConnectionModel[Connection Model]
    end
    
    subgraph "Repository Layer"
        AuthRepo[Auth Repository]
        ProfileRepo[Profile Repository]
        InterestRepo[Interest Repository]
    end
    
    subgraph "Data Source"
        API[REST API Client]
        LocalDB[Room Database]
        Preferences[Shared Preferences]
    end
    
    subgraph "Utilities"
        ImageLoader[Image Loader]
        VideoPlayer[Video Player]
        NetworkMonitor[Network Monitor]
        Analytics[Analytics]
    end
    
    UI --> AuthVM
    UI --> ProfileVM
    UI --> SearchVM
    UI --> InterestVM
    
    AuthVM --> UserModel
    ProfileVM --> ProfileModel
    SearchVM --> ProfileModel
    InterestVM --> InterestModel
    
    AuthVM --> AuthRepo
    ProfileVM --> ProfileRepo
    InterestVM --> InterestRepo
    
    AuthRepo --> API
    ProfileRepo --> API
    InterestRepo --> API
    
    AuthRepo --> LocalDB
    ProfileRepo --> LocalDB
    InterestRepo --> LocalDB
    
    AuthRepo --> Preferences
    
    ProfileVM --> ImageLoader
    ProfileVM --> VideoPlayer
    
    UI --> NetworkMonitor
    UI --> Analytics
```

---

## 7. Data Flow Diagrams

### 7.1 Interest Sending & Matching Process

```mermaid
flowchart LR
    subgraph "User A Device"
        A1[Browse Profiles]
        A2[View Profile]
        A3[Send Interest]
        A4[Receive Acceptance]
        A5[View Unlocked Data]
    end
    
    subgraph "Server"
        S1[Profile API]
        S2[Interest API]
        S3[Notification Service]
        S4[Database]
    end
    
    subgraph "User B Device"
        B1[Receive Notification]
        B2[View Interest]
        B3[Accept/Reject]
        B4[View Unlocked Data]
    end
    
    A1 -->|GET /profiles?filters| S1
    S1 -->|Query| S4
    S4 -->|Results| S1
    S1 -->|Profile List| A1
    
    A2 -->|GET /profile/:id/public| S1
    S1 -->|Public Data| A2
    
    A3 -->|POST /interest| S2
    S2 -->|Save| S4
    S2 -->|Trigger| S3
    S3 -->|Push + SMS| B1
    
    B2 -->|GET /interest/:id| S2
    S2 -->|Interest Details| B2
    
    B3 -->|POST /interest/accept| S2
    S2 -->|Update + Unlock| S4
    S2 -->|Notify| S3
    S3 -->|Push| A4
    
    A5 -->|GET /profile/:id/private| S1
    S1 -->|Private Data| A5
    
    B4 -->|GET /profile/:id/private| S1
    S1 -->|Private Data| B4
```

### 7.2 Social Media Integration Flow

```mermaid
flowchart TD
    User[User] -->|Link Instagram| App[Mobile App]
    App -->|POST /social/link| API[API Server]
    API -->|Generate Code| DB[(Database)]
    API -->|Return Code| App
    
    App -->|Display Code| User
    User -->|Post on Instagram| Instagram[Instagram]
    
    User -->|Click Verify| App
    App -->|POST /social/verify| API
    API -->|Scrape Post| Instagram
    Instagram -->|Post Data| API
    
    API -->|Verify Code| Validate{Code Match?}
    Validate -->|Yes| SaveLink[Save Link in DB]
    Validate -->|No| Error[Return Error]
    
    SaveLink --> DB
    SaveLink -->|Success| App
    
    App -->|Select Posts| User
    User -->|Choose 8-12 Posts| App
    App -->|POST /social/curate| API
    API -->|Fetch Posts| Instagram
    Instagram -->|Post Details| API
    API -->|Save Curated Posts| DB
    API -->|Confirm| App
```

---

## 8. Security Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Client[Mobile App / Web]
    end
    
    subgraph "Security Layer"
        WAF[Web Application Firewall]
        RateLimit[Rate Limiter]
        OAuth[OAuth 2.0 / JWT]
    end
    
    subgraph "API Layer"
        Gateway[API Gateway]
        Auth[Authentication Service]
    end
    
    subgraph "Data Protection"
        Encrypt[Encryption at Rest]
        TLS[TLS 1.3 in Transit]
        Audit[Audit Logging]
    end
    
    subgraph "Privacy Controls"
        DataMask[Data Masking]
        AccessControl[Role-Based Access Control]
        Consent[Consent Management]
    end
    
    subgraph "External Security"
        AadhaarAPI[Aadhaar Verification API]
        SMS_OTP[SMS OTP Provider]
    end
    
    Client -->|HTTPS| WAF
    WAF --> RateLimit
    RateLimit --> OAuth
    OAuth --> Gateway
    
    Gateway --> Auth
    Auth -->|Verify Token| OAuth
    
    Gateway --> Encrypt
    Gateway --> TLS
    Gateway --> Audit
    
    Gateway --> DataMask
    Gateway --> AccessControl
    Gateway --> Consent
    
    Auth --> AadhaarAPI
    Auth --> SMS_OTP
    
    style Client fill:#e1f5ff
    style Security Layer fill:#fff4e1
    style Data Protection fill:#ffe1e1
    style Privacy Controls fill:#e1ffe1
```

---

## 9. Deployment Architecture

```mermaid
graph TB
    subgraph "Client Tier"
        Web[Web Browser]
        iOS[iOS App]
        Android[Android App]
    end
    
    subgraph "CDN & Load Balancing"
        CDN[CloudFront CDN]
        LB[Application Load Balancer]
    end
    
    subgraph "Application Tier - Auto Scaling Group"
        API1[API Server 1]
        API2[API Server 2]
        API3[API Server 3]
    end
    
    subgraph "Caching Layer"
        Redis1[Redis Master]
        Redis2[Redis Replica]
    end
    
    subgraph "Database Tier"
        PG_Master[(PostgreSQL Master)]
        PG_Replica[(PostgreSQL Replica)]
    end
    
    subgraph "Storage Tier"
        S3[S3 Bucket<br/>Photos & Videos]
    end
    
    subgraph "Message Queue"
        Queue[RabbitMQ / SQS]
    end
    
    subgraph "Background Workers"
        Worker1[Worker 1<br/>Notifications]
        Worker2[Worker 2<br/>Media Processing]
        Worker3[Worker 3<br/>Reports]
    end
    
    subgraph "Monitoring & Logging"
        Monitor[CloudWatch / Prometheus]
        Logs[ELK Stack]
    end
    
    Web --> CDN
    iOS --> CDN
    Android --> CDN
    
    CDN --> LB
    
    LB --> API1
    LB --> API2
    LB --> API3
    
    API1 --> Redis1
    API2 --> Redis1
    API3 --> Redis1
    
    Redis1 --> Redis2
    
    API1 --> PG_Master
    API2 --> PG_Master
    API3 --> PG_Master
    
    PG_Master --> PG_Replica
    
    API1 --> S3
    API2 --> S3
    API3 --> S3
    
    API1 --> Queue
    API2 --> Queue
    API3 --> Queue
    
    Queue --> Worker1
    Queue --> Worker2
    Queue --> Worker3
    
    API1 --> Monitor
    API2 --> Monitor
    API3 --> Monitor
    
    API1 --> Logs
    API2 --> Logs
    API3 --> Logs
```

---

## 10. Key Design Decisions

### 10.1 Privacy by Design
- **Contact Details Locked**: Phone numbers, email, and social media are hidden until mutual interest
- **Two-Layer Approval**: Profile must be approved by both admin committee and family
- **Curated Social Media**: Users select specific posts to share, not entire profiles
- **Blocking & Reporting**: Users can block profiles and report issues

### 10.2 Verification Mechanisms
- **Three-Level Verification**:
  1. Mobile OTP verification
  2. Aadhaar document verification
  3. Reference verification by calling existing members
- **Admin Review**: Human verification by samaj committee members
- **Photo Verification**: Selfie with Aadhaar to prevent fake profiles

### 10.3 Data Architecture Decisions
- **PostgreSQL** for relational data (profiles, interests, connections)
- **Redis** for caching frequently accessed data (active profiles, search results)
- **S3/Cloud Storage** for media files (photos, videos)
- **Message Queue** for asynchronous tasks (notifications, email)

### 10.4 Scalability Considerations
- Horizontal scaling with load balancers
- Database read replicas for search queries
- CDN for media delivery
- Caching layer to reduce database load
- Asynchronous processing for non-critical tasks

### 10.5 Mobile-First Approach
- Responsive web design
- Native mobile apps (Android & iOS)
- Offline capability for viewing cached profiles
- Push notifications for real-time updates
- Low bandwidth optimization for rural areas

---

## 11. Technology Stack Recommendations

### Frontend
- **Web**: React.js / Vue.js with TypeScript
- **Mobile**: 
  - Android: Kotlin with Jetpack Compose
  - iOS: Swift with SwiftUI
  - Cross-platform: React Native (if budget constrained)

### Backend
- **API**: Node.js (Express) or Python (FastAPI)
- **Database**: PostgreSQL 14+
- **Cache**: Redis 7+
- **Message Queue**: RabbitMQ or AWS SQS
- **Storage**: AWS S3 or Google Cloud Storage

### DevOps
- **Containerization**: Docker
- **Orchestration**: Kubernetes or AWS ECS
- **CI/CD**: GitHub Actions or GitLab CI
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

### External Services
- **SMS**: Twilio or AWS SNS
- **Email**: SendGrid or AWS SES
- **Push Notifications**: Firebase Cloud Messaging
- **Analytics**: Google Analytics + Mixpanel
- **Error Tracking**: Sentry

---

## Summary

This design document provides a comprehensive technical blueprint for the Kunbi Samaj Matrimony Application including:

1. **System Architecture**: Microservices-based architecture with clear separation of concerns
2. **User Flows**: Complete journey from registration to engagement
3. **Database Design**: Normalized ER diagram with 25+ entities
4. **State Management**: State machines for profile and interest lifecycles
5. **Security**: Multi-layered security with privacy controls
6. **Scalability**: Cloud-native architecture with auto-scaling capabilities

The application is designed to be:
- **User-friendly**: Simple flows for non-technical users
- **Privacy-focused**: Contact details protected until mutual interest
- **Community-driven**: Samaj committee verification and involvement
- **Scalable**: Can handle thousands of profiles and concurrent users
- **Secure**: Multiple verification layers and data protection

This architecture supports the unique requirements of a community-based matrimony platform while maintaining modern software engineering best practices.