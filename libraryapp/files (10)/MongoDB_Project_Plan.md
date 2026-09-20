# MongoDB CRUD Operations - Comprehensive Project Plan

## Executive Summary
This project is designed to provide a complete understanding of MongoDB fundamentals through a professional Library Management System. The project combines backend database operations with a modern React + Vite + Tailwind frontend application.

---

## 📋 Project Overview

**Project Name:** Library Management System (LMS)  
**Technology Stack:** MongoDB, Node.js, Express.js, React, Vite, Tailwind CSS  
**Duration:** Learning Project  
**Objectives:** Master CRUD operations, Query operators, Data modeling, and Real-world application development

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Frontend)                       │
│           React + Vite + Tailwind CSS Application               │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│ │  Dashboard   │  │  Book Mgmt   │  │  Member Mgmt │           │
│ │   Module     │  │   Module     │  │   Module     │           │
│ └──────────────┘  └──────────────┘  └──────────────┘           │
├─────────────────────────────────────────────────────────────────┤
│                    API LAYER (Backend)                           │
│              Node.js + Express.js REST API                      │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│ │ Books Routes │  │ Members      │  │ Borrow/Return│           │
│ │ & Controllers│  │ Routes       │  │ Operations   │           │
│ └──────────────┘  └──────────────┘  └──────────────┘           │
├─────────────────────────────────────────────────────────────────┤
│                  DATABASE LAYER (MongoDB)                        │
│                    Document-Based NoSQL                          │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│ │ Books        │  │ Members      │  │ Transactions │           │
│ │ Collection   │  │ Collection   │  │ Collection   │           │
│ └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Design

### Database: `libraryDB`

#### **Collection 1: Books**
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

#### **Collection 2: Members**
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

#### **Collection 3: BorrowTransactions**
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

---

## 📊 Database Relationships

```
Members (1) ──────────────── (Many) BorrowTransactions
                                         │
                                         │
                                         └──────────── (Many) Books

Books table can be referenced multiple times in BorrowTransactions
```

---

## 🎯 Project Tasks & Milestones

### Phase 1: MongoDB Fundamentals (Week 1)

**Task 1.1: Database & Collection Setup**
- ✅ Create database: `libraryDB`
- ✅ Create collections: `books`, `members`, `borrowTransactions`
- ✅ Define indexes for frequently queried fields
- **Commands:**
  ```javascript
  // Create database
  use libraryDB
  
  // Create collections
  db.createCollection("books")
  db.createCollection("members")
  db.createCollection("borrowTransactions")
  
  // Create indexes
  db.books.createIndex({ isbn: 1 }, { unique: true })
  db.members.createIndex({ memberId: 1 }, { unique: true })
  db.members.createIndex({ email: 1 }, { unique: true })
  db.borrowTransactions.createIndex({ transactionId: 1 }, { unique: true })
  ```

**Task 1.2: Insert Operations**
- ✅ Insert single book document
- ✅ Insert multiple members (5-10 documents)
- ✅ Insert transaction records
- **Commands:**
  ```javascript
  // Insert one
  db.books.insertOne({
    isbn: "978-0-13-110362-7",
    title: "The C Programming Language",
    author: "Brian W. Kernighan",
    genre: ["Programming", "Technology"],
    totalCopies: 5,
    availableCopies: 3,
    price: 65.00,
    rating: 4.8
  })
  
  // Insert many
  db.members.insertMany([
    { memberId: "M001", firstName: "John", ... },
    { memberId: "M002", firstName: "Jane", ... }
  ])
  ```

**Task 1.3: Read Operations**
- ✅ Find all documents
- ✅ Find with filters
- ✅ Projection (select specific fields)
- ✅ Sorting and pagination
- **Commands:**
  ```javascript
  // Find all
  db.books.find()
  
  // Find with filter
  db.books.find({ genre: "Programming" })
  
  // Projection
  db.books.find({}, { title: 1, author: 1, _id: 0 })
  
  // Sort & limit
  db.books.find().sort({ rating: -1 }).limit(5)
  
  // Pagination
  db.books.find().skip(0).limit(10)
  ```

**Task 1.4: Update Operations**
- ✅ Update single document
- ✅ Update multiple documents
- ✅ Increment/decrement operations
- **Commands:**
  ```javascript
  // Update one
  db.books.updateOne(
    { isbn: "978-0-13-110362-7" },
    { $set: { availableCopies: 2, updatedAt: new Date() } }
  )
  
  // Update multiple
  db.members.updateMany(
    { status: "Inactive" },
    { $set: { isActive: false } }
  )
  
  // Increment
  db.borrowTransactions.updateOne(
    { _id: ObjectId("...") },
    { $inc: { fine: 50 } }
  )
  ```

**Task 1.5: Delete Operations**
- ✅ Delete one document
- ✅ Delete multiple documents
- ✅ Delete all documents (with confirmation)
- **Commands:**
  ```javascript
  // Delete one
  db.borrowTransactions.deleteOne({ status: "Returned" })
  
  // Delete many
  db.borrowTransactions.deleteMany({ status: "Overdue" })
  
  // Delete all (use with caution)
  db.borrowTransactions.deleteMany({})
  ```

### Phase 2: Query Operators Mastery (Week 2)

**Task 2.1: Comparison Operators**
- ✅ $gt (greater than)
- ✅ $lt (less than)
- ✅ $gte, $lte, $eq, $ne
- **Commands:**
  ```javascript
  // Books with price > 50
  db.books.find({ price: { $gt: 50 } })
  
  // Members with rating < 3
  db.books.find({ rating: { $lt: 3 } })
  
  // Books published after 2015
  db.books.find({ publishedYear: { $gte: 2015 } })
  ```

**Task 2.2: Logical Operators**
- ✅ $and (multiple conditions)
- ✅ $or (any condition)
- ✅ $not, $nor
- **Commands:**
  ```javascript
  // Programming books with price > 50
  db.books.find({
    $and: [
      { genre: "Programming" },
      { price: { $gt: 50 } }
    ]
  })
  
  // Books that are either premium or bestsellers
  db.books.find({
    $or: [
      { genre: "Bestseller" },
      { rating: { $gte: 4.5 } }
    ]
  })
  ```

**Task 2.3: Array Operators**
- ✅ $in (match any value in array)
- ✅ $nin (not in array)
- ✅ $all (all elements match)
- ✅ $elemMatch (nested array conditions)
- **Commands:**
  ```javascript
  // Books in specific genres
  db.books.find({ genre: { $in: ["Programming", "Technology"] } })
  
  // Members not in specific cities
  db.members.find({ "address.city": { $nin: ["NewYork", "Boston"] } })
  ```

**Task 2.4: Element Operators**
- ✅ $exists (field exists)
- ✅ $type (field type)
- **Commands:**
  ```javascript
  // Books with description field
  db.books.find({ description: { $exists: true } })
  
  // Members without fine
  db.members.find({ fine: { $exists: false } })
  
  // Books with numeric rating
  db.books.find({ rating: { $type: "double" } })
  ```

**Task 2.5: Complex Queries**
- ✅ Combine multiple operators
- ✅ Aggregate functions (count, sum)
- **Commands:**
  ```javascript
  // Complex query: Active members from specific cities with fine > 100
  db.members.find({
    $and: [
      { status: "Active" },
      { "address.city": { $in: ["NYC", "LA"] } },
      { fine: { $gt: 100 } },
      { isActive: true }
    ]
  })
  
  // Count books by genre
  db.books.aggregate([
    { $group: { _id: "$genre", count: { $sum: 1 } } }
  ])
  ```

### Phase 3: Real-World Use Case Implementation (Week 3)

**Task 3.1: Library System Workflows**

1. **Book Management**
   - Add new books
   - Update stock quantities
   - Search books by multiple criteria
   - Track book ratings and availability

2. **Member Management**
   - Register new members
   - Update member information
   - Track membership status
   - Calculate fines

3. **Borrowing System**
   - Record book borrowing
   - Track due dates
   - Record returns
   - Manage overdue books
   - Calculate and track fines

**Task 3.2: Business Logic Implementation**

```
Borrow Book Flow:
1. Member requests book
2. Check available copies
3. Create BorrowTransaction record
4. Decrease availableCopies in Books
5. Set dueDate (14 days from today)
6. Record borrowDate

Return Book Flow:
1. Member returns book
2. Find active BorrowTransaction
3. Check if overdue (dueDate < today)
4. Calculate fine if overdue (₹50 per day)
5. Update transaction status to "Returned"
6. Increase availableCopies in Books
7. Update member's total fine
```

---

## 🔧 Implementation Commands Reference

### CRUD Operations Summary

| Operation | MongoDB Command | Use Case |
|-----------|-----------------|----------|
| **Create** | `insertOne()`, `insertMany()` | Add new books, members, transactions |
| **Read** | `find()`, `findOne()`, `findById()` | Search books, view member details |
| **Update** | `updateOne()`, `updateMany()` | Change status, update stock, modify info |
| **Delete** | `deleteOne()`, `deleteMany()` | Remove records (with caution) |

### Query Operators Quick Reference

```javascript
// Comparison
{ field: { $gt: value } }      // Greater than
{ field: { $lt: value } }      // Less than
{ field: { $gte: value } }     // Greater than or equal
{ field: { $lte: value } }     // Less than or equal
{ field: { $eq: value } }      // Equal to
{ field: { $ne: value } }      // Not equal to

// Logical
{ $and: [condition1, condition2] }   // Both conditions
{ $or: [condition1, condition2] }    // Either condition
{ $not: { field: condition } }       // Negation
{ $nor: [condition1, condition2] }   // Neither condition

// Array
{ field: { $in: [val1, val2] } }     // In array
{ field: { $nin: [val1, val2] } }    // Not in array
{ field: { $all: [val1, val2] } }    // All elements
{ field: { $elemMatch: condition } } // Array element match

// Element
{ field: { $exists: true } }         // Field exists
{ field: { $type: "string" } }       // Field type check
```

---

## 📈 Key Performance Indicators (KPIs)

**By project completion, you should be able to:**

✅ Write CRUD operations confidently  
✅ Design efficient database schemas  
✅ Use query operators for complex filtering  
✅ Implement indexes for performance  
✅ Handle real-world data relationships  
✅ Build a complete full-stack application  
✅ Understand data validation and error handling  

---

## 🛠️ Tools & Environment Setup

**Prerequisites:**
- Node.js v16+
- MongoDB Community Server v5.0+
- MongoDB Compass (GUI Tool)
- Postman (API Testing)

**Development Stack:**
- **Frontend:** React 18, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Other:** Axios, React Router, Context API

---

## 📚 Learning Resources

- MongoDB Official Documentation: https://docs.mongodb.com/
- MongoDB Compass Tutorial: https://www.mongodb.com/products/compass
- CRUD Operations Guide: https://docs.mongodb.com/manual/crud/
- Query Operators: https://docs.mongodb.com/manual/reference/operator/query/

---

## ✨ Expected Outcomes

### Knowledge Gained:
1. Complete understanding of NoSQL databases
2. MongoDB document model and collections
3. CRUD operations and transactions
4. Advanced querying with operators
5. Database indexing strategies
6. Real-world application design

### Skills Developed:
1. Database design and schema planning
2. Full-stack application development
3. RESTful API design
4. Frontend-backend integration
5. Data validation and error handling
6. Performance optimization

### Deliverables:
1. ✅ MongoDB Project Plan (this document)
2. ✅ System Architecture Diagram
3. ✅ Database Schema Design
4. ✅ React + Vite + Tailwind Application
5. ✅ API Documentation
6. ✅ Complete CRUD Examples
7. ✅ Real-world Use Case Implementation

---

## 🎓 Conclusion

This project provides a structured learning path from MongoDB fundamentals to building a complete full-stack application. By working through each phase systematically, you'll gain practical experience with database design, query optimization, and modern web development.

**Success Metric:** You can confidently explain and implement MongoDB CRUD operations, design efficient schemas, and build production-ready applications.

