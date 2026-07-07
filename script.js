const form = document.getElementById('invitationForm');
const choiceInput = document.getElementById('choiceInput');
const dateInput = document.getElementById('dateInput');
const thankYou = document.getElementById('thankYou');
const buttons = document.querySelectorAll('[data-choice]');

function prettyDate() {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(new Date());
}

async function sendChoice(choice, button) {
  choiceInput.value = choice;
  dateInput.value = prettyDate();

  buttons.forEach(btn => btn.disabled = true);
  const originalText = button.textContent;
  button.textContent = 'Envoi de la réponse...';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error('Erreur Formspree');

    form.hidden = true;
    thankYou.hidden = false;
    makeHearts();
  } catch (error) {
    button.textContent = originalText;
    buttons.forEach(btn => btn.disabled = false);
    alert("La réponse n'a pas pu être envoyée. Tu peux réessayer ou me répondre directement par message.");
  }
}

function makeHearts() {
  for (let i = 0; i < 18; i++) {
    const heart = document.createElement('span');
    heart.textContent = i % 3 === 0 ? '✨' : '❤️';
    heart.style.position = 'fixed';
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.top = '105vh';
    heart.style.fontSize = `${18 + Math.random() * 16}px`;
    heart.style.zIndex = '30';
    heart.style.pointerEvents = 'none';
    heart.style.opacity = '0.85';
    heart.animate([
      { transform: 'translateY(0) rotate(0deg)', opacity: 0.85 },
      { transform: `translateY(-${55 + Math.random() * 45}vh) rotate(${Math.random() * 60 - 30}deg)`, opacity: 0 }
    ], {
      duration: 1800 + Math.random() * 1200,
      easing: 'ease-out',
      fill: 'forwards'
    });
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 3200);
  }
}

buttons.forEach(button => {
  button.addEventListener('click', () => sendChoice(button.dataset.choice, button));
});
