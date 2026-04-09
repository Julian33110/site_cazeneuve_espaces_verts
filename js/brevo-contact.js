/**
 * Formulaire de contact — Envoi sécurisé via proxy PHP
 */
const PROXY_URL = '/api/brevo-proxy.php';

function validateForm(formData) {
  const errors = [];
  const nom = (formData.get('nom') || '').trim();
  const prenom = (formData.get('prenom') || '').trim();
  const telephone = (formData.get('telephone') || '').trim();
  const prestation = (formData.get('prestation') || '').trim();
  const message = (formData.get('message') || '').trim();
  const email = (formData.get('email') || '').trim();

  if (!nom) errors.push('Le nom est obligatoire.');
  if (!prenom) errors.push('Le prénom est obligatoire.');
  if (!telephone) errors.push('Le téléphone est obligatoire.');
  if (!prestation) errors.push('Veuillez choisir une prestation.');
  if (!message) errors.push('Le message est obligatoire.');

  return errors;
}

async function sendToProxy(formData) {
  const data = {
    nom: formData.get('nom'),
    prenom: formData.get('prenom'),
    telephone: formData.get('telephone'),
    email: formData.get('email') || '',
    prestation: formData.get('prestation'),
    commune: formData.get('commune') || '',
    message: formData.get('message'),
    _gotcha: formData.get('_gotcha') || '',
  };

  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Erreur serveur');
  return result;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  const errorMsg = document.getElementById('form-error');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.querySelector('[name="_gotcha"]')?.value) return;

    const btn = form.querySelector('[type="submit"]');
    const formData = new FormData(form);

    const errors = validateForm(formData);
    if (errors.length > 0) {
      errorMsg.textContent = errors[0];
      errorMsg.style.display = 'block';
      successMsg.style.display = 'none';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Envoi en cours...';
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    try {
      await sendToProxy(formData);
      successMsg.textContent = '✓ Votre message a bien été envoyé !';
      successMsg.style.display = 'block';
      form.reset();
    } catch (err) {
      console.error(err);
      errorMsg.textContent = "Une erreur est survenue lors de l'envoi. Veuillez réessayer ou nous appeler directement.";
      errorMsg.style.display = 'block';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Envoyer ma demande';
    }
  });
});
