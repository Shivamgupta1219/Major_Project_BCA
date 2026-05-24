# 🧪 Testing & Validation Guide - Bug Fixes

**Quick Reference for Testing All Fixes**

---

## ✅ Fix #1: Server Startup

### **Test:**
```bash
npm run dev
# Or
npm start
```

### **Expected Output:**
```
Database connected
Server is running on port 3000
```

### **Verify:**
- [ ] No "SyntaxError: await is only valid in async"
- [ ] No "ReferenceError" on startup
- [ ] Server listens on port 3000
- [ ] Can access http://localhost:3000

---

## ✅ Fix #2: Password Validation (8 chars minimum)

### **Test #1: Change Password as Admin**
```
1. Login as college admin
2. Go to Settings → Change Password
3. Try password with 6 characters
4. Should see error: "Password must be at least 8 characters"
5. Try password with 8+ characters
6. Should succeed
```

### **Test #2: Register as Student**
```
1. Go to /register
2. Create account with password = "short" (5 chars)
3. Should fail (backend validates >= 8)
4. Try again with "Password123" (11 chars)
5. Should succeed
```

### **Test #3: API Direct Test**
```bash
# Test password validation via API
curl -X PUT http://localhost:3000/api/users/change-password \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "CurrentPass123",
    "newPassword": "Short1"
  }'

# Expected: 400 error "Password must be at least 8 characters"
```

---

## ✅ Fix #3: Admin Security (No Self-Registration as Admin)

### **Test: Cannot Register as Admin**
```bash
# Try to register as admin
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hacker",
    "email": "hacker@test.com",
    "password": "Password123",
    "role": "admin"
  }'

# Expected: Account created as "student", NOT "admin"
# Verify in response: "role": "student"
```

### **Test: Existing Admins Still Work**
```
1. Login with existing admin account
2. Should still work
3. Can access /admin dashboard
4. No functionality broken
```

---

## ✅ Fix #4: Admin Setup Flow (Complete End-to-End)

### **Step 1: Super Admin Creates College**
```
1. Login as super admin (superadmin@campuscv.com)
2. Go to /super-admin/colleges
3. Click "New College"
4. Fill:
   - Name: "Test College"
   - Email: "admin@testcollege.edu"
   - Phone: "9999999999"
   - Plan: "Basic"
5. Click "Create"
```

### **Step 2: Verify Setup URL Modal**
```
Expected: Modal shows
✅ "College Created Successfully!"
✅ Setup URL: http://localhost:5173/admin-setup?id=COLLEGE_ID
✅ Copy button works
✅ Clear instructions
```

### **Step 3: Open Setup URL in New Tab**
```
1. Copy setup URL from modal
2. Open in new browser tab/incognito
3. Should load /admin-setup page
4. Shows college name: "Test College"
```

### **Step 4: Admin Fills Setup Form**
```
1. Fill Name: "College Admin"
2. Fill Email: "admin@testcollege.edu"
3. Fill Password: "TestAdminPass123" (8+ chars)
4. Confirm Password: "TestAdminPass123"
5. Click "Complete Setup & Login"
```

### **Step 5: Verify Auto-Login**
```
Expected:
✅ Admin auto-logged in
✅ Redirected to /admin dashboard
✅ Can see college name
✅ Can see student list (empty initially)
✅ Token in localStorage
```

### **Test Error Cases:**
```
Test 1: Invalid college ID
- URL: /admin-setup?id=invalid123
- Expected: "College ID not found"

Test 2: Duplicate admin
- Create second admin for same college
- Expected: "College already has an admin account"

Test 3: Existing email
- Use email from another account
- Expected: "Email already registered"

Test 4: Password too short
- Password: "Short1" (6 chars)
- Expected: "Password must be at least 8 characters"

Test 5: Passwords don't match
- Password: "TestAdminPass123"
- Confirm: "DifferentPass456"
- Expected: "Passwords do not match"
```

### **API Test:**
```bash
curl -X POST http://localhost:3000/api/super-admin/admin-setup \
  -H "Content-Type: application/json" \
  -d '{
    "collegeId": "COLLEGE_ID",
    "name": "College Admin",
    "email": "admin@college.edu",
    "password": "AdminPass123"
  }'

# Expected: 201 Created with token and user data
```

---

## ✅ Fix #5: Faculty Dashboard Data Isolation

### **Test: Faculty Dashboard Loads**
```
1. Login as faculty
2. Go to /faculty/dashboard
3. Should see:
   ✅ Assigned students count
   ✅ Pending reviews count
   ✅ Approved resumes count
   ✅ Average score (should display number, not error)
   ✅ No error in console
```

### **Test: Faculty Can View Student Progress**
```
1. As faculty, go to /faculty/students
2. Should see assigned students
3. Click on a student
4. Should see reviews and latest resume
5. All data properly loaded (not null/undefined)
```

### **Test: Data Isolation**
```
Scenario: Two colleges with faculty
1. Login as faculty in College A
2. Try to access student from College B via URL: /faculty/student/STUDENT_ID_B
3. Expected: 403 "Not authorized to view this student"
```

### **Test: Faculty Query Validation**
```bash
# Check browser console for errors
1. Faculty dashboard should have NO console errors
2. Network tab should show successful API calls
3. Responses should contain valid data

# Check for specific errors:
❌ "Resume has no collegeId field"
❌ "Cannot read property 'collegeId' of undefined"
✅ All queries return valid data
```

---

## 🔍 Validation Checklist

### **Server**
- [ ] Server starts without errors
- [ ] Database connects
- [ ] All routes accessible
- [ ] No console errors

### **Authentication & Security**
- [ ] Admins cannot be created via /register
- [ ] Admin setup validates college ID
- [ ] No duplicate admins for same college
- [ ] Email uniqueness enforced
- [ ] Password >= 8 characters enforced

### **Admin Setup**
- [ ] Setup URL generated
- [ ] Admin can complete setup
- [ ] Auto-login works
- [ ] Token saved in localStorage
- [ ] Can access /admin dashboard
- [ ] Can logout and login with email+password

### **Password Management**
- [ ] Password change requires 8+ chars
- [ ] Current password validation works
- [ ] Confirmation password matches
- [ ] New password works on next login
- [ ] Toast notifications display

### **Faculty Dashboard**
- [ ] Dashboard loads without errors
- [ ] Average score calculates correctly
- [ ] Pending reviews count shows
- [ ] Approved resumes count shows
- [ ] No "collegeId undefined" errors
- [ ] Data properly isolated by college
- [ ] Can view student progress
- [ ] Cannot access other college's students

### **Data Integrity**
- [ ] Existing users still login
- [ ] Existing data unchanged
- [ ] No data migration needed
- [ ] Rollback not needed

---

## 🐛 If Tests Fail

### **Issue: "await only valid in async"**
- [ ] Check `server/server.js` lines 22-27
- [ ] Verify wrapped in async IIFE
- [ ] Restart server

### **Issue: Password accepted with 6 chars**
- [ ] Check `userController.js` line 168
- [ ] Should be `if (newPassword.length < 8)`
- [ ] Restart server

### **Issue: Can register as admin**
- [ ] Check `userController.js` line 30
- [ ] Should be `const safeRole = "student"`
- [ ] Restart server

### **Issue: Admin setup endpoint 404**
- [ ] Check `superAdminRoutes.js` for POST /admin-setup
- [ ] Check `superAdminController.js` has `adminSetup` export
- [ ] Restart server
- [ ] Clear browser cache

### **Issue: Faculty dashboard shows errors**
- [ ] Check `facultyController.js` avgScore query
- [ ] Should use `userId: { $in: studentIds }`
- [ ] Should NOT use `collegeId`
- [ ] Restart server
- [ ] Clear browser cache

---

## ✨ Quick Test Commands

```bash
# Terminal 1: Start Backend
cd server
npm run dev

# Terminal 2: Start Frontend (in new terminal)
cd client
npm run dev

# Terminal 3: Test API (in new terminal)
# Test server startup
curl http://localhost:3000

# Test password validation
curl -X PUT http://localhost:3000/api/users/change-password \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword": "test", "newPassword": "short"}'

# Test admin setup
curl -X POST http://localhost:3000/api/super-admin/admin-setup \
  -H "Content-Type: application/json" \
  -d '{"collegeId": "...", "name": "Admin", "email": "a@b.com", "password": "Pass123"}'
```

---

## 📝 Notes

- All fixes are **backward compatible**
- No database migrations needed
- Existing data is **not affected**
- All endpoints still work
- Tests should take **< 30 minutes** total

---

**Status:** All fixes complete and ready for testing! ✅
