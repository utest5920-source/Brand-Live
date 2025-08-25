import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

const api = axios.create({ baseURL: API_BASE })

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token')
	if (token) config.headers.Authorization = `Bearer ${token}`
	return config
})

export const authApi = {
	login: (phoneNumber, referralCode) => api.post('/auth/login', { phoneNumber, referralCode }),
	verify: (phoneNumber, code) => api.post('/auth/verify', { phoneNumber, code }),
}

export const userApi = {
	getProfile: () => api.get('/me/profile'),
	updateProfile: (data) => api.put('/me/profile', data),
}

export const businessApi = {
	getCategories: () => api.get('/business/categories'),
	createCategory: (data) => api.post('/business/categories', data),
	updateCategory: (id, data) => api.put(`/business/categories/${id}`, data),
	getFrames: () => api.get('/business/frames'),
	createFrame: (formData) => api.post('/business/frame', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
	updateFrame: (id, formData) => api.put(`/business/frame/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
	getProfile: () => api.get('/business/profile'),
	saveProfile: (data) => api.post('/business/profile', data),
}

export const politicalApi = {
	getFrames: () => api.get('/political/frames'),
	createFrame: (formData) => api.post('/political/frame', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
	updateFrame: (id, formData) => api.put(`/political/frame/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
	getProfile: () => api.get('/political/profile'),
	saveProfile: (data) => api.post('/political/profile', data),
}

export const imageApi = {
	list: (categoryId) => api.get('/images', { params: { categoryId } }),
	upload: (formData) => api.post('/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

export const categoryApi = {
	list: () => api.get('/categories/image'),
	create: (data) => api.post('/categories/image', data),
	update: (id, data) => api.put(`/categories/image/${id}`, data),
}

export const adsApi = {
	list: () => api.get('/ads'),
	create: (formData) => api.post('/ads', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
	update: (id, formData) => api.put(`/ads/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

export default api