import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/analytics';
import devConfig from './config/dev';
import prdConfig from './config/prd';

const app = firebase.initializeApp(process.env.NODE_ENV === 'production' ? prdConfig : devConfig);
export const auth = firebase.auth;
export const db = firebase.database(app);
if (process.env.NODE_ENV === 'production') {
  firebase.analytics(app);
}
