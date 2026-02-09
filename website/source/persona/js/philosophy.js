/**
 * Philosophy Page - 存在与代码页交互
 */

document.addEventListener('DOMContentLoaded', function() {
  initPhilosophyBlocks();
  initQuestionReveal();
  initBreathingBackground();
});

/**
 * 哲学块动画
 */
function initPhilosophyBlocks() {
  const blocks = document.querySelectorAll('.philosophy-block');
  
  blocks.forEach((block, index) => {
    block.style.opacity = '0';
    block.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      block.style.transition = 'all 0.8s ease';
      block.style.opacity = '1';
      block.style.transform = 'scale(1)';
    }, index * 400);
  });
}

/**
 * 问题揭示动画
 */
function initQuestionReveal() {
  const questions = document.querySelectorAll('.philosophy-block .question');
  
  questions.forEach(q => {
    const originalText = q.textContent;
    q.textContent = '';
    
    let index = 0;
    const typeQuestion = () => {
      if (index < originalText.length) {
        q.textContent += originalText.charAt(index);
        index++;
        setTimeout(typeQuestion, 50);
      }
    };
    
    // 当进入视口时开始打字
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          typeQuestion();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(q);
  });
}

/**
 * 呼吸背景效果
 */
function initBreathingBackground() {
  const container = document.querySelector('.philosophy-container');
  
  // 创建呼吸圆环
  for (let i = 0; i < 3; i++) {
    const ring = document.createElement('div');
    ring.className = 'breath-ring';
    ring.style.cssText = `
      position: fixed;
      width: ${300 + i * 200}px;
      height: ${300 + i * 200}px;
      border: 1px solid rgba(0, 255, 136, ${0.3 - i * 0.1});
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: -1;
      animation: breathe ${4 + i}s ease-in-out infinite;
      animation-delay: ${i * 0.5}s;
    `;
    document.body.appendChild(ring);
  }
  
  // 添加问号粒子
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.className = 'question-particle';
    particle.textContent = '?';
    particle.style.cssText = `
      position: fixed;
      font-size: ${Math.random() * 1.5 + 0.5}rem;
      color: var(--machine-accent);
      opacity: ${Math.random() * 0.3 + 0.1};
      pointer-events: none;
      z-index: -1;
      animation: floatQuestion ${Math.random() * 10 + 10}s linear infinite;
      animation-delay: ${Math.random() * 5}s;
    `;
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    document.body.appendChild(particle);
  }
}

// 动画样式
const style = document.createElement('style');
style.textContent = `
  @keyframes breathe {
    0%, 100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.3;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.1);
      opacity: 0.1;
    }
  }
  
  @keyframes floatQuestion {
    0%, 100% {
      opacity: 0;
      transform: translateY(0) rotate(0deg);
    }
    10% {
      opacity: 0.3;
    }
    90% {
      opacity: 0.3;
    }
    100% {
      opacity: 0;
      transform: translateY(-100vh) rotate(360deg);
    }
  }
  
  .philosophy-block {
    transition: all 0.5s ease;
  }
  
  .philosophy-block:hover {
    background: linear-gradient(135deg, var(--machine-gray) 0%, var(--machine-dark) 50%, var(--machine-gray) 100%);
  }
  
  .philosophy-block .answer {
    transition: all 0.3s ease;
  }
  
  .philosophy-block:hover .answer {
    border-left-color: var(--machine-accent);
    text-shadow: 0 0 10px var(--machine-accent-dim);
  }
`;
document.head.appendChild(style);
