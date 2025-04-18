let currentScene = 0;
const totalScenes = 2;
let isAnimating = false;

const texts = [document.getElementById('text0'), document.getElementById('text1')];
const hints = [document.getElementById('hint0'), document.getElementById('hint1')];
const images = [document.getElementById('img0'), document.getElementById('img1')];
const vignette = document.querySelector(".vignette");

function showScene(newIndex) {
  if (newIndex < 0 || newIndex >= totalScenes || newIndex === currentScene || isAnimating) return;
  isAnimating = true;

  gsap.to(vignette, {
    duration: 0.3,
    opacity: 0.6,
    ease: "power1.inOut",
    yoyo: true,
    repeat: 1
  });

  texts[currentScene].style.opacity = 0;
  hints[currentScene].style.opacity = 0;

  const oldImg = images[currentScene];
  const newImg = images[newIndex];

  gsap.to(oldImg, {
    duration: 1,
    x: -window.innerWidth * 0.2,
    scale: 0.95,
    opacity: 0,
    ease: "power2.out",
    onComplete: function () {
      oldImg.classList.add('hidden');
      gsap.set(oldImg, { x: 0, scale: 1, opacity: 1 });
    }
  });

  newImg.classList.remove('hidden');
  gsap.set(newImg, {
    x: window.innerWidth * 0.2,
    scale: 0.95,
    opacity: 0
  });

  gsap.to(newImg, {
    duration: 1,
    x: 0,
    scale: 1,
    opacity: 1,
    ease: "power2.out"
  });

  setTimeout(function () {
    texts[newIndex].style.opacity = 1;
    hints[newIndex].style.opacity = 1;
    currentScene = newIndex;
    isAnimating = false;
  }, 600);
}

window.addEventListener("wheel", function (e) {
  if (isAnimating) return;
  if (e.deltaY > 0 && currentScene < totalScenes - 1) {
    showScene(currentScene + 1);
  } else if (e.deltaY < 0 && currentScene > 0) {
    showScene(currentScene - 1);
  }
});

const canvas = document.getElementById("dustCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
const numParticles = 80;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.3 + 0.1
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,' + p.opacity + ')';
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
  }
  requestAnimationFrame(drawParticles);
}

window.addEventListener("resize", function () {
  resizeCanvas();
  createParticles();
});

resizeCanvas();
createParticles();
drawParticles();