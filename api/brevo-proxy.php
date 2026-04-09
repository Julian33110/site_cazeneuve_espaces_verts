<?php
/**
 * Proxy sécurisé pour l'API Brevo
 */

define('BREVO_API_KEY', getenv('BREVO_API_KEY') ?: '');
define('BREVO_API_URL', 'https://api.brevo.com/v3/smtp/email');

// Le VRAI expéditeur validé sur Brevo (qui donne le droit d'envoyer)
define('SENDER_NAME', 'Site Cazelag');
define('SENDER_EMAIL', 'pierre.40380.api@gmail.com');

// Le destinataire final (Le gérant)
define('OWNER_NAME', 'Pierre-Louis Cazeneuve');
define('OWNER_EMAIL', 'cazelag40380@gmail.com');

$allowed_origins = [
    'https://cazelag.fr',
    'https://www.cazelag.fr',
    'http://localhost',
    'http://127.0.0.1',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$origin_allowed = empty($origin) || in_array($origin, $allowed_origins);

if (!$origin_allowed) {
    http_response_code(403);
    exit(json_encode(['success' => false, 'message' => 'Origine non autorisée.']));
}

if (!empty($origin)) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['success' => false, 'message' => 'Méthode non autorisée.']));
}

$input = json_decode(file_get_contents('php://input'), true);

if (!empty($input['_gotcha'])) {
    http_response_code(200);
    exit(json_encode(['success' => true]));
}

function clean(string $value): string {
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}

$nom        = clean($input['nom']        ?? '');
$prenom     = clean($input['prenom']     ?? '');
$telephone  = clean($input['telephone']  ?? '');
$email      = clean($input['email']      ?? '');
$prestation = clean($input['prestation'] ?? '');
$commune    = clean($input['commune']    ?? '');
$message    = clean($input['message']    ?? '');

$prestation_labels = [
    'elagage'   => 'Élagage',
    'debardage' => 'Débardage forestier',
    'travaux'   => 'Travaux forestiers',
    'agricole'  => 'Travaux agricoles',
    'autre'     => 'Autre',
];
$prestation_label = $prestation_labels[$prestation] ?? $prestation;

function sendBrevoEmail(array $payload): array {
    $ch = curl_init(BREVO_API_URL);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => [
            'accept: application/json',
            'api-key: ' . BREVO_API_KEY,
            'content-type: application/json',
        ],
        CURLOPT_POSTFIELDS     => json_encode($payload),
        CURLOPT_TIMEOUT        => 15,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode >= 400) {
        $data = json_decode($response, true);
        return ['success' => false, 'message' => $data['message'] ?? "Erreur Brevo ($httpCode)"];
    }
    return ['success' => true];
}

$date = date('d/m/Y à H:i');
$email_display = !empty($email) ? $email : 'Non fourni';
$commune_display = !empty($commune) ? $commune : 'Non précisée';

$notification_html = <<<HTML
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 12px; overflow: hidden;">
  <div style="background: linear-gradient(135deg, #2d5016, #4a7c23); padding: 24px 32px;">
    <h1 style="color: #fff; margin: 0; font-size: 20px;">🌿 Nouvelle demande de devis</h1>
    <p style="color: rgba(255,255,255,.8); margin: 6px 0 0; font-size: 14px;">Reçue via cazelag.fr le {$date}</p>
  </div>
  <div style="padding: 28px 32px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d; font-size: 13px; font-weight: 600; width: 130px;">Nom complet</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-size: 14px;">{$prenom} {$nom}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d; font-size: 13px; font-weight: 600;">Téléphone</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-size: 14px;"><a href="tel:{$telephone}" style="color: #2d5016; text-decoration: none;">{$telephone}</a></td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d; font-size: 13px; font-weight: 600;">Email</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-size: 14px;">{$email_display}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d; font-size: 13px; font-weight: 600;">Prestation</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-size: 14px;"><span style="background: #e8f5e9; color: #2d5016; padding: 3px 10px; border-radius: 12px; font-size: 13px;">{$prestation_label}</span></td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d; font-size: 13px; font-weight: 600;">Commune</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-size: 14px;">{$commune_display}</td>
      </tr>
    </table>
    <div style="margin-top: 20px; background: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 16px;">
      <p style="margin: 0 0 8px; font-size: 13px; color: #6c757d; font-weight: 600;">Message :</p>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">{$message}</p>
    </div>
  </div>
</div>
HTML;

$notification_payload = [
    'sender'      => ['name' => SENDER_NAME, 'email' => SENDER_EMAIL],
    'to'          => [['email' => OWNER_EMAIL, 'name' => OWNER_NAME]],
    'replyTo'     => !empty($email) ? ['email' => $email] : ['email' => SENDER_EMAIL],
    'subject'     => "🌿 Nouveau devis — {$prenom} {$nom} ({$prestation_label})",
    'htmlContent' => $notification_html,
];

$res = sendBrevoEmail($notification_payload);
if (!$res['success']) {
    http_response_code(500);
    exit(json_encode($res));
}

// 2. EMAIL CLIENT (Optionnel)
if (!empty($email)) {
    $confirmation_html = <<<HTML
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 12px; overflow: hidden;">
  <div style="background: linear-gradient(135deg, #2d5016, #4a7c23); padding: 28px 32px; text-align: center;">
    <h1 style="color: #fff; margin: 0; font-size: 22px;">Merci pour votre demande !</h1>
    <p style="color: rgba(255,255,255,.8); margin: 8px 0 0; font-size: 14px;">Cazelag — Élagueur Grimpeur Arboriste</p>
  </div>
  <div style="padding: 28px 32px;">
    <p style="font-size: 15px; color: #333; line-height: 1.6;">Bonjour <strong>{$prenom}</strong>,</p>
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
</div>
HTML;

    $confirmation_payload = [
        'sender'      => ['name' => SENDER_NAME, 'email' => SENDER_EMAIL],
        'to'          => [['email' => $email, 'name' => "{$prenom} {$nom}"]],
        'replyTo'     => ['email' => OWNER_EMAIL, 'name' => OWNER_NAME],
        'subject'     => 'Confirmation de votre demande de devis — Cazelag',
        'htmlContent' => $confirmation_html,
    ];
    sendBrevoEmail($confirmation_payload);
}

http_response_code(200);
echo json_encode(['success' => true]);
?>
