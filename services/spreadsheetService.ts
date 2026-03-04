
import { API_URL } from '../constants';

export const saveSpreadsheet = async (url: string, sheetName: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}?action=save&url=${encodeURIComponent(url)}&sheet=${encodeURIComponent(sheetName)}`);
    return response.ok;
  } catch (error) {
    console.error('Failed to save spreadsheet to GAS:', error);
    return false;
  }
};

export const getSpreadsheets = async (): Promise<{url: string, sheet: string}[]> => {
  try {
    const response = await fetch(`${API_URL}?action=list`);
    if (!response.ok) throw new Error('Failed to fetch spreadsheets');
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch spreadsheets from GAS:', error);
    return [];
  }
};

export const deleteSpreadsheet = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}?action=delete&url=${encodeURIComponent(url)}`);
    return response.ok;
  } catch (error) {
    console.error('Failed to delete spreadsheet from GAS:', error);
    return false;
  }
};
