# AI Resume Builder

A full-stack web application for creating, managing, and optimizing resumes with AI assistance. Built with React, Node.js, Express, and MongoDB.

## Features

- 📝 **Resume Creation & Management** - Create and edit resumes easily
- 🤖 **AI-Powered Assistance** - Get AI suggestions for resume content
- 💼 **Job Matching** - Match resumes with job listings
- 🔐 **User Authentication** - Secure login with JWT
- 💳 **Subscription Management** - Premium features with Razorpay integration
- 📊 **Admin Dashboard** - Manage users and content
- 🎓 **College Admin** - Special features for college administrators

## Tech Stack

### Frontend
- React 18+
- Vite (build tool)
- Redux Toolkit (state management)
- Axios (HTTP client)
- Tailwind CSS (styling)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)
- ImageKit (image optimization)

### External APIs
- Google Gemini API (AI)
- Groq API (LLM)
- JSearch API (job listings)
- Razorpay (payments)

## Project Structure

```
.
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── configs/api.js
│   │   └── ...
│   ├── .env               # Local environment variables
│   └── .env.production    # Production environment variables
│
├── Server/                # Express backend
│   ├── routes/           # API routes
│   ├── controllers/       # Business logic
│   ├── models/           # MongoDB schemas
│   ├── configs/
│   │   └── db.js         # Database connection
│   ├── middlewares/
│   ├── server.js         # Main server file
│   └── .env              # Backend environment variables
│
└── README.md             # This file
```

## Quick Start

### Prerequisites
- Node.js 14+
- MongoDB Atlas account
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd "Ai Resume Builder [Minor proeject ]"
   ```

2. **Setup Backend**
   ```bash
   cd Server
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   npm run dev
   ```
   Backend runs on `http://localhost:3000`

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## Environment Variables

### Backend (Server/.env)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gemini-2.5-flash
Gorq_API_KEY=your_groq_key
GOOGLE_GEMINI_API_KEY=your_gemini_key
JSEARCH_API_KEY=your_jsearch_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_key
PORT=3000
```

### Frontend (client/.env)
```
VITE_API_URL=http://localhost:3000
```

### Production (Vercel)
Set all the above variables in Vercel dashboard → Settings → Environment Variables

## Deployment

### Deploy Backend to Vercel
1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard
4. Vercel auto-deploys on push

### Deploy Frontend to Vercel
1. Update `client/.env.production` with production backend URL
2. Push changes
3. Vercel auto-deploys

## API Documentation

### User Routes
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/data` - Get user profile (protected)
- `PUT /api/users/update` - Update user profile (protected)

### Resume Routes
- `POST /api/resume/create-resume` - Create new resume (protected)
- `GET /api/resume/:id` - Get resume details
- `PUT /api/resume/:id` - Update resume (protected)
- `DELETE /api/resume/:id` - Delete resume (protected)

### Admin Routes
- `GET /api/admin/users` - Get all users (protected)
- `POST /api/admin/setup` - Setup college admin (protected)

## Troubleshooting

### Database Connection Error
- Check `MONGO_URI` in Vercel environment variables
- Verify MongoDB Atlas IP whitelist includes Vercel IPs
- Check database credentials

### API 405 Error
- Ensure latest code is deployed to Vercel
- Check request method matches route definition
- Verify environment variables are set

### CORS Errors
- Backend has CORS enabled - should work automatically
- Check frontend API URL is correct

### Login Not Working
- Verify `JWT_SECRET` is set in backend
- Check if user exists in database
- Ensure token is stored in localStorage

## Security Notes

⚠️ **Important**
- Never commit `.env` files with credentials
- Rotate API keys if exposed in git history
- Use strong JWT secrets
- Enable MongoDB IP whitelist in Atlas
- Use HTTPS in production

## Contributing

1. Create a feature branch
2. Make your changes
3. Test locally
4. Push and create a pull request

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review CLAUDE.md for development notes
3. Check Vercel logs for deployment issues

## License

Private Project
