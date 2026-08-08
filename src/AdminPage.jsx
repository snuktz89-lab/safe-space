import React, { useEffect, useState } from 'react';
import {
  Check,
  EyeOff,
  LoaderCircle,
  LogIn,
  LogOut,
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

const styles = {
  page: {
    minHeight: '100vh',
    padding: '24px 16px 60px',
    color: '#f8f2ff',
    background:
      'linear-gradient(180deg, #17142f 0%, #241f42 50%, #121029 100%)',
    fontFamily: "'Sarabun', Arial, sans-serif",
  },

  container: {
    width: '100%',
    maxWidth: '760px',
    margin: '0 auto',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '22px',
  },

  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
  },

  title: {
    margin: 0,
    color: '#ffe1b2',
    fontSize: '22px',
    fontWeight: 600,
  },

  subtitle: {
    margin: '4px 0 0',
    color: 'rgba(225, 211, 240, 0.55)',
    fontSize: '12px',
  },

  card: {
    padding: '18px',
    border: '1px solid rgba(216, 194, 250, 0.14)',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.055)',
    boxShadow: '0 18px 48px rgba(0, 0, 0, 0.22)',
  },

  label: {
    display: 'block',
    margin: '14px 0 7px',
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

  queue: {
    display: 'grid',
    gap: '14px',
  },

  postTitle: {
    margin: '12px 0 7px',
    color: '#fff0dc',
    fontSize: '18px',
  },

  postBody: {
    margin: 0,
    color: 'rgba(233, 222, 243, 0.75)',
    fontSize: '13px',
    lineHeight: 1.75,
    whiteSpace: 'pre-wrap',
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

  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '16px',
    paddingTop: '14px',
    borderTop: '1px solid rgba(255, 255, 255, 0.07)',
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

  escalateButton: {
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

  message: {
    marginBottom: '14px',
    padding: '11px 13px',
    borderRadius: '13px',
    color: 'rgba(255, 233, 205, 0.88)',
    background: 'rgba(245, 198, 165, 0.1)',
    fontSize: '12px',
    lineHeight: 1.55,
  },

  error: {
    marginBottom: '14px',
    padding: '11px 13px',
    borderRadius: '13px',
    color: '#ffc5cd',
    background: 'rgba(224, 80, 96, 0.12)',
    fontSize: '12px',
    lineHeight: 1.55,
  },
};

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleLogin(event) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setErrorMessage('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    setLoggingIn(true);
    setErrorMessage('');

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    setLoggingIn(false);

    if (error) {
      setErrorMessage(
        'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมลและรหัสผ่าน'
      );
      return;
    }

    onLogin(data.session);
  }

  return (
    <section style={styles.card}>
      <div style={{ textAlign: 'center' }}>
        <Shield
          size={38}
          color="#ffd0a5"
          style={{ marginBottom: '11px' }}
        />

        <h2 style={{ margin: 0, color: '#fff0dc' }}>
          เข้าสู่ระบบผู้ดูแล
        </h2>

        <p style={styles.subtitle}>
          สำหรับผู้ดูแลที่ได้รับอนุญาตเท่านั้น
        </p>
      </div>

      {errorMessage && (
        <div style={styles.error}>{errorMessage}</div>
      )}

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
          style={{
            ...styles.primaryButton,
            opacity: loggingIn ? 0.55 : 1,
          }}
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

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [queue, setQueue] = useState([]);
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [processingId, setProcessingId] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session || null);
        setCheckingSession(false);
      }
    });

    const { data: authListener } =
      supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession);
        setCheckingSession(false);
      });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) {
      loadQueue();
    } else {
      setQueue([]);
    }
  }, [session]);

  async function loadQueue() {
    setLoadingQueue(true);
    setErrorMessage('');
    setMessage('');

    const { data, error } = await supabase
      .from('admin_moderation_queue')
      .select('*');

    setLoadingQueue(false);

    if (error) {
      console.error('Admin queue error:', error);

      setErrorMessage(
        error.message ||
          'ไม่สามารถเปิดคิวตรวจสอบได้ บัญชีนี้อาจไม่มีสิทธิ์ผู้ดูแล'
      );

      setQueue([]);
      return;
    }

    setQueue(data || []);
  }

  async function updateStory(storyId, nextStatus) {
    setProcessingId(storyId);
    setErrorMessage('');
    setMessage('');

    const changes = {
      status: nextStatus,
    };

    if (nextStatus === 'published') {
      changes.published_at = new Date().toISOString();
      changes.risk_level = 'normal';
    } else {
      changes.published_at = null;
    }

    if (nextStatus === 'escalated') {
      changes.risk_level = 'urgent';
    }

    const { error } = await supabase
      .from('stories')
      .update(changes)
      .eq('id', storyId);

    setProcessingId('');

    if (error) {
      console.error('Moderation update error:', error);

      setErrorMessage(
        error.message ||
          'เปลี่ยนสถานะไม่สำเร็จ กรุณาตรวจสอบสิทธิ์ผู้ดูแล'
      );

      return;
    }

    if (nextStatus === 'published') {
      setMessage('อนุมัติและเผยแพร่เรื่องเรียบร้อยแล้ว');
    }

    if (nextStatus === 'rejected') {
      setMessage('ปฏิเสธเรื่องเรียบร้อยแล้ว');
    }

    if (nextStatus === 'escalated') {
      setMessage('ย้ายเรื่องเข้าสู่คิวเร่งด่วนแล้ว');
    }

    await loadQueue();
  }

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
    setQueue([]);
  }

  if (checkingSession) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <section style={styles.card}>
            <LoaderCircle size={24} />
            <p>กำลังตรวจสอบการเข้าสู่ระบบ...</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.brand}>
            <Moon size={29} color="#ffd09d" />

            <div>
              <h1 style={styles.title}>
                แสงที่ไม่มีชื่อ
              </h1>

              <p style={styles.subtitle}>
                ระบบตรวจสอบเนื้อหา
              </p>
            </div>
          </div>

          {session && (
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={logout}
            >
              <LogOut size={15} />
              ออกจากระบบ
            </button>
          )}
        </header>

        {!session && (
          <LoginForm onLogin={setSession} />
        )}

        {session && (
          <>
            {message && (
              <div style={styles.message}>{message}</div>
            )}

            {errorMessage && (
              <div style={styles.error}>
                {errorMessage}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                marginBottom: '15px',
              }}
            >
              <div>
                <strong>คิวรอตรวจสอบ</strong>

                <div style={styles.subtitle}>
                  {queue.length} รายการ
                </div>
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

            {loadingQueue && (
              <section style={styles.card}>
                <LoaderCircle size={24} />
                <p>กำลังโหลดคิวตรวจสอบ...</p>
              </section>
            )}

            {!loadingQueue &&
              !errorMessage &&
              queue.length === 0 && (
                <section style={styles.card}>
                  <Shield size={25} color="#bfaed5" />

                  <p
                    style={{
                      marginBottom: 0,
                      color: 'rgba(230, 216, 243, 0.62)',
                    }}
                  >
                    ไม่มีเรื่องที่รอตรวจสอบ
                  </p>
                </section>
              )}

            {!loadingQueue && (
              <section style={styles.queue}>
                {queue.map((story) => {
                  const isProcessing =
                    processingId === story.id;

                  return (
                    <article key={story.id} style={styles.card}>
                      <div style={styles.metadata}>
                        <span style={styles.badge}>
                          {CATEGORY_NAMES[story.category] ||
                            'อื่น ๆ'}
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
                          ความเสี่ยง: {story.risk_level}
                        </span>
                      </div>

                      <h2 style={styles.postTitle}>
                        {story.title}
                      </h2>

                      <p style={styles.postBody}>
                        {story.body}
                      </p>

                      <p style={styles.subtitle}>
                        ผู้เขียน: {story.nickname}
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
                            updateStory(
                              story.id,
                              'published'
                            )
                          }
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
                          onClick={() =>
                            updateStory(
                              story.id,
                              'rejected'
                            )
                          }
                        >
                          <X size={15} />
                          ปฏิเสธ
                        </button>

                        <button
                          type="button"
                          style={{
                            ...styles.escalateButton,
                            opacity: isProcessing ? 0.5 : 1,
                          }}
                          disabled={isProcessing}
                          onClick={() =>
                            updateStory(
                              story.id,
                              'escalated'
                            )
                          }
                        >
                          <EyeOff size={15} />
                          คิวเร่งด่วน
                        </button>
                      </div>
                    </article>
                  );
                })}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}