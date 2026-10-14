// ================================
// MOBILE MENU
// ================================

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const pageViews = document.querySelectorAll("[data-page]");
const pageLinks = document.querySelectorAll('a[href^="#"]');

const setActivePage = (pageName, updateHistory = false) => {
    const hasPage = Array.from(pageViews).some(view => view.dataset.page === pageName);
    if (!hasPage) return;

    pageViews.forEach(view => {
        const isActive = view.dataset.page === pageName;
        view.hidden = !isActive;

        if (isActive) {
            view.classList.remove("page-view-enter");
            void view.offsetWidth;
            view.classList.add("page-view-enter");
        }
    });

    document.querySelectorAll("#navLinks a").forEach(link => {
        if (link.getAttribute("href") === `#${pageName}`) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    navLinks.classList.remove("active");
    menuBtn.textContent = "☰";
    window.scrollTo({ top: 0, behavior: "instant" });

    if (updateHistory && window.location.hash !== `#${pageName}`) {
        window.history.pushState({ page: pageName }, "", `#${pageName}`);
    }
};

pageLinks.forEach(link => {
    link.addEventListener("click", event => {
        const pageName = link.getAttribute("href").slice(1);
        if (!Array.from(pageViews).some(view => view.dataset.page === pageName)) return;

        event.preventDefault();
        setActivePage(pageName, true);
    });
});

window.addEventListener("popstate", () => {
    setActivePage(window.location.hash.slice(1) || "home");
});

setActivePage(window.location.hash.slice(1) || "home");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    if (navLinks.classList.contains("active")) {
        menuBtn.textContent = "✕";
    } else {
        menuBtn.textContent = "☰";
    }
});


// ================================
// CONTACT FORM
// ================================

const form = document.getElementById("contactForm");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const formData = new FormData(form);
    const subject = `[AXLOS Website Inquiry] ${formData.get("project")}`;
    const message = [
        `Name: ${formData.get("name")}`,
        `Email: ${formData.get("email")}`,
        `Telephone: ${formData.get("phone") || "Not provided"}`,
        `Project type: ${formData.get("project")}`,
        "",
        "Project details:",
        formData.get("message")
    ].join("\n");

    document.getElementById("contactStatus").textContent =
        "Your email app should open with the inquiry ready to send. If it doesn't, email axlos02@gmail.com directly.";
    window.location.href = `mailto:axlos02@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

});


// ================================
// NAVBAR SCROLL EFFECT
// ================================

window.addEventListener("scroll", () => {

    const header = document.querySelector("header");

    if (window.scrollY > 50) {

        header.style.background = "rgba(5,5,5,.92)";

    } else {

        header.style.background = "rgba(5,5,5,.7)";

    }

});


// ================================
// REVEAL ANIMATION
// ================================

const revealItems = document.querySelectorAll(
    ".service-card, .project-card, .why-item, .about-grid > *, .section-header > *, .contact-text, .contact-form"
);

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealItems.forEach(item => item.classList.add("is-visible"));
} else {
    const observer = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }

            });
        },
        {
            threshold: 0.12
        }
    );

    revealItems.forEach((item, index) => {
        item.classList.add("reveal-item");
        item.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);
        observer.observe(item);
    });
}

