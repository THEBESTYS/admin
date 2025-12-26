// 관리자 인증 확인
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAdmin = false;
    }
    
    // 관리자 권한 확인 (간단한 버전)
    async checkAdminPermission(user) {
        // 방법 1: 특정 이메일 도메인 확인 (가장 간단)
        const adminEmails = ['admin@example.com', 'yonseii@naver.com'];
        if (adminEmails.includes(user.email)) {
            return true;
        }
        
        // 방법 2: Firestore에서 관리자 목록 확인 (선택사항)
        try {
            const db = window.firebaseManager.getFirestore();
            const adminDoc = await db.collection('admins').doc(user.uid).get();
            return adminDoc.exists;
        } catch (error) {
            console.warn('관리자 확인 실패:', error);
            return false;
        }
    }
    
    // 인증 상태 모니터링
    async startAuthMonitoring() {
        const auth = window.firebaseManager.getAuth();
        
        return new Promise((resolve) => {
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    this.currentUser = user;
                    this.isAdmin = await this.checkAdminPermission(user);
                    
                    if (this.isAdmin) {
                        console.log(`✅ 관리자 인증 성공: ${user.email}`);
                        this.showAdminUI();
                        resolve(true);
                    } else {
                        console.log('❌ 관리자 권한 없음');
                        this.redirectToHome();
                        resolve(false);
                    }
                } else {
                    console.log('❌ 로그인되지 않음');
                    this.redirectToLogin();
                    resolve(false);
                }
            });
        });
    }
    
    showAdminUI() {
        // 인증 메시지 숨기기
        const authMessage = document.getElementById('auth-message');
        if (authMessage) authMessage.style.display = 'none';
        
        // 메인 콘텐츠 표시
        const adminMain = document.getElementById('admin-main');
        if (adminMain) adminMain.style.display = 'block';
        
        // 관리자 정보 표시
        const adminInfo = document.getElementById('admin-info');
        if (adminInfo) {
            adminInfo.innerHTML = `
                <p class="admin-email">${this.currentUser.email}</p>
                <p class="admin-status">관리자</p>
            `;
        }
    }
    
    redirectToLogin() {
        // 3초 후 로그인 페이지로 이동
        const authMessage = document.getElementById('auth-message');
        if (authMessage) {
            authMessage.innerHTML = '<p>로그인이 필요합니다. 로그인 페이지로 이동합니다...</p>';
            authMessage.className = 'auth-message error';
        }
        
        setTimeout(() => {
            window.location.href = 'https://yourname.github.io/login/';
        }, 3000);
    }
    
    redirectToHome() {
        // 3초 후 홈페이지로 이동
        const authMessage = document.getElementById('auth-message');
        if (authMessage) {
            authMessage.innerHTML = '<p>관리자 권한이 없습니다. 홈페이지로 이동합니다...</p>';
            authMessage.className = 'auth-message error';
        }
        
        setTimeout(() => {
            window.location.href = 'https://yourname.github.io/ashop/';
        }, 3000);
    }
    
    async logout() {
        try {
            const auth = window.firebaseManager.getAuth();
            await auth.signOut();
            
            // 로컬 스토리지 정리
            localStorage.removeItem('ashop_user');
            
            // 로그인 페이지로 이동
            window.location.href = 'https://yourname.github.io/login/';
        } catch (error) {
            console.error('로그아웃 실패:', error);
            alert('로그아웃 중 오류가 발생했습니다.');
        }
    }
}

// 페이지 로드 시 인증 시작
document.addEventListener('DOMContentLoaded', async () => {
    if (window.firebaseManager.initialize()) {
        window.authManager = new AuthManager();
        await window.authManager.startAuthMonitoring();
    }
});
