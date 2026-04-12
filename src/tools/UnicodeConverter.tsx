import React, { useState } from 'react'

const UnicodeConverter: React.FC = () => {
  const [formats, setFormats] = useState({
    text: '',
    uPlus: '',
    zeroX: '',
    escCP: '',
    escCU: '',
    htmlDec: '',
    decimal: '',
    htmlHex: '',
    cssHex: '',
    hex: ''
  })

  // コードポイントの配列からすべてのフォーマット文字列を生成して更新
  const updateAll = (codes: number[], sourceField?: string, sourceValue?: string) => {
    const text = codes.length > 0 ? String.fromCodePoint(...codes) : ''
    
    const newFormats = {
      text: text,
      uPlus: codes.map(c => `U+${c.toString(16).toUpperCase().padStart(4, '0')}`).join(' '),
      zeroX: codes.map(c => `0x${c.toString(16).toUpperCase().padStart(4, '0')}`).join(' '),
      escCP: codes.map(c => `\\u{${c.toString(16).toUpperCase()}}`).join(''),
      escCU: Array.from(text).map(c => {
        if (c.length === 1) return `\\u${c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`
        return `\\u${c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}\\u${c.charCodeAt(1).toString(16).toUpperCase().padStart(4, '0')}`
      }).join(''),
      htmlDec: codes.map(c => `&#${c};`).join(''),
      decimal: codes.map(c => c.toString()).join(' '),
      htmlHex: codes.map(c => `&#x${c.toString(16).toUpperCase()};`).join(''),
      cssHex: codes.map(c => `\\${c.toString(16).toUpperCase().padStart(4, '0')}`).join(' '),
      hex: codes.map(c => c.toString(16).toUpperCase().padStart(4, '0')).join(' ')
    }

    if (sourceField && sourceValue !== undefined) {
      (newFormats as any)[sourceField] = sourceValue
    }

    setFormats(newFormats)
  }

  const handleTextChange = (val: string) => {
    const codes = Array.from(val).map(c => c.codePointAt(0)!)
    updateAll(codes, 'text', val)
  }

  const handleHexParse = (val: string, field: string) => {
    const hexValues = val.match(/[0-9a-fA-F]+/g) || []
    const codes = hexValues.map(h => parseInt(h, 16)).filter(c => !isNaN(c))
    updateAll(codes, field, val)
  }

  const handleDecParse = (val: string, field: string) => {
    const decValues = val.match(/[0-9]+/g) || []
    const codes = decValues.map(d => parseInt(d, 10)).filter(c => !isNaN(c))
    updateAll(codes, field, val)
  }

  const textareaStyle = { 
    fontFamily: 'monospace', 
    fontSize: '1rem',
    minHeight: '80px',
    padding: '0.75rem',
    resize: 'vertical' as const
  }

  const fieldList = [
    { key: 'text', label: 'テキスト', handler: handleTextChange, placeholder: 'あ' },
    { key: 'uPlus', label: 'U+16進数値 (U+3042)', handler: (v: string) => handleHexParse(v, 'uPlus'), placeholder: 'U+3042' },
    { key: 'zeroX', label: '0x16進数値 (0x3042)', handler: (v: string) => handleHexParse(v, 'zeroX'), placeholder: '0x3042' },
    { key: 'escCP', label: '\\u{16進数値} (コードポイント)', handler: (v: string) => handleHexParse(v, 'escCP'), placeholder: '\\u{3042}' },
    { key: 'escCU', label: '\\u16進数値 (コードユニット)', handler: (v: string) => handleHexParse(v, 'escCU'), placeholder: '\\u3042' },
    { key: 'htmlDec', label: '&#10進数値; (HTML数値文字参照)', handler: (v: string) => handleDecParse(v, 'htmlDec'), placeholder: '&#12354;' },
    { key: 'decimal', label: '10進数値', handler: (v: string) => handleDecParse(v, 'decimal'), placeholder: '12354' },
    { key: 'htmlHex', label: '&#x16進数値; (HTML数値文字参照)', handler: (v: string) => handleHexParse(v, 'htmlHex'), placeholder: '&#x3042;' },
    { key: 'cssHex', label: '\\16進数値 (CSS数値文字参照)', handler: (v: string) => handleHexParse(v, 'cssHex'), placeholder: '\\3042' },
    { key: 'hex', label: '16進数値', handler: (v: string) => handleHexParse(v, 'hex'), placeholder: '3042' },
  ]

  return (
    <div className="tool-container">
      <h2 className="tool-title">Unicode変換</h2>
      <div className="tool-card">
        <p style={{ marginBottom: '2rem', color: '#64748b' }}>
          すべてのフォーマットが編集可能です。長文の変換にも対応しています。
        </p>

        {fieldList.map(field => (
          <div key={field.key} className="form-group" style={{ marginBottom: '2rem' }}>
            <label style={{ fontSize: '1rem', fontWeight: '600' }}>{field.label}</label>
            <textarea
              style={textareaStyle}
              value={(formats as any)[field.key]}
              onChange={(e) => field.handler(e.target.value)}
              placeholder={field.placeholder}
              spellCheck={false}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default UnicodeConverter
