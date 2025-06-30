import axios from 'axios';

export const handleAddFavourites = async (isbn13: string) => {
  try {
    const res = await axios.post(
      'http://localhost:4000/api/browse/add/favourite',
      { isbn13 },
      { withCredentials: true }
    );
    alert(res.data.message);
  } catch (err: any) {
    if (err.response?.status === 401) {
      alert("Please log in");
    } else {
      alert("Failed to add to favourites");
    }
    console.error(err);
  }
};
