import axios from 'axios';

const API_URL = 'http://localhost:5000/recognition';

export const recognizeFood = async (imageFile) => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    throw { message: 'Session expired, please log in again', status: 401 };
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await axios.post(`${API_URL}/classify`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Recognition error:', error);
    throw error.response?.data || { message: 'Network error or server unavailable' };
  }
};
