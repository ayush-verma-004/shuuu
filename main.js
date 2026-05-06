// Cinematic Experience Logic

document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    initThreeBackground();
    initAnimations();
    initCursor();
    initSecretScene();
});

// 1. Smooth Scrolling (Lenis)
function initLenis() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
}

// 2. Three.js Background (Starfield)
function initThreeBackground() {
    const canvas = document.querySelector('#bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Mouse Movement Effect
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    function animate() {
        requestAnimationFrame(animate);

        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        // Subtle mouse follow
        const targetX = (mouseX - window.innerWidth / 2) * 0.0001;
        const targetY = (mouseY - window.innerHeight / 2) * 0.0001;
        particlesMesh.position.x += (targetX - particlesMesh.position.x) * 0.05;
        particlesMesh.position.y += (targetY - particlesMesh.position.y) * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// 3. GSAP Animations
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Loader Timeline
    const tl = gsap.timeline();

    tl.to(".glow-line", { width: "100%", duration: 1.5, ease: "power2.inOut" })
      .to("#loader-text-1", { opacity: 1, duration: 1, delay: 0.5 })
      .to("#loader-text-1", { opacity: 0, duration: 1, delay: 1.5 })
      .to("#loader-text-2", { opacity: 1, duration: 1 })
      .to("#loader-text-2", { opacity: 0, duration: 1, delay: 1.5 })
      .to("#loader-text-3", { opacity: 1, duration: 1 })
      .to(".glow-line", { opacity: 0, duration: 1 }, "-=1")
      .to("#loader", { y: "-100%", duration: 1.5, ease: "expo.inOut", delay: 1 })
      .from("#hero h1, #hero h2, #enter-btn", { 
          opacity: 0, 
          y: 50, 
          duration: 1.5, 
          stagger: 0.2, 
          ease: "power4.out" 
      }, "-=0.5");

    // Enter Button Camera Zoom Effect
    const enterBtn = document.querySelector('#enter-btn');
    enterBtn.addEventListener('click', () => {
        gsap.to(window, { scrollTo: "#gallery", duration: 2, ease: "power4.inOut" });
        gsap.to("#hero", { scale: 1.2, opacity: 0, duration: 2, ease: "power4.inOut" });
    });

    // Gallery Parallax/Appear
    gsap.utils.toArray(".gallery-item").forEach((item) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 100,
            duration: 1.5,
            ease: "power4.out"
        });
    });

    // Story Text Fade-in-out
    gsap.utils.toArray(".story-text").forEach((text) => {
        gsap.to(text, {
            scrollTrigger: {
                trigger: text,
                start: "top 70%",
                end: "top 30%",
                scrub: true,
            },
            opacity: 1,
            scale: 1.1,
            color: "#fff"
        });
    });

    // Floating Cards Animation
    const cards = gsap.utils.toArray(".float-card");
    cards.forEach((card, i) => {
        // Random starting positions
        gsap.set(card, {
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 200,
        });

        // Floating loop
        gsap.to(card, {
            y: "+=20",
            x: "+=10",
            duration: 2 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.5
        });
    });

    // Ending Fade Ups
    gsap.utils.toArray(".fade-up").forEach((el) => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 90%"
            },
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power4.out"
        });
    });
}

// 4. Custom Cursor
function initCursor() {
    const cursor = document.querySelector('#cursor');
    const cursorBlur = document.querySelector('#cursor-blur');

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(cursorBlur, { x: e.clientX, y: e.clientY, duration: 0.5 });
    });

    // Hover effect on buttons and gallery
    const interactiveElements = document.querySelectorAll('.premium-btn, .gallery-item, #sound-toggle, #secret-trigger');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 4, opacity: 0.5, duration: 0.3 });
            gsap.to(cursorBlur, { scale: 1.5, background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)', duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
            gsap.to(cursorBlur, { scale: 1, background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)', duration: 0.3 });
        });
    });
}

// 5. Secret Scene
function initSecretScene() {
    const trigger = document.querySelector('#secret-trigger');
    const scene = document.querySelector('#secret-scene');
    const closeBtn = document.querySelector('#close-secret');
    const typingElement = document.querySelector('#typing-text');
    const text = "You challenged the developer in me... but you've already captured the person behind the code. This is just my way of saying I'm paying attention.";

    trigger.addEventListener('click', () => {
        scene.classList.add('active');
        typeText();
    });

    closeBtn.addEventListener('click', () => {
        scene.classList.remove('active');
        typingElement.innerHTML = "";
    });

    function typeText() {
        typingElement.innerHTML = "";
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                typingElement.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 100);
    }
}

// 3D Tilt Effect for Gallery (Simple)
document.querySelectorAll('.tilt').forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = item.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        gsap.to(item.querySelector('.glass-frame'), {
            rotationY: x * 20,
            rotationX: -y * 20,
            duration: 0.5,
            ease: "power2.out"
        });
    });

    item.addEventListener('mouseleave', () => {
        gsap.to(item.querySelector('.glass-frame'), {
            rotationY: 0,
            rotationX: 0,
            duration: 0.5,
            ease: "power2.out"
        });
    });
});
