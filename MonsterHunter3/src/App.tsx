import { useState } from 'react'
import content from '../public/zh.json'
import './App.css'

function sortByFirstLetter(list, options = {}) {
    const {
        ascending = true,
        caseSensitive = false,
        locale = 'zh-CN'
    } = options;

    // 过滤掉非字符串项或空字符串（可根据需求调整）
    const validList = list.filter(item => typeof item === 'string' && item.trim() !== '');

    // 使用 localeCompare 进行本地化字符串比较
    const sorted = [...list].sort((a, b) => {
        const compareResult = a.monsterName.localeCompare(b.monsterName, locale, {
            sensitivity: caseSensitive ? 'variant' : 'base', // base: 不区分大小写和变音符号
            ignorePunctuation: true, // 忽略标点符号
            numeric: false            // 是否启用数字自然排序
        });
        return ascending ? compareResult : -compareResult;
    });

    return sorted;
}

const sortedContent = sortByFirstLetter(content, { ascending: true, caseSensitive: false, locale: 'zh-CN' });

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  
  // 根据 monsterName 筛选列表
  const filteredContent = sortedContent.filter(item => 
    item.monsterName && item.monsterName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="app-container">
      <div className='input-wrapper'>
        <div className='search-box'>
          <svg className='search-icon' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            className='search-input'
            type="text"
            placeholder="搜索名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className='clear-btn'
              onClick={() => setSearchTerm('')}
              aria-label="清除搜索"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      <div className="list">
        {filteredContent.length > 0 ? (
          filteredContent.map(item => (
            <div className='list-item' key={item.monsterName}>
              <div className='list-item_icon-wrapper'>
                <img 
                  src={item.monsterIcon} 
                  alt={item.monsterName}
                  className='list-item_icon'
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="%23e0e0e0"/></svg>'
                  }}
                />
              </div>
              <div className='list-item_info'>
                <div className='list-item_name'>
                  {item.element && `[${item.element}]`} {item.monsterName}
                </div>
                {item.transformAtk && item.transformAtk.length > 0 && (
                  <div className='list-item_tags'>
                    <span className='tag normal'>{item.attackType}</span>
                    {item.transformAtk.map((atk, index) => (
                      <span key={`${atk}-${index}`} className='tag'>{atk}</span>
                    ))}
                    {item.elemWeakness.map((weakness, index) => (
                      <span key={`${weakness.type}-${index}`} className='tag weak'>{weakness.type}{Array.from({ length: weakness.value }).fill('↓').join('')}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className='list-item_arrow'>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))
        ) : (
          <div className='empty-state'>
            <p>没有找到匹配的结果</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App