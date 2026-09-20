import { create } from 'zustand';

/**
 * Core evaluation helper for MongoDB-like operators
 */
const evaluateCondition = (itemValue, operator, opValue) => {
  switch (operator) {
    case '$eq': return itemValue === opValue;
    case '$ne': return itemValue !== opValue;
    case '$gt': return itemValue > opValue;
    case '$gte': return itemValue >= opValue;
    case '$lt': return itemValue < opValue;
    case '$lte': return itemValue <= opValue;
    case '$in': return Array.isArray(opValue) && opValue.includes(itemValue);
    case '$nin': return Array.isArray(opValue) && !opValue.includes(itemValue);
    case '$exists': return (itemValue !== undefined) === opValue;
    case '$type': return typeof itemValue === opValue;
    case '$regex': return new RegExp(opValue, 'i').test(itemValue);
    case '$all': return Array.isArray(itemValue) && Array.isArray(opValue) && opValue.every(v => itemValue.includes(v));
    case '$elemMatch': return Array.isArray(itemValue) && itemValue.some(v => v === opValue || (typeof opValue === 'object' && evaluateFilter(v, opValue)));
    default: return itemValue === operator;
  }
};

/**
 * Filter evaluator supporting logical operators $and, $or, $nor
 */
const evaluateFilter = (item, filter) => {
  if (!filter || Object.keys(filter).length === 0) return true;

  for (const key in filter) {
    if (key === '$and') {
      if (!filter[key].every(subFilter => evaluateFilter(item, subFilter))) return false;
    } else if (key === '$or') {
      if (!filter[key].some(subFilter => evaluateFilter(item, subFilter))) return false;
    } else if (key === '$nor') {
      if (filter[key].some(subFilter => evaluateFilter(item, subFilter))) return false;
    } else {
      const condition = filter[key];
      const keys = key.split('.');
      let itemValue = item;
      for (const k of keys) {
        if (itemValue === undefined) break;
        itemValue = itemValue[k];
      }

      if (typeof condition === 'object' && condition !== null && !Array.isArray(condition)) {
        for (const operator in condition) {
          if (operator === '$not') {
            if (evaluateFilter(item, { [key]: condition[operator] })) return false;
          } else {
            if (!evaluateCondition(itemValue, operator, condition[operator])) return false;
          }
        }
      } else {
        if (itemValue !== condition) return false;
      }
    }
  }
  return true;
};

export const useMongoStore = create((set, get) => ({
  books: [],
  members: [],
  borrowTransactions: [],
  isLoading: true,
  error: null,

  initDatabase: async () => {
    set({ isLoading: true, error: null });
    try {
      const [booksRes, membersRes, txnsRes] = await Promise.all([
        fetch('/api/books'),
        fetch('/api/members'),
        fetch('/api/transactions')
      ]);
      
      if (!booksRes.ok || !membersRes.ok || !txnsRes.ok) {
        throw new Error('Failed to fetch data from database');
      }

      const books = await booksRes.json();
      const members = await membersRes.json();
      const borrowTransactions = await txnsRes.json();

      set({ books, members, borrowTransactions, isLoading: false });
    } catch (error) {
      console.error('Initialization error:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  resetDatabase: async () => {
    if (window.confirm("This requires manual DB clearing in Atlas. We will just reload data for now.")) {
      get().initDatabase();
    }
  },

  getStatistics: () => {
    const { books, members, borrowTransactions } = get();
    return {
      totalBooks: books.length,
      activeMembers: members.filter(m => m.status === 'Active').length,
      borrowedBooks: borrowTransactions.filter(t => t.status === 'Borrowed').length,
      totalFines: members.reduce((sum, m) => sum + (m.fine || 0), 0)
    };
  },

  // --- Books ---
  addBook: async (bookData) => {
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to add book');
      }
      const newBook = await res.json();
      set(state => ({ books: [...state.books, newBook] }));
    } catch (err) {
      throw err;
    }
  },

  getAllBooks: () => get().books,
  findBooks: (filter) => get().books.filter(book => evaluateFilter(book, filter)),

  updateBook: async (id, updates) => {
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update book');
      const updatedBook = await res.json();
      set(state => ({
        books: state.books.map(b => b._id === id ? updatedBook : b)
      }));
    } catch (err) {
      throw err;
    }
  },

  deleteBook: async (id) => {
    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete book');
      }
      set(state => ({ books: state.books.filter(b => b._id !== id) }));
    } catch (err) {
      throw err;
    }
  },

  // --- Members ---
  addMember: async (memberData) => {
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to add member');
      }
      const newMember = await res.json();
      set(state => ({ members: [...state.members, newMember] }));
    } catch (err) {
      throw err;
    }
  },

  getAllMembers: () => get().members,
  findMembers: (filter) => get().members.filter(member => evaluateFilter(member, filter)),

  updateMember: async (id, updates) => {
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update member');
      const updatedMember = await res.json();
      set(state => ({
        members: state.members.map(m => m._id === id ? updatedMember : m)
      }));
    } catch (err) {
      throw err;
    }
  },

  setMemberFine: async (id, amount) => {
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fine: amount })
      });
      if (!res.ok) throw new Error('Failed to set fine');
      // If the fine was set to 0, transactions may have been marked as paid. Re-fetch all data.
      await get().initDatabase();
    } catch (err) {
      throw err;
    }
  },
  
  clearMemberFine: async (id) => {
    await get().setMemberFine(id, 0);
  },

  incrementMemberFine: async (id, amount) => {
    const member = get().members.find(m => m._id === id);
    if (member) {
      await get().setMemberFine(id, (member.fine || 0) + amount);
    }
  },

  deleteMember: async (id) => {
    try {
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete member');
      set(state => ({ members: state.members.filter(m => m._id !== id) }));
    } catch (err) {
      throw err;
    }
  },

  // --- Transactions ---
  recordBorrow: async (data) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to record borrow');
      }
      
      // A successful borrow affects both transactions and the book's available copies
      // For simplicity, let's just re-fetch all data to ensure sync, or manually update state
      await get().initDatabase();
    } catch (err) {
      throw err;
    }
  },

  getAllTransactions: () => get().borrowTransactions,
  findTransactions: (filter) => get().borrowTransactions.filter(t => evaluateFilter(t, filter)),

  recordReturn: async (id, returnData) => {
    try {
      const res = await fetch(`/api/transactions/${id}/return`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnData)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to record return');
      }
      // A return affects transaction, book available copies, and potentially member fines.
      // Re-fetch all to ensure full sync.
      await get().initDatabase();
    } catch (err) {
      throw err;
    }
  },

  deleteTransaction: async (id) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete transaction');
      set(state => ({ borrowTransactions: state.borrowTransactions.filter(t => t._id !== id) }));
    } catch (err) {
      throw err;
    }
  },

  payTransactionFine: async (id) => {
    try {
      const res = await fetch(`/api/transactions/${id}/pay-fine`, { method: 'PUT' });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to pay fine');
      }
      // Re-fetch database to sync the updated transaction and updated member fine
      await get().initDatabase();
    } catch (err) {
      throw err;
    }
  }
}));
