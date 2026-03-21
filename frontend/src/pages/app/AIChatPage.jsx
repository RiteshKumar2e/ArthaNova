import { useState, useEffect, useRef } from 'react'
import { aiAPI } from '../../api/client'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'
import AgentOrchestrationVisualizer from '../../components/AgentOrchestrationVisualizer'
import SystemHealthIndicator from '../../components/SystemHealthIndicator'
import styles from '../../styles/pages/app/AIChatPage.module.scss'

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

  useEffect(() => {
    loadSessions()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadSessions = async () => {
    try {
      const res = await aiAPI.getSessions()
      setSessions(res.data)
    } catch {}
  }

  const loadSession = async (sessionId) => {
    setSessionLoading(true)
    try {
      const res = await aiAPI.getSession(sessionId)
      setActiveSession({ id: sessionId, title: res.data.session.title })
      setMessages(res.data.messages)
    } catch {
      toast.error('Failed to load session')
    } finally {
      setSessionLoading(false)
    }
  }

  const startNewChat = () => {
    setActiveSession(null)
    setMessages([])
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = { role: 'user', content: input, created_at: new Date() }
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
      setActiveSession({ id: data.session_id, title: input.slice(0, 60) })
      
      // Store orchestration data for visualization
      const orchestrationData = {
        agents_used: data.agents_used || [],
        query_type: data.query_type || 'GENERAL',
        routing_confidence: data.routing_confidence || 0.85,
        execution_time: data.execution_time || 0,
        agent_responses: data.agent_responses || {}
      }
      
      setMessages((prev) => [
        ...prev,
        { 
          role: 'assistant', 
          content: data.content, 
          sources: data.sources, 
          created_at: data.created_at,
          orchestration: orchestrationData,
          messageId: Date.now()
        },
      ])
      
      // Auto-show first orchestration visualization
      if (!showOrchestration && orchestrationData.agents_used.length > 0) {
        setCurrentOrchestration(orchestrationData)
        setShowOrchestration(true)
      }
      
      if (!activeSession) loadSessions()
    } catch {
      toast.error('AI response failed. Please try again.')
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setLoading(false)
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
      {/* Sidebar - Sessions */}
      <div className={styles.chatSidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarTitle}>🤖 AI Chats</div>
          <button className="btn btn-primary btn-sm" onClick={startNewChat} id="new-chat-btn">+ New</button>
        </div>
        <div className={styles.sessionsList}>
          {sessions.map((s) => (
            <button key={s.id} className={`${styles.sessionItem} ${activeSession?.id === s.id ? styles.activeSession : ''}`}
              onClick={() => loadSession(s.id)}>
              <div className={styles.sessionTitle}>{s.title || 'New Conversation'}</div>
              <div className={styles.sessionDate}>{new Date(s.created_at).toLocaleDateString()}</div>
            </button>
          ))}
          {sessions.length === 0 && (
            <div className={styles.noSessions}>No conversations yet. Start chatting!</div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={styles.chatMain}>
        <div className={styles.chatHeader}>
          <div>
            <h2 className={styles.chatTitle}>ArthaNova AI</h2>
            <p className={styles.chatSubtitle}>Multi-Agent System • Portfolio-aware • Autonomous Decision Making</p>
          </div>
          <div className={styles.chatBadge}>
            <SystemHealthIndicator compact={true} />
          </div>
        </div>

        {/* Orchestration Visualizer */}
        {showOrchestration && currentOrchestration && (
          <div className={styles.orchestrationPanel}>
            <button className={styles.closeOrchestration} onClick={() => setShowOrchestration(false)}>✕</button>
            <AgentOrchestrationVisualizer orchestrationData={currentOrchestration} isLoading={false} />
          </div>
        )}

        <div className={styles.messagesArea}>
          {messages.length === 0 && !sessionLoading && (
            <div className={styles.welcomeScreen}>
              <div className={styles.welcomeIcon}>🤖</div>
              <h3>Ask ArthaNova AI Anything</h3>
              <p>Get intelligent, source-grounded answers about Indian markets, your portfolio, stocks, and investment strategies.</p>
              <div className={styles.suggestions}>
                {SUGGESTED.map((s) => (
                  <button key={s} className={styles.suggestion} onClick={() => setInput(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {sessionLoading && <div className={styles.loadingMessages}><div className="spinner" /></div>}

          {messages.map((msg, i) => (
            <div key={i} className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.aiMsg}`}>
              {msg.role === 'assistant' && (
                <div className={styles.msgAvatar}>🤖</div>
              )}
              <div className={styles.msgContent}>
                <div className={styles.msgText}>{msg.content}</div>
                
                {/* Agent Breakdown */}
                {msg.orchestration && msg.orchestration.agents_used.length > 0 && (
                  <div className={styles.agentBreakdown}>
                    <button 
                      className={styles.agentsToggle}
                      onClick={() => setExpandedMessageId(expandedMessageId === msg.messageId ? null : msg.messageId)}
                    >
                      🔗 Used {msg.orchestration.agents_used.length} agents • {msg.orchestration.execution_time.toFixed(0)}ms
                    </button>
                    {expandedMessageId === msg.messageId && (
                      <div className={styles.agentsDetail}>
                        {msg.orchestration.agents_used.map((agent, j) => (
                          <div key={j} className={styles.agentDetail}>
                            <span className={styles.agentName}>{agent}</span>
                            {msg.orchestration.agent_responses[agent] && (
                              <span className={styles.agentStatus}>✓ Completed</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {msg.sources && msg.sources.length > 0 && (
                  <div className={styles.sources}>
                    <div className={styles.sourcesLabel}>📋 Sources:</div>
                    {msg.sources.map((src, j) => (
                      <span key={j} className={styles.sourceChip}>{src.title}</span>
                    ))}
                  </div>
                )}
                <div className={styles.msgTime}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className={styles.msgAvatarUser}>{user?.full_name?.charAt(0) || 'U'}</div>
              )}
            </div>
          ))}

          {loading && (
            <div className={`${styles.message} ${styles.aiMsg}`}>
              <div className={styles.msgAvatar}>🤖</div>
              <div className={styles.msgContent}>
                <div className={styles.typing}>
                  <span /><span /><span />
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
            <button type="submit" className={`btn btn-primary ${styles.sendBtn}`} disabled={!input.trim() || loading} id="send-message-btn">
              {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : '➤'}
            </button>
          </div>
          <p className={styles.inputDisclaimer}>ArthaNova AI provides information for educational purposes only. Not financial advice.</p>
        </form>
      </div>
    </div>
  )
}
