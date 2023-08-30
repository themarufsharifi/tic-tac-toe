import { default as axiosInstance } from 'axios';
import { io } from 'socket.io-client';
import { BASE_URL } from './constants';

export const axios = axiosInstance.create({
  baseURL: `${BASE_URL}api/`,
  timeout: 1000
});

export const socket = io(BASE_URL);
