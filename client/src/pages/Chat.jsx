import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Send, MessageCircle } from 'lucide-react';
import io from 'socket.io-client';

const socket = io('https://campus-lost-found-ml6c.onrender.com');

const Chat = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const receiverId = searchParams.get('userId');
  const itemId = searchParams.get('itemId');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(receiverId || null);
  const [activeUserName, setActiveUserName] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (user) socket.emit('join', user._id);
  }, [user]);

  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => socket.off('receiveMessage');
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await API.get('/chat');
        setConversations(data);
        if (receiverId) {
          const conv = data.find(c => c.user._id === receiverId);
          if (conv) setActiveUserName(conv.user.name);
        }
      } catch { }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeUser) {
      const fetchMessages = async () => {
        try {
          const { data } = await API.get(`/chat/${activeUser}`);
          setMessages(data);
        } catch { }
      };
      fetchMessages();
    }
  }, [activeUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !activeUser) return;
    socket.emit('sendMessage', {
      sender: user._id,
      receiver: activeUser,
      message: text,
      item: itemId || null
    });
    setText('');
  };

  const formatTime = (date) => new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="min-h-screen dot-grid">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="font-display text-4xl font-bold text-white">Messages</h1>
          <p className="text-[var(--muted)] mt-1">Chat with finders and owners in real-time</p>
        </div>

        <div className="glass rounded-2xl border border-[var(--border)] flex overflow-hidden"
          style={{ height: '580px' }}>

          {/* Sidebar */}
          <div className="w-72 border-r border-[var(--border)] flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-[var(--border)]">
              <p className="text-xs text-[var(--muted)] uppercase tracking-wider font-medium">Conversations</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageCircle size={28} className="text-[var(--muted)] mx-auto mb-2 opacity-30" />
                  <p className="text-[var(--muted)] text-sm">No conversations yet</p>
                </div>
              ) : (
                conversations.map(conv => (
                  <div key={conv.user._id}
                    onClick={() => { setActiveUser(conv.user._id); setActiveUserName(conv.user.name); }}
                    className={`p-4 cursor-pointer border-b border-[var(--border)] transition-all ${
                      activeUser === conv.user._id
                        ? 'bg-[var(--accent)]/10 border-l-2 border-l-[var(--accent)]'
                        : 'hover:bg-white/5'
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {conv.user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-white text-sm font-medium truncate">{conv.user.name}</p>
                          {conv.unread > 0 && (
                            <span className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-[var(--muted)] text-xs truncate mt-0.5">{conv.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col min-w-0">
            {!activeUser ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center mb-4">
                  <MessageCircle size={28} className="text-[var(--accent)] opacity-60" />
                </div>
                <h3 className="font-display text-lg font-semibold text-white mb-1">Select a conversation</h3>
                <p className="text-[var(--muted)] text-sm">Choose a conversation from the left to start chatting</p>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] flex items-center justify-center text-sm font-bold text-white">
                    {activeUserName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{activeUserName}</p>
                    <p className="text-[var(--success)] text-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" /> Online
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center text-[var(--muted)] text-sm py-8">
                      No messages yet. Say hello!
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const isMine = msg.sender._id === user._id || msg.sender === user._id;
                      return (
                        <div key={i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-sm ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              isMine
                                ? 'bg-[var(--accent)] text-white rounded-br-md'
                                : 'glass border border-[var(--border)] text-white rounded-bl-md'
                            }`}>
                              {msg.message}
                            </div>
                            <span className="text-xs text-[var(--muted)] px-1">
                              {formatTime(msg.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-[var(--border)] flex gap-3">
                  <input
                    type="text" value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="input-dark flex-1 px-4 py-3 rounded-xl text-sm"
                  />
                  <button onClick={sendMessage}
                    className="btn-primary w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Send size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;