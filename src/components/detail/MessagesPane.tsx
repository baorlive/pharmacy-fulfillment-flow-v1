'use client';

import { useRef, useState } from 'react';
import type { Order } from '@/lib/types';
import Icon from '@/components/ui/Icon';

interface MessagesPaneProps {
  order: Order;
  onSendMsg: (text: string) => void;
}

function formatMsgText(text: string) {
  const parts = text.split(/(📷|🙏)/g);
  return parts.map((part, i) => {
    if (part === '📷') return <span key={i} className="msg-inline-icon"><Icon name="image" /></span>;
    if (part === '🙏') return <span key={i} className="msg-inline-icon"><Icon name="user" /></span>;
    return part;
  });
}

export default function MessagesPane({ order, onSendMsg }: MessagesPaneProps) {
  const [inputValue, setInputValue] = useState('');
  const isSendingRef = useRef(false);
  const unreadCount = order.msgs.filter(m => m.unread).length;

  function handleSend() {
    if (isSendingRef.current) return;
    if (!inputValue.trim()) return;
    isSendingRef.current = true;
    onSendMsg(inputValue.trim());
    setInputValue('');
    // Release on next tick so one user action only yields one message.
    queueMicrotask(() => { isSendingRef.current = false; });
  }

  return (
    <div className="messages-section">
      <div className="section-header">
        <span className="binfo-label">Messages</span>
        {unreadCount > 0 && <span className="unread-count">{unreadCount} new</span>}
      </div>
      {order.msgs.length > 0 ? (
        <div className="messages-list">
          {order.msgs.map((msg, idx) => (
            <div key={idx} className={`msg-bubble ${msg.from === 'pharmacy' ? 'is-own' : ''}`}>
              <div className="msg-meta">
                <span className={`msg-sender ${msg.from === 'buyer' ? 'from-buyer' : ''}`}>
                  {msg.from === 'buyer' ? order.customer : 'You'}
                </span>
                <span className="msg-time">{msg.time}</span>
              </div>
              <div className={`msg-text ${msg.from === 'buyer' ? (msg.unread ? 'unread' : 'from-buyer') : ''}`}>
                {formatMsgText(msg.text)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="msg-empty">No messages yet.</div>
      )}
      <div className="msg-input-row">
        <input
          className="msg-input"
          type="text"
          placeholder="Reply…"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => {
            if (e.key !== 'Enter') return;
            if (e.repeat || (e.nativeEvent as KeyboardEvent).isComposing) return;
            e.preventDefault();
            handleSend();
          }}
        />
        <button className="msg-send-btn" type="button" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
