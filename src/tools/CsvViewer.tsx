import React, { useMemo, useState } from 'react'

type CsvCellPosition = {
  row: number
  column: number
}

type CsvDimensions = {
  rows: number
  columns: number
}

const CSV_PLACEHOLDER = `name,age,city
Alice,30,Tokyo
Bob,25,Osaka
"Charlie, Jr.",41,"New York"`

const parseCsv = (input: string): string[][] => {
  if (input === '') {
    return []
  }

  const rows: string[][] = []
  let row: string[] = []
  let value = ''
  let inQuotes = false

  for (let index = 0; index < input.length; index += 1) {
    const current = input[index]
    const next = input[index + 1]

    if (current === '"') {
      if (inQuotes && next === '"') {
        value += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (!inQuotes && current === ',') {
      row.push(value)
      value = ''
      continue
    }

    if (!inQuotes && (current === '\n' || current === '\r')) {
      if (current === '\r' && next === '\n') {
        index += 1
      }

      row.push(value)
      rows.push(row)
      row = []
      value = ''
      continue
    }

    value += current
  }

  if (inQuotes) {
    throw new Error('引用符が閉じられていません')
  }

  if (value !== '' || row.length > 0) {
    row.push(value)
    rows.push(row)
  }

  return rows
}

const encodeCsvCell = (value: string): string => {
  if (value.includes('"') || value.includes(',') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replace(/"/g, '""')}"`
  }

  return value
}

const stringifyCsv = (rows: string[][]): string =>
  rows.map((row) => row.map(encodeCsvCell).join(',')).join('\n')

const getDimensions = (rows: string[][]): CsvDimensions => ({
  rows: rows.length,
  columns: rows.reduce((max, row) => Math.max(max, row.length), 0),
})

const normalizeRows = (rows: string[][], dimensions: CsvDimensions): string[][] =>
  Array.from({ length: dimensions.rows }, (_, rowIndex) =>
    Array.from({ length: dimensions.columns }, (_, columnIndex) => rows[rowIndex]?.[columnIndex] ?? ''),
  )

const CsvViewer: React.FC = () => {
  const [csvText, setCsvText] = useState('')
  const [rows, setRows] = useState<string[][]>([['']])
  const [selectedCell, setSelectedCell] = useState<CsvCellPosition>({ row: 0, column: 0 })
  const [hasHeader, setHasHeader] = useState(true)
  const [error, setError] = useState('')
  const [dimensions, setDimensions] = useState<CsvDimensions>({ rows: 1, columns: 1 })

  const normalizedRows = useMemo(() => {
    return normalizeRows(rows, dimensions)
  }, [rows, dimensions])

  const applyRows = (nextRows: string[][], nextDimensions = getDimensions(nextRows)) => {
    const safeDimensions = {
      rows: Math.max(nextDimensions.rows, 1),
      columns: Math.max(nextDimensions.columns, 1),
    }
    const adjustedRows = normalizeRows(nextRows, safeDimensions)

    setDimensions(safeDimensions)
    setRows(adjustedRows)
    setCsvText(stringifyCsv(adjustedRows))
    setSelectedCell((current) => ({
      row: Math.min(current.row, safeDimensions.rows - 1),
      column: Math.min(current.column, safeDimensions.columns - 1),
    }))
  }

  const handleCsvChange = (nextCsv: string) => {
    setCsvText(nextCsv)

    try {
      const parsed = parseCsv(nextCsv)
      const parsedDimensions = getDimensions(parsed)
      const safeDimensions = {
        rows: Math.max(parsedDimensions.rows, 1),
        columns: Math.max(parsedDimensions.columns, 1),
      }

      setRows(normalizeRows(parsed, safeDimensions))
      setDimensions(safeDimensions)
      setError('')

      const maxRow = Math.max(safeDimensions.rows - 1, 0)
      const maxColumn = Math.max(safeDimensions.columns - 1, 0)
      setSelectedCell((current) => ({
        row: Math.min(current.row, maxRow),
        column: Math.min(current.column, maxColumn),
      }))
    } catch (parseError) {
      setError(parseError instanceof Error ? parseError.message : 'CSV の解析に失敗しました')
    }
  }

  const handleCellChange = (value: string) => {
    const nextRows = normalizedRows.map((row) => [...row])

    if (!nextRows[selectedCell.row]) {
      return
    }

    nextRows[selectedCell.row][selectedCell.column] = value
    setRows(nextRows)
    setCsvText(stringifyCsv(nextRows))
    setError('')
  }

  const handleDimensionChange = (key: keyof CsvDimensions, value: string) => {
    const parsedValue = Number.parseInt(value, 10)
    const nextValue = Number.isNaN(parsedValue) ? 1 : Math.max(parsedValue, 1)
    const nextDimensions = { ...dimensions, [key]: nextValue }
    applyRows(normalizedRows, nextDimensions)
    setError('')
  }

  const selectedValue = normalizedRows[selectedCell.row]?.[selectedCell.column] ?? ''
  const headerRow = hasHeader ? normalizedRows[0] ?? [] : []
  const bodyRows = hasHeader ? normalizedRows.slice(1) : normalizedRows

  return (
    <div className="tool-container">
      <h2 className="tool-title">CSVビューア</h2>
      <div className="tool-card">
        <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>
          CSV をセル単位で分解して表示し、選択したセルの内容を編集すると CSV テキストへ即時反映します。
          JSON を含む列の中身を取り出して確認したい用途を想定しています。
        </p>

        <div className="csv-toolbar">
          <label className="csv-checkbox">
            <input
              type="checkbox"
              checked={hasHeader}
              onChange={(event) => setHasHeader(event.target.checked)}
            />
            先頭行をヘッダとして表示
          </label>
          <span className="mode-badge">
            行数: <strong>{normalizedRows.length}</strong> / 列数: <strong>{normalizedRows[0]?.length ?? 0}</strong>
          </span>
        </div>

        <div className="csv-dimension-grid">
          <div className="form-group">
            <label>表示行数</label>
            <input
              type="number"
              min={1}
              value={dimensions.rows}
              onChange={(event) => handleDimensionChange('rows', event.target.value)}
            />
          </div>
          <div className="form-group">
            <label>表示列数</label>
            <input
              type="number"
              min={1}
              value={dimensions.columns}
              onChange={(event) => handleDimensionChange('columns', event.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>CSV (Source)</label>
          <textarea
            value={csvText}
            onChange={(event) => handleCsvChange(event.target.value)}
            spellCheck={false}
            placeholder={CSV_PLACEHOLDER}
            className="csv-source"
          />
          {error && <div className="csv-error">Error: {error}</div>}
        </div>

        <div className="csv-layout">
          <div className="csv-table-panel">
            <div className="csv-section-title">出力表</div>
            <div className="csv-table-wrap">
              <table className="csv-table">
                <thead>
                  {hasHeader && headerRow.length > 0 ? (
                    <tr>
                      <th className="csv-index-cell">#</th>
                      {headerRow.map((cell, columnIndex) => (
                        <th key={`header-${columnIndex}`}>{cell || `Column ${columnIndex + 1}`}</th>
                      ))}
                    </tr>
                  ) : (
                    <tr>
                      <th className="csv-index-cell">#</th>
                      {(normalizedRows[0] ?? []).map((_, columnIndex) => (
                        <th key={`col-${columnIndex}`}>Column {columnIndex + 1}</th>
                      ))}
                    </tr>
                  )}
                </thead>
                <tbody>
                  {bodyRows.map((row, rowIndex) => {
                    const actualRowIndex = hasHeader ? rowIndex + 1 : rowIndex

                    return (
                      <tr key={`row-${actualRowIndex}`}>
                        <td className="csv-index-cell">{actualRowIndex + 1}</td>
                        {row.map((cell, columnIndex) => {
                          const active =
                            selectedCell.row === actualRowIndex && selectedCell.column === columnIndex

                          return (
                            <td key={`cell-${actualRowIndex}-${columnIndex}`}>
                              <button
                                type="button"
                                className={`csv-cell-button ${active ? 'active' : ''}`}
                                onClick={() => setSelectedCell({ row: actualRowIndex, column: columnIndex })}
                              >
                                {cell || <span className="csv-empty">(empty)</span>}
                              </button>
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="csv-editor-panel">
            <div className="form-group">
              <div className="csv-section-title">選択セル</div>
              <label>
                選択セル (Row {selectedCell.row + 1}, Column {selectedCell.column + 1})
              </label>
              <textarea
                value={selectedValue}
                onChange={(event) => handleCellChange(event.target.value)}
                spellCheck={false}
                placeholder="セルの内容を編集..."
              />
            </div>
            <div className="tool-note">
              テーブル側はセル選択用です。編集は右側の詳細エリアで行い、変更内容は CSV テキストへ自動でエスケープして反映されます。
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CsvViewer
