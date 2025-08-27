const slide = gsap.timeline({ repeat: -1 });

slide.set("#icecuberight, #icecubeleft, #lime", {
    y: -350,
})
    .set("#stick", {
        y: -400,
    })
    .set(".stars", {
        scale: 0,
        transformOrigin: "center center",
    })
    .set("#sosogu", {
        drawSVG: "0% 0%",
    })
    .set(".bubs", {
        opacity: 0,
        y: 20
    })
    .from("#cocktail", {
        x: -700,
        ease: "back.out( 1.003)",
        duration: 1
    }).
    to("#sosogu", {
        drawSVG: "0% 100%",
        duration: 0.4
    }).
    to("#drink", {
        x: -610,
        y: -120,
        duration: 3,
        ease: "power4.out"
    })
    .to("#sosogu", {
        drawSVG: "100% 100%",
        duration: 0.4
    }, "-=1.5")
    .to(".bubs", {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: {
            each: 0.2
        }
    }, "-=2")
    .to("#icecubeleft", {
        y: -6,
        ease: "elastic.out( 0.2, 0.3)",
        duration: 1.5
    }, "stuffs")
    .to("#icecuberight", {
        y: 0,
        ease: "elastic.out( 0.4, 0.3)",
        duration: 2
    }, "stuffs+=0.2")
    .to("#stick", {
        y: 0,
        ease: "elastic.out( 0.1, 0.3)",
        duration: 2
    }, "stuffs")
    .to("#lime", {
        y: 0,
        ease: "power4.out",
        duration: 1
    }, "stuffs+=0.6")
    .fromTo(".stars", {
        scale: 1,
        rotation: 360,
        stagger: {
            each: 0.3
        }
    },
        {
            scale: 0,
            rotation: 520,
            duration: 2,
            stagger: {
                each: 0.3
            }
        }, "-=0.5")
    .to("#cocktail", {
        x: 700,
        ease: "back.in( 1.003)",
        duration: 1
    }, "<+0.5")
    ;

const vaso = document.getElementById("vasoBartender");
const vaso2 = document.getElementById("vasoBartender2");

const pathDefault = [
    [15, 0, 0, 0],
    [56, -48, 52, -8],
    [60, -48, 52, -8],
    [110, 0, 104, 0]
];

const pathAlt = [
    [200, 0, 0, 0, "vw", "px"],
    [473, -48, 531, -6, "vw", "px"],
    [493, -48, 531, -6, "vw", "px"],
    [1046, 0, 1146, 0, "vw", "px"],
];

// 🔹 Adaptado a mismo formato que pathDefault/Alt
const path2Default = [
    [0, 0, 0, 0],
    [216, 0, 0, 0],
    [278, 50, 58, 8],
    [288, 50, 58, 8],
    [326, 0, 115, -8],
    [336, 0, 115, -8],
    [416, 50, 190, 0],
];

const path2Alt = [
    [0, 0, 0, 0, "vw", "px"],
    [2330, 0, 0, 0, "vw", "px"],
    [2951, 50, 650, 8, "vw", "px"],
    [2971, 50, 650, 8, "vw", "px"],
    [3360, 0, 1250, -8, "vw", "px"],
    [3420, 0, 1250, -8, "vw", "px"],
    [4000, 50, 2100, 0, "vw", "px"], 
];
const OFFSET = window.innerHeight - 80; // 100vh - 80px

function interpolate(path, scroll, isDefault) {
    const vwUnit = window.innerWidth / 100;

    for (let i = 0; i < path.length - 1; i++) {
        let [s1, x1, y1, r1, xUnit1 = "vw", yUnit1 = "vw"] = path[i];
        let [s2, x2, y2, r2, xUnit2 = "vw", yUnit2 = "vw"] = path[i + 1];

        // 🚩 ahora el scroll base incluye OFFSET
        const p1 = OFFSET + (isDefault ? s1 * vwUnit : s1);
        const p2 = OFFSET + (isDefault ? s2 * vwUnit : s2);

        if (scroll >= p1 && scroll <= p2) {
            const progress = (scroll - p1) / (p2 - p1);
            const rotation = r1 + (r2 - r1) * progress;

            // X
            let x, xUnit;
            if (xUnit1 === xUnit2) {
                x = x1 + (x2 - x1) * progress;
                xUnit = xUnit1;
            } else {
                const xPx1 = xUnit1 === "px" ? x1 : (x1 * window.innerWidth) / 100;
                const xPx2 = xUnit2 === "px" ? x2 : (x2 * window.innerWidth) / 100;
                x = xPx1 + (xPx2 - xPx1) * progress;
                xUnit = "px";
            }

            // Y
            let y, yUnit;
            if (yUnit1 === yUnit2) {
                y = y1 + (y2 - y1) * progress;
                yUnit = yUnit1;
            } else {
                const yPx1 = yUnit1 === "px" ? y1 : (y1 * window.innerWidth) / 100;
                const yPx2 = yUnit2 === "px" ? y2 : (y2 * window.innerWidth) / 100;
                y = yPx1 + (yPx2 - yPx1) * progress;
                yUnit = "px";
            }

            return { x, xUnit, y, yUnit, rotation };
        }
    }

    const [s0, x0, y0, r0, xUnit0 = "vw", yUnit0 = "vw"] = path[0];
    return { x: x0, xUnit: xUnit0, y: y0, yUnit: yUnit0, rotation: r0 };
}

function updatePosition() {
    const scrollY = window.scrollY;
    console.log(scrollY)
    const activePath = window.innerWidth >= 751 && window.innerWidth <= 1120 ? pathAlt : pathDefault;
    const activePath2 = window.innerWidth >= 751 && window.innerWidth <= 1120 ? path2Alt : path2Default;

    const { x, xUnit, y, yUnit, rotation } = interpolate(activePath, scrollY, activePath === pathDefault); 
    if (x != 0 || y != 0 || rotation != 0)
        vaso.style.transform = `translate(${x}${xUnit}, ${y}${yUnit}) rotate(${rotation}deg)`;

    const { x: x2, xUnit: xUnit2, y: y2, yUnit: yUnit2, rotation: rotation2 } = interpolate(
        activePath2,
        scrollY,
        activePath2 === path2Default
    );
    if (x2 != 0 || y2 != 0 || rotation2 != 0)
        vaso2.style.transform = `translate(${x2}${xUnit2}, ${y2}${yUnit2}) rotate(${rotation2}deg)`;
}

window.addEventListener("scroll", updatePosition);
window.addEventListener("resize", updatePosition);

 



document.addEventListener("DOMContentLoaded", function () {
    const options = {
        threshold: 0.25,
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                if (entry.target.classList.contains("fondoBannerTranslate")) {
                    entry.target.classList.remove("fondoBannerTranslate");
                }
                observer.unobserve(entry.target);
            }
        });
    }, options);
    const elementsToAnimate = document.querySelectorAll(
        ".translateBottom, .translateLeft, .opacity0, .translateRight, .translateTop, .fondoBannerTranslate, .translateLeftReduce"
    );
    elementsToAnimate.forEach((element) => observer.observe(element));
});