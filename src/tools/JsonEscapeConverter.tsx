import React, { useMemo, useState } from 'react'

type Mode = 'escape' | 'unescape'

const MODE_LABELS: Record<Mode, string> = {
  escape: 'エスケープ',
  unescape: 'アンエスケープ',
}

const EXAMPLES: Record<Mode, string> = {
  escape: '例: {"name":"John","age":0}',
  unescape: '例: {\\"name\\":\\"John\\",\\"age\\":0}',
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

      const normalized = input.trim().startsWith('"') && input.trim().endsWith('"')
        ? input.trim()
        : `"${input}"`

      const parsed = JSON.parse(normalized)

      if (typeof parsed !== 'string') {
        return { output: '', error: 'Error: JSON string ではありません' }
      }

      return { output: parsed, error: '' }
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
          `\n` や `\"`、Unicode エスケープを確認したい場面を想定しています。
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
          アンエスケープ時は `\"hello\"` のような JSON 文字列本体か、`"hello"` のような引用符付き JSON 文字列のどちらでも扱えます。
        </div>
      </div>
    </div>
  )
}

export default JsonEscapeConverter
