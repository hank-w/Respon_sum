import 'axios';
import axios from 'axios';
import { ID, Instructor } from '../types/api';
import { BASE_URL} from './api';

export const getInstructorById = async (id: ID): Promise<any> => {
  return axios.get(`http://${BASE_URL}/instructors/${id}`);
};

export const putInstructorById = async (id: ID, instructor: Instructor): Promise<any> => {
    return axios.put(`http://${BASE_URL}/instructors/${id}`, instructor);
  };
  
  export const deleteInstructorById = async (id: ID): Promise<any> => {
    return axios.delete(`http://${BASE_URL}/instructors/${id}`);
  };
  
  export const createInstructor = async (instructor: Instructor): Promise<any> => {
    return axios.post(`http://${BASE_URL}/instructors`, instructor);
  };