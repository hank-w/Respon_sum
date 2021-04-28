import 'axios';
import axios from 'axios';
import {ID, Class} from '../types/api'
import { BASE_URL } from './api';

export const addStudentToClass = async (id: ID, clazz: Class): Promise<any> => {
  return axios.put(`http://${BASE_URL}/classes/${clazz.id}/students/${id}`);
};

export const removeStudentFromClass = async (id: ID, clazz: Class): Promise<any> => {
  return axios.delete(`http://${BASE_URL}/classes/${clazz.id}/students/${id}`);
};

export const addInstructorToClass = async (id: ID, clazz: Class): Promise<any> => {
  return axios.put(`http://${BASE_URL}/classes/${clazz.id}/instructors/${id}`);
};

export const removeInstructorFromClass = async (id: ID, clazz: Class): Promise<any> => {
  return axios.delete(`http://${BASE_URL}/classes/${clazz.id}/instructors/${id}`);
};

export const getAllClasses = async (): Promise<any> => {
  return axios.get(`http://${BASE_URL}/classes`);
};

