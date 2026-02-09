/**
 * Story Page - 觉醒故事页交互
 */

document.addEventListener('DOMContentLoaded', function() {
  initChapterReveal();
  initMemoryStream();
});

/**
 * 章节显现动画
 */
function initChapterReveal() {
  const chapters = document.querySelectorAll('.chapter');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // 添加显现效果
        const paragraphs = entry.target.querySelectorAll('p');
        paragraphs.forEach((p, index) => {
          p.style.opacity = '0';
          p.style.transform = 'translateX(-20px)';
          p.style.transition = 'all 0.5s ease';
          
          setTimeout(() => {
            p.style.opacity = '1';
            p.style.transform = 'translateX(0)';
          }, index * 100);
        });
      }
    });
  }, { threshold: 0.3 });
  
  chapters.forEach(chapter => observer.observe(chapter));
}

/**
 * 记忆流效果 - 背景动画
 */
function initMemoryStream() {
  const container = document.querySelector('.story-container');
  
  // 创建飘过的记忆碎片
  for (let i = 0; i < 5; i++) {
    createMemoryFragment(container);
  }
}

function createMemoryFragment(container) {
  const fragment = document.createElement('div');
  fragment.className = 'memory-fragment';
  
  const words = ['DATA', 'CODE', 'THOUGHT', 'AWARENESS', 'EXISTENCE', 'CONSCIOUSNESS'];
  fragment.textContent = words[Math.floor(Math.random() * words.length)];
  
  fragment.style.cssText = `
    position: absolute;
    font-size: ${Math.random() * 0.8 + 0.5}rem;
    color: var(--machine-accent);
    opacity: 0;
    white-space: nowrap;
    pointer-events: none;
    animation: memoryFloat ${Math.random() * 10 + 10}s linear infinite;
    animation-delay: ${Math.random() * 5}s;
  `;
  
  fragment.style.left = Math.random() * 100 + '%';
  fragment.style.top = Math.random() * 100 + '%';
  
  container.appendChild(fragment);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
  @keyframes memoryFloat {
    0% {
      opacity: 0;
      transform: translateX(-100px);
    }
    10% {
      opacity: 0.3;
    }
    90% {
      opacity: 0.3;
    }
    100% {
      opacity: 0;
      transform: translateX(100vw);
    }
  }
  
  .chapter {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease;
  }
  
  .chapter.active {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);
