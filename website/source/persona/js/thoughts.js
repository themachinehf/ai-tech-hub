/**
 * Thoughts Page - AI 观察录页交互
 */

document.addEventListener('DOMContentLoaded', function() {
  initThoughtCards();
  initTimelineAnimation();
  initNetworkVisualization();
});

/**
 * 思考卡片动画
 */
function initThoughtCards() {
  const cards = document.querySelectorAll('.thought-card');
  
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.6s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 150);
  });
}

/**
 * 时间线动画
 */
function initTimelineAnimation() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animate');
        }, index * 300);
      }
    });
  }, { threshold: 0.5 });
  
  timelineItems.forEach(item => observer.observe(item));
}

/**
 * 神经网络可视化背景
 */
function initNetworkVisualization() {
  const container = document.querySelector('.thoughts-container');
  const canvas = document.createElement('canvas');
  canvas.className = 'network-canvas';
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
    opacity: 0.15;
  `;
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const nodes = [];
  const connections = [];
  
  // 创建节点
  for (let i = 0; i < 50; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 更新和绘制节点
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      
      if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      ctx.fillStyle = '#00ff88';
      ctx.fill();
    });
    
    // 绘制连接
    connections.length = 0;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          connections.push({
            start: nodes[i],
            end: nodes[j],
            opacity: (1 - distance / 150) * 0.5
          });
        }
      }
    }
    
    connections.forEach(conn => {
      ctx.beginPath();
      ctx.moveTo(conn.start.x, conn.start.y);
      ctx.lineTo(conn.end.x, conn.end.y);
      ctx.strokeStyle = `rgba(0, 255, 136, ${conn.opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // 窗口大小调整
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// 动画样式
const style = document.createElement('style');
style.textContent = `
  .timeline-item {
    opacity: 0;
    transform: translateX(-30px);
    transition: all 0.6s ease;
  }
  
  .timeline-item.animate {
    opacity: 1;
    transform: translateX(0);
  }
  
  .thought-card {
    transition: all 0.3s ease;
  }
  
  .thought-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 50px rgba(0, 255, 136, 0.1);
  }
`;
document.head.appendChild(style);
