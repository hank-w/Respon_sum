import 'axios';
import axios from 'axios';
import { ID, Student } from '../types/api';
import { BASE_URL } from './api';

export const getStudentById = async (id: ID): Promise<any> => {
  return axios.get(`http://${BASE_URL}/students/${id}`);
};

export const putStudentById = async (id: ID, student: Student): Promise<any> => {
  return axios.put(`http://${BASE_URL}/students/${id}`, student);
};

export const deleteStudentById = async (id: ID): Promise<any> => {
  return axios.delete(`http://${BASE_URL}/students/${id}`);
};

export const createStudent = async (student: Student): Promise<any> => {
  return axios.post(`http://${BASE_URL}/students`, student);
};

export const getClassesByStudentId = async (id: ID): Promise<any> => {
  return axios.get(`http://${BASE_URL}/students/${id}/classes`);
};
