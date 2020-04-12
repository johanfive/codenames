import firebase from 'firebase';
import devConfig from './config/dev';
import prdConfig from './config/prd';

firebase.initializeApp(process.env.NODE_ENV === 'production' ? prdConfig : devConfig);
export const auth = firebase.auth;
export const db = firebase.database();
