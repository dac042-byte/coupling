# Coupling - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

Server will run on **http://localhost:3000**

### 3. Open in Browser
Visit `http://localhost:3000` and either:
- Create a new account (Sign Up)
- Use a test account (Sign In)

## 🧪 Test Accounts

All test accounts use password: **password123**

### Technical Users (Engineers)
- **alex.tech@mit.edu** - Full-stack developer (React, Node.js, Python, TensorFlow)
- **sarah.dev@stanford.edu** - Mobile developer (React Native, Swift, Kotlin)
- **james.code@cmu.edu** - ML specialist (Python, PyTorch, OpenCV)

### Non-Technical Users (Founders)
- **david.idea@yale.edu** - Fintech micro-investing app (15% equity)
- **sophia.founder@columbia.edu** - Sustainable marketplace (20% equity + $1000)
- **oliver.vision@princeton.edu** - Course review social app (25% equity)

## 🎨 Features to Try

1. **Theme Switching**: Click the theme toggle in top-right to switch between dark/purple and light/pink themes

2. **Swipe Interface**:
   - Click ❤️ to like a profile
   - Click ✕ to pass
   - When two users like each other, you get a match!

3. **Chat System**:
   - Go to Matches tab to see your matches
   - Click on a match to open chat
   - Messages are real-time via WebSocket

4. **Profile**: View your own profile in the Profile tab

## 📁 Project Structure

- `server.js` - Backend API and server
- `public/` - All frontend files
  - `index.html` - Landing page
  - `signup.html` - Sign up page
  - `signin.html` - Sign in page
  - `app.html` - Main application
  - `css/styles.css` - All styles
  - `js/` - JavaScript files

## 🔄 Reset Database

If you want to start fresh:

```bash
rm coupling.db
npm start  # Will recreate empty database
node seed.js  # Re-populate with test accounts
```

## 🎯 Development Tips

- Use `npm run dev` for auto-restart on file changes (requires nodemon)
- Check browser console for any errors
- WebSocket connection will auto-reconnect if disconnected
- Theme preference is saved in localStorage

## 🐛 Troubleshooting

**Server won't start:**
- Make sure port 3000 is available
- Check that all dependencies are installed

**Can't sign in:**
- Make sure you've run `node seed.js` to create test accounts
- Check password is exactly "password123"

**Chat not working:**
- Ensure WebSocket connection is established (check browser console)
- Try refreshing the page

**Theme not switching:**
- Clear browser cache and localStorage
- Hard refresh with Ctrl+Shift+R (or Cmd+Shift+R on Mac)

## 📱 Next Steps

1. Create your own account
2. Complete your profile with bio and skills/project idea
3. Start swiping to find matches
4. Chat with your matches
5. Build something amazing together!

---

**Note**: This is a development version. For production deployment, make sure to:
- Change the JWT_SECRET in server.js
- Use a production database (PostgreSQL)
- Add HTTPS
- Implement email verification
- Add rate limiting
- Set up proper logging and monitoring
