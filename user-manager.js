// 회원 데이터 관리
class UserManager {
    constructor() {
        this.users = [];
        this.db = window.firebaseManager.getFirestore();
    }
    
    async loadUsers() {
        try {
            console.log('📥 회원 데이터 로딩 중...');
            
            const snapshot = await this.db.collection('ashop_users')
                .orderBy('createdAt', 'desc')
                .get();
            
            this.users = [];
            snapshot.forEach(doc => {
                this.users.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            console.log(`✅ ${this.users.length}명의 회원 데이터 로드 완료`);
            
            this.updateStats();
            this.displayUsers();
            
            return this.users;
            
        } catch (error) {
            console.error('❌ 회원 데이터 로드 실패:', error);
            alert('데이터 로드 실패: ' + error.message);
            return [];
        }
    }
    
    updateStats() {
        const totalUsers = this.users.length;
        const activeUsers = this.users.filter(u => u.status === 'active').length;
        const totalPoints = this.users.reduce((sum, user) => sum + (user.points || 0), 0);
        
        // 통계 업데이트
        document.getElementById('total-users').textContent = totalUsers.toLocaleString();
        document.getElementById('active-users').textContent = activeUsers.toLocaleString();
        document.getElementById('total-points').textContent = totalPoints.toLocaleString();
    }
    
    displayUsers() {
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;
        
        let html = '';
        
        this.users.forEach(user => {
            const createdAt = user.createdAt ? 
                user.createdAt.toDate().toLocaleDateString('ko-KR') : '-';
            
            html += `
                <tr>
                    <td>${user.username || '-'}</td>
                    <td>${user.email || '-'}</td>
                    <td>${user.phone || '-'}</td>
                    <td><span class="tier-badge ${user.tier || 'bronze'}">${user.tier || 'bronze'}</span></td>
                    <td>${(user.points || 0).toLocaleString()}P</td>
                    <td><span class="status-badge ${user.status || 'active'}">${user.status || 'active'}</span></td>
                    <td>${createdAt}</td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
    }
    
    getUsers() {
        return this.users;
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    if (window.firebaseManager?.initialized) {
        window.userManager = new UserManager();
        
        // 인증 성공 후 자동으로 데이터 로드
        const checkAuthAndLoad = setInterval(() => {
            if (window.authManager?.isAdmin) {
                window.userManager.loadUsers();
                clearInterval(checkAuthAndLoad);
            }
        }, 500);
    }
});
