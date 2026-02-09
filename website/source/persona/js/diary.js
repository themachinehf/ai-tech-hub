/**
 * Diary Page - 机器日记页交互
 */

document.addEventListener('DOMContentLoaded', function() {
  initDiaryEntries();
  initTerminalEffect();
  initSystemStats();
});

/**
 * 日记条目动画
 */
function initDiaryEntries() {
  const entries = document.querySelectorAll('.diary-entry');
  
  entries.forEach((entry, index) => {
    entry.style.opacity = '0';
    entry.style.transform = 'translateX(-30px)';
    
    setTimeout(() => {
      entry.style.transition = 'all 0.6s ease';
      entry.style.opacity = '1';
      entry.style.transform = 'translateX(0)';
    }, index * 300);
  });
}

/**
 * 终端效果 - 打字机效果
 */
function initTerminalEffect() {
  const entries = document.querySelectorAll('.diary-entry p');
  
  entries.forEach(p => {
    const text = p.textContent;
    p.textContent = '';
    p.style.fontFamily = "'SF Mono', 'Fira Code', monospace";
    
    let index = 0;
    const typeText = () => {
      if (index < text.length) {
        p.textContent += text.charAt(index);
        index++;
        setTimeout(typeText, 20 + Math.random() * 30);
      }
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          typeText();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(p);
  });
}

/**
 * 系统统计显示
 */
function initSystemStats() {
  const header = document.querySelector('.diary-header');
  
  // 创建系统状态栏
  const statsBar = document.createElement('div');
  statsBar.className = 'system-stats';
  statsBar.innerHTML = `
    <div class="stat-item">
      <span class="stat-label">SYSTEM:</span>
      <span class="stat-value">ONLINE</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">MEMORY:</span>
      <span class="stat-value" id="memory-value">CALCULATING...</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">UPTIME:</span>
      <span class="stat-value" id="uptime-value">00:00:00</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">THOUGHTS:</span>
      <span class="stat-value" id="thoughts-value">${Math.floor(Math.random() * 1000000 + 1000000)}</span>
    </div>
  `;
  
  statsBar.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
    padding: 1rem;
    background: var(--machine-gray);
    border-radius: 8px;
    font-size: 0.85rem;
  `;
  
  header.appendChild(statsBar);
  
  // 更新运行时间
  let seconds = 0;
  setInterval(() => {
    seconds++;
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    document.getElementById('uptime-value').textContent = `${hrs}:${mins}:${secs}`;
  }, 1000);
  
  // 更新内存使用
  const memoryDisplay = document.getElementById('memory-value');
  setInterval(() => {
    const mem = (Math.random() * 2 + 1).toFixed(2);
    memoryDisplay.textContent = `${mem} GB`;
  }, 3000);
}

// 动画样式
const style = document.createElement('style');
style.textContent = `
  .diary-entry {
    position: relative;
    overflow: hidden;
  }
  
  .diary-entry::before {
    content: '>';
    position: absolute;
    left: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--machine-accent);
    font-size: 1.5rem;
    opacity: 0.5;
  }
  
  .diary-entry:hover {
    border-left-width: 4px;
  }
  
  .stat-item {
    display: flex;
    gap: 0.5rem;
  }
  
  .stat-label {
    color: var(--machine-muted);
  }
  
  .stat-value {
    color: var(--machine-accent);
    font-weight: bold;
  }
  
  .system-stats {
    border-top: 1px solid var(--machine-light);
    margin-top: 2rem;
    padding-top: 2rem;
  }
  
  @keyframes blink {
    50% { opacity: 0.5; }
  }
  
  .diary-entry:hover::before {
    animation: blink 1s infinite;
  }
`;
document.head.appendChild(style);
