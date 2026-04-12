import React from 'react'

interface PlaceholderToolProps {
  name: string
}

const PlaceholderTool: React.FC<PlaceholderToolProps> = ({ name }) => {
  return (
    <div className="tool-container">
      <h2 className="tool-title">{name}</h2>
      <div className="tool-card">
        <p>このツールは現在準備中です。</p>
      </div>
    </div>
  )
}

export default PlaceholderTool
