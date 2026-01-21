fetch("https://api.geoapify.com/v1/ipinfo?&apiKey=dd54773d52c346fa924b6a7bba36e73c")
  .then(res => res.json())
  .then(result => {
    const countryCode = result?.country?.iso_code?.toUpperCase();

    // 1) Show privacy message ONLY if country is US and URL contains "privacy"
    if (countryCode === "US" && window.location.href.includes("privacy")) {
      const messageElement = document.querySelector(".privacy-message");
      if (messageElement) {
        messageElement.style.display = "block";
      }
    }

    // 2) Update cookie text for US vs others (always runs)
    const cookieText = document.querySelector("#cookie-setting p");
    if (cookieText) {
      cookieText.textContent =
        countryCode === "US" || countryCode === "USA"
          ? "Do Not Sell/Share My Personal Information"
          : "Cookies Settings";
    }
  })
  .catch(error => {
    console.info("Geoapify location lookup failed:", error);
  });
