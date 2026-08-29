/**
 * 涟漪点击效果
 */
(function() {
    'use strict';

    var RIPPLE_COLORS = [{
        border: 'rgba(255, 255, 255, 0.7)',
        glow: 'rgba(168, 85, 247, 0.25)'
    }, {
        border: 'rgba(180, 210, 255, 0.65)',
        glow: 'rgba(59, 130, 246, 0.25)'
    }, {
        border: 'rgba(200, 255, 210, 0.65)',
        glow: 'rgba(34, 197, 94, 0.25)'
    }, {
        border: 'rgba(255, 220, 180, 0.65)',
        glow: 'rgba(249, 115, 22, 0.25)'
    }, {
        border: 'rgba(255, 180, 210, 0.65)',
        glow: 'rgba(236, 72, 153, 0.25)'
    }, {
        border: 'rgba(180, 180, 255, 0.65)',
        glow: 'rgba(139, 92, 246, 0.25)'
    }, {
        border: 'rgba(255, 255, 180, 0.65)',
        glow: 'rgba(234, 179, 8, 0.25)'
    }];

    var RING_COUNT = 3;
    var BASE_SIZE = 60;
    var ANIMATION_DURATION = 600;

    function randomColor() {
        return RIPPLE_COLORS[Math.floor(Math.random() * RIPPLE_COLORS.length)];
    }

    function createRippleRings(x, y) {
        var color = randomColor();

        for (var i = 0; i < RING_COUNT; i++) {
            (function(index) {
                setTimeout(function() {
                    var ring = document.createElement('div');
                    ring.className = 'ripple-ring';

                    var size = BASE_SIZE + index * 35;
                    ring.style.width = size + 'px';
                    ring.style.height = size + 'px';
                    ring.style.left = x + 'px';
                    ring.style.top = y + 'px';
                    ring.style.borderColor = color.border;
                    ring.style.boxShadow = '0 0 20px ' + color.glow + ', inset 0 0 15px ' + color.glow;

                    document.body.appendChild(ring);

                    setTimeout(function() {
                        if (ring.parentNode) {
                            ring.remove();
                        }
                    }, ANIMATION_DURATION);
                }, index * 100);
            })(i);
        }
    }

    var isTouch = false;

    document.addEventListener('touchstart', function(e) {
        isTouch = true;
        var touch = e.touches[0];
        createRippleRings(touch.clientX, touch.clientY);
    }, {
        passive: true
    });

    document.addEventListener('click', function(e) {
        if (isTouch) {
            isTouch = false;
            return;
        }
        createRippleRings(e.clientX, e.clientY);
    });

})();