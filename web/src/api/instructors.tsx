import 'axios';
import axios from 'axios';
import { ID, Instructor } from '../types/api';
import { BASE_URL} from './api';

export const getInstructorById = async (id: ID): Promise<any> => {
  return axios.get(`http://${BASE_URL}/instructors/${id}`);
};

export const putStudentById = async (id: ID, instructor: Instructor): Promise<any> => {
    return axios.put(`http://${BASE_URL}/students/${id}`, instructor);
  };
  
  export const deleteStudentById = async (id: ID): Promise<any> => {
    return axios.delete(`http://${BASE_URL}/students/${id}`);
  };
  
  export const createStudent = async (instructor: Instructor): Promise<any> => {
    return axios.post(`http://${BASE_URL}/students`, instructor);
  };