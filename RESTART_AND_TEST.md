# 🔄 Quick Restart & Test Guide

## 1️⃣ **Restart Backend Server**

```bash
cd "D:\Ai Resume Builder [Minor proeject ]\Server"
npm start
```

**Expected Output:**
```
✓ MongoDB connected successfully
✓ Server is running on port 3000
```

---

## 2️⃣ **Restart Frontend Client**

```bash
cd "D:\Ai Resume Builder [Minor proeject ]\client"
npm run dev
```

**Expected Output:**
```
Local:     http://localhost:5173
```

---

## 3️⃣ **Login & Test Super Admin**

### **URL:** `http://localhost:5173`

### **Credentials:**
```
Email: superadmin@campuscv.com
Password: SuperAdmin@123
```

### **Verify These Pages Load:**

1. **Dashboard** (`/super-admin`)
   - [ ] Shows stats cards
   - [ ] Displays charts
   - [ ] Recent activity visible

2. **Colleges** (`/super-admin/colleges`)
   - [ ] List of colleges
   - [ ] Create college button
   - [ ] Edit/Delete options

3. **Subscriptions** (`/super-admin/subscriptions`) **[NEW]**
   - [ ] Table of all subscriptions
   - [ ] Status indicators
   - [ ] Summary cards below

4. **Analytics** (`/super-admin/analytics`) **[NEW]**
   - [ ] Key metrics cards
   - [ ] Line charts
   - [ ] Bar charts
   - [ ] Plan distribution

5. **Settings** (`/super-admin/settings`) **[NEW]**
   - [ ] Form fields load
   - [ ] Save button works
   - [ ] No errors in console

---

## 4️⃣ **Test Mobile Navigation**

### **Steps:**
1. Press **F12** (Open DevTools)
2. Press **Ctrl+Shift+M** (Toggle device toolbar)
3. Select **iPhone 12** from device list

### **Verify:**
- [ ] Hamburger menu (☰) appears in top right
- [ ] Click hamburger → menu opens
- [ ] Can click "Subscriptions" link
- [ ] Can click "Analytics" link
- [ ] Can click "Settings" link
- [ ] Menu closes after selection
- [ ] All pages load on mobile

---

## 5️⃣ **Test College Workflow**

### **Step A: Create College (Super Admin)**
```
1. Go to /super-admin/colleges
2. Click "Add College" or "Create College"
3. Fill:
   Name: "Test College"
   Short Name: "TC"
   Email: test@college.edu
   Phone: 9876543210
4. Click Create
5. COPY the College ID shown
```

### **Step B: Register College Admin**
```
1. Go to http://localhost:5173/login
2. Click "Create Account"
3. Fill:
   Name: Test Admin
   Email: testadmin@college.edu
   Password: TestAdmin@123
   Role: Admin (from dropdown)
   College ID: PASTE the ID from Step A
4. Click Register
5. Auto-login → Should go to /admin
```

### **Step C: Verify Data Isolation**
```
Option 1 - Create Another College:
1. Go back to super admin
2. Create another college (e.g., "Another College")
3. Copy that College ID
4. Register another admin with that ID
5. Login as first admin → See only their students
6. Logout → Login as second admin → See DIFFERENT data
   ✓ Data isolation is working!

Option 2 - Bulk Upload Students:
1. Login as college admin (testadmin@college.edu)
2. Go to /admin/bulk-upload
3. Create CSV file:
   name,email,rollNo,department,year
   John Doe,john@college.edu,001,CS,2024
   Jane Smith,jane@college.edu,002,CS,2024
4. Upload and create
5. Go to /admin/students
6. Verify 2 students are listed
```

---

## 6️⃣ **Test Subscription Page Access**

### **As College Admin:**
```
1. Login: testadmin@college.edu / TestAdmin@123
2. Click "Subscription" in left sidebar
3. Should see:
   - Current Plan (Trial/Basic/Standard/Premium)
   - Student limit
   - Expiry date
   - Available plans to upgrade
   - Payment history
```

---

## 7️⃣ **Clear Cache If Issues**

If pages don't load:

```bash
# Clear browser cache
Ctrl + Shift + Delete

# Select:
- Time range: All time
- Cookies and other site data ✓
- Cached images and files ✓

Click "Clear data"
```

Then refresh: **Ctrl + R**

---

## 8️⃣ **Check Browser Console for Errors**

```bash
1. Press F12 (DevTools)
2. Click "Console" tab
3. Look for any RED error messages
4. If errors exist:
   - Note the error message
   - Check if component file exists
   - Verify imports in App.jsx
```

---

## 🎯 **Quick Test Checklist**

### **Backend:**
- [ ] Server starts without errors
- [ ] No "Cannot find module" errors
- [ ] Port 3000 is available

### **Frontend:**
- [ ] Client starts without errors
- [ ] Loads at http://localhost:5173
- [ ] No import errors in console

### **Super Admin:**
- [ ] Login works
- [ ] Dashboard loads
- [ ] All 5 sidebar items accessible
- [ ] **Subscriptions page works** [NEW]
- [ ] **Analytics page works** [NEW]
- [ ] **Settings page works** [NEW]

### **Mobile:**
- [ ] DevTools responsive mode works
- [ ] Hamburger menu appears
- [ ] Menu opens/closes
- [ ] Pages accessible on mobile

### **College Workflow:**
- [ ] Can create college
- [ ] College ID is generated
- [ ] Admin can register with ID
- [ ] Admin sees dashboard
- [ ] Different admins see different data

---

## 🚨 **Common Issues & Fixes**

| Issue | Fix |
|-------|-----|
| "Cannot find module 'razorpay'" | Run: `cd Server && npm install razorpay` |
| "Cannot find module 'recharts'" | Run: `cd client && npm install recharts` |
| "Subscriptions page shows 404" | Clear cache (Ctrl+Shift+Delete), refresh |
| "Mobile menu doesn't appear" | Check device toolbar is enabled (Ctrl+Shift+M) |
| "Analytics charts not showing" | Ensure recharts is installed, restart client |
| "Different admins see same data" | Restart server, clear browser cache, relogin |
| "Subscription page blank" | Check browser console for errors (F12) |

---

## ✅ **Ready to Go!**

Once all checks pass:

```
✓ Backend running on :3000
✓ Frontend running on :5173
✓ Super Admin fully functional
✓ All pages accessible
✓ Mobile responsive
✓ Data isolation working
✓ Workflow clear and documented
```

**Your platform is ready for testing! 🚀**
