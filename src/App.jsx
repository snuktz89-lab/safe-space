import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  Heart,
  LoaderCircle,
  MessageCircle,
  Moon,
  Phone,
  RefreshCw,
  Send,
  Shield,
  Sparkles,
  Star,
  X,
} from 'lucide-react';

import { supabase } from './supabaseClient';

const CATEGORIES = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'school', label: 'โรงเรียน' },
  { id: 'work', label: 'ที่ทำงาน' },
  { id: 'online', label: 'ออนไลน์' },
  { id: 'family', label: 'ครอบครัว' },
  { id: 'other', label: 'อื่น ๆ' },
];

const CATEGORY_NAMES = {
  school: 'โรงเรียน / มหาวิทยาลัย',
  work: 'ที่ทำงาน',
  online: 'ออนไลน์ / โซเชียล',
  family: 'ครอบครัว / คนใกล้ตัว',
  other: 'อื่น ๆ',
};

const NICKNAME_CHOICES = [
  'ดาวเหนือ',
  'แสงเทียน',
  'หิ่งห้อยน้อย',
  'จันทร์เสี้ยว',
  'ท้องฟ้ายามเช้า',
  'สายลมเย็น',
  'ดอกไม้กลางคืน',
  'สายฝนบาง ๆ',
  'แสงแรก',
  'เมฆขาว',
];
function getAnonymousSessionId() {
  const storageKey = 'safelight-session-id';

  try {
    const existingSessionId =
      window.localStorage.getItem(storageKey);

    if (existingSessionId) {
      return existingSessionId;
    }

    const newSessionId =
      window.crypto.randomUUID();

    window.localStorage.setItem(
      storageKey,
      newSessionId
    );

    return newSessionId;
  } catch (error) {
    console.error(
      'Cannot create anonymous session:',
      error
    );

    return window.crypto.randomUUID();
  }
}
function createNickname() {
  const name =
    NICKNAME_CHOICES[
      Math.floor(Math.random() * NICKNAME_CHOICES.length)
    ];

  const number = Math.floor(100 + Math.random() * 900);

  return `${name} #${number}`;
}

function formatTime(timestamp) {
  if (!timestamp) {
    return '';
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const seconds = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 1000)
  );

  if (seconds < 60) {
    return 'เมื่อสักครู่';
  }

  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)} นาทีที่แล้ว`;
  }

  if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)} ชั่วโมงที่แล้ว`;
  }

  return `${Math.floor(seconds / 86400)} วันที่แล้ว`;
}

function StarBackground() {
  const stars = useMemo(() => {
    return Array.from({ length: 36 }, (_, index) => ({
      id: index,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 4,
    }));
  }, []);

  return (
    <div className="star-background" aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className="background-star"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function LoadingView() {
  return (
    <section className="empty-state">
      <LoaderCircle
        size={30}
        className="loading-spinner"
      />

      <p>กำลังเปิดพื้นที่แห่งแสง...</p>
    </section>
  );
}

function ErrorView({ message, onRetry }) {
  return (
    <section className="empty-state">
      <RefreshCw size={30} />

      <p>{message}</p>

      <button
        type="button"
        className="retry-button"
        onClick={onRetry}
      >
        ลองใหม่
      </button>
    </section>
  );
}

function StoryCard({
  story,
  expanded,
  liked,
  commentDraft,
  submittingComment,
  onToggleExpanded,
  onToggleHeart,
  onCommentChange,
  onSubmitComment,
}) {
  const comments = Array.isArray(story.comments)
    ? story.comments
    : [];

  return (
    <article className="story-card">
      <div className="story-header">
        <div className="story-author">
          <span className="author-light" />

          <div>
            <div className="author-name">
              {story.nickname || 'แสงนิรนาม'}
            </div>

            <div className="story-time">
              {formatTime(
                story.published_at || story.created_at
              )}
            </div>
          </div>
        </div>

        <span className="category-badge">
          {CATEGORY_NAMES[story.category] || 'อื่น ๆ'}
        </span>
      </div>

      <h2 className="story-title">
        {story.title || 'เรื่องราวที่อยากแบ่งปัน'}
      </h2>

      <p
        className={
          expanded
            ? 'story-body expanded'
            : 'story-body'
        }
      >
        {story.body}
      </p>

      {story.body?.length > 130 && (
        <button
          type="button"
          className="read-more-button"
          onClick={onToggleExpanded}
        >
          {expanded ? 'ย่อลง' : 'อ่านต่อ'}

          <ChevronDown
            size={14}
            className={
              expanded
                ? 'chevron rotated'
                : 'chevron'
            }
          />
        </button>
      )}

      <div className="story-actions">
        <button
          type="button"
          className={
            liked
              ? 'action-button liked'
              : 'action-button'
          }
          onClick={onToggleHeart}
        >
          <Heart
            size={17}
            strokeWidth={1.8}
            fill={liked ? 'currentColor' : 'none'}
          />

          <span>
            {Number(story.heart_count || 0)}
          </span>

          <span>ส่งกำลังใจ</span>
        </button>

        <button
          type="button"
          className="action-button comment-action"
          onClick={onToggleExpanded}
        >
          <MessageCircle size={17} strokeWidth={1.8} />

          <span>
            {story.comment_count ?? comments.length}
          </span>

          <span>ข้อความ</span>
        </button>
      </div>

      {expanded && (
        <div className="comment-area">
          {comments.length === 0 && (
            <p className="no-comments">
              ยังไม่มีข้อความที่ผ่านการตรวจสอบ
              คุณสามารถส่งข้อความดี ๆ
              เข้าคิวผู้ดูแลได้
            </p>
          )}

          {comments.map((comment) => (
            <div
              key={comment.id}
              className="comment-bubble"
            >
              <span className="comment-name">
                {comment.nickname || 'แสงนิรนาม'}
              </span>

              <span>{comment.text}</span>
            </div>
          ))}

          {story.comments_enabled !== false && (
            <div className="comment-form">
              <input
                type="text"
                className="comment-input"
                value={commentDraft}
                maxLength={500}
                placeholder="ส่งข้อความให้กำลังใจ..."
                disabled={submittingComment}
                onChange={(event) =>
                  onCommentChange(event.target.value)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === 'Enter' &&
                    !submittingComment
                  ) {
                    onSubmitComment();
                  }
                }}
              />

              <button
                type="button"
                className="send-comment-button"
                onClick={onSubmitComment}
                disabled={
                  submittingComment ||
                  !commentDraft.trim()
                }
                aria-label="ส่งข้อความ"
              >
                {submittingComment ? (
                  <LoaderCircle
                    size={15}
                    className="loading-spinner"
                  />
                ) : (
                  <Send size={15} />
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function WriteStory({
  nickname,
  form,
  saving,
  onFormChange,
  onClose,
  onSubmit,
}) {
  return (
    <section className="write-card">
      <div className="write-header">
        <div>
          <h2>เล่าเรื่องของคุณ</h2>

          <p>
            เรื่องจะถูกส่งเข้าคิวผู้ดูแลก่อนเผยแพร่
          </p>
        </div>

        <button
          type="button"
          className="close-button"
          onClick={onClose}
          disabled={saving}
          aria-label="ปิดหน้าเขียนเรื่อง"
        >
          <X size={21} />
        </button>
      </div>

      <div className="nickname-box">
        <Star size={17} />

        <span>
          ชื่อที่ระบบตั้งให้คือ{' '}
          <strong>{nickname}</strong>
        </span>
      </div>

      <label className="field-label">
        หมวดหมู่
      </label>

      <div className="write-categories">
        {CATEGORIES.filter(
          (category) => category.id !== 'all'
        ).map((category) => (
          <button
            type="button"
            key={category.id}
            disabled={saving}
            className={
              form.category === category.id
                ? 'write-category selected'
                : 'write-category'
            }
            onClick={() =>
              onFormChange({
                ...form,
                category: category.id,
              })
            }
          >
            {category.label}
          </button>
        ))}
      </div>

      <label
        className="field-label"
        htmlFor="story-title"
      >
        หัวข้อสั้น ๆ
        <span> ไม่บังคับ</span>
      </label>

      <input
        id="story-title"
        type="text"
        className="form-input"
        maxLength={80}
        disabled={saving}
        placeholder="เช่น วันที่ฉันไม่กล้าไปโรงเรียน"
        value={form.title}
        onChange={(event) =>
          onFormChange({
            ...form,
            title: event.target.value,
          })
        }
      />

      <label
        className="field-label"
        htmlFor="story-body"
      >
        เรื่องราวของคุณ
      </label>

      <textarea
        id="story-body"
        className="form-input story-textarea"
        rows={8}
        maxLength={3000}
        disabled={saving}
        placeholder="เล่าได้เท่าที่คุณสบายใจ โดยไม่ระบุข้อมูลที่สามารถระบุตัวบุคคล..."
        value={form.body}
        onChange={(event) =>
          onFormChange({
            ...form,
            body: event.target.value,
          })
        }
      />

      <div className="character-count">
        {form.body.length}/3000
      </div>

      <label className="consent-box">
        <input
          type="checkbox"
          checked={form.consent}
          disabled={saving}
          onChange={(event) =>
            onFormChange({
              ...form,
              consent: event.target.checked,
            })
          }
        />

        <span>
          ฉันจะไม่เปิดเผยชื่อ เบอร์โทร ที่อยู่
          โรงเรียน บริษัท
          หรือข้อมูลที่สามารถระบุตัวตนของผู้อื่นได้
        </span>
      </label>

      <button
        type="button"
        className="submit-story-button"
        disabled={
          saving ||
          !form.body.trim() ||
          !form.consent
        }
        onClick={onSubmit}
      >
        {saving ? (
          <>
            <LoaderCircle
              size={17}
              className="loading-spinner"
            />
            กำลังส่งเรื่อง...
          </>
        ) : (
          <>
            <Send size={17} />
            ส่งเรื่องเข้าคิวตรวจสอบ
          </>
        )}
      </button>

      <p className="moderation-note">
        เรื่องจะยังไม่ปรากฏบน Feed
        จนกว่าผู้ดูแลจะตรวจสอบและอนุมัติ
      </p>
    </section>
  );
}

function SupportModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <section className="support-modal">
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="ปิด"
        >
          <X size={20} />
        </button>

        <Phone className="support-icon" size={30} />

        <h2>
          คุณไม่จำเป็นต้องผ่านเรื่องนี้คนเดียว
        </h2>

        <p>
          หากรู้สึกไม่ปลอดภัยหรือต้องการพูดคุย
          กับใครสักคนในตอนนี้
          โปรดติดต่อบุคคลที่ไว้ใจได้
          หรือสายด่วนสุขภาพจิต 1323
        </p>

        <a className="call-button" href="tel:1323">
          โทร 1323
        </a>

        <button
          type="button"
          className="return-button"
          onClick={onClose}
        >
          กลับไปยังพื้นที่แบ่งปัน
        </button>
      </section>
    </div>
  );
}

export default function App() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('feed');
  const [expandedId, setExpandedId] = useState(null);

  const [nickname, setNickname] = useState(
    createNickname()
  );
const [anonymousSessionId] = useState(
  getAnonymousSessionId
);
  const [likedStoryIds, setLikedStoryIds] =
    useState([]);

  const [commentDrafts, setCommentDrafts] =
    useState({});

  const [submittingCommentId, setSubmittingCommentId] =
    useState(null);

  const [showSupport, setShowSupport] =
    useState(false);

  const [notice, setNotice] = useState('');
  const [savingStory, setSavingStory] =
    useState(false);

  const [form, setForm] = useState({
    category: 'school',
    title: '',
    body: '',
    consent: false,
  });
async function loadSessionReactions() {
  try {
    const { data, error } = await supabase.rpc(
      'get_session_reactions',
      {
        p_session_id: anonymousSessionId,
      }
    );

    if (error) {
      throw error;
    }

    const likedIds = (data || []).map(
      (reaction) => reaction.story_id
    );

    setLikedStoryIds(likedIds);
  } catch (error) {
    console.error(
      'โหลดสถานะหัวใจไม่สำเร็จ:',
      error
    );

    setLikedStoryIds([]);
  }
}
  async function loadStories() {
    setLoading(true);
    setLoadError('');

    try {
      const { data: feedRows, error: feedError } =
        await supabase
          .from('public_story_feed')
          .select(
            `
              id,
              category,
              title,
              body,
              nickname,
              created_at,
              published_at,
              comments_enabled,
              heart_count,
              comment_count
            `
          )
          .order('published_at', {
            ascending: false,
            nullsFirst: false,
          });

      if (feedError) {
        throw feedError;
      }

      const storyIds = (feedRows || []).map(
        (story) => story.id
      );

      let commentRows = [];

      if (storyIds.length > 0) {
        const {
          data: publishedComments,
          error: commentError,
        } = await supabase
          .from('comments')
          .select(
            'id, story_id, text, nickname, created_at'
          )
          .in('story_id', storyIds)
          .order('created_at', {
            ascending: true,
          });

        if (commentError) {
          console.error(
            'โหลดความคิดเห็นไม่สำเร็จ:',
            commentError
          );
        } else {
          commentRows = publishedComments || [];
        }
      }

      const mergedStories = (feedRows || []).map(
        (story) => ({
          ...story,
          comments: commentRows.filter(
            (comment) =>
              comment.story_id === story.id
          ),
        })
      );

      setStories(mergedStories);
    } catch (error) {
      console.error('โหลด Feed ไม่สำเร็จ:', error);

      setLoadError(
        'ยังโหลดเรื่องราวจากฐานข้อมูลไม่ได้ กรุณาลองใหม่'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  async function initializeFeed() {
    await Promise.all([
      loadStories(),
      loadSessionReactions(),
    ]);
  }

  initializeFeed();
}, []);

  const visibleStories =
    filter === 'all'
      ? stories
      : stories.filter(
          (story) => story.category === filter
        );

  function openWriteView() {
    setNickname(createNickname());
    setNotice('');
    setView('write');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  function closeWriteView() {
    if (savingStory) {
      return;
    }

    setView('feed');
  }

  async function submitStory() {
    const cleanBody = form.body.trim();
    const cleanTitle =
      form.title.trim() ||
      'เรื่องราวที่อยากแบ่งปัน';

    if (!cleanBody || !form.consent) {
      return;
    }

    setSavingStory(true);
    setNotice('');

    try {
      const { error } = await supabase
        .from('stories')
        .insert({
          category: form.category,
          title: cleanTitle,
          body: cleanBody,
          nickname,
          status: 'pending',
          risk_level: 'normal',
          published_at: null,
        });

      if (error) {
        throw error;
      }

      setForm({
        category: 'school',
        title: '',
        body: '',
        consent: false,
      });

      setNotice(
        'ส่งเรื่องเรียบร้อยแล้ว เรื่องกำลังรอผู้ดูแลตรวจสอบก่อนเผยแพร่'
      );

      setView('feed');

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch (error) {
      console.error('ส่งเรื่องไม่สำเร็จ:', error);

      setNotice(
        'ยังส่งเรื่องไม่ได้ กรุณาตรวจสอบข้อความและลองใหม่อีกครั้ง'
      );
    } finally {
      setSavingStory(false);
    }
  }

  async function toggleHeart(storyId) {
  setNotice('');

  try {
    const { data, error } = await supabase.rpc(
      'toggle_story_reaction',
      {
        p_story_id: storyId,
        p_session_id: anonymousSessionId,
      }
    );

    if (error) {
      throw error;
    }

    const isLiked =
      data?.liked === true;

    const nextHeartCount =
      Number(data?.heart_count || 0);

    setLikedStoryIds((currentIds) => {
      if (isLiked) {
        if (currentIds.includes(storyId)) {
          return currentIds;
        }

        return [...currentIds, storyId];
      }

      return currentIds.filter(
        (id) => id !== storyId
      );
    });

    setStories((currentStories) =>
      currentStories.map((story) => {
        if (story.id !== storyId) {
          return story;
        }

        return {
          ...story,
          heart_count: nextHeartCount,
        };
      })
    );
  } catch (error) {
    console.error(
      'ส่งกำลังใจไม่สำเร็จ:',
      error
    );

    setNotice(
      'ยังส่งกำลังใจไม่ได้ กรุณาลองใหม่อีกครั้ง'
    );
  }
}

  async function submitComment(storyId) {
    const commentText = (
      commentDrafts[storyId] || ''
    ).trim();

    if (!commentText || submittingCommentId) {
      return;
    }

    setSubmittingCommentId(storyId);
    setNotice('');

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          story_id: storyId,
          text: commentText,
          nickname: createNickname(),
          status: 'pending',
        });

      if (error) {
        throw error;
      }

      setCommentDrafts({});

      setNotice(
        'ส่งข้อความเรียบร้อยแล้ว ข้อความกำลังรอผู้ดูแลตรวจสอบ'
      );
    } catch (error) {
      console.error(
        'ส่งความคิดเห็นไม่สำเร็จ:',
        error
      );

      setNotice(
        'ยังส่งข้อความไม่ได้ กรุณาลองใหม่อีกครั้ง'
      );
    } finally {
      setSubmittingCommentId(null);
    }
  }

  return (
    <div className="app">
      <StarBackground />

      {showSupport && (
        <SupportModal
          onClose={() => setShowSupport(false)}
        />
      )}

      <main className="mobile-page">
        <header className="main-header">
          <div className="brand">
            <div className="brand-icon">
              <Moon size={27} strokeWidth={1.5} />
            </div>

            <div>
              <h1>แสงที่ไม่มีชื่อ</h1>

              <p>
                พื้นที่เล็ก ๆ สำหรับแบ่งปันเรื่องราว
              </p>
            </div>
          </div>

          {view === 'feed' && (
            <button
              type="button"
              className="write-button"
              onClick={openWriteView}
            >
              <Sparkles size={16} />
              <span>เล่าเรื่อง</span>
            </button>
          )}
        </header>

        {notice && (
          <div className="notice-message">
            {notice}
          </div>
        )}

        {view === 'feed' && (
          <>
            <section className="intro-card">
              <div>
                <h2>
                  ที่นี่คือพื้นที่แห่งความเข้าใจ
                </h2>

                <p>
                  ไม่ต้องเปิดเผยตัวตน
                  เล่าเรื่องที่พบเจอได้เท่าที่สบายใจ
                  และส่งข้อความดี ๆ ไว้ให้กัน
                </p>

                <button
                  type="button"
                  className="support-link"
                  onClick={() =>
                    setShowSupport(true)
                  }
                >
                  ต้องการช่องทางช่วยเหลือ
                </button>
              </div>

              <Heart
                size={36}
                className="intro-heart"
                fill="currentColor"
              />
            </section>

            <nav
              className="category-list"
              aria-label="หมวดหมู่เรื่องราว"
            >
              {CATEGORIES.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  className={
                    filter === category.id
                      ? 'category-button active'
                      : 'category-button'
                  }
                  onClick={() =>
                    setFilter(category.id)
                  }
                >
                  {category.label}
                </button>
              ))}
            </nav>

            {loading && <LoadingView />}

            {!loading && loadError && (
              <ErrorView
                message={loadError}
                onRetry={loadStories}
              />
            )}

            {!loading &&
              !loadError &&
              visibleStories.length === 0 && (
                <section className="empty-state">
                  <Star size={30} />

                  <p>
                    ยังไม่มีเรื่องราวที่ผ่านการตรวจสอบ
                    ในหมวดนี้
                  </p>
                </section>
              )}

            {!loading && !loadError && (
              <section className="story-list">
                {visibleStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    expanded={
                      expandedId === story.id
                    }
                    liked={likedStoryIds.includes(
                      story.id
                    )}
                    commentDraft={
                      commentDrafts[story.id] || ''
                    }
                    submittingComment={
                      submittingCommentId ===
                      story.id
                    }
                    onToggleExpanded={() =>
                      setExpandedId(
                        expandedId === story.id
                          ? null
                          : story.id
                      )
                    }
                    onToggleHeart={() =>
                      toggleHeart(story.id)
                    }
                    onCommentChange={(value) =>
                      setCommentDrafts(
                        (currentDrafts) => ({
                          ...currentDrafts,
                          [story.id]: value,
                        })
                      )
                    }
                    onSubmitComment={() =>
                      submitComment(story.id)
                    }
                  />
                ))}
              </section>
            )}

            <button
              type="button"
              className="floating-write-button"
              onClick={openWriteView}
            >
              <Sparkles size={18} />
              เล่าเรื่องของฉัน
            </button>
          </>
        )}

        {view === 'write' && (
          <WriteStory
            nickname={nickname}
            form={form}
            saving={savingStory}
            onFormChange={setForm}
            onClose={closeWriteView}
            onSubmit={submitStory}
          />
        )}

        <footer className="main-footer">
          <Shield size={17} />

          <p>
            พื้นที่นี้ไม่ใช่บริการฉุกเฉิน
            การรักษา
            หรือการให้คำปรึกษาทางการแพทย์
            หากรู้สึกไม่ปลอดภัย
            โปรดติดต่อบุคคลที่ไว้ใจได้
            หรือสายด่วนสุขภาพจิต 1323
          </p>
        </footer>
      </main>
    </div>
  );
}
