import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import devConfig from './config/dev';
import prdConfig from './config/prd';

const app = firebase.initializeApp(process.env.NODE_ENV === 'production' ? prdConfig : devConfig);
export const auth = firebase.auth;
export const db = firebase.database(app);
