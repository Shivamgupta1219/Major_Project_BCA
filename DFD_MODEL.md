# Data Flow Diagram (DFD) - AI Resume Builder

## Level 0 (Context Diagram)

```
┌─────────────┐
│    Users    │
└──────┬──────┘
       ├─── Login/Register ────────┐
       ├─── Create Resume ─────────┤
       ├─── View Resumes ──────────┤
       ├─── Apply Jobs ────────────┤                        
       │                    ┌───────▼───────┐
       │                    │  AI Resume    │
       │                    │  Builder      │
       │                    │  System       │
       │                    └────────┬──────┘
       ├─────────────────────────────┤
       ▼                             ▼
┌─────────────────┐      ┌──────────────────┐
│  Admin Panel    │      │  External APIs   │
│  (Analytics)    │      │  - Google Gemini │
└─────────────────┘      │  - Groq          │
                         │  - JSearch       │
┌──────────────────┐     │  - Razorpay      │
│  College Admin   │     └──────────────────┘
│  (User Mgmt)     │
└──────────────────┘


---

## Level 1 (Main Processes)

```
                    ┌──────────────────────────────────────┐
                    │                                      │
                    │     AI RESUME BUILDER SYSTEM        │
                    │                                      │
    ┌───────────────┼──────────────────────────────────────┼─────────────────┐
    │               │                                      │                 │
    ▼               ▼                                      ▼                 ▼

┌─────────────┐  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐
│ 1.0         │  │ 2.0         │  │ 3.0          │  │ 4.0          │
│ User        │  │ Resume      │  │ AI Features  │  │ Job Matching │
│ Management  │  │ Management  │  │ & ATS        │  │ & Tracking   │
│             │  │             │  │              │  │              │
│ - Register  │  │ - Create    │  │ - Content    │  │ - Search Job │
│ - Login     │  │ - Read      │  │   Generation │  │   Listings   │
│ - Profile   │  │ - Update    │  │ - Score      │  │ - Match      │
│ - Delete    │  │ - Delete    │  │   Checking   │  │   Resume     │
└─────────────┘  └─────────────┘  └──────────────┘  └──────────────┘
    │               │                │                 │
    │               │                │                 │
    ▼               ▼                ▼                 ▼
┌──────────────────────────────────────────────────────────┐
│                 5.0 Subscription                         │
│         & Payment Processing                            │
│  - Check Status                                         │
│  - Process Payment (Razorpay)                           │
│  - Update Access                                        │
└──────────────────────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────────────────────┐
│              6.0 Notification Service                    │
│  - Email Alerts                                         │
│  - In-App Notifications                                │
│  - Job Recommendations                                 │
└──────────────────────────────────────────────────────────┘
```

---

## Level 2 (Detailed Data Flows)

### Process 1.0: User Management

```
      User Input                    
         │                          
         ▼                          
    ┌─────────────┐                
    │ 1.1 Auth    │                
    │ Validate    │                
    └──────┬──────┘                
           │ Credentials           
           ▼                       
    ┌────────────────┐            
    │ 1.2 Encrypt    │            
    │ Password       │            
    └────────┬───────┘            
             │ Encrypted PWD       
             ▼                     
    ┌─────────────────────┐        
    │ 1.3 Store/Update    │        
    │ User Info           │        
    └────────┬────────────┘        
             │ Confirmation        
             ▼                     
         Response to User          
```

**Data Store:**
- **D1: Users DB** (MongoDB)
  - user_id, email, password_hash, name, profile, subscription_status

---

### Process 2.0: Resume Management

```
User Resume Data
       │
       ▼
   ┌────────────────┐
   │ 2.1 Create/    │
   │ Edit Resume    │
   └────────┬───────┘
            │ Resume Content
            ▼
   ┌────────────────────────┐
   │ 2.2 Validate Format    │
   │ (PDF, Text)            │
   └────────┬───────────────┘
            │ Valid Resume
            ▼
   ┌────────────────────┐
   │ 2.3 Parse Resume   │
   │ Extract Data       │
   └────────┬───────────┘
            │ Parsed Data
            ▼
   ┌──────────────────────┐
   │ 2.4 Store Resume     │
   │ + Metadata           │
   └────────┬─────────────┘
            │ Confirmation
            ▼
      Response to User
```

**Data Stores:**
- **D2: Resumes DB** (MongoDB)
  - resume_id, user_id, content, parsed_data, created_date, updated_date
- **D3: Resume Files** (ImageKit/Cloud Storage)
  - Actual resume PDFs/documents

---

### Process 3.0: AI Features & ATS

```
Resume Data + User Input
       │
       ▼
   ┌──────────────────────┐
   │ 3.1 Prepare Data     │
   │ for AI               │
   └─────────┬────────────┘
             │ Formatted Data
             ▼
   ┌────────────────────────────┐
   │ 3.2 Call AI API            │
   │ - Google Gemini            │
   │ - Groq                     │
   └─────────┬──────────────────┘
             │ AI Response
             ▼
   ┌────────────────────┐
   │ 3.3 Process Result │
   │ - Score            │
   │ - Suggestions      │
   └──────────┬─────────┘
              │ Processed Data
              ▼
   ┌──────────────────────┐
   │ 3.4 Cache Results    │
   │ in Database          │
   └──────────┬───────────┘
              │ Confirmation
              ▼
         Return to User
```

**Data Stores:**
- **D4: AI Results Cache** (MongoDB)
  - result_id, resume_id, ai_score, suggestions, timestamp
- **External Data:**
  - Google Gemini API
  - Groq API

---

### Process 4.0: Job Matching & Tracking

```
User Search Query / Resume
       │
       ▼
   ┌─────────────────────────┐
   │ 4.1 Call JSearch API    │
   │ Get Job Listings        │
   └──────────┬──────────────┘
              │ Job Data
              ▼
   ┌─────────────────────────┐
   │ 4.2 Match Resume to     │
   │ Job Requirements        │
   └──────────┬──────────────┘
              │ Matching Score
              ▼
   ┌─────────────────────────┐
   │ 4.3 Rank & Filter Jobs  │
   │ By Match Score          │
   └──────────┬──────────────┘
              │ Filtered Results
              ▼
   ┌─────────────────────────┐
   │ 4.4 Store Job History   │
   │ & Bookmarks             │
   └──────────┬──────────────┘
              │ Confirmation
              ▼
         Return to User
```

**Data Stores:**
- **D5: Job Applications** (MongoDB)
  - application_id, user_id, job_id, resume_id, status, match_score
- **D6: Bookmarked Jobs** (MongoDB)
  - bookmark_id, user_id, job_id, created_date

---

### Process 5.0: Subscription & Payment

```
Subscription Request
       │
       ▼
   ┌──────────────────────┐
   │ 5.1 Check Current    │
   │ Subscription Status  │
   └─────────┬────────────┘
             │ Status
             ▼
   ┌──────────────────────┐
   │ 5.2 Calculate Price  │
   │ & Duration           │
   └─────────┬────────────┘
             │ Quote
             ▼
   ┌───────────────────────────┐
   │ 5.3 Create Order          │
   │ & Call Razorpay API       │
   └──────────┬────────────────┘
              │ Payment Response
              ▼
   ┌───────────────────────┐
   │ 5.4 Verify Payment    │
   │ & Update Subscription │
   └──────────┬────────────┘
              │ Confirmation
              ▼
         Response to User
```

**Data Stores:**
- **D7: Subscriptions** (MongoDB)
  - subscription_id, user_id, plan_type, start_date, end_date, status
- **D8: Payments** (MongoDB)
  - payment_id, subscription_id, amount, status, transaction_id

---

### Process 6.0: Notifications

```
Event Triggered
(Job Match, Expiry, etc)
       │
       ▼
   ┌─────────────────────┐
   │ 6.1 Check User      │
   │ Preferences         │
   └──────────┬──────────┘
              │ Preferences
              ▼
   ┌──────────────────────┐
   │ 6.2 Format Message   │
   │ Content              │
   └──────────┬───────────┘
              │ Formatted Msg
              ▼
   ┌──────────────────────┐
   │ 6.3 Send            │
   │ - Email             │
   │ - In-App Alert      │
   └──────────┬───────────┘
              │ Sent
              ▼
   ┌──────────────────────┐
   │ 6.4 Store Sent      │
   │ Notification Log    │
   └──────────┬───────────┘
              │ Logged
              ▼
           Confirmation
```

**Data Stores:**
- **D9: Notifications** (MongoDB)
  - notification_id, user_id, type, content, sent_date, read_status

---

## Complete Data Flow Summary

```
                    ┌─────────────┐
                    │   Users     │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    ┌────────────┐   ┌──────────┐   ┌───────────────┐
    │ 1.0 Auth   │   │ 2.0 Mgmt │   │ 3.0 AI Feats  │
    └────────────┘   └──────────┘   └───────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    ┌──────────────┐  ┌──────────┐  ┌──────────────┐
    │ 4.0 Jobs    │  │ 5.0 Subs │  │ 6.0 Notify   │
    └──────────────┘  └──────────┘  └──────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
            ┌────────────────────────────┐
            │   Databases (D1-D9)        │
            │   MongoDB                  │
            └────────────────────────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
        ┌──────────────┐      ┌─────────────────┐
        │ External     │      │ Cloud Storage   │
        │ APIs         │      │ (ImageKit)      │
        │ - Gemini     │      └─────────────────┘
        │ - Groq       │
        │ - JSearch    │
        │ - Razorpay   │
        └──────────────┘
```

---

## Data Dictionary

### External Entities
| Entity | Description |
|--------|-------------|
| User | Student/Job Seeker using the platform |
| Admin | System Administrator for analytics |
| College Admin | College-specific admin for bulk user setup |
| Google Gemini API | AI content generation |
| Groq API | Alternative AI provider |
| JSearch API | Job listings aggregator |
| Razorpay | Payment gateway |

### Data Stores
| Store | Type | Purpose |
|-------|------|---------|
| D1: Users | MongoDB | User profiles, credentials |
| D2: Resumes | MongoDB | Resume metadata |
| D3: Resume Files | Cloud Storage | Actual resume documents |
| D4: AI Results | MongoDB | AI scores, suggestions |
| D5: Applications | MongoDB | Job application tracking |
| D6: Bookmarks | MongoDB | Saved jobs |
| D7: Subscriptions | MongoDB | User subscription info |
| D8: Payments | MongoDB | Transaction records |
| D9: Notifications | MongoDB | Notification history |

### Key Data Elements
```
User:
  user_id, email, password_hash, name, phone, location, 
  profile_pic, skills, experience, education, subscription_status

Resume:
  resume_id, user_id, title, content, file_path, parsed_skills,
  parsed_experience, ai_score, created_date, updated_date

Job:
  job_id, title, company, location, description, requirements,
  salary_range, job_type, source, posted_date

Subscription:
  subscription_id, user_id, plan_type, start_date, end_date,
  status, features_enabled, payment_id

Notification:
  notification_id, user_id, type, title, content, sent_date, 
  read_status, action_url
```

---

## Security & Access Control

```
┌─────────────────────────────────────┐
│      Authentication Layer           │
│   JWT Token + Authorization         │
└──────────────────┬──────────────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
    ▼              ▼              ▼
 ┌────────┐   ┌────────┐    ┌──────────┐
 │ User   │   │ Admin  │    │ College  │
 │ Routes │   │ Routes │    │ Admin    │
 └────────┘   └────────┘    └──────────┘
```

---

## Technology Stack Mapping

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React + Vite | User Interface |
| **Backend** | Node.js + Express | API Server |
| **Database** | MongoDB + Mongoose | Data Persistence |
| **Authentication** | JWT | Secure Access |
| **File Storage** | ImageKit | Resume/Media Files |
| **Payments** | Razorpay | Subscription Payments |
| **AI Services** | Google Gemini, Groq | Content Generation |
| **Job API** | JSearch | Job Aggregation |
| **Deployment** | Vercel | Cloud Hosting |

---

## Data Flow Volumes (Estimated)

```
Daily Users: 100-500
Daily Resume Uploads: 50-200
Daily Job Searches: 200-1000
Daily API Calls: 5000-15000
Database Transactions/sec: 10-50
Storage Growth: 1-5 GB/month
```

