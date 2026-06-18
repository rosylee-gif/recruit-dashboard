import { useState, useEffect, useRef, useMemo } from "react";
import {
  LayoutDashboard, Megaphone, Users, CalendarDays, FileText,
  Settings, Star, Bell, ChevronDown, Search, X,
  TrendingUp, TrendingDown, AlertCircle,
  ChevronRight, CheckCircle2, Circle,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS & STATIC CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const STAGE_FILTERS = {
  docs:  ["전체", "진행중", "합격", "포기", "탈락", "스킵"],
  rec:   ["전체", "진행중", "작성완료"],
  code:  ["전체", "진행중", "포기", "탈락", "보류", "합격", "스킵", "평가필요"],
  task:  ["전체", "진행중", "포기", "탈락", "합격"],
  pre:   ["전체", "진행중", "포기", "탈락", "합격", "스킵"],
  int1:  ["전체", "진행중", "포기", "탈락", "합격", "스킵"],
  int2:  ["전체", "진행중", "포기", "탈락", "합격", "스킵"],
  ref:   ["전체", "진행중", "완료", "스킵"],
  offer: ["전체", "진행중", "수락", "포기", "제안"],
  final: ["전체", "추가정보 입력중", "입사확정"],
};

const HEADER_FILTERS = [
  { key: "직군",     label: "전체 직군",     options: ["전체", "테크", "디자인", "서비스비즈", "스태프"] },
  { key: "상태",     label: "전체 상태",     options: ["전체", "대기중", "진행중", "완료", "취소"] },
  { key: "담당자",   label: "전체 담당자",   options: ["전체", "rosy.lee", "elena.62", "jamie.bk", "mk.jee", "zoe.parc"] },
  { key: "직원유형", label: "전체 직원유형", options: ["전체", "정규직", "계약직", "인턴", "어시스턴트", "경영계약직", "전문계약직"] },
];

const STAGE_GROUPS = {
  전체: ["docs","rec","code","task","pre","int1","int2","ref","offer","final"],
  "인터뷰 전": ["docs","rec","code","task"],
  인터뷰: ["pre","int1","int2"],
  "인터뷰 후": ["ref","offer","final"],
};

const LANDING_PRESETS = [
  { key:"all", label:"전체 공고", filters:{ 직군:"전체", 상태:"전체", 담당자:"전체", 직원유형:"전체", searchJob:"", searchCandidate:"", searchDept:"" } },
  { key:"mine", label:"내 담당 공고", filters:{ 직군:"전체", 상태:"전체", 담당자:"rosy.lee", 직원유형:"전체", searchJob:"", searchCandidate:"", searchDept:"" } },
];

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "대시보드" },
  { icon: CheckCircle2,    label: "사내추천 확인" },
  { icon: FileText,        label: "등록요청", href: "https://elena62-del.github.io/jd-mockup/" },
  { icon: TrendingUp,      label: "전형 확인/평가" },
  { icon: Users,           label: "영입 관리" },
  { icon: Megaphone,       label: "공채 관리" },
  { icon: Settings,        label: "시스템 관리" },
  { icon: FileText,        label: "메인페이지 관리" },
  { icon: Search,          label: "입사예정자조회" },
  { icon: TrendingUp,      label: "연봉담당자" },
  { icon: FileText,        label: "리포트" },
  { icon: Settings,        label: "Admin" },
];

const ACTION_TAGS = ["전체", "처우 협의", "인터뷰 결과", "과제제출 리마인드", "코딩테스트", "피드백", "레퍼런스 체크"];

const urgencyStyle = (u) => ({
  "높음": { bg: "#FEE2E2", color: "#DC2626" },
  "중간": { bg: "#FEF9C3", color: "#CA8A04" },
  "낮음": { bg: "#F0FDF4", color: "#16A34A" },
}[u] || { bg: "#F3F4F6", color: "#6B7280" });

const statusStyle = (s) => ({
  "진행중":  { bg: "#EFF6FF", color: "#2563EB" },
  "대기중":  { bg: "#F3F4F6", color: "#6B7280" },
  "완료":    { bg: "#F0FDF4", color: "#16A34A" },
  "취소":    { bg: "#FEF2F2", color: "#DC2626" },
}[s] || { bg: "#F3F4F6", color: "#6B7280" });

// ─────────────────────────────────────────────────────────────────────────────
// 2. RICH MOCK DATA  (직군 / 상태 / 담당자 / 직원유형 / 부서 골고루 분산)
// ─────────────────────────────────────────────────────────────────────────────

// 2-A. Candidates — each has: jobTitle, 직군, 담당자, 직원유형, 부서, 상태(채용전형상태)
const ALL_CANDIDATES = [
  // ── 서류평가 ─────────────────────────────────────────────
  { id:1,  name:"김지현",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"docs",  stageStatus:"진행중",  days:14, alert:true,  공고id:1 },
  { id:2,  name:"이상혁",  jobTitle:"Product Manager",        직군:"서비스비즈", 담당자:"elena.62",  직원유형:"정규직",    부서:"Product",     stage:"docs",  stageStatus:"진행중",  days:3,  alert:false, 공고id:6 },
  { id:3,  name:"박민준",  jobTitle:"Data Analyst",           직군:"테크",      담당자:"jamie.bk",  직원유형:"계약직",    부서:"Data",        stage:"docs",  stageStatus:"합격",    days:1,  alert:false, 공고id:4 },
  { id:22, name:"강서준",  jobTitle:"iOS Engineer",           직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"docs",  stageStatus:"진행중",  days:5,  alert:false, 공고id:1 },
  { id:23, name:"윤하린",  jobTitle:"서비스 기획자",           직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"정규직",    부서:"Strategy",    stage:"docs",  stageStatus:"탈락",    days:8,  alert:true,  공고id:7 },
  { id:24, name:"백승호",  jobTitle:"Visual Designer",        직군:"디자인",    담당자:"elena.62",  직원유형:"인턴",      부서:"Design",      stage:"docs",  stageStatus:"진행중",  days:2,  alert:false, 공고id:3 },
  { id:25, name:"임채원",  jobTitle:"Business Development",   직군:"스태프",    담당자:"zoe.parc",  직원유형:"경영계약직", 부서:"Biz",         stage:"docs",  stageStatus:"진행중",  days:4,  alert:false, 공고id:8 },
  { id:26, name:"문지호",  jobTitle:"Frontend Engineer",      직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"docs",  stageStatus:"스킵",    days:6,  alert:false, 공고id:2 },
  // ── 추천서 작성 ───────────────────────────────────────────
  { id:4,  name:"최유빈",  jobTitle:"Product Designer",       직군:"디자인",    담당자:"elena.62",  직원유형:"정규직",    부서:"Design",      stage:"rec",   stageStatus:"진행중",  recommended:true, 공고id:3 },
  { id:5,  name:"정현우",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"rec",   stageStatus:"작성완료", recommended:true, 공고id:1 },
  { id:27, name:"송나연",  jobTitle:"UX Researcher",          직군:"디자인",    담당자:"elena.62",  직원유형:"계약직",    부서:"Design",      stage:"rec",   stageStatus:"진행중",  recommended:true, 공고id:3 },
  { id:28, name:"류태민",  jobTitle:"DevOps Engineer",        직군:"테크",      담당자:"jamie.bk",  직원유형:"전문계약직", 부서:"Infra",       stage:"rec",   stageStatus:"작성완료", recommended:true, 공고id:5 },
  // ── 코딩테스트 ───────────────────────────────────────────
  { id:6,  name:"오준석",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"code",  stageStatus:"진행중",  days:7, alert:true,  공고id:1 },
  { id:7,  name:"배소영",  jobTitle:"Frontend Engineer",      직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"code",  stageStatus:"평가필요", days:3, alert:true,  공고id:2 },
  { id:29, name:"한동혁",  jobTitle:"iOS Engineer",           직군:"테크",      담당자:"jamie.bk",  직원유형:"정규직",    부서:"Mobile",      stage:"code",  stageStatus:"보류",    days:2, alert:false, 공고id:9 },
  { id:30, name:"노지영",  jobTitle:"Data Engineer",          직군:"테크",      담당자:"jamie.bk",  직원유형:"계약직",    부서:"Data",        stage:"code",  stageStatus:"탈락",    days:5, alert:false, 공고id:4 },
  // ── 과제전형 ─────────────────────────────────────────────
  { id:8,  name:"이수빈",  jobTitle:"Product Designer",       직군:"디자인",    담당자:"elena.62",  직원유형:"정규직",    부서:"Design",      stage:"task",  stageStatus:"진행중",  days:5, alert:true,  공고id:3 },
  { id:9,  name:"김태연",  jobTitle:"UX Designer",            직군:"디자인",    담당자:"elena.62",  직원유형:"인턴",      부서:"Design",      stage:"task",  stageStatus:"진행중",  days:2, alert:true,  공고id:3 },
  { id:31, name:"구민재",  jobTitle:"서비스 기획자",           직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"정규직",    부서:"Product",     stage:"task",  stageStatus:"합격",    days:0, alert:false, 공고id:7 },
  // ── 사전인터뷰 ───────────────────────────────────────────
  { id:10, name:"이지훈",  jobTitle:"Data Scientist",         직군:"테크",      담당자:"jamie.bk",  직원유형:"정규직",    부서:"Data",        stage:"pre",   stageStatus:"진행중",  days:1, 공고id:4 },
  { id:11, name:"조아라",  jobTitle:"Product Manager",        직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"정규직",    부서:"Product",     stage:"pre",   stageStatus:"합격",    공고id:6 },
  { id:32, name:"심예은",  jobTitle:"Brand Designer",         직군:"디자인",    담당자:"elena.62",  직원유형:"계약직",    부서:"Marketing",   stage:"pre",   stageStatus:"스킵",    공고id:10 },
  // ── 1차 인터뷰 ───────────────────────────────────────────
  { id:12, name:"허인서",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"int1",  stageStatus:"진행중",  dueDate:"5/30 (금)", 공고id:1 },
  { id:13, name:"박성민",  jobTitle:"DevOps Engineer",        직군:"테크",      담당자:"jamie.bk",  직원유형:"전문계약직", 부서:"Infra",       stage:"int1",  stageStatus:"진행중",  dueDate:"5/29 (목)", 공고id:5 },
  { id:33, name:"전혜진",  jobTitle:"Marketing Manager",      직군:"스태프",    담당자:"zoe.parc",  직원유형:"정규직",    부서:"Marketing",   stage:"int1",  stageStatus:"합격",    dueDate:"5/31 (토)", 공고id:10 },
  { id:34, name:"남기준",  jobTitle:"서비스 운영",             직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"어시스턴트", 부서:"Operations",  stage:"int1",  stageStatus:"탈락",    dueDate:"5/28 (수)", 공고id:11 },
  { id:35, name:"황소연",  jobTitle:"Android Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Mobile",      stage:"int1",  stageStatus:"진행중",  dueDate:"6/1 (일)", 공고id:12 },
  // ── 2차 인터뷰 ───────────────────────────────────────────
  { id:14, name:"윤지호",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"int2",  stageStatus:"진행중",  dueDate:"5/28 (수)", 공고id:1 },
  { id:15, name:"장예은",  jobTitle:"Product Manager",        직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"정규직",    부서:"Product",     stage:"int2",  stageStatus:"합격",    dueDate:"5/30 (금)", 공고id:6 },
  { id:36, name:"권도훈",  jobTitle:"Finance Manager",        직군:"스태프",    담당자:"zoe.parc",  직원유형:"경영계약직", 부서:"Finance",     stage:"int2",  stageStatus:"진행중",  dueDate:"5/29 (목)", 공고id:13 },
  // ── 레퍼런스 체크 ─────────────────────────────────────────
  { id:16, name:"김민석",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"ref",   stageStatus:"진행중",  refStatus:"진행 중", 공고id:1 },
  { id:17, name:"임서연",  jobTitle:"Data Scientist",         직군:"테크",      담당자:"jamie.bk",  직원유형:"정규직",    부서:"Data",        stage:"ref",   stageStatus:"완료",    refStatus:"대기 중", 공고id:4 },
  // ── 처우 협의 ─────────────────────────────────────────────
  { id:18, name:"한지민",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"offer", stageStatus:"진행중",  days:7, alert:true, 공고id:1 },
  { id:19, name:"유승현",  jobTitle:"Product Manager",        직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"정규직",    부서:"Product",     stage:"offer", stageStatus:"제안",    days:3, alert:true, 공고id:6 },
  { id:37, name:"차민호",  jobTitle:"ML Engineer",            직군:"테크",      담당자:"jamie.bk",  직원유형:"전문계약직", 부서:"AI",          stage:"offer", stageStatus:"수락",    days:1, alert:false, 공고id:14 },
  // ── 입사예정 ─────────────────────────────────────────────
  { id:20, name:"전우진",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"final", stageStatus:"입사확정",       joinDate:"입사일 6/2", 공고id:1 },
  { id:21, name:"박소연",  jobTitle:"UX Designer",            직군:"디자인",    담당자:"elena.62",  직원유형:"정규직",    부서:"Design",      stage:"final", stageStatus:"추가정보 입력중", joinDate:"입사일 6/1", 공고id:3 },
  { id:38, name:"안혜원",  jobTitle:"HR Business Partner",    직군:"스태프",    담당자:"zoe.parc",  직원유형:"정규직",    부서:"HR",          stage:"final", stageStatus:"입사확정",       joinDate:"입사일 6/5", 공고id:15 },
];

// 2-B. Job postings — 공고명 / 직군 / 담당자 / 직원유형 / 부서 / 상태 분산
const ALL_JOB_POSTINGS = [
  { id:1,  title:"Backend Engineer (Server)",    직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", 상태:"진행중", applied:24, interview:5, offer:2, stale:3, urgency:"높음", deadline:"2024.08.30" },
  { id:2,  title:"Frontend Engineer",            직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", 상태:"진행중", applied:16, interview:3, offer:1, stale:1, urgency:"중간", deadline:"2024.08.15" },
  { id:3,  title:"Product Designer",             직군:"디자인",    담당자:"elena.62",  직원유형:"정규직",    부서:"Design",      상태:"진행중", applied:11, interview:2, offer:1, stale:0, urgency:"높음", deadline:"2024.08.10" },
  { id:4,  title:"Data Scientist",               직군:"테크",      담당자:"jamie.bk",  직원유형:"정규직",    부서:"Data",        상태:"진행중", applied:9,  interview:2, offer:0, stale:1, urgency:"중간", deadline:"2024.08.20" },
  { id:5,  title:"DevOps Engineer",              직군:"테크",      담당자:"jamie.bk",  직원유형:"전문계약직", 부서:"Infra",       상태:"진행중", applied:7,  interview:2, offer:0, stale:2, urgency:"중간", deadline:"2024.08.18" },
  { id:6,  title:"Product Manager",              직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"정규직",    부서:"Product",     상태:"진행중", applied:14, interview:4, offer:2, stale:1, urgency:"높음", deadline:"2024.08.25" },
  { id:7,  title:"서비스 기획자",                직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"정규직",    부서:"Strategy",    상태:"진행중", applied:10, interview:3, offer:1, stale:2, urgency:"중간", deadline:"2024.08.22" },
  { id:8,  title:"Business Development Manager", 직군:"스태프",    담당자:"zoe.parc",  직원유형:"경영계약직", 부서:"Biz",         상태:"진행중", applied:6,  interview:1, offer:0, stale:1, urgency:"낮음", deadline:"2024.09.01" },
  { id:9,  title:"iOS Engineer",                 직군:"테크",      담당자:"jamie.bk",  직원유형:"정규직",    부서:"Mobile",      상태:"대기중", applied:8,  interview:1, offer:0, stale:0, urgency:"중간", deadline:"2024.09.10" },
  { id:10, title:"Marketing Manager",            직군:"스태프",    담당자:"zoe.parc",  직원유형:"정규직",    부서:"Marketing",   상태:"진행중", applied:5,  interview:1, offer:0, stale:1, urgency:"낮음", deadline:"2024.08.05" },
  { id:11, title:"서비스 운영 매니저",            직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"어시스턴트", 부서:"Operations",  상태:"완료",   applied:12, interview:5, offer:2, stale:0, urgency:"낮음", deadline:"2024.07.31" },
  { id:12, title:"Android Engineer",             직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Mobile",      상태:"진행중", applied:9,  interview:2, offer:0, stale:1, urgency:"중간", deadline:"2024.08.28" },
  { id:13, title:"Finance Manager",              직군:"스태프",    담당자:"zoe.parc",  직원유형:"경영계약직", 부서:"Finance",     상태:"진행중", applied:4,  interview:1, offer:0, stale:0, urgency:"낮음", deadline:"2024.09.05" },
  { id:14, title:"ML Engineer",                  직군:"테크",      담당자:"jamie.bk",  직원유형:"전문계약직", 부서:"AI",          상태:"완료",   applied:6,  interview:2, offer:1, stale:0, urgency:"높음", deadline:"2024.07.20" },
  { id:15, title:"HR Business Partner",          직군:"스태프",    담당자:"zoe.parc",  직원유형:"정규직",    부서:"HR",          상태:"취소",   applied:3,  interview:1, offer:0, stale:0, urgency:"낮음", deadline:"2024.08.01" },
  { id:16, title:"UX Researcher",                직군:"디자인",    담당자:"elena.62",  직원유형:"계약직",    부서:"Design",      상태:"대기중", applied:7,  interview:0, offer:0, stale:0, urgency:"낮음", deadline:"2024.09.15" },
  { id:17, title:"Brand Designer",               직군:"디자인",    담당자:"elena.62",  직원유형:"계약직",    부서:"Marketing",   상태:"취소",   applied:5,  interview:1, offer:0, stale:0, urgency:"낮음", deadline:"2024.07.15" },
  { id:18, title:"Data Engineer",                직군:"테크",      담당자:"jamie.bk",  직원유형:"계약직",    부서:"Data",        상태:"대기중", applied:4,  interview:0, offer:0, stale:0, urgency:"낮음", deadline:"2024.09.20" },
];

const ACTION_ITEMS = [
  { id:1, tag:"처우 협의",         tagColor:"#8B5CF6", tagBg:"#F5F3FF", candidateName:"한지민", candidateRole:"Backend Engineer", 부서:"Engineering", action:"처우협의 최신 필요",        urgency:"7일 경과", urgencyColor:"#EF4444" },
  { id:2, tag:"인터뷰 결과",       tagColor:"#3B82F6", tagBg:"#EFF6FF", candidateName:"박성민", candidateRole:"DevOps Engineer",   부서:"Infra",        action:"1차 인터뷰 평가표 미작성",  urgency:"D+6",      urgencyColor:"#F59E0B" },
  { id:3, tag:"코딩테스트",        tagColor:"#10B981", tagBg:"#ECFDF5", candidateName:"오준석", candidateRole:"Backend Engineer",  부서:"Engineering", action:"코딩테스트 리마인드",        urgency:"7일 경과", urgencyColor:"#EF4444" },
  { id:4, tag:"피드백",            tagColor:"#6B7280", tagBg:"#F9FAFB", candidateName:"윤지호", candidateRole:"Backend Engineer",  부서:"Engineering", action:"2차 인터뷰 피드백 작성",     urgency:"D+2",      urgencyColor:"#F59E0B" },
  { id:5, tag:"레퍼런스 체크",     tagColor:"#06B6D4", tagBg:"#ECFEFF", candidateName:"임서연", candidateRole:"Data Scientist",    부서:"Data",         action:"레퍼런스 체크 시작",         urgency:"대기 중",  urgencyColor:"#6B7280" },
  { id:6, tag:"과제제출 리마인드", tagColor:"#F59E0B", tagBg:"#FFFBEB", candidateName:"이수빈", candidateRole:"Product Designer",  부서:"Design",       action:"사진과제 제출 리마인드",     urgency:"3일 경과", urgencyColor:"#EF4444" },
  { id:7, tag:"처우 협의",         tagColor:"#8B5CF6", tagBg:"#F5F3FF", candidateName:"유승현", candidateRole:"Product Manager",   부서:"Product",      action:"처우 협의 서류 제출 요청",   urgency:"D+1",      urgencyColor:"#F59E0B" },
];

const CANDIDATE_DETAIL_TEMPLATE = {
  email:"candidate@email.com", phone:"010-1234-5678",
  school:"서울대학교 컴퓨터공학 석사", career:"4년 경력",
  skills:["Python","Java","AWS","PostgreSQL","Kubernetes"],
  timeline:[
    { date:"05.01", event:"지원서 접수", done:true },
    { date:"05.07", event:"서류 검토 시작", done:true },
    { date:"05.14", event:"현재 진행중", done:false, alert:false },
  ],
  memo:"우수한 기술 역량 보유. 팀 컬처핏 양호. 처우 협의 예정.",
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. KANBAN STAGE DEFINITIONS (layout only — candidates come from ALL_CANDIDATES)
// ─────────────────────────────────────────────────────────────────────────────
const KANBAN_STAGE_DEFS = [
  { id:"docs",  label:"서류평가",    onlyRecommended:false, warnings:[{label:"7일 경과",count:2},{label:"예외 합격필요",count:1}] },
  { id:"rec",   label:"추천서 작성", onlyRecommended:true,  warnings:[] },
  { id:"code",  label:"코딩테스트",  onlyRecommended:false, warnings:[{label:"7일 경과",count:2},{label:"예외 합격필요",count:1}] },
  { id:"task",  label:"과제전형",    onlyRecommended:false, warnings:[{label:"예외 합격필요",count:2}] },
  { id:"pre",   label:"사전인터뷰",  onlyRecommended:false, warnings:[] },
  { id:"int1",  label:"1차 인터뷰",  onlyRecommended:false, warnings:[] },
  { id:"int2",  label:"2차 인터뷰",  onlyRecommended:false, warnings:[] },
  { id:"ref",   label:"레퍼런스 체크", onlyRecommended:false, warnings:[] },
  { id:"offer", label:"처우 협의",   onlyRecommended:false, warnings:[] },
  { id:"final", label:"입사예정",    onlyRecommended:false, warnings:[] },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. SMALL UI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function Avatar({ name, size=28 }) {
  const colors=["#3B82F6","#8B5CF6","#10B981","#F59E0B","#EF4444","#06B6D4"];
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:colors[name.charCodeAt(0)%colors.length], color:"#fff", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.42, fontWeight:600 }}>
      {name.slice(0,1)}
    </div>
  );
}

function Badge({ text, bg, color, small }) {
  return (
    <span style={{ display:"inline-block", padding:small?"1px 6px":"2px 8px", borderRadius:999, fontSize:small?10:11, fontWeight:500, background:bg, color, whiteSpace:"nowrap" }}>
      {text}
    </span>
  );
}

function EmptyState({ message }) {
  return (
    <div style={{ textAlign:"center", padding:"28px 0", color:"#9CA3AF", fontSize:13 }}>
      <div style={{ fontSize:28, marginBottom:8 }}>🔍</div>
      {message}
    </div>
  );
}

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center" }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:12, padding:28, width:520, maxWidth:"90vw", maxHeight:"80vh", overflowY:"auto", position:"relative", boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"#F3F4F6", border:"none", borderRadius:6, width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#6B7280" }}><X size={14}/></button>
        {children}
      </div>
    </div>
  );
}

function CandidateModal({ candidate, onClose }) {
  if (!candidate) return null;
  const d = CANDIDATE_DETAIL_TEMPLATE;
  return (
    <Modal open={true} onClose={onClose}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
        <Avatar name={candidate.name} size={48}/>
        <div>
          <div style={{ fontWeight:700, fontSize:18, color:"#111" }}>{candidate.name}</div>
          <div style={{ fontSize:13, color:"#6B7280" }}>{candidate.jobTitle} · {candidate.code}</div>
        </div>
        <Badge text={KANBAN_STAGE_DEFS.find(s=>s.id===candidate.stage)?.label||"서류평가"} bg="#EFF6FF" color="#3B82F6"/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
        {[["직군",candidate.직군],["담당자",candidate.담당자],["부서",candidate.부서],["직원유형",candidate.직원유형],["이메일",d.email],["연락처",d.phone],["학력",d.school],["경력",d.career]].map(([k,v])=>(
          <div key={k} style={{ background:"#F9FAFB", borderRadius:8, padding:"10px 12px" }}>
            <div style={{ fontSize:11, color:"#9CA3AF", marginBottom:3 }}>{k}</div>
            <div style={{ fontSize:13, color:"#111", fontWeight:500 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:12, color:"#9CA3AF", marginBottom:8 }}>보유 스킬</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {d.skills.map(s=><Badge key={s} text={s} bg="#F3F4F6" color="#374151"/>)}
        </div>
      </div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:12, color:"#9CA3AF", marginBottom:8 }}>진행 타임라인</div>
        {d.timeline.map((t,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
            {t.done?<CheckCircle2 size={14} color="#10B981"/>:t.alert?<AlertCircle size={14} color="#EF4444"/>:<Circle size={14} color="#D1D5DB"/>}
            <span style={{ fontSize:12, color:"#6B7280", minWidth:36 }}>{t.date}</span>
            <span style={{ fontSize:13, color:t.alert?"#EF4444":"#374151" }}>{t.event}</span>
          </div>
        ))}
      </div>
      <div style={{ background:"#FFFBEB", borderRadius:8, padding:"10px 12px" }}>
        <div style={{ fontSize:11, color:"#9CA3AF", marginBottom:4 }}>담당자 메모</div>
        <div style={{ fontSize:13, color:"#374151" }}>{d.memo}</div>
      </div>
    </Modal>
  );
}

function JobModal({ job, onClose }) {
  if (!job) return null;
  return (
    <Modal open={true} onClose={onClose}>
      <div style={{ marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
          <Badge text={job.urgency} bg={urgencyStyle(job.urgency).bg} color={urgencyStyle(job.urgency).color}/>
          <Badge text={job.상태} bg={statusStyle(job.상태).bg} color={statusStyle(job.상태).color}/>
        </div>
        <div style={{ fontWeight:700, fontSize:18, color:"#111" }}>{job.title}</div>
        <div style={{ fontSize:13, color:"#6B7280", marginTop:4 }}>{job.부서} · 담당: {job.담당자}</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
        {[["직군",job.직군],["직원유형",job.직원유형],["채용 인원","2명"],["지원자 수",`${job.applied}명`],["인터뷰 진행",`${job.interview}명`],["오퍼 발송",`${job.offer}명`],["7일 이상 정체",`${job.stale}명`]].map(([k,v])=>(
          <div key={k} style={{ background:"#F9FAFB", borderRadius:8, padding:"10px 12px" }}>
            <div style={{ fontSize:11, color:"#9CA3AF", marginBottom:3 }}>{k}</div>
            <div style={{ fontSize:14, color:"#111", fontWeight:600 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:12, color:"#9CA3AF", marginBottom:6 }}>공고 설명</div>
        <div style={{ fontSize:13, color:"#374151", lineHeight:1.6 }}>대규모 서비스를 운영하는 팀의 핵심 포지션입니다. 능동적이고 빠른 실행력을 갖춘 분을 찾습니다.</div>
      </div>
      <div>
        <div style={{ fontSize:12, color:"#9CA3AF", marginBottom:8 }}>자격 요건</div>
        {["관련 분야 3년 이상 경력","협업 도구 활용 능숙","자기주도적 업무 수행 가능","팀 커뮤니케이션 능력 우수"].map((r,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
            <div style={{ width:4, height:4, borderRadius:"50%", background:"#3B82F6", flexShrink:0 }}/>
            <span style={{ fontSize:13, color:"#374151" }}>{r}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function KanbanCard({ candidate, onClick }) {
  const [hov, setHov]=useState(false);
  return (
    <div onClick={()=>onClick(candidate)} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:hov?"#F0F9FF":"#fff", border:`1px solid ${hov?"#BAE6FD":"#E5E7EB"}`, borderRadius:8, padding:"9px 10px 8px", cursor:"pointer", transition:"all 0.12s", marginBottom:6 }}>
      <div style={{ fontWeight:600, fontSize:13, color:"#111", marginBottom:2 }}>{candidate.name}</div>
      <div style={{ fontSize:11, color:"#6B7280", marginBottom:5 }}>{candidate.jobTitle}</div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:10, color:"#9CA3AF" }}>{candidate.code}</span>
        <span>
          {candidate.days!=null && <span style={{ fontSize:10, fontWeight:600, color:candidate.days>=7?"#EF4444":candidate.days>=3?"#F59E0B":"#6B7280" }}>{candidate.days}일 경과</span>}
          {candidate.recommended && <span style={{ fontSize:10, color:"#6B7280" }}>추천인 있음</span>}
          {candidate.dueDate     && <span style={{ fontSize:10, color:"#6B7280" }}>{candidate.dueDate}</span>}
          {candidate.refStatus   && <Badge text={candidate.refStatus} bg={candidate.refStatus==="진행 중"?"#ECFDF5":"#F9FAFB"} color={candidate.refStatus==="진행 중"?"#10B981":"#6B7280"} small/>}
          {candidate.joinDate    && <span style={{ fontSize:10, color:"#3B82F6", fontWeight:500 }}>{candidate.joinDate}</span>}
        </span>
      </div>
    </div>
  );
}

// Controlled Dropdown — uses shared openId so only one is open at a time
function Dropdown({ id, label, options, value, openId, setOpenId, onChange, isActive }) {
  const ref=useRef(null);
  const isOpen=openId===id;
  useEffect(()=>{
    if(!isOpen) return;
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpenId(null);};
    document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  },[isOpen,setOpenId]);
  const display=(value&&value!=="전체")?value:label;
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button onClick={()=>setOpenId(isOpen?null:id)}
        style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 9px", borderRadius:6, cursor:"pointer", whiteSpace:"nowrap", fontSize:12, fontWeight:isActive?600:400, border:`1px solid ${isActive?"#3B82F6":"#E5E7EB"}`, background:isActive?"#EFF6FF":"#fff", color:isActive?"#2563EB":"#374151" }}>
        {display}
        <ChevronDown size={11} color={isActive?"#2563EB":"#9CA3AF"} style={{ transform:isOpen?"rotate(180deg)":"rotate(0deg)", transition:"transform 0.15s" }}/>
      </button>
      {isOpen && (
        <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, zIndex:100, background:"#fff", border:"1px solid #E5E7EB", borderRadius:8, boxShadow:"0 6px 20px rgba(0,0,0,0.12)", minWidth:160, overflow:"hidden" }}>
          {options.map(opt=>{
            const sel=opt===value||(opt==="전체"&&(!value||value==="전체"));
            return (
              <div key={opt} onClick={()=>{onChange(opt);setOpenId(null);}}
                style={{ padding:"8px 14px", fontSize:13, color:sel?"#2563EB":"#374151", background:sel?"#EFF6FF":"transparent", cursor:"pointer", fontWeight:sel?600:400, display:"flex", alignItems:"center", justifyContent:"space-between" }}
                onMouseEnter={e=>{if(!sel)e.currentTarget.style.background="#F9FAFB";}}
                onMouseLeave={e=>{if(!sel)e.currentTarget.style.background="transparent";}}>
                {opt}{sel&&<span style={{ fontSize:12, color:"#2563EB" }}>✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StageSelect({ stageId, openId, setOpenId, value="전체", onChange }) {
  const options=STAGE_FILTERS[stageId]||["전체","진행중"];
  const id=`stage-${stageId}`;
  const ref=useRef(null);
  const isOpen=openId===id;
  useEffect(()=>{
    if(!isOpen) return;
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpenId(null);};
    document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  },[isOpen,setOpenId]);
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button onClick={()=>setOpenId(isOpen?null:id)}
        style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"3px 7px", fontSize:11, border:"1px solid #E5E7EB", borderRadius:4, background:"#F9FAFB", color:"#6B7280", cursor:"pointer" }}>
        <span>{value}</span>
        <ChevronDown size={10} style={{ transform:isOpen?"rotate(180deg)":"rotate(0deg)", transition:"transform 0.15s" }}/>
      </button>
      {isOpen && (
        <div style={{ position:"absolute", top:"calc(100% + 2px)", left:0, zIndex:100, background:"#fff", border:"1px solid #E5E7EB", borderRadius:6, boxShadow:"0 6px 16px rgba(0,0,0,0.1)", minWidth:110, overflow:"hidden" }}>
          {options.map(opt=>(
            <div key={opt} onClick={()=>{onChange(opt);setOpenId(null);}}
              style={{ padding:"6px 12px", fontSize:12, color:opt===value?"#2563EB":"#374151", background:opt===value?"#EFF6FF":"transparent", cursor:"pointer", fontWeight:opt===value?600:400 }}
              onMouseEnter={e=>{if(opt!==value)e.currentTarget.style.background="#F9FAFB";}}
              onMouseLeave={e=>{if(opt!==value)e.currentTarget.style.background="transparent";}}>
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. FILTER CHIP (shows active filters, click to clear)
// ─────────────────────────────────────────────────────────────────────────────
function FilterChip({ label, onClear }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"2px 8px 2px 10px", borderRadius:999, fontSize:11, fontWeight:500, background:"#EFF6FF", color:"#2563EB", border:"1px solid #BFDBFE" }}>
      {label}
      <button onClick={onClear} style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", alignItems:"center", color:"#93C5FD" }}><X size={10}/></button>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function RecruitDashboard() {
  const [activeNav, setActiveNav]             = useState("대시보드");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedJob, setSelectedJob]         = useState(null);
  const [jobTab, setJobTab]                   = useState("전체");
  const [actionFilter, setActionFilter]       = useState("전체");
  const [openId, setOpenId]                   = useState(null);
  const [headerFilters, setHeaderFilters]     = useState({ 직군:"전체", 상태:"전체", 담당자:"전체", 직원유형:"전체" });
  const [searchJob,     setSearchJob]         = useState("");
  const [searchCandidate, setSearchCandidate] = useState("");
  const [searchDept,    setSearchDept]        = useState("");
  const [landingPreset, setLandingPreset]     = useState(LANDING_PRESETS[0]);
  const [landingMenuOpen, setLandingMenuOpen] = useState(false);
  const [selectedKPI, setSelectedKPI]         = useState(null);
  const [stageGroup, setStageGroup]           = useState("전체");
  const [stageFilters, setStageFilters]       = useState({ docs:"전체", rec:"전체", code:"전체", task:"전체", pre:"전체", int1:"전체", int2:"전체", ref:"전체", offer:"전체", final:"전체" });
  const [stageVisibleCounts, setStageVisibleCounts] = useState({});

  const setHF = (k,v) => setHeaderFilters(p=>({...p,[k]:v}));
  const clearHF = (k) => setHF(k,"전체");

  useEffect(()=>{
    setStageVisibleCounts({});
  }, [stageFilters, headerFilters, searchCandidate, searchDept]);

  const applyLandingPreset = (preset) => {
    setLandingPreset(preset);
    setHeaderFilters({ 직군:preset.filters.직군, 상태:preset.filters.상태, 담당자:preset.filters.담당자, 직원유형:preset.filters.직원유형 });
    setSearchJob(preset.filters.searchJob);
    setSearchCandidate(preset.filters.searchCandidate);
    setSearchDept(preset.filters.searchDept);
    setLandingMenuOpen(false);
  };

  // ── Active filter chips (non-전체 header filters + non-empty searches)
  const activeChips = useMemo(()=>{
    const chips=[];
    HEADER_FILTERS.forEach(f=>{ if(headerFilters[f.key]!=="전체") chips.push({ key:f.key, label:`${f.key}: ${headerFilters[f.key]}`, onClear:()=>clearHF(f.key) }); });
    if(searchJob)       chips.push({ key:"searchJob",       label:`공고명: "${searchJob}"`,  onClear:()=>setSearchJob("") });
    if(searchCandidate) chips.push({ key:"searchCandidate", label:`후보자: "${searchCandidate}"`, onClear:()=>setSearchCandidate("") });
    if(searchDept)      chips.push({ key:"searchDept",      label:`부서: "${searchDept}"`,   onClear:()=>setSearchDept("") });
    return chips;
  },[headerFilters, searchJob, searchCandidate, searchDept]);

  const hasFilter = activeChips.length > 0;

  // ── Filter helpers
  const matchCandidate = (c) => {
    if(headerFilters.직군!=="전체"   && c.직군!==headerFilters.직군)       return false;
    if(headerFilters.담당자!=="전체"  && c.담당자!==headerFilters.담당자)    return false;
    if(headerFilters.직원유형!=="전체" && c.직원유형!==headerFilters.직원유형) return false;
    if(searchCandidate && !c.name.includes(searchCandidate) && !c.jobTitle.includes(searchCandidate)) return false;
    if(searchDept && !c.부서.includes(searchDept)) return false;
    return true;
  };

  const matchJob = (j) => {
    if(headerFilters.직군!=="전체"    && j.직군!==headerFilters.직군)        return false;
    if(headerFilters.담당자!=="전체"   && j.담당자!==headerFilters.담당자)    return false;
    if(headerFilters.직원유형!=="전체" && j.직원유형!==headerFilters.직원유형) return false;
    if(headerFilters.상태!=="전체"    && j.상태!==headerFilters.상태)        return false;
    if(searchJob  && !j.title.includes(searchJob) && !j.부서.includes(searchJob))   return false;
    if(searchDept && !j.부서.includes(searchDept)) return false;
    return true;
  };

  // ── Derived data
  const filteredJobs = useMemo(()=>ALL_JOB_POSTINGS.filter(matchJob),[headerFilters,searchJob,searchDept]);

  // Job postings split by tab
  const tabStatusMap = { 전체:"전체", 진행중:"진행중", 대기중:"대기중", 완료:"완료", 취소:"취소" };
  const jobsForTab = useMemo(()=>{
    const target = tabStatusMap[jobTab] || "전체";
    if(target === "전체") return filteredJobs;
    return filteredJobs.filter(j=>j.상태===target);
  },[filteredJobs, jobTab]);

  const filteredCandidates = useMemo(()=>ALL_CANDIDATES.filter(matchCandidate),[headerFilters,searchCandidate,searchDept]);
  const filteredJobsAll = useMemo(()=>ALL_JOB_POSTINGS.filter(matchJob),[headerFilters,searchJob,searchDept]);

  const kpiDetails = useMemo(() => {
    if (!selectedKPI) return null;
    switch (selectedKPI) {
      case "오픈 공고":
        return filteredJobs.filter(j=>j.상태==="진행중");
      case "진행 중 후보자":
        return filteredCandidates;
      case "이번주 인터뷰":
        return filteredCandidates.filter(c=>["int1","int2","pre"].includes(c.stage));
      case "처우협의 중":
        return filteredCandidates.filter(c=>c.stage==="offer");
      case "최종입사 예정":
        return filteredCandidates.filter(c=>c.stage==="final");
      case "7일 이상 정체":
        return filteredCandidates.filter(c=>c.days!=null&&c.days>=7);
      default:
        return null;
    }
  },[selectedKPI, filteredJobs, filteredCandidates]);

  const tabCounts = useMemo(()=>({
    전체: filteredJobs.length,
    진행중: filteredJobs.filter(j=>j.상태==="진행중").length,
    대기중: filteredJobs.filter(j=>j.상태==="대기중").length,
    완료: filteredJobs.filter(j=>j.상태==="완료").length,
    취소: filteredJobs.filter(j=>j.상태==="취소").length,
  }),[filteredJobs]);

  // Kanban: filter candidates per stage
  const kanbanStages = useMemo(()=>{
    const visibleStageIds = STAGE_GROUPS[stageGroup] || STAGE_GROUPS["전체"];
    return KANBAN_STAGE_DEFS.filter(def=>visibleStageIds.includes(def.id)).map(def=>{
      const stageCandidates = ALL_CANDIDATES.filter(c=> c.stage===def.id && matchCandidate(c));
      const currentStageFilter = stageFilters[def.id] || "전체";
      const filteredCandidates = currentStageFilter==="전체"
        ? stageCandidates
        : stageCandidates.filter(c=>c.stageStatus===currentStageFilter);
      return { ...def, candidates:filteredCandidates, count:filteredCandidates.length, total:stageCandidates.length, currentStageFilter };
    });
  },[headerFilters, searchCandidate, searchDept, stageFilters, stageGroup]);

  // Summary metrics (derived from filtered candidates + jobs)
  const summaryCards = useMemo(()=>[
    { label:"오픈 공고",      value:filteredJobsAll.filter(j=>j.상태==="진행중").length,                            delta:3,  up:true,  color:"#3B82F6", bg:"#EFF6FF", icon:"📋" },
    { label:"진행 중 후보자", value:filteredCandidates.length,                                                     delta:18, up:true,  color:"#8B5CF6", bg:"#F5F3FF", icon:"👥" },
    { label:"이번주 인터뷰",  value:filteredCandidates.filter(c=>["int1","int2","pre"].includes(c.stage)).length,  delta:7,  up:true,  color:"#10B981", bg:"#ECFDF5", icon:"📅" },
    { label:"처우협의 중",    value:filteredCandidates.filter(c=>c.stage==="offer").length,                        delta:1,  up:false, color:"#F59E0B", bg:"#FFFBEB", icon:"🤝" },
    { label:"최종입사 예정",  value:filteredCandidates.filter(c=>c.stage==="final").length,                        delta:1,  up:true,  color:"#06B6D4", bg:"#ECFEFF", icon:"🎯" },
    { label:"7일 이상 정체",  value:filteredCandidates.filter(c=>c.days!=null&&c.days>=7).length,                  delta:2,  up:false, color:"#EF4444", bg:"#FEF2F2", icon:"⏰" },
  ], [filteredCandidates, filteredJobsAll]);

  // Action items filtering (by 부서 search / dept filter)
  const filteredActions = useMemo(()=>{
    let items = actionFilter==="전체" ? ACTION_ITEMS : ACTION_ITEMS.filter(a=>a.tag===actionFilter);
    if(searchDept) items=items.filter(a=>a.부서.includes(searchDept));
    if(searchCandidate) items=items.filter(a=>a.candidateName.includes(searchCandidate)||a.candidateRole.includes(searchCandidate));
    return items;
  },[actionFilter, searchCandidate, searchDept]);

  const clearAllFilters = () => {
    setHeaderFilters({ 직군:"전체", 상태:"전체", 담당자:"전체", 직원유형:"전체" });
    setStageFilters({ docs:"전체", rec:"전체", code:"전체", task:"전체", pre:"전체", int1:"전체", int2:"전체", ref:"전체", offer:"전체", final:"전체" });
    setStageGroup("전체");
    setStageVisibleCounts({});
    setSearchJob(""); setSearchCandidate(""); setSearchDept("");
    setSelectedKPI(null);
  };

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'Pretendard','Apple SD Gothic Neo','Inter',sans-serif", background:"#F9FAFB" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width:180, background:"#fff", borderRight:"1px solid #E5E7EB", display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"18px 16px 14px", borderBottom:"1px solid #F3F4F6", display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, background:"#3B82F6", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontSize:14 }}>🔍</span>
          </div>
          <span style={{ fontWeight:700, fontSize:14, color:"#111" }}>영입 대시보드</span>
        </div>
        <nav style={{ padding:"10px 8px", flex:1 }}>
          {NAV_ITEMS.map(({icon:Icon, label, href})=>(
            href ? (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"9px 10px", borderRadius:7, border:"none", cursor:"pointer", background:"transparent", color:"#6B7280", fontWeight:400, fontSize:13, marginBottom:2, textAlign:"left", textDecoration:"none", transition:"background 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.background="#EFF6FF"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <Icon size={16}/>{label}
              </a>
            ) : (
              <button key={label} onClick={()=>setActiveNav(label)}
                style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"9px 10px", borderRadius:7, border:"none", cursor:"pointer", background:activeNav===label?"#EFF6FF":"transparent", color:activeNav===label?"#3B82F6":"#6B7280", fontWeight:activeNav===label?600:400, fontSize:13, marginBottom:2, textAlign:"left" }}>
                <Icon size={16}/>{label}
              </button>
            )
          ))}
        </nav>
        <div style={{ padding:"10px 8px", borderTop:"1px solid #F3F4F6" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", cursor:"pointer", color:"#9CA3AF", fontSize:12 }}>
            <Star size={14}/><span>나의 즐겨찾기</span><ChevronRight size={12} style={{ marginLeft:"auto" }}/>
          </div>
          <div style={{ margin:"8px 10px", padding:"8px 10px", background:"#FFFBEB", borderRadius:6, border:"1px solid #FDE68A" }}>
            <div style={{ fontSize:10, color:"#92400E", marginBottom:2 }}>현재 랜딩 페이지</div>
            <div style={{ fontWeight:600, fontSize:12, color:"#78350F" }}>{landingPreset.label}</div>
            <button onClick={()=>setLandingMenuOpen(open=>!open)} style={{ marginTop:6, width:"100%", padding:"4px 0", background:"#F59E0B", color:"#fff", border:"none", borderRadius:4, fontSize:11, fontWeight:600, cursor:"pointer" }}>변경하기</button>
            {landingMenuOpen && (
              <div style={{ marginTop:6, background:"#fff", border:"1px solid #E5E7EB", borderRadius:8, overflow:"hidden" }}>
                {LANDING_PRESETS.map(preset=> (
                  <button key={preset.key} onClick={()=>applyLandingPreset(preset)}
                    style={{ width:"100%", textAlign:"left", padding:"8px 10px", border:"none", background:landingPreset.key===preset.key?"#EFF6FF":"#fff", color:"#374151", cursor:"pointer", fontWeight:landingPreset.key===preset.key?700:500 }}>
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", marginRight:selectedKPI?"clamp(320px, 40%, 420px)":0, transition:"margin-right 0.2s ease" }}>

        {/* ── Header ── */}
        <header style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"0 16px", height:54, display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <h1 style={{ margin:0, fontSize:15, fontWeight:700, color:"#111", marginRight:6, whiteSpace:"nowrap" }}>대시보드</h1>
          {HEADER_FILTERS.map(f=>(
            <Dropdown key={f.key} id={`hf-${f.key}`} label={f.label} options={f.options}
              value={headerFilters[f.key]} openId={openId} setOpenId={setOpenId}
              onChange={v=>setHF(f.key,v)} isActive={headerFilters[f.key]!=="전체"}/>
          ))}
          {/* Search */}
          {[
            { ph:"공고명 검색",  val:searchJob,       set:setSearchJob },
            { ph:"후보자명 검색", val:searchCandidate, set:setSearchCandidate },
            { ph:"부서명 검색",  val:searchDept,      set:setSearchDept },
          ].map(({ph,val,set})=>(
            <div key={ph} style={{ display:"flex", alignItems:"center", gap:5, border:`1px solid ${val?"#3B82F6":"#E5E7EB"}`, borderRadius:6, padding:"4px 8px", background:val?"#EFF6FF":"#fff", transition:"border 0.15s" }}>
              <Search size={11} color={val?"#2563EB":"#9CA3AF"}/>
              <input value={val} onChange={e=>set(e.target.value)} placeholder={ph}
                style={{ border:"none", outline:"none", fontSize:12, color:"#374151", width:86, background:"transparent" }}/>
              {val && <button onClick={()=>set("")} style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", color:"#9CA3AF" }}><X size={10}/></button>}
            </div>
          ))}
          <div style={{ flex:1 }}/>
          <div style={{ position:"relative" }}>
            <button style={{ background:"none", border:"none", cursor:"pointer", color:"#6B7280", display:"flex", padding:4 }}><Bell size={20}/></button>
            <span style={{ position:"absolute", top:2, right:2, background:"#EF4444", color:"#fff", fontSize:9, fontWeight:700, borderRadius:999, minWidth:16, height:16, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 3px" }}>77</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:7, cursor:"pointer" }}>
            <Avatar name="김" size={28}/>
            <div style={{ lineHeight:1.3 }}>
              <div style={{ fontSize:12, fontWeight:600, color:"#111" }}>김영입</div>
              <div style={{ fontSize:10, color:"#9CA3AF" }}>영입팀</div>
            </div>
          </div>
        </header>

        {/* ── Active Filter Chips ── */}
        {hasFilter && (
          <div style={{ background:"#F8FAFF", borderBottom:"1px solid #E5E7EB", padding:"7px 16px", display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
            <span style={{ fontSize:11, color:"#9CA3AF", marginRight:2 }}>적용된 필터:</span>
            {activeChips.map(c=><FilterChip key={c.key} label={c.label} onClear={c.onClear}/>)}
            <button onClick={clearAllFilters} style={{ marginLeft:4, fontSize:11, color:"#EF4444", background:"none", border:"none", cursor:"pointer", fontWeight:500 }}>전체 초기화</button>
          </div>
        )}

        {/* ── Content ── */}
        <div style={{ flex:1, overflow:"auto", padding:16, display:"flex", flexDirection:"column", gap:14 }}>

          {/* Summary Cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10 }}>
            {summaryCards.map(c=>(
              <div key={c.label}
                onClick={()=>setSelectedKPI(selectedKPI===c.label?null:c.label)}
                style={{ background:selectedKPI===c.label?"#EFF6FF":"#fff", border:"1px solid #E5E7EB", borderRadius:10, padding:"13px 13px 11px", cursor:"pointer" }}
                onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.08)"}
                onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>{c.icon}</div>
                  <span style={{ fontSize:11, color:"#6B7280" }}>{c.label}</span>
                </div>
                <div style={{ fontSize:26, fontWeight:700, color:"#111", lineHeight:1 }}>{c.value}</div>
                <div style={{ display:"flex", alignItems:"center", gap:3, marginTop:5 }}>
                  {c.up?<TrendingUp size={11} color="#10B981"/>:<TrendingDown size={11} color="#EF4444"/>}
                  <span style={{ fontSize:11, color:c.up?"#10B981":"#EF4444", fontWeight:500 }}>{c.up?"↑":"↓"} {c.delta}</span>
                  <span style={{ fontSize:10, color:"#9CA3AF" }}>지난주 대비</span>
                </div>
              </div>
            ))}
          </div>

          {/* Kanban */}
          <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:10, padding:"14px 14px 0" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontWeight:700, fontSize:14, color:"#111" }}>영입 프로세스 진행 현황</span>
                <AlertCircle size={13} color="#9CA3AF"/>
                {hasFilter && <Badge text="필터 적용 중" bg="#EFF6FF" color="#2563EB" small/>}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <Dropdown id="stage-group" label="단계 그룹 보기" options={["전체","인터뷰 전","인터뷰","인터뷰 후"]}
                  value={stageGroup} openId={openId} setOpenId={setOpenId} onChange={setStageGroup} isActive={stageGroup!=="전체"}/>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:14 }}>
              {kanbanStages.map(stage=>(
                <div key={stage.id} style={{ minWidth:144, maxWidth:144, flexShrink:0 }}>
                  <div style={{ marginBottom:7 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>{stage.label}</span>
                      <span style={{ fontSize:12, fontWeight:700, color: stage.count===0?"#9CA3AF":"#3B82F6" }}>{stage.count}{stage.total!=null && stage.total!==stage.count?`/${stage.total}`:""}</span>
                    </div>
                    <StageSelect stageId={stage.id} openId={openId} setOpenId={setOpenId} value={stage.currentStageFilter} onChange={value=>setStageFilters(p=>({...p,[stage.id]:value}))}/>
                  </div>
                  {stage.onlyRecommended && (
                    <div style={{ fontSize:10, color:"#9CA3AF", marginBottom:5, background:"#F9FAFB", borderRadius:4, padding:"3px 6px" }}>추천인 있는 후보자만 표시</div>
                  )}
                  {stage.candidates.length===0 ? (
                    <div style={{ fontSize:11, color:"#C4B5FD", background:"#FAFAFA", border:"1px dashed #E5E7EB", borderRadius:8, padding:"14px 0", textAlign:"center" }}>결과 없음</div>
                  ) : (()=>{
                    const defaultCount = 4;
                    const visibleCount = stageVisibleCounts[stage.id] || defaultCount;
                    const isComplete = visibleCount >= stage.candidates.length;
                    const visibleCandidates = stage.candidates.slice(0, visibleCount);
                    return (
                      <>
                        {visibleCandidates.map(c=><KanbanCard key={c.id} candidate={c} onClick={setSelectedCandidate}/>)}
                        {isComplete ? (
                          <div style={{ height:24, marginTop:4, borderTop:"1px solid #F3F4F6", background:"#F8FAFF" }} />
                        ) : (
                          <button onClick={()=>setStageVisibleCounts(prev=>({ ...prev, [stage.id]: stage.candidates.length }))}
                            style={{ width:"100%", padding:"8px 0", border:"1px dashed #D1D5DB", borderRadius:6, background:"transparent", fontSize:12, color:"#3B82F6", cursor:"pointer", marginTop:4 }}>
                            더보기 ({stage.candidates.length - visibleCount}개)
                          </button>
                        )}
                      </>
                    );
                  })()}
                  {stage.warnings.map((w,wi)=>w.count>0&&(
                    <div key={wi} style={{ display:"flex", alignItems:"center", gap:3, marginBottom:3 }}>
                      <AlertCircle size={10} color="#EF4444"/>
                      <span style={{ fontSize:10, color:"#EF4444", fontWeight:500 }}>{w.label} {w.count}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>

            {/* Job Postings */}
            <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:10, padding:"14px 14px 0", display:"flex", flexDirection:"column" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                <span style={{ fontWeight:700, fontSize:14, color:"#111" }}>공고 현황</span>
                {hasFilter && <Badge text={`${filteredJobs.length}건`} bg="#EFF6FF" color="#2563EB" small/>}
              </div>
              <div style={{ display:"flex", gap:0, borderBottom:"1px solid #E5E7EB", marginBottom:10 }}>
                {[{label:"전체"},{label:"진행중"},{label:"대기중"},{label:"완료"},{label:"취소"}].map(({label})=>(
                  <button key={label} onClick={()=>setJobTab(label)}
                    style={{ padding:"6px 12px", border:"none", background:"transparent", cursor:"pointer", fontSize:13, fontWeight:jobTab===label?700:400, color:jobTab===label?"#3B82F6":"#6B7280", borderBottom:jobTab===label?"2px solid #3B82F6":"2px solid transparent", marginBottom:-1 }}>
                    {label} <span style={{ fontSize:11, fontWeight:600 }}>{tabCounts[label]}</span>
                  </button>
                ))}
              </div>
              <div style={{ overflow:"auto", flex:1 }}>
                {jobsForTab.length===0
                  ? <EmptyState message="조건에 맞는 공고가 없습니다"/>
                  : (
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                    <thead>
                      <tr style={{ borderBottom:"1px solid #F3F4F6" }}>
                        {["공고명","직군","담당자","진행","인터뷰","합격","정체","상태"].map(h=>(
                          <th key={h} style={{ padding:"5px 7px", textAlign:"left", color:"#9CA3AF", fontWeight:500, whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {jobsForTab.map(job=>(
                        <tr key={job.id} onClick={()=>setSelectedJob(job)}
                          style={{ borderBottom:"1px solid #F9FAFB", cursor:"pointer" }}
                          onMouseEnter={e=>e.currentTarget.style.background="#F9FAFB"}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <td style={{ padding:"7px 7px", fontWeight:500, color:"#111", whiteSpace:"nowrap", maxWidth:140, overflow:"hidden", textOverflow:"ellipsis" }}>{job.title}</td>
                          <td style={{ padding:"7px 7px", color:"#6B7280", whiteSpace:"nowrap" }}>{job.직군}</td>
                          <td style={{ padding:"7px 7px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                              <Avatar name={job.담당자[0]} size={18}/>
                              <span style={{ color:"#374151", fontSize:11 }}>{job.담당자}</span>
                            </div>
                          </td>
                          {[job.applied,job.interview,job.offer,job.stale].map((v,i)=>(
                            <td key={i} style={{ padding:"7px 7px", color:"#374151", textAlign:"center" }}>{v}</td>
                          ))}
                          <td style={{ padding:"7px 7px" }}>
                            <Badge text={job.urgency} bg={urgencyStyle(job.urgency).bg} color={urgencyStyle(job.urgency).color} small/>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              {jobsForTab.length>0 && <div style={{ fontSize:12, color:"#9CA3AF", padding:"8px 0", textAlign:"center" }}>총 {jobsForTab.length}개 공고</div>}
            </div>

            {/* Action Items */}
            <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:10, padding:"14px", display:"flex", flexDirection:"column" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontWeight:700, fontSize:14, color:"#111" }}>오늘의 액션 필요</span>
                  <span style={{ background:"#EF4444", color:"#fff", fontSize:11, fontWeight:700, borderRadius:999, padding:"1px 7px" }}>{filteredActions.length}</span>
                </div>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:10 }}>
                {ACTION_TAGS.map(tag=>{
                  const count=tag==="전체"?ACTION_ITEMS.length:ACTION_ITEMS.filter(a=>a.tag===tag).length;
                  return (
                    <button key={tag} onClick={()=>setActionFilter(tag)}
                      style={{ padding:"2px 9px", borderRadius:999, fontSize:11, fontWeight:500, cursor:"pointer", border:`1px solid ${actionFilter===tag?"#3B82F6":"#E5E7EB"}`, background:actionFilter===tag?"#EFF6FF":"#fff", color:actionFilter===tag?"#3B82F6":"#6B7280" }}>
                      {tag} {count}
                    </button>
                  );
                })}
              </div>
              <div style={{ flex:1 }}>
                {filteredActions.length===0
                  ? <EmptyState message="조건에 맞는 액션 항목이 없습니다"/>
                  : filteredActions.map((item,i)=>(
                  <div key={item.id}
                    style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 6px", borderBottom:i<filteredActions.length-1?"1px solid #F3F4F6":"none", cursor:"pointer", borderRadius:6 }}
                    onClick={()=>setSelectedCandidate(ALL_CANDIDATES.find(c=>c.name===item.candidateName)||{name:item.candidateName, jobTitle:item.candidateRole, code:"—", stage:"docs", 직군:"—", 담당자:"—", 직원유형:"—", 부서:item.부서})}
                    onMouseEnter={e=>e.currentTarget.style.background="#F9FAFB"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <Badge text={item.tag} bg={item.tagBg} color={item.tagColor} small/>
                    <div style={{ flex:1, minWidth:0, fontSize:12, color:"#374151" }}>
                      <span style={{ fontWeight:500 }}>{item.candidateName} </span>
                      <span style={{ color:"#9CA3AF" }}>({item.candidateRole}) </span>
                      <span style={{ color:"#6B7280" }}>{item.action}</span>
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, color:item.urgencyColor, whiteSpace:"nowrap" }}>{item.urgency}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* KPI 상세는 우측 고정 사이드 패널로 렌더링됩니다 (전체화면 우측) */}
          </div>
        </div>
      </div>

      {selectedKPI && (
        <div style={{ position:"fixed", top:0, right:0, height:"100vh", width:420, maxWidth:"40%", background:"#fff", boxShadow:"-20px 0 40px rgba(2,6,23,0.08)", borderLeft:"1px solid #E5E7EB", padding:20, overflow:"auto", zIndex:1000 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
            <span style={{ fontWeight:700, fontSize:16, color:"#111" }}>{selectedKPI} 상세</span>
            <button onClick={()=>setSelectedKPI(null)} style={{ border:"none", background:"none", color:"#6B7280", cursor:"pointer", fontSize:12 }}>닫기</button>
          </div>
          {(!kpiDetails || kpiDetails.length===0) ? (
            <EmptyState message="선택된 KPI 항목이 없습니다"/>
          ) : (
            <div style={{ display:"grid", gap:10 }}>
              {(selectedKPI==="오픈 공고" ? kpiDetails : kpiDetails).map(item=> (
                <div key={(item.id||item.name)+"-kpi"} style={{ border:"1px solid #F3F4F6", borderRadius:8, padding:12, display:"flex", flexDirection:"column", gap:6, background:"#FAFBFF" }}>
                  {selectedKPI==="오픈 공고" ? (
                    <>
                      <div style={{ fontWeight:700, color:"#111" }}>{item.title}</div>
                      <div style={{ fontSize:12, color:"#6B7280" }}>{item.직군} · {item.담당자}</div>
                      <div style={{ fontSize:12, color:"#374151" }}>지원자 {item.applied}명 · 인터뷰 {item.interview}명 · 상태 {item.상태}</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontWeight:700, color:"#111" }}>{item.name}</div>
                      <div style={{ fontSize:12, color:"#6B7280" }}>{item.jobTitle} · {KANBAN_STAGE_DEFS.find(s=>s.id===item.stage)?.label||item.stage}</div>
                      <div style={{ fontSize:12, color:"#374151" }}>담당자 {item.담당자} · 상태 {item.stageStatus || item.단계상태 || "-"}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <CandidateModal candidate={selectedCandidate} onClose={()=>setSelectedCandidate(null)}/>
      <JobModal job={selectedJob} onClose={()=>setSelectedJob(null)}/>
    </div>
  );
}
