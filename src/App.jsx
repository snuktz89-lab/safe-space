import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown, Flag, Heart, LoaderCircle, MessageCircle, Moon,
  Phone, RefreshCw, Send, Shield, Sparkles, Star, X,
} from 'lucide-react';
import { supabase } from './supabaseClient';

const CATEGORIES = [
  ['all', 'ทั้งหมด'], ['school', 'โรงเรียน'], ['work', 'ที่ทำงาน'],
  ['online', 'ออนไลน์'], ['family', 'ครอบครัว'], ['other', 'อื่น ๆ'],
].map(([id, label]) => ({ id, label }));

const CATEGORY_NAMES = {
  school: 'โรงเรียน / มหาวิทยาลัย', work: 'ที่ทำงาน', online: 'ออนไลน์ / โซเชียล',
  family: 'ครอบครัว / คนใกล้ตัว', other: 'อื่น ๆ',
};

const REPORT_REASONS = [
  ['bullying', 'มีการกลั่นแกล้งหรือคุกคาม'],
  ['personal_information', 'เปิดเผยข้อมูลส่วนบุคคล'],
  ['harmful_content', 'เนื้อหาอาจก่อให้เกิดอันตราย'],
  ['spam', 'สแปมหรือเนื้อหาไม่เกี่ยวข้อง'],
  ['other', 'เหตุผลอื่น'],
].map(([id, label]) => ({ id, label }));

const NICKNAMES = ['ดาวเหนือ', 'แสงเทียน', 'หิ่งห้อยน้อย', 'จันทร์เสี้ยว', 'สายลมเย็น', 'แสงแรก'];

function getAnonymousSessionId() {
  const key = 'safelight-session-id';
  try {
    const current = localStorage.getItem(key);
    if (current) return current;
    const created = crypto.randomUUID();
    localStorage.setItem(key, created);
    return created;
  } catch {
    return crypto.randomUUID();
  }
}

function createNickname() {
  const name = NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)];
  return `${name} #${Math.floor(100 + Math.random() * 900)}`;
}

function formatTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return 'เมื่อสักครู่';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} นาทีที่แล้ว`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} ชั่วโมงที่แล้ว`;
  return `${Math.floor(seconds / 86400)} วันที่แล้ว`;
}

function getErrorMessage(error) {
  return `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`;
}

function StarBackground() {
  const stars = useMemo(() => Array.from({ length: 36 }, (_, id) => ({
    id, top: Math.random() * 100, left: Math.random() * 100,
    size: Math.random() * 2 + 1, delay: Math.random() * 4,
  })), []);
  return <div className="star-background" aria-hidden="true">{stars.map(s => <span key={s.id} className="background-star" style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }} />)}</div>;
}

function ReportModal({ story, submitting, onClose, onSubmit }) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  return <div className="modal-overlay" role="dialog" aria-modal="true">
    <section className="support-modal">
      <button type="button" className="modal-close" onClick={onClose} disabled={submitting}><X size={20} /></button>
      <Flag className="support-icon" size={30} />
      <h2>รายงานเนื้อหา</h2>
      <p>เรื่อง: {story.title}</p>
      <p>รายงานจะถูกส่งให้ผู้ดูแลตรวจสอบ โดยไม่เปิดเผยต่อผู้เขียน</p>
      <form onSubmit={e => { e.preventDefault(); if (reason && !submitting) onSubmit({ storyId: story.id, reason, details: details.trim() }); }}>
        <label className="field-label">เหตุผลที่รายงาน</label>
        <div className="report-reason-list">{REPORT_REASONS.map(item => <label key={item.id} className={reason === item.id ? 'report-reason selected' : 'report-reason'}>
          <input type="radio" name="report-reason" value={item.id} checked={reason === item.id} disabled={submitting} onChange={e => setReason(e.target.value)} /><span>{item.label}</span>
        </label>)}</div>
        <label className="field-label" htmlFor="report-details">รายละเอียดเพิ่มเติม <span>ไม่บังคับ</span></label>
        <textarea id="report-details" className="form-input story-textarea" rows={4} maxLength={500} value={details} disabled={submitting} onChange={e => setDetails(e.target.value)} placeholder="อธิบายเพิ่มเติมเพื่อช่วยให้ผู้ดูแลตรวจสอบ..." />
        <div className="character-count">{details.length}/500</div>
        <button type="submit" className="submit-story-button" disabled={!reason || submitting}>
          {submitting ? <><LoaderCircle size={17} className="loading-spinner" />กำลังส่งรายงาน...</> : <><Flag size={17} />ส่งรายงานให้ผู้ดูแล</>}
        </button>
      </form>
    </section>
  </div>;
}

function SupportModal({ onClose }) {
  return <div className="modal-overlay"><section className="support-modal">
    <button type="button" className="modal-close" onClick={onClose}><X size={20} /></button>
    <Phone className="support-icon" size={30} /><h2>คุณไม่จำเป็นต้องผ่านเรื่องนี้คนเดียว</h2>
    <p>หากรู้สึกไม่ปลอดภัย โปรดติดต่อบุคคลที่ไว้ใจได้ หรือสายด่วนสุขภาพจิต 1323</p>
    <a className="call-button" href="tel:1323">โทร 1323</a>
    <button type="button" className="return-button" onClick={onClose}>กลับไปยังพื้นที่แบ่งปัน</button>
  </section></div>;
}

function StoryCard({ story, expanded, liked, commentDraft, submittingComment, onToggleExpanded, onToggleHeart, onCommentChange, onSubmitComment, onReport }) {
  const comments = Array.isArray(story.comments) ? story.comments : [];
  return <article className="story-card">
    <div className="story-header"><div className="story-author"><span className="author-light" /><div><div className="author-name">{story.nickname || 'แสงนิรนาม'}</div><div className="story-time">{formatTime(story.published_at || story.created_at)}</div></div></div><span className="category-badge">{CATEGORY_NAMES[story.category] || 'อื่น ๆ'}</span></div>
    <h2 className="story-title">{story.title || 'เรื่องราวที่อยากแบ่งปัน'}</h2>
    <p className={expanded ? 'story-body expanded' : 'story-body'}>{story.body}</p>
    {story.body?.length > 130 && <button type="button" className="read-more-button" onClick={onToggleExpanded}>{expanded ? 'ย่อลง' : 'อ่านต่อ'}<ChevronDown size={14} className={expanded ? 'chevron rotated' : 'chevron'} /></button>}
    <div className="story-actions">
      <button type="button" className={liked ? 'action-button liked' : 'action-button'} onClick={onToggleHeart}><Heart size={17} fill={liked ? 'currentColor' : 'none'} /><span>{Number(story.heart_count || 0)}</span><span>ส่งกำลังใจ</span></button>
      <button type="button" className="action-button comment-action" onClick={onToggleExpanded}><MessageCircle size={17} /><span>{Number(story.comment_count ?? comments.length ?? 0)}</span><span>ข้อความ</span></button>
      <button type="button" className="action-button report-action" onClick={onReport}><Flag size={16} /><span>รายงาน</span></button>
    </div>
    {expanded && <div className="comment-area">
      {comments.length === 0 && <p className="no-comments">ยังไม่มีข้อความที่ผ่านการตรวจสอบ</p>}
      {comments.map(c => <div key={c.id} className="comment-bubble"><span className="comment-name">{c.nickname || 'แสงนิรนาม'}</span><span>{c.text}</span></div>)}
      {story.comments_enabled !== false && <div className="comment-form"><input className="comment-input" value={commentDraft} maxLength={500} disabled={submittingComment} placeholder="ส่งข้อความให้กำลังใจ..." onChange={e => onCommentChange(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !submittingComment) onSubmitComment(); }} /><button type="button" className="send-comment-button" onClick={onSubmitComment} disabled={submittingComment || !commentDraft.trim()}>{submittingComment ? <LoaderCircle size={15} className="loading-spinner" /> : <Send size={15} />}</button></div>}
    </div>}
  </article>;
}

function WriteStory({ nickname, form, saving, onFormChange, onClose, onSubmit }) {
  return <section className="write-card">
    <div className="write-header"><div><h2>เล่าเรื่องของคุณ</h2><p>เรื่องจะถูกส่งเข้าคิวผู้ดูแลก่อนเผยแพร่</p></div><button type="button" className="close-button" onClick={onClose} disabled={saving}><X size={21} /></button></div>
    <div className="nickname-box"><Star size={17} /><span>ชื่อที่ระบบตั้งให้คือ <strong>{nickname}</strong></span></div>
    <label className="field-label">หมวดหมู่</label><div className="write-categories">{CATEGORIES.filter(c => c.id !== 'all').map(c => <button type="button" key={c.id} disabled={saving} className={form.category === c.id ? 'write-category selected' : 'write-category'} onClick={() => onFormChange({ ...form, category: c.id })}>{c.label}</button>)}</div>
    <label className="field-label" htmlFor="story-title">หัวข้อสั้น ๆ <span>ไม่บังคับ</span></label><input id="story-title" className="form-input" maxLength={80} disabled={saving} value={form.title} onChange={e => onFormChange({ ...form, title: e.target.value })} />
    <label className="field-label" htmlFor="story-body">เรื่องราวของคุณ</label><textarea id="story-body" className="form-input story-textarea" rows={8} maxLength={3000} disabled={saving} value={form.body} onChange={e => onFormChange({ ...form, body: e.target.value })} />
    <div className="character-count">{form.body.length}/3000</div>
    <label className="consent-box"><input type="checkbox" checked={form.consent} disabled={saving} onChange={e => onFormChange({ ...form, consent: e.target.checked })} /><span>ฉันจะไม่เปิดเผยข้อมูลที่สามารถระบุตัวตนของผู้อื่นได้</span></label>
    <button type="button" className="submit-story-button" disabled={saving || !form.body.trim() || !form.consent} onClick={onSubmit}>{saving ? <><LoaderCircle size={17} className="loading-spinner" />กำลังส่งเรื่อง...</> : <><Send size={17} />ส่งเรื่องเข้าคิวตรวจสอบ</>}</button>
    <p className="moderation-note">เรื่องจะยังไม่ปรากฏบน Feed จนกว่าผู้ดูแลจะอนุมัติ</p>
  </section>;
}

export default function App() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('feed');
  const [expandedId, setExpandedId] = useState(null);
  const [nickname, setNickname] = useState(createNickname());
  const [anonymousSessionId] = useState(getAnonymousSessionId);
  const [likedStoryIds, setLikedStoryIds] = useState([]);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [submittingCommentId, setSubmittingCommentId] = useState(null);
  const [showSupport, setShowSupport] = useState(false);
  const [notice, setNotice] = useState('');
  const [savingStory, setSavingStory] = useState(false);
  const [reportingStory, setReportingStory] = useState(null);
  const [submittingReport, setSubmittingReport] = useState(false);
  const [form, setForm] = useState({ category: 'school', title: '', body: '', consent: false });

  async function loadSessionReactions() {
    try {
      const { data, error } = await supabase.rpc('get_session_reactions', { p_session_id: anonymousSessionId });
      if (error) throw error;
      setLikedStoryIds((data || []).map(item => item.story_id));
    } catch (error) {
      console.error('โหลดสถานะหัวใจไม่สำเร็จ:', error);
      setLikedStoryIds([]);
    }
  }

  async function loadStories() {
    setLoading(true); setLoadError('');
    try {
      const { data: feedRows, error: feedError } = await supabase.from('public_story_feed').select('id,category,title,body,nickname,created_at,published_at,comments_enabled,heart_count,comment_count').order('published_at', { ascending: false, nullsFirst: false });
      if (feedError) throw feedError;
      const ids = (feedRows || []).map(s => s.id);
      let commentRows = [];
      if (ids.length) {
        const { data, error } = await supabase.from('comments').select('id,story_id,text,nickname,created_at').in('story_id', ids).order('created_at', { ascending: true });
        if (error) console.error('โหลดความคิดเห็นไม่สำเร็จ:', error); else commentRows = data || [];
      }
      setStories((feedRows || []).map(s => ({ ...s, comments: commentRows.filter(c => c.story_id === s.id) })));
    } catch (error) {
      console.error('โหลด Feed ไม่สำเร็จ:', error);
      setLoadError(error?.message ? `โหลดฐานข้อมูลไม่ได้: ${error.message}` : 'ยังโหลดเรื่องราวไม่ได้');
    } finally { setLoading(false); }
  }

  useEffect(() => { Promise.all([loadStories(), loadSessionReactions()]); }, []);

  const visibleStories = filter === 'all' ? stories : stories.filter(s => s.category === filter);

  async function submitStory() {
    const body = form.body.trim();
    const title = form.title.trim() || 'เรื่องราวที่อยากแบ่งปัน';
    if (!body || !form.consent) return;
    setSavingStory(true); setNotice('');
    try {
      const { error } = await supabase.rpc('submit_story_limited', {
        p_category: form.category, p_title: title, p_body: body,
        p_nickname: nickname, p_session_id: anonymousSessionId,
      });
      if (error) throw error;
      setForm({ category: 'school', title: '', body: '', consent: false });
      setNotice('ส่งเรื่องเรียบร้อยแล้ว เรื่องกำลังรอผู้ดูแลตรวจสอบก่อนเผยแพร่');
      setView('feed'); window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('ส่งเรื่องไม่สำเร็จ:', error);
      const msg = getErrorMessage(error);
      if (msg.includes('RATE_STORY_COOLDOWN')) setNotice('กรุณารออย่างน้อย 60 วินาทีก่อนส่งเรื่องถัดไป');
      else if (msg.includes('RATE_STORY_DAILY')) setNotice('Browser นี้ส่งเรื่องครบ 3 เรื่องในช่วง 24 ชั่วโมงแล้ว');
      else setNotice('ยังส่งเรื่องไม่ได้ กรุณาตรวจสอบข้อความและลองใหม่อีกครั้ง');
    } finally { setSavingStory(false); }
  }

  async function toggleHeart(storyId) {
    setNotice('');
    try {
      const { data, error } = await supabase.rpc('toggle_story_reaction', { p_story_id: storyId, p_session_id: anonymousSessionId });
      if (error) throw error;
      const liked = data?.liked === true;
      setLikedStoryIds(current => liked ? (current.includes(storyId) ? current : [...current, storyId]) : current.filter(id => id !== storyId));
      setStories(current => current.map(s => s.id === storyId ? { ...s, heart_count: Number(data?.heart_count || 0) } : s));
    } catch (error) { console.error(error); setNotice('ยังส่งกำลังใจไม่ได้ กรุณาลองใหม่อีกครั้ง'); }
  }

  async function submitComment(storyId) {
    const text = (commentDrafts[storyId] || '').trim();
    if (!text || submittingCommentId) return;
    setSubmittingCommentId(storyId); setNotice('');
    try {
      const { error } = await supabase.rpc('submit_comment_limited', {
        p_story_id: storyId, p_text: text, p_nickname: createNickname(), p_session_id: anonymousSessionId,
      });
      if (error) throw error;
      setCommentDrafts(current => ({ ...current, [storyId]: '' }));
      setNotice('ส่งข้อความเรียบร้อยแล้ว ข้อความกำลังรอผู้ดูแลตรวจสอบ');
    } catch (error) {
      console.error('ส่งความคิดเห็นไม่สำเร็จ:', error);
      const msg = getErrorMessage(error);
      if (msg.includes('RATE_COMMENT_COOLDOWN')) setNotice('กรุณารออย่างน้อย 20 วินาทีก่อนส่งข้อความถัดไป');
      else if (msg.includes('RATE_COMMENT_HOURLY')) setNotice('Browser นี้ส่งข้อความครบ 20 ข้อความในช่วง 1 ชั่วโมงแล้ว');
      else setNotice('ยังส่งข้อความไม่ได้ กรุณาลองใหม่อีกครั้ง');
    } finally { setSubmittingCommentId(null); }
  }

  async function submitReport({ storyId, reason, details }) {
    setSubmittingReport(true); setNotice('');
    try {
      const { error } = await supabase.rpc('submit_story_report', {
        p_story_id: storyId, p_reason: reason, p_details: details || '', p_reporter_session_id: anonymousSessionId,
      });
      if (error) throw error;
      setReportingStory(null); setNotice('รับรายงานเรียบร้อยแล้ว ผู้ดูแลจะตรวจสอบเนื้อหานี้');
    } catch (error) {
      console.error('ส่งรายงานไม่สำเร็จ:', error);
      const msg = getErrorMessage(error);
      if (msg.includes('RATE_REPORT_COOLDOWN')) setNotice('กรุณารออย่างน้อย 30 วินาทีก่อนส่งรายงานอีกครั้ง');
      else if (msg.includes('RATE_REPORT_DAILY')) setNotice('Browser นี้ส่งรายงานครบ 10 รายการในช่วง 24 ชั่วโมงแล้ว');
      else setNotice('ยังส่งรายงานไม่ได้ กรุณาลองใหม่อีกครั้ง');
    } finally { setSubmittingReport(false); }
  }

  return <div className="app">
    <StarBackground />
    {reportingStory && <ReportModal story={reportingStory} submitting={submittingReport} onClose={() => !submittingReport && setReportingStory(null)} onSubmit={submitReport} />}
    {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}
    <main className="mobile-page">
      <header className="main-header"><div className="brand"><div className="brand-icon"><Moon size={27} /></div><div><h1>แสงที่ไม่มีชื่อ</h1><p>พื้นที่เล็ก ๆ สำหรับแบ่งปันเรื่องราว</p></div></div>{view === 'feed' && <button type="button" className="write-button" onClick={() => { setNickname(createNickname()); setNotice(''); setView('write'); }}><Sparkles size={16} /><span>เล่าเรื่อง</span></button>}</header>
      {notice && <div className="notice-message">{notice}</div>}
      {view === 'feed' && <>
        <section className="intro-card"><div><h2>ที่นี่คือพื้นที่แห่งความเข้าใจ</h2><p>ไม่ต้องเปิดเผยตัวตน เล่าเรื่องได้เท่าที่สบายใจ และส่งข้อความดี ๆ ไว้ให้กัน</p><button type="button" className="support-link" onClick={() => setShowSupport(true)}>ต้องการช่องทางช่วยเหลือ</button></div><Heart size={36} className="intro-heart" fill="currentColor" /></section>
        <nav className="category-list">{CATEGORIES.map(c => <button type="button" key={c.id} className={filter === c.id ? 'category-button active' : 'category-button'} onClick={() => setFilter(c.id)}>{c.label}</button>)}</nav>
        {loading && <section className="empty-state"><LoaderCircle size={30} className="loading-spinner" /><p>กำลังเปิดพื้นที่แห่งแสง...</p></section>}
        {!loading && loadError && <section className="empty-state"><RefreshCw size={30} /><p>{loadError}</p><button type="button" className="retry-button" onClick={loadStories}>ลองใหม่</button></section>}
        {!loading && !loadError && visibleStories.length === 0 && <section className="empty-state"><Star size={30} /><p>ยังไม่มีเรื่องราวที่ผ่านการตรวจสอบในหมวดนี้</p></section>}
        {!loading && !loadError && <section className="story-list">{visibleStories.map(story => <StoryCard key={story.id} story={story} expanded={expandedId === story.id} liked={likedStoryIds.includes(story.id)} commentDraft={commentDrafts[story.id] || ''} submittingComment={submittingCommentId === story.id} onToggleExpanded={() => setExpandedId(expandedId === story.id ? null : story.id)} onToggleHeart={() => toggleHeart(story.id)} onCommentChange={value => setCommentDrafts(current => ({ ...current, [story.id]: value }))} onSubmitComment={() => submitComment(story.id)} onReport={() => setReportingStory(story)} />)}</section>}
        <button type="button" className="floating-write-button" onClick={() => { setNickname(createNickname()); setNotice(''); setView('write'); }}><Sparkles size={18} />เล่าเรื่องของฉัน</button>
      </>}
      {view === 'write' && <WriteStory nickname={nickname} form={form} saving={savingStory} onFormChange={setForm} onClose={() => !savingStory && setView('feed')} onSubmit={submitStory} />}
      <footer className="main-footer"><Shield size={17} /><p>พื้นที่นี้ไม่ใช่บริการฉุกเฉิน การรักษา หรือการให้คำปรึกษาทางการแพทย์ หากรู้สึกไม่ปลอดภัย โปรดติดต่อบุคคลที่ไว้ใจได้ หรือสายด่วนสุขภาพจิต 1323</p></footer>
    </main>
  </div>;
}
