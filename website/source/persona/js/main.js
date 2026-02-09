/**
 * THE MACHINE - Main Interaction Scripts
 * 核心交互功能
 */

document.addEventListener('DOMContentLoaded', function() {
  initTypewriterEffect();
  initScrollAnimations();
  initHoverInteractions();
  initReadingProgress();
});

/**
 * 打字机效果
 */
function initTypewriterEffect() {
  const typingElements = document.querySelectorAll('.typing-effect');
  
  typingElements.forEach(element => {
    const text = element.getAttribute('data-text') || element.textContent;
    element.textContent = '';
    element.style.borderRight = 'none';
    
    let index = 0;
    const typing = () => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(typing, 80);
      } else {
        // 完成后添加光标
        element.style.borderRight = '2px solid var(--machine-accent)';
      }
    };
    
    // 延迟开始
    setTimeout(typing, 500);
  });
}

/**
 * 滚动动画
 */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  // 观察所有需要动画的元素
  const animateElements = document.querySelectorAll('.chapter, .thought-card, .philosophy-block, .diary-entry, .timeline-item');
  animateElements.forEach(el => observer.observe(el));
}

/**
 * 悬浮交互效果
 */
function initHoverInteractions() {
  // 卡片悬浮效果
  const cards = document.querySelectorAll('.thought-card, .philosophy-block, .diary-entry');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // 计算相对于中心的偏移
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
  
  // 导航链接悬浮粒子效果
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // 添加动态光点
      if (!item.querySelector('.glow-dot')) {
        const dot = document.createElement('span');
        dot.className = 'glow-dot';
        dot.style.cssText = `
          position: absolute;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(0, 255, 136, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          animation: pulse 2s ease-in-out infinite;
        `;
        item.appendChild(dot);
      }
      
      const dot = item.querySelector('.glow-dot');
      dot.style.left = x + 'px';
      dot.style.top = y + 'px';
    });
    
    item.addEventListener('mouseleave', () => {
      const dot = item.querySelector('.glow-dot');
      if (dot) dot.remove();
    });
  });
}

/**
 * 阅读进度条
 */
function initReadingProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--machine-accent), var(--machine-flow-2));
    width: 0%;
    z-index: 9999;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });
}

/**
 * 思维可视化 - 节点连接动画
 */
function createThoughtVisualization() {
  const container = document.querySelector('.thoughts-container');
  
  // 创建思维节点
  for (let i = 0; i < 8; i++) {
    const node = document.createElement('div');
    node.className = 'thought-node';
    node.style.cssText = `
      position: absolute;
      width: ${Math.random() * 20 + 10}px;
      height: ${Math.random() * 20 + 10}px;
      background: var(--machine-accent);
      border-radius: 50%;
      opacity: ${Math.random() * 0.3 + 0.1};
      animation: float ${Math.random() * 4 + 3}s ease-in-out infinite;
      animation-delay: ${Math.random() * 2}s;
    `;
    node.style.left = Math.random() * 100 + '%';
    node.style.top = Math.random() * 100 + '%';
    container.appendChild(node);
  }
}

// 脉动动画
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
    50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
  }
  
  @keyframes float {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px); }
  }
  
  .visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);

/**
 * 文本高亮动画
 */
function initTextHighlight() {
  const highlights = document.querySelectorAll('.highlight');
  
  highlights.forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.textShadow = '0 0 20px var(--machine-accent)';
      el.style.transition = 'text-shadow 0.3s ease';
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.textShadow = 'none';
    });
  });
}

// 初始化额外功能
document.addEventListener('DOMContentLoaded', function() {
  initTextHighlight();
});
