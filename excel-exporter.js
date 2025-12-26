// Excel 내보내기 기능
class ExcelExporter {
    constructor() {
        this.sheetName = '회원목록';
    }
    
    async exportToExcel() {
        if (!window.userManager || window.userManager.users.length === 0) {
            alert('내보낼 데이터가 없습니다. 먼저 데이터를 불러와주세요.');
            return;
        }
        
        try {
            console.log('📊 Excel 내보내기 시작...');
            
            // 데이터 변환
            const excelData = window.userManager.users.map(user => ({
                'UID': user.id,
                '이름': user.username || '',
                '이메일': user.email || '',
                '전화번호': user.phone || '',
                '등급': user.tier || 'bronze',
                '포인트': user.points || 0,
                '상태': user.status || 'active',
                '가입방법': user.signupMethod || 'email',
                '가입일': user.createdAt ? user.createdAt.toDate().toLocaleString('ko-KR') : '',
                '최근로그인': user.lastLogin ? user.lastLogin.toDate().toLocaleString('ko-KR') : '',
                '이메일인증': user.emailVerified ? '완료' : '미완료'
            }));
            
            // 워크시트 생성
            const worksheet = XLSX.utils.json_to_sheet(excelData);
            
            // 컬럼 너비 설정
            const wscols = [
                { wch: 30 }, // UID
                { wch: 15 }, // 이름
                { wch: 25 }, // 이메일
                { wch: 15 }, // 전화번호
                { wch: 10 }, // 등급
                { wch: 10 }, // 포인트
                { wch: 10 }, // 상태
                { wch: 12 }, // 가입방법
                { wch: 20 }, // 가입일
                { wch: 20 }, // 최근로그인
                { wch: 12 }  // 이메일인증
            ];
            worksheet['!cols'] = wscols;
            
            // 워크북 생성
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, this.sheetName);
            
            // 파일명 생성
            const dateStr = new Date().toISOString().split('T')[0];
            const fileName = `ashop_회원목록_${dateStr}.xlsx`;
            
            // 파일 저장
            XLSX.writeFile(workbook, fileName);
            
            console.log(`✅ Excel 내보내기 완료: ${excelData.length}명`);
            alert(`✅ ${excelData.length}명의 데이터를 Excel 파일로 저장했습니다!\n파일명: ${fileName}`);
            
        } catch (error) {
            console.error('❌ Excel 내보내기 실패:', error);
            alert('Excel 내보내기 실패: ' + error.message);
        }
    }
}

// 전역에서 사용 가능하도록
document.addEventListener('DOMContentLoaded', () => {
    window.excelExporter = new ExcelExporter();
});
