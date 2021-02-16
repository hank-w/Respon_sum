import 'axios';
import axios from 'axios';
import { ID, Stats, Student } from '../types/api';
import { BASE_URL } from './api';

export const getStudentId = async (id: ID): Promise<Student> => {
  return axios.get(`${BASE_URL}/students/${id}`);
};
