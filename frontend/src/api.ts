import axios from 'axios';
const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:3001' });
export async function fetchUsers(params:any) {
  const res = await API.get('/api/users', { params });
  return res.data;
}
export async function fetchUserOrders(id:number, page=1, pageSize=50) {
  const res = await API.get(`/api/users/${id}/orders`, { params: { page, pageSize } });
  return res.data;
}
