import React, { useState } from 'react'

const ENCODED_PLACEHOLDER = '例: {"target":"users","updated":"{\\"name\\":\\"Alice\\",\\"age\\":30}"}'
const DECODED_PLACEHOLDER = `例: {
  "target": "users",
  "updated": {
    "name": "Alice",
    "age": 30
  }
}`

const tryParseNestedJson = (value: string): unknown => {
  const trimmed = value.trim()

  if (trimmed === '') {
    return value
  }

  try {
    return JSON.parse(trimmed)
  } catch {
    try {
      const normalized = trimmed.startsWith('"') && trimmed.endsWith('"')
        ? trimmed
        : `"${value}"`
      return JSON.parse(normalized)
    } catch {
      return value
    }
  }
}

const expandNestedJson = (value: unknown): unknown => {
  if (typeof value === 'string') {
    const parsed = tryParseNestedJson(value)
    return parsed === value ? value : expandNestedJson(parsed)
  }

  if (Array.isArray(value)) {
    return value.map((item) => expandNestedJson(item))
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, expandNestedJson(entry)]),
    )
  }

  return value
}

const formatDecodedValue = (value: unknown): string =>
  typeof value === 'string' ? value : JSON.stringify(value, null, 2)

const decodeJsonValue = (input: string): string => {
  const trimmed = input.trim()
  const parsed = expandNestedJson(JSON.parse(trimmed))
  return formatDecodedValue(parsed)
}

const encodeJsonValue = (input: string): string => JSON.stringify(input).slice(1, -1)

const JsonEscapeConverter: React.FC = () => {
  const [encoded, setEncoded] = useState('')
  const [decoded, setDecoded] = useState('')
  const [error, setError] = useState('')

  const updateFromEncoded = (input: string) => {
    setEncoded(input)

    if (input === '') {
      setDecoded('')
      setError('')
      return
    }

    try {
      setDecoded(decodeJsonValue(input))
      setError('')
    } catch {
      try {
        const normalized = input.trim().startsWith('"') && input.trim().endsWith('"')
          ? input.trim()
          : `"${input}"`
        setDecoded(formatDecodedValue(expandNestedJson(JSON.parse(normalized))))
        setError('')
      } catch {
        setDecoded('')
        setError('Error: 不正な JSON エスケープ文字列です')
      }
    }
  }

  const updateFromDecoded = (input: string) => {
    setDecoded(input)
    setEncoded(input === '' ? '' : encodeJsonValue(input))
    setError('')
  }

  return (
    <div className="tool-container">
      <h2 className="tool-title">エスケープ変換（JSON）</h2>
      <div className="tool-card">
        <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>
          上側に JSON エスケープ済み文字列、下側にデコード後の文字列を表示します。
          どちらを編集しても即座にもう片方へ反映されます。
        </p>

        <div className="form-group">
          <label>エンコード文字列 (Escaped)</label>
          <textarea
            value={encoded}
            onChange={(event) => updateFromEncoded(event.target.value)}
            placeholder={ENCODED_PLACEHOLDER}
            spellCheck={false}
          />
        </div>

        <div className="form-group">
          <label>デコード文字列 (Decoded)</label>
          <textarea
            value={error ? '' : decoded}
            onChange={(event) => updateFromDecoded(event.target.value)}
            placeholder={DECODED_PLACEHOLDER}
            spellCheck={false}
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' }}
          />
          {error && <div className="csv-error">{error}</div>}
        </div>
      </div>
    </div>
  )
}

export default JsonEscapeConverter
