const INITIAL_BOOKS = [
  { _id: 'b1', isbn: '978-0-13-110362-7', title: 'The C Programming Language', author: 'Kernighan & Ritchie', publisher: 'Prentice Hall', publishedYear: 1978, genre: 'Programming, Technology', totalCopies: 5, availableCopies: 5, pages: 274, language: 'English', description: 'Classic C programming book', price: 65.00, rating: 4.8, isActive: true },
  { _id: 'b2', isbn: '978-0-596-51774-8', title: 'Learning JavaScript', author: 'Shelley Powers', publisher: "O'Reilly", publishedYear: 2008, genre: 'Programming, Web', totalCopies: 3, availableCopies: 3, pages: 350, language: 'English', description: 'JavaScript guide', price: 45.00, rating: 4.2, isActive: true },
  { _id: 'b3', isbn: '978-0-13-235088-4', title: 'Clean Code', author: 'Robert C. Martin', publisher: 'Prentice Hall', publishedYear: 2008, genre: 'Programming, Software Engineering', totalCopies: 4, availableCopies: 4, pages: 464, language: 'English', description: 'Agile Software Craftsmanship', price: 55.00, rating: 4.7, isActive: true }
];

const INITIAL_MEMBERS = [
  { _id: 'm1', memberId: 'M001', firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '1234567890', address: { street: '123 Main St', city: 'NYC', state: 'NY', zipCode: '10001', country: 'USA' }, dateOfBirth: '1990-01-01', membershipType: 'Premium', joinDate: '2023-01-01', status: 'Active', borrowLimit: 5, fine: 0, isActive: true },
  { _id: 'm2', memberId: 'M002', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '0987654321', address: { street: '456 Oak St', city: 'Mumbai', state: 'MH', zipCode: '400001', country: 'India' }, dateOfBirth: '1985-05-15', membershipType: 'Standard', joinDate: '2023-06-15', status: 'Active', borrowLimit: 3, fine: 0, isActive: true }
];

async function seed() {
  console.log('Seeding books...');
  for (const book of INITIAL_BOOKS) {
    try {
      delete book._id;
      const res = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
      });
      if (!res.ok) {
        console.error('Book response error:', await res.json());
      } else {
        console.log('Book added');
      }
    } catch(err) {
      console.error('Failed to add book', err);
    }
  }

  console.log('Seeding members...');
  for (const member of INITIAL_MEMBERS) {
    try {
      delete member._id;
      const res = await fetch('http://localhost:5000/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      });
      console.log('Member response:', res.status);
    } catch(err) {
      console.error('Failed to add member', err);
    }
  }
  console.log('Seeding complete!');
}

seed();
