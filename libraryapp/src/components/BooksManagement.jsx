import { useState } from 'react';
import { useMongoStore } from '../store/mongoStore';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';

const BooksManagement = () => {
  const books = useMongoStore(state => state.books);
  const addBook = useMongoStore(state => state.addBook);
  const updateBook = useMongoStore(state => state.updateBook);
  const deleteBook = useMongoStore(state => state.deleteBook);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    publishedYear: '',
    genre: '',
    totalCopies: '',
    pages: '',
    price: '',
    rating: ''
  });

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (book = null) => {
    setError('');
    if (book) {
      setEditingBook(book);
      setFormData({
        ...book,
        genre: book.genre || '',
      });
    } else {
      setEditingBook(null);
      setFormData({
        isbn: '', title: '', author: '', publisher: '', publishedYear: '',
        genre: '', totalCopies: '', pages: '', price: '', rating: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const bookData = {
        ...formData,
        publishedYear: parseInt(formData.publishedYear),
        totalCopies: parseInt(formData.totalCopies),
        pages: parseInt(formData.pages),
        price: parseFloat(formData.price),
        rating: parseFloat(formData.rating),
        genre: formData.genre,
        availableCopies: editingBook ? editingBook.availableCopies + (parseInt(formData.totalCopies) - editingBook.totalCopies) : parseInt(formData.totalCopies),
        isActive: true
      };

      if (editingBook) {
        updateBook(editingBook._id, bookData);
      } else {
        addBook(bookData);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        deleteBook(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Books Management</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none"
        >
          <FiPlus className="mr-2" /> Add New Book
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search books by title or author..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title & Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISBN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Rating</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBooks.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{book.title}</div>
                    <div className="text-sm text-gray-500">{book.author}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {book.isbn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${book.availableCopies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {book.availableCopies} / {book.totalCopies} Available
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{(Number(book.price) || 0).toFixed(2)} | {book.rating}★
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenModal(book)} className="text-blue-600 hover:text-blue-900 mr-4">
                      <FiEdit2 className="inline" />
                    </button>
                    <button onClick={() => handleDelete(book._id)} className="text-red-600 hover:text-red-900">
                      <FiTrash2 className="inline" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBooks.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No books found. Try adjusting your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
              
              <form id="bookForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ISBN *</label>
                  <input required type="text" value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" placeholder="e.g. 978-..." disabled={!!editingBook} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                  <input required type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                  <input type="text" value={formData.publisher} onChange={e => setFormData({...formData, publisher: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Published Year</label>
                  <input type="number" min="1000" max="2099" value={formData.publishedYear} onChange={e => setFormData({...formData, publishedYear: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" placeholder="e.g. 2021" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genres (comma separated)</label>
                  <input type="text" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" placeholder="Programming, Web..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Copies *</label>
                  <input required type="number" min="1" value={formData.totalCopies} onChange={e => setFormData({...formData, totalCopies: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
                  <input type="number" value={formData.pages} onChange={e => setFormData({...formData, pages: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                  <input required type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                  <input type="number" step="0.1" min="1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mr-3">Cancel</button>
              <button type="submit" form="bookForm" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{editingBook ? 'Update Book' : 'Save Book'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksManagement;
