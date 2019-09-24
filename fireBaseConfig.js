// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/database";
import { APP_CONFIG } from "./constant"
const { API_KEY, PROJECT_ID, DATABASE_NAME, STORAGE_BUCKET } = APP_CONFIG

// Set the configuration for your app
// TODO: Replace with your project's config object
const config = {
  apiKey: API_KEY,
  authDomain: `${PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${DATABASE_NAME}.firebaseio.com`,
  storageBucket: STORAGE_BUCKET
};
firebase.initializeApp(config);

// Get a reference to the database service
export const database = firebase.database();
