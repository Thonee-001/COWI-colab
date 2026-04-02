/* ============================================================
   COWI — Child Of Wealth Initiative
   Main JavaScript File (main.js)

   WHAT IS JAVASCRIPT?
   JavaScript makes the webpage interactive. Without it, the page
   just sits there and you can't click or interact with anything.
   
   Think of it like this:
   - HTML  = the skeleton of the page (structure)
   - CSS   = the clothes/skin (appearance)
   - JS    = the muscles/brain (behaviour and interaction)
   
   This file handles:
   1. Sidebar open/close (mobile navigation)
   2. Scroll-reveal animations (sections fade in as you scroll)
   3. Active nav link highlighting (shows which section you're in)
   4. Progress bar counter animation
   5. Contact form submission
   6. Newsletter subscription
   ============================================================ */


/* ============================================================
   STEP 1: SELECT ELEMENTS FROM THE PAGE
   
   document.getElementById('some-id') finds an HTML element
   by its id attribute and lets us control it with JavaScript.
   
   We store them in "const" variables — const means the variable
   can't be reassigned (it always points to the same element).
   ============================================================ */
const scnavbar        = document.getElementById('sc-nav-bar');   // The sliding sidebar navbar
const navbar          = document.getElementById('nav-bar');       // The main top navbar
const backgroundClose = document.getElementById('background-close'); // Dim overlay behind sidebar


/* ============================================================
   2. SIDEBAR OPEN / CLOSE FUNCTIONS

   These three functions are called directly from the HTML
   using onclick="openSidebar()" etc.
   
   classList.add('class-name')    → adds a CSS class to an element
   classList.remove('class-name') → removes a CSS class
   
   By adding/removing classes, we trigger CSS transitions
   (the slide-down animation is defined in tablet.css as .show-nav-bar)
   ============================================================ */

/**
 * openSidebar()
 * Called when the hamburger icon (⋯) is clicked on mobile.
 * Shows the sidebar and hides the main navbar.
 */
function openSidebar() {
  scnavbar.classList.add('show-nav-bar');    // Slides sidebar into view
  navbar.classList.add('hide');              // Hides main navbar
  backgroundClose.classList.add('close-overlay'); // Shows dim overlay
}

/**
 * closeSidebar()
 * Called when the × (close) icon inside the sidebar is clicked.
 * Reverses everything openSidebar() did.
 */
function closeSidebar() {
  scnavbar.classList.remove('show-nav-bar'); // Hides sidebar (slides back up)
  navbar.classList.remove('hide');           // Shows main navbar again
  backgroundClose.classList.remove('close-overlay'); // Removes overlay
}

/**
 * closeSidebarBackground()
 * Called when the user clicks the dim overlay behind the sidebar.
 * Same effect as closeSidebar() — closes everything.
 */
function closeSidebarBackground() {
  backgroundClose.classList.remove('close-overlay');
  scnavbar.classList.remove('show-nav-bar');
  navbar.classList.remove('hide');
}


/* ============================================================
   3. SCROLL-REVEAL ANIMATION
   
   We want sections to fade in from below as the user scrolls
   down to them. This is called a "scroll reveal" effect.
   
   HOW IT WORKS:
   1. We add the class "reveal" to elements we want to animate
      (in CSS, .reveal has opacity: 0 and translateY(30px) — invisible)
   2. We use IntersectionObserver — a browser API that tells us
      when an element enters the visible area (the "viewport")
   3. When it enters view, we add "visible" class → CSS animates it in
   ============================================================ */

/**
 * Sets up the scroll reveal effect.
 * We call this when the page has fully loaded.
 */
function setupScrollReveal() {
  // Select all elements we want to animate
  // querySelectorAll returns a list of ALL matching elements
  const revealEls = document.querySelectorAll(
    '.cause-card, .program-card, .team-card, .story-card, ' +
    '.about-inner, .contact-inner, .section-header, .stat-item'
  );

  // Add the "reveal" class to each element
  // This makes them invisible (opacity: 0) until they scroll into view
  revealEls.forEach(function(el) {
    el.classList.add('reveal');
  });

  // IntersectionObserver watches elements and fires a callback
  // when they enter or leave the visible part of the screen
  const observer = new IntersectionObserver(
    function(entries) {
      // "entries" is a list of all elements being observed
      entries.forEach(function(entry) {
        // entry.isIntersecting = true when the element is visible
        if (entry.isIntersecting) {
          entry.target.classList.add('visible'); // Triggers CSS fade-in
          observer.unobserve(entry.target);      // Stop watching once revealed
        }
      });
    },
    {
      threshold: 0.12,    // Trigger when 12% of the element is visible
      rootMargin: '0px'   // No extra margin
    }
  );

  // Tell the observer to watch each element
  revealEls.forEach(function(el) {
    observer.observe(el);
  });
}


/* ============================================================
   4. ACTIVE NAV LINK HIGHLIGHTING
   
   As the user scrolls, the nav link for the current section
   should be highlighted in ochre colour.
   
   HOW IT WORKS:
   1. We listen for the "scroll" event on the window
   2. We check which section is currently in the viewport
   3. We add "active-link" class to the matching nav link
   
   scrollY = how many pixels the user has scrolled from the top
   offsetTop = how far from the top of the page an element is
   ============================================================ */
function setupActiveNavLinks() {
  // All the sections we want to track
  const sections = document.querySelectorAll('section[id], header[id]');
  
  // All nav links in both navbars
  const navLinks = document.querySelectorAll('#nav-bar a, #sc-nav-bar a');

  // Run this function every time the user scrolls
  window.addEventListener('scroll', function() {
    let currentSection = '';

    // Check each section to see if it's currently visible
    sections.forEach(function(section) {
      // offsetTop = distance from top of page to the section
      // scrollY = how far the user has scrolled
      // If user has scrolled past the section start (with 120px offset),
      // mark it as the current section
      if (window.scrollY >= section.offsetTop - 120) {
        currentSection = section.getAttribute('id'); // e.g. "about", "causes"
      }
    });

    // Update the nav links: add active class to matching link
    navLinks.forEach(function(link) {
      link.classList.remove('active-link'); // Remove from all links first
      // If this link points to the current section, make it active
      if (link.getAttribute('href') === '#' + currentSection ||
          (currentSection === '' && link.getAttribute('href') === '#')) {
        link.classList.add('active-link');
      }
    });
  });
}


/* ============================================================
   5. ANIMATED PROGRESS BAR FILL
   
   The cause cards have progress bars showing fundraising progress.
   When the section scrolls into view, the bars animate from 0%
   to their target width.
   
   This uses the same IntersectionObserver pattern as above.
   ============================================================ */
function setupProgressBars() {
  const fills = document.querySelectorAll('.progress-fill');

  const observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const bar = entry.target;
          // Read the target width from the inline style="width: 72%"
          // We stored it as a data attribute so we can animate from 0
          const targetWidth = bar.style.width;

          // Start from 0, then animate to target
          bar.style.width = '0%';

          // setTimeout delays the animation slightly so the transition plays
          setTimeout(function() {
            bar.style.width = targetWidth;
          }, 200);

          observer.unobserve(bar); // Only animate once
        }
      });
    },
    { threshold: 0.5 }
  );

  fills.forEach(function(fill) {
    observer.observe(fill);
  });
}


/* ============================================================
   6. NAVBAR SCROLL BEHAVIOUR
   
   When the user scrolls down, add a slightly stronger shadow 
   to the navbar so it stands out more from the content.
   ============================================================ */
function setupNavbarScroll() {
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      // User has scrolled down — make navbar background slightly less transparent
      navbar.style.backgroundColor = 'rgba(255,255,255,0.92)';
      navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.15)';
    } else {
      // Back at top — restore the glass effect
      navbar.style.backgroundColor = '';
      navbar.style.boxShadow = '';
    }
  });
}


/* ============================================================
   7. CONTACT FORM SUBMISSION
   
   When the user fills in and submits the contact form,
   we show a simple confirmation message.
   
   In a real project you would send this data to a server
   (using fetch() to an API endpoint), but for now we just
   show a success message.
   ============================================================ */

/**
 * submitForm()
 * Called when the "Send Message" button is clicked.
 * Validates inputs, then shows a success message.
 */
function submitForm() {
  // Get references to the form fields
  const name    = document.getElementById('fname');
  const email   = document.getElementById('femail');
  const subject = document.getElementById('fsubject');
  const message = document.getElementById('fmessage');

  // Basic validation: check that required fields are not empty
  // .trim() removes extra spaces from the start/end of text
  if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
    showAlert('Please fill in all required fields.', 'error');
    return; // "return" stops the function from continuing
  }

  // Check that the email looks valid using a simple regex pattern
  // Regex (regular expression) = a pattern to match text
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value.trim())) {
    showAlert('Please enter a valid email address.', 'error');
    return;
  }

  // If we get here, the form is valid — show success message
  showAlert('Thank you, ' + name.value.trim() + '! Your message has been sent. We\'ll be in touch soon.', 'success');

  // Clear all the form fields after submission
  name.value    = '';
  email.value   = '';
  subject.value = '';
  message.value = '';
}


/* ============================================================
   8. NEWSLETTER SUBSCRIPTION
   
   When the user clicks "Subscribe" in the footer,
   validate their email and show a confirmation.
   ============================================================ */

/**
 * subscribeNewsletter()
 * Called when the "Subscribe" button in the footer is clicked.
 */
function subscribeNewsletter() {
  const emailInput = document.getElementById('newsletter-email');
  const email = emailInput.value.trim();

  if (!email) {
    showAlert('Please enter your email address.', 'error');
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showAlert('Please enter a valid email address.', 'error');
    return;
  }

  showAlert('Thank you for subscribing! Welcome to the COWI family.', 'success');
  emailInput.value = '';
}


/* ============================================================
   9. ALERT / TOAST NOTIFICATION HELPER
   
   A small temporary pop-up message that appears and 
   disappears after a few seconds.
   
   We create HTML elements in JavaScript:
   - document.createElement('div') creates a <div>
   - element.textContent sets the text inside
   - document.body.appendChild(el) adds it to the page
   - setTimeout runs a function after a delay (in milliseconds)
   ============================================================ */

/**
 * showAlert(message, type)
 * @param {string} message - The text to display
 * @param {string} type    - 'success' (green) or 'error' (red)
 */
function showAlert(message, type) {
  // Create a new <div> element
  const alert = document.createElement('div');

  // Set the text inside it
  alert.textContent = message;

  // Apply styles directly via JavaScript
  // (We could also add/remove CSS classes here)
  Object.assign(alert.style, {
    position:        'fixed',
    bottom:          '2rem',
    right:           '2rem',
    padding:         '1rem 1.5rem',
    borderRadius:    '12px',
    background:      type === 'success' ? '#2d7a3a' : '#c0392b',
    color:           '#fff',
    fontFamily:      'Mulish, Arial, sans-serif',
    fontWeight:      '600',
    fontSize:        '0.92em',
    maxWidth:        '340px',
    zIndex:          '9999',
    boxShadow:       '0 6px 24px rgba(0,0,0,0.2)',
    lineHeight:      '1.5',
    // Start invisible and animate in
    opacity:         '0',
    transform:       'translateY(20px)',
    transition:      'opacity 0.4s ease, transform 0.4s ease'
  });

  // Add to the page
  document.body.appendChild(alert);

  // Trigger the animation (needs small delay to allow CSS to register the initial state)
  setTimeout(function() {
    alert.style.opacity   = '1';
    alert.style.transform = 'translateY(0)';
  }, 50);

  // After 4 seconds, fade out and then remove from the page
  setTimeout(function() {
    alert.style.opacity   = '0';
    alert.style.transform = 'translateY(20px)';

    // Remove the element from DOM after fade-out animation finishes (400ms)
    setTimeout(function() {
      if (alert.parentNode) {
        alert.parentNode.removeChild(alert);
      }
    }, 400);
  }, 4000);
}


/* ============================================================
   10. CLOSE SIDEBAR WHEN A LINK IS CLICKED
   
   On mobile, clicking a nav link inside the sidebar should
   close the sidebar automatically (good UX).
   ============================================================ */
function setupSidebarLinkClose() {
  // Get all <a> links inside the sidebar
  const sidebarLinks = document.querySelectorAll('#sc-nav-bar a');

  sidebarLinks.forEach(function(link) {
    // Add a click event listener to each link
    link.addEventListener('click', function() {
      closeSidebar(); // Close sidebar when any link is tapped
    });
  });
}


/* ============================================================
   11. INITIALISE EVERYTHING
   
   We wait for the page to fully load before running our scripts.
   'DOMContentLoaded' fires when all HTML has been parsed.
   
   Think of it like waiting for all the furniture to arrive 
   before you start decorating the room.
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  setupScrollReveal();       // Set up scroll-reveal animations
  setupActiveNavLinks();     // Highlight nav links on scroll
  setupProgressBars();       // Animate progress bars when visible
  setupNavbarScroll();       // Change navbar style on scroll
  setupSidebarLinkClose();   // Close sidebar on link click
});
