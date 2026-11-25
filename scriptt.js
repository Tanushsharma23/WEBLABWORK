
// ==================================
// GCET JAMMU WEBSITE - JAVASCRIPT
// ==================================

document.addEventListener("DOMContentLoaded", function () {

    // 1. Automatically update footer year
    const footer = document.querySelector("footer p");

    if (footer) {
        footer.innerHTML =
            `&copy; ${new Date().getFullYear()} GCET Jammu. All Rights Reserved.`;
    }


    // 2. Highlight active navigation link
    const currentPage = window.location.pathname
        .split("/")
        .pop() || "home.html";

    document.querySelectorAll("nav a").forEach(function (link) {

        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.style.backgroundColor = "#f1c40f";
            link.style.color = "#000";
            link.style.borderRadius = "5px";
        }

    });


    // 3. Mobile navigation menu
    const nav = document.querySelector("nav");

    if (nav) {

        const menuButton = document.createElement("button");

        menuButton.textContent = "☰ Menu";
        menuButton.style.padding = "10px";
        menuButton.style.cursor = "pointer";
        menuButton.style.backgroundColor = "#003366";
        menuButton.style.color = "white";
        menuButton.style.border = "none";
        menuButton.style.margin = "10px";

        nav.parentNode.insertBefore(menuButton, nav);

        nav.style.transition = "0.3s";

        menuButton.addEventListener("click", function () {

            if (nav.style.display === "none") {
                nav.style.display = "flex";
                nav.style.flexDirection = "column";
            } else {
                nav.style.display = "none";
            }

        });

    }


    // 4. Home page welcome message
    const welcomeHeading = document.querySelector(".welcome h2");

    if (welcomeHeading) {
        welcomeHeading.addEventListener("click", function () {
            alert("Welcome to Government College of Engineering and Technology, Jammu!");
        });
    }


    // 5. Gallery image preview
    const galleryImages = document.querySelectorAll(".gallery-grid .photo img");

    galleryImages.forEach(function (img) {

        img.style.cursor = "pointer";

        img.addEventListener("click", function () {

            const preview = document.createElement("div");

            preview.style.position = "fixed";
            preview.style.top = "0";
            preview.style.left = "0";
            preview.style.width = "100%";
            preview.style.height = "100%";
            preview.style.backgroundColor = "rgba(0,0,0,0.9)";
            preview.style.display = "flex";
            preview.style.justifyContent = "center";
            preview.style.alignItems = "center";
            preview.style.zIndex = "9999";
            preview.style.cursor = "pointer";

            const largeImage = document.createElement("img");

            largeImage.src = img.src;
            largeImage.style.maxWidth = "90%";
            largeImage.style.maxHeight = "85%";
            largeImage.style.border = "4px solid white";
            largeImage.style.borderRadius = "10px";

            preview.appendChild(largeImage);
            document.body.appendChild(preview);

            preview.addEventListener("click", function () {
                preview.remove();
            });

        });

    });


    // 6. Student admission form validation
    const admissionForm = document.querySelector("main form");

    if (admissionForm) {

        admissionForm.addEventListener("submit", function (event) {

            const mobile = admissionForm.querySelector('input[type="tel"]');

            const gender = admissionForm.querySelectorAll(
                'input[name="gender"]'
            );

            // Validate mobile number
            if (mobile && !/^[6-9]\d{9}$/.test(mobile.value.trim())) {

                event.preventDefault();

                alert("Please enter a valid 10-digit Indian mobile number.");

                mobile.focus();
                return;
            }

            // Validate gender selection
            if (gender.length > 0 &&
                !Array.from(gender).some(input => input.checked)) {

                event.preventDefault();

                alert("Please select your gender.");
                return;
            }

            // Successful validation
            event.preventDefault();

            alert("Your admission form has been submitted successfully!");

            window.location.href = "thanku.html";

        });

    }

});
