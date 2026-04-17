import { useEffect, useRef, useState } from 'react'
import { CATEGORIES } from './data/tools'
import type { ToolCategory } from './data/tools'
import Home from './components/Home'
import BaseConverter from './tools/BaseConverter'
import UrlEncoder from './tools/UrlEncoder'
import JsonEscapeConverter from './tools/JsonEscapeConverter'
import UnicodeConverter from './tools/UnicodeConverter'
import TextHexConverter from './tools/TextHexConverter'
import CsvViewer from './tools/CsvViewer'
import PlaceholderTool from './tools/PlaceholderTool'
import * as Icons from 'lucide-react'
import './App.css'

function App() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'home'>('home')
  const [activeToolId, setActiveToolId] = useState<string | null>(null)
  const contentAreaRef = useRef<HTMLDivElement | null>(null)

  const navigateHome = () => {
    setActiveCategory('home')
    setActiveToolId(null)
  }

  const handleSelectTool = (categoryId: ToolCategory, toolId: string) => {
    setActiveCategory(categoryId)
    setActiveToolId(toolId)
  }

  const currentCategory = activeCategory !== 'home' ? CATEGORIES.find(c => c.id === activeCategory) : null
  const currentTool = currentCategory?.tools.find(t => t.id === activeToolId)

  useEffect(() => {
    contentAreaRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [activeCategory, activeToolId])

  const renderIcon = (name: string) => {
    const IconComponent = (Icons as any)[name]
    return IconComponent ? <IconComponent size={20} className="icon" /> : null
  }

  const renderTool = () => {
    if (activeCategory === 'home' || !currentTool) {
      return <Home onSelectTool={handleSelectTool} />
    }

    switch (currentTool.id) {
      case 'base-conv':
        return <BaseConverter />
      case 'url-enc':
        return <UrlEncoder />
      case 'esc-json':
        return <JsonEscapeConverter />
      case 'unicode':
        return <UnicodeConverter />
      case 'text-hex':
        return <TextHexConverter />
      case 'csv-view':
        return <CsvViewer />
      default:
        return <PlaceholderTool name={currentTool.name} />
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <button type="button" className="app-header-link" onClick={navigateHome}>
          Data Conversion Toolkit
        </button>
      </header>
      <div className="app-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="category-list">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className={`category-item ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveToolId(cat.tools[0].id);
                }}
              >
                {renderIcon(cat.icon)}
                <span>{cat.name}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {activeCategory !== 'home' && currentCategory && (
            <div className="tool-tabs">
              {currentCategory.tools.map((tool) => (
                <div
                  key={tool.id}
                  className={`tool-tab ${activeToolId === tool.id ? 'active' : ''}`}
                  onClick={() => setActiveToolId(tool.id)}
                >
                  {tool.name}
                </div>
              ))}
            </div>
          )}
          <div className="content-area" ref={contentAreaRef}>
            {renderTool()}
          </div>
        </main>
      </div>
      <footer className="app-footer">
        Copyright © 2026 KawataniShinya
      </footer>
    </div>
  )
}

export default App
