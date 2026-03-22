import axios from 'axios';

const api = axios.create({
  baseURL: 'https://genie-riftless-catherine.ngrok-free.dev',
});

const addAvatarUrl = (obj: any) => {
  if (obj && typeof obj === 'object' && 'avatar' in obj) {
    obj.avatar_url = obj.avatar ? `${api.defaults.baseURL}/files/${obj.avatar}` : null;
  }
};

api.interceptors.response.use(response => {
  const data = response.data;

  if (Array.isArray(data)) {
    data.forEach(addAvatarUrl);
  } else if (data?.user) {
    addAvatarUrl(data.user);
  } else if (data && typeof data === 'object' && 'id' in data) {
    addAvatarUrl(data);
  }

  return response;
});

export default api;
