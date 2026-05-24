# 🚀 Quick Start Guide

## 1️⃣ **Install Missing Dependencies**

```bash
# In Server folder
cd Server
npm install razorpay

# In Client folder  
cd ../client
npm install recharts
```

## 2️⃣ **Create Super Admin**

```bash
cd Server
node seeds/createSuperAdmin.js
```

**Credentials:**
```
Email: superadmin@campuscv.com
Password: SuperAdmin@123
```

## 3️⃣ **Login as Different Users**

### Super Admin
- URL: `http://localhost:5173/login`
- Email: `superadmin@campuscv.com`
- Password: `SuperAdmin@123`
- After login: Goes to `/super-admin`

### College Admin (Create via Super Admin Panel)
1. Login as super admin
2. Go to /super-admin/colleges
3. Create college
4. Note the College ID
5. Register admin with that College ID:

```bash
Email: admin1@your-college.edu
Password: Admin@123
College ID: <from step 4>
```

### Student
- Register from login page with role="student"
- Email: `student@college.edu`
- Password: Any password

### Faculty  
- Created by College Admin
- Can access `/faculty` dashboard

## 4️⃣ **Test Data Isolation**

```
Login as Admin 1 → See College 1 data
Logout → Login as Admin 2 → See College 2 data (different!)
```

## 5️⃣ **Access Subscription Page**

1. Login as College Admin
2. Left sidebar → "Subscription"
3. See current plan
4. Can upgrade to other plans
5. Test with Razorpay test card:
   ```
   Card: 4111 1111 1111 1111
   Expiry: 12/25
   CVV: 123
   ```

## 6️⃣ **Key URLs**

| Role | URL | Features |
|------|-----|----------|
| Super Admin | `/super-admin` | View all colleges, subscriptions, analytics |
| College Admin | `/admin` | Students, bulk upload, subscription, settings |
| Faculty | `/faculty` | Review resumes, see assigned students |
| Student | `/app` | Resume builder, AI tools, placement drives |

## 7️⃣ **Bug Fixes Applied**

✅ **Fixed:** Admin accounts now get proper collegeId in JWT token
✅ **Fixed:** Data isolation - each admin only sees their college's data
✅ **Fixed:** Subscription page visibility - now visible in admin sidebar
✅ **Fixed:** Missing packages - razorpay and recharts installed

## 8️⃣ **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| "Cannot find razorpay" | `npm install razorpay` in Server folder |
| "Cannot find recharts" | `npm install recharts` in Client folder |
| Different admins see same data | Restart server after fix, relogin |
| Subscription page not visible | Clear browser cache, refresh |
| Cannot login as super admin | Use: superadmin@campuscv.com |

## ✅ Verification Checklist

- [ ] Super admin created successfully
- [ ] Can login as super admin
- [ ] Can create college as super admin  
- [ ] Can create admin with college ID
- [ ] Different admins see different data
- [ ] Subscription page is visible
- [ ] Can see available plans
- [ ] Razorpay payment modal opens

---

**🎉 Ready to go! Start your server and test the platform.**
