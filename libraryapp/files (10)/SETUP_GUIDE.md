# MongoDB Library Management System - Setup & Installation Guide

Complete step-by-step guide to set up and run the professional MongoDB learning project.

## 📋 Prerequisites Checklist

Before you begin, make sure you have:

- ✅ **Node.js v16 or higher** ([Download](https://nodejs.org/))
  - Verify: `node --version`
- ✅ **npm or Yarn** (comes with Node.js)
  - Verify: `npm --version`
- ✅ **Code Editor** (VS Code recommended - [Download](https://code.visualstudio.com/))
- ✅ **Git** (Optional, for version control - [Download](https://git-scm.com/))
- ✅ **Basic JavaScript knowledge**

## 🚀 Quick Start (5 Minutes)

### Step 1: Navigate to Project Directory
```bash
cd libraryapp
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages:
- React 18
- Vite
- Tailwind CSS
- React Icons
- Zustand (State Management)
- PostCSS & Autoprefixer

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Open in Browser
The app will automatically open at `http://localhost:3000`

If it doesn't:
1. Open your browser
2. Navigate to `http://localhost:3000`
3. You should see the Library Management System dashboard

## 📦 Detailed Installation Steps

### 1. Install Node.js

**On Windows:**
1. Download Node.js installer from https://nodejs.org/
2. Run the installer
3. Follow the installation wizard
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

**On macOS:**
```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org/
```

**On Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install nodejs npm
```

### 2. Set Up Project Directory

```bash
# Navigate to your projects folder
cd ~/Projects
# (or wherever you want to keep the project)

# The libraryapp directory should already exist
cd libraryapp

# Verify you're in the correct directory
pwd  # On macOS/Linux
cd   # On Windows (shows current directory)
```

### 3. Install Project Dependencies

```bash
# Install npm packages
npm install

# This will create a node_modules folder
# Installation may take 1-2 minutes
```

**Expected output:**
```
added 500+ packages, and audited 600+ packages in 1m
```

### 4. Verify Installation

```bash
# Check if all dependencies are installed
npm list --depth=0
```

You should see packages like:
- react
- vite
- tailwindcss
- zustand
- react-icons

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

This command:
- Starts a local development server
- Enables hot module reloading (changes update automatically)
- Opens the app in your browser
- Shows helpful error messages in console

**Terminal output:**
```
  VITE v5.0.0  ready in 234 ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

### Production Build
```bash
npm run build
```

This creates an optimized build for deployment:
- Minifies JavaScript and CSS
- Optimizes assets
- Creates `dist/` folder with production files

### Preview Production Build
```bash
npm run preview
```

Serves the production build locally for testing before deployment.

## 📁 Project File Structure

```
libraryapp/
├── src/
│   ├── components/           # React components
│   │   ├── Dashboard.jsx          # Main dashboard
│   │   ├── BooksManagement.jsx    # Book CRUD
│   │   ├── MembersManagement.jsx  # Member CRUD
│   │   ├── TransactionsManagement.jsx # Transactions
│   │   └── QueryDemo.jsx          # Query examples
│   ├── store/
│   │   └── mongoStore.js     # MongoDB operations (Zustand)
│   ├── App.jsx               # Main app component
│   ├── App.css               # App styles
│   ├── index.css             # Global styles
│   └── main.jsx              # React entry point
├── index.html                # HTML template
├── package.json              # Dependencies & scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS config
├── postcss.config.js         # PostCSS config
├── .gitignore                # Git ignore file
├── README.md                 # Project documentation
└── SETUP_GUIDE.md           # This file
```

## 🔧 Troubleshooting

### Issue: "npm command not found"

**Solution:**
```bash
# Reinstall Node.js from https://nodejs.org/
# Make sure to select "Add to PATH" during installation
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# On macOS/Linux
lsof -i :3000
kill -9 <PID>

# Or specify a different port
npm run dev -- --port 3001
```

### Issue: Module not found errors

**Solution:**
```bash
# Remove node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### Issue: Tailwind CSS styles not applying

**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart development server: `npm run dev`
3. If issue persists, rebuild:
   ```bash
   npm run build
   npm run preview
   ```

### Issue: High memory usage

**Solution:**
```bash
# Increase Node.js heap memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run dev

# Or on Windows (PowerShell)
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

## 📖 Understanding the Architecture

### Component Hierarchy
```
App
├── Dashboard
├── BooksManagement
├── MembersManagement
├── TransactionsManagement
└── QueryDemo
```

### State Management (Zustand)
- Single store: `mongoStore.js`
- Collections: books, members, borrowTransactions
- Operations: CRUD functions for each collection

### Styling
- **Tailwind CSS**: Utility-first styling
- **Custom CSS**: Global and component-specific styles
- **Responsive**: Mobile-first design approach

## 🎓 How to Use the Application

### 1. Dashboard
- View system statistics
- See quick metrics
- Reset database to initial state

### 2. Books Management
- **View**: See all books in the collection
- **Search**: Find books by title or author
- **Filter**: Filter by genre
- **Add**: Click "Add New Book" to insert a new book
- **Edit**: Click edit icon to update book details
- **Delete**: Click delete icon to remove a book

### 3. Members Management
- **View**: Browse all library members
- **Add**: Register new members
- **Edit**: Update member information
- **Delete**: Remove member records
- **Track**: Monitor fines and status

### 4. Transactions
- **Record Borrow**: Click "Record Borrow" to log book borrowing
- **Record Return**: Return books and calculate fines
- **Filter**: View transactions by status
- **Track**: Monitor overdue books

### 5. Query Demo
- **Select Query**: Click on any pre-built query
- **View Command**: See the MongoDB command syntax
- **Execute**: Query runs and shows results
- **Learn**: Understand different operators

## 🔗 Database Operations Examples

### In the Code (mongoStore.js)

```javascript
// CREATE
addBook(bookData)

// READ
getAllBooks()
findBooks(filter)

// UPDATE
updateBook(bookId, updates)
updateMultipleBooks(filter, updates)

// DELETE
deleteBook(bookId)
deleteMultipleBooks(filter)
```

### Query Examples

```javascript
// Find expensive books
findBooks({ price: { $gt: 50 } })

// Find active members with fines
findBooks({ 
  $and: [
    { status: 'Active' }, 
    { fine: { $gt: 0 } }
  ]
})

// Find by genre
findBooks({ genre: { $in: ['Programming'] } })
```

## 💡 Development Tips

### Hot Module Reloading (HMR)
When you save a file:
- The browser automatically refreshes
- No need to manually reload
- Your app state persists

### Developer Tools
```bash
# Open browser DevTools
# Right-click → Inspect or Press F12

# View network requests
# Network tab → See API calls

# Check console for errors
# Console tab → Shows JavaScript errors
```

### Testing Queries
1. Go to Query Demo tab
2. Click different query buttons
3. Observe results
4. Try to understand the MongoDB syntax
5. Modify queries to experiment

## 🚀 Deployment Preparation

### Before Deploying

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Test production build:**
   ```bash
   npm run preview
   ```

3. **Check for errors:**
   - Open browser console (F12)
   - Look for any red error messages

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

## 📚 Learning Resources

### MongoDB Concepts
- [MongoDB CRUD Operations](https://docs.mongodb.com/manual/crud/)
- [Query Operators](https://docs.mongodb.com/manual/reference/operator/query/)
- [Schema Validation](https://docs.mongodb.com/manual/core/schema-validation/)

### React & JavaScript
- [React Documentation](https://react.dev/)
- [JavaScript MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/)
- [Tailwind CSS](https://tailwindcss.com/)

### Tools & Libraries
- [Vite Documentation](https://vitejs.dev/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Icons](https://react-icons.github.io/react-icons/)

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Development server starts without errors
- [ ] App opens in browser at localhost:3000
- [ ] All navigation tabs are clickable
- [ ] Books section displays sample data
- [ ] Can add a new book (form opens and submits)
- [ ] Can edit a book (changes save)
- [ ] Can delete a book
- [ ] Members section works similarly
- [ ] Transactions section allows borrowing and returning
- [ ] Query Demo shows results
- [ ] Dashboard displays statistics
- [ ] No console errors (F12 → Console)

## 🎯 Common Tasks

### Add Sample Data
Sample data is loaded automatically. If needed:
```javascript
// In mongoStore.js, modify INITIAL_BOOKS, INITIAL_MEMBERS, etc.
```

### Modify Styling
1. Edit `src/index.css` for global styles
2. Edit `tailwind.config.js` for colors/theme
3. Changes apply automatically (HMR)

### Add New Components
1. Create file in `src/components/`
2. Import in `App.jsx`
3. Add route/tab for new component

### Debug Issues
```javascript
// In components or mongoStore.js
console.log(data)  // Log data to console
debugger;          // Pause execution (F12)
```

## 🔐 Important Notes

- ✅ This project simulates MongoDB in JavaScript
- ✅ Real production apps would connect to MongoDB server
- ✅ Data resets on page refresh (stored in state, not database)
- ✅ This is for learning purposes only

## 📞 Getting Help

1. **Check the README.md** for detailed documentation
2. **Review Query Examples** in the Query Demo section
3. **Check browser console** (F12) for error messages
4. **Verify Node.js version** is 16+
5. **Try reinstalling** dependencies if issues persist

## 🎉 You're Ready!

Your MongoDB learning environment is now set up. Start exploring:

1. **Dashboard** - See the statistics
2. **Books** - Practice CRUD operations
3. **Members** - Learn about data relationships
4. **Transactions** - Understand real-world workflows
5. **Query Demo** - Master MongoDB operators

**Happy Learning! 📚**

---

**Last Updated:** 2024
**Project Version:** 1.0.0
**MongoDB Learning Project**
