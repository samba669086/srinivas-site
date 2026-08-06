/**
 * script.js — A. Srinivas Landing Site
 *
 * Responsibilities:
 *   1. Consult / Close button toggle with animated contact panel reveal
 *   2. Service card CTAs — open contact panel and pre-select the service dropdown
 *   3. Headshot gentle parallax on mouse move
 *   4. Stat card float-up animation via IntersectionObserver
 *   5. Formspree AJAX submission with inline status messages
 *   6. Footer year injection
 */

(function () {
  "use strict";

  /* =========================================================================
     UTILITIES
  ========================================================================= */

  /**
   * Wait for next paint so CSS transitions fire after display:block is applied.
   * Two rAF calls are more reliable than one rAF + setTimeout(0).
   */
  function nextFrame(fn) {
    requestAnimationFrame(function () {
      requestAnimationFrame(fn);
    });
  }

  /* =========================================================================
     1 & 2. CONSULT TOGGLE + SERVICE CARD CTAs
     ─ #consult-btn in the hero toggles the panel open/closed
     ─ .svc-cta buttons in the service cards open the panel AND pre-select
       the matching option in the service <select>
  ========================================================================= */
  var consultBtn   = document.getElementById("consult-btn");
  var contactPanel = document.getElementById("contact-panel");
  var serviceSelect = document.getElementById("f-service");

  /** Open the contact panel with a smooth reveal animation */
  function openContactPanel() {
    if (!contactPanel) return;

    consultBtn.setAttribute("aria-expanded", "true");
    consultBtn.textContent = "Close";
    consultBtn.classList.add("is-open");

    contactPanel.removeAttribute("aria-hidden");
    contactPanel.classList.add("is-open");

    nextFrame(function () {
      contactPanel.classList.add("is-animating");
      setTimeout(function () {
        contactPanel.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    });
  }

  /** Close the contact panel */
  function closeContactPanel() {
    if (!contactPanel) return;

    consultBtn.setAttribute("aria-expanded", "false");
    consultBtn.textContent = "Consult";
    consultBtn.classList.remove("is-open");

    contactPanel.classList.remove("is-animating");

    var REVEAL_DURATION = 500; // matches --duration-reveal in CSS
    setTimeout(function () {
      contactPanel.classList.remove("is-open");
      contactPanel.setAttribute("aria-hidden", "true");
    }, REVEAL_DURATION);

    consultBtn.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /** Is the panel currently open? */
  function isPanelOpen() {
    return consultBtn.getAttribute("aria-expanded") === "true";
  }

  /* Hero Consult button */
  if (consultBtn && contactPanel) {
    consultBtn.addEventListener("click", function () {
      isPanelOpen() ? closeContactPanel() : openContactPanel();
    });
  }

  /* Service card CTAs — open panel and pre-select matching service */
  var svcCtaBtns = document.querySelectorAll(".svc-cta");

  svcCtaBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var serviceValue = btn.getAttribute("data-service");

      // Pre-select the matching option in the dropdown
      if (serviceSelect && serviceValue) {
        for (var i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value === serviceValue) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }

      // Open the panel if it isn't already
      if (!isPanelOpen()) {
        openContactPanel();
      } else {
        // Already open — just scroll to it and highlight the select
        contactPanel.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      // Brief visual pulse on the select to draw attention to the pre-fill
      if (serviceSelect) {
        serviceSelect.classList.add("field-highlight");
        setTimeout(function () {
          serviceSelect.classList.remove("field-highlight");
        }, 1200);
      }
    });
  });

  /* =========================================================================
     3. HEADSHOT PARALLAX
     Subtle depth: image shifts gently opposite to cursor movement.
  ========================================================================= */
  var headshot = document.getElementById("headshot");

  if (headshot) {
    var PARALLAX_STRENGTH = 8; // max px offset
    var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!prefersReduced.matches) {
      document.addEventListener("mousemove", function (e) {
        var cx = (e.clientX / window.innerWidth  - 0.5) * 2;
        var cy = (e.clientY / window.innerHeight - 0.5) * 2;
        headshot.style.transform =
          "translate(" + (-cx * PARALLAX_STRENGTH) + "px, " + (-cy * PARALLAX_STRENGTH) + "px)";
      });

      document.addEventListener("mouseleave", function () {
        headshot.style.transform = "translate(0, 0)";
      });
    }
  }

  /* =========================================================================
     4. STAT CARDS — FLOAT-UP ON SCROLL
     IntersectionObserver with fallback for older browsers.
  ========================================================================= */
  var statCards = document.querySelectorAll(".stat-card");

  if ("IntersectionObserver" in window && statCards.length) {
    var cardObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    statCards.forEach(function (card) { cardObserver.observe(card); });
  } else {
    statCards.forEach(function (card) { card.classList.add("is-visible"); });
  }

  /* =========================================================================
     5. FORMSPREE AJAX SUBMISSION
     No page reload; inline success / error messages.
  ========================================================================= */
  var form        = document.getElementById("contact-form");
  var formSuccess = document.getElementById("form-success");
  var formError   = document.getElementById("form-error");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      formSuccess.hidden = true;
      formError.hidden   = true;

      var submitBtn     = form.querySelector('[type="submit"]');
      var originalLabel = submitBtn.textContent;
      submitBtn.disabled    = true;
      submitBtn.textContent = "Sending…";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            formSuccess.hidden = false;
            formSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
          } else {
            return response.json().then(function (json) {
              throw new Error(
                json.errors
                  ? json.errors.map(function (e) { return e.message; }).join(", ")
                  : "Server error"
              );
            });
          }
        })
        .catch(function (err) {
          console.error("Form submission error:", err);
          formError.hidden = false;
          formError.scrollIntoView({ behavior: "smooth", block: "nearest" });
        })
        .finally(function () {
          submitBtn.disabled    = false;
          submitBtn.textContent = originalLabel;
        });
    });
  }

  /* =========================================================================
     6. FOOTER YEAR
  ========================================================================= */
  var yearEl = document.getElementById("year");
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

})();
