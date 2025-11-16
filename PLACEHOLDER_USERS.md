# Placeholder Users Reference

All 13 placeholder users are **fully registered** in the database with complete profiles.

## Login Credentials

**All users use the same password: `password123`**

---

## 💻 Technical Users (Engineers/Developers)

### 1. Alex Chen
- **Email**: alex.tech@mit.edu
- **University**: MIT
- **Country**: United States
- **Bio**: Full-stack developer passionate about AI and web3. Love building scalable systems.
- **Skills**: React, Node.js, Python, TensorFlow, PostgreSQL

### 2. Sarah Rodriguez
- **Email**: sarah.dev@stanford.edu
- **University**: Stanford University
- **Country**: United States
- **Bio**: Mobile developer and UX enthusiast. Building the future one app at a time.
- **Skills**: React Native, Swift, Kotlin, Firebase, Figma

### 3. James Park
- **Email**: james.code@cmu.edu
- **University**: Carnegie Mellon
- **Country**: United States
- **Bio**: CS major specializing in machine learning and computer vision.
- **Skills**: Python, PyTorch, OpenCV, C++, Docker

### 4. Emma Watson
- **Email**: emma.eng@berkeley.edu
- **University**: UC Berkeley
- **Country**: United States
- **Bio**: Backend engineer who loves databases and distributed systems.
- **Skills**: Go, Rust, PostgreSQL, Redis, Kubernetes

### 5. Michael Kim
- **Email**: mike.web@harvard.edu
- **University**: Harvard University
- **Country**: United States
- **Bio**: Frontend wizard with a passion for beautiful, accessible web experiences.
- **Skills**: Vue.js, TypeScript, CSS, Svelte, GraphQL

### 6. Lisa Zhang
- **Email**: lisa.data@oxford.edu
- **University**: Oxford University
- **Country**: United Kingdom
- **Bio**: Data scientist and ML engineer. Turning data into insights.
- **Skills**: Python, R, Pandas, scikit-learn, Tableau

---

## 💡 Non-Technical Users (Idea Makers/Founders)

### 7. David Martinez
- **Email**: david.idea@yale.edu
- **University**: Yale University
- **Country**: United States
- **Bio**: Economics major with a passion for fintech. Want to democratize investing.
- **Project**: A micro-investing app that rounds up purchases and invests the change in sustainable companies. Targeting Gen Z investors.
- **Offering**: 15% equity
- **Timeline**: 4 months to MVP

### 8. Sophia Johnson
- **Email**: sophia.founder@columbia.edu
- **University**: Columbia University
- **Country**: United States
- **Bio**: Business student passionate about sustainability and social impact.
- **Project**: Platform connecting college students with local eco-friendly businesses. Think "sustainable Yelp" with rewards for green choices.
- **Offering**: 20% equity + $1000
- **Timeline**: 3 months

### 9. Oliver Brown
- **Email**: oliver.vision@princeton.edu
- **University**: Princeton University
- **Country**: United States
- **Bio**: Marketing major with 50k Instagram followers. Ready to build something big.
- **Project**: Social media app for college course reviews with memes and short videos. Making Rate My Professor fun again.
- **Offering**: 25% equity
- **Timeline**: 6 weeks to beta

### 10. Mia Williams
- **Email**: mia.startup@duke.edu
- **University**: Duke University
- **Country**: United States
- **Bio**: Pre-med student who wants to revolutionize healthcare accessibility.
- **Project**: Telemedicine platform specifically for college students. Affordable, fast, and mobile-first.
- **Offering**: 18% equity
- **Timeline**: 5 months

### 11. Noah Davis
- **Email**: noah.builder@upenn.edu
- **University**: University of Pennsylvania
- **Country**: United States
- **Bio**: Design student and aspiring entrepreneur. Love creating beautiful products.
- **Project**: Marketplace for student freelancers. Connect talented students with small businesses for graphic design, writing, etc.
- **Offering**: Free project (portfolio builder)
- **Timeline**: 2 months

### 12. Ava Thompson
- **Email**: ava.creator@cambridge.edu
- **University**: Cambridge University
- **Country**: United Kingdom
- **Bio**: Psychology student researching mental health. Want to make therapy accessible.
- **Project**: Anonymous peer support app for college students struggling with mental health. Verified student-only community.
- **Offering**: 30% equity
- **Timeline**: 4 months to launch

### 13. Ethan Garcia
- **Email**: ethan.biz@nyu.edu
- **University**: New York University
- **Country**: United States
- **Bio**: Finance major with seed funding connections. Looking for technical co-founder.
- **Project**: AI-powered personal finance assistant for students. Helps with budgeting, finding discounts, and saving money.
- **Offering**: 20% equity + potential funding
- **Timeline**: 3-4 months

---

## 🎯 How to Use

1. **Start the server**: `npm start`
2. **Visit**: http://localhost:3000
3. **Sign in** with any email above + password: `password123`
4. **Start swiping** to see other placeholder users
5. **Create matches** by liking profiles (use multiple browsers/incognito for testing matches)
6. **Chat** with your matches in real-time

## 🔄 Reset Users

If you want to start fresh or re-populate:

```bash
rm coupling.db
npm start  # Creates empty database
node seed.js  # Re-adds all 13 placeholder users
```

---

**Note**: All users have real email addresses, passwords, profiles, bios, and complete data. They appear in the app exactly like real registered users would!
