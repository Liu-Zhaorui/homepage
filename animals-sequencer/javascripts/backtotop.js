const backtotop = document.getElementsByClassName("backtotop")[0];

if (backtotop) {
    let ticking = false;

    const toggleBackToTop = () => {
        const scrollDis = document.body.scrollTop || document.documentElement.scrollTop;
        backtotop.style.display = scrollDis > 1 ? "block" : "none";
    };

    window.addEventListener("scroll", () => {
        if (ticking) {
            return;
        }
        ticking = true;
        window.requestAnimationFrame(() => {
            toggleBackToTop();
            ticking = false;
        });
    }, { passive: true });

    toggleBackToTop();

    backtotop.addEventListener("click", () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });
}