# Coupling

A Tinder-style matching platform connecting ambitious students with technical talent to turn ideas into reality.

## Overview

Coupling bridges the gap between non-technical idea makers and skilled engineers, making it easy for students to find collaborators for their projects. Think Tinder meets Fiverr for student projects!

## Features

### Core Functionality
- **Swipe-based Matching**: Tinder-style interface for discovering potential collaborators
- **Real-time Chat**: WebSocket-powered messaging system for matched users
- **User Profiles**: Detailed profiles showing skills, project ideas, equity offered, and timelines
- **Theme Switching**: Toggle between dark/purplish and light/pinkish color schemes
- **University Verification**: Users register with their university and country

### User Types

**Technical Users (Engineers/Developers)**
- Showcase their skills and tech stack
- Browse project ideas from non-technical founders
- Filter by equity offered, project type, and timeline

**Non-Technical Users (Idea Makers/Founders)**
- Present their project ideas clearly
- Specify equity/compensation offered
- Set realistic timelines
- Find technical co-founders

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: SQLite
- **Authentication**: JWT with httpOnly cookies
- **Real-time**: WebSocket (ws library)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Security**: bcrypt password hashing

## Getting Started

### Installation

```bash
npm install
```

### Running the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### Development Mode

```bash
npm run dev
```

Uses nodemon for auto-restart on file changes.

## Database Setup

The database is automatically initialized when you start the server. To populate it with placeholder users:

```bash
node seed.js
```

This creates 13 placeholder accounts (6 technical, 7 non-technical) that you can use for testing.

### Test Accounts

All placeholder accounts use the password: `password123`

**Technical Users:**
- alex.tech@mit.edu - Alex Chen (Full-stack developer)
- sarah.dev@stanford.edu - Sarah Rodriguez (Mobile developer)
- james.code@cmu.edu - James Park (ML specialist)
- emma.eng@berkeley.edu - Emma Watson (Backend engineer)
- mike.web@harvard.edu - Michael Kim (Frontend wizard)
- lisa.data@oxford.edu - Lisa Zhang (Data scientist)

**Non-Technical Users:**
- david.idea@yale.edu - David Martinez (Fintech micro-investing app)
- sophia.founder@columbia.edu - Sophia Johnson (Sustainable marketplace)
- oliver.vision@princeton.edu - Oliver Brown (Course review social app)
- mia.startup@duke.edu - Mia Williams (Telemedicine platform)
- noah.builder@upenn.edu - Noah Davis (Student freelancer marketplace)
- ava.creator@cambridge.edu - Ava Thompson (Mental health support app)
- ethan.biz@nyu.edu - Ethan Garcia (AI finance assistant)

## Project Structure

```
coupling/
├── server.js           # Express server and API routes
├── seed.js            # Database seeding script
├── coupling.db        # SQLite database (auto-generated)
├── package.json       # Dependencies
├── public/            # Frontend files
│   ├── index.html     # Landing page
│   ├── signup.html    # Sign up page
│   ├── signin.html    # Sign in page
│   ├── app.html       # Main application
│   ├── css/
│   │   └── styles.css # All styles with theme support
│   └── js/
│       ├── theme.js   # Theme switcher
│       ├── signup.js  # Sign up logic
│       ├── signin.js  # Sign in logic
│       └── app.js     # Main app logic (swipe, match, chat)
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/signup` - Create new account
- `POST /api/signin` - Sign in
- `POST /api/signout` - Sign out
- `GET /api/user` - Get current user info

### Matching
- `GET /api/potential-matches` - Get users to swipe on
- `POST /api/swipe` - Record swipe (like/pass)
- `GET /api/matches` - Get all matches

### Messaging
- `GET /api/messages/:matchId` - Get messages for a match
- `POST /api/messages` - Send a message

## Features in Detail

### Swipe System
- Users are shown potential matches one at a time
- Swipe right (♥) to like, left (✕) to pass
- When two users like each other, it's a match!
- Match modal celebrates successful matches

### Real-time Chat
- WebSocket connection for instant messaging
- Messages appear immediately for both users
- Shows timestamp for each message
- Avatar and name displayed for context

### Theme System
- Dark theme: Purple/violet color scheme (default)
- Light theme: Pink/rose color scheme
- Theme preference saved in localStorage
- Smooth transitions between themes

### Profile System
- Different fields for technical vs non-technical users
- Technical: Skills, bio
- Non-technical: Project idea, equity offered, timeline
- Avatar generated from name using UI Avatars API

## Future Enhancements

### Business Model Features (Planned)
- Limited swipes per week (freemium model)
- Premium membership ($2/month)
- "See who likes you" feature
- Rating system for engineers
- Advertisement integration

### Privacy & Legal
- Privacy policy implementation
- Terms of service
- GDPR compliance
- Email verification
- Age verification for high school students

### Additional Features
- Push notifications
- Mobile app (React Native)
- Advanced filtering
- Project categories
- Success stories showcase
- Video introductions
- Portfolio integration

## Security Considerations

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens stored in httpOnly cookies
- SQL injection prevention via parameterized queries
- XSS protection through proper escaping
- CORS configuration for production

## License

ISC

## Notes

- This is currently a development version
- Change `JWT_SECRET` in production
- Consider upgrading to PostgreSQL for production
- Add email verification before launch
- Implement rate limiting for API endpoints
- Add proper error logging and monitoring

---

Built with ❤️ for ambitious student entrepreneurs
