# Library Management System - MongoDB CRUD Learning Project

A comprehensive, professional Library Management System built with React, Vite, and Tailwind CSS to teach MongoDB CRUD operations and query operators through a real-world use case.

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)

## 🎯 Project Overview

This project demonstrates **all aspects of MongoDB database operations** through an interactive Library Management System. Learn CRUD operations (Create, Read, Update, Delete) and master query operators through hands-on practice.

### Key Features

✅ **Complete CRUD Operations**
- Insert, Read, Update, and Delete books, members, and transactions
- Single and bulk operations
- Real-world workflows

✅ **MongoDB Query Operators Demo**
- Comparison operators: `$gt`, `$lt`, `$gte`, `$lte`, `$eq`, `$ne`
- Logical operators: `$and`, `$or`, `$not`, `$nor`
- Array operators: `$in`, `$nin`, `$all`
- Element operators: `$exists`, `$type`
- Complex queries with combinations

✅ **Professional Architecture**
- System design documentation
- Database schema design
- Relationship modeling
- Data validation

✅ **Modern Tech Stack**
- React 18 with Hooks
- Vite for fast development
- Tailwind CSS for styling
- Zustand for state management

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Collections](#database-collections)
- [CRUD Operations Guide](#crud-operations-guide)
- [Query Operators Reference](#query-operators-reference)
- [Features in Detail](#features-in-detail)
- [Learning Path](#learning-path)
- [Best Practices](#best-practices)

## 📁 Project Structure

```
libraryapp/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx           # Statistics and overview
│   │   ├── BooksManagement.jsx     # Book CRUD operations
│   │   ├── MembersManagement.jsx   # Member CRUD operations
│   │   ├── TransactionsManagement.jsx # Borrow/Return operations
│   │   └── QueryDemo.jsx           # Interactive query demo
│   ├── store/
│   │   └── mongoStore.js           # MongoDB operations (Zustand)
│   ├── App.jsx                     # Main application
│   ├── index.css                   # Tailwind styles
│   └── main.jsx                    # React entry point
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js v16+ ([Download](https://nodejs.org/))
- npm or yarn

### Installation

1. **Clone or extract the project**
   ```bash
   cd libraryapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm run preview
```

## 📚 Database Collections

### 1. Books Collection

```javascript
{
  _id: ObjectId,
  isbn: String (unique),
  title: String,
  author: String,
  publisher: String,
  publishedYear: Number,
  genre: [String],
  totalCopies: Number,
  availableCopies: Number,
  pages: Number,
  language: String,
  description: String,
  price: Number,
  rating: Number (0-5),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Sample Documents:**
- The C Programming Language - $65.00
- Learning JavaScript - $45.00
- Clean Code - $55.00
- Eloquent JavaScript - $50.00
- Design Patterns - $70.00

### 2. Members Collection

```javascript
{
  _id: ObjectId,
  memberId: String (unique),
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  dateOfBirth: Date,
  membershipType: String (Regular, Premium, Student),
  joinDate: Date,
  status: String (Active, Inactive, Suspended),
  borrowLimit: Number,
  fine: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. BorrowTransactions Collection

```javascript
{
  _id: ObjectId,
  transactionId: String (unique),
  memberId: ObjectId (ref: Members),
  bookId: ObjectId (ref: Books),
  borrowDate: Date,
  dueDate: Date,
  returnDate: Date (null if not returned),
  status: String (Borrowed, Returned, Overdue),
  fine: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 CRUD Operations Guide

### CREATE Operations

**Insert One Book**
```javascript
db.books.insertOne({
  isbn: "978-0-...",
  title: "Book Title",
  author: "Author Name",
  genre: ["Programming"],
  price: 49.99,
  totalCopies: 5,
  availableCopies: 5,
  rating: 4.5
})
```

**Insert Multiple Members**
```javascript
db.members.insertMany([
  {
    memberId: "M001",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    status: "Active"
  },
  {
    memberId: "M002",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    status: "Active"
  }
])
```

**In the Application:**
- Click "Add New Book" in Books Management
- Fill in the form and submit
- Book is added to the collection

### READ Operations

**Find All Books**
```javascript
db.books.find({})
```

**Find with Filter**
```javascript
db.books.find({ genre: "Programming" })
db.books.find({ price: { $gt: 50 } })
```

**Projection (Select specific fields)**
```javascript
db.books.find({}, { title: 1, author: 1, _id: 0 })
```

**Sort and Limit**
```javascript
db.books.find().sort({ rating: -1 }).limit(5)
db.books.find().skip(10).limit(10)  // Pagination
```

**In the Application:**
- View all books in the Books section
- Use search and filter options
- Try Query Demo for advanced queries

### UPDATE Operations

**Update One Document**
```javascript
db.books.updateOne(
  { isbn: "978-0-..." },
  { $set: { availableCopies: 2, updatedAt: new Date() } }
)
```

**Update Multiple Documents**
```javascript
db.members.updateMany(
  { status: "Inactive" },
  { $set: { isActive: false } }
)
```

**Increment Operator**
```javascript
db.members.updateOne(
  { _id: ObjectId("...") },
  { $inc: { fine: 50 } }
)
```

**In the Application:**
- Click edit button on any book or member
- Modify fields and save
- Or use the Transaction system to record returns with fines

### DELETE Operations

**Delete One Document**
```javascript
db.books.deleteOne({ isbn: "978-0-..." })
```

**Delete Multiple Documents**
```javascript
db.members.deleteMany({ status: "Inactive" })
```

**Delete All (Use with caution!)**
```javascript
db.books.deleteMany({})
```

**In the Application:**
- Click delete button on any card/row
- Confirm the action in the dialog

## 🔍 Query Operators Reference

### Comparison Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equal to | `{ price: { $eq: 50 } }` |
| `$ne` | Not equal | `{ status: { $ne: "Active" } }` |
| `$gt` | Greater than | `{ price: { $gt: 50 } }` |
| `$gte` | Greater or equal | `{ rating: { $gte: 4.0 } }` |
| `$lt` | Less than | `{ price: { $lt: 30 } }` |
| `$lte` | Less or equal | `{ pages: { $lte: 300 } }` |

### Logical Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$and` | All conditions | `{ $and: [{ price: { $gt: 50 } }, { rating: { $gte: 4.5 } }] }` |
| `$or` | Any condition | `{ $or: [{ status: "Active" }, { status: "Premium" }] }` |
| `$not` | Negation | `{ price: { $not: { $gt: 100 } } }` |
| `$nor` | Neither condition | `{ $nor: [{ status: "Inactive" }, { fine: { $gt: 0 } }] }` |

### Array Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$in` | Value in array | `{ genre: { $in: ["Programming", "Tech"] } }` |
| `$nin` | Value not in array | `{ status: { $nin: ["Suspended"] } }` |
| `$all` | All elements match | `{ genre: { $all: ["Programming"] } }` |
| `$elemMatch` | Element matches | `{ genre: { $elemMatch: { $eq: "JavaScript" } } }` |

### Element Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$exists` | Field exists | `{ description: { $exists: true } }` |
| `$type` | Field type | `{ rating: { $type: "number" } }` |

### Complex Query Examples

**Books that are expensive AND highly rated:**
```javascript
db.books.find({
  $and: [
    { price: { $gt: 50 } },
    { rating: { $gte: 4.5 } }
  ]
})
```

**Active members from specific cities with fine:**
```javascript
db.members.find({
  $and: [
    { status: "Active" },
    { "address.city": { $in: ["New York", "LA"] } },
    { fine: { $gt: 0 } }
  ]
})
```

**Books published before 2010 OR after 2015:**
```javascript
db.books.find({
  $or: [
    { publishedYear: { $lt: 2010 } },
    { publishedYear: { $gt: 2015 } }
  ]
})
```

## 🎨 Features in Detail

### Dashboard
- Quick statistics overview
- Real-time metrics
- Database reset functionality
- System information

### Books Management
- Browse all books with pagination
- Add new books with detailed information
- Edit existing book records
- Delete books with confirmation
- Search by title or author
- Filter by genre
- View availability status

### Members Management
- View all library members
- Create new member accounts
- Update member information
- Delete members
- Track membership types (Regular, Premium, Student)
- Monitor member fines
- Manage member status (Active, Inactive, Suspended)

### Transactions Management
- Record book borrowing with due dates
- Process book returns
- Automatic fine calculation for overdue books
- Track transaction history
- Filter by status (Borrowed, Returned, Overdue)
- View complete transaction details

### Query Demo
- 17+ pre-built queries to explore
- Interactive query execution
- Real-time result display
- MongoDB command reference
- Operator quick reference guide
- Results pagination

## 📖 Learning Path

### Week 1: Fundamentals
1. **Day 1-2:** Database & Collection Setup
   - Understand collections
   - Document structure
   - Indexes and keys

2. **Day 3-4:** Insert Operations
   - InsertOne examples
   - InsertMany examples
   - Validation

3. **Day 5-7:** Read Operations
   - Find all documents
   - Basic filters
   - Projections
   - Sorting

### Week 2: Operators & Filtering
1. **Day 1-2:** Comparison Operators
   - `$gt`, `$lt`, `$gte`, `$lte`
   - Price and rating queries

2. **Day 3-4:** Logical Operators
   - `$and` for multiple conditions
   - `$or` for alternative conditions

3. **Day 5-7:** Advanced Operators
   - `$in`, `$nin` for arrays
   - `$exists` for field existence
   - Complex queries

### Week 3: Updates & Real-World
1. **Day 1-2:** Update Operations
   - UpdateOne examples
   - UpdateMany operations
   - Increment operations

2. **Day 3-4:** Delete Operations
   - DeleteOne examples
   - DeleteMany operations

3. **Day 5-7:** Real-World Application
   - Library system workflows
   - Complete CRUD cycle
   - Business logic implementation

## ✅ Best Practices

### Database Design
- ✅ Use meaningful field names
- ✅ Normalize when appropriate
- ✅ Create indexes for frequently queried fields
- ✅ Use data validation

### Query Optimization
- ✅ Use projection to limit fields returned
- ✅ Index frequently filtered fields
- ✅ Use `$and` for better performance than `$or`
- ✅ Limit results with skip() and limit()

### Code Quality
- ✅ Use meaningful variable names
- ✅ Add error handling
- ✅ Validate user input
- ✅ Use transactions for critical operations

### Security
- ✅ Never store passwords in plain text
- ✅ Validate all user input
- ✅ Use proper authentication
- ✅ Limit database access permissions

## 📊 Project Statistics

- **Collections:** 3 (Books, Members, Transactions)
- **Sample Data:** 8 books + 3 members + 3 transactions
- **Query Examples:** 17+ interactive demos
- **Components:** 5 main sections
- **Operations Covered:** All CRUD operations + advanced queries

## 🔗 Related Resources

- [MongoDB Official Documentation](https://docs.mongodb.com/)
- [MongoDB Query Operators](https://docs.mongodb.com/manual/reference/operator/query/)
- [MongoDB CRUD Operations](https://docs.mongodb.com/manual/crud/)
- [Mongoose Documentation](https://mongoosejs.com/) (For Node.js)

## 💡 Tips & Tricks

### Quick Testing
1. Start with the Query Demo section
2. Try different operators
3. Observe the results
4. Modify queries to experiment

### Real-World Application
1. Try to model your own database
2. Write queries for common searches
3. Practice complex queries
4. Implement validation

### Performance Considerations
1. Use projection to limit data
2. Create indexes on common fields
3. Use appropriate operators
4. Test with larger datasets

## 🤝 Contributing

This is an educational project. Feel free to:
- Add more query examples
- Expand the database schema
- Create additional features
- Improve documentation

## 📝 License

This project is provided for educational purposes.

## 🎓 Learning Objectives

By completing this project, you will:

✅ Understand MongoDB document model  
✅ Master CRUD operations  
✅ Use query operators effectively  
✅ Design efficient database schemas  
✅ Build real-world applications  
✅ Implement business logic with databases  
✅ Optimize database queries  
✅ Handle relationships between collections  

## 🚀 Next Steps

After completing this project:

1. **Set up a real MongoDB instance**
   - Local MongoDB or MongoDB Atlas
   - Connect using Mongoose or native driver

2. **Build a backend API**
   - Node.js + Express.js
   - Connect to MongoDB
   - Implement authentication

3. **Deploy the application**
   - Host frontend on Vercel/Netlify
   - Host backend on Heroku/Railway
   - Set up CI/CD pipeline

## 📞 Support

For questions or issues:
1. Check the MongoDB documentation
2. Review the query examples
3. Try different approaches
4. Test with sample data

---

**Happy Learning! 🎉**

Master MongoDB through hands-on practice with this comprehensive Library Management System.
