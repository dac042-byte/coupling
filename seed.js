const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('./coupling.db');

const placeholderUsers = [
  // Technical users
  {
    email: 'alex.tech@mit.edu',
    password: 'password123',
    name: 'Alex Chen',
    university: 'MIT',
    country: 'United States',
    user_type: 'technical',
    bio: 'Full-stack developer passionate about AI and web3. Love building scalable systems.',
    skills: 'React, Node.js, Python, TensorFlow, PostgreSQL',
    project_idea: '',
    equity_offered: '',
    timeline: ''
  },
  {
    email: 'sarah.dev@stanford.edu',
    password: 'password123',
    name: 'Sarah Rodriguez',
    university: 'Stanford University',
    country: 'United States',
    user_type: 'technical',
    bio: 'Mobile developer and UX enthusiast. Building the future one app at a time.',
    skills: 'React Native, Swift, Kotlin, Firebase, Figma',
    project_idea: '',
    equity_offered: '',
    timeline: ''
  },
  {
    email: 'james.code@cmu.edu',
    password: 'password123',
    name: 'James Park',
    university: 'Carnegie Mellon',
    country: 'United States',
    user_type: 'technical',
    bio: 'CS major specializing in machine learning and computer vision.',
    skills: 'Python, PyTorch, OpenCV, C++, Docker',
    project_idea: '',
    equity_offered: '',
    timeline: ''
  },
  {
    email: 'emma.eng@berkeley.edu',
    password: 'password123',
    name: 'Emma Watson',
    university: 'UC Berkeley',
    country: 'United States',
    user_type: 'technical',
    bio: 'Backend engineer who loves databases and distributed systems.',
    skills: 'Go, Rust, PostgreSQL, Redis, Kubernetes',
    project_idea: '',
    equity_offered: '',
    timeline: ''
  },
  {
    email: 'mike.web@harvard.edu',
    password: 'password123',
    name: 'Michael Kim',
    university: 'Harvard University',
    country: 'United States',
    user_type: 'technical',
    bio: 'Frontend wizard with a passion for beautiful, accessible web experiences.',
    skills: 'Vue.js, TypeScript, CSS, Svelte, GraphQL',
    project_idea: '',
    equity_offered: '',
    timeline: ''
  },
  {
    email: 'lisa.data@oxford.edu',
    password: 'password123',
    name: 'Lisa Zhang',
    university: 'Oxford University',
    country: 'United Kingdom',
    user_type: 'technical',
    bio: 'Data scientist and ML engineer. Turning data into insights.',
    skills: 'Python, R, Pandas, scikit-learn, Tableau',
    project_idea: '',
    equity_offered: '',
    timeline: ''
  },

  // Non-technical users
  {
    email: 'david.idea@yale.edu',
    password: 'password123',
    name: 'David Martinez',
    university: 'Yale University',
    country: 'United States',
    user_type: 'non-technical',
    bio: 'Economics major with a passion for fintech. Want to democratize investing.',
    skills: '',
    project_idea: 'A micro-investing app that rounds up purchases and invests the change in sustainable companies. Targeting Gen Z investors.',
    equity_offered: '15% equity',
    timeline: '4 months to MVP'
  },
  {
    email: 'sophia.founder@columbia.edu',
    password: 'password123',
    name: 'Sophia Johnson',
    university: 'Columbia University',
    country: 'United States',
    user_type: 'non-technical',
    bio: 'Business student passionate about sustainability and social impact.',
    skills: '',
    project_idea: 'Platform connecting college students with local eco-friendly businesses. Think "sustainable Yelp" with rewards for green choices.',
    equity_offered: '20% equity + $1000',
    timeline: '3 months'
  },
  {
    email: 'oliver.vision@princeton.edu',
    password: 'password123',
    name: 'Oliver Brown',
    university: 'Princeton University',
    country: 'United States',
    user_type: 'non-technical',
    bio: 'Marketing major with 50k Instagram followers. Ready to build something big.',
    skills: '',
    project_idea: 'Social media app for college course reviews with memes and short videos. Making Rate My Professor fun again.',
    equity_offered: '25% equity',
    timeline: '6 weeks to beta'
  },
  {
    email: 'mia.startup@duke.edu',
    password: 'password123',
    name: 'Mia Williams',
    university: 'Duke University',
    country: 'United States',
    user_type: 'non-technical',
    bio: 'Pre-med student who wants to revolutionize healthcare accessibility.',
    skills: '',
    project_idea: 'Telemedicine platform specifically for college students. Affordable, fast, and mobile-first.',
    equity_offered: '18% equity',
    timeline: '5 months'
  },
  {
    email: 'noah.builder@upenn.edu',
    password: 'password123',
    name: 'Noah Davis',
    university: 'University of Pennsylvania',
    country: 'United States',
    user_type: 'non-technical',
    bio: 'Design student and aspiring entrepreneur. Love creating beautiful products.',
    skills: '',
    project_idea: 'Marketplace for student freelancers. Connect talented students with small businesses for graphic design, writing, etc.',
    equity_offered: 'Free project (portfolio builder)',
    timeline: '2 months'
  },
  {
    email: 'ava.creator@cambridge.edu',
    password: 'password123',
    name: 'Ava Thompson',
    university: 'Cambridge University',
    country: 'United Kingdom',
    user_type: 'non-technical',
    bio: 'Psychology student researching mental health. Want to make therapy accessible.',
    skills: '',
    project_idea: 'Anonymous peer support app for college students struggling with mental health. Verified student-only community.',
    equity_offered: '30% equity',
    timeline: '4 months to launch'
  },
  {
    email: 'ethan.biz@nyu.edu',
    password: 'password123',
    name: 'Ethan Garcia',
    university: 'New York University',
    country: 'United States',
    user_type: 'non-technical',
    bio: 'Finance major with seed funding connections. Looking for technical co-founder.',
    skills: '',
    project_idea: 'AI-powered personal finance assistant for students. Helps with budgeting, finding discounts, and saving money.',
    equity_offered: '20% equity + potential funding',
    timeline: '3-4 months'
  }
];

async function seedDatabase() {
  console.log('Starting database seeding...');

  for (const user of placeholderUsers) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO users (email, password, name, university, country, user_type, bio, skills, project_idea, equity_offered, timeline, avatar_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            user.email,
            hashedPassword,
            user.name,
            user.university,
            user.country,
            user.user_type,
            user.bio,
            user.skills,
            user.project_idea,
            user.equity_offered,
            user.timeline,
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
          ],
          function(err) {
            if (err) {
              console.log(`Skipping ${user.email} (may already exist)`);
              resolve();
            } else {
              console.log(`✓ Created user: ${user.name}`);
              resolve();
            }
          }
        );
      });
    } catch (error) {
      console.error(`Error creating user ${user.name}:`, error);
    }
  }

  console.log('\n✓ Database seeding completed!');
  console.log('\nYou can now sign in with any of these accounts:');
  console.log('Email: alex.tech@mit.edu');
  console.log('Password: password123');
  console.log('\n(All placeholder accounts use password: password123)');

  db.close();
}

seedDatabase();
