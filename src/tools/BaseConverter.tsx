import React, { useState } from 'react'

const BaseConverter: React.FC = () => {
  const [value, setValue] = useState<bigint | null>(null)
  const [bitLength, setBitLength] = useState<number>(0)

  const getPrefix = (base: number) => {
    if (base === 16) return 'x'
    if (base === 2) return 'b'
    if (base === 8) return 'o'
    return ''
  }

  // 各進数に応じたフォーマット（パディングあり）
  const formatValue = (v: bigint | null, base: number) => {
    if (v === null) return ''
    
    const raw = v.toString(base).toUpperCase()
    
    if (base === 10) return raw // 10進数はパディングなし

    // ビット長から必要な桁数を算出
    let requiredChars = 0
    if (base === 2) requiredChars = bitLength
    if (base === 16) requiredChars = Math.ceil(bitLength / 4)
    if (base === 8) requiredChars = Math.ceil(bitLength / 3)

    return raw.padStart(requiredChars, '0')
  }

  const bases = [
    { label: '2進数 (Binary)', base: 2, className: 'input-base-2' },
    { label: '8進数 (Octal)', base: 8, className: 'input-base-8' },
    { label: '10進数 (Decimal)', base: 10, className: 'input-base-10' },
    { label: '16進数 (Hexadecimal)', base: 16, className: 'input-base-16' },
  ]

  return (
    <div className="tool-container">
      <h2 className="tool-title">進数変換（2/8/10/16進）</h2>
      <div className="tool-card">
        <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>
          入力欄の区切り線と数字の位置が正確に一致します。左右の余白をなくし、桁の読み間違いを防いでいます。
        </p>
        
        {bases.map((b) => {
          const valStr = formatValue(value, b.base)
          return (
            <div key={b.base} className="form-group">
              <label>{b.label}</label>
              <input
                type="text"
                className={`digit-input ${b.className}`}
                value={valStr}
                onChange={(e) => {
                  const rawVal = e.target.value.trim().replace(/\s/g, '')
                  
                  if (rawVal === '') {
                    setValue(null)
                    setBitLength(0)
                    return
                  }

                  // 入力された文字列の長さを元にビット長を更新
                  let newBitLen = 0
                  if (b.base === 2) newBitLen = rawVal.length
                  if (b.base === 16) newBitLen = rawVal.length * 4
                  if (b.base === 8) newBitLen = rawVal.length * 3

                  try {
                    const prefix = getPrefix(b.base)
                    const n = BigInt(b.base === 10 ? rawVal : `0${prefix}${rawVal}`)
                    setValue(n)
                    
                    if (b.base === 10) {
                      setBitLength(n.toString(2).length)
                    } else {
                      setBitLength(newBitLen)
                    }
                  } catch (err) {
                    // 不正な入力は無視
                  }
                }}
                spellCheck={false}
                style={{ 
                  fontSize: '1.2rem',
                  height: '3rem'
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BaseConverter
