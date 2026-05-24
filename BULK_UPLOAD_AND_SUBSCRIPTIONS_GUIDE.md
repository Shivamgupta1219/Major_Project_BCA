# 📚 Bulk Upload & Subscriptions Guide

## 🎯 Part 1: Super Admin Subscriptions Page

### **What the Subscriptions Page Shows:**
- All colleges and their subscription status
- Plan type (Basic/Standard/Premium)
- Subscription status (Active/Trial/Expired)
- Expiry date
- Summary cards with counts

### **If It's Not Loading:**

**It Now Has Multiple Fallbacks:**
1. ✅ Try dedicated `/api/super-admin/subscriptions` endpoint
2. ✅ Fall back to `/api/super-admin/colleges` endpoint
3. ✅ Fall back to `/api/super-admin/dashboard` endpoint

**The page will show data from whichever endpoint works first!**

### **What You'll See:**

**Active Subscriptions:**
- Colleges with active paid plans
- Status: "Active"

**Trial Subscriptions:**
- Newly created colleges (first 30 days)
- Status: "Trial"

**Expired Subscriptions:**
- Colleges whose plan ended
- Status: "Expired"

---

## 🎯 Part 2: Bulk Student Upload - Complete Workflow

### **Step 1: Login as College Admin**
- URL: `http://localhost:5173/admin`
- You should see dashboard with students, courses, etc.

### **Step 2: Go to Bulk Upload**
- In sidebar, click: **"Bulk Upload"** or go to `/admin/bulk-upload`

### **Step 3: Prepare CSV File**

**Create a file named `students.csv` with columns:**
```csv
name,email,rollNo,department,year
John Doe,john@college.edu,CS-001,Computer Science,2024
Jane Smith,jane@college.edu,CS-002,Computer Science,2024
Mike Johnson,mike@college.edu,EC-001,Electronics,2024
```

**Required columns:** `name`, `email`
**Optional columns:** `rollNo`, `department`, `year`

**Tips:**
- Use actual college domain email if possible
- Roll number should be unique per student
- Department helps organize students

### **Step 4: Upload CSV**
1. Click: **"Click to upload CSV"** area
2. Select your `students.csv` file
3. Should show: **"3 rows ready"**
4. Click: **"Create 3 accounts"** button

### **Step 5: Wait for Creation**
- Shows **"Creating..."** with spinner
- Takes a few seconds depending on number of students

### **Step 6: Get Student Passwords**

After upload completes, you'll see:

```
✅ 3 created
⚠️ 0 skipped

📋 Student Login Credentials
Share these credentials with students so they can login at 
http://localhost:5173/login

Email: (from CSV)
Password: (Default Password below)

Created Accounts - Copy and Share:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email                    | Password        | Action
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
john@college.edu         | CS-001          | Copy
jane@college.edu         | CS-002          | Copy
mike@college.edu         | EC-001          | Copy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📥 Download as CSV
```

**Default Password is:**
- ✅ Roll number (if provided in CSV)
- ✅ Email prefix (if no roll number)
  - Example: `john@college.edu` → password: `john`

### **Step 7: Share with Students**

**Option A: Copy Individual Credentials**
1. For each student, click **"Copy"** button
2. Paste in email/message/WhatsApp
3. Send to student

**Option B: Download as CSV**
1. Click: **"📥 Download as CSV"**
2. Gets file: `student-credentials.csv`
3. Contains all emails and passwords
4. Can email/share with students in bulk

**Option C: Manual Share**
```
Share this with each student:

Login URL: http://localhost:5173/login

Email: john@college.edu
Password: CS-001

(from the table shown in bulk upload result)
```

---

## 🔐 **How Students Login**

### **First Time Login:**
1. Go to: `http://localhost:5173/login`
2. Enter: Email (from CSV, e.g., `john@college.edu`)
3. Enter: Password (default password from table)
4. Click: **"Login"**
5. Redirected to: `/app` dashboard

### **After First Login (Optional):**
Students can change their password in settings:
- Click: Profile/Settings
- Change password option available

---

## 📊 **What Happens After Upload**

### **Students Created:**
- Account created automatically
- Email: From CSV
- Password: Default (from rollNo or email)
- Role: Student
- College: Automatically linked to YOUR college
- Status: Active, can login immediately

### **Skipped Students:**
If some rows are skipped, reasons include:
- ❌ Missing name or email
- ❌ Email already exists (try different email)
- ❌ Invalid email format

**To fix skipped students:**
1. Review the "Skipped rows" section
2. Correct the CSV
3. Re-upload only the corrected students

### **Data Isolation:**
- Students only see THIS college's data
- Can't see other colleges' students/drives
- Can only access this college's placement drives
- Can only review resumes from same college

---

## 📱 **Student Dashboard After Login**

After students login, they can:

**URL:** `http://localhost:5173/app`

- ✅ Build/edit resume
- ✅ View available placement drives
- ✅ Register for placement drives
- ✅ Use AI tools (if plan allows)
- ✅ View profile and settings
- ✅ Submit resume for faculty review

---

## 📋 **Complete Example Workflow**

### **Scenario: Add 3 Students to College**

**1. Admin Prepares CSV:**
```csv
name,email,rollNo,department,year
Shivam Gupta,shivam@example.edu,BCA-001,BCA,2024
Priya Singh,priya@example.edu,BCA-002,BCA,2024
Rajesh Kumar,rajesh@example.edu,CSE-001,CSE,2024
```

**2. Upload:**
- Go to `/admin/bulk-upload`
- Upload CSV
- System creates 3 accounts

**3. Get Passwords:**
- See result table:
  - shivam@example.edu → BCA-001
  - priya@example.edu → BCA-002
  - rajesh@example.edu → CSE-001

**4. Share with Students:**
- Option A: Copy each individually
- Option B: Download CSV and email all at once

**5. Students Login:**
```
Each student goes to: http://localhost:5173/login
Email: shivam@example.edu
Password: BCA-001
```

**6. Done!**
- Students now in the system
- Only see this college's data
- Can create resumes, register for drives, etc.

---

## ✅ **Bulk Upload Checklist**

### **Preparation:**
- [ ] CSV file ready with name, email, rollNo
- [ ] Emails are correct and unique
- [ ] Logged in as College Admin
- [ ] At `/admin/bulk-upload` page

### **Upload:**
- [ ] Select CSV file
- [ ] See "X rows ready" message
- [ ] Click "Create X accounts"
- [ ] Wait for completion

### **Results:**
- [ ] See "X created" message
- [ ] View the credentials table
- [ ] Copy or download passwords

### **Share:**
- [ ] Share credentials with students (via email/message/download)
- [ ] Include login URL: `http://localhost:5173/login`
- [ ] Include their email and default password

### **Student Login:**
- [ ] Students login with their email and password
- [ ] Redirected to `/app` dashboard
- [ ] Can start creating resume

---

## 🔧 **Troubleshooting**

### **Issue: "Empty CSV" Error**
**Solution:** CSV file is empty or has no data rows. Prepare CSV with headers and data.

### **Issue: "Missing name or email" Skipped**
**Solution:** Some rows missing name or email column. Fix in CSV and re-upload.

### **Issue: "Email already exists" Skipped**
**Solution:** That email already has an account. Use different email or check typo.

### **Issue: Can't see the password after upload**
**Solution:** 
- Scroll down, it's below the success message
- Or click "Download as CSV" to get all passwords

### **Issue: Student can't login**
**Solution:**
1. Check email is correct (exact match)
2. Check password is correct (usually roll number or email prefix)
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try logging out and in again

### **Issue: Too many students to upload at once**
**Solution:**
- Upload in batches (100 at a time is fine)
- Or upload all at once (system handles it)
- Each batch creates separate accounts

---

## 📊 **Subscriptions Page Features**

### **Shows:**
```
College Name | Plan | Status | Amount | Valid Till
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
College A    | Basic | Active | —     | 15 Dec 2025
College B    | Trial | Active | —     | 20 Jul 2025
College C    | Standard | Expired | — | 10 May 2025
```

### **Summary Cards:**
- **Active Subscriptions:** Count of colleges with active plans
- **Expired Subscriptions:** Count of colleges whose plan ended
- **Trial Subscriptions:** Count of colleges in trial period

### **What to Do:**
- Monitor expiring subscriptions
- Renew before expiry
- Upgrade plans as needed
- See which colleges are trial vs paid

---

## 🎯 **Key Points to Remember**

1. **Subscriptions Page:**
   - Shows all colleges and their subscription status
   - Now has fallbacks - will load one way or another
   - Updated dynamically

2. **Bulk Upload:**
   - Creates student accounts automatically
   - Generates temporary password (roll number or email prefix)
   - Must share password with students
   - Shows password in result table or CSV download
   - Students can change password after first login

3. **Data Security:**
   - Students only see their college's data
   - Each college is completely isolated
   - Passwords should be shared securely (not public)
   - Default passwords should be changed after first login (optional)

4. **Email Sharing:**
   - Can share credentials via email
   - Can use CSV download for bulk sharing
   - Include login URL in email

---

## 📞 **Next Steps**

1. **Test Subscriptions:**
   - Go to `/super-admin/subscriptions`
   - Should see all colleges listed

2. **Test Bulk Upload:**
   - Create CSV with 2-3 test students
   - Upload to `/admin/bulk-upload`
   - Get passwords from result table
   - Test student login

3. **Verify Data Isolation:**
   - Create multiple colleges
   - Bulk upload students to each
   - Login as student from College A
   - Confirm they only see College A data

---

**Your platform is ready to manage students at scale! 🚀**
