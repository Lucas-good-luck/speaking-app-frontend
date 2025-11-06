import axios from 'axios';
export const API_URL = import.meta.env.VITE_API_BASE || 'https://speaking-app-backend.onrender.com/api/v1';

export const fetchQuestion = (exam='SPM', mode='ai', count=1) => {
  return axios.post(`${API_URL}/questions/fetch`, { exam, mode, count }).then(r=>r.data);
}

export const uploadImage = (file) => {
  const fd = new FormData();
  fd.append('image', file);
  return axios.post(`${API_URL}/questions/upload-image`, fd, { headers: {'Content-Type':'multipart/form-data'} }).then(r=>r.data);
}

export const uploadAudio = (file) => {
  const fd = new FormData();
  fd.append('audio', file);
  return axios.post(`${API_URL}/practice/upload-audio`, fd, { headers: {'Content-Type':'multipart/form-data'} }).then(r=>r.data);
}

export const generateMindmap = (text, lang='en') => {
  return axios.post(`${API_URL}/generate/mindmap`, { source_text: text, lang }).then(r=>r.data);
}
