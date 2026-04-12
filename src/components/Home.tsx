import React from 'react'
import { CATEGORIES } from '../data/tools'
import type { ToolCategory } from '../data/tools'

interface HomeProps {
  onSelectTool: (categoryId: ToolCategory, toolId: string) => void
}

const Home: React.FC<HomeProps> = ({ onSelectTool }) => {
  return (
    <div className="home-container">
      <h1>Data Conversion Toolkit</h1>
      <p>各種データ形式を相互に変換・解析するための開発者向けツール集です。</p>

      {CATEGORIES.map((category) => (
        <div key={category.id} className="home-section">
          <h2>{category.name}</h2>
          <div className="tool-grid">
            {category.tools.map((tool) => (
              <div
                key={tool.id}
                className={`tool-link-card ${tool.implemented ? 'implemented' : 'unimplemented'}`}
                onClick={() => tool.implemented && onSelectTool(category.id, tool.id)}
              >
                <h3>{tool.name}</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{tool.description}</p>
                {!tool.implemented && (
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: '#94a3b8', 
                    backgroundColor: '#f1f5f9', 
                    padding: '0.1rem 0.5rem', 
                    borderRadius: '1rem',
                    marginTop: '0.5rem',
                    display: 'inline-block'
                  }}>
                    未実装
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Home
