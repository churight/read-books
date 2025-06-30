export default interface IBook{
    _id: string;
    isbn13: number;
    isbn10: number;
    title: string;
    authors: string[];
    categories: string[];
    thumbnail: string;
    description: string;
    published_year: number;
    average_rating: number;
    num_pages: number;
    ratings_count: number;
}