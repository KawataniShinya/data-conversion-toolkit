import React, { useState } from 'react'

const UrlEncoder: React.FC = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const handleConvert = (val: string, currentMode: 'encode' | 'decode') => {
    setInput(val)
    try {
      if (currentMode === 'encode') {
        setOutput(encodeURIComponent(val))
      } else {
        setOutput(decodeURIComponent(val))
      }
    } catch (e) {
      setOutput('Error: Invalid input for decoding')
    }
  }

  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode'
    setMode(newMode)
    // Swap input and output
    const newInput = output.startsWith('Error:') ? '' : output
    handleConvert(newInput, newMode)
  }

  return (
    <div className="tool-container">
      <h2 className="tool-title">URLエンコード</h2>
      <div className="tool-card">
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={toggleMode}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            {mode === 'encode' ? 'Encode ➔ Decode' : 'Decode ➔ Encode'} に切替
          </button>
          <span style={{ color: '#64748b' }}>
            現在のモード: <strong>{mode === 'encode' ? 'エンコード' : 'デコード'}</strong>
          </span>
        </div>

        <div className="form-group">
          <label>{mode === 'encode' ? '入力 (Text)' : '入力 (Encoded)'}</label>
          <textarea
            value={input}
            onChange={(e) => handleConvert(e.target.value, mode)}
            placeholder={mode === 'encode' ? 'ここにテキストを入力...' : 'ここにエンコード済み文字列を入力...'}
          />
        </div>

        <div className="form-group">
          <label>{mode === 'encode' ? '出力 (Encoded)' : '出力 (Text)'}</label>
          <textarea
            value={output}
            readOnly
            style={{ backgroundColor: '#f8fafc' }}
          />
        </div>
      </div>
    </div>
  )
}

export default UrlEncoder
