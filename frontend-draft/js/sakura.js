(function() {
    var MAX_PETALS = 25;
    var container = null;
    var petals = [];

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function createPetal() {
        var petal = document.createElement("div");
        petal.classList.add("sakura-petal");

        var size = random(10, 20);
        var startX = random(0, window.innerWidth);
        var duration = random(8, 14);
        var swayRange = random(20, 60);
        var delay = random(0, 2);
        var opacity = random(0.4, 0.75);

        petal.innerHTML =
            '<svg width="' +
            size +
            '" height="' +
            size +
            '" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">' +
            '<ellipse cx="10" cy="10" rx="4" ry="8" fill="rgba(255,200,210,1)" opacity="' +
            opacity +
            '"/>' +
            '<ellipse cx="10" cy="10" rx="8" ry="4" fill="rgba(255,200,210,1)" opacity="' +
            opacity +
            '"/>' +
            '<ellipse cx="10" cy="10" rx="4" ry="8" fill="rgba(255,220,230,1)" opacity="' +
            (opacity * 0.5) +
            '"/>' +
            '<circle cx="10" cy="10" r="1.5" fill="rgba(255,180,190,1)"/>' +
            "</svg>";

        petal.style.left = startX + "px";
        petal.style.width = size + "px";
        petal.style.height = size + "px";
        petal.style.animationName = "sakura-fall-" + Math.floor(swayRange);

        petal.fallDuration = duration;
        petal.swayRange = swayRange;
        petal.startX = startX;
        petal.rotation = random(0, 360);
        petal.rotationSpeed = random(-2, 2);
        petal.opacity = opacity;

        petal.style.opacity = 0;
        petal.style.transition = "opacity 1s ease";

        setTimeout(function() {
            petal.style.opacity = 1;
            petal.style.transition = "none";
        }, 100);

        return petal;
    }

    function addSwayKeyframes() {
        var styleId = "sakura-keyframes";
        if (document.getElementById(styleId)) return;

        var style = document.createElement("style");
        style.id = styleId;
        var ranges = [20, 30, 40, 50, 60];
        var swayCss = "";

        ranges.forEach(function(r) {
            swayCss +=
                "@keyframes sakura-fall-" +
                r +
                " {" +
                "0% { transform: translateX(0) rotate(0deg); }" +
                "25% { transform: translateX(" +
                r +
                "px) rotate(15deg); }" +
                "50% { transform: translateX(0) rotate(0deg); }" +
                "75% { transform: translateX(-" +
                r +
                "px) rotate(-15deg); }" +
                "100% { transform: translateX(0) rotate(0deg); }" +
                "}";
        });

        style.textContent = swayCss;
        document.head.appendChild(style);
    }

    function initSakura() {
        if (container) return;

        container = document.createElement("div");
        container.classList.add("sakura-container");
        document.body.appendChild(container);

        addSwayKeyframes();

        for (var i = 0; i < 12; i++) {
            spawnPetal(true);
        }

        setInterval(spawnPetal, 2000);
    }

    function spawnPetal(randomDelay) {
        if (petals.length >= MAX_PETALS) return;

        var petal = createPetal();
        container.appendChild(petal);

        var fallDuration = petal.fallDuration;
        var startX = petal.startX;
        var swayRange = petal.swayRange;
        var rotation = petal.rotation;
        var rotationSpeed = petal.rotationSpeed;
        var size = parseInt(petal.style.width);
        var delay = randomDelay ? random(0, fallDuration * 0.8) : 0;

        var startTime = null;

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            var elapsed = (timestamp - startTime) / 1000 + delay;
            var progress = elapsed / fallDuration;

            if (progress >= 1) {
                if (petal.parentNode) {
                    petal.style.opacity = 0;
                    setTimeout(function() {
                        if (petal.parentNode) petal.remove();
                    }, 500);
                }
                var idx = petals.indexOf(petal);
                if (idx > -1) petals.splice(idx, 1);
                return;
            }

            var sway = Math.sin(progress * Math.PI * 4) * swayRange;
            var swayX = startX + sway;
            var fallY = -60 + (window.innerHeight + 120) * progress;
            var currentRotation = rotation + rotationSpeed * progress * fallDuration;

            petal.style.left = swayX + "px";
            petal.style.top = fallY + "px";
            petal.style.transform = "rotate(" + currentRotation + "deg)";

            requestAnimationFrame(animate);
        }

        petals.push(petal);
        requestAnimationFrame(animate);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSakura);
    } else {
        initSakura();
    }
})();