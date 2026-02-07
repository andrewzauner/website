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
        const selectedCategory =
          this.dataset.category || this.innerText.toLowerCase().trim();
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
      const selectedCategory =
        this.dataset.category || this.innerText.toLowerCase().trim();

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

  const revealObserver = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

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
  // Blog Posts Loader + Modal
  // ========================================

  const blogPostsList = document.getElementById('blog-posts-list');
  const blogModal = document.getElementById('blogModal');
  const blogModalOverlay = document.getElementById('blogModalOverlay');
  const blogModalClose = document.getElementById('blogModalClose');
  const blogModalTitle = document.getElementById('blogModalTitle');
  const blogModalCategory = document.getElementById('blogModalCategory');
  const blogModalDate = document.getElementById('blogModalDate');
  const blogModalBody = document.getElementById('blogModalBody');

  const blogPosts = [
    {
      slug: '2026.02.06_elevedys_and_duchenne',
      title: 'Elevydis and Duchenne',
      category: 'Biotech',
      date: '2026-02-06',
      description:
        'A look at Elevydis (delandistrogene moxeparvovec) and its role in Duchenne muscular dystrophy'
    },
    {
      slug: '2024.08.08_chase_sapphire_preferred',
      title: 'Why the Chase Sapphire Preferred is my Next Credit Card Choice',
      category: 'Finance',
      date: '2024-02-03',
      description:
        'A look into some of the perks of the Chase Sapphire Preferred'
    },
    {
      slug: '2024.06.25_theory_of_computation',
      title: 'Conquering the Beast: My Journey Through the Theory of Computation',
      category: 'Programming',
      date: '2024-01-28',
      description:
        'This course was not just a test of my intellectual limits but also a transformative experience that reshaped my understanding of computer science'
    },
    {
      slug: '2024.06.21_apple_wwdc_24',
      title: 'Reflecting on WWDC 2024',
      category: 'Tech',
      date: '2024-01-28',
      description:
        'Some thoughts on the 2024 rendition of Apple\'s Worldwide Developers Conference'
    },
    {
      slug: '2024.06.18.first_post',
      title: 'Welcome to My Website!',
      category: 'General',
      date: '2024-01-28',
      description:
        'Welcome to My Website!'
    }
    // add more here as you create posts
  ];

  async function openBlogModal(post) {
    if (!blogModal) return;

    // Set title / meta
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

    try {
      // Fetch the HTML for the post
      const res = await fetch(`/posts/${post.slug}.html`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const html = await res.text();

      // Parse and extract the article body
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Prefer [data-blog-body], fallback to <main> or <article>, then body
      const articleEl =
        doc.querySelector('[data-blog-body]') ||
        doc.querySelector('main') ||
        doc.querySelector('article') ||
        doc.body;

      blogModalBody.innerHTML = articleEl.innerHTML;
    } catch (err) {
      console.error('Error loading blog post:', err);
      blogModalBody.innerHTML = `
        <p>Sorry, there was a problem loading this post.</p>
        <p><code>${err.message}</code></p>
      `;
    }

    blogModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeBlogModal() {
    if (!blogModal) return;
    blogModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Render blog list
  if (blogPostsList) {
    blogPosts.forEach(function(post) {
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
      link.addEventListener('click', async function(e) {
        e.preventDefault();
        await openBlogModal(post);
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
      revealObserver && revealObserver.observe(item);
    });
  }

  // Modal close handlers
  if (blogModalClose) {
    blogModalClose.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeBlogModal();
    });
  }

  if (blogModalOverlay) {
    blogModalOverlay.addEventListener('click', function(e) {
      e.preventDefault();
      closeBlogModal();
    });
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
  window.addEventListener(
    'scroll',
    function() {
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }

      scrollTimeout = window.requestAnimationFrame(function() {
        // Scroll-based animations handled by IntersectionObserver
      });
    },
    { passive: true }
  );

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

  console.log(
    '%c👨‍💻 Hello, Developer!',
    'font-size: 20px; color: #6366f1; font-weight: bold;'
  );
  console.log(
    "%cWelcome to Andrew Zauner's Portfolio",
    'font-size: 14px; color: #3b82f6;'
  );
  console.log(
    '%cBuilt with ❤️ using HTML, CSS, and JavaScript',
    'font-size: 12px; color: #94a3b8;'
  );
  console.log(
    "%cInterested in collaboration? Let's connect!",
    'font-size: 12px; color: #8b5cf6;'
  );
});
