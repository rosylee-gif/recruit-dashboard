import { useState, useMemo } from "react";
import {
  LayoutDashboard, Megaphone, Users, FileText,
  Settings, Star, Search, X,
  TrendingUp, TrendingDown, AlertCircle,
  ChevronRight, CheckCircle2, Circle,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS & STATIC CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const JIKGUN_OPTIONS  = ["테크", "서비스비즈", "스태프", "디자인"];
const JIKWON_OPTIONS  = ["정규직", "계약직", "어시스턴트", "경영계약직", "전문계약직"];

const STAGE_ORDER = [
  { id:"docs",  label:"서류"    },
  { id:"rec",   label:"추천서"  },
  { id:"code",  label:"코딩"    },
  { id:"task",  label:"과제"    },
  { id:"pre",   label:"사전면접" },
  { id:"int1",  label:"1차"    },
  { id:"int2",  label:"2차"    },
  { id:"ref",   label:"레퍼런스" },
  { id:"offer", label:"처우"    },
  { id:"final", label:"입사예정" },
];

const STAGE_LABEL = { docs:"서류평가", rec:"추천서 작성", code:"코딩테스트", task:"과제전형", pre:"사전인터뷰", int1:"1차 인터뷰", int2:"2차 인터뷰", ref:"레퍼런스 체크", offer:"처우 협의", final:"입사예정" };

function elapsedDays(dateStr) {
  return Math.floor((new Date() - new Date(dateStr)) / 86400000);
}

const LANDING_PRESETS = [
  { key:"all",  label:"전체 공고",   담당자:null       },
  { key:"mine", label:"내 담당 공고", 담당자:"rosy.lee" },
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
const CONTENT_TABS = ["공고별 단계현황", "액션필요", "공고별 전형 진행율"];

const statusStyle = (s) => ({
  "진행중": { bg: "#EFF6FF", color: "#2563EB" },
  "대기중": { bg: "#F3F4F6", color: "#6B7280" },
  "완료":   { bg: "#F0FDF4", color: "#16A34A" },
  "취소":   { bg: "#FEF2F2", color: "#DC2626" },
}[s] || { bg: "#F3F4F6", color: "#6B7280" });

const urgencyStyle = (u) => ({
  "높음": { bg: "#FEE2E2", color: "#DC2626" },
  "중간": { bg: "#FEF9C3", color: "#CA8A04" },
  "낮음": { bg: "#F0FDF4", color: "#16A34A" },
}[u] || { bg: "#F3F4F6", color: "#6B7280" });

// ─────────────────────────────────────────────────────────────────────────────
// 2. MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const ALL_CANDIDATES = [
  { id:1,  name:"김지현",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"docs",  stageStatus:"진행중",  days:14, alert:true,  공고id:1,  enteredAt:"2026-06-18" },
  { id:2,  name:"이상혁",  jobTitle:"Product Manager",        직군:"서비스비즈", 담당자:"elena.62",  직원유형:"정규직",    부서:"Product",     stage:"docs",  stageStatus:"진행중",  days:3,  alert:false, 공고id:6,  enteredAt:"2026-06-29" },
  { id:3,  name:"박민준",  jobTitle:"Data Analyst",           직군:"테크",      담당자:"jamie.bk",  직원유형:"계약직",    부서:"Data",        stage:"docs",  stageStatus:"합격",    days:1,  alert:false, 공고id:4,  enteredAt:"2026-07-01" },
  { id:22, name:"강서준",  jobTitle:"iOS Engineer",           직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"docs",  stageStatus:"진행중",  days:5,  alert:false, 공고id:1,  enteredAt:"2026-06-27" },
  { id:23, name:"윤하린",  jobTitle:"서비스 기획자",           직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"정규직",    부서:"Strategy",    stage:"docs",  stageStatus:"탈락",    days:8,  alert:true,  공고id:7,  enteredAt:"2026-06-24" },
  { id:24, name:"백승호",  jobTitle:"Visual Designer",        직군:"디자인",    담당자:"elena.62",  직원유형:"인턴",      부서:"Design",      stage:"docs",  stageStatus:"진행중",  days:2,  alert:false, 공고id:3,  enteredAt:"2026-06-30" },
  { id:25, name:"임채원",  jobTitle:"Business Development",   직군:"스태프",    담당자:"zoe.parc",  직원유형:"경영계약직", 부서:"Biz",         stage:"docs",  stageStatus:"진행중",  days:4,  alert:false, 공고id:8,  enteredAt:"2026-06-28" },
  { id:26, name:"문지호",  jobTitle:"Frontend Engineer",      직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"docs",  stageStatus:"스킵",    days:6,  alert:false, 공고id:2,  enteredAt:"2026-06-26" },
  { id:4,  name:"최유빈",  jobTitle:"Product Designer",       직군:"디자인",    담당자:"elena.62",  직원유형:"정규직",    부서:"Design",      stage:"rec",   stageStatus:"진행중",  recommended:true, 공고id:3,  enteredAt:"2026-06-20" },
  { id:5,  name:"정현우",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"rec",   stageStatus:"작성완료", recommended:true, 공고id:1,  enteredAt:"2026-06-15" },
  { id:27, name:"송나연",  jobTitle:"UX Researcher",          직군:"디자인",    담당자:"elena.62",  직원유형:"계약직",    부서:"Design",      stage:"rec",   stageStatus:"진행중",  recommended:true, 공고id:3,  enteredAt:"2026-06-22" },
  { id:28, name:"류태민",  jobTitle:"DevOps Engineer",        직군:"테크",      담당자:"jamie.bk",  직원유형:"전문계약직", 부서:"Infra",       stage:"rec",   stageStatus:"작성완료", recommended:true, 공고id:5,  enteredAt:"2026-06-18" },
  { id:6,  name:"오준석",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"code",  stageStatus:"진행중",  days:7, alert:true,  공고id:1,  enteredAt:"2026-06-10" },
  { id:7,  name:"배소영",  jobTitle:"Frontend Engineer",      직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"code",  stageStatus:"평가필요", days:3, alert:true,  공고id:2,  enteredAt:"2026-06-14" },
  { id:29, name:"한동혁",  jobTitle:"iOS Engineer",           직군:"테크",      담당자:"jamie.bk",  직원유형:"정규직",    부서:"Mobile",      stage:"code",  stageStatus:"보류",    days:2, alert:false, 공고id:9,  enteredAt:"2026-06-25" },
  { id:30, name:"노지영",  jobTitle:"Data Engineer",          직군:"테크",      담당자:"jamie.bk",  직원유형:"계약직",    부서:"Data",        stage:"code",  stageStatus:"탈락",    days:5, alert:false, 공고id:4,  enteredAt:"2026-06-12" },
  { id:8,  name:"이수빈",  jobTitle:"Product Designer",       직군:"디자인",    담당자:"elena.62",  직원유형:"정규직",    부서:"Design",      stage:"task",  stageStatus:"진행중",  days:5, alert:true,  공고id:3,  enteredAt:"2026-06-10" },
  { id:9,  name:"김태연",  jobTitle:"UX Designer",            직군:"디자인",    담당자:"elena.62",  직원유형:"인턴",      부서:"Design",      stage:"task",  stageStatus:"진행중",  days:2, alert:true,  공고id:3,  enteredAt:"2026-06-13" },
  { id:31, name:"구민재",  jobTitle:"서비스 기획자",           직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"정규직",    부서:"Product",     stage:"task",  stageStatus:"합격",    days:0, alert:false, 공고id:7,  enteredAt:"2026-06-15" },
  { id:10, name:"이지훈",  jobTitle:"Data Scientist",         직군:"테크",      담당자:"jamie.bk",  직원유형:"정규직",    부서:"Data",        stage:"pre",   stageStatus:"진행중",  days:1, 공고id:4,  enteredAt:"2026-06-20" },
  { id:11, name:"조아라",  jobTitle:"Product Manager",        직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"정규직",    부서:"Product",     stage:"pre",   stageStatus:"합격",    공고id:6,  enteredAt:"2026-06-18" },
  { id:32, name:"심예은",  jobTitle:"Brand Designer",         직군:"디자인",    담당자:"elena.62",  직원유형:"계약직",    부서:"Marketing",   stage:"pre",   stageStatus:"스킵",    공고id:10, enteredAt:"2026-06-22" },
  { id:12, name:"허인서",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"int1",  stageStatus:"진행중",  dueDate:"5/30 (금)", 공고id:1,  enteredAt:"2026-06-05" },
  { id:13, name:"박성민",  jobTitle:"DevOps Engineer",        직군:"테크",      담당자:"jamie.bk",  직원유형:"전문계약직", 부서:"Infra",       stage:"int1",  stageStatus:"진행중",  dueDate:"5/29 (목)", 공고id:5,  enteredAt:"2026-06-08" },
  { id:33, name:"전혜진",  jobTitle:"Marketing Manager",      직군:"스태프",    담당자:"zoe.parc",  직원유형:"정규직",    부서:"Marketing",   stage:"int1",  stageStatus:"합격",    dueDate:"5/31 (토)", 공고id:10, enteredAt:"2026-06-14" },
  { id:34, name:"남기준",  jobTitle:"서비스 운영",             직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"어시스턴트", 부서:"Operations",  stage:"int1",  stageStatus:"탈락",    dueDate:"5/28 (수)", 공고id:11, enteredAt:"2026-06-10" },
  { id:35, name:"황소연",  jobTitle:"Android Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Mobile",      stage:"int1",  stageStatus:"진행중",  dueDate:"6/1 (일)",  공고id:12, enteredAt:"2026-06-12" },
  { id:14, name:"윤지호",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"int2",  stageStatus:"진행중",  dueDate:"5/28 (수)", 공고id:1,  enteredAt:"2026-05-28" },
  { id:15, name:"장예은",  jobTitle:"Product Manager",        직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"정규직",    부서:"Product",     stage:"int2",  stageStatus:"합격",    dueDate:"5/30 (금)", 공고id:6,  enteredAt:"2026-05-30" },
  { id:36, name:"권도훈",  jobTitle:"Finance Manager",        직군:"스태프",    담당자:"zoe.parc",  직원유형:"경영계약직", 부서:"Finance",     stage:"int2",  stageStatus:"진행중",  dueDate:"5/29 (목)", 공고id:13, enteredAt:"2026-06-02" },
  { id:16, name:"김민석",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"ref",   stageStatus:"진행중",  refStatus:"진행 중", 공고id:1,  enteredAt:"2026-05-20" },
  { id:17, name:"임서연",  jobTitle:"Data Scientist",         직군:"테크",      담당자:"jamie.bk",  직원유형:"정규직",    부서:"Data",        stage:"ref",   stageStatus:"완료",    refStatus:"대기 중", 공고id:4,  enteredAt:"2026-05-22" },
  { id:18, name:"한지민",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"offer", stageStatus:"진행중",  days:7, alert:true,  공고id:1,  enteredAt:"2026-05-15" },
  { id:19, name:"유승현",  jobTitle:"Product Manager",        직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"정규직",    부서:"Product",     stage:"offer", stageStatus:"제안",    days:3, alert:true,  공고id:6,  enteredAt:"2026-05-18" },
  { id:37, name:"차민호",  jobTitle:"ML Engineer",            직군:"테크",      담당자:"jamie.bk",  직원유형:"전문계약직", 부서:"AI",          stage:"offer", stageStatus:"수락",    days:1, alert:false, 공고id:14, enteredAt:"2026-04-20" },
  { id:20, name:"전우진",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"final", stageStatus:"입사확정",       joinDate:"입사일 6/2", 공고id:1,  enteredAt:"2026-05-10" },
  { id:21, name:"박소연",  jobTitle:"UX Designer",            직군:"디자인",    담당자:"elena.62",  직원유형:"정규직",    부서:"Design",      stage:"final", stageStatus:"추가정보 입력중", joinDate:"입사일 6/1", 공고id:3,  enteredAt:"2026-05-12" },
  { id:38, name:"안혜원",  jobTitle:"HR Business Partner",    직군:"스태프",    담당자:"zoe.parc",  직원유형:"정규직",    부서:"HR",          stage:"final", stageStatus:"입사확정",       joinDate:"입사일 6/5", 공고id:15, enteredAt:"2026-05-08" },
];

const ALL_JOB_POSTINGS = [
  { id:1,  title:"Backend Engineer (Server)",    직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", 상태:"진행중", applied:24, offer:2, target:3, urgency:"높음", openDate:"2026-05-12", deadline:"2026.08.30" },
  { id:2,  title:"Frontend Engineer",            직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", 상태:"진행중", applied:16, offer:1, target:2, urgency:"중간", openDate:"2026-05-20", deadline:"2026.08.15" },
  { id:3,  title:"Product Designer",             직군:"디자인",    담당자:"elena.62",  직원유형:"정규직",    부서:"Design",      상태:"진행중", applied:11, offer:1, target:2, urgency:"높음", openDate:"2026-05-25", deadline:"2026.08.10" },
  { id:4,  title:"Data Scientist",               직군:"테크",      담당자:"jamie.bk",  직원유형:"정규직",    부서:"Data",        상태:"진행중", applied:9,  offer:0, target:1, urgency:"중간", openDate:"2026-06-01", deadline:"2026.08.20" },
  { id:5,  title:"DevOps Engineer",              직군:"테크",      담당자:"jamie.bk",  직원유형:"전문계약직", 부서:"Infra",       상태:"진행중", applied:7,  offer:0, target:1, urgency:"중간", openDate:"2026-06-03", deadline:"2026.08.18" },
  { id:6,  title:"Product Manager",              직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"정규직",    부서:"Product",     상태:"진행중", applied:14, offer:2, target:2, urgency:"높음", openDate:"2026-05-18", deadline:"2026.08.25" },
  { id:7,  title:"서비스 기획자",                직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"정규직",    부서:"Strategy",    상태:"진행중", applied:10, offer:1, target:2, urgency:"중간", openDate:"2026-05-28", deadline:"2026.08.22" },
  { id:8,  title:"Business Development Manager", 직군:"스태프",    담당자:"zoe.parc",  직원유형:"경영계약직", 부서:"Biz",         상태:"진행중", applied:6,  offer:0, target:1, urgency:"낮음", openDate:"2026-06-05", deadline:"2026.09.01" },
  { id:9,  title:"iOS Engineer",                 직군:"테크",      담당자:"jamie.bk",  직원유형:"정규직",    부서:"Mobile",      상태:"대기중", applied:0,  offer:0, target:2, urgency:"중간", openDate:"2026-06-20", deadline:"2026.09.10" },
  { id:10, title:"Marketing Manager",            직군:"스태프",    담당자:"zoe.parc",  직원유형:"정규직",    부서:"Marketing",   상태:"진행중", applied:5,  offer:0, target:1, urgency:"낮음", openDate:"2026-06-10", deadline:"2026.08.05" },
  { id:11, title:"서비스 운영 매니저",            직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"어시스턴트", 부서:"Operations",  상태:"완료",   applied:12, offer:2, target:2, urgency:"낮음", openDate:"2026-04-15", deadline:"2026.07.31" },
  { id:12, title:"Android Engineer",             직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Mobile",      상태:"진행중", applied:9,  offer:0, target:2, urgency:"중간", openDate:"2026-06-02", deadline:"2026.08.28" },
  { id:13, title:"Finance Manager",              직군:"스태프",    담당자:"zoe.parc",  직원유형:"경영계약직", 부서:"Finance",     상태:"진행중", applied:4,  offer:0, target:1, urgency:"낮음", openDate:"2026-06-08", deadline:"2026.09.05" },
  { id:14, title:"ML Engineer",                  직군:"테크",      담당자:"jamie.bk",  직원유형:"전문계약직", 부서:"AI",          상태:"완료",   applied:6,  offer:1, target:1, urgency:"높음", openDate:"2026-04-01", deadline:"2026.07.20" },
  { id:15, title:"HR Business Partner",          직군:"스태프",    담당자:"zoe.parc",  직원유형:"정규직",    부서:"HR",          상태:"취소",   applied:3,  offer:0, target:1, urgency:"낮음", openDate:"2026-05-10", deadline:"2026.08.01" },
  { id:16, title:"UX Researcher",                직군:"디자인",    담당자:"elena.62",  직원유형:"계약직",    부서:"Design",      상태:"대기중", applied:0,  offer:0, target:1, urgency:"낮음", openDate:"2026-06-25", deadline:"2026.09.15" },
  { id:17, title:"Brand Designer",               직군:"디자인",    담당자:"elena.62",  직원유형:"계약직",    부서:"Marketing",   상태:"취소",   applied:5,  offer:0, target:1, urgency:"낮음", openDate:"2026-04-20", deadline:"2026.07.15" },
  { id:18, title:"Data Engineer",                직군:"테크",      담당자:"jamie.bk",  직원유형:"계약직",    부서:"Data",        상태:"대기중", applied:0,  offer:0, target:1, urgency:"낮음", openDate:"2026-06-28", deadline:"2026.09.20" },
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
// 3. SMALL UI COMPONENTS
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
        <Badge text={candidate.stage} bg="#EFF6FF" color="#3B82F6"/>
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
        {[["직군",job.직군],["직원유형",job.직원유형],["채용 인원","2명"],["지원자 수",`${job.applied}명`],["인터뷰 진행",`${job.interview||0}명`],["오퍼 발송",`${job.offer}명`]].map(([k,v])=>(
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

function GoalBar({ hired, target }) {
  const pct = target > 0 ? Math.min(100, Math.round((hired / target) * 100)) : 0;
  const color = pct >= 100 ? "#10B981" : pct >= 60 ? "#3B82F6" : "#F59E0B";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
      <div style={{ flex:1, height:5, background:"#F3F4F6", borderRadius:999, overflow:"hidden" }}>
        <div style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:999, transition:"width 0.3s" }}/>
      </div>
      <span style={{ fontSize:11, color, fontWeight:700, whiteSpace:"nowrap" }}>{hired}/{target}명</span>
    </div>
  );
}

function AvgDaysBar({ candidates }) {
  const stageGroups = {};
  candidates.forEach(c => {
    if (!c.enteredAt) return;
    const d = elapsedDays(c.enteredAt);
    if (!stageGroups[c.stage]) stageGroups[c.stage] = [];
    stageGroups[c.stage].push(d);
  });
  const rows = STAGE_ORDER
    .map(s => {
      const arr = stageGroups[s.id] || [];
      const avg = arr.length ? Math.round(arr.reduce((a,b)=>a+b,0)/arr.length) : null;
      return { ...s, avg, count: arr.length };
    })
    .filter(s => s.count > 0);
  if (rows.length === 0) return <div style={{ fontSize:12, color:"#9CA3AF" }}>데이터 없음</div>;
  const maxAvg = Math.max(...rows.map(r => r.avg || 0), 1);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
      {rows.map(r => {
        const warn = r.avg > 14;
        return (
          <div key={r.id} style={{ display:"grid", gridTemplateColumns:"60px 1fr 44px", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:11, color:"#6B7280", textAlign:"right" }}>{r.label}</span>
            <div style={{ height:6, background:"#F3F4F6", borderRadius:999, overflow:"hidden" }}>
              <div style={{ width:`${(r.avg/maxAvg)*100}%`, height:"100%", background: warn?"#EF4444":"#3B82F6", borderRadius:999 }}/>
            </div>
            <span style={{ fontSize:11, fontWeight:600, color: warn?"#EF4444":"#374151" }}>평균 {r.avg}일</span>
          </div>
        );
      })}
    </div>
  );
}

function StagePipeline({ jobId, isActive }) {
  if (!isActive) return <span style={{ color:"#D1D5DB", fontSize:13 }}>—</span>;
  const stageMap = {};
  ALL_CANDIDATES
    .filter(c => c.공고id === jobId)
    .forEach(c => { stageMap[c.stage] = (stageMap[c.stage] || 0) + 1; });
  const active = STAGE_ORDER.filter(s => stageMap[s.id]).map(s => ({ ...s, count: stageMap[s.id] }));
  if (active.length === 0) return <span style={{ color:"#D1D5DB", fontSize:13 }}>—</span>;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:3, flexWrap:"wrap" }}>
      {active.map((s, i) => (
        <span key={s.id} style={{ display:"flex", alignItems:"center", gap:3 }}>
          {i > 0 && <span style={{ color:"#CBD5E1", fontSize:10 }}>›</span>}
          <span style={{ display:"inline-flex", alignItems:"center", gap:3, padding:"2px 7px", borderRadius:999, fontSize:11, fontWeight:500, background:"#EFF6FF", color:"#2563EB" }}>
            {s.label}
            <span style={{ background:"#2563EB", color:"#fff", borderRadius:"50%", minWidth:16, height:16, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700 }}>
              {s.count}
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TAB CONTENT COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// 탭1: 공고별 단계현황
function JobStageTab({ filteredJobs, jobTab, setJobTab, tabCounts, setSelectedJob }) {
  const jobsForTab = filteredJobs.filter(j => j.상태 === jobTab);
  return (
    <div>
      <div style={{ display:"flex", gap:0, borderBottom:"1px solid #E5E7EB", marginBottom:10 }}>
        {["진행중","대기중"].map(label => (
          <button key={label} onClick={() => setJobTab(label)}
            style={{ padding:"6px 14px", border:"none", background:"transparent", cursor:"pointer", fontSize:13, fontWeight:jobTab===label?700:400, color:jobTab===label?"#3B82F6":"#6B7280", borderBottom:jobTab===label?"2px solid #3B82F6":"2px solid transparent", marginBottom:-1 }}>
            {label} <span style={{ fontSize:11, fontWeight:600 }}>{tabCounts[label]}</span>
          </button>
        ))}
      </div>
      <div style={{ overflow:"auto" }}>
        {jobsForTab.length === 0
          ? <EmptyState message="조건에 맞는 공고가 없습니다"/>
          : (
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid #F3F4F6" }}>
                {["공고명","직군","담당자","지원","인터뷰","합격","목표 달성","전형 현황"].map(h => (
                  <th key={h} style={{ padding:"6px 8px", textAlign:"left", color:"#9CA3AF", fontWeight:500, whiteSpace:"nowrap", fontSize:12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobsForTab.map(job => {
                const isActive = job.상태 === "진행중";
                const interviewCount = ALL_CANDIDATES.filter(c => c.공고id === job.id && ["pre","int1","int2"].includes(c.stage)).length;
                return (
                <tr key={job.id} onClick={() => setSelectedJob(job)}
                  style={{ borderBottom:"1px solid #F9FAFB", cursor:"pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background="#F9FAFB"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"10px 8px", fontWeight:600, color:"#111", whiteSpace:"nowrap", maxWidth:200, overflow:"hidden", textOverflow:"ellipsis" }}>{job.title}</td>
                  <td style={{ padding:"10px 8px", color:"#6B7280" }}>{job.직군}</td>
                  <td style={{ padding:"10px 8px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <Avatar name={job.담당자[0]} size={20}/>
                      <span style={{ color:"#374151", fontSize:12 }}>{job.담당자}</span>
                    </div>
                  </td>
                  <td style={{ padding:"10px 8px", color:"#374151", textAlign:"center", fontWeight:500 }}>{isActive ? job.applied : "—"}</td>
                  <td style={{ padding:"10px 8px", color:"#374151", textAlign:"center", fontWeight:500 }}>{isActive ? interviewCount : "—"}</td>
                  <td style={{ padding:"10px 8px", color:"#374151", textAlign:"center", fontWeight:500 }}>{isActive ? job.offer : "—"}</td>
                  <td style={{ padding:"10px 8px", minWidth:120 }}>
                    {isActive
                      ? <GoalBar hired={ALL_CANDIDATES.filter(c=>c.공고id===job.id&&c.stage==="final").length} target={job.target}/>
                      : <span style={{ color:"#D1D5DB", fontSize:13 }}>—</span>}
                  </td>
                  <td style={{ padding:"10px 8px", minWidth:180 }}>
                    <StagePipeline jobId={job.id} isActive={isActive}/>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {jobsForTab.length > 0 && (
        <div style={{ fontSize:12, color:"#9CA3AF", padding:"8px 0", textAlign:"center" }}>총 {jobsForTab.length}개 공고</div>
      )}
    </div>
  );
}

// 탭2: 액션필요
function ActionTab({ filteredActions, actionFilter, setActionFilter, setSelectedCandidate }) {
  return (
    <div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
        {ACTION_TAGS.map(tag => {
          const count = tag === "전체" ? ACTION_ITEMS.length : ACTION_ITEMS.filter(a => a.tag === tag).length;
          return (
            <button key={tag} onClick={() => setActionFilter(tag)}
              style={{ padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:500, cursor:"pointer", border:`1px solid ${actionFilter===tag?"#3B82F6":"#E5E7EB"}`, background:actionFilter===tag?"#EFF6FF":"#fff", color:actionFilter===tag?"#3B82F6":"#6B7280" }}>
              {tag} {count}
            </button>
          );
        })}
      </div>
      {filteredActions.length === 0
        ? <EmptyState message="액션 항목 없음"/>
        : (
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:"1px solid #F3F4F6" }}>
              {["유형","지원자","액션 내용","긴급도"].map(h => (
                <th key={h} style={{ padding:"6px 10px", textAlign:"left", color:"#9CA3AF", fontWeight:500, fontSize:12, whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredActions.map(item => (
              <tr key={item.id}
                style={{ borderBottom:"1px solid #F9FAFB", cursor:"pointer" }}
                onClick={() => setSelectedCandidate(ALL_CANDIDATES.find(c => c.name === item.candidateName) || { name:item.candidateName, jobTitle:item.candidateRole, code:"—", stage:"docs", 직군:"—", 담당자:"—", 직원유형:"—", 부서:item.부서 })}
                onMouseEnter={e => e.currentTarget.style.background="#F9FAFB"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                <td style={{ padding:"11px 10px" }}>
                  <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:999, fontSize:11, fontWeight:500, background:item.tagBg, color:item.tagColor, whiteSpace:"nowrap" }}>{item.tag}</span>
                </td>
                <td style={{ padding:"11px 10px" }}>
                  <div style={{ fontWeight:600, color:"#111", fontSize:13 }}>{item.candidateName}</div>
                  <div style={{ fontSize:11, color:"#9CA3AF", marginTop:1 }}>{item.candidateRole}</div>
                </td>
                <td style={{ padding:"11px 10px", color:"#374151", fontSize:13 }}>{item.action}</td>
                <td style={{ padding:"11px 10px" }}>
                  <span style={{ fontSize:12, fontWeight:600, color:item.urgencyColor }}>{item.urgency}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// 탭3: 공고별 전형 진행율
function ProgressTab({ filteredJobs }) {
  const activeJobs = filteredJobs.filter(j => j.상태 === "진행중");
  if (activeJobs.length === 0) return <EmptyState message="진행 중인 공고가 없습니다"/>;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {activeJobs.map(job => {
        const candidates = ALL_CANDIDATES.filter(c => c.공고id === job.id);
        const total = candidates.length;
        const stageIdx = (stageId) => STAGE_ORDER.findIndex(s => s.id === stageId);
        const stageOrder = STAGE_ORDER.map(s => s.id);

        // funnel counts
        const applied   = job.applied;
        const interview = candidates.filter(c => ["pre","int1","int2"].includes(c.stage)).length;
        const offer     = candidates.filter(c => ["offer"].includes(c.stage)).length + job.offer;
        const hired     = candidates.filter(c => c.stage === "final").length;
        const target    = job.target;

        // 전형 진행율: weighted average stage progress
        const avgProgress = total > 0
          ? Math.round(candidates.reduce((sum, c) => sum + (stageIdx(c.stage) + 1) / STAGE_ORDER.length * 100, 0) / total)
          : 0;

        // stage distribution
        const stageDistribution = STAGE_ORDER.map(s => ({
          ...s,
          count: candidates.filter(c => c.stage === s.id).length,
        })).filter(s => s.count > 0);

        const completionPct = target > 0 ? Math.min(100, Math.round(hired / target * 100)) : 0;
        const completionColor = completionPct >= 100 ? "#10B981" : completionPct >= 60 ? "#3B82F6" : "#F59E0B";

        return (
          <div key={job.id} style={{ border:"1px solid #E5E7EB", borderRadius:10, padding:"14px 16px", background:"#fff" }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12, gap:12 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <span style={{ fontWeight:700, fontSize:14, color:"#111" }}>{job.title}</span>
                  <Badge text={job.직군} bg="#F3F4F6" color="#374151" small/>
                  <Badge text={job.urgency} bg={urgencyStyle(job.urgency).bg} color={urgencyStyle(job.urgency).color} small/>
                </div>
                <div style={{ fontSize:11, color:"#9CA3AF" }}>담당 {job.담당자} · {job.부서}</div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:22, fontWeight:700, color:completionColor }}>{completionPct}%</div>
                <div style={{ fontSize:11, color:"#9CA3AF" }}>목표 달성률</div>
              </div>
            </div>

            {/* 목표 달성 프로그레스바 */}
            <div style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                <span style={{ fontSize:11, color:"#6B7280", fontWeight:500 }}>채용 목표 달성</span>
                <span style={{ fontSize:11, color:completionColor, fontWeight:600 }}>{hired}/{target}명 입사 확정</span>
              </div>
              <div style={{ height:7, background:"#F3F4F6", borderRadius:999, overflow:"hidden" }}>
                <div style={{ width:`${completionPct}%`, height:"100%", background:completionColor, borderRadius:999, transition:"width 0.3s" }}/>
              </div>
            </div>

            {/* 지원→인터뷰→처우→입사 퍼넬 */}
            <div style={{ display:"flex", gap:0, marginBottom:12, background:"#F9FAFB", borderRadius:8, overflow:"hidden" }}>
              {[
                { label:"지원", value:applied,   color:"#3B82F6" },
                { label:"인터뷰", value:interview, color:"#8B5CF6" },
                { label:"처우", value:offer,    color:"#F59E0B" },
                { label:"입사예정", value:hired,  color:"#10B981" },
              ].map((step, i, arr) => (
                <div key={step.label} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"10px 4px", borderRight: i < arr.length-1 ? "1px solid #E5E7EB" : "none" }}>
                  <div style={{ fontSize:18, fontWeight:700, color:step.color }}>{step.value}</div>
                  <div style={{ fontSize:11, color:"#9CA3AF", marginTop:2 }}>{step.label}</div>
                  {i < arr.length-1 && arr[i+1].value > 0 && applied > 0 && (
                    <div style={{ fontSize:10, color:"#D1D5DB", marginTop:2 }}>
                      {Math.round(arr[i+1].value / (step.value||1) * 100)}%
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 전형별 후보자 분포 */}
            {stageDistribution.length > 0 && (
              <div>
                <div style={{ fontSize:11, color:"#9CA3AF", marginBottom:6 }}>전형별 후보자 분포</div>
                <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                  {stageDistribution.map(s => (
                    <div key={s.id} style={{ display:"flex", alignItems:"center", gap:4, padding:"3px 8px", background:"#EFF6FF", borderRadius:999 }}>
                      <span style={{ fontSize:11, color:"#2563EB", fontWeight:500 }}>{s.label}</span>
                      <span style={{ background:"#2563EB", color:"#fff", borderRadius:"50%", minWidth:16, height:16, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700 }}>{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function RecruitDashboard() {
  const [activeNav, setActiveNav]               = useState("대시보드");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedJob, setSelectedJob]           = useState(null);
  const [jobTab, setJobTab]                     = useState("진행중");
  const [actionFilter, setActionFilter]         = useState("전체");
  const [selectedJikgun, setSelectedJikgun]     = useState([]);
  const [selectedJikwon, setSelectedJikwon]     = useState([]);
  const [landingPreset, setLandingPreset]       = useState(LANDING_PRESETS[0]);
  const [selectedKPI, setSelectedKPI]           = useState(null);
  const [contentTab, setContentTab]             = useState("공고별 단계현황");

  const toggleJikgun = (v) => setSelectedJikgun(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  const toggleJikwon = (v) => setSelectedJikwon(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  const filteredCandidates = useMemo(() => ALL_CANDIDATES.filter(c => {
    if (selectedJikgun.length > 0 && !selectedJikgun.includes(c.직군)) return false;
    if (selectedJikwon.length > 0 && !selectedJikwon.includes(c.직원유형)) return false;
    if (landingPreset.담당자 && c.담당자 !== landingPreset.담당자) return false;
    return true;
  }), [selectedJikgun, selectedJikwon, landingPreset]);

  const filteredJobs = useMemo(() => ALL_JOB_POSTINGS.filter(j => {
    if (selectedJikgun.length > 0 && !selectedJikgun.includes(j.직군)) return false;
    if (selectedJikwon.length > 0 && !selectedJikwon.includes(j.직원유형)) return false;
    if (landingPreset.담당자 && j.담당자 !== landingPreset.담당자) return false;
    return true;
  }), [selectedJikgun, selectedJikwon, landingPreset]);

  const tabCounts = useMemo(() => ({
    진행중: filteredJobs.filter(j => j.상태 === "진행중").length,
    대기중: filteredJobs.filter(j => j.상태 === "대기중").length,
  }), [filteredJobs]);

  const summaryCards = useMemo(() => [
    { label:"오픈 공고",      value:filteredJobs.filter(j=>j.상태==="진행중").length,                            delta:3,  up:true,  bg:"#EFF6FF", icon:"📋" },
    { label:"진행 중 후보자", value:filteredCandidates.length,                                                   delta:18, up:true,  bg:"#F5F3FF", icon:"👥" },
    { label:"이번주 인터뷰",  value:filteredCandidates.filter(c=>["int1","int2","pre"].includes(c.stage)).length, delta:7,  up:true,  bg:"#ECFDF5", icon:"📅" },
    { label:"처우협의 중",    value:filteredCandidates.filter(c=>c.stage==="offer").length,                      delta:1,  up:false, bg:"#FFFBEB", icon:"🤝" },
    { label:"최종입사 예정",  value:filteredCandidates.filter(c=>c.stage==="final").length,                      delta:1,  up:true,  bg:"#ECFEFF", icon:"🎯" },
  ], [filteredCandidates, filteredJobs]);

  const kpiDetails = useMemo(() => {
    if (!selectedKPI) return null;
    switch (selectedKPI) {
      case "오픈 공고":      return filteredJobs.filter(j => j.상태 === "진행중");
      case "진행 중 후보자": return filteredCandidates;
      case "이번주 인터뷰":  return filteredCandidates.filter(c => ["int1","int2","pre"].includes(c.stage));
      case "처우협의 중":    return filteredCandidates.filter(c => c.stage === "offer");
      case "최종입사 예정":  return filteredCandidates.filter(c => c.stage === "final");
      default: return null;
    }
  }, [selectedKPI, filteredJobs, filteredCandidates]);

  const filteredActions = useMemo(() => {
    const tagFiltered = actionFilter === "전체" ? ACTION_ITEMS : ACTION_ITEMS.filter(a => a.tag === actionFilter);
    return tagFiltered.filter(item => {
      const candidate = ALL_CANDIDATES.find(c => c.name === item.candidateName);
      if (!candidate) return true;
      if (selectedJikgun.length > 0 && !selectedJikgun.includes(candidate.직군)) return false;
      if (selectedJikwon.length > 0 && !selectedJikwon.includes(candidate.직원유형)) return false;
      if (landingPreset.담당자 && candidate.담당자 !== landingPreset.담당자) return false;
      return true;
    });
  }, [actionFilter, selectedJikgun, selectedJikwon, landingPreset]);

  const hasFilterActive = selectedJikgun.length > 0 || selectedJikwon.length > 0;

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'Pretendard','Apple SD Gothic Neo','Inter',sans-serif", background:"#F9FAFB" }}>

      {/* ── Left Sidebar ── */}
      <aside style={{ width:180, background:"#fff", borderRight:"1px solid #E5E7EB", display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"18px 16px 14px", borderBottom:"1px solid #F3F4F6", display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, background:"#3B82F6", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontSize:14 }}>🔍</span>
          </div>
          <span style={{ fontWeight:700, fontSize:14, color:"#111" }}>영입 대시보드</span>
        </div>
        <nav style={{ padding:"10px 8px", flex:1, overflowY:"auto" }}>
          {NAV_ITEMS.map(({icon:Icon, label, href}) => (
            href ? (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"9px 10px", borderRadius:7, border:"none", cursor:"pointer", background:"transparent", color:"#6B7280", fontWeight:400, fontSize:13, marginBottom:2, textAlign:"left", textDecoration:"none" }}
                onMouseEnter={e=>e.currentTarget.style.background="#EFF6FF"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <Icon size={16}/>{label}
              </a>
            ) : (
              <button key={label} onClick={() => setActiveNav(label)}
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
          <div style={{ margin:"8px 10px", padding:"10px", background:"#F9FAFB", borderRadius:8, border:"1px solid #E5E7EB" }}>
            <div style={{ fontSize:10, color:"#9CA3AF", marginBottom:8 }}>공고 보기</div>
            <div style={{ display:"flex", background:"#E5E7EB", borderRadius:6, padding:2, gap:2 }}>
              {LANDING_PRESETS.map(preset => (
                <button key={preset.key} onClick={() => setLandingPreset(preset)}
                  style={{ flex:1, padding:"5px 0", fontSize:11, fontWeight:landingPreset.key===preset.key?700:400, border:"none", borderRadius:5, cursor:"pointer", background:landingPreset.key===preset.key?"#fff":"transparent", color:landingPreset.key===preset.key?"#2563EB":"#6B7280", boxShadow:landingPreset.key===preset.key?"0 1px 3px rgba(0,0,0,0.12)":"none", transition:"all 0.15s" }}>
                  {preset.key === "all" ? "전체" : "내 담당"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* ── Header ── */}
        <header style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"0 16px", height:54, display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <h1 style={{ margin:0, fontSize:15, fontWeight:700, color:"#111" }}>대시보드</h1>
          <div style={{ flex:1 }}/>
          <div style={{ display:"flex", alignItems:"center", gap:7, cursor:"pointer" }}>
            <Avatar name="김" size={28}/>
            <div style={{ lineHeight:1.3 }}>
              <div style={{ fontSize:12, fontWeight:600, color:"#111" }}>김영입</div>
              <div style={{ fontSize:10, color:"#9CA3AF" }}>영입팀</div>
            </div>
          </div>
        </header>

        {/* ── Scrollable area (filter sticky inside) ── */}
        <div style={{ flex:1, overflow:"auto" }}>

          {/* ── Sticky Filter Bar ── */}
          <div style={{ position:"sticky", top:0, zIndex:10, background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"9px 16px", display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ fontSize:12, color:"#9CA3AF", fontWeight:700, whiteSpace:"nowrap" }}>직군</span>
              {JIKGUN_OPTIONS.map(v => (
                <button key={v} onClick={() => toggleJikgun(v)}
                  style={{ padding:"4px 13px", borderRadius:999, fontSize:12, fontWeight:500, cursor:"pointer", transition:"all 0.12s", border:`1px solid ${selectedJikgun.includes(v)?"#3B82F6":"#E5E7EB"}`, background:selectedJikgun.includes(v)?"#EFF6FF":"#fff", color:selectedJikgun.includes(v)?"#2563EB":"#6B7280" }}>
                  {v}
                </button>
              ))}
            </div>
            <div style={{ width:1, height:18, background:"#E5E7EB", flexShrink:0 }}/>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ fontSize:12, color:"#9CA3AF", fontWeight:700, whiteSpace:"nowrap" }}>직원유형</span>
              {JIKWON_OPTIONS.map(v => (
                <button key={v} onClick={() => toggleJikwon(v)}
                  style={{ padding:"4px 13px", borderRadius:999, fontSize:12, fontWeight:500, cursor:"pointer", transition:"all 0.12s", border:`1px solid ${selectedJikwon.includes(v)?"#3B82F6":"#E5E7EB"}`, background:selectedJikwon.includes(v)?"#EFF6FF":"#fff", color:selectedJikwon.includes(v)?"#2563EB":"#6B7280" }}>
                  {v}
                </button>
              ))}
            </div>
            {hasFilterActive && (
              <button onClick={() => { setSelectedJikgun([]); setSelectedJikwon([]); }}
                style={{ marginLeft:"auto", fontSize:12, color:"#EF4444", background:"none", border:"none", cursor:"pointer", fontWeight:600, display:"flex", alignItems:"center", gap:3 }}>
                <X size={12}/>초기화
              </button>
            )}
          </div>

          {/* ── Content ── */}
          <div style={{ padding:16, display:"flex", flexDirection:"column", gap:14 }}>

            {/* KPI Cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10 }}>
              {summaryCards.map(c => (
                <div key={c.label}
                  onClick={() => setSelectedKPI(selectedKPI === c.label ? null : c.label)}
                  style={{ background:selectedKPI===c.label?"#EFF6FF":"#fff", border:`1px solid ${selectedKPI===c.label?"#BFDBFE":"#E5E7EB"}`, borderRadius:10, padding:"13px 13px 11px", cursor:"pointer", transition:"box-shadow 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow="none"}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                    <div style={{ width:34, height:34, borderRadius:"50%", background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>{c.icon}</div>
                    <span style={{ fontSize:11, color:"#6B7280" }}>{c.label}</span>
                  </div>
                  <div style={{ fontSize:26, fontWeight:700, color:"#111", lineHeight:1 }}>{c.value}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:3, marginTop:5 }}>
                    {c.up ? <TrendingUp size={11} color="#10B981"/> : <TrendingDown size={11} color="#EF4444"/>}
                    <span style={{ fontSize:11, color:c.up?"#10B981":"#EF4444", fontWeight:500 }}>{c.up?"↑":"↓"} {c.delta}</span>
                    <span style={{ fontSize:10, color:"#9CA3AF" }}>지난주 대비</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tab Panel */}
            <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:10, overflow:"hidden" }}>
              {/* Tab header */}
              <div style={{ display:"flex", borderBottom:"1px solid #E5E7EB", padding:"0 14px" }}>
                {CONTENT_TABS.map(tab => (
                  <button key={tab} onClick={() => setContentTab(tab)}
                    style={{ padding:"11px 16px", border:"none", background:"transparent", cursor:"pointer", fontSize:13, fontWeight:contentTab===tab?700:400, color:contentTab===tab?"#3B82F6":"#6B7280", borderBottom:contentTab===tab?"2px solid #3B82F6":"2px solid transparent", marginBottom:-1, whiteSpace:"nowrap" }}>
                    {tab}
                    {tab === "액션필요" && (
                      <span style={{ marginLeft:5, background:"#EF4444", color:"#fff", fontSize:10, fontWeight:700, borderRadius:999, padding:"1px 6px" }}>{filteredActions.length}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div style={{ padding:14 }}>
                {contentTab === "공고별 단계현황" && (
                  <JobStageTab
                    filteredJobs={filteredJobs}
                    jobTab={jobTab}
                    setJobTab={setJobTab}
                    tabCounts={tabCounts}
                    setSelectedJob={setSelectedJob}
                  />
                )}
                {contentTab === "액션필요" && (
                  <ActionTab
                    filteredActions={filteredActions}
                    actionFilter={actionFilter}
                    setActionFilter={setActionFilter}
                    setSelectedCandidate={setSelectedCandidate}
                  />
                )}
                {contentTab === "공고별 전형 진행율" && (
                  <ProgressTab filteredJobs={filteredJobs}/>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── KPI Detail Panel ── */}
      {selectedKPI && (
        <div style={{ position:"fixed", top:0, right:0, height:"100vh", width:400, background:"#fff", boxShadow:"-20px 0 40px rgba(2,6,23,0.10)", borderLeft:"1px solid #E5E7EB", display:"flex", flexDirection:"column", zIndex:100 }}>
          <div style={{ padding:"18px 20px 14px", borderBottom:"1px solid #F3F4F6", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
            <div>
              <div style={{ fontWeight:700, fontSize:15, color:"#111" }}>{selectedKPI} 상세</div>
              <div style={{ fontSize:12, color:"#9CA3AF", marginTop:2 }}>총 {kpiDetails?.length ?? 0}건</div>
            </div>
            <button onClick={() => setSelectedKPI(null)} style={{ border:"1px solid #E5E7EB", background:"#F9FAFB", borderRadius:6, color:"#6B7280", cursor:"pointer", fontSize:12, padding:"4px 10px" }}>닫기</button>
          </div>
          {selectedKPI === "오픈 공고" && (() => {
            const jobs = kpiDetails || [];
            const totalApplied   = jobs.reduce((s,j)=>s+j.applied,0);
            const totalInterview = jobs.reduce((s,j)=>s+ALL_CANDIDATES.filter(c=>c.공고id===j.id&&["pre","int1","int2"].includes(c.stage)).length,0);
            const totalOffer     = jobs.reduce((s,j)=>s+j.offer,0);
            const totalHired     = jobs.reduce((s,j)=>s+ALL_CANDIDATES.filter(c=>c.공고id===j.id&&c.stage==="final").length,0);
            const totalTarget    = jobs.reduce((s,j)=>s+j.target,0);
            const pct = (a,b) => b>0?Math.round(a/b*100)+"%" : "—";
            const steps = [
              { label:"지원", val:totalApplied,   rate: null },
              { label:"인터뷰",val:totalInterview,  rate: pct(totalInterview,totalApplied) },
              { label:"오퍼",  val:totalOffer,      rate: pct(totalOffer,totalInterview) },
              { label:"입사",  val:totalHired,      rate: pct(totalHired,totalOffer) },
            ];
            return (
              <div style={{ padding:"14px 20px 0" }}>
                <div style={{ fontSize:12, color:"#9CA3AF", fontWeight:600, marginBottom:10 }}>전환율 퍼넬</div>
                <div style={{ display:"flex", gap:0, alignItems:"stretch", marginBottom:14 }}>
                  {steps.map((s,i)=>(
                    <div key={s.label} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                      <div style={{ width:"100%", background: i===0?"#3B82F6":i===1?"#8B5CF6":i===2?"#F59E0B":"#10B981", borderRadius:6, padding:"8px 4px", textAlign:"center", marginBottom:4 }}>
                        <div style={{ fontSize:16, fontWeight:700, color:"#fff" }}>{s.val}</div>
                        <div style={{ fontSize:10, color:"rgba(255,255,255,0.85)" }}>{s.label}</div>
                      </div>
                      {s.rate && <div style={{ fontSize:11, color:"#6B7280" }}>↓ {s.rate}</div>}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize:12, color:"#9CA3AF", fontWeight:600, marginBottom:8 }}>채용 목표 달성</div>
                <GoalBar hired={totalHired} target={totalTarget}/>
                <div style={{ height:1, background:"#F3F4F6", margin:"14px 0" }}/>
                <div style={{ fontSize:12, color:"#9CA3AF", fontWeight:600, marginBottom:10 }}>단계별 평균 소요일</div>
                <AvgDaysBar candidates={ALL_CANDIDATES.filter(c=>jobs.some(j=>j.id===c.공고id))}/>
                <div style={{ height:1, background:"#F3F4F6", margin:"14px 0" }}/>
                <div style={{ fontSize:12, color:"#9CA3AF", fontWeight:600, marginBottom:8 }}>공고별 목표 달성</div>
              </div>
            );
          })()}
          {selectedKPI !== "오픈 공고" && (
            <div style={{ padding:"14px 20px 0" }}>
              <div style={{ fontSize:12, color:"#9CA3AF", fontWeight:600, marginBottom:10 }}>단계별 평균 소요일</div>
              <AvgDaysBar candidates={kpiDetails||[]}/>
              <div style={{ height:1, background:"#F3F4F6", margin:"14px 0" }}/>
            </div>
          )}
          <div style={{ flex:1, overflowY:"auto", padding:"0 20px 14px", display:"flex", flexDirection:"column", gap:10 }}>
          {(!kpiDetails || kpiDetails.length === 0)
            ? <EmptyState message="선택된 KPI 항목이 없습니다"/>
            : kpiDetails.map(item => (
                <div key={(item.id||item.name)+"-kpi"} style={{ border:"1px solid #E5E7EB", borderRadius:10, padding:14, display:"flex", flexDirection:"column", gap:8, background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
                  {selectedKPI === "오픈 공고" ? (
                    <>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <span style={{ fontWeight:700, fontSize:13, color:"#111" }}>{item.title}</span>
                        <Badge text={item.상태} bg={statusStyle(item.상태).bg} color={statusStyle(item.상태).color} small/>
                      </div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        <span style={{ fontSize:11, color:"#6B7280" }}>{item.직군}</span>
                        <span style={{ color:"#D1D5DB" }}>·</span>
                        <span style={{ fontSize:11, color:"#6B7280" }}>{item.부서}</span>
                        <span style={{ color:"#D1D5DB" }}>·</span>
                        <span style={{ fontSize:11, color:"#6B7280" }}>담당 {item.담당자}</span>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
                        {[["지원자",item.applied],["오퍼",item.offer],["마감",item.deadline]].map(([k,v])=>(
                          <div key={k} style={{ background:"#F9FAFB", borderRadius:7, padding:"8px 10px" }}>
                            <div style={{ fontSize:10, color:"#9CA3AF", marginBottom:2 }}>{k}</div>
                            <div style={{ fontSize:13, fontWeight:600, color:"#111" }}>{v}{k!=="마감"?"명":""}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize:11, color:"#9CA3AF" }}>
                        공고 오픈 {item.openDate.replace(/-/g,".")} · <span style={{ color: elapsedDays(item.openDate) > 60 ? "#EF4444":"#374151", fontWeight:600 }}>D+{elapsedDays(item.openDate)}</span>
                      </div>
                      <StagePipeline jobId={item.id} isActive={item.상태==="진행중"}/>
                    </>
                  ) : (
                    <>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <Avatar name={item.name} size={36}/>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700, fontSize:13, color:"#111" }}>{item.name}</div>
                          <div style={{ fontSize:11, color:"#6B7280" }}>{item.jobTitle}</div>
                        </div>
                        <Badge text={STAGE_LABEL[item.stage]||item.stage} bg="#EFF6FF" color="#2563EB" small/>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                        {[["직군",item.직군],["직원유형",item.직원유형],["담당자",item.담당자],["부서",item.부서]].map(([k,v])=>(
                          <div key={k} style={{ background:"#F9FAFB", borderRadius:7, padding:"7px 10px" }}>
                            <div style={{ fontSize:10, color:"#9CA3AF", marginBottom:2 }}>{k}</div>
                            <div style={{ fontSize:12, fontWeight:500, color:"#111" }}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ fontSize:11, color:"#6B7280" }}>전형 상태:</span>
                        <span style={{ fontSize:12, fontWeight:600, color: item.stageStatus==="탈락"?"#EF4444": item.stageStatus==="합격"||item.stageStatus==="입사확정"?"#10B981":"#374151" }}>
                          {item.stageStatus || "—"}
                        </span>
                        {item.dueDate && <span style={{ fontSize:11, color:"#9CA3AF" }}>· {item.dueDate}</span>}
                        {item.joinDate && <span style={{ fontSize:11, color:"#10B981", fontWeight:600 }}>· {item.joinDate}</span>}
                      </div>
                    </>
                  )}
                </div>
              ))
          }
          </div>
        </div>
      )}

      <CandidateModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)}/>
      <JobModal job={selectedJob} onClose={() => setSelectedJob(null)}/>
    </div>
  );
}
