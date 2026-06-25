/**
 * Apps Script — réception du formulaire de contact du portfolio.
 *
 * Flux : Front (ContactSection.tsx) → Fonction Netlify (contact.mjs) → CE script.
 * Le proxy Netlify POST un JSON : { name, email, subject, message }.
 *
 * Ce script :
 *   1. Écrit chaque message dans le Google Sheet (avec mise en forme soignée).
 *   2. T'envoie un email de notification.
 *   3. Retourne { result: "success" } — ce que le proxy attend.
 *
 * ─── INSTALLATION (5 min, à faire une seule fois) ───────────────────────────
 *   1. Ouvre ton Sheet :
 *      https://docs.google.com/spreadsheets/d/1JVqFwAQajfMIzm1ob9tOCgxq4QykpeFGmbDI3v0h2_U/edit
 *   2. Menu  Extensions → Apps Script.
 *   3. Supprime le code par défaut, colle CE fichier en entier.
 *   4. (Facultatif) Change NOTIFY_EMAIL ci-dessous pour recevoir les notifs ailleurs.
 *   5. Lance une fois la fonction `setupSheet` (menu ▶, choisis setupSheet) pour
 *      créer/styler l'onglet. Autorise les permissions demandées.
 *   6. Déploie : Déployer → Nouveau déploiement → type « Application Web ».
 *        - Exécuter en tant que : Moi
 *        - Accès : Tout le monde
 *      Copie l'URL « /exec ».
 *   7. Sur Netlify (Site settings → Environment variables) :
 *        GOOGLE_SCRIPT_URL = <l'URL /exec copiée>
 *      Re-déploie le site.
 *
 *   À chaque modif du script, refais « Déployer → Gérer les déploiements →
 *   crayon → Nouvelle version » pour que l'URL reflète les changements.
 * ────────────────────────────────────────────────────────────────────────────
 */

// ── Config ──────────────────────────────────────────────────────────────────
var SHEET_NAME   = "Messages";          // onglet où sont écrits les messages
var NOTIFY_EMAIL = "";                   // laisse vide = utilise ton email de compte Google
var TIMEZONE     = "Indian/Antananarivo"; // fuseau pour l'horodatage
var BRAND        = "#14b8a6";            // teal — accent du portfolio (en-têtes)

var HEADERS = ["Date", "Nom", "Email", "Sujet", "Message", "Statut"];

// ── Endpoint POST (appelé par le proxy Netlify) ───────────────────────────────
function doPost(e) {
  try {
    var data = parsePayload(e);

    var name    = (data.name    || "").toString().trim();
    var email   = (data.email   || "").toString().trim();
    var subject = (data.subject || "").toString().trim();
    var message = (data.message || "").toString().trim();

    if (!name || !email || !message) {
      return jsonOut({ result: "error", reason: "missing_fields" });
    }

    var sheet = getOrCreateSheet();
    var when  = new Date();

    sheet.appendRow([when, name, email, subject, message, "Nouveau"]);
    styleLastRow(sheet);

    notify(name, email, subject, message, when);

    return jsonOut({ result: "success" });
  } catch (err) {
    return jsonOut({ result: "error", reason: String(err) });
  }
}

// Réponse à un GET (utile pour tester l'URL dans le navigateur).
function doGet() {
  return jsonOut({ result: "ok", info: "Contact endpoint actif. Utilise POST." });
}

// ── Lecture du payload (JSON ou form-encoded, par sécurité) ───────────────────
function parsePayload(e) {
  if (!e) return {};
  if (e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents); } catch (_) { /* fallthrough */ }
  }
  return (e.parameter) || {};
}

// ── Feuille : création + mise en forme de l'en-tête ──────────────────────────
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    applyHeader(sheet);
  }
  return sheet;
}

function applyHeader(sheet) {
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setValues([HEADERS]);
  headerRange
    .setBackground(BRAND)
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setFontSize(11)
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("left");

  sheet.setRowHeight(1, 34);
  sheet.setFrozenRows(1);

  // Largeurs de colonnes : Date, Nom, Email, Sujet, Message, Statut
  var widths = [160, 150, 220, 220, 420, 100];
  for (var i = 0; i < widths.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }

  // Masque les colonnes au-delà de F pour une feuille épurée.
  var maxCols = sheet.getMaxColumns();
  if (maxCols > HEADERS.length) {
    sheet.deleteColumns(HEADERS.length + 1, maxCols - HEADERS.length);
  }
}

// ── Mise en forme de la dernière ligne ajoutée ───────────────────────────────
function styleLastRow(sheet) {
  var row = sheet.getLastRow();
  var range = sheet.getRange(row, 1, 1, HEADERS.length);

  // Lignes alternées (zébré) pour la lisibilité.
  range.setBackground(row % 2 === 0 ? "#f3faf9" : "#ffffff");
  range.setVerticalAlignment("top");
  range.setWrap(true);
  range.setFontSize(10);
  range.setBorder(false, false, true, false, false, false, "#e2e8f0", SpreadsheetApp.BorderStyle.SOLID);

  // Date lisible.
  sheet.getRange(row, 1).setNumberFormat("dd/mm/yyyy hh:mm");

  // Email cliquable.
  var email = sheet.getRange(row, 3).getValue();
  if (email) {
    sheet.getRange(row, 3).setFormula('=HYPERLINK("mailto:' + email + '";"' + email + '")');
  }

  // Statut « Nouveau » mis en valeur (badge teal).
  sheet.getRange(row, 6)
    .setBackground("#ccfbf1")
    .setFontColor("#0f766e")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");

  // Hauteur de ligne confortable.
  sheet.setRowHeight(row, 28);
}

// ── Notification email ───────────────────────────────────────────────────────
function notify(name, email, subject, message, when) {
  var to = NOTIFY_EMAIL || Session.getEffectiveUser().getEmail();
  if (!to) return;

  var dateStr = Utilities.formatDate(when, TIMEZONE, "dd/MM/yyyy 'à' HH:mm");
  var subjLine = "📨 Nouveau message portfolio" + (subject ? " — " + subject : "");

  var html =
    '<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:auto;">' +
      '<div style="background:' + BRAND + ';color:#fff;padding:18px 22px;border-radius:10px 10px 0 0;">' +
        '<h2 style="margin:0;font-size:17px;">Nouveau message depuis le portfolio</h2>' +
        '<p style="margin:4px 0 0;font-size:12px;opacity:.85;">' + dateStr + '</p>' +
      '</div>' +
      '<div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px;padding:22px;">' +
        row("Nom", escapeHtml(name)) +
        row("Email", '<a href="mailto:' + escapeHtml(email) + '" style="color:#0f766e;">' + escapeHtml(email) + '</a>') +
        (subject ? row("Sujet", escapeHtml(subject)) : "") +
        '<div style="margin-top:14px;padding-top:14px;border-top:1px solid #e2e8f0;">' +
          '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#64748b;margin-bottom:6px;">Message</div>' +
          '<div style="white-space:pre-wrap;font-size:14px;color:#0f172a;line-height:1.6;">' + escapeHtml(message) + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  MailApp.sendEmail({
    to: to,
    subject: subjLine,
    replyTo: email,            // répondre = répondre directement au visiteur
    htmlBody: html,
    name: "Portfolio — Contact",
  });
}

function row(label, value) {
  return '<div style="margin-bottom:8px;">' +
    '<span style="display:inline-block;width:70px;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#64748b;">' + label + '</span>' +
    '<span style="font-size:14px;color:#0f172a;">' + value + '</span>' +
  '</div>';
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// ── Réponse JSON ──────────────────────────────────────────────────────────────
function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── À lancer UNE fois manuellement pour préparer/styler l'onglet ──────────────
function setupSheet() {
  var sheet = getOrCreateSheet();
  applyHeader(sheet);
  SpreadsheetApp.getUi().alert('Feuille "' + SHEET_NAME + '" prête ✅');
}

// ── Test rapide (lance-la pour vérifier l'écriture + l'email) ─────────────────
function testInsert() {
  doPost({
    postData: {
      contents: JSON.stringify({
        name: "Test Visiteur",
        email: "test@example.com",
        subject: "Bonjour 👋",
        message: "Ceci est un message de test.\nDeuxième ligne pour vérifier le retour à la ligne.",
      }),
    },
  });
}
