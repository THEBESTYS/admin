// Firebase 설정 (재사용 가능)
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyC1XDqgki7lKMz-EE4ZFzOLmku8EsLI0yI",
    authDomain: "login-57c14.firebaseapp.com",
    projectId: "login-57c14",
    storageBucket: "login-57c14.firebasestorage.app",
    messagingSenderId: "847658526472",
    appId: "1:847658526472:web:05adaddfea3afff8e12ebd"
};

// Firebase 서비스 초기화
class FirebaseManager {
    constructor() {
        this.app = null;
        this.auth = null;
        this.db = null;
        this.initialized = false;
    }
    
    initialize() {
        try {
            if (firebase.apps.length === 0) {
                this.app = firebase.initializeApp(FIREBASE_CONFIG);
            } else {
                this.app = firebase.apps[0];
            }
            
            this.auth = firebase.auth();
            this.db = firebase.firestore();
            this.initialized = true;
            
            console.log('✅ Firebase 초기화 완료');
            return true;
        } catch (error) {
            console.error('❌ Firebase 초기화 실패:', error);
            return false;
        }
    }
    
    getAuth() {
        return this.auth;
    }
    
    getFirestore() {
        return this.db;
    }
}

// 전역에서 사용할 수 있도록
window.firebaseManager = new FirebaseManager();
