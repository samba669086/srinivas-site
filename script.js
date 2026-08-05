/**
 * script.js — A. Srinivas Landing Site
 *
 * Responsibilities:
 *   1. Consult / Close button toggle with animated contact panel reveal
 *   2. Headshot gentle parallax on mouse move
 *   3. Stat card float-up animation via IntersectionObserver
 *   4. Formspree AJAX submission with inline status messages
 *   5. Footer year injection
 */

(function () {
  "use strict";

  /* =========================================================================
     UTILITIES
  ========================================================================= */

  /**
   * Wait for next paint so CSS transitions fire after display: block is set.
   * Using two rAF calls is more reliable than a single rAF + setTimeout.
   */
  function nextFrame(fn) {
    requestAnimationFrame(function () {
      requestAnimationFrame(fn);
    });
  }

  /* =========================================================================
     1. CONSULT TOGGLE
  ========================================================================= */
  var consultBtn   = document.getElementById("consult-btn");
  var contactPanel = document.getElementById("contact-panel");

  if (consultBtn && contactPanel) {

    consultBtn.addEventListener("click", function () {
      var isOpen = consultBtn.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeContactPanel();
      } else {
        openContactPanel();
      }
    });

    /** Open the contact panel with a smooth reveal animation */
    function openContactPanel() {
      // Update ARIA + button state
      consultBtn.setAttribute("aria-expanded", "true");
      consultBtn.textContent = "Close";
      consultBtn.classList.add("is-open");

      // Show the panel element (display: block) before animating
      contactPanel.removeAttribute("aria-hidden");
      contactPanel.classList.add("is-open");

      // Trigger the CSS transition on the next paint
      nextFrame(function () {
        contactPanel.classList.add("is-animating");

        // Scroll into view after transition starts
        setTimeout(function () {
          contactPanel.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      });
    }

    /** Close the contact panel, waiting for the fade-out before hiding */
    function closeContactPanel() {
      // Update ARIA + button state
      consultBtn.setAttribute("aria-expanded", "false");
      consultBtn.textContent = "Consult";
      consultBtn.classList.remove("is-open");

      // Remove animating class — triggers CSS fade/slide out via opacity
      contactPanel.classList.remove("is-animating");

      // After transition finishes, hide the panel from layout and AT
      var REVEAL_DURATION = 500; // matches --duration-reveal in CSS
      setTimeout(function () {
        contactPanel.classList.remove("is-open");
        contactPanel.setAttribute("aria-hidden", "true");
      }, REVEAL_DURATION);

      // Scroll back up to the hero CTAs smoothly
      consultBtn.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  /* =========================================================================
     2. HEADSHOT PARALLAX
     Subtle depth effect: image shifts slightly opposite to cursor movement.
  ========================================================================= */
  var headshot     = document.getElementById("headshot");
  var photoRing    = headshot && headshot.closest(".hero-photo-ring");
  var PARALLAX_STRENGTH = 8; // max pixel offset

  if (headshot && photoRing) {

    document.addEventListener("mousemove", function (e) {
      // Normalise cursor position to [-1, 1] range
      var cx = (e.clientX / window.innerWidth  - 0.5) * 2;
      var cy = (e.clientY / window.innerHeight - 0.5) * 2;

      var dx = -cx * PARALLAX_STRENGTH;
      var dy = -cy * PARALLAX_STRENGTH;

      headshot.style.transform = "translate(" + dx + "px, " + dy + "px)";
    });

    // Reset when cursor leaves the window
    document.addEventListener("mouseleave", function () {
      headshot.style.transform = "translate(0, 0)";
    });

    // Respect reduced-motion preference
    var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReduced.matches) {
      document.removeEventListener("mousemove", arguments.callee);
    }
  }

  /* =========================================================================
     3. STAT CARDS — FLOAT-UP ON SCROLL
     Uses IntersectionObserver for performance; falls back to instant show.
  ========================================================================= */
  var statCards = document.querySelectorAll(".stat-card");

  if ("IntersectionObserver" in window && statCards.length) {

    var cardObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // animate once only
          }
        });
      },
      {
        threshold: 0.15,       // trigger when 15% of card is visible
        rootMargin: "0px 0px -40px 0px",
      }
    );

    statCards.forEach(function (card) {
      cardObserver.observe(card);
    });

  } else {
    // Fallback — show immediately
    statCards.forEach(function (card) {
      card.classList.add("is-visible");
    });
  }

  /* =========================================================================
     4. FORMSPREE AJAX SUBMISSION
     Handles submission without a page reload; shows inline status messages.
  ========================================================================= */
  var form           = document.getElementById("contact-form");
  var formSuccess    = document.getElementById("form-success");
  var formError      = document.getElementById("form-error");

  if (form) {

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Hide any previous status messages
      formSuccess.hidden = true;
      formError.hidden   = true;

      var submitBtn  = form.querySelector('[type="submit"]');
      var originalLabel = submitBtn.textContent;

      // Disable button during submission
      submitBtn.disabled    = true;
      submitBtn.textContent = "Sending…";

      var data = new FormData(form);

      fetch(form.action, {
        method:  "POST",
        body:    data,
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            formSuccess.hidden = false;
            // Scroll success message into view
            formSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
          } else {
            return response.json().then(function (json) {
              throw new Error(json.errors ? json.errors.map(function(e){ return e.message; }).join(", ") : "Server error");
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
     5. FOOTER YEAR
  ========================================================================= */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
