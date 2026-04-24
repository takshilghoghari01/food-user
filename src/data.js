import { fetchCategories, fetchMenuItems } from './api';

export const getCategories = async () => {
  try {
    const categories = await fetchCategories();
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getMenuItems = async () => {
  try {
    const items = await fetchMenuItems();
    return items;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};
