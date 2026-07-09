import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import './App.css';
import {
  mockJobs,
  mockCandidates,
  mockStageHistory,
  RECRUITERS,
  EMPLOYEE_TYPES,
  ORG_LEVEL2,
  PROCESS_STAGES,
  ACTION_TYPE_LABELS,
  ACTION_TYPE_COLORS,
  BOTTLENECK_THRESHOLD,
  LAST_UPDATED,
  getDaysInStage,
  isBottleneck,
} from './mockData';

const CURRENT_RECRUITER = 'rosy.lee';

function getCategoryTag(category) {
  const map = { '테크': 'tag-tech', '디자인': 'tag-design', '스태프': 'tag-staff', '서비스비즈': 'tag-biz' };
  return map[category] || '';
}

function getDayClass(days, threshold) {
  if (days >= threshold * 1.5) return 'danger';
  if (days >= threshold) return 'warning';
  return '';
}

function formatLastUpdated(iso) {
  const d = new Date(iso);
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h < 12 ? '오전' : '오후';
  const hh = h % 12 || 12;
  const mm = String(m).padStart(2, '0');
  return `마지막 업데이트: ${ampm} ${hh}:${mm}`;
}

function formatMonths(days) {
  if (days < 30) return null;
  const months = days / 30;
  const rounded = Math.round(months * 2) / 2;
  return `${rounded}개월`;
}

// ── 자동완성 태그 입력 컴포넌트 ──
function TagInput({ options, selected, onChange, placeholder }) {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const filtered = options.filter(o =>
    o.toLowerCase().includes(input.toLowerCase()) && !selected.includes(o)
  );

  useEffect(() => {
    function handle(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  function select(opt) {
    onChange([...selected, opt]);
    setInput('');
    setOpen(false);
  }

  function remove(opt) {
    onChange(selected.filter(s => s !== opt));
  }

  return (
    <div className="tag-input-wrap" ref={wrapRef}>
      <div className="tag-input-box" onClick={() => setOpen(true)}>
        {selected.map(s => (
          <span key={s} className="tag-chip">
            {s}
            <button className="tag-chip-remove" onClick={e => { e.stopPropagation(); remove(s); }}>×</button>
          </span>
        ))}
        <input
          className="tag-input-field"
          value={input}
          placeholder={selected.length === 0 ? placeholder : ''}
          onChange={e => { setInput(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="tag-dropdown">
          {filtered.map(opt => (
            <div key={opt} className="tag-dropdown-item" onMouseDown={() => select(opt)}>{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 담당자 텍스트 검색 ──
function RecruiterSearch({ value, onChange }) {
  const [input, setInput] = useState(value === CURRENT_RECRUITER || value === '전체' ? '' : value);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const filtered = RECRUITERS.filter(r =>
    r.toLowerCase().includes(input.toLowerCase())
  );

  useEffect(() => {
    function handle(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  function select(r) {
    setInput(r);
    onChange(r);
    setOpen(false);
  }

  return (
    <div className="recruiter-search-wrap" ref={wrapRef}>
      <input
        className="recruiter-search-input"
        value={input}
        placeholder="이름 입력..."
        onChange={e => { setInput(e.target.value); onChange(e.target.value || '전체'); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      {open && filtered.length > 0 && (
        <div className="tag-dropdown">
          {filtered.map(r => (
            <div key={r} className="tag-dropdown-item" onMouseDown={() => select(r)}>{r}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 공고별 단계현황 ──
function StageCell({ candidates, jobId, stage, onOpenModal }) {
  const list = candidates.filter(c => c.jobId === jobId && c.stage === stage);
  if (list.length === 0) return <td className="num" style={{ color: 'rgb(200,200,200)' }}>-</td>;
  const hasBottleneck = list.some(c => isBottleneck(c));
  return (
    <td
      className={`num${hasBottleneck ? ' bottleneck' : ''}`}
      onClick={() => onOpenModal(jobId, stage, list)}
      title={hasBottleneck ? '지체 주의' : ''}
    >
      {hasBottleneck ? '⚠ ' : ''}{list.length}
    </td>
  );
}

function OverviewSection({ jobs, candidates, recruiterFilter, employeeTypeFilters, orgFilters, excludeCA, onOpenModal }) {
  const filtered = jobs.filter(j => {
    if (excludeCA && j.orgLevel2 === 'CA협의체') return false;
    if (recruiterFilter !== '전체' && j.recruiter !== recruiterFilter) return false;
    if (employeeTypeFilters.length > 0 && !employeeTypeFilters.includes(j.employeeType)) return false;
    if (orgFilters.length > 0 && !orgFilters.includes(j.orgLevel2)) return false;
    return true;
  });

  return (
    <div className="overview-table-wrap">
      <table className="overview-table">
        <thead>
          <tr>
            <th style={{ minWidth: 140 }}>공고명</th>
            <th style={{ minWidth: 44 }}>직군</th>
            <th style={{ minWidth: 70 }}>부서</th>
            <th style={{ minWidth: 60 }}>담당자</th>
            <th style={{ minWidth: 52 }}>소요<br/>기간</th>
            {PROCESS_STAGES.map(s => (
              <th key={s} style={{ minWidth: 44, whiteSpace: 'normal', lineHeight: '1.3', wordBreak: 'keep-all' }}>{s}</th>
            ))}
            <th style={{ minWidth: 36 }}>합계</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr className="empty-row"><td colSpan={PROCESS_STAGES.length + 6}>해당 조건의 공고가 없습니다.</td></tr>
          ) : filtered.map(job => {
            const jobCandidates = candidates.filter(c => c.jobId === job.id);
            const opened = new Date(job.openedAt);
            const today = new Date('2026-07-08');
            const days = Math.floor((today - opened) / (1000 * 60 * 60 * 24));
            const monthStr = formatMonths(days);
            return (
              <tr key={job.id}>
                <td className="job-title">{job.title}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`tag ${getCategoryTag(job.category)}`}>{job.category}</span>
                </td>
                <td style={{ textAlign: 'center', fontSize: 10, color: 'rgb(80,80,80)', whiteSpace: 'normal', wordBreak: 'keep-all', lineHeight: '1.3' }}>{job.department}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className="recruiter-name">{job.recruiter}</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className="tooltip-wrap">
                    <span style={{ fontWeight: 700, color: days >= 60 ? '#c0392b' : days >= 30 ? '#e65c00' : 'rgb(30,30,30)', display: 'block', lineHeight: '1.4' }}>
                      {days}일
                    </span>
                    {monthStr && (
                      <span style={{ color: 'rgb(150,150,150)', fontSize: 10, display: 'block', lineHeight: '1.3' }}>{monthStr}</span>
                    )}
                    <span className="tooltip-box">오픈일: {job.openedAt}</span>
                  </span>
                </td>
                {PROCESS_STAGES.map(stage => (
                  <StageCell
                    key={stage}
                    candidates={candidates}
                    jobId={job.id}
                    stage={stage}
                    onOpenModal={onOpenModal}
                  />
                ))}
                <td style={{ textAlign: 'center', fontWeight: 700 }}>{jobCandidates.length}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── 후보자 상세 모달 ──
function CandidateModal({ jobId, stage, candidates, onClose, onAction }) {
  const job = mockJobs.find(j => j.id === jobId);
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{job?.title} — {stage} 후보자 ({candidates.length}명)</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <table className="modal-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>단계 진입일</th>
                <th>체류일수</th>
                <th>추천</th>
                <th>비고</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(c => {
                const days = getDaysInStage(c);
                const threshold = BOTTLENECK_THRESHOLD[c.stage] || 14;
                const cls = getDayClass(days, threshold);
                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700 }}>{c.name}</td>
                    <td style={{ textAlign: 'center' }}>{c.stageEnteredAt}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`days-num ${cls}`}>{days}일</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {c.hasReferral ? <span className="referral-badge">추천</span> : '-'}
                    </td>
                    <td style={{ color: 'rgb(100,100,100)' }}>{c.note || '-'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button className={`action-btn${c.actionRequired ? ' primary' : ''}`} onClick={() => onAction(c)}>
                        {c.actionRequired ? '처리' : '상세'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── 액션 필요 (한통) ──
const RESULT_ACTION_TYPES = ['인터뷰결과_검토', '과제전형_검토', '코딩테스트_예외'];
const SCHEDULING_STAGES = ['사전인터뷰', '과제전형', '1차 인터뷰', '2차 인터뷰'];

function ActionSection({ candidates, jobs, onAction, recruiterFilter, employeeTypeFilters, orgFilters, excludeCA }) {
  const [actionFilter, setActionFilter] = useState([]);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  function SortTh({ col, label }) {
    const active = sortKey === col;
    return (
      <th className="sortable-th" onClick={() => handleSort(col)}>
        {label}{active ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
      </th>
    );
  }

  const allItems = useMemo(() => {
    return candidates.flatMap(c => {
      const job = jobs.find(j => j.id === c.jobId);
      if (!job) return [];
      if (excludeCA && job.orgLevel2 === 'CA협의체') return [];
      if (recruiterFilter !== '전체' && job.recruiter !== recruiterFilter) return [];
      if (employeeTypeFilters.length > 0 && !employeeTypeFilters.includes(job.employeeType)) return [];
      if (orgFilters.length > 0 && !orgFilters.includes(job.orgLevel2)) return [];

      const isRemind = SCHEDULING_STAGES.includes(c.stage) && c.scheduledAt && !RESULT_ACTION_TYPES.includes(c.actionType);
      const isResult = c.actionRequired && RESULT_ACTION_TYPES.includes(c.actionType);
      const isOffer = c.actionRequired && c.actionType === '처우협의_진행중';

      if (!isRemind && !isResult && !isOffer) return [];

      let actionLabel = '';
      if (isRemind) actionLabel = '리마인드 필요';
      else if (isOffer) actionLabel = '처우협의 필요';
      else actionLabel = ACTION_TYPE_LABELS[c.actionType] || c.actionType;

      return [{ c, job, actionLabel, isRemind, isResult, isOffer }];
    });
  }, [candidates, jobs, recruiterFilter, employeeTypeFilters, orgFilters, excludeCA]);

  const actionTypes = [...new Set(allItems.map(i => i.actionLabel))];

  const filtered = actionFilter.length > 0
    ? allItems.filter(i => actionFilter.includes(i.actionLabel))
    : allItems;

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      let va, vb;
      if (sortKey === 'job') { va = a.job?.title || ''; vb = b.job?.title || ''; }
      else if (sortKey === 'action') { va = a.actionLabel; vb = b.actionLabel; }
      else if (sortKey === 'name') { va = a.c.name; vb = b.c.name; }
      else if (sortKey === 'days') { va = getDaysInStage(a.c); vb = getDaysInStage(b.c); }
      else { va = ''; vb = ''; }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  return (
    <div>
      {/* 액션 필터 */}
      <div className="action-filter-bar">
        {actionTypes.map(t => (
          <button
            key={t}
            className={`filter-btn${actionFilter.includes(t) ? ' active' : ''}`}
            onClick={() => setActionFilter(prev =>
              prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
            )}
          >{t}</button>
        ))}
        {actionFilter.length > 0 && (
          <button className="filter-btn" onClick={() => setActionFilter([])}>전체 보기</button>
        )}
      </div>

      <table className="action-table">
        <thead>
          <tr>
            <SortTh col="action" label="액션" />
            <SortTh col="name" label="후보자" />
            <SortTh col="job" label="공고" />
            <th>단계</th>
            <th>담당자</th>
            <th>비고</th>
            <SortTh col="days" label="경과일" />
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr className="empty-row"><td colSpan={8}>처리 필요한 항목이 없습니다.</td></tr>
          ) : sorted.map(({ c, job, actionLabel, isOffer }) => {
            const days = getDaysInStage(c);
            const threshold = BOTTLENECK_THRESHOLD[c.stage] || 14;
            const isOver = days >= threshold;
            const badgeColor = ACTION_TYPE_COLORS[c.actionType] || '#888';
            const interviewerStr = c.interviewers ? c.interviewers.join(', ') : (job?.department || '-');
            return (
              <tr key={c.id}>
                <td>
                  <span className="action-badge" style={{ backgroundColor: badgeColor }}>
                    {actionLabel}
                  </span>
                </td>
                <td style={{ fontWeight: 700 }}>{c.name}</td>
                <td>{job?.title}</td>
                <td style={{ textAlign: 'center' }}>{c.stage}</td>
                <td style={{ textAlign: 'center' }}><span className="recruiter-name">{job?.recruiter}</span></td>
                <td style={{ fontSize: 11, color: 'rgb(100,100,100)' }}>{c.note || '-'}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`days-num${isOver ? ' danger' : ''}`}>{days}일</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button className="action-btn primary" onClick={() => onAction(c, isOffer)}>처리</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── 전형 진행율 표 ──
function ConversionSection({ jobs, recruiterFilter, employeeTypeFilters, orgFilters, excludeCA }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  const filtered = jobs.filter(j => {
    if (excludeCA && j.orgLevel2 === 'CA협의체') return false;
    if (recruiterFilter !== '전체' && j.recruiter !== recruiterFilter) return false;
    if (employeeTypeFilters.length > 0 && !employeeTypeFilters.includes(j.employeeType)) return false;
    if (orgFilters.length > 0 && !orgFilters.includes(j.orgLevel2)) return false;
    return true;
  });

  const activeStagesPerJob = filtered.map(job => {
    const history = mockStageHistory[job.id] || {};
    const stages = PROCESS_STAGES.filter(s => (history[s]?.count || 0) > 0);
    return { job, history, stages };
  });

  // 전체 공통 활성 단계
  const allActiveStages = PROCESS_STAGES.filter(s =>
    activeStagesPerJob.some(({ history }) => (history[s]?.count || 0) > 0)
  );

  const sorted = useMemo(() => {
    if (!sortKey) return activeStagesPerJob;
    return [...activeStagesPerJob].sort((a, b) => {
      let va, vb;
      if (sortKey === 'title') { va = a.job.title; vb = b.job.title; }
      else if (sortKey === 'department') { va = a.job.department; vb = b.job.department; }
      else {
        // 단계별 진입자 수 정렬
        va = a.history[sortKey]?.count || 0;
        vb = b.history[sortKey]?.count || 0;
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [activeStagesPerJob, sortKey, sortDir]);

  function SortTh({ col, label, style }) {
    const active = sortKey === col;
    return (
      <th className="sortable-th" style={style} onClick={() => handleSort(col)}>
        {label}{active ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
      </th>
    );
  }

  return (
    <div className="overview-table-wrap">
      <table className="overview-table conversion-table">
        <thead>
          <tr>
            <SortTh col="title" label="공고명" style={{ minWidth: 160 }} />
            <SortTh col="department" label="부서" style={{ minWidth: 80 }} />
            {allActiveStages.map((s, i) => (
              <th key={s} style={{ minWidth: 90, textAlign: 'center' }}>
                <div className="conversion-th-stage">{s}</div>
                {i > 0 && <div className="conversion-th-sub">통과율 / 평균</div>}
                {i === 0 && <div className="conversion-th-sub">지원수</div>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr className="empty-row"><td colSpan={allActiveStages.length + 2}>해당 조건의 공고가 없습니다.</td></tr>
          ) : sorted.map(({ job, history, stages }) => (
            <tr key={job.id}>
              <td className="job-title">{job.title}</td>
              <td style={{ textAlign: 'center', fontSize: 10, color: 'rgb(80,80,80)', whiteSpace: 'normal', wordBreak: 'keep-all', lineHeight: '1.3' }}>{job.department}</td>
              {allActiveStages.map((s, i) => {
                const curr = history[s];
                if (!curr || curr.count === 0) {
                  return <td key={s} style={{ textAlign: 'center', color: 'rgb(200,200,200)' }}>-</td>;
                }
                // 이전 활성 단계 찾기
                const prevStage = allActiveStages.slice(0, i).reverse().find(ps => (history[ps]?.count || 0) > 0);
                const prevCount = prevStage ? (history[prevStage]?.count || 0) : null;
                const rate = (i === 0 || !prevCount) ? null : Math.round((curr.count / prevCount) * 100);
                const rateClass = rate === null ? '' : rate < 30 ? 'low' : rate < 60 ? 'mid' : 'high';
                return (
                  <td key={s} style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{curr.count}명</div>
                    {rate !== null && (
                      <div className={`conversion-rate ${rateClass}`}>{rate}%</div>
                    )}
                    {curr.avgDays && (
                      <div className="conversion-avg">avg {curr.avgDays}일</div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return <div className="toast">{message}</div>;
}

// ── 처우협의 팝업 ──
function OfferModal({ candidate, onClose }) {
  const job = mockJobs.find(j => j.id === candidate.jobId);
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 400 }}>
        <div className="modal-header">
          <h3>처우협의 — {candidate.name}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ padding: '24px 20px' }}>
          <p style={{ fontSize: 12, color: 'rgb(66,66,66)', marginBottom: 16, lineHeight: 1.6 }}>
            <strong>{job?.title}</strong> 공고의 처우협의 단계입니다.<br />
            연봉톡으로 연결이 필요합니다.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="action-btn" onClick={onClose}>닫기</button>
            <button
              className="action-btn primary"
              onClick={() => alert('연봉톡 페이지로 연결합니다. (실제 개발 시 연봉톡 URL 연동 필요)')}
            >
              연봉톡으로 이동
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 메인 ──
export default function App() {
  const [recruiterFilter, setRecruiterFilter] = useState(CURRENT_RECRUITER);
  const [employeeTypeFilters, setEmployeeTypeFilters] = useState([]);
  const [orgFilters, setOrgFilters] = useState([]);
  const [excludeCA, setExcludeCA] = useState(false);
  const [modal, setModal] = useState(null);
  const [actionModal, setActionModal] = useState(null);
  const [offerModal, setOfferModal] = useState(null);
  const [candidates] = useState(mockCandidates);
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }, []);

  const handleAction = useCallback((candidate, isOffer) => {
    if (isOffer) setOfferModal(candidate);
    else setActionModal(candidate);
  }, []);

  const handleOpenModal = useCallback((jobId, stage, list) => {
    setModal({ jobId, stage, candidates: list });
  }, []);

  function toggleEmployeeType(t) {
    setEmployeeTypeFilters(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  }

  const actionCount = useMemo(() => candidates.filter(c => {
    const job = mockJobs.find(j => j.id === c.jobId);
    if (!job) return false;
    if (excludeCA && job.orgLevel2 === 'CA협의체') return false;
    if (recruiterFilter !== '전체' && job.recruiter !== recruiterFilter) return false;
    if (employeeTypeFilters.length > 0 && !employeeTypeFilters.includes(job.employeeType)) return false;
    if (orgFilters.length > 0 && !orgFilters.includes(job.orgLevel2)) return false;
    const isRemind = SCHEDULING_STAGES.includes(c.stage) && c.scheduledAt && !RESULT_ACTION_TYPES.includes(c.actionType);
    const isResult = c.actionRequired && RESULT_ACTION_TYPES.includes(c.actionType);
    const isOffer = c.actionRequired && c.actionType === '처우협의_진행중';
    return isRemind || isResult || isOffer;
  }).length, [candidates, recruiterFilter, employeeTypeFilters, orgFilters, excludeCA]);

  return (
    <div className="app">
      <div className="dashboard-header">
        <h1>영입 현황 대시보드</h1>
        <span className="header-meta">
          <span className="header-recruiter">담당자: {CURRENT_RECRUITER}</span>
        </span>
      </div>

      {/* 필터 영역 */}
      <div className="filter-section">
        {/* 직원유형 다중선택 */}
        <div className="filter-bar">
          <span className="filter-label">직원유형:</span>
          {EMPLOYEE_TYPES.map(t => (
            <button
              key={t}
              className={`filter-btn${employeeTypeFilters.includes(t) ? ' active' : ''}`}
              onClick={() => toggleEmployeeType(t)}
            >{t}</button>
          ))}
          {employeeTypeFilters.length > 0 && (
            <button className="filter-btn" onClick={() => setEmployeeTypeFilters([])}>초기화</button>
          )}
        </div>

        {/* 담당자 검색 */}
        <div className="filter-bar" style={{ alignItems: 'center' }}>
          <span className="filter-label">담당자:</span>
          <button
            className={`filter-btn${recruiterFilter === CURRENT_RECRUITER ? ' active' : ''}`}
            onClick={() => setRecruiterFilter(CURRENT_RECRUITER)}
          >내 담당 공고</button>
          <button
            className={`filter-btn${recruiterFilter === '전체' ? ' active' : ''}`}
            onClick={() => setRecruiterFilter('전체')}
          >전체 보기</button>
          <RecruiterSearch value={recruiterFilter} onChange={setRecruiterFilter} />
        </div>

        {/* Lev.2 조직 자동완성 태그 */}
        <div className="filter-bar" style={{ alignItems: 'flex-start' }}>
          <span className="filter-label" style={{ paddingTop: 6 }}>조직(Lev.2):</span>
          <TagInput
            options={ORG_LEVEL2}
            selected={orgFilters}
            onChange={setOrgFilters}
            placeholder="조직명 입력..."
          />
        </div>

        {/* CA협의체 제외 */}
        <div className="filter-bar">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={excludeCA}
              onChange={e => setExcludeCA(e.target.checked)}
            />
            CA협의체 제외
          </label>
        </div>
      </div>

      {/* 공고별 단계 현황 */}
      <span className="section-title">
        공고별 단계 현황
        <span className="section-subtitle">셀 클릭 시 후보자 상세</span>
        <span className="header-updated" style={{ marginLeft: 12 }}>{formatLastUpdated(LAST_UPDATED)}</span>
      </span>
      <OverviewSection
        jobs={mockJobs}
        candidates={candidates}
        recruiterFilter={recruiterFilter}
        employeeTypeFilters={employeeTypeFilters}
        orgFilters={orgFilters}
        excludeCA={excludeCA}
        onOpenModal={handleOpenModal}
      />

      {/* 액션 필요 */}
      <span className="section-title">
        액션 필요
        {actionCount > 0 && (
          <span className="section-subtitle" style={{ color: '#c0392b', fontWeight: 700 }}>
            {actionCount}건 처리 대기
          </span>
        )}
      </span>
      <ActionSection
        candidates={candidates}
        jobs={mockJobs}
        onAction={handleAction}
        recruiterFilter={recruiterFilter}
        employeeTypeFilters={employeeTypeFilters}
        orgFilters={orgFilters}
        excludeCA={excludeCA}
      />

      {/* 전형 진행율 */}
      <span className="section-title">
        공고별 전형 진행율
        <span className="section-subtitle">전형 간 합격 비율</span>
      </span>
      <ConversionSection
        jobs={mockJobs}
        recruiterFilter={recruiterFilter}
        employeeTypeFilters={employeeTypeFilters}
        orgFilters={orgFilters}
        excludeCA={excludeCA}
      />

      {/* 후보자 상세 모달 */}
      {modal && (
        <CandidateModal
          jobId={modal.jobId}
          stage={modal.stage}
          candidates={modal.candidates}
          onClose={() => setModal(null)}
          onAction={handleAction}
        />
      )}

      {/* 처우협의 팝업 */}
      {offerModal && (
        <OfferModal candidate={offerModal} onClose={() => setOfferModal(null)} />
      )}

      {/* 기타 처리 팝업 */}
      {actionModal && (
        <div className="modal-overlay" onClick={() => setActionModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 360 }}>
            <div className="modal-header">
              <h3>{ACTION_TYPE_LABELS[actionModal.actionType] || '처리'} — {actionModal.name}</h3>
              <button className="modal-close" onClick={() => setActionModal(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '40px 20px', color: 'rgb(120,120,120)' }}>
              준비중입니다.
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
