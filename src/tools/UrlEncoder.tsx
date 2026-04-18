import React, { useState } from 'react'

const ENCODED_PLACEHOLDER = '例: Hello%20World%21%20q%3D%E6%A4%9C%E7%B4%A2'
const DECODED_PLACEHOLDER = '例: Hello World! q=検索'

const UrlEncoder: React.FC = () => {
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
      setDecoded(decodeURIComponent(input))
      setError('')
    } catch {
      setDecoded('')
      setError('Error: URL デコードできない文字列です')
    }
  }

  const updateFromDecoded = (input: string) => {
    setDecoded(input)
    setEncoded(input === '' ? '' : encodeURIComponent(input))
    setError('')
  }

  return (
    <div className="tool-container">
      <h2 className="tool-title">URLエンコード</h2>
      <div className="tool-card">
        <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>
          上側に URL エンコード済み文字列、下側にデコード後の文字列を表示します。
          どちらを編集しても即座にもう片方へ反映されます。
        </p>

        <div className="form-group">
          <label>エンコード文字列 (Encoded)</label>
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
          />
          {error && <div className="csv-error">Error: URL デコードできない文字列です</div>}
        </div>
      </div>
    </div>
  )
}

export default UrlEncoder
