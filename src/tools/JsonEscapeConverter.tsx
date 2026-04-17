import React, { useMemo, useState } from 'react'

type Mode = 'escape' | 'unescape'

const MODE_LABELS: Record<Mode, string> = {
  escape: 'エスケープ',
  unescape: 'アンエスケープ',
}

const EXAMPLES: Record<Mode, string> = {
  escape: '例: {"name":"John","age":0}',
  unescape: '例: {"target":"readers","updated":"{\\"asp_member_id\\":55561}"}',
}

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

const JsonEscapeConverter: React.FC = () => {
  const [mode, setMode] = useState<Mode>('escape')
  const [input, setInput] = useState('')

  const { output, error } = useMemo(() => {
    if (input === '') {
      return { output: '', error: '' }
    }

    try {
      if (mode === 'escape') {
        return {
          output: JSON.stringify(input).slice(1, -1),
          error: '',
        }
      }

      const trimmed = input.trim()

      try {
        const parsed = expandNestedJson(JSON.parse(trimmed))

        return {
          output: typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2),
          error: '',
        }
      } catch {
        const normalized = trimmed.startsWith('"') && trimmed.endsWith('"')
          ? trimmed
          : `"${input}"`
        const parsed = expandNestedJson(JSON.parse(normalized))

        return {
          output: typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2),
          error: '',
        }
      }
    } catch {
      return { output: '', error: 'Error: 不正な JSON エスケープ文字列です' }
    }
  }, [input, mode])

  const toggleMode = () => {
    setInput(output)
    setMode((current) => (current === 'escape' ? 'unescape' : 'escape'))
  }

  return (
    <div className="tool-container">
      <h2 className="tool-title">エスケープ変換（JSON）</h2>
      <div className="tool-card">
        <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>
          JSON 文字列で使うエスケープ表現と通常テキストを相互に変換します。
          `\n` や `\"`、Unicode エスケープに加えて、JSON オブジェクトや配列の確認にも使えます。
        </p>

        <div className="json-escape-toolbar">
          <button className="primary-button" onClick={toggleMode}>
            {mode === 'escape' ? 'Escape ➔ Unescape' : 'Unescape ➔ Escape'} に切替
          </button>
          <span className="mode-badge">
            現在のモード: <strong>{MODE_LABELS[mode]}</strong>
          </span>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>{mode === 'escape' ? '入力 (Text)' : '入力 (Escaped)'}</label>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={EXAMPLES[mode]}
              spellCheck={false}
            />
          </div>

          <div className="form-group">
            <label>{mode === 'escape' ? '出力 (Escaped)' : '出力 (Text)'}</label>
            <textarea
              value={error || output}
              readOnly
              spellCheck={false}
              style={{
                backgroundColor: error ? '#fef2f2' : '#f8fafc',
                color: error ? '#b91c1c' : undefined,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
              }}
            />
          </div>
        </div>

        <div className="tool-note">
          アンエスケープ時は `\"hello\"` のような JSON 文字列本体、`"hello"` のような引用符付き JSON 文字列、
          あるいは JSON オブジェクトや配列そのものも扱えます。ネストした JSON 文字列も再帰的に展開します。
        </div>
      </div>
    </div>
  )
}

export default JsonEscapeConverter
