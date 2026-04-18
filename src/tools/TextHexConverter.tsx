import React, { useState } from 'react'

const TextHexConverter: React.FC = () => {
  const [text, setText] = useState('')
  const [hex, setHex] = useState('')
  const [encoding, setEncoding] = useState('UTF-8')

  // テキストからHEXへ変換
  const updateFromText = (input: string, enc: string) => {
    setText(input)
    if (input === '') {
      setHex('')
      return
    }

    try {
      let bytes: Uint8Array
      if (enc === 'UTF-8') {
        bytes = new TextEncoder().encode(input)
      } else if (enc === 'UTF-16BE') {
        const u16 = new Uint16Array(Array.from(input).map(c => c.charCodeAt(0)))
        const view = new DataView(new ArrayBuffer(u16.length * 2))
        u16.forEach((code, i) => view.setUint16(i * 2, code, false))
        bytes = new Uint8Array(view.buffer)
      } else { // UTF-16LE
        const u16 = new Uint16Array(Array.from(input).map(c => c.charCodeAt(0)))
        const view = new DataView(new ArrayBuffer(u16.length * 2))
        u16.forEach((code, i) => view.setUint16(i * 2, code, true))
        bytes = new Uint8Array(view.buffer)
      }
      
      const h = Array.from(bytes).map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ')
      setHex(h)
    } catch (e) {
      setHex('Error: Conversion failed')
    }
  }

  // HEXからテキストへ変換
  const updateFromHex = (input: string, enc: string) => {
    setHex(input)
    if (input === '') {
      setText('')
      return
    }

    try {
      const hexValues = input.match(/[0-9a-fA-F]{2}/g) || []
      const bytes = new Uint8Array(hexValues.map(h => parseInt(h, 16)))
      
      let decoded: string
      if (enc === 'UTF-8') {
        decoded = new TextDecoder('utf-8').decode(bytes)
      } else {
        decoded = new TextDecoder(enc.toLowerCase()).decode(bytes)
      }
      setText(decoded)
    } catch (e) {
      // 不正なHEXの場合はテキストを更新しない
    }
  }

  return (
    <div className="tool-container">
      <h2 className="tool-title">Text ⇄ HEX</h2>
      <div className="tool-card">
        <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>
          テキストを Unicode コードポイントに基づいたバイト列（HEX）に変換します。その逆（バイト列からテキスト）の変換も可能です。
        </p>

        <div className="form-group">
          <label>エンコーディング</label>
          <select 
            value={encoding} 
            onChange={(e) => {
              setEncoding(e.target.value)
              updateFromText(text, e.target.value)
            }}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem' }}
          >
            <option value="UTF-8">UTF-8</option>
            <option value="UTF-16BE">UTF-16 (Big Endian)</option>
            <option value="UTF-16LE">UTF-16 (Little Endian)</option>
          </select>
        </div>

        <div className="form-group">
          <label>テキスト (Text)</label>
          <textarea
            value={text}
            onChange={(e) => updateFromText(e.target.value, encoding)}
            placeholder="例: Hello World! / こんにちは"
            spellCheck={false}
          />
        </div>

        <div className="form-group">
          <label>HEX (スペース区切り)</label>
          <textarea
            value={hex}
            onChange={(e) => updateFromHex(e.target.value, encoding)}
            style={{ fontFamily: 'monospace' }}
            placeholder="例: 48 65 6C 6C 6F 20 57 6F 72 6C 64 21"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  )
}

export default TextHexConverter
