import request from 'supertest'; //simulate http request
import app from '../server';
import { Favourite } from '../models/Favourite'; 
import mongoose from 'mongoose';


jest.mock('../models/Favourite');
jest.mock('../middleware/authMiddleware', () => {
  return require('./__mocks__/middlewares');
});


describe('POST /add/favourite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add book to favourites if not already present', async () => {
    (Favourite.findOne as jest.Mock).mockResolvedValue(null);
    (Favourite.prototype.save as jest.Mock).mockResolvedValue({ books_isbn13: ['1234567890123'] });

    const response = await request(app)
      .post('/api/browse/add/favourite')
      .send({ isbn13: '1234567890123' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Book added to favourites');
    expect(Favourite.prototype.save).toHaveBeenCalled();
  });

  it('should return 409 if book is already in favourites', async () => {
    const mockFavourite = {
      books_isbn13: ['1234567890123'],
      save: jest.fn(),
    };
    (Favourite.findOne as jest.Mock).mockResolvedValue(mockFavourite);

    const response = await request(app)
      .post('/api/browse/add/favourite')
      .send({ isbn13: '1234567890123' });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Book already in favourites');
  });

  it('should return 400 if ISBN13 is missing', async () => {
    const response = await request(app).post('/api/browse/add/favourite').send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('ISBN13 is required');
  });

  it('should handle server error', async () => {
    (Favourite.findOne as jest.Mock).mockImplementation(() => {
      throw new Error('Database error');
    });

    const response = await request(app)
      .post('/api/browse/add/favourite')
      .send({ isbn13: '1234567890123' });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Server error');
  });

  afterAll(async () => {
  await mongoose.connection.close();
});

});
