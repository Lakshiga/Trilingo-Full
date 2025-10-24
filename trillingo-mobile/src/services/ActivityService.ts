import axios from 'axios';
import { Level, UserProgress } from '../types/navigation';

const API_BASE_URL = 'http://localhost:5166/api';

export class ActivityService {
  private static getHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  static async getLevels(): Promise<Level[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/levels`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching levels:', error);
      throw error;
    }
  }

  static async getUserProgress(userId: number): Promise<UserProgress[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/students/${userId}/progress`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  }

  static async getActivities(levelId: number): Promise<any[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/activities?levelId=${levelId}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  }

  static async getLanguages(): Promise<any[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/languages`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching languages:', error);
      throw error;
    }
  }
}