import axios from 'axios';
import { generateFakeProducts } from './fakeData';

const api = axios.create({
  baseURL: 'https://fakestoreapi.com',
});

export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return generateFakeProducts(20);
  }
};

export const getProduct = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    const fakeProducts = generateFakeProducts(20);
    return fakeProducts.find(p => p.id === parseInt(productId)) || fakeProducts[0];
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/products/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return ['electronics', 'jewelery', "men's clothing", "women's clothing"];
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    const fakeProducts = generateFakeProducts(20);
    return fakeProducts.filter(p => p.category === category);
  }
};

export default api;