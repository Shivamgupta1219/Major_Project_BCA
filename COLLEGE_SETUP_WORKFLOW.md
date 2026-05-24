# 🏛️ Complete College Setup Workflow

## 📋 Step-by-Step Guide

### **STEP 1: Super Admin Creates College**

1. **Login as Super Admin**
   ```
   URL: http://localhost:5173/login
   Email: superadmin@campuscv.com
   Password: SuperAdmin@123
   ```

2. **Navigate to Colleges Management**
   ```
   URL: http://localhost:5173/super-admin/colleges
   Click: "Add College" or create button
   ```

3. **Fill College Details**
   ```
   College Name: "Example College"
   Short Name: "EC"
   Email: admin@examplecollege.edu
   Phone: 9876543210
   Plan: "Basic" (or Standard/Premium)
   ```

4. **Save College**
   - System generates unique `College ID`
   - College gets 30-day trial subscription
   - **SAVE THIS ID** - You'll give it to college admin

---

### **STEP 2: College Admin Registration**

1. **College Admin Goes to Login Page**
   ```
   URL: http://localhost:5173/login
   ```

2. **Click "Create Account" (Register)**

3. **Fill Registration Form**
   ```
   Name: "John Admin"
   Email: admin@examplecollege.edu
   Password: SecurePassword@123
   Role: SELECT "Admin" from dropdown
   College ID: Paste the ID from Step 1
   ```

4. **Submit & Login**
   - System assigns admin to college
   - All data is now isolated to that college
   - Gets redirected to `/admin` dashboard

---

### **STEP 3: College Admin Adds Students**

#### **Option A: Bulk Upload (CSV)**

1. **Login as College Admin**
   ```
   Email: admin@examplecollege.edu
   Password: SecurePassword@123
   ```

2. **Go to Bulk Upload**
   ```
   URL: http://localhost:5173/admin/bulk-upload
   ```

3. **Prepare CSV File**
   ```csv
   name,email,rollNo,department,year
   John Doe,john@college.edu,CS-001,Computer Science,2024
   Jane Smith,jane@college.edu,CS-002,Computer Science,2024
   Mike Johnson,mike@college.edu,EC-001,Electronics,2024
   ```

4. **Upload & Create**
   - System creates student accounts
   - Students get temporary passwords
   - **NOTE:** You can see passwords in system or email them to students

#### **Option B: Manual Student Registration**

1. **Student Goes to Login Page**
   ```
   URL: http://localhost:5173/login
   Click: "Create Account"
   ```

2. **Student Fills Registration**
   ```
   Name: "Student Name"
   Email: student@examplecollege.edu
   Password: StudentPassword@123
   Role: SELECT "Student"
   (Leave College ID blank - will be added by admin)
   ```

3. **Admin Adds College ID to Student**
   - Go to `/admin/students`
   - Find student in list
   - Manually add their college ID
   - (Or system auto-assigns if student registers from college domain)

---

### **STEP 4: Students Access Platform**

1. **Student Logins**
   ```
   URL: http://localhost:5173/login
   Email: student@examplecollege.edu
   Password: StudentPassword@123
   ```

2. **Student Dashboard**
   ```
   Access: http://localhost:5173/app
   Features available:
   - Resume Builder
   - AI Tools (if plan allows)
   - Career Path
   - Job Listings
   - Placement Drives
   - Profile Settings
   ```

3. **Student Creates Resume**
   - Click "Create Resume"
   - Build using resume builder
   - Submit for faculty review

---

### **STEP 5: Faculty Reviews Resume**

1. **Admin Creates Faculty Account**
   - Go to `/admin/students`
   - Create faculty user
   - Assign to college

2. **Faculty Logins**
   ```
   Email: faculty@examplecollege.edu
   Password: FacultyPassword@123
   ```

3. **Faculty Dashboard**
   ```
   Access: http://localhost:5173/faculty
   See:
   - Pending reviews
   - Assigned students
   - Student progress
   ```

4. **Faculty Reviews Resume**
   - Go to `/faculty/reviews`
   - Select student resume
   - Add feedback
   - Approve/Reject with suggestions

---

### **STEP 6: Subscription Management**

1. **College Admin Checks Current Plan**
   ```
   URL: http://localhost:5173/admin/subscription
   See: Current plan, features, usage
   ```

2. **Upgrade Plan (Optional)**
   ```
   Click: "Upgrade Now"
   Select: New plan (Standard/Premium)
   Pay: Via Razorpay
   Features unlocked based on plan
   ```

3. **Plan Features**
   ```
   BASIC (300 students):
   ✓ Resume Builder
   ✗ AI Tools
   ✗ Faculty Review
   
   STANDARD (1000 students):
   ✓ Resume Builder
   ✓ AI Score
   ✓ Interview Prep
   ✓ Faculty Review
   
   PREMIUM (Unlimited):
   ✓ All features
   ✓ White-label
   ✓ Priority support
   ```

---

## 🔄 Data Isolation Example

```
┌─────────────────────────────────────────────────────────┐
│                    Super Admin View                     │
│  ✓ College 1: 100 students, Basic Plan, Active         │
│  ✓ College 2: 250 students, Standard Plan, Active      │
│  ✓ College 3: 50 students, Trial, Active               │
└─────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                 ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  College 1   │  │  College 2   │  │  College 3   │
│   Admin      │  │   Admin      │  │   Admin      │
│              │  │              │  │              │
│ See: 100     │  │ See: 250     │  │ See: 50      │
│ students     │  │ students     │  │ students     │
│ Only!        │  │ Only!        │  │ Only!        │
└──────────────┘  └──────────────┘  └──────────────┘
        ↓                 ↓                 ↓
     [C1 Students]  [C2 Students]   [C3 Students]
     [C1 Faculty]   [C2 Faculty]    [C3 Faculty]
     [C1 Resumes]   [C2 Resumes]    [C3 Resumes]
```

---

## 📱 Mobile Access

**All pages are mobile-responsive:**
- ✅ Super Admin dashboard on mobile
- ✅ College admin panel on mobile
- ✅ Faculty review on mobile
- ✅ Student app on mobile

**Sidebar collapses on mobile → Hamburger menu appears**

---

## 🔐 Security & Isolation

### **Data Boundaries**
```
College ID is the KEY:
- Admin can only access their collegeId
- Students belong to one college only
- Faculty reviews only their college's students
- All queries filtered by collegeId
```

### **JWT Token Contains**
```javascript
{
  userId: "student123",
  role: "admin",
  collegeId: "college_xyz_id" ← KEY FOR ISOLATION
}
```

---

## ✅ Complete Workflow Checklist

### **As Super Admin:**
- [ ] Login with superadmin credentials
- [ ] Navigate to Colleges
- [ ] Create a college (get the College ID)
- [ ] Go to Subscriptions to view
- [ ] Check Analytics dashboard
- [ ] Review Settings

### **As College Admin:**
- [ ] Register with college ID from super admin
- [ ] Login to admin dashboard
- [ ] See "Subscription" page (shows current plan)
- [ ] Bulk upload students (or manual registration)
- [ ] Create faculty accounts
- [ ] View only YOUR college's data
- [ ] Manage subscription

### **As Faculty:**
- [ ] Created by college admin
- [ ] Login to faculty dashboard
- [ ] See assigned students from YOUR college only
- [ ] Review resumes
- [ ] Give feedback

### **As Student:**
- [ ] Created by admin (bulk upload or manual)
- [ ] Login to student app
- [ ] Create resume
- [ ] Submit for review
- [ ] See AI tools (if plan allows)
- [ ] Register for placement drives

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Different admins see same data | Clear cache, restart server, relogin |
| Subscription page not showing | Refresh page, check browser cache |
| Mobile not working | Check viewport settings, use Chrome DevTools |
| Analytics not loading | Ensure recharts is installed |
| Cannot find college | Make sure college ID is correct |

---

## 💡 Tips

1. **Generate Secure Passwords for Students**
   ```
   Example: College2024@Semester3
   (Easy to remember, strong)
   ```

2. **Bulk Upload Format**
   - Header row is required
   - Email must be unique
   - Department is optional
   - Year is optional

3. **Subscription Timing**
   - Trial: 30 days
   - Plans: 12 months
   - Can upgrade anytime
   - Refunds not available

4. **Faculty Assignment**
   - Faculty reviews students from same college
   - Can be assigned manually or auto-assigned
   - Multiple faculty per college allowed

---

**Everything is isolated by College ID. This ensures complete data security! 🔒**
