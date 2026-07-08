const OWNER = { name: 'Pierre-Louis Cazeneuve', email: 'cazelag40380@gmail.com' };

const PRESTATION_LABELS = {
  elagage: 'Élagage',
  debardage: 'Débardage forestier',
  travaux: 'Travaux forestiers',
  agricole: 'Travaux agricoles',
  autre: 'Autre',
};

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const send = (payload) =>
  fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'Cazelag <noreply@cazelag.fr>', ...payload }),
  });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { nom, prenom, telephone, email, prestation, commune, message, _gotcha } = req.body || {};

  if (_gotcha) {
    return res.status(200).json({ success: true });
  }
  if (!nom || !prenom || !telephone || !prestation || !message) {
    return res.status(400).json({ success: false, message: 'Champs requis manquants.' });
  }

  const prestationLabel = PRESTATION_LABELS[prestation] || prestation;
  const date = new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });

  const notificationHtml = `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 12px; overflow: hidden;">
  <div style="background: linear-gradient(135deg, #2d5016, #4a7c23); padding: 24px 32px;">
    <h1 style="color: #fff; margin: 0; font-size: 20px;">🌿 Nouvelle demande de devis</h1>
    <p style="color: rgba(255,255,255,.8); margin: 6px 0 0; font-size: 14px;">Reçue via cazelag.fr le ${esc(date)}</p>
  </div>
  <div style="padding: 28px 32px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d; font-size: 13px; font-weight: 600; width: 130px;">Nom complet</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-size: 14px;">${esc(prenom)} ${esc(nom)}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d; font-size: 13px; font-weight: 600;">Téléphone</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-size: 14px;"><a href="tel:${esc(telephone)}" style="color: #2d5016; text-decoration: none;">${esc(telephone)}</a></td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d; font-size: 13px; font-weight: 600;">Email</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-size: 14px;">${esc(email) || 'Non fourni'}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d; font-size: 13px; font-weight: 600;">Prestation</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-size: 14px;"><span style="background: #e8f5e9; color: #2d5016; padding: 3px 10px; border-radius: 12px; font-size: 13px;">${esc(prestationLabel)}</span></td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d; font-size: 13px; font-weight: 600;">Commune</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-size: 14px;">${esc(commune) || 'Non précisée'}</td>
      </tr>
    </table>
    <div style="margin-top: 20px; background: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 16px;">
      <p style="margin: 0 0 8px; font-size: 13px; color: #6c757d; font-weight: 600;">Message :</p>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${esc(message)}</p>
    </div>
  </div>
</div>`;

  const confirmationHtml = `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 12px; overflow: hidden;">
  <div style="background: linear-gradient(135deg, #2d5016, #4a7c23); padding: 28px 32px; text-align: center;">
    <h1 style="color: #fff; margin: 0; font-size: 22px;">Merci pour votre demande !</h1>
    <p style="color: rgba(255,255,255,.8); margin: 8px 0 0; font-size: 14px;">Cazelag — Élagueur Grimpeur Arboriste</p>
  </div>
  <div style="padding: 28px 32px;">
    <p style="font-size: 15px; color: #333; line-height: 1.6;">Bonjour <strong>${esc(prenom)}</strong>,</p>
    <p style="font-size: 14px; color: #555; line-height: 1.6;">Nous avons bien reçu votre demande de devis et nous vous en remercions. Notre équipe l'étudiera avec attention et vous recontactera dans les plus brefs délais.</p>
    <p style="font-size: 14px; color: #555; line-height: 1.6;">En attendant, n'hésitez pas à nous contacter directement :</p>
    <p style="font-size: 14px; color: #333;">
      📞 <a href="tel:+33637767017" style="color: #2d5016; text-decoration: none; font-weight: 600;">06 37 76 70 17</a><br>
      📧 <a href="mailto:cazelag40380@gmail.com" style="color: #2d5016; text-decoration: none;">cazelag40380@gmail.com</a>
    </p>
    <hr style="border: none; border-top: 1px solid #e9ecef; margin: 24px 0;">
    <p style="font-size: 13px; color: #999; line-height: 1.5;">
      Cordialement,<br>
      <strong style="color: #333;">Pierre-Louis Cazeneuve</strong><br>
      Cazelag — Élagueur Grimpeur Arboriste<br>
      <a href="https://www.cazelag.fr" style="color: #2d5016;">www.cazelag.fr</a>
    </p>
  </div>
</div>`;

  try {
    const r = await send({
      to: [OWNER.email],
      reply_to: email || undefined,
      subject: `🌿 Nouveau devis — ${prenom} ${nom} (${prestationLabel})`,
      html: notificationHtml,
    });

    if (!r.ok) {
      const err = await r.json();
      return res.status(500).json({ success: false, message: err.message || 'Erreur Resend' });
    }

    if (email) {
      send({
        to: [email],
        reply_to: OWNER.email,
        subject: 'Confirmation de votre demande de devis — Cazelag',
        html: confirmationHtml,
      }).catch(() => {});
    }

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}
