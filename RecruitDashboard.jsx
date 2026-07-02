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
  { id:"docs",  label:"서류"   },
  { id:"rec",   label:"추천서" },
  { id:"code",  label:"코딩"   },
  { id:"task",  label:"과제"   },
  { id:"pre",   label:"사전면접" },
  { id:"int1",  label:"1차"   },
  { id:"int2",  label:"2차"   },
  { id:"ref",   label:"레퍼런스" },
  { id:"offer", label:"처우"   },
  { id:"final", label:"입사예정" },
];

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
  { id:1,  name:"김지현",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"docs",  stageStatus:"진행중",  days:14, alert:true,  공고id:1 },
  { id:2,  name:"이상혁",  jobTitle:"Product Manager",        직군:"서비스비즈", 담당자:"elena.62",  직원유형:"정규직",    부서:"Product",     stage:"docs",  stageStatus:"진행중",  days:3,  alert:false, 공고id:6 },
  { id:3,  name:"박민준",  jobTitle:"Data Analyst",           직군:"테크",      담당자:"jamie.bk",  직원유형:"계약직",    부서:"Data",        stage:"docs",  stageStatus:"합격",    days:1,  alert:false, 공고id:4 },
  { id:22, name:"강서준",  jobTitle:"iOS Engineer",           직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"docs",  stageStatus:"진행중",  days:5,  alert:false, 공고id:1 },
  { id:23, name:"윤하린",  jobTitle:"서비스 기획자",           직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"정규직",    부서:"Strategy",    stage:"docs",  stageStatus:"탈락",    days:8,  alert:true,  공고id:7 },
  { id:24, name:"백승호",  jobTitle:"Visual Designer",        직군:"디자인",    담당자:"elena.62",  직원유형:"인턴",      부서:"Design",      stage:"docs",  stageStatus:"진행중",  days:2,  alert:false, 공고id:3 },
  { id:25, name:"임채원",  jobTitle:"Business Development",   직군:"스태프",    담당자:"zoe.parc",  직원유형:"경영계약직", 부서:"Biz",         stage:"docs",  stageStatus:"진행중",  days:4,  alert:false, 공고id:8 },
  { id:26, name:"문지호",  jobTitle:"Frontend Engineer",      직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"docs",  stageStatus:"스킵",    days:6,  alert:false, 공고id:2 },
  { id:4,  name:"최유빈",  jobTitle:"Product Designer",       직군:"디자인",    담당자:"elena.62",  직원유형:"정규직",    부서:"Design",      stage:"rec",   stageStatus:"진행중",  recommended:true, 공고id:3 },
  { id:5,  name:"정현우",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"rec",   stageStatus:"작성완료", recommended:true, 공고id:1 },
  { id:27, name:"송나연",  jobTitle:"UX Researcher",          직군:"디자인",    담당자:"elena.62",  직원유형:"계약직",    부서:"Design",      stage:"rec",   stageStatus:"진행중",  recommended:true, 공고id:3 },
  { id:28, name:"류태민",  jobTitle:"DevOps Engineer",        직군:"테크",      담당자:"jamie.bk",  직원유형:"전문계약직", 부서:"Infra",       stage:"rec",   stageStatus:"작성완료", recommended:true, 공고id:5 },
  { id:6,  name:"오준석",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"code",  stageStatus:"진행중",  days:7, alert:true,  공고id:1 },
  { id:7,  name:"배소영",  jobTitle:"Frontend Engineer",      직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"code",  stageStatus:"평가필요", days:3, alert:true,  공고id:2 },
  { id:29, name:"한동혁",  jobTitle:"iOS Engineer",           직군:"테크",      담당자:"jamie.bk",  직원유형:"정규직",    부서:"Mobile",      stage:"code",  stageStatus:"보류",    days:2, alert:false, 공고id:9 },
  { id:30, name:"노지영",  jobTitle:"Data Engineer",          직군:"테크",      담당자:"jamie.bk",  직원유형:"계약직",    부서:"Data",        stage:"code",  stageStatus:"탈락",    days:5, alert:false, 공고id:4 },
  { id:8,  name:"이수빈",  jobTitle:"Product Designer",       직군:"디자인",    담당자:"elena.62",  직원유형:"정규직",    부서:"Design",      stage:"task",  stageStatus:"진행중",  days:5, alert:true,  공고id:3 },
  { id:9,  name:"김태연",  jobTitle:"UX Designer",            직군:"디자인",    담당자:"elena.62",  직원유형:"인턴",      부서:"Design",      stage:"task",  stageStatus:"진행중",  days:2, alert:true,  공고id:3 },
  { id:31, name:"구민재",  jobTitle:"서비스 기획자",           직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"정규직",    부서:"Product",     stage:"task",  stageStatus:"합격",    days:0, alert:false, 공고id:7 },
  { id:10, name:"이지훈",  jobTitle:"Data Scientist",         직군:"테크",      담당자:"jamie.bk",  직원유형:"정규직",    부서:"Data",        stage:"pre",   stageStatus:"진행중",  days:1, 공고id:4 },
  { id:11, name:"조아라",  jobTitle:"Product Manager",        직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"정규직",    부서:"Product",     stage:"pre",   stageStatus:"합격",    공고id:6 },
  { id:32, name:"심예은",  jobTitle:"Brand Designer",         직군:"디자인",    담당자:"elena.62",  직원유형:"계약직",    부서:"Marketing",   stage:"pre",   stageStatus:"스킵",    공고id:10 },
  { id:12, name:"허인서",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"int1",  stageStatus:"진행중",  dueDate:"5/30 (금)", 공고id:1 },
  { id:13, name:"박성민",  jobTitle:"DevOps Engineer",        직군:"테크",      담당자:"jamie.bk",  직원유형:"전문계약직", 부서:"Infra",       stage:"int1",  stageStatus:"진행중",  dueDate:"5/29 (목)", 공고id:5 },
  { id:33, name:"전혜진",  jobTitle:"Marketing Manager",      직군:"스태프",    담당자:"zoe.parc",  직원유형:"정규직",    부서:"Marketing",   stage:"int1",  stageStatus:"합격",    dueDate:"5/31 (토)", 공고id:10 },
  { id:34, name:"남기준",  jobTitle:"서비스 운영",             직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"어시스턴트", 부서:"Operations",  stage:"int1",  stageStatus:"탈락",    dueDate:"5/28 (수)", 공고id:11 },
  { id:35, name:"황소연",  jobTitle:"Android Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Mobile",      stage:"int1",  stageStatus:"진행중",  dueDate:"6/1 (일)",  공고id:12 },
  { id:14, name:"윤지호",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"int2",  stageStatus:"진행중",  dueDate:"5/28 (수)", 공고id:1 },
  { id:15, name:"장예은",  jobTitle:"Product Manager",        직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"정규직",    부서:"Product",     stage:"int2",  stageStatus:"합격",    dueDate:"5/30 (금)", 공고id:6 },
  { id:36, name:"권도훈",  jobTitle:"Finance Manager",        직군:"스태프",    담당자:"zoe.parc",  직원유형:"경영계약직", 부서:"Finance",     stage:"int2",  stageStatus:"진행중",  dueDate:"5/29 (목)", 공고id:13 },
  { id:16, name:"김민석",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"ref",   stageStatus:"진행중",  refStatus:"진행 중", 공고id:1 },
  { id:17, name:"임서연",  jobTitle:"Data Scientist",         직군:"테크",      담당자:"jamie.bk",  직원유형:"정규직",    부서:"Data",        stage:"ref",   stageStatus:"완료",    refStatus:"대기 중", 공고id:4 },
  { id:18, name:"한지민",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"offer", stageStatus:"진행중",  days:7, alert:true, 공고id:1 },
  { id:19, name:"유승현",  jobTitle:"Product Manager",        직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"정규직",    부서:"Product",     stage:"offer", stageStatus:"제안",    days:3, alert:true, 공고id:6 },
  { id:37, name:"차민호",  jobTitle:"ML Engineer",            직군:"테크",      담당자:"jamie.bk",  직원유형:"전문계약직", 부서:"AI",          stage:"offer", stageStatus:"수락",    days:1, alert:false, 공고id:14 },
  { id:20, name:"전우진",  jobTitle:"Backend Engineer",       직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", stage:"final", stageStatus:"입사확정",       joinDate:"입사일 6/2", 공고id:1 },
  { id:21, name:"박소연",  jobTitle:"UX Designer",            직군:"디자인",    담당자:"elena.62",  직원유형:"정규직",    부서:"Design",      stage:"final", stageStatus:"추가정보 입력중", joinDate:"입사일 6/1", 공고id:3 },
  { id:38, name:"안혜원",  jobTitle:"HR Business Partner",    직군:"스태프",    담당자:"zoe.parc",  직원유형:"정규직",    부서:"HR",          stage:"final", stageStatus:"입사확정",       joinDate:"입사일 6/5", 공고id:15 },
];

const ALL_JOB_POSTINGS = [
  { id:1,  title:"Backend Engineer (Server)",    직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", 상태:"진행중", applied:24, interview:5, offer:2, urgency:"높음", deadline:"2024.08.30" },
  { id:2,  title:"Frontend Engineer",            직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Engineering", 상태:"진행중", applied:16, interview:3, offer:1, urgency:"중간", deadline:"2024.08.15" },
  { id:3,  title:"Product Designer",             직군:"디자인",    담당자:"elena.62",  직원유형:"정규직",    부서:"Design",      상태:"진행중", applied:11, interview:2, offer:1, urgency:"높음", deadline:"2024.08.10" },
  { id:4,  title:"Data Scientist",               직군:"테크",      담당자:"jamie.bk",  직원유형:"정규직",    부서:"Data",        상태:"진행중", applied:9,  interview:2, offer:0, urgency:"중간", deadline:"2024.08.20" },
  { id:5,  title:"DevOps Engineer",              직군:"테크",      담당자:"jamie.bk",  직원유형:"전문계약직", 부서:"Infra",       상태:"진행중", applied:7,  interview:2, offer:0, urgency:"중간", deadline:"2024.08.18" },
  { id:6,  title:"Product Manager",              직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"정규직",    부서:"Product",     상태:"진행중", applied:14, interview:4, offer:2, urgency:"높음", deadline:"2024.08.25" },
  { id:7,  title:"서비스 기획자",                직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"정규직",    부서:"Strategy",    상태:"진행중", applied:10, interview:3, offer:1, urgency:"중간", deadline:"2024.08.22" },
  { id:8,  title:"Business Development Manager", 직군:"스태프",    담당자:"zoe.parc",  직원유형:"경영계약직", 부서:"Biz",         상태:"진행중", applied:6,  interview:1, offer:0, urgency:"낮음", deadline:"2024.09.01" },
  { id:9,  title:"iOS Engineer",                 직군:"테크",      담당자:"jamie.bk",  직원유형:"정규직",    부서:"Mobile",      상태:"대기중", applied:8,  interview:1, offer:0, urgency:"중간", deadline:"2024.09.10" },
  { id:10, title:"Marketing Manager",            직군:"스태프",    담당자:"zoe.parc",  직원유형:"정규직",    부서:"Marketing",   상태:"진행중", applied:5,  interview:1, offer:0, urgency:"낮음", deadline:"2024.08.05" },
  { id:11, title:"서비스 운영 매니저",            직군:"서비스비즈", 담당자:"mk.jee",    직원유형:"어시스턴트", 부서:"Operations",  상태:"완료",   applied:12, interview:5, offer:2, urgency:"낮음", deadline:"2024.07.31" },
  { id:12, title:"Android Engineer",             직군:"테크",      담당자:"rosy.lee",  직원유형:"정규직",    부서:"Mobile",      상태:"진행중", applied:9,  interview:2, offer:0, urgency:"중간", deadline:"2024.08.28" },
  { id:13, title:"Finance Manager",              직군:"스태프",    담당자:"zoe.parc",  직원유형:"경영계약직", 부서:"Finance",     상태:"진행중", applied:4,  interview:1, offer:0, urgency:"낮음", deadline:"2024.09.05" },
  { id:14, title:"ML Engineer",                  직군:"테크",      담당자:"jamie.bk",  직원유형:"전문계약직", 부서:"AI",          상태:"완료",   applied:6,  interview:2, offer:1, urgency:"높음", deadline:"2024.07.20" },
  { id:15, title:"HR Business Partner",          직군:"스태프",    담당자:"zoe.parc",  직원유형:"정규직",    부서:"HR",          상태:"취소",   applied:3,  interview:1, offer:0, urgency:"낮음", deadline:"2024.08.01" },
  { id:16, title:"UX Researcher",                직군:"디자인",    담당자:"elena.62",  직원유형:"계약직",    부서:"Design",      상태:"대기중", applied:7,  interview:0, offer:0, urgency:"낮음", deadline:"2024.09.15" },
  { id:17, title:"Brand Designer",               직군:"디자인",    담당자:"elena.62",  직원유형:"계약직",    부서:"Marketing",   상태:"취소",   applied:5,  interview:1, offer:0, urgency:"낮음", deadline:"2024.07.15" },
  { id:18, title:"Data Engineer",                직군:"테크",      담당자:"jamie.bk",  직원유형:"계약직",    부서:"Data",        상태:"대기중", applied:4,  interview:0, offer:0, urgency:"낮음", deadline:"2024.09.20" },
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
        {[["직군",job.직군],["직원유형",job.직원유형],["채용 인원","2명"],["지원자 수",`${job.applied}명`],["인터뷰 진행",`${job.interview}명`],["오퍼 발송",`${job.offer}명`]].map(([k,v])=>(
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

// 전형 현황 파이프라인 — 해당 공고에 후보자가 있는 전형만 뱃지로 표시
function StagePipeline({ jobId }) {
  const stageMap = {};
  ALL_CANDIDATES
    .filter(c => c.공고id === jobId)
    .forEach(c => { stageMap[c.stage] = (stageMap[c.stage] || 0) + 1; });
  const active = STAGE_ORDER.filter(s => stageMap[s.id]).map(s => ({ ...s, count: stageMap[s.id] }));
  if (active.length === 0) return <span style={{ color:"#D1D5DB", fontSize:12 }}>—</span>;
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

// 우측 액션 사이드바
function ActionSidebar({ filteredActions, actionFilter, setActionFilter, setSelectedCandidate }) {
  return (
    <aside style={{ width:264, borderLeft:"1px solid #E5E7EB", background:"#fff", display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden" }}>
      <div style={{ padding:"14px 14px 10px", borderBottom:"1px solid #F3F4F6", display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
        <span style={{ fontWeight:700, fontSize:13, color:"#111" }}>오늘의 액션 필요</span>
        <span style={{ background:"#EF4444", color:"#fff", fontSize:10, fontWeight:700, borderRadius:999, padding:"1px 6px" }}>{filteredActions.length}</span>
      </div>
      <div style={{ padding:"8px 10px", borderBottom:"1px solid #F3F4F6", display:"flex", flexWrap:"wrap", gap:4, flexShrink:0 }}>
        {ACTION_TAGS.map(tag => {
          const count = tag === "전체" ? ACTION_ITEMS.length : ACTION_ITEMS.filter(a => a.tag === tag).length;
          return (
            <button key={tag} onClick={() => setActionFilter(tag)}
              style={{ padding:"2px 7px", borderRadius:999, fontSize:10, fontWeight:500, cursor:"pointer", border:`1px solid ${actionFilter===tag?"#3B82F6":"#E5E7EB"}`, background:actionFilter===tag?"#EFF6FF":"#fff", color:actionFilter===tag?"#3B82F6":"#6B7280" }}>
              {tag} {count}
            </button>
          );
        })}
      </div>
      <div style={{ flex:1, overflowY:"auto" }}>
        {filteredActions.length === 0
          ? <div style={{ textAlign:"center", padding:"24px 0", color:"#9CA3AF", fontSize:12 }}>액션 항목 없음</div>
          : filteredActions.map(item => (
            <div key={item.id}
              style={{ display:"flex", flexDirection:"column", gap:5, padding:"11px 14px", borderBottom:"1px solid #F9FAFB", cursor:"pointer" }}
              onClick={() => setSelectedCandidate(ALL_CANDIDATES.find(c => c.name === item.candidateName) || { name:item.candidateName, jobTitle:item.candidateRole, code:"—", stage:"docs", 직군:"—", 담당자:"—", 직원유형:"—", 부서:item.부서 })}
              onMouseEnter={e => e.currentTarget.style.background="#F9FAFB"}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ display:"inline-block", padding:"1px 7px", borderRadius:999, fontSize:10, fontWeight:500, background:item.tagBg, color:item.tagColor }}>{item.tag}</span>
                <span style={{ fontSize:10, fontWeight:600, color:item.urgencyColor }}>{item.urgency}</span>
              </div>
              <div style={{ fontSize:12, color:"#111", fontWeight:600 }}>
                {item.candidateName} <span style={{ color:"#9CA3AF", fontWeight:400 }}>({item.candidateRole})</span>
              </div>
              <div style={{ fontSize:11, color:"#6B7280", lineHeight:1.4 }}>{item.action}</div>
            </div>
          ))
        }
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN COMPONENT
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

  const jobsForTab = useMemo(() => filteredJobs.filter(j => j.상태 === jobTab), [filteredJobs, jobTab]);

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

  const filteredActions = useMemo(() =>
    actionFilter === "전체" ? ACTION_ITEMS : ACTION_ITEMS.filter(a => a.tag === actionFilter),
  [actionFilter]);

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

        {/* ── Filter Bar ── */}
        <div style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"8px 16px", display:"flex", alignItems:"center", gap:14, flexShrink:0, flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:11, color:"#9CA3AF", fontWeight:600, whiteSpace:"nowrap" }}>직군</span>
            {JIKGUN_OPTIONS.map(v => (
              <button key={v} onClick={() => toggleJikgun(v)}
                style={{ padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:500, cursor:"pointer", transition:"all 0.12s", border:`1px solid ${selectedJikgun.includes(v)?"#3B82F6":"#E5E7EB"}`, background:selectedJikgun.includes(v)?"#EFF6FF":"#fff", color:selectedJikgun.includes(v)?"#2563EB":"#6B7280" }}>
                {v}
              </button>
            ))}
          </div>
          <div style={{ width:1, height:16, background:"#E5E7EB", flexShrink:0 }}/>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:11, color:"#9CA3AF", fontWeight:600, whiteSpace:"nowrap" }}>직원유형</span>
            {JIKWON_OPTIONS.map(v => (
              <button key={v} onClick={() => toggleJikwon(v)}
                style={{ padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:500, cursor:"pointer", transition:"all 0.12s", border:`1px solid ${selectedJikwon.includes(v)?"#3B82F6":"#E5E7EB"}`, background:selectedJikwon.includes(v)?"#EFF6FF":"#fff", color:selectedJikwon.includes(v)?"#2563EB":"#6B7280" }}>
                {v}
              </button>
            ))}
          </div>
          {hasFilterActive && (
            <button onClick={() => { setSelectedJikgun([]); setSelectedJikwon([]); }}
              style={{ marginLeft:"auto", fontSize:11, color:"#EF4444", background:"none", border:"none", cursor:"pointer", fontWeight:500, display:"flex", alignItems:"center", gap:3 }}>
              <X size={11}/>초기화
            </button>
          )}
        </div>

        {/* ── Content ── */}
        <div style={{ flex:1, overflow:"auto", padding:16, display:"flex", flexDirection:"column", gap:14 }}>

          {/* KPI Cards — 5 cols */}
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

          {/* Job Postings Table */}
          <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:10, padding:"14px 14px 0", display:"flex", flexDirection:"column" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontWeight:700, fontSize:14, color:"#111" }}>공고 현황</span>
            </div>
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
                      {["공고명","직군","담당자","지원","인터뷰","합격","전형 현황"].map(h => (
                        <th key={h} style={{ padding:"6px 8px", textAlign:"left", color:"#9CA3AF", fontWeight:500, whiteSpace:"nowrap", fontSize:12 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {jobsForTab.map(job => (
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
                        {[job.applied, job.interview, job.offer].map((v, i) => (
                          <td key={i} style={{ padding:"10px 8px", color:"#374151", textAlign:"center", fontWeight:500 }}>{v}</td>
                        ))}
                        <td style={{ padding:"10px 8px" }}>
                          <StagePipeline jobId={job.id}/>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {jobsForTab.length > 0 && (
              <div style={{ fontSize:12, color:"#9CA3AF", padding:"8px 0", textAlign:"center" }}>총 {jobsForTab.length}개 공고</div>
            )}
          </div>
        </div>
      </div>

      {/* ── Right Action Sidebar (always visible) ── */}
      <ActionSidebar
        filteredActions={filteredActions}
        actionFilter={actionFilter}
        setActionFilter={setActionFilter}
        setSelectedCandidate={setSelectedCandidate}
      />

      {/* ── KPI Detail Panel (overlays action sidebar) ── */}
      {selectedKPI && (
        <div style={{ position:"fixed", top:0, right:0, height:"100vh", width:380, background:"#fff", boxShadow:"-20px 0 40px rgba(2,6,23,0.10)", borderLeft:"1px solid #E5E7EB", padding:20, overflow:"auto", zIndex:100 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <span style={{ fontWeight:700, fontSize:15, color:"#111" }}>{selectedKPI} 상세</span>
            <button onClick={() => setSelectedKPI(null)} style={{ border:"1px solid #E5E7EB", background:"#F9FAFB", borderRadius:6, color:"#6B7280", cursor:"pointer", fontSize:12, padding:"4px 10px" }}>닫기</button>
          </div>
          {(!kpiDetails || kpiDetails.length === 0)
            ? <EmptyState message="선택된 KPI 항목이 없습니다"/>
            : (
              <div style={{ display:"grid", gap:10 }}>
                {kpiDetails.map(item => (
                  <div key={(item.id||item.name)+"-kpi"} style={{ border:"1px solid #F3F4F6", borderRadius:8, padding:12, display:"flex", flexDirection:"column", gap:6, background:"#FAFBFF" }}>
                    {selectedKPI === "오픈 공고" ? (
                      <>
                        <div style={{ fontWeight:700, color:"#111" }}>{item.title}</div>
                        <div style={{ fontSize:12, color:"#6B7280" }}>{item.직군} · {item.담당자}</div>
                        <div style={{ fontSize:12, color:"#374151" }}>지원자 {item.applied}명 · 인터뷰 {item.interview}명 · 상태 {item.상태}</div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontWeight:700, color:"#111" }}>{item.name}</div>
                        <div style={{ fontSize:12, color:"#6B7280" }}>{item.jobTitle} · {item.stage}</div>
                        <div style={{ fontSize:12, color:"#374151" }}>담당자 {item.담당자} · 상태 {item.stageStatus || "-"}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )
          }
        </div>
      )}

      <CandidateModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)}/>
      <JobModal job={selectedJob} onClose={() => setSelectedJob(null)}/>
    </div>
  );
}
