import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { watchlistAPI, stocksAPI } from '../../api/client'
import { toast } from 'react-hot-toast'
import styles from '../../styles/pages/app/WatchlistPage.module.css'

export default function WatchlistPage() {
  const [watchlists, setWatchlists] = useState([])
  const [activeWatchlist, setActiveWatchlist] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newWatchlistName, setNewWatchlistName] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    loadWatchlists()
  }, [])

  const loadWatchlists = async () => {
    try {
      setLoading(true)
      const res = await watchlistAPI.list()
      const lists = res.data
      
      if (lists.length > 0) {
        setWatchlists(lists)
        loadWatchlist(lists[0].id)
      } else {
        // Automatically create a default watchlist if none exist
        const initialRes = await watchlistAPI.create({ name: 'MY WATCHLIST' })
        setWatchlists([initialRes.data])
        loadWatchlist(initialRes.data.id)
      }
    } catch (err) {
      toast.error('Failed to load watchlist')
      setLoading(false)
    }
  }

  const loadWatchlist = async (id) => {
    try {
      setLoading(true)
      const res = await watchlistAPI.get(id)
      setActiveWatchlist(res.data)
      setItems(res.data.items || [])
    } catch (err) {
      toast.error('Failed to load watchlist items')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWatchlist = async (e) => {
    e.preventDefault()
    if (!newWatchlistName.trim()) return
    try {
      const res = await watchlistAPI.create({ name: newWatchlistName })
      setWatchlists([...watchlists, res.data])
      setNewWatchlistName('')
      setShowCreateModal(false)
      toast.success('Watchlist created')
      loadWatchlist(res.data.id)
    } catch (err) {
      toast.error('Failed to create watchlist')
    }
  }

  const handleDeleteWatchlist = async (id) => {
    if (!window.confirm('Are you sure you want to delete this watchlist?')) return
    try {
      await watchlistAPI.delete(id)
      const updated = watchlists.filter((w) => w.id !== id)
      setWatchlists(updated)
      if (activeWatchlist?.id === id) {
        if (updated.length > 0) loadWatchlist(updated[0].id)
        else {
          setActiveWatchlist(null)
          setItems([])
        }
      }
      toast.success('Watchlist deleted')
    } catch (err) {
      toast.error('Failed to delete watchlist')
    }
  }

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    try {
      const res = await stocksAPI.list({ search: query, per_page: 5 })
      setSearchResults(res.data.items)
    } catch (err) {}
  }

  const addStockToWatchlist = async (stock) => {
    if (!activeWatchlist) return
    try {
      const res = await watchlistAPI.addItem(activeWatchlist.id, {
        symbol: stock.symbol,
        company_name: stock.company_name,
      })
      setItems(res.data.items)
      setActiveWatchlist(res.data)
      setShowAddModal(false)
      setSearchQuery('')
      setSearchResults([])
      toast.success(`${stock.symbol} added to watchlist`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add stock')
    }
  }

  const removeStockFromWatchlist = async (itemId) => {
    try {
      const res = await watchlistAPI.removeItem(activeWatchlist.id, itemId)
      setItems(res.data.items)
      setActiveWatchlist(res.data)
      toast.success('Removed from watchlist')
    } catch (err) {
      toast.error('Failed to remove stock')
    }
  }

  return (
    <div className={styles.watchlistWrapper}>
      <div className={styles.watchlistMain}>
        <div className={styles.mainHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.titleGroup}>
              <h1>{activeWatchlist?.name.toUpperCase() || 'MY WATCHLIST'}</h1>
            </div>
            <p className={styles.subtitle}>{items.length} STOCKS MONITORED</p>
          </div>
          <button 
            className={styles.addStockBtn}
            onClick={() => setShowAddModal(true)}
          >
            + ADD STOCK
          </button>
        </div>

        <div className={styles.stocksGrid}>
          {items.map((item) => (
            <div key={item.id} className={styles.stockCard} onClick={() => navigate(`/app/stocks/${item.symbol}`)}>
              <div className={styles.cardHeader}>
                <div className={styles.symbolInfo}>
                  <h3>{item.symbol}</h3>
                  <p>{item.company_name}</p>
                </div>
                <button 
                  className={styles.removeBtn}
                  onClick={(e) => { e.stopPropagation(); removeStockFromWatchlist(item.id); }}
                >✕</button>
              </div>
              <div className={styles.cardStats}>
                <div className={styles.statLine}>
                  <span>EXCHANGE</span>
                  <strong>NSE</strong>
                </div>
                <div className={styles.statLine}>
                  <span>ADDED ON</span>
                  <strong>{new Date(item.added_at).toLocaleDateString()}</strong>
                </div>
              </div>
              <div className={styles.viewLink}>VIEW DETAILS →</div>
            </div>
          ))}
          {items.length === 0 && !loading && activeWatchlist && (
            <div className={styles.emptyState}>
              <div style={{ fontSize: '3rem' }}>⭐</div>
              <h3>YOUR WATCHLIST IS EMPTY</h3>
              <p>Add some stocks to track them and get AI-powered insights.</p>
              <button className={styles.primaryBtn} onClick={() => setShowAddModal(true)}>ADD FIRST STOCK</button>
            </div>
          )}
          {loading && (
            <div className={styles.loader}>LOADING...</div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>CREATE WATCHLIST</h3>
            <form onSubmit={handleCreateWatchlist}>
              <input 
                type="text" 
                placeholder="WATCHLIST NAME (E.G. BLUECHIP)" 
                value={newWatchlistName}
                onChange={(e) => setNewWatchlistName(e.target.value)}
                autoFocus
              />
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowCreateModal(false)}>CANCEL</button>
                <button type="submit" className={styles.primaryBtn}>CREATE</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>ADD TO {activeWatchlist?.name.toUpperCase()}</h3>
            <input 
              type="text" 
              placeholder="SEARCH SYMBOL (E.G. RELIANCE)" 
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
            <div className={styles.searchResults}>
              {searchResults.map((stock) => (
                <div key={stock.symbol} className={styles.searchItem} onClick={() => addStockToWatchlist(stock)}>
                  <div>
                    <strong>{stock.symbol}</strong>
                    <span>{stock.company_name}</span>
                  </div>
                  <button>+</button>
                </div>
              ))}
              {searchQuery.length >= 2 && searchResults.length === 0 && (
                <p className={styles.noResults}>NO STOCKS FOUND</p>
              )}
            </div>
            <button className={styles.closeModalBtn} onClick={() => setShowAddModal(false)}>CLOSE</button>
          </div>
        </div>
      )}
    </div>
  )
}
