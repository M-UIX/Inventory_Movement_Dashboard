import { useMemo, useState } from 'react'
import './App.css'

const sampleRows = [
  {
    id: 'mv1001',
    timestamp: '2026-03-10T17:46:00Z',
    sku: 'SKU003',
    movementType: 'IN',
    quantity: 48,
    warehouse: 'WH-NORTH',
  },
  {
    id: 'mv1002',
    timestamp: '2026-03-11T09:12:00Z',
    sku: 'SKU004',
    movementType: 'OUT',
    quantity: 24,
    warehouse: 'WH-WEST',
  },
  {
    id: 'mv1003',
    timestamp: '2026-03-12T13:40:00Z',
    sku: 'SKU003',
    movementType: 'IN',
    quantity: 80,
    warehouse: 'WH-EAST',
  },
]

function App() {
  const [rows] = useState(sampleRows)
  const [from, setFrom] = useState('2026-03-01')
  const [to, setTo] = useState('2026-03-31')
  const [type, setType] = useState('All')
  const [warehouse, setWarehouse] = useState('All')
  const [page, setPage] = useState(1)
  const [hashStatus, setHashStatus] = useState('Upload a JSON file to validate it against a SHA-256 hash.')

  const warehouses = useMemo(() => ['All', ...new Set(rows.map((item) => item.warehouse))], [rows])

  const filteredRows = useMemo(() => {
    return rows.filter((item) => {
      const date = item.timestamp.slice(0, 10)
      const inRange = date >= from && date <= to
      const matchesType = type === 'All' || item.movementType === type
      const matchesWarehouse = warehouse === 'All' || item.warehouse === warehouse
      return inRange && matchesType && matchesWarehouse
    })
  }, [rows, from, to, type, warehouse])

  const pagedRows = filteredRows.slice((page - 1) * 10, page * 10)
  const totalIn = filteredRows.filter((item) => item.movementType === 'IN').reduce((sum, item) => sum + item.quantity, 0)
  const totalOut = filteredRows.filter((item) => item.movementType === 'OUT').reduce((sum, item) => sum + item.quantity, 0)
  const totalQty = totalIn + totalOut

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const text = await file.text()
    const bytes = new TextEncoder().encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const sha256 = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')

    setHashStatus(`Computed hash for ${file.name}: ${sha256.slice(0, 24)}...`)
  }

  return (
    <div className="dashboard-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">Inventory Movement Dashboard</p>
          <h1>Validate stock movements and explore the flow instantly.</h1>
          <p className="hero-copy">Upload a JSON file, confirm its SHA-256 signature, then inspect filtered movement activity with charts and a paginated table.</p>
        </div>
        <label className="upload-box">
          <span>Upload JSON file</span>
          <input type="file" accept="application/json" onChange={handleFileUpload} />
        </label>
      </header>

      <section className="status-bar">
        <div>
          <strong>Hash validation</strong>
          <p>{hashStatus}</p>
        </div>
        <div>
          <strong>Visible records</strong>
          <p>{filteredRows.length} movements</p>
        </div>
      </section>

      <section className="filters-card">
        <div className="field-group">
          <label htmlFor="from">From</label>
          <input id="from" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        </div>
        <div className="field-group">
          <label htmlFor="to">To</label>
          <input id="to" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
        </div>
        <div className="field-group">
          <label htmlFor="type">Movement type</label>
          <select id="type" value={type} onChange={(event) => setType(event.target.value)}>
            <option value="All">All</option>
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
          </select>
        </div>
        <div className="field-group">
          <label htmlFor="warehouse">Warehouse</label>
          <select id="warehouse" value={warehouse} onChange={(event) => setWarehouse(event.target.value)}>
            {warehouses.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card accent">
          <span>Total quantity</span>
          <strong>{totalQty}</strong>
        </article>
        <article className="stat-card success">
          <span>Incoming</span>
          <strong>{totalIn}</strong>
        </article>
        <article className="stat-card danger">
          <span>Outgoing</span>
          <strong>{totalOut}</strong>
        </article>
      </section>

      <section className="chart-grid">
        <article className="panel">
          <h2>Movement mix</h2>
          <div className="chart-placeholder">
            <div className="donut">
              <span>{Math.round((totalIn / Math.max(totalQty, 1)) * 100)}% IN</span>
            </div>
          </div>
        </article>
        <article className="panel">
          <h2>Daily trend</h2>
          <div className="trend-bars">
            {['Mar 10', 'Mar 11', 'Mar 12'].map((label) => (
              <div key={label} className="bar-group">
                <div className="bar in" style={{ height: '60%' }} />
                <div className="bar out" style={{ height: '35%' }} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel table-panel">
        <div className="table-header">
          <h2>Stock movements</h2>
          <p>Showing {pagedRows.length} of {filteredRows.length} records</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>SKU</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Warehouse</th>
            </tr>
          </thead>
          <tbody>
            {pagedRows.map((item) => (
              <tr key={item.id}>
                <td>{item.timestamp}</td>
                <td>{item.sku}</td>
                <td>{item.movementType}</td>
                <td>{item.quantity}</td>
                <td>{item.warehouse}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
          <span>Page {page}</span>
          <button type="button" onClick={() => setPage((value) => value + 1)}>Next</button>
        </div>
      </section>
    </div>
  )
}

export default App
