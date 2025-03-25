const axios = require('axios');
const nodemailer = require('nodemailer');
const qs = require('querystring');

const sendContactEmail = async (req, res) => {
  console.log('📧 DÉBUT DU TRAITEMENT DU CONTACT');
  console.log('Variables d\'environnement SMTP:', {
    SMTP_USER: process.env.SMTP_USER ? 'Présent' : 'Manquant',
    SMTP_PASS: process.env.SMTP_PASS ? 'Présent' : 'Manquant',
    EMAIL_RECIPIENT: process.env.EMAIL_RECIPIENT
  });

  const { name, email, message, recaptchaToken } = req.body;

  try {
    // Validation des données reçues
    if (!name || !email || !message) {
      console.error('❌ Données incomplètes');
      return res.status(400).json({
        message: 'Données du formulaire incomplètes'
      });
    }

    // Vérification du token reCAPTCHA
    console.log('🔍 Vérification reCAPTCHA en cours');
    const captchaResponse = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      qs.stringify({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: recaptchaToken
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log('✅ Réponse reCAPTCHA:', captchaResponse.data);

    // Vérifier le score reCAPTCHA
    if (!captchaResponse.data.success || captchaResponse.data.score < 0.5) {
      console.log('❌ Vérification reCAPTCHA échouée');
      return res.status(400).json({
        message: 'Vérification de sécurité échouée',
        details: captchaResponse.data
      });
    }

    // Configuration du transporteur Nodemailer
    console.log('📨 Configuration du transporteur email');
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Options de l'email
    const mailOptions = {
      from: `"Formulaire de Contact" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_RECIPIENT,
      subject: `Nouveau message de contact de ${name.trim()}`,
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nouveau message de contact</title>
          <style>
            body {
              background-color: #f6f6f6;
              font-family: Arial, sans-serif;
              font-size: 16px;
              line-height: 1.4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 5px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333;
              font-size: 24px;
              margin-bottom: 20px;
            }
            p {
              margin-bottom: 10px;
            }
            .message {
              background-color: #f0f7ff;
              border-left: 4px solid #3498db;
              color: #333;
              padding: 15px;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #3498db;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
              margin-top: 20px;
            }
            .button:hover {
              background-color: #2980b9;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Nouveau message de contact</h1>
            <p><strong>Nom :</strong> ${name.trim()}</p>
            <p><strong>Email :</strong> ${email}</p>
            <div class="message">
              <p><strong>Message :</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
            <a href="${process.env.SITE_URL}" class="button">Visiter le site</a>
          </div>
        </body>
        </html>
      `
    };

    // Envoi de l'email
    console.log('✉️ Tentative d\'envoi de l\'email');
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email envoyé avec succès:', info);

    res.status(200).json({
      message: 'Message envoyé avec succès',
      details: info
    });
  } catch (error) {
    console.error('❌ ERREUR GLOBALE DÉTAILLÉE:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });

    res.status(500).json({
      message: 'Erreur lors du traitement de la demande',
      errorDetails: error.message,
      errorName: error.name
    });
  }
};

module.exports = { sendContactEmail };