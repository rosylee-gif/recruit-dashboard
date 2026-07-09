export const RECRUITERS = ['rosy.lee', 'elena.62', 'zoe.parc', 'jamie.bk', 'mk.jee'];

export const JOB_CATEGORIES = ['테크', '디자인', '스태프', '서비스비즈'];

export const EMPLOYEE_TYPES = ['정규직', '계약직', '어시스턴트', '인턴', '전문계약직', '경영계약직'];

export const ORG_LEVEL2 = [
  'Tech', 'AI Studios', 'Design', 'Business', 'Talk',
  '브랜드', '준법경영', 'PR', '경영지원', '전사이니셔티브',
  '지속가능경영', '윤리경영', 'PA', '정보보안', '소셜임팩트',
  'AXZ TF', '라운드테이블', '크루유니언', '감사위원회', '산업안전보건위원회',
  '상임윤리위원회', '인사위원회', '정보보호위원회', 'ERM위원회',
  '개인정보보호책임자/DPO', '정보보호최고책임자', '자율준수관리자',
  '게임컨버젼스 TF', 'DKT TF', 'Ep TF', 'RP TF',
];

export const PROCESS_STAGES = [
  '서류전형',
  '코딩테스트',
  '과제전형',
  '사전인터뷰',
  '1차 인터뷰',
  '2차 인터뷰',
  '처우협의',
  '입사확정',
];

export const LAST_UPDATED = '2026-07-09T10:15:00';

export const mockJobs = [
  // Tech
  { id: 'JOB-001', title: '프론트엔드 개발자', category: '테크', employeeType: '정규직', status: '진행중', recruiter: 'rosy.lee', hiringManager: '김현업', department: 'Tech Frontend', orgLevel2: 'Tech', openedAt: '2026-05-20' },
  { id: 'JOB-002', title: '백엔드 개발자 (Node.js)', category: '테크', employeeType: '정규직', status: '진행중', recruiter: 'rosy.lee', hiringManager: '이현업', department: 'Tech Backend', orgLevel2: 'Tech', openedAt: '2026-05-25' },
  { id: 'JOB-003', title: 'iOS 개발자', category: '테크', employeeType: '정규직', status: '진행중', recruiter: 'rosy.lee', hiringManager: '강현업', department: 'Tech Mobile', orgLevel2: 'Tech', openedAt: '2026-06-02' },
  { id: 'JOB-004', title: '데이터 엔지니어', category: '테크', employeeType: '정규직', status: '진행중', recruiter: 'mk.jee', hiringManager: '송현업', department: 'Tech Data Platform', orgLevel2: 'Tech', openedAt: '2026-06-10' },
  // AI Studios
  { id: 'JOB-005', title: 'ML 엔지니어', category: '테크', employeeType: '정규직', status: '진행중', recruiter: 'rosy.lee', hiringManager: '박현업', department: 'AI Model팀', orgLevel2: 'AI Studios', openedAt: '2026-05-15' },
  { id: 'JOB-006', title: 'AI Research Scientist', category: '테크', employeeType: '정규직', status: '진행중', recruiter: 'mk.jee', hiringManager: '최현업', department: 'AI Research Lab', orgLevel2: 'AI Studios', openedAt: '2026-05-28' },
  { id: 'JOB-007', title: 'LLM 파인튜닝 엔지니어', category: '테크', employeeType: '정규직', status: '진행중', recruiter: 'rosy.lee', hiringManager: '윤현업', department: 'AI Infra', orgLevel2: 'AI Studios', openedAt: '2026-06-05' },
  // Design
  { id: 'JOB-008', title: 'UX 디자이너', category: '디자인', employeeType: '정규직', status: '진행중', recruiter: 'elena.62', hiringManager: '정현업', department: 'Product Design', orgLevel2: 'Design', openedAt: '2026-06-01' },
  { id: 'JOB-009', title: '브랜드 디자이너', category: '디자인', employeeType: '계약직', status: '진행중', recruiter: 'elena.62', hiringManager: '한현업', department: 'Brand Visual', orgLevel2: 'Design', openedAt: '2026-06-18' },
  // Business
  { id: 'JOB-010', title: '영업 매니저', category: '서비스비즈', employeeType: '정규직', status: '진행중', recruiter: 'jamie.bk', hiringManager: '임현업', department: 'B2B Sales', orgLevel2: 'Business', openedAt: '2026-06-03' },
  { id: 'JOB-011', title: '파트너십 매니저', category: '서비스비즈', employeeType: '정규직', status: '진행중', recruiter: 'jamie.bk', hiringManager: '조현업', department: 'Partnership팀', orgLevel2: 'Business', openedAt: '2026-06-20' },
  // Talk
  { id: 'JOB-012', title: '서비스 기획자', category: '스태프', employeeType: '정규직', status: '진행중', recruiter: 'rosy.lee', hiringManager: '류현업', department: 'Talk서비스팀', orgLevel2: 'Talk', openedAt: '2026-05-30' },
  { id: 'JOB-013', title: '채널 운영 담당자', category: '스태프', employeeType: '계약직', status: '진행중', recruiter: 'zoe.parc', hiringManager: '황현업', department: 'Talk채널운영', orgLevel2: 'Talk', openedAt: '2026-06-22' },
  // 브랜드
  { id: 'JOB-014', title: '브랜드 마케터', category: '스태프', employeeType: '정규직', status: '진행중', recruiter: 'elena.62', hiringManager: '서현업', department: '브랜드전략팀', orgLevel2: '브랜드', openedAt: '2026-06-08' },
  // 경영지원
  { id: 'JOB-015', title: '인사 담당자', category: '스태프', employeeType: '정규직', status: '진행중', recruiter: 'zoe.parc', hiringManager: '문현업', department: 'HR오퍼레이션', orgLevel2: '경영지원', openedAt: '2026-06-12' },
  { id: 'JOB-016', title: '재무회계 담당자', category: '스태프', employeeType: '정규직', status: '진행중', recruiter: 'zoe.parc', hiringManager: '노현업', department: '재무기획팀', orgLevel2: '경영지원', openedAt: '2026-06-25' },
  // 정보보안
  { id: 'JOB-017', title: '정보보안 엔지니어', category: '테크', employeeType: '정규직', status: '진행중', recruiter: 'mk.jee', hiringManager: '배현업', department: '보안운영팀', orgLevel2: '정보보안', openedAt: '2026-06-14' },
  // PR
  { id: 'JOB-018', title: 'PR 커뮤니케이션 담당자', category: '스태프', employeeType: '정규직', status: '진행중', recruiter: 'elena.62', hiringManager: '권현업', department: 'PR팀', orgLevel2: 'PR', openedAt: '2026-06-30' },
  // 전사이니셔티브
  { id: 'JOB-019', title: '전략기획 담당자', category: '스태프', employeeType: '정규직', status: '진행중', recruiter: 'zoe.parc', hiringManager: '전현업', department: '전사전략팀', orgLevel2: '전사이니셔티브', openedAt: '2026-07-01' },
  // AXZ TF
  { id: 'JOB-020', title: '풀스택 개발자 (TF)', category: '테크', employeeType: '전문계약직', status: '진행중', recruiter: 'rosy.lee', hiringManager: '차현업', department: 'AXZ개발팀', orgLevel2: 'AXZ TF', openedAt: '2026-06-16' },
  // 게임컨버젼스 TF
  { id: 'JOB-021', title: '게임 서버 개발자', category: '테크', employeeType: '정규직', status: '진행중', recruiter: 'mk.jee', hiringManager: '민현업', department: '게임서버팀', orgLevel2: '게임컨버젼스 TF', openedAt: '2026-06-19' },
  // 소셜임팩트
  { id: 'JOB-022', title: 'CSR 프로그램 매니저', category: '스태프', employeeType: '정규직', status: '진행중', recruiter: 'zoe.parc', hiringManager: '심현업', department: '사회공헌팀', orgLevel2: '소셜임팩트', openedAt: '2026-07-02' },
  // PA
  { id: 'JOB-023', title: '법무 담당자', category: '스태프', employeeType: '정규직', status: '진행중', recruiter: 'zoe.parc', hiringManager: '유현업', department: '법무팀', orgLevel2: 'PA', openedAt: '2026-07-03' },
  // Ep TF
  { id: 'JOB-024', title: 'Android 개발자 (TF)', category: '테크', employeeType: '전문계약직', status: '진행중', recruiter: 'rosy.lee', hiringManager: '안현업', department: 'Ep개발팀', orgLevel2: 'Ep TF', openedAt: '2026-06-23' },
  // RP TF
  { id: 'JOB-025', title: '데이터 분석가 (TF)', category: '테크', employeeType: '전문계약직', status: '진행중', recruiter: 'mk.jee', hiringManager: '오현업', department: 'RP분석팀', orgLevel2: 'RP TF', openedAt: '2026-06-27' },
];

const today = new Date('2026-07-09');

function daysSince(dateStr) {
  const d = new Date(dateStr);
  return Math.floor((today - d) / (1000 * 60 * 60 * 24));
}

export const mockCandidates = [
  // JOB-001 프론트엔드
  { id: 'C001', name: '홍길동', jobId: 'JOB-001', stage: '처우협의', stageEnteredAt: '2026-06-25', hasReferral: false, actionRequired: true, actionType: '처우협의_진행중', note: '연봉 협의 중' },
  { id: 'C002', name: '김민준', jobId: 'JOB-001', stage: '1차 인터뷰', stageEnteredAt: '2026-06-20', hasReferral: true, referrer: '이동료', actionRequired: true, actionType: '인터뷰결과_검토', note: '인터뷰어 결과 입력 완료', scheduledAt: '2026-06-28', interviewers: ['박인터뷰어', '최인터뷰어'] },
  { id: 'C003', name: '이서연', jobId: 'JOB-001', stage: '코딩테스트', stageEnteredAt: '2026-06-15', hasReferral: false, actionRequired: true, actionType: '코딩테스트_예외', note: '3문제 중 2문제 정답 — 현업 합격 희망 입력함' },
  { id: 'C004', name: '박지수', jobId: 'JOB-001', stage: '서류전형', stageEnteredAt: '2026-06-28', hasReferral: false, actionRequired: false },
  { id: 'C005', name: '최현우', jobId: 'JOB-001', stage: '2차 인터뷰', stageEnteredAt: '2026-06-29', hasReferral: false, actionRequired: true, actionType: '인터뷰결과_검토', note: '인터뷰어 결과 입력 완료', scheduledAt: '2026-07-02', interviewers: ['정인터뷰어'] },
  { id: 'C006', name: '유정호', jobId: 'JOB-001', stage: '1차 인터뷰', stageEnteredAt: '2026-07-01', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-10', interviewers: ['박인터뷰어'] },

  // JOB-002 백엔드
  { id: 'C007', name: '정다은', jobId: 'JOB-002', stage: '코딩테스트', stageEnteredAt: '2026-06-10', hasReferral: false, actionRequired: false, note: '테스트 진행 중' },
  { id: 'C008', name: '강민서', jobId: 'JOB-002', stage: '1차 인터뷰', stageEnteredAt: '2026-06-22', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-08', interviewers: ['김인터뷰어'] },
  { id: 'C009', name: '윤재원', jobId: 'JOB-002', stage: '입사확정', stageEnteredAt: '2026-07-01', hasReferral: false, actionRequired: false },
  { id: 'C010', name: '임소희', jobId: 'JOB-002', stage: '서류전형', stageEnteredAt: '2026-07-02', hasReferral: true, referrer: '박동료', actionRequired: false },
  { id: 'C011', name: '권태준', jobId: 'JOB-002', stage: '2차 인터뷰', stageEnteredAt: '2026-07-02', hasReferral: false, actionRequired: true, actionType: '인터뷰결과_검토', note: '결과 대기 중', scheduledAt: '2026-07-05' },
  { id: 'C012', name: '나유진', jobId: 'JOB-002', stage: '처우협의', stageEnteredAt: '2026-07-03', hasReferral: false, actionRequired: true, actionType: '처우협의_진행중', note: '처우 조율 중' },

  // JOB-003 iOS
  { id: 'C013', name: '서지민', jobId: 'JOB-003', stage: '코딩테스트', stageEnteredAt: '2026-06-18', hasReferral: false, actionRequired: true, actionType: '코딩테스트_예외', note: '현업 합격 희망' },
  { id: 'C014', name: '문채원', jobId: 'JOB-003', stage: '서류전형', stageEnteredAt: '2026-07-01', hasReferral: false, actionRequired: false },
  { id: 'C015', name: '노태양', jobId: 'JOB-003', stage: '1차 인터뷰', stageEnteredAt: '2026-06-28', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-09' },
  { id: 'C016', name: '하준혁', jobId: 'JOB-003', stage: '2차 인터뷰', stageEnteredAt: '2026-07-04', hasReferral: true, referrer: '김동료', actionRequired: true, actionType: '인터뷰결과_검토', note: '면접 완료', scheduledAt: '2026-07-06' },

  // JOB-004 데이터 엔지니어
  { id: 'C017', name: '구본준', jobId: 'JOB-004', stage: '서류전형', stageEnteredAt: '2026-06-28', hasReferral: false, actionRequired: false },
  { id: 'C018', name: '변수현', jobId: 'JOB-004', stage: '코딩테스트', stageEnteredAt: '2026-07-02', hasReferral: false, actionRequired: false },
  { id: 'C019', name: '성민재', jobId: 'JOB-004', stage: '1차 인터뷰', stageEnteredAt: '2026-07-05', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-11' },

  // JOB-005 ML 엔지니어
  { id: 'C020', name: '오지훈', jobId: 'JOB-005', stage: '코딩테스트', stageEnteredAt: '2026-05-28', hasReferral: false, actionRequired: true, actionType: '코딩테스트_예외', note: '테스트 예외 요청' },
  { id: 'C021', name: '신예진', jobId: 'JOB-005', stage: '2차 인터뷰', stageEnteredAt: '2026-06-30', hasReferral: false, actionRequired: true, actionType: '인터뷰결과_검토', note: '결과 입력 완료', scheduledAt: '2026-07-03' },
  { id: 'C022', name: '한승우', jobId: 'JOB-005', stage: '사전인터뷰', stageEnteredAt: '2026-06-25', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-09' },
  { id: 'C023', name: '이채민', jobId: 'JOB-005', stage: '1차 인터뷰', stageEnteredAt: '2026-07-02', hasReferral: false, actionRequired: false },
  { id: 'C024', name: '표나래', jobId: 'JOB-005', stage: '처우협의', stageEnteredAt: '2026-07-05', hasReferral: false, actionRequired: true, actionType: '처우협의_진행중', note: '연봉 확인 중' },

  // JOB-006 AI Research Scientist
  { id: 'C025', name: '배나연', jobId: 'JOB-006', stage: '서류전형', stageEnteredAt: '2026-06-10', hasReferral: false, actionRequired: false },
  { id: 'C026', name: '조민호', jobId: 'JOB-006', stage: '사전인터뷰', stageEnteredAt: '2026-06-20', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-08' },
  { id: 'C027', name: '전민아', jobId: 'JOB-006', stage: '1차 인터뷰', stageEnteredAt: '2026-06-28', hasReferral: true, referrer: '연구소동료', actionRequired: true, actionType: '인터뷰결과_검토', note: '결과 입력 완료', scheduledAt: '2026-07-01' },
  { id: 'C028', name: '류하은', jobId: 'JOB-006', stage: '코딩테스트', stageEnteredAt: '2026-07-01', hasReferral: false, actionRequired: false },

  // JOB-007 LLM 파인튜닝
  { id: 'C029', name: '황도현', jobId: 'JOB-007', stage: '서류전형', stageEnteredAt: '2026-06-20', hasReferral: false, actionRequired: false },
  { id: 'C030', name: '장수연', jobId: 'JOB-007', stage: '코딩테스트', stageEnteredAt: '2026-06-28', hasReferral: false, actionRequired: false },
  { id: 'C031', name: '마지훈', jobId: 'JOB-007', stage: '1차 인터뷰', stageEnteredAt: '2026-07-04', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-10' },

  // JOB-008 UX 디자이너
  { id: 'C032', name: '고은비', jobId: 'JOB-008', stage: '과제전형', stageEnteredAt: '2026-06-18', hasReferral: false, actionRequired: true, actionType: '과제전형_검토', note: '현업 의견 도착 — 검토 필요' },
  { id: 'C033', name: '도현준', jobId: 'JOB-008', stage: '2차 인터뷰', stageEnteredAt: '2026-06-30', hasReferral: false, actionRequired: true, actionType: '인터뷰결과_검토', note: '결과 입력 완료', scheduledAt: '2026-07-03' },
  { id: 'C034', name: '모지원', jobId: 'JOB-008', stage: '사전인터뷰', stageEnteredAt: '2026-06-25', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-09' },
  { id: 'C035', name: '봉민서', jobId: 'JOB-008', stage: '서류전형', stageEnteredAt: '2026-07-05', hasReferral: false, actionRequired: false },

  // JOB-009 브랜드 디자이너
  { id: 'C036', name: '석예린', jobId: 'JOB-009', stage: '과제전형', stageEnteredAt: '2026-07-01', hasReferral: false, actionRequired: false },
  { id: 'C037', name: '소지현', jobId: 'JOB-009', stage: '1차 인터뷰', stageEnteredAt: '2026-07-05', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-11' },

  // JOB-010 영업 매니저
  { id: 'C038', name: '신재훈', jobId: 'JOB-010', stage: '처우협의', stageEnteredAt: '2026-06-28', hasReferral: false, actionRequired: true, actionType: '처우협의_진행중', note: '처우 조율 중' },
  { id: 'C039', name: '안하늘', jobId: 'JOB-010', stage: '1차 인터뷰', stageEnteredAt: '2026-07-01', hasReferral: true, referrer: '최동료', actionRequired: false },
  { id: 'C040', name: '엄기태', jobId: 'JOB-010', stage: '사전인터뷰', stageEnteredAt: '2026-07-05', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-10' },

  // JOB-011 파트너십 매니저
  { id: 'C041', name: '여승현', jobId: 'JOB-011', stage: '서류전형', stageEnteredAt: '2026-07-01', hasReferral: false, actionRequired: false },
  { id: 'C042', name: '오다연', jobId: 'JOB-011', stage: '사전인터뷰', stageEnteredAt: '2026-07-05', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-12' },

  // JOB-012 서비스 기획자
  { id: 'C043', name: '우진혁', jobId: 'JOB-012', stage: '1차 인터뷰', stageEnteredAt: '2026-06-26', hasReferral: false, actionRequired: true, actionType: '인터뷰결과_검토', note: '결과 입력 완료', scheduledAt: '2026-07-01' },
  { id: 'C044', name: '원소영', jobId: 'JOB-012', stage: '서류전형', stageEnteredAt: '2026-06-29', hasReferral: false, actionRequired: false },
  { id: 'C045', name: '위재민', jobId: 'JOB-012', stage: '2차 인터뷰', stageEnteredAt: '2026-07-04', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-10' },
  { id: 'C046', name: '유채영', jobId: 'JOB-012', stage: '처우협의', stageEnteredAt: '2026-07-06', hasReferral: false, actionRequired: true, actionType: '처우협의_진행중', note: '처우 조율 중' },

  // JOB-013 채널 운영
  { id: 'C047', name: '이건우', jobId: 'JOB-013', stage: '서류전형', stageEnteredAt: '2026-07-03', hasReferral: false, actionRequired: false },
  { id: 'C048', name: '임나현', jobId: 'JOB-013', stage: '사전인터뷰', stageEnteredAt: '2026-07-06', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-11' },

  // JOB-014 브랜드 마케터
  { id: 'C049', name: '장예준', jobId: 'JOB-014', stage: '서류전형', stageEnteredAt: '2026-06-22', hasReferral: false, actionRequired: false },
  { id: 'C050', name: '전지수', jobId: 'JOB-014', stage: '1차 인터뷰', stageEnteredAt: '2026-07-02', hasReferral: true, referrer: '마케팅동료', actionRequired: true, actionType: '인터뷰결과_검토', note: '결과 입력 완료', scheduledAt: '2026-07-05' },
  { id: 'C051', name: '조하람', jobId: 'JOB-014', stage: '2차 인터뷰', stageEnteredAt: '2026-07-06', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-11' },

  // JOB-015 인사 담당자
  { id: 'C052', name: '주민지', jobId: 'JOB-015', stage: '사전인터뷰', stageEnteredAt: '2026-06-26', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-08' },
  { id: 'C053', name: '지성준', jobId: 'JOB-015', stage: '1차 인터뷰', stageEnteredAt: '2026-07-02', hasReferral: false, actionRequired: true, actionType: '인터뷰결과_검토', note: '결과 입력 완료', scheduledAt: '2026-07-05' },
  { id: 'C054', name: '차유리', jobId: 'JOB-015', stage: '서류전형', stageEnteredAt: '2026-07-05', hasReferral: false, actionRequired: false },

  // JOB-016 재무회계
  { id: 'C055', name: '최준영', jobId: 'JOB-016', stage: '서류전형', stageEnteredAt: '2026-07-01', hasReferral: false, actionRequired: false },
  { id: 'C056', name: '추연서', jobId: 'JOB-016', stage: '사전인터뷰', stageEnteredAt: '2026-07-05', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-12' },

  // JOB-017 정보보안
  { id: 'C057', name: '탁재원', jobId: 'JOB-017', stage: '코딩테스트', stageEnteredAt: '2026-06-25', hasReferral: false, actionRequired: false },
  { id: 'C058', name: '편나영', jobId: 'JOB-017', stage: '1차 인터뷰', stageEnteredAt: '2026-07-02', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-09' },
  { id: 'C059', name: '하재현', jobId: 'JOB-017', stage: '서류전형', stageEnteredAt: '2026-07-06', hasReferral: false, actionRequired: false },

  // JOB-018 PR
  { id: 'C060', name: '함소율', jobId: 'JOB-018', stage: '서류전형', stageEnteredAt: '2026-07-03', hasReferral: false, actionRequired: false },
  { id: 'C061', name: '허민준', jobId: 'JOB-018', stage: '사전인터뷰', stageEnteredAt: '2026-07-07', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-12' },

  // JOB-019 전략기획
  { id: 'C062', name: '홍예원', jobId: 'JOB-019', stage: '서류전형', stageEnteredAt: '2026-07-04', hasReferral: false, actionRequired: false },
  { id: 'C063', name: '황지호', jobId: 'JOB-019', stage: '사전인터뷰', stageEnteredAt: '2026-07-07', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-14' },

  // JOB-020 AXZ TF
  { id: 'C064', name: '강다원', jobId: 'JOB-020', stage: '코딩테스트', stageEnteredAt: '2026-06-26', hasReferral: false, actionRequired: true, actionType: '코딩테스트_예외', note: '현업 요청 통과' },
  { id: 'C065', name: '고민재', jobId: 'JOB-020', stage: '1차 인터뷰', stageEnteredAt: '2026-07-03', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-10' },
  { id: 'C066', name: '기수현', jobId: 'JOB-020', stage: '서류전형', stageEnteredAt: '2026-07-07', hasReferral: false, actionRequired: false },

  // JOB-021 게임컨버젼스 TF
  { id: 'C067', name: '남지원', jobId: 'JOB-021', stage: '코딩테스트', stageEnteredAt: '2026-06-28', hasReferral: false, actionRequired: false },
  { id: 'C068', name: '노은서', jobId: 'JOB-021', stage: '1차 인터뷰', stageEnteredAt: '2026-07-04', hasReferral: false, actionRequired: true, actionType: '인터뷰결과_검토', note: '결과 입력 완료', scheduledAt: '2026-07-07' },
  { id: 'C069', name: '도승민', jobId: 'JOB-021', stage: '서류전형', stageEnteredAt: '2026-07-06', hasReferral: false, actionRequired: false },

  // JOB-022 소셜임팩트
  { id: 'C070', name: '마은지', jobId: 'JOB-022', stage: '서류전형', stageEnteredAt: '2026-07-04', hasReferral: false, actionRequired: false },
  { id: 'C071', name: '명준혁', jobId: 'JOB-022', stage: '사전인터뷰', stageEnteredAt: '2026-07-07', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-14' },

  // JOB-023 PA 법무
  { id: 'C072', name: '목지은', jobId: 'JOB-023', stage: '서류전형', stageEnteredAt: '2026-07-05', hasReferral: false, actionRequired: false },
  { id: 'C073', name: '민서준', jobId: 'JOB-023', stage: '사전인터뷰', stageEnteredAt: '2026-07-07', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-15' },

  // JOB-024 Ep TF Android
  { id: 'C074', name: '박도현', jobId: 'JOB-024', stage: '코딩테스트', stageEnteredAt: '2026-07-01', hasReferral: false, actionRequired: false },
  { id: 'C075', name: '배수아', jobId: 'JOB-024', stage: '1차 인터뷰', stageEnteredAt: '2026-07-05', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-11' },

  // JOB-025 RP TF 데이터 분석가
  { id: 'C076', name: '서민경', jobId: 'JOB-025', stage: '서류전형', stageEnteredAt: '2026-07-02', hasReferral: false, actionRequired: false },
  { id: 'C077', name: '선재원', jobId: 'JOB-025', stage: '코딩테스트', stageEnteredAt: '2026-07-06', hasReferral: false, actionRequired: false },
  { id: 'C078', name: '설지민', jobId: 'JOB-025', stage: '1차 인터뷰', stageEnteredAt: '2026-07-07', hasReferral: false, actionRequired: false, scheduledAt: '2026-07-14' },
];

export const mockStageHistory = {
  'JOB-001': {
    '서류전형':  { count: 42, avgDays: null },
    '코딩테스트': { count: 28, avgDays: 4 },
    '과제전형':  { count: 0,  avgDays: null },
    '사전인터뷰': { count: 0,  avgDays: null },
    '1차 인터뷰': { count: 14, avgDays: 6 },
    '2차 인터뷰': { count: 8,  avgDays: 5 },
    '처우협의':  { count: 3,  avgDays: 7 },
    '입사확정':  { count: 1,  avgDays: 4 },
  },
  'JOB-002': {
    '서류전형':  { count: 38, avgDays: null },
    '코딩테스트': { count: 22, avgDays: 3 },
    '과제전형':  { count: 0,  avgDays: null },
    '사전인터뷰': { count: 0,  avgDays: null },
    '1차 인터뷰': { count: 11, avgDays: 8 },
    '2차 인터뷰': { count: 5,  avgDays: 6 },
    '처우협의':  { count: 2,  avgDays: 9 },
    '입사확정':  { count: 1,  avgDays: 3 },
  },
  'JOB-003': {
    '서류전형':  { count: 31, avgDays: null },
    '코딩테스트': { count: 20, avgDays: 5 },
    '과제전형':  { count: 0,  avgDays: null },
    '사전인터뷰': { count: 0,  avgDays: null },
    '1차 인터뷰': { count: 10, avgDays: 7 },
    '2차 인터뷰': { count: 4,  avgDays: 5 },
    '처우협의':  { count: 1,  avgDays: 8 },
    '입사확정':  { count: 0,  avgDays: null },
  },
  'JOB-004': {
    '서류전형':  { count: 27, avgDays: null },
    '코딩테스트': { count: 16, avgDays: 4 },
    '과제전형':  { count: 0,  avgDays: null },
    '사전인터뷰': { count: 0,  avgDays: null },
    '1차 인터뷰': { count: 8,  avgDays: 6 },
    '2차 인터뷰': { count: 3,  avgDays: 7 },
    '처우협의':  { count: 1,  avgDays: 5 },
    '입사확정':  { count: 0,  avgDays: null },
  },
  'JOB-005': {
    '서류전형':  { count: 55, avgDays: null },
    '코딩테스트': { count: 32, avgDays: 5 },
    '과제전형':  { count: 0,  avgDays: null },
    '사전인터뷰': { count: 18, avgDays: 6 },
    '1차 인터뷰': { count: 10, avgDays: 8 },
    '2차 인터뷰': { count: 5,  avgDays: 7 },
    '처우협의':  { count: 2,  avgDays: 9 },
    '입사확정':  { count: 0,  avgDays: null },
  },
  'JOB-006': {
    '서류전형':  { count: 48, avgDays: null },
    '코딩테스트': { count: 25, avgDays: 6 },
    '과제전형':  { count: 0,  avgDays: null },
    '사전인터뷰': { count: 14, avgDays: 7 },
    '1차 인터뷰': { count: 7,  avgDays: 9 },
    '2차 인터뷰': { count: 3,  avgDays: 8 },
    '처우협의':  { count: 1,  avgDays: 10 },
    '입사확정':  { count: 0,  avgDays: null },
  },
  'JOB-007': {
    '서류전형':  { count: 35, avgDays: null },
    '코딩테스트': { count: 20, avgDays: 4 },
    '과제전형':  { count: 0,  avgDays: null },
    '사전인터뷰': { count: 0,  avgDays: null },
    '1차 인터뷰': { count: 9,  avgDays: 7 },
    '2차 인터뷰': { count: 3,  avgDays: 6 },
    '처우협의':  { count: 0,  avgDays: null },
    '입사확정':  { count: 0,  avgDays: null },
  },
  'JOB-008': {
    '서류전형':  { count: 31, avgDays: null },
    '코딩테스트': { count: 0,  avgDays: null },
    '과제전형':  { count: 12, avgDays: 10 },
    '사전인터뷰': { count: 18, avgDays: 5 },
    '1차 인터뷰': { count: 8,  avgDays: 7 },
    '2차 인터뷰': { count: 4,  avgDays: 6 },
    '처우협의':  { count: 2,  avgDays: 8 },
    '입사확정':  { count: 0,  avgDays: null },
  },
  'JOB-009': {
    '서류전형':  { count: 22, avgDays: null },
    '코딩테스트': { count: 0,  avgDays: null },
    '과제전형':  { count: 10, avgDays: 9 },
    '사전인터뷰': { count: 0,  avgDays: null },
    '1차 인터뷰': { count: 6,  avgDays: 6 },
    '2차 인터뷰': { count: 2,  avgDays: 5 },
    '처우협의':  { count: 0,  avgDays: null },
    '입사확정':  { count: 0,  avgDays: null },
  },
  'JOB-010': {
    '서류전형':  { count: 19, avgDays: null },
    '코딩테스트': { count: 0,  avgDays: null },
    '과제전형':  { count: 0,  avgDays: null },
    '사전인터뷰': { count: 11, avgDays: 3 },
    '1차 인터뷰': { count: 7,  avgDays: 6 },
    '2차 인터뷰': { count: 3,  avgDays: 5 },
    '처우협의':  { count: 2,  avgDays: 11 },
    '입사확정':  { count: 0,  avgDays: null },
  },
  'JOB-011': {
    '서류전형':  { count: 15, avgDays: null },
    '코딩테스트': { count: 0,  avgDays: null },
    '과제전형':  { count: 0,  avgDays: null },
    '사전인터뷰': { count: 8,  avgDays: 4 },
    '1차 인터뷰': { count: 4,  avgDays: 5 },
    '2차 인터뷰': { count: 1,  avgDays: 6 },
    '처우협의':  { count: 0,  avgDays: null },
    '입사확정':  { count: 0,  avgDays: null },
  },
  'JOB-012': {
    '서류전형':  { count: 24, avgDays: null },
    '코딩테스트': { count: 0,  avgDays: null },
    '과제전형':  { count: 0,  avgDays: null },
    '사전인터뷰': { count: 14, avgDays: 4 },
    '1차 인터뷰': { count: 9,  avgDays: 5 },
    '2차 인터뷰': { count: 4,  avgDays: 7 },
    '처우협의':  { count: 2,  avgDays: 6 },
    '입사확정':  { count: 0,  avgDays: null },
  },
  'JOB-013': {
    '서류전형':  { count: 14, avgDays: null },
    '코딩테스트': { count: 0,  avgDays: null },
    '과제전형':  { count: 0,  avgDays: null },
    '사전인터뷰': { count: 7,  avgDays: 3 },
    '1차 인터뷰': { count: 3,  avgDays: 5 },
    '2차 인터뷰': { count: 1,  avgDays: 4 },
    '처우협의':  { count: 0,  avgDays: null },
    '입사확정':  { count: 0,  avgDays: null },
  },
  'JOB-014': {
    '서류전형':  { count: 20, avgDays: null },
    '코딩테스트': { count: 0,  avgDays: null },
    '과제전형':  { count: 8,  avgDays: 8 },
    '사전인터뷰': { count: 0,  avgDays: null },
    '1차 인터뷰': { count: 6,  avgDays: 6 },
    '2차 인터뷰': { count: 3,  avgDays: 5 },
    '처우협의':  { count: 1,  avgDays: 7 },
    '입사확정':  { count: 0,  avgDays: null },
  },
  'JOB-015': {
    '서류전형':  { count: 18, avgDays: null },
    '코딩테스트': { count: 0,  avgDays: null },
    '과제전형':  { count: 0,  avgDays: null },
    '사전인터뷰': { count: 10, avgDays: 4 },
    '1차 인터뷰': { count: 6,  avgDays: 5 },
    '2차 인터뷰': { count: 2,  avgDays: 6 },
    '처우협의':  { count: 0,  avgDays: null },
    '입사확정':  { count: 0,  avgDays: null },
  },
  'JOB-016': {
    '서류전형':  { count: 16, avgDays: null },
    '코딩테스트': { count: 0,  avgDays: null },
    '과제전형':  { count: 0,  avgDays: null },
    '사전인터뷰': { count: 9,  avgDays: 3 },
    '1차 인터뷰': { count: 4,  avgDays: 5 },
    '2차 인터뷰': { count: 1,  avgDays: 7 },
    '처우협의':  { count: 0,  avgDays: null },
    '입사확정':  { count: 0,  avgDays: null },
  },
  'JOB-017': {
    '서류전형':  { count: 22, avgDays: null },
    '코딩테스트': { count: 13, avgDays: 5 },
    '과제전형':  { count: 0,  avgDays: null },
    '사전인터뷰': { count: 0,  avgDays: null },
    '1차 인터뷰': { count: 7,  avgDays: 6 },
    '2차 인터뷰': { count: 3,  avgDays: 5 },
    '처우협의':  { count: 1,  avgDays: 8 },
    '입사확정':  { count: 0,  avgDays: null },
  },
  'JOB-018': {
    '서류전형':  { count: 12, avgDays: null },
    '코딩테스트': { count: 0,  avgDays: null },
    '과제전형':  { count: 0,  avgDays: null },
    '사전인터뷰': { count: 6,  avgDays: 4 },
    '1차 인터뷰': { count: 3,  avgDays: 5 },
    '2차 인터뷰': { count: 1,  avgDays: 6 },
    '처우협의':  { count: 0,  avgDays: null },
    '입사확정':  { count: 0,  avgDays: null },
  },
  'JOB-019': {
    '서류전형':  { count: 10, avgDays: null },
    '코딩테스트': { count: 0,  avgDays: null },
    '과제전형':  { count: 0,  avgDays: null },
    '사전인터뷰': { count: 5,  avgDays: 3 },
    '1차 인터뷰': { count: 2,  avgDays: 6 },
    '2차 인터뷰': { count: 0,  avgDays: null },
    '처우협의':  { count: 0,  avgDays: null },
    '입사확정':  { count: 0,  avgDays: null },
  },
  'JOB-020': {
    '서류전형':  { count: 18, avgDays: null },
    '코딩테스트': { count: 11, avgDays: 4 },
    '과제전형':  { count: 0,  avgDays: null },
    '사전인터뷰': { count: 0,  avgDays: null },
    '1차 인터뷰': { count: 5,  avgDays: 7 },
    '2차 인터뷰': { count: 2,  avgDays: 5 },
    '처우협의':  { count: 0,  avgDays: null },
    '입사확정':  { count: 0,  avgDays: null },
  },
  'JOB-021': {
    '서류전형':  { count: 25, avgDays: null },
    '코딩테스트': { count: 15, avgDays: 5 },
    '과제전형':  { count: 0,  avgDays: null },
    '사전인터뷰': { count: 0,  avgDays: null },
    '1차 인터뷰': { count: 7,  avgDays: 6 },
    '2차 인터뷰': { count: 3,  avgDays: 5 },
    '처우협의':  { count: 1,  avgDays: 9 },
    '입사확정':  { count: 0,  avgDays: null },
  },
  'JOB-022': {
    '서류전형':  { count: 11, avgDays: null },
    '코딩테스트': { count: 0,  avgDays: null },
    '과제전형':  { count: 0,  avgDays: null },
    '사전인터뷰': { count: 6,  avgDays: 4 },
    '1차 인터뷰': { count: 3,  avgDays: 5 },
    '2차 인터뷰': { count: 1,  avgDays: 6 },
    '처우협의':  { count: 0,  avgDays: null },
    '입사확정':  { count: 0,  avgDays: null },
  },
  'JOB-023': {
    '서류전형':  { count: 9, avgDays: null },
    '코딩테스트': { count: 0, avgDays: null },
    '과제전형':  { count: 0, avgDays: null },
    '사전인터뷰': { count: 4, avgDays: 5 },
    '1차 인터뷰': { count: 2, avgDays: 6 },
    '2차 인터뷰': { count: 0, avgDays: null },
    '처우협의':  { count: 0, avgDays: null },
    '입사확정':  { count: 0, avgDays: null },
  },
  'JOB-024': {
    '서류전형':  { count: 20, avgDays: null },
    '코딩테스트': { count: 12, avgDays: 4 },
    '과제전형':  { count: 0,  avgDays: null },
    '사전인터뷰': { count: 0,  avgDays: null },
    '1차 인터뷰': { count: 5,  avgDays: 7 },
    '2차 인터뷰': { count: 2,  avgDays: 6 },
    '처우협의':  { count: 0,  avgDays: null },
    '입사확정':  { count: 0,  avgDays: null },
  },
  'JOB-025': {
    '서류전형':  { count: 17, avgDays: null },
    '코딩테스트': { count: 10, avgDays: 3 },
    '과제전형':  { count: 0,  avgDays: null },
    '사전인터뷰': { count: 0,  avgDays: null },
    '1차 인터뷰': { count: 4,  avgDays: 6 },
    '2차 인터뷰': { count: 1,  avgDays: 5 },
    '처우협의':  { count: 0,  avgDays: null },
    '입사확정':  { count: 0,  avgDays: null },
  },
};

export const ACTION_TYPE_LABELS = {
  '코딩테스트_예외': '코딩테스트 보류',
  '과제전형_검토': '과제전형 결과 확정',
  '인터뷰결과_검토': '인터뷰 결과 검토',
  '처우협의_진행중': '처우협의 진행',
  '입사확정_처리': '입사확정 처리',
};

export const ACTION_TYPE_COLORS = {
  '코딩테스트_예외': '#e65c00',
  '과제전형_검토': '#7b5ea7',
  '인터뷰결과_검토': '#1a6b9a',
  '처우협의_진행중': '#2e7d32',
  '입사확정_처리': '#b71c1c',
};

export const BOTTLENECK_THRESHOLD = {
  '서류전형': 14,
  '코딩테스트': 14,
  '사전인터뷰': 14,
  '과제전형': 14,
  '1차 인터뷰': 14,
  '2차 인터뷰': 14,
  '처우협의': 14,
  '입사확정': 14,
};

export function getDaysInStage(candidate) {
  return daysSince(candidate.stageEnteredAt);
}

export function isBottleneck(candidate) {
  const days = getDaysInStage(candidate);
  const threshold = BOTTLENECK_THRESHOLD[candidate.stage] || 14;
  return days >= threshold;
}
