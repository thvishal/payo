document.addEventListener('DOMContentLoaded', function () {
    const currentOrigin = window.location.origin;
  
    // Update all data-url attributes
    document.querySelectorAll('[data-url]').forEach(el => el.setAttribute('data-url', currentOrigin));
  
    // Check if Typed.js is loaded
    if (!window.Typed) {
      const typedScript = document.createElement("script");
      typedScript.src = "https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.10/typed.min.js";
      typedScript.onload = initTypedJs;
      document.body.appendChild(typedScript);
    } else {
      initTypedJs();
    }
  
    function initTypedJs() {
      const target = document.getElementById("py-animation");
  
      if (target && !target.dataset.typedInitialized) {
        target.dataset.typedInitialized = "true"; // Prevent re-initialization
        target.innerHTML = ""; // Clear previous content
  
        new Typed("#py-animation", {
          strings: [
            "<span>Employment</span>",
            "<span>Payroll</span>",
            "<span>Teams</span>",
            "<span>HR</span>",
            "<span>Expansion</span>"
          ],
          typeSpeed: 80,
          backSpeed: 80,
          backDelay: 1200,
          startDelay: 300,
          loop: true,
          showCursor: false,
          cursorChar: "|",
          contentType: 'html',
          preStringTyped: function () {
            target.classList.remove("fade-out"); // Remove fade-out before typing
          },
          onStringTyped: function () {
            setTimeout(() => {
              target.classList.add("fade-out"); // Add fade-out after typing
            }, 800); // Adjust delay if needed
          }
        });
  
        console.log("Typed.js initialized.");
      }
    }
  });
