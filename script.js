const jokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "I told my boss I needed a raise because three companies were after me. He asked which ones. I said: the electric company, the gas company, and the water company.",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "I asked my dog what two minus two is. He said nothing.",
  "Why do cows wear bells? Because their horns don't work!",
  "I told my wife she was drawing her eyebrows too high. She looked surprised.",
  "What do you call a fish without eyes? A fsh.",
  "Why can't you give Elsa a balloon? Because she'll let it go!",
  "I used to hate facial hair, but then it grew on me.",
  "What did the ocean say to the beach? Nothing, it just waved.",
  "Why did the bicycle fall over? Because it was two-tired!",
  "I'm reading a book about anti-gravity. It's impossible to put down.",
  "Did you hear about the guy who invented Lifesavers? He made a mint.",
  "Why did the math book look so sad? Because it had too many problems.",
  "What do you call cheese that isn't yours? Nacho cheese!"
];

let lastIndex = -1;

function newJoke() {
  let idx;
  do { idx = Math.floor(Math.random() * jokes.length); } while (idx === lastIndex);
  lastIndex = idx;
  const el = document.getElementById('joke');
  el.style.opacity = 0;
  setTimeout(() => {
    el.textContent = jokes[idx];
    el.style.transition = 'opacity 0.4s';
    el.style.opacity = 1;
  }, 200);
}

newJoke();

// Confetti
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const COLORS = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6bdb','#fff','#f9c74f'];
const pieces = Array.from({ length: 120 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height - canvas.height,
  r: Math.random() * 7 + 3,
  d: Math.random() * 80 + 20,
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
  tilt: Math.random() * 10 - 10,
  tiltAngle: 0,
  tiltSpeed: Math.random() * 0.1 + 0.05,
  speed: Math.random() * 2 + 1,
}));

function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach(p => {
    p.tiltAngle += p.tiltSpeed;
    p.y += p.speed;
    p.tilt = Math.sin(p.tiltAngle) * 15;
    if (p.y > canvas.height) {
      p.y = -10;
      p.x = Math.random() * canvas.width;
    }
    ctx.beginPath();
    ctx.lineWidth = p.r;
    ctx.strokeStyle = p.color;
    ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
    ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
    ctx.stroke();
  });
  requestAnimationFrame(drawConfetti);
}

drawConfetti();
