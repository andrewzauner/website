document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ========================================
  // Utility Functions
  // ========================================

  function elementToggle(elem) {
    if (elem) elem.classList.toggle('active');
  }

  // ========================================
  // Particle Background Animation
  // ========================================

  const canvas = document.getElementById('particleCanvas');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId = null;
    let resizeTimeout = null;

    const MAX_PARTICLES = 120; // keep it visually rich but bounded

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const particleCount = Math.min(
        MAX_PARTICLES,
        Math.floor((canvas.width * canvas.height) / 15000)
      );

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      const len = particles.length;

      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(function(particle) {
        particle.update();
        particle.draw();
      });

      drawConnections();
      animationId = requestAnimationFrame(animate);
    }

    // Initial setup
    resizeCanvas();
    initParticles();
    animate();

    // Debounced resize
    window.addEventListener('resize', function() {
      if (resizeTimeout) clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(function() {
        resizeCanvas();
        initParticles();
      }, 150);
    });

    // Pause / resume on tab visibility
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      } else if (!animationId) {
        animate();
      }
    });
  }

  // ========================================
  // Sidebar Toggle
  // ========================================

  const sidebar = document.querySelector('[data-sidebar]');
  const sidebarBtn = document.querySelector('[data-sidebar-btn]');

  if (sidebar && sidebarBtn) {
    sidebarBtn.addEventListener('click', function() {
      elementToggle(sidebar);
    });
  }

  // ========================================
  // Portfolio Filter
  // ========================================

  const select = document.querySelector('[data-select]');
  const selectItems = document.querySelectorAll('[data-select-item]');
  const selectValue = document.querySelector('[data-selecct-value]');
  const filterBtns = document.querySelectorAll('[data-filter-btn]');
  const filterItems = document.querySelectorAll('[data-filter-item]');

  function filterFunc(selectedCategory) {
    const value = (selectedCategory || 'all').toLowerCase().trim();

    filterItems.forEach(function(item) {
      const category = (item.dataset.category || '').toLowerCase().trim();
      const match = value === 'all' || value === category;
      item.classList.toggle('active', match);
    });
  }

  // Mobile filter dropdown
  if (select && selectValue) {
    select.addEventListener('click', function() {
      elementToggle(select);
    });

    selectItems.forEach(function(item) {
      item.addEventListener('click', function() {
        const selectedCategory = this.dataset.category || this.innerText.toLowerCase().trim();
        selectValue.innerText = this.innerText;
        elementToggle(select);
        filterFunc(selectedCategory);
      });
    });
  }

  // Desktop filter buttons
  let lastClickedBtn = filterBtns[0] || null;

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const selectedCategory = this.dataset.category || this.innerText.toLowerCase().trim();

      if (selectValue) {
        selectValue.innerText = this.innerText;
      }

      filterFunc(selectedCategory);

      if (lastClickedBtn) lastClickedBtn.classList.remove('active');
      this.classList.add('active');
      lastClickedBtn = this;
    });
  });

  // ========================================
  // Contact Form Validation
  // ========================================

  const form = document.querySelector('[data-form]');
  const formInputs = document.querySelectorAll('[data-form-input]');
  const formBtn = document.querySelector('[data-form-btn]');

  if (form && formBtn) {
    formInputs.forEach(function(input) {
      input.addEventListener('input', function() {
        formBtn.toggleAttribute('disabled', !form.checkValidity());
      });
    });
  }

  // ========================================
  // Page Navigation
  // ========================================

  const navigationLinks = document.querySelectorAll('[data-nav-link]');
  const pages = document.querySelectorAll('[data-page]');

  navigationLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      const targetPage = this.innerHTML.toLowerCase().trim();

      pages.forEach(function(page, j) {
        const isActive = page.dataset.page === targetPage;
        page.classList.toggle('active', isActive);

        if (navigationLinks[j]) {
          navigationLinks[j].classList.toggle('active', isActive);
        }
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ========================================
  // Scroll Reveal Animations
  // ========================================

  const revealElements = document.querySelectorAll(
    '.service-item, .timeline-item, .skills-item, .blog-post-item'
  );

  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition =
      'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), ' +
      'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    revealObserver.observe(el);
  });

  // ========================================
  // Project Card Mouse Follow Effect
  // ========================================

  const projectLinks = document.querySelectorAll('.project-item > a');

  projectLinks.forEach(function(link) {
    let rect = null;

    function updateRect() {
      rect = link.getBoundingClientRect();
    }

    // Cache rect initially and on resize/scroll
    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);

    link.addEventListener('mouseenter', updateRect);

    link.addEventListener('mousemove', function(e) {
      if (!rect) updateRect();

      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      this.style.setProperty('--mouse-x', x + '%');
      this.style.setProperty('--mouse-y', y + '%');
    });
  });

  // ========================================
  // Blog Posts Loader
  // ========================================

  const blogPostsList = document.getElementById('blog-posts-list');
  const blogModal = document.getElementById('blogModal');
  const blogModalOverlay = document.getElementById('blogModalOverlay');
  const blogModalClose = document.getElementById('blogModalClose');
  const blogModalTitle = document.getElementById('blogModalTitle');
  const blogModalCategory = document.getElementById('blogModalCategory');
  const blogModalDate = document.getElementById('blogModalDate');
  const blogModalBody = document.getElementById('blogModalBody');

  const sampleBlogPosts = [
    {
      title: "Getting Started with Machine Learning in Finance",
      category: "Machine Learning",
      date: "2024-01-15",
      description: "Exploring the fundamentals of applying ML algorithms to financial modeling and prediction.",
      content: `
        <p>Machine learning has revolutionized the financial industry, enabling more accurate predictions and automated decision-making processes. In this post, we'll explore the fundamentals of applying ML algorithms to financial modeling.</p>

        <h3>Why Machine Learning in Finance?</h3>
        <p>The financial markets generate massive amounts of data every second. Traditional statistical methods often struggle to capture the complex, non-linear relationships present in this data. Machine learning excels at:</p>
        <ul>
          <li>Pattern recognition in large datasets</li>
          <li>Handling non-linear relationships</li>
          <li>Adapting to changing market conditions</li>
          <li>Processing alternative data sources</li>
        </ul>

        <h3>Common ML Applications in Finance</h3>
        <p>Here are some popular use cases:</p>
        <ul>
          <li><strong>Algorithmic Trading:</strong> Using models to identify trading opportunities</li>
          <li><strong>Credit Risk Assessment:</strong> Predicting loan default probabilities</li>
          <li><strong>Fraud Detection:</strong> Identifying suspicious transactions</li>
          <li><strong>Portfolio Optimization:</strong> Maximizing returns while managing risk</li>
        </ul>

        <h3>Getting Started</h3>
        <p>If you're interested in exploring ML for finance, I recommend starting with Python libraries like <code>scikit-learn</code>, <code>pandas</code>, and <code>numpy</code>. These tools provide a solid foundation for building your first models.</p>

        <p>Stay tuned for more posts where I'll dive deeper into specific algorithms and their applications!</p>
      `
    },
    {
      title: "DCF Analysis: A Comprehensive Guide",
      category: "Finance",
      date: "2024-02-03",
      description: "Deep dive into discounted cash flow analysis and its application in equity valuation.",
      content: `
        <p>Discounted Cash Flow (DCF) analysis is one of the most fundamental valuation methods in finance. It estimates the value of an investment based on its expected future cash flows.</p>

        <h3>The Core Concept</h3>
        <p>The principle behind DCF is simple: a dollar today is worth more than a dollar tomorrow. By discounting future cash flows to their present value, we can determine what a company or investment is truly worth.</p>

        <h3>Key Components</h3>
        <ul>
          <li><strong>Free Cash Flow (FCF):</strong> The cash a company generates after accounting for capital expenditures</li>
          <li><strong>Discount Rate (WACC):</strong> The weighted average cost of capital, reflecting the company's risk</li>
          <li><strong>Terminal Value:</strong> The value of cash flows beyond the projection period</li>
          <li><strong>Growth Rate:</strong> Expected perpetual growth rate of the business</li>
        </ul>

        <h3>The Formula</h3>
        <p>The basic DCF formula is:</p>
        <pre><code>PV = CF₁/(1+r)¹ + CF₂/(1+r)² + ... + CFₙ/(1+r)ⁿ + TV/(1+r)ⁿ</code></pre>

        <h3>Practical Considerations</h3>
        <p>While DCF is powerful, it's important to remember that it's highly sensitive to assumptions. Small changes in growth rates or discount rates can significantly impact valuations. Always perform sensitivity analysis to understand the range of possible outcomes.</p>
      `
    },
    {
      title: "Building a Sports Analytics Pipeline",
      category: "Programming",
      date: "2024-01-28",
      description: "How I built an automated data pipeline for NCAA baseball analytics using Python.",
      content: `
        <p>Sports analytics has become increasingly data-driven, and building efficient data pipelines is crucial for timely insights. Here's how I built an automated system for NCAA baseball analytics.</p>

        <h3>The Architecture</h3>
        <p>My pipeline consists of three main components:</p>
        <ul>
          <li><strong>Data Collection:</strong> Web scraping and API integration</li>
          <li><strong>Data Processing:</strong> Cleaning, transformation, and feature engineering</li>
          <li><strong>Analysis & Visualization:</strong> Statistical modeling and dashboard creation</li>
        </ul>

        <h3>Tech Stack</h3>
        <p>I chose Python for its rich ecosystem of data science libraries:</p>
        <ul>
          <li><code>pandas</code> for data manipulation</li>
          <li><code>BeautifulSoup</code> and <code>Selenium</code> for web scraping</li>
          <li><code>PostgreSQL</code> for data storage</li>
          <li><code>Apache Airflow</code> for workflow orchestration</li>
          <li><code>Plotly</code> and <code>Dash</code> for interactive visualizations</li>
        </ul>

        <h3>Key Learnings</h3>
        <p>Building this pipeline taught me several important lessons:</p>
        <ul>
          <li>Always validate your data sources - inconsistencies are common</li>
          <li>Build in error handling and logging from day one</li>
          <li>Modular code makes debugging and scaling much easier</li>
          <li>Documentation is crucial when you revisit code months later</li>
        </ul>

        <h3>Results</h3>
        <p>The automated pipeline now processes data daily, providing insights into player performance trends, team statistics, and predictive modeling for upcoming games. It's been an invaluable learning experience in building production-ready data systems.</p>
      `
    }
  ];

  function openBlogModal(post) {
    if (!blogModal) return;

    blogModalTitle.textContent = post.title;
    blogModalCategory.textContent = post.category;

    const date = new Date(post.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    blogModalDate.textContent = formattedDate;
    blogModalDate.setAttribute('datetime', post.date);

    blogModalBody.innerHTML = post.content;

    blogModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeBlogModal() {
    if (!blogModal) return;
    blogModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (blogPostsList) {
    sampleBlogPosts.forEach(function(post) {
      const li = document.createElement('li');
      li.classList.add('blog-post-item');

      const date = new Date(post.date);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      li.innerHTML =
        '<a href="#" class="blog-post-link">' +
          '<div class="blog-content">' +
            '<div class="blog-meta">' +
              '<p class="blog-category">' + post.category + '</p>' +
              '<span class="dot"></span>' +
              '<time datetime="' + post.date + '">' + formattedDate + '</time>' +
            '</div>' +
            '<h3 class="h3 blog-item-title">' + post.title + '</h3>' +
            '<p class="blog-text">' + post.description + '</p>' +
          '</div>' +
        '</a>';

      const link = li.querySelector('.blog-post-link');
      link.addEventListener('click', function(e) {
        e.preventDefault();
        openBlogModal(post);
      });

      blogPostsList.appendChild(li);
    });

    // Apply scroll reveal to newly added blog items as well
    const blogItems = blogPostsList.querySelectorAll('.blog-post-item');
    blogItems.forEach(function(item) {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition =
        'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), ' +
        'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      revealObserver.observe(item);
    });
  }

  if (blogModalClose) {
    blogModalClose.addEventListener('click', closeBlogModal);
  }

  if (blogModalOverlay) {
    blogModalOverlay.addEventListener('click', closeBlogModal);
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && blogModal && blogModal.classList.contains('active')) {
      closeBlogModal();
    }
  });

  // ========================================
  // Typing Effect for Code Brackets
  // ========================================

  const codeBrackets = document.querySelectorAll('.code-bracket');

  codeBrackets.forEach(function(bracket) {
    bracket.style.display = 'inline-block';
    bracket.style.animation = 'blink 1s step-end infinite';
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  `;
  document.head.appendChild(style);

  // ========================================
  // Smooth Skill Bar Animation on Scroll
  // ========================================

  const skillBars = document.querySelectorAll('.skill-progress-fill');

  const skillObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.style.width;
        bar.style.width = '0%';

        setTimeout(function() {
          bar.style.width = targetWidth;
        }, 100);

        skillObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  skillBars.forEach(function(bar) {
    skillObserver.observe(bar);
  });

  // ========================================
  // Performance Optimization
  // ========================================

  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }

    scrollTimeout = window.requestAnimationFrame(function() {
      // Scroll-based animations handled by IntersectionObserver
    });
  }, { passive: true });

  // Reduce motion for users who prefer it
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(function(el) {
      el.style.animation = 'none';
      el.style.transition = 'none';
    });

    if (canvas) {
      const ctxReduce = canvas.getContext('2d');
      ctxReduce.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // ========================================
  // Console Easter Egg
  // ========================================

  console.log('%c👨‍💻 Hello, Developer!', 'font-size: 20px; color: #6366f1; font-weight: bold;');
  console.log('%cWelcome to Andrew Zauner\'s Portfolio', 'font-size: 14px; color: #3b82f6;');
  console.log('%cBuilt with ❤️ using HTML, CSS, and JavaScript', 'font-size: 12px; color: #94a3b8;');
  console.log('%cInterested in collaboration? Let\'s connect!', 'font-size: 12px; color: #8b5cf6;');

});
