import { useState, useEffect, useRef } from 'react'
import { aiAPI } from '../../api/client'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'
import AgentOrchestrationVisualizer from '../../components/AgentOrchestrationVisualizer'
import SystemHealthIndicator from '../../components/SystemHealthIndicator'
import styles from '../../styles/pages/app/AIChatPage.module.css'

export default function AIChatPage() {
  const { user } = useAuthStore()
  const [sessions, setSessions] = useState([])
  const [activeSession, setActiveSession] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionLoading, setSessionLoading] = useState(false)
  const [showOrchestration, setShowOrchestration] = useState(false)
  const [currentOrchestration, setCurrentOrchestration] = useState(null)
  const [expandedMessageId, setExpandedMessageId] = useState(null)
  const messagesEndRef = useRef(null)

  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    loadSessions()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadSessions = async () => {
    try {
      const res = await aiAPI.getSessions()
      setSessions(res.data || [])
    } catch {}
  }

  const loadSession = async (sessionId) => {
    setSessionLoading(true)
    setShowHistory(false) // Close modal on select
    try {
      const res = await aiAPI.getSession(sessionId)
      setActiveSession({ id: sessionId, title: res.data?.session?.title || 'Chat' })
      setMessages(res.data?.messages || [])
    } catch {
      toast.error('Failed to load session')
    } finally {
      setSessionLoading(false)
    }
  }

  const startNewChat = () => {
    setActiveSession(null)
    setMessages([])
    setShowHistory(false)
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = { role: 'user', content: input, created_at: new Date(), id: Date.now() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await aiAPI.chat({
        message: input,
        session_id: activeSession?.id || null,
        include_portfolio: true,
      })
      const data = res.data
      
      if (!activeSession) {
        setActiveSession({ id: data.session_id, title: input.slice(0, 60) })
        loadSessions()
      }
      
      // Store orchestration data for visualization
      const orchestrationData = {
        agents_used: data.agents_used || [],
        query_type: data.query_type || 'GENERAL',
        routing_confidence: data.routing_confidence || 0.85,
        execution_time: data.execution_time || 0,
        agent_responses: data.agent_responses || {}
      }
      
      setMessages((prev) => [
        ...prev.map(m => m.id === userMsg.id ? { ...m, id: data.user_message_id || m.id } : m),
        { 
          role: 'assistant', 
          content: data.content, 
          sources: data.sources, 
          created_at: data.created_at,
          orchestration: orchestrationData,
          id: data.message_id
        },
      ])
      
      // Auto-show first orchestration visualization
      if (!showOrchestration && orchestrationData.agents_used.length > 0) {
        setCurrentOrchestration(orchestrationData)
        setShowOrchestration(true)
      }
    } catch {
      toast.error('AI response failed. Please try again.')
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return
    
    try {
      await aiAPI.deleteMessage(messageId)
      setMessages(prev => prev.filter(m => m.id !== messageId))
      toast.success('Message deleted')
    } catch {
      toast.error('Failed to delete message')
    }
  }

  const handleClearSession = async () => {
    if (!activeSession) return
    if (!window.confirm('Clear all messages in this chat?')) return
    
    try {
      await aiAPI.clearSession(activeSession.id)
      setMessages([])
      toast.success('Chat cleared')
    } catch {
      toast.error('Failed to clear chat')
    }
  }

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation()
    if (!window.confirm('Delete this entire conversation?')) return
    
    try {
      await aiAPI.deleteSession(sessionId)
      setSessions(prev => prev.filter(s => s.id !== sessionId))
      if (activeSession?.id === sessionId) {
        setActiveSession(null)
        setMessages([])
      }
      toast.success('Session deleted')
    } catch {
      toast.error('Failed to delete session')
    }
  }

  const SUGGESTED = [
    'What is the best IT stock to buy right now?',
    'Analyze my portfolio risk and suggest rebalancing',
    'Explain RSI divergence in simple terms',
    'What sectors are leading the market this week?',
    'Compare RELIANCE vs ONGC fundamentals',
    'Should I invest in this IPO?',
  ]

  return (
    <div className={styles.chatWrapper}>
      {/* History Modal */}
      {showHistory && (
        <div className={styles.historyOverlay} onClick={() => setShowHistory(false)}>
          <div className={styles.historyPopup} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupHeader}>
              <h3>📜 CONVERSATION HISTORY</h3>
              <button 
                className={styles.closeBtn} 
                onClick={() => setShowHistory(false)}
              >✕</button>
            </div>
            
            <div className={styles.popupList}>
              {sessions.map((s) => (
                <div 
                  key={s.id} 
                  className={`${styles.popupItem} ${activeSession?.id === s.id ? styles.activeItem : ''}`}
                  onClick={() => loadSession(s.id)}
                >
                  <div className={styles.itemInfo}>
                    <div className={styles.itemTitle}>{s.title?.toUpperCase() || 'NEW CONVERSATION'}</div>
                    <div className={styles.itemDate}>{new Date(s.created_at).toLocaleDateString()}</div>
                  </div>
                  <button 
                    className={styles.deleteSessionBtn}
                    onClick={(e) => handleDeleteSession(e, s.id)}
                    title="Delete session"
                  >
                    🗑️
                  </button>
                </div>
              ))}
              {sessions.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', fontWeight: 900 }}>
                  NO HISTORY FOUND.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className={styles.chatMain}>
        <div className={styles.chatHeader}>
          <div>
            <h2 className={styles.chatTitle}>ARTHANOVA AI</h2>
            <p className={styles.chatSubtitle}>Multi-Agent System • Portfolio-aware • Autonomous Decision Making</p>
          </div>
          <div className={styles.headerRight}>
            <button 
              className={styles.newChatBtn}
              onClick={startNewChat}
              id="new-chat-btn"
            >
              + NEW CHAT
            </button>
            <button 
              className={styles.historyBtn} 
              onClick={() => setShowHistory(true)}
              id="show-history-btn"
            >
              📜 HISTORY
            </button>
            {activeSession && messages.length > 0 && (
              <button className={styles.clearBtn} onClick={handleClearSession}>
                🧹 Clear
              </button>
            )}
          </div>
        </div>

        <div className={styles.messagesArea}>
          {messages.length === 0 && !sessionLoading && (
            <div className={styles.welcomeScreen}>
              <div className={styles.welcomeIcon}>🤖</div>
              <h3>ASK ARTHANOVA AI ANYTHING</h3>
              <p style={{ fontWeight: 600, color: '#444' }}>Get intelligent, source-grounded answers about Indian markets, your portfolio, and investment strategies.</p>
              <div className={styles.suggestions}>
                {SUGGESTED.map((s) => (
                  <button key={s} className={styles.suggestion} onClick={() => setInput(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {sessionLoading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <div className="spinner" style={{ width: 40, height: 40, border: '4px solid #000' }} />
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={msg.id || i} className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.aiMsg}`}>
              <div className={msg.role === 'user' ? styles.msgAvatarUser : styles.msgAvatar}>
                {msg.role === 'user' ? (user?.full_name?.charAt(0) || 'U') : '🤖'}
              </div>
              <div className={styles.msgContent}>
                <div className={styles.msgText}>{msg.content}</div>
                
                {/* Agent Breakdown */}
                {msg.orchestration?.agents_used?.length > 0 && (
                  <div className={styles.agentBreakdown}>
                    <button 
                      className={styles.agentsToggle}
                      onClick={() => setExpandedMessageId(expandedMessageId === msg.id ? null : msg.id)}
                    >
                      🔗 {msg.orchestration.execution_time ? msg.orchestration.execution_time.toFixed(0) : '0'}ms • {msg.orchestration.agents_used.length} AGENTS
                    </button>
                    {expandedMessageId === msg.id && (
                      <div className={styles.agentsDetail}>
                        {msg.orchestration.agents_used.map((agent, j) => (
                          <div key={j} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #ddd', fontSize: '0.7rem', fontWeight: 900 }}>
                            <span style={{ textTransform: 'uppercase' }}>{agent}</span>
                            <span style={{ color: '#14a800' }}>✓ COMPLETE</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {msg.sources && msg.sources.length > 0 && (
                  <div style={{ marginTop: 15, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {msg.sources.map((src, j) => (
                      <span key={j} style={{ padding: '2px 8px', background: '#000', color: '#fff', fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase' }}>
                        {src.title}
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <div className={styles.msgTime}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className={styles.msgActions}>
                    <button 
                      className={styles.deleteMsgBtn}
                      onClick={() => handleDeleteMessage(msg.id)}
                      title="Delete message"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className={`${styles.message} ${styles.aiMsg}`}>
              <div className={styles.msgAvatar}>🤖</div>
              <div className={styles.msgContent} style={{ minWidth: 80 }}>
                <div className="typing">
                  <span style={{ background: '#000' }}/><span style={{ background: '#000' }}/><span style={{ background: '#000' }}/>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className={styles.inputArea}>
          <div className={styles.inputWrapper}>
            <textarea
              className={styles.chatInput}
              placeholder="Ask about any stock, sector, or your portfolio..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e) }
              }}
              rows={1}
              disabled={loading}
            />
            <button type="submit" className={styles.sendBtn} disabled={!input.trim() || loading} id="send-message-btn">
              {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : '➤'}
            </button>
          </div>
          <p className={styles.inputDisclaimer}>ArthaNova AI provides information for educational purposes only. Not financial advice.</p>
        </form>
      </div>
    </div>
  );
}
