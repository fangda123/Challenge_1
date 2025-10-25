import React, { useEffect, useState, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { fetchUsers } from '../api';
import { useDebounce } from '../hooks/useDebounce';

export default function UsersTable() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('orderTotal');
  const [sortDir, setSortDir] = useState('desc');
  const debouncedSearch = useDebounce(search, 250);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPage = useCallback(async (p, s, sb, sd) => {
    setLoading(true); setError(null);
    try {
      const data = await fetchUsers({ page: p, pageSize, search: s, sortBy: sb, sortDir: sd });
      setItems(data.items);
      setTotal(data.total);
      setPage(data.page);
    } catch (err) {
      setError(err.message || 'Fetch error');
    } finally { setLoading(false); }
  }, [pageSize]);

  useEffect(() => { fetchPage(1, debouncedSearch, sortBy, sortDir); }, [debouncedSearch, sortBy, sortDir, fetchPage]);
  useEffect(() => { fetchPage(page, debouncedSearch, sortBy, sortDir); }, [page]);

  const Row = React.memo(({ index, style }) => {
    const row = items[index];
    if (!row) return <div style={style}>—</div>;
    return (
      <div style={{ ...style, display:'flex', padding:'8px 12px', borderBottom:'1px solid #eee' }}>
        <div style={{ width:60 }}>{row.id}</div>
        <div style={{ flex:2 }}>{row.name}</div>
        <div style={{ flex:3 }}>{row.email}</div>
        <div style={{ width:160 }}>{new Date(row.createdAt).toLocaleDateString()}</div>
        <div style={{ width:120, textAlign:'right' }}>{row.orderCount}</div>
        <div style={{ width:140, textAlign:'right' }}>${row.orderTotal.toFixed(2)}</div>
      </div>
    );
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:8 }}>
        <input placeholder="ค้นหา ชื่อหรืออีเมล" onChange={e => setSearch(e.target.value)} style={{ flex:1, padding:8 }} />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="orderTotal">Total</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="createdAt">Created</option>
        </select>
        <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}>{sortDir}</button>
      </div>

      {loading && <div>กำลังโหลด...</div>}
      {error && <div style={{ color:'red' }}>Error: {error}</div>}
      {!loading && items.length === 0 && <div>ไม่พบผลลัพธ์</div>}

      <div style={{ border:'1px solid #ddd', borderRadius:6, overflow:'hidden' }}>
        <div style={{ display:'flex', padding:'8px 12px', background:'#f7f7f7', fontWeight:700 }}>
          <div style={{ width:60 }}>ID</div>
          <div style={{ flex:2 }}>Name</div>
          <div style={{ flex:3 }}>Email</div>
          <div style={{ width:160 }}>Created</div>
          <div style={{ width:120, textAlign:'right' }}>Orders</div>
          <div style={{ width:140, textAlign:'right' }}>Total</div>
        </div>

        <List height={400} itemCount={items.length} itemSize={48} width={'100%'}>
          {Row}
        </List>
      </div>

      <div style={{ marginTop:8, display:'flex', gap:8, alignItems:'center' }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <div>Page {page} / {totalPages}</div>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
        <div style={{ marginLeft:'auto' }}>{total} users</div>
      </div>
    </div>
  );
}
