document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  function elementToggle(elem) {
    if (elem) elem.classList.toggle('active');
  }

  // Sidebar
  const sidebar = document.querySelector('[data-sidebar]');
  const sidebarBtn = document.querySelector('[data-sidebar-btn]');
  if (sidebar && sidebarBtn) {
    sidebarBtn.addEventListener('click', function() { elementToggle(sidebar); });
  }

  // Custom select & filter
  const select = document.querySelector('[data-select]');
  const selectItems = document.querySelectorAll('[data-select-item]');
  const selectValue = document.querySelector('[data-selecct-value]');
  const filterBtns = document.querySelectorAll('[data-filter-btn]');
  const filterItems = document.querySelectorAll('[data-filter-item]');

  function filterFunc(selectedValue) {
    filterItems.forEach(function(item) {
      const category = item.dataset.category;
      const match = selectedValue === 'all' || selectedValue === category;
      item.classList.toggle('active', match);
    });
  }

  if (select && selectValue) {
    select.addEventListener('click', function() { elementToggle(select); });
    selectItems.forEach(function(item) {
      item.addEventListener('click', function() {
        const selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        elementToggle(select);
        filterFunc(selectedValue);
      });
    });
  }

  let lastClickedBtn = filterBtns[0];
  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const selectedValue = this.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText;
      filterFunc(selectedValue);
      if (lastClickedBtn) lastClickedBtn.classList.remove('active');
      this.classList.add('active');
      lastClickedBtn = this;
    });
  });

  // Contact form
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

  // Page navigation
  const navigationLinks = document.querySelectorAll('[data-nav-link]');
  const pages = document.querySelectorAll('[data-page]');
  navigationLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      const targetPage = this.innerHTML.toLowerCase().trim();
      pages.forEach(function(page, j) {
        const isActive = page.dataset.page === targetPage;
        page.classList.toggle('active', isActive);
        if (navigationLinks[j]) navigationLinks[j].classList.toggle('active', isActive);
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Scroll reveal for static content (service cards, timeline items)
  const revealEls = document.querySelectorAll('.service-item, .timeline-item');
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
  revealEls.forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    observer.observe(el);
  });

  // Blog posts
  const blogPostsList = document.getElementById('blog-posts-list');
  if (blogPostsList) {
    fetch('assets/json/posts.json')
      .then(function(r) { return r.json(); })
      .then(function(posts) {
        posts.forEach(function(post) {
          const li = document.createElement('li');
          li.classList.add('blog-post-item');
          li.innerHTML =
            '<a href="' + post.link + '">' +
              '<div class="blog-content">' +
                '<div class="blog-meta">' +
                  '<p class="blog-category">' + post.category + '</p>' +
                  '<span class="dot"></span>' +
                  '<time datetime="' + post.date + '">' + new Date(post.date).toDateString() + '</time>' +
                '</div>' +
                '<h3 class="h3 blog-item-title">' + post.title + '</h3>' +
                '<p class="blog-text">' + post.description + '</p>' +
              '</div>' +
            '</a>';
          blogPostsList.appendChild(li);
        });
      })
      .catch(function(err) { console.error('Error fetching blog posts:', err); });
  }
});
