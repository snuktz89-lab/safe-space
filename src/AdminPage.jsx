import React, { useEffect, useState } from 'react';

import {
  AlertTriangle,
  Check,
  EyeOff,
  Flag,
  LoaderCircle,
  LogIn,
  LogOut,
  MessageCircle,
  Moon,
  RefreshCw,
  Shield,
  X,
} from 'lucide-react';

import { supabase } from './supabaseClient';

const CATEGORY_NAMES = {
  school: 'โรงเรียน / มหาวิทยาลัย',
  work: 'ที่ทำงาน',
  online: 'ออนไลน์ / โซเชียล',
  family: 'ครอบครัว / คนใกล้ตัว',
  other: 'อื่น ๆ',
};

const REPORT_REASON_NAMES = {
  bullying: 'มีการกลั่นแกล้งหรือคุกคาม',
  personal_information: 'เปิดเผยข้อมูลส่วนบุคคล',
  harmful_content: 'เนื้อหาอาจก่อให้เกิดอันตราย',
  spam: 'สแปมหรือเนื้อหาไม่เกี่ยวข้อง',
  other: 'เหตุผลอื่น',
};

const styles = {
  page: {
    minHeight: '100vh',
    padding: '24px 16px 64px',
    color: '#f8f2ff',
    background:
      'linear-gradient(180deg, #17142f 0%, #241f42 50%, #121029 100%)',
    fontFamily: "'Sarabun', Arial, sans-serif",
  },
  container: {
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '25px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
  },
  title: {
    margin: 0,
    color: '#ffe1b2',
    fontSize: '23px',
    fontWeight: 600,
  },
  subtitle: {
    margin: '4px 0 0',
    color: 'rgba(225, 211, 240, 0.55)',
    fontSize: '12px',
    lineHeight: 1.55,
  },
  card: {
    padding: '18px',
    border: '1px solid rgba(216, 194, 250, 0.14)',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.055)',
    boxShadow: '0 18px 48px rgba(0, 0, 0, 0.22)',
  },
  loginCard: {
    width: '100%',
    maxWidth: '440px',
    margin: '40px auto 0',
    padding: '24px',
    border: '1px solid rgba(216, 194, 250, 0.14)',
    borderRadius: '22px',
    background: 'rgba(255, 255, 255, 0.055)',
    boxShadow: '0 18px 48px rgba(0, 0, 0, 0.22)',
  },
  label: {
    display: 'block',
    margin: '15px 0 7px',
    color: 'rgba(230, 216, 243, 0.72)',
    fontSize: '12px',
  },
  input: {
    width: '100%',
    padding: '12px 13px',
    border: '1px solid rgba(216, 194, 250, 0.18)',
    borderRadius: '13px',
    outline: 'none',
    color: '#f8f2ff',
    background: 'rgba(255, 255, 255, 0.055)',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  primaryButton: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '18px',
    padding: '12px',
    border: 0,
    borderRadius: '14px',
    color: '#38243f',
    background: 'linear-gradient(135deg, #ffd0a7, #ef9f78)',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    padding: '9px 12px',
    border: '1px solid rgba(216, 194, 250, 0.15)',
    borderRadius: '12px',
    color: 'rgba(237, 225, 247, 0.72)',
    background: 'rgba(255, 255, 255, 0.05)',
    fontSize: '12px',
    cursor: 'pointer',
  },
  approveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 12px',
    border: 0,
    borderRadius: '12px',
    color: '#173721',
    background: '#a8e8b8',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  rejectButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 12px',
    border: 0,
    borderRadius: '12px',
    color: '#4a2026',
    background: '#f2abb5',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  warningButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 12px',
    border: '1px solid rgba(255, 210, 151, 0.22)',
    borderRadius: '12px',
    color: '#ffd297',
    background: 'rgba(242, 170, 82, 0.09)',
    fontSize: '12px',
    cursor: 'pointer',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '15px',
  },
  sectionDivider: {
    marginTop: '32px',
    paddingTop: '25px',
    borderTop: '1px solid rgba(255, 255, 255, 0.10)',
  },
  queue: {
    display: 'grid',
    gap: '14px',
  },
  metadata: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '7px',
  },
  badge: {
    padding: '5px 8px',
    borderRadius: '10px',
    color: 'rgba(236, 221, 246, 0.72)',
    background: 'rgba(255, 255, 255, 0.06)',
    fontSize: '10px',
  },
  pendingBadge: {
    padding: '5px 8px',
    borderRadius: '10px',
    color: '#ffe1a9',
    background: 'rgba(239, 175, 89, 0.14)',
    fontSize: '10px',
  },
  urgentBadge: {
    padding: '5px 8px',
    borderRadius: '10px',
    color: '#ffc0c9',
    background: 'rgba(224, 80, 96, 0.14)',
    fontSize: '10px',
  },
  postTitle: {
    margin: '13px 0 7px',
    color: '#fff0dc',
    fontSize: '18px',
  },
  postBody: {
    margin: 0,
    color: 'rgba(233, 222, 243, 0.75)',
    fontSize: '13px',
    lineHeight: 1.75,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
  },
  detailBox: {
    marginTop: '12px',
    padding: '12px',
    borderRadius: '13px',
    color: 'rgba(236, 224, 245, 0.76)',
    background: 'rgba(255, 255, 255, 0.04)',
    fontSize: '12px',
    lineHeight: 1.65,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '16px',
    paddingTop: '14px',
    borderTop: '1px solid rgba(255, 255, 255, 0.07)',
  },
  message: {
    marginBottom: '14px',
    padding: '11px 13px',
    borderRadius: '13px',
    color: 'rgba(201, 255, 218, 0.90)',
    background: 'rgba(84, 194, 126, 0.11)',
    border: '1px solid rgba(84, 194, 126, 0.16)',
    fontSize: '12px',
    lineHeight: 1.55,
  },
  error: {
    marginBottom: '14px',
    padding: '11px 13px',
    borderRadius: '13px',
    color: '#ffc5cd',
    background: 'rgba(224, 80, 96, 0.12)',
    border: '1px solid rgba(224, 80, 96, 0.16)',
    fontSize: '12px',
    lineHeight: 1.55,
  },
  emptyCard: {
    padding: '24px 18px',
    border: '1px solid rgba(216, 194, 250, 0.14)',
    borderRadius: '20px',
    color: 'rgba(218, 203, 235, 0.64)',
    background: 'rgba(255, 255, 255, 0.045)',
    textAlign: 'center',
  },
  loadingCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '18px',
    border: '1px solid rgba(216, 194, 250, 0.14)',
    borderRadius: '20px',
    color: 'rgba(218, 203, 235, 0.70)',
    background: 'rgba(255, 255, 255, 0.045)',
  },
};

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleLogin(event) {
    event.preventDefault();

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    setLoggingIn(true);
    setErrorMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) throw error;
      onLogin(data.session || null);
    } catch (error) {
      console.error('Admin login error:', error);
      setErrorMessage('เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมลและรหัสผ่าน');
    } finally {
      setLoggingIn(false);
    }
  }

  return (
    <section style={styles.loginCard}>
      <div style={{ textAlign: 'center' }}>
        <Shield size={40} color="#ffd0a5" style={{ marginBottom: '11px' }} />
        <h2 style={{ margin: 0, color: '#fff0dc', fontSize: '21px' }}>
          เข้าสู่ระบบผู้ดูแล
        </h2>
        <p style={styles.subtitle}>สำหรับผู้ดูแลที่ได้รับอนุญาตเท่านั้น</p>
      </div>

      {errorMessage && <div style={styles.error}>{errorMessage}</div>}

      <form onSubmit={handleLogin}>
        <label style={styles.label} htmlFor="admin-email">
          อีเมล
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          style={styles.input}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@example.com"
        />

        <label style={styles.label} htmlFor="admin-password">
          รหัสผ่าน
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          style={styles.input}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="รหัสผ่านของผู้ดูแล"
        />

        <button
          type="submit"
          style={{ ...styles.primaryButton, opacity: loggingIn ? 0.55 : 1 }}
          disabled={loggingIn}
        >
          {loggingIn ? (
            <>
              <LoaderCircle size={17} />
              กำลังเข้าสู่ระบบ...
            </>
          ) : (
            <>
              <LogIn size={17} />
              เข้าสู่ระบบ
            </>
          )}
        </button>
      </form>
    </section>
  );
}

function LoadingCard({ text }) {
  return (
    <section style={styles.loadingCard}>
      <LoaderCircle size={22} />
      <span>{text}</span>
    </section>
  );
}

function EmptyCard({ icon, text }) {
  return (
    <section style={styles.emptyCard}>
      {icon}
      <p style={{ margin: '10px 0 0', fontSize: '13px' }}>{text}</p>
    </section>
  );
}

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [queue, setQueue] = useState([]);
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [processingId, setProcessingId] = useState('');

  const [commentQueue, setCommentQueue] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [processingCommentId, setProcessingCommentId] = useState('');

  const [reportQueue, setReportQueue] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [processingReportId, setProcessingReportId] = useState('');

  const [message, setMessage] = useState('');
  const [postError, setPostError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [reportError, setReportError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function readSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;
      if (error) console.error('Admin session error:', error);

      setSession(data?.session || null);
      setCheckingSession(false);
    }

    readSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession || null);
      setCheckingSession(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) {
      loadAllQueues();
    } else {
      setQueue([]);
      setCommentQueue([]);
      setReportQueue([]);
    }
  }, [session]);

  async function loadAllQueues() {
    setMessage('');
    await Promise.all([loadQueue(), loadCommentQueue(), loadReportQueue()]);
  }

  async function loadQueue() {
    setLoadingQueue(true);
    setPostError('');

    try {
      const { data, error } = await supabase
        .from('admin_moderation_queue')
        .select('*');

      if (error) throw error;
      setQueue(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Admin queue error:', error);
      setPostError(
        error?.message ||
          'ไม่สามารถเปิดคิวตรวจสอบโพสต์ได้ บัญชีอาจไม่มีสิทธิ์ผู้ดูแล'
      );
      setQueue([]);
    } finally {
      setLoadingQueue(false);
    }
  }

  async function loadCommentQueue() {
    setLoadingComments(true);
    setCommentError('');

    try {
      const { data, error } = await supabase
        .from('admin_comment_queue')
        .select('*');

      if (error) throw error;
      setCommentQueue(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Comment queue error:', error);
      setCommentError(
        error?.message ||
          'ไม่สามารถเปิดคิวความคิดเห็นได้ กรุณาตรวจสอบ View และสิทธิ์ผู้ดูแล'
      );
      setCommentQueue([]);
    } finally {
      setLoadingComments(false);
    }
  }

  async function loadReportQueue() {
    setLoadingReports(true);
    setReportError('');

    try {
      const { data, error } = await supabase
        .from('admin_report_queue')
        .select('*');

      if (error) throw error;
      setReportQueue(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Report queue error:', error);
      setReportError(
        error?.message ||
          'ไม่สามารถเปิดคิวรายงานได้ กรุณาตรวจสอบ View และสิทธิ์ผู้ดูแล'
      );
      setReportQueue([]);
    } finally {
      setLoadingReports(false);
    }
  }

  async function updateStory(storyId, nextStatus) {
    setProcessingId(storyId);
    setMessage('');
    setPostError('');

    const changes = { status: nextStatus };

    if (nextStatus === 'published') {
      changes.published_at = new Date().toISOString();
      changes.risk_level = 'normal';
    } else {
      changes.published_at = null;
    }

    if (nextStatus === 'escalated') {
      changes.risk_level = 'urgent';
    }

    try {
      const { error } = await supabase
        .from('stories')
        .update(changes)
        .eq('id', storyId);

      if (error) throw error;

      if (nextStatus === 'published') {
        setMessage('อนุมัติและเผยแพร่เรื่องเรียบร้อยแล้ว');
      } else if (nextStatus === 'rejected') {
        setMessage('ปฏิเสธเรื่องเรียบร้อยแล้ว');
      } else if (nextStatus === 'escalated') {
        setMessage('ย้ายเรื่องเข้าสู่คิวเร่งด่วนแล้ว');
      }

      await Promise.all([loadQueue(), loadReportQueue()]);
    } catch (error) {
      console.error('Moderation update error:', error);
      setPostError(
        error?.message ||
          'เปลี่ยนสถานะโพสต์ไม่สำเร็จ กรุณาตรวจสอบสิทธิ์ผู้ดูแล'
      );
    } finally {
      setProcessingId('');
    }
  }

  async function updateComment(commentId, nextStatus) {
    setProcessingCommentId(commentId);
    setMessage('');
    setCommentError('');

    try {
      const { error } = await supabase
        .from('comments')
        .update({ status: nextStatus })
        .eq('id', commentId);

      if (error) throw error;

      setMessage(
        nextStatus === 'published'
          ? 'อนุมัติความคิดเห็นเรียบร้อยแล้ว'
          : 'ปฏิเสธความคิดเห็นเรียบร้อยแล้ว'
      );

      await loadCommentQueue();
    } catch (error) {
      console.error('Comment moderation error:', error);
      setCommentError(
        error?.message ||
          'เปลี่ยนสถานะความคิดเห็นไม่สำเร็จ กรุณาตรวจสอบสิทธิ์ผู้ดูแล'
      );
    } finally {
      setProcessingCommentId('');
    }
  }

  async function updateReport(reportId, nextStatus) {
    setProcessingReportId(reportId);
    setMessage('');
    setReportError('');

    try {
      const { error } = await supabase
        .from('reports')
        .update({ status: nextStatus })
        .eq('id', reportId);

      if (error) throw error;

      if (nextStatus === 'reviewing') {
        setMessage('รับรายงานเข้าสู่การตรวจสอบแล้ว');
      } else if (nextStatus === 'resolved') {
        setMessage('ปิดเคสรายงานเรียบร้อยแล้ว');
      } else if (nextStatus === 'dismissed') {
        setMessage('ยกเลิกรายงานเรียบร้อยแล้ว');
      }

      await loadReportQueue();
    } catch (error) {
      console.error('Report moderation error:', error);
      setReportError(
        error?.message ||
          'เปลี่ยนสถานะรายงานไม่สำเร็จ กรุณาตรวจสอบสิทธิ์ผู้ดูแล'
      );
    } finally {
      setProcessingReportId('');
    }
  }

  async function hideReportedStory(report) {
    setProcessingReportId(report.id);
    setMessage('');
    setReportError('');

    try {
      const { error: storyError } = await supabase
        .from('stories')
        .update({
          status: 'hidden',
          published_at: null,
        })
        .eq('id', report.story_id);

      if (storyError) throw storyError;

      const { error: reportUpdateError } = await supabase
        .from('reports')
        .update({ status: 'resolved' })
        .eq('id', report.id);

      if (reportUpdateError) throw reportUpdateError;

      setMessage('ซ่อนโพสต์และปิดเคสรายงานเรียบร้อยแล้ว');
      await Promise.all([loadQueue(), loadReportQueue()]);
    } catch (error) {
      console.error('Hide reported story error:', error);
      setReportError(
        error?.message ||
          'ซ่อนโพสต์ไม่สำเร็จ กรุณาตรวจสอบสิทธิ์ผู้ดูแล'
      );
    } finally {
      setProcessingReportId('');
    }
  }

  async function escalateReportedStory(report) {
    setProcessingReportId(report.id);
    setMessage('');
    setReportError('');

    try {
      const { error: storyError } = await supabase
        .from('stories')
        .update({
          status: 'escalated',
          risk_level: 'urgent',
          published_at: null,
        })
        .eq('id', report.story_id);

      if (storyError) throw storyError;

      const { error: reportUpdateError } = await supabase
        .from('reports')
        .update({ status: 'reviewing' })
        .eq('id', report.id);

      if (reportUpdateError) throw reportUpdateError;

      setMessage('ส่งโพสต์เข้าคิวเร่งด่วนและรับรายงานเข้าสู่การตรวจสอบแล้ว');
      await Promise.all([loadQueue(), loadReportQueue()]);
    } catch (error) {
      console.error('Escalate reported story error:', error);
      setReportError(
        error?.message ||
          'ส่งโพสต์เข้าคิวเร่งด่วนไม่สำเร็จ กรุณาตรวจสอบสิทธิ์ผู้ดูแล'
      );
    } finally {
      setProcessingReportId('');
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
    setQueue([]);
    setCommentQueue([]);
    setReportQueue([]);
    setMessage('');
    setPostError('');
    setCommentError('');
    setReportError('');
  }

  if (checkingSession) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <LoadingCard text="กำลังตรวจสอบการเข้าสู่ระบบ..." />
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.brand}>
            <Moon size={30} color="#ffd09d" />
            <div>
              <h1 style={styles.title}>แสงที่ไม่มีชื่อ</h1>
              <p style={styles.subtitle}>ระบบตรวจสอบเนื้อหา</p>
            </div>
          </div>

          {session && (
            <button type="button" style={styles.secondaryButton} onClick={logout}>
              <LogOut size={15} />
              ออกจากระบบ
            </button>
          )}
        </header>

        {!session && <LoginForm onLogin={setSession} />}

        {session && (
          <>
            {message && <div style={styles.message}>{message}</div>}

            <section>
              <div style={styles.sectionHeader}>
                <div>
                  <strong>คิวโพสต์รอตรวจสอบ</strong>
                  <div style={styles.subtitle}>{queue.length} รายการ</div>
                </div>
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={loadQueue}
                  disabled={loadingQueue}
                >
                  <RefreshCw size={15} />
                  โหลดใหม่
                </button>
              </div>

              {postError && <div style={styles.error}>{postError}</div>}
              {loadingQueue && <LoadingCard text="กำลังโหลดคิวโพสต์..." />}

              {!loadingQueue && !postError && queue.length === 0 && (
                <EmptyCard
                  icon={<Shield size={27} color="#bfaed5" />}
                  text="ไม่มีเรื่องที่รอตรวจสอบ"
                />
              )}

              {!loadingQueue && !postError && queue.length > 0 && (
                <section style={styles.queue}>
                  {queue.map((story) => {
                    const isProcessing = processingId === story.id;

                    return (
                      <article key={story.id} style={styles.card}>
                        <div style={styles.metadata}>
                          <span style={styles.badge}>
                            {CATEGORY_NAMES[story.category] || 'อื่น ๆ'}
                          </span>
                          <span
                            style={
                              story.status === 'escalated'
                                ? styles.urgentBadge
                                : styles.pendingBadge
                            }
                          >
                            {story.status}
                          </span>
                          <span style={styles.badge}>
                            ความเสี่ยง: {story.risk_level || 'normal'}
                          </span>
                        </div>

                        <h2 style={styles.postTitle}>
                          {story.title || 'ไม่มีชื่อเรื่อง'}
                        </h2>
                        <p style={styles.postBody}>{story.body}</p>
                        <p style={styles.subtitle}>
                          ผู้เขียน: {story.nickname || 'แสงนิรนาม'}
                        </p>

                        <div style={styles.actions}>
                          <button
                            type="button"
                            style={{
                              ...styles.approveButton,
                              opacity: isProcessing ? 0.5 : 1,
                            }}
                            disabled={isProcessing}
                            onClick={() => updateStory(story.id, 'published')}
                          >
                            <Check size={15} />
                            อนุมัติ
                          </button>

                          <button
                            type="button"
                            style={{
                              ...styles.rejectButton,
                              opacity: isProcessing ? 0.5 : 1,
                            }}
                            disabled={isProcessing}
                            onClick={() => updateStory(story.id, 'rejected')}
                          >
                            <X size={15} />
                            ปฏิเสธ
                          </button>

                          <button
                            type="button"
                            style={{
                              ...styles.warningButton,
                              opacity: isProcessing ? 0.5 : 1,
                            }}
                            disabled={isProcessing}
                            onClick={() => updateStory(story.id, 'escalated')}
                          >
                            <AlertTriangle size={15} />
                            คิวเร่งด่วน
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </section>
              )}
            </section>

            <section style={styles.sectionDivider}>
              <div style={styles.sectionHeader}>
                <div>
                  <strong>ความคิดเห็นรอตรวจสอบ</strong>
                  <div style={styles.subtitle}>{commentQueue.length} รายการ</div>
                </div>
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={loadCommentQueue}
                  disabled={loadingComments}
                >
                  <RefreshCw size={15} />
                  โหลดใหม่
                </button>
              </div>

              {commentError && <div style={styles.error}>{commentError}</div>}
              {loadingComments && (
                <LoadingCard text="กำลังโหลดความคิดเห็น..." />
              )}

              {!loadingComments && !commentError && commentQueue.length === 0 && (
                <EmptyCard
                  icon={<MessageCircle size={27} color="#bfaed5" />}
                  text="ไม่มีความคิดเห็นที่รอตรวจสอบ"
                />
              )}

              {!loadingComments && !commentError && commentQueue.length > 0 && (
                <section style={styles.queue}>
                  {commentQueue.map((comment) => {
                    const isProcessing = processingCommentId === comment.id;

                    return (
                      <article key={comment.id} style={styles.card}>
                        <div style={styles.metadata}>
                          <span style={styles.pendingBadge}>pending</span>
                          <span style={styles.badge}>
                            เรื่อง: {comment.story_title || 'ไม่พบชื่อเรื่อง'}
                          </span>
                        </div>

                        <p style={{ ...styles.postBody, marginTop: '14px' }}>
                          {comment.text}
                        </p>
                        <p style={styles.subtitle}>
                          ผู้ส่ง: {comment.nickname || 'แสงนิรนาม'}
                        </p>

                        <div style={styles.actions}>
                          <button
                            type="button"
                            style={{
                              ...styles.approveButton,
                              opacity: isProcessing ? 0.5 : 1,
                            }}
                            disabled={isProcessing}
                            onClick={() =>
                              updateComment(comment.id, 'published')
                            }
                          >
                            <Check size={15} />
                            อนุมัติความคิดเห็น
                          </button>

                          <button
                            type="button"
                            style={{
                              ...styles.rejectButton,
                              opacity: isProcessing ? 0.5 : 1,
                            }}
                            disabled={isProcessing}
                            onClick={() =>
                              updateComment(comment.id, 'rejected')
                            }
                          >
                            <X size={15} />
                            ปฏิเสธ
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </section>
              )}
            </section>

            <section style={styles.sectionDivider}>
              <div style={styles.sectionHeader}>
                <div>
                  <strong>รายงานเนื้อหารอตรวจสอบ</strong>
                  <div style={styles.subtitle}>{reportQueue.length} รายการ</div>
                </div>
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={loadReportQueue}
                  disabled={loadingReports}
                >
                  <RefreshCw size={15} />
                  โหลดใหม่
                </button>
              </div>

              {reportError && <div style={styles.error}>{reportError}</div>}
              {loadingReports && <LoadingCard text="กำลังโหลดรายงาน..." />}

              {!loadingReports && !reportError && reportQueue.length === 0 && (
                <EmptyCard
                  icon={<Flag size={27} color="#bfaed5" />}
                  text="ไม่มีรายงานเนื้อหาที่รอตรวจสอบ"
                />
              )}

              {!loadingReports && !reportError && reportQueue.length > 0 && (
                <section style={styles.queue}>
                  {reportQueue.map((report) => {
                    const isProcessing = processingReportId === report.id;

                    return (
                      <article key={report.id} style={styles.card}>
                        <div style={styles.metadata}>
                          <span style={styles.urgentBadge}>
                            {REPORT_REASON_NAMES[report.reason] || report.reason}
                          </span>
                          <span style={styles.badge}>{report.status}</span>
                          <span style={styles.badge}>
                            {CATEGORY_NAMES[report.story_category] || 'อื่น ๆ'}
                          </span>
                        </div>

                        <h2 style={styles.postTitle}>
                          {report.story_title || 'ไม่พบชื่อเรื่อง'}
                        </h2>
                        <p style={styles.postBody}>{report.story_body}</p>
                        <p style={styles.subtitle}>
                          ผู้เขียน: {report.story_nickname || 'แสงนิรนาม'}
                        </p>

                        <div style={styles.detailBox}>
                          <strong>รายละเอียดจากผู้รายงาน</strong>
                          <div style={{ marginTop: '5px' }}>
                            {report.details || 'ไม่มีรายละเอียดเพิ่มเติม'}
                          </div>
                        </div>

                        <div style={styles.actions}>
                          {report.status === 'open' && (
                            <button
                              type="button"
                              style={{
                                ...styles.warningButton,
                                opacity: isProcessing ? 0.5 : 1,
                              }}
                              disabled={isProcessing}
                              onClick={() => updateReport(report.id, 'reviewing')}
                            >
                              <RefreshCw size={15} />
                              รับตรวจสอบ
                            </button>
                          )}

                          <button
                            type="button"
                            style={{
                              ...styles.rejectButton,
                              opacity: isProcessing ? 0.5 : 1,
                            }}
                            disabled={isProcessing}
                            onClick={() => hideReportedStory(report)}
                          >
                            <EyeOff size={15} />
                            ซ่อนโพสต์และปิดเคส
                          </button>

                          <button
                            type="button"
                            style={{
                              ...styles.warningButton,
                              opacity: isProcessing ? 0.5 : 1,
                            }}
                            disabled={isProcessing}
                            onClick={() => escalateReportedStory(report)}
                          >
                            <AlertTriangle size={15} />
                            คิวเร่งด่วน
                          </button>

                          <button
                            type="button"
                            style={{
                              ...styles.secondaryButton,
                              opacity: isProcessing ? 0.5 : 1,
                            }}
                            disabled={isProcessing}
                            onClick={() => updateReport(report.id, 'dismissed')}
                          >
                            <X size={15} />
                            ยกเลิกรายงาน
                          </button>

                          <button
                            type="button"
                            style={{
                              ...styles.approveButton,
                              opacity: isProcessing ? 0.5 : 1,
                            }}
                            disabled={isProcessing}
                            onClick={() => updateReport(report.id, 'resolved')}
                          >
                            <Check size={15} />
                            ปิดเคส
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </section>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
