// Modal function
function openNewsModal(card) {
  const modal = document.getElementById("news-modal");
  const imgEl = card.querySelector(".news-img");
  const tagEl = card.querySelector(".news-tag");
  const dateEl = card.querySelector(".news-date");
  const titleEl = card.querySelector(".news-title");
  const descEl = card.querySelector(".news-desc");
  const linkEl = card.querySelector(".modal-link-src");

  const modalImg = document.getElementById("modal-img");
  const modalTag = document.getElementById("modal-tag");
  const modalDate = document.getElementById("modal-date");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const modalLink = document.getElementById("modal-link");

  // Copy background image
  const bgImage = window
    .getComputedStyle(imgEl)
    .getPropertyValue("background-image");
  modalImg.style.backgroundImage = bgImage;

  // Copy text
  modalTag.textContent = tagEl.textContent;
  modalTag.style.backgroundColor = window
    .getComputedStyle(tagEl)
    .getPropertyValue("background-color");
  modalDate.textContent = dateEl.textContent;
  modalTitle.textContent = titleEl.textContent;
  modalDesc.textContent = descEl.textContent;
  modalLink.href = linkEl.href;

  // Show modal
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

if (document.getElementById("modal-close")) {
  document.getElementById("modal-close").addEventListener("click", () => {
    document.getElementById("news-modal").classList.remove("active");
    document.body.style.overflow = "";
  });
}

if (document.getElementById("news-modal")) {
  document.getElementById("news-modal").addEventListener("click", (e) => {
    if (e.target.id === "news-modal") {
      document.getElementById("news-modal").classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // --- THEME TOGGLE ---
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeText = document.querySelector(".theme-text");
  const htmlTag = document.documentElement;

  const savedTheme = localStorage.getItem("cdp-theme") || "dark";
  htmlTag.setAttribute("data-theme", savedTheme);
  themeText.textContent = savedTheme === "dark" ? "Modo Claro" : "Modo Escuro";

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = htmlTag.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    htmlTag.setAttribute("data-theme", newTheme);
    localStorage.setItem("cdp-theme", newTheme);
    themeText.textContent = newTheme === "dark" ? "Modo Claro" : "Modo Escuro";
  });

  // --- SCROLL SPY & SMOOTH SCROLL ---
  const mainArea = document.getElementById("main-area");
  const navItems = document.querySelectorAll(".nav-item");
  const sections = Array.from(navItems).map((item) =>
    document.getElementById(item.dataset.target),
  );

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      // e.preventDefault();
      const targetId = item.dataset.target;
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }

      // Fechar mobile menu ao clicar
      if (window.innerWidth <= 768) {
        document
          .getElementById("sidebar-wrapper")
          .classList.remove("mobile-active");
        document.getElementById("mobile-overlay").classList.remove("active");
      }
    });
  });

  // --- PLANTEL PRINCIPAL TABS ---
  const plantelTabs = document.querySelectorAll("#plantel-tabs .plantel-tab");
  const squadGroups = document.querySelectorAll("#plantel .squad-group");
  plantelTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      plantelTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const filter = tab.dataset.filter;
      squadGroups.forEach((group) => {
        if (filter === "all" || group.dataset.position === filter) {
          group.style.display = "block";
          setTimeout(() => {
            group.style.opacity = "1";
            group.style.transform = "translateY(0)";
          }, 50);
        } else {
          group.style.display = "none";
          group.style.opacity = "0";
          group.style.transform = "translateY(10px)";
        }
      });
    });
  });

  // Initialize squad groups display correctly
  squadGroups.forEach((group) => {
    group.style.display = "block";
    group.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    group.style.opacity = "1";
    group.style.transform = "translateY(0)";
  });

  // --- FORMAÇÃO TABS ---
  const formacaoTabs = document.querySelectorAll(".formacao-tab");
  const formacaoContents = document.querySelectorAll(".formacao-content");
  formacaoTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active from all tabs
      formacaoTabs.forEach((t) => t.classList.remove("active"));
      // Add active to clicked tab
      tab.classList.add("active");

      // Hide all content
      formacaoContents.forEach((c) => c.classList.remove("active"));
      // Show target content
      const targetId = tab.dataset.target;
      document.getElementById(targetId).classList.add("active");
    });
  });

  const observerOptions = {
    root: mainArea,
    rootMargin: "0px",
    threshold: 0.3,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    // Find deeply intersecting section to prioritize it
    let intersectingEntry = entries.find((entry) => entry.isIntersecting);
    if (intersectingEntry) {
      const id = intersectingEntry.target.id;
      navItems.forEach((nav) => {
        if (nav.dataset.target === id) {
          // nav.classList.add("active");
        } else {
          // nav.classList.remove("active");
        }
      });
    }
  }, observerOptions);

  sections.forEach((section) => {
    if (section) sectionObserver.observe(section);
  });

  // --- FADE UP ANIMATIONS ---
  const fadeElements = document.querySelectorAll(".fade-up");
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add("visible");

            // Initialize CountUp Se for um card de estatística
            const valEl = entry.target.querySelector(".stat-value");
            if (valEl && valEl.dataset.target && !valEl.dataset.counted) {
              valEl.dataset.counted = "true";
              animateValue(valEl, 0, parseInt(valEl.dataset.target), 2000);
            }
          }, delay);
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  fadeElements.forEach((el) => fadeObserver.observe(el));

  // --- SIDEBAR HOVER EXPAND ---
  const sidebar = document.getElementById("sidebar");

  sidebar.addEventListener("mouseenter", () => {
    if (window.innerWidth > 768) {
      sidebar.classList.remove("collapsed");
    }
  });

  sidebar.addEventListener("mouseleave", () => {
    if (window.innerWidth > 768) {
      sidebar.classList.add("collapsed");
    }
  });

  // --- MOBILE MENU ---
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const sidebarWrapper = document.getElementById("sidebar-wrapper");
  const mobileOverlay = document.getElementById("mobile-overlay");

  const toggleMobileMenu = () => {
    sidebarWrapper.classList.toggle("mobile-active");
    mobileOverlay.classList.toggle("active");
    if (sidebarWrapper.classList.contains("mobile-active")) {
      sidebar.classList.remove("collapsed");
    }
  };

  hamburgerBtn.addEventListener("click", toggleMobileMenu);
  mobileOverlay.addEventListener("click", toggleMobileMenu);

  // --- HERO SLIDESHOW ---
  const slides = document.querySelectorAll(".hero-slide");
  const indicators = document.querySelectorAll(".indicator");
  let currentSlide = 0;

  if (slides.length > 0) {
    const goToSlide = (index) => {
      slides[currentSlide].classList.remove("active");
      indicators[currentSlide].classList.remove("active");
      currentSlide = index;
      slides[currentSlide].classList.add("active");
      indicators[currentSlide].classList.add("active");
    };

    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => goToSlide(index));
    });

    setInterval(() => {
      goToSlide((currentSlide + 1) % slides.length);
    }, 6000);
  }

  // --- COUNTUP LOGIC ---
  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // --- NEWS FILTERS ---
  const filterBtns = document.querySelectorAll(".filter-btn");
  const newsCards = document.querySelectorAll(".news-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      newsCards.forEach((card) => {
        if (filter === "all" || card.dataset.category === filter) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // --- LIGHTBOX ---
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxContent = document.getElementById("lightbox-content");
  let currentLightboxIndex = 0;

  const openLightbox = (index) => {
    currentLightboxIndex = index;
    const srcBg = window.getComputedStyle(
      galleryItems[index].querySelector(".gallery-placeholder"),
    ).backgroundImage;
    lightboxContent.style.backgroundImage = srcBg;
    lightbox.classList.add("active");
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });

  if (document.getElementById("lightbox-close")) {
    document.getElementById("lightbox-close").addEventListener("click", () => {
      lightbox.classList.remove("active");
    });
  }

  if (document.getElementById("lightbox-next")) {
    document.getElementById("lightbox-next").addEventListener("click", () => {
      openLightbox((currentLightboxIndex + 1) % galleryItems.length);
    });
  }

  if (document.getElementById("lightbox-prev")) {
    document.getElementById("lightbox-prev").addEventListener("click", () => {
      openLightbox(
        (currentLightboxIndex - 1 + galleryItems.length) % galleryItems.length,
      );
    });
  }

  // Fechar lightbox no Esc e overlay
  document.addEventListener("keydown", (e) => {
    if (
      lightbox &&
      e.key === "Escape" &&
      lightbox.classList.contains("active")
    ) {
      lightbox.classList.remove("active");
    }
  });

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove("active");
      }
    });
  }

  // --- FORM SUBMIT SIMULATION (Formspree) ---
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      // e.preventDefault();
      // Simula o AJAX submission
      document.querySelector("#contact-form button").textContent =
        "A Enviar...";

      setTimeout(() => {
        form.reset();
        document.querySelector("#contact-form button").textContent =
          "Enviar Mensagem";
        document.getElementById("form-success").style.display = "block";
        setTimeout(() => {
          document.getElementById("form-success").style.display = "none";
        }, 5000);
      }, 1500);
    });
  }

  // --- POPUP LÓGICA ---
  if (!localStorage.getItem("popupCDPClose")) {
    setTimeout(() => {
      if (document.getElementById("popup")) {
        document.getElementById("popup").classList.add("visible");
      }
    }, 2000);
  }

  if (document.getElementById("popup-close")) {
    document.getElementById("popup-close").addEventListener("click", () => {
      document.getElementById("popup").classList.remove("visible");
      localStorage.setItem("popupCDPClose", "true");
    });
  }

  // Popula Estatisticas do plantel
});
