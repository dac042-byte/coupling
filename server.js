const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'coupling-secret-key-change-in-production';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./coupling.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      university TEXT NOT NULL,
      country TEXT NOT NULL,
      user_type TEXT NOT NULL,
      bio TEXT,
      skills TEXT,
      project_idea TEXT,
      equity_offered TEXT,
      timeline TEXT,
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Swipes table (for matching)
    db.run(`CREATE TABLE IF NOT EXISTS swipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      target_user_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (target_user_id) REFERENCES users(id),
      UNIQUE(user_id, target_user_id)
    )`);

    // Matches table
    db.run(`CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user1_id INTEGER NOT NULL,
      user2_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user1_id) REFERENCES users(id),
      FOREIGN KEY (user2_id) REFERENCES users(id),
      UNIQUE(user1_id, user2_id)
    )`);

    // Messages table
    db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      match_id INTEGER NOT NULL,
      sender_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (match_id) REFERENCES matches(id),
      FOREIGN KEY (sender_id) REFERENCES users(id)
    )`);

    console.log('Database tables initialized');
  });
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
}

// API Routes

// Sign up
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, name, university, country, userType, bio, skills, projectIdea, equityOffered, timeline } = req.body;

    // Validate required fields
    if (!email || !password || !name || !university || !country || !userType) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    db.run(
      `INSERT INTO users (email, password, name, university, country, user_type, bio, skills, project_idea, equity_offered, timeline, avatar_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, name, university, country, userType, bio || '', skills || '', projectIdea || '', equityOffered || '', timeline || '', `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Error creating user' });
        }

        // Create JWT token
        const token = jwt.sign({ userId: this.lastID, email }, JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({ success: true, userId: this.lastID });
      }
    );
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Sign in
app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }

      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Create JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.json({ success: true, userId: user.id });
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Sign out
app.post('/api/signout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

// Get current user
app.get('/api/user', authenticateToken, (req, res) => {
  db.get('SELECT id, email, name, university, country, user_type, bio, skills, project_idea, equity_offered, timeline, avatar_url FROM users WHERE id = ?',
    [req.user.userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    }
  );
});

// Get potential matches (users to swipe on)
app.get('/api/potential-matches', authenticateToken, (req, res) => {
  const userId = req.user.userId;

  // Get users that the current user hasn't swiped on yet
  db.all(
    `SELECT id, name, university, country, user_type, bio, skills, project_idea, equity_offered, timeline, avatar_url
     FROM users
     WHERE id != ?
     AND id NOT IN (SELECT target_user_id FROM swipes WHERE user_id = ?)
     ORDER BY RANDOM()
     LIMIT 20`,
    [userId, userId],
    (err, users) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json(users);
    }
  );
});

// Swipe on a user
app.post('/api/swipe', authenticateToken, (req, res) => {
  const { targetUserId, action } = req.body;
  const userId = req.user.userId;

  if (!targetUserId || !action) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Record the swipe
  db.run(
    'INSERT INTO swipes (user_id, target_user_id, action) VALUES (?, ?, ?)',
    [userId, targetUserId, action],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error recording swipe' });
      }

      // If it's a "like", check if there's a match
      if (action === 'like') {
        db.get(
          'SELECT * FROM swipes WHERE user_id = ? AND target_user_id = ? AND action = ?',
          [targetUserId, userId, 'like'],
          (err, reciprocalSwipe) => {
            if (err) {
              return res.status(500).json({ error: 'Server error' });
            }

            if (reciprocalSwipe) {
              // It's a match! Create a match record
              const user1Id = Math.min(userId, targetUserId);
              const user2Id = Math.max(userId, targetUserId);

              db.run(
                'INSERT OR IGNORE INTO matches (user1_id, user2_id) VALUES (?, ?)',
                [user1Id, user2Id],
                function(err) {
                  if (err) {
                    return res.status(500).json({ error: 'Error creating match' });
                  }
                  res.json({ success: true, match: true, matchId: this.lastID });
                }
              );
            } else {
              res.json({ success: true, match: false });
            }
          }
        );
      } else {
        res.json({ success: true, match: false });
      }
    }
  );
});

// Get matches
app.get('/api/matches', authenticateToken, (req, res) => {
  const userId = req.user.userId;

  db.all(
    `SELECT m.id as match_id, u.id, u.name, u.university, u.country, u.user_type, u.bio, u.avatar_url,
     (SELECT message FROM messages WHERE match_id = m.id ORDER BY created_at DESC LIMIT 1) as last_message,
     (SELECT created_at FROM messages WHERE match_id = m.id ORDER BY created_at DESC LIMIT 1) as last_message_time
     FROM matches m
     JOIN users u ON (u.id = m.user1_id OR u.id = m.user2_id)
     WHERE (m.user1_id = ? OR m.user2_id = ?) AND u.id != ?
     ORDER BY last_message_time DESC`,
    [userId, userId, userId],
    (err, matches) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json(matches);
    }
  );
});

// Get messages for a match
app.get('/api/messages/:matchId', authenticateToken, (req, res) => {
  const { matchId } = req.params;
  const userId = req.user.userId;

  // Verify user is part of this match
  db.get(
    'SELECT * FROM matches WHERE id = ? AND (user1_id = ? OR user2_id = ?)',
    [matchId, userId, userId],
    (err, match) => {
      if (err || !match) {
        return res.status(403).json({ error: 'Access denied' });
      }

      db.all(
        `SELECT m.*, u.name, u.avatar_url
         FROM messages m
         JOIN users u ON m.sender_id = u.id
         WHERE m.match_id = ?
         ORDER BY m.created_at ASC`,
        [matchId],
        (err, messages) => {
          if (err) {
            return res.status(500).json({ error: 'Server error' });
          }
          res.json(messages);
        }
      );
    }
  );
});

// Send a message
app.post('/api/messages', authenticateToken, (req, res) => {
  const { matchId, message } = req.body;
  const userId = req.user.userId;

  if (!matchId || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Verify user is part of this match
  db.get(
    'SELECT * FROM matches WHERE id = ? AND (user1_id = ? OR user2_id = ?)',
    [matchId, userId, userId],
    (err, match) => {
      if (err || !match) {
        return res.status(403).json({ error: 'Access denied' });
      }

      db.run(
        'INSERT INTO messages (match_id, sender_id, message) VALUES (?, ?, ?)',
        [matchId, userId, message],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Error sending message' });
          }

          // Get the created message with user info
          db.get(
            `SELECT m.*, u.name, u.avatar_url
             FROM messages m
             JOIN users u ON m.sender_id = u.id
             WHERE m.id = ?`,
            [this.lastID],
            (err, newMessage) => {
              if (err) {
                return res.status(500).json({ error: 'Server error' });
              }

              // Broadcast message via WebSocket
              broadcastMessage(matchId, newMessage);

              res.json({ success: true, message: newMessage });
            }
          );
        }
      );
    }
  );
});

// WebSocket connections for real-time chat
const wsConnections = new Map();

wss.on('connection', (ws, req) => {
  console.log('WebSocket client connected');

  ws.on('message', (data) => {
    try {
      const parsed = JSON.parse(data);

      if (parsed.type === 'auth') {
        // Authenticate WebSocket connection
        try {
          const verified = jwt.verify(parsed.token, JWT_SECRET);
          ws.userId = verified.userId;
          wsConnections.set(ws.userId, ws);
          console.log(`User ${ws.userId} authenticated via WebSocket`);
        } catch (err) {
          ws.send(JSON.stringify({ type: 'error', message: 'Authentication failed' }));
        }
      }
    } catch (err) {
      console.error('WebSocket message error:', err);
    }
  });

  ws.on('close', () => {
    if (ws.userId) {
      wsConnections.delete(ws.userId);
      console.log(`User ${ws.userId} disconnected from WebSocket`);
    }
  });
});

function broadcastMessage(matchId, message) {
  // Get both users in the match
  db.get(
    'SELECT user1_id, user2_id FROM matches WHERE id = ?',
    [matchId],
    (err, match) => {
      if (err || !match) return;

      const recipients = [match.user1_id, match.user2_id];
      recipients.forEach(userId => {
        const ws = wsConnections.get(userId);
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'new_message',
            matchId,
            message
          }));
        }
      });
    }
  );
}

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signin.html'));
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

// Start server
server.listen(PORT, () => {
  console.log(`Coupling server running on http://localhost:${PORT}`);
});
