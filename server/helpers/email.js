exports.registerEmailParams = (email, token) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
                    <html>
                        <h1>Vérifier votre email</h1>
                        <p>S'il vous plait Suivez ce lien pour competer votre enrégistrement:</p>
                        <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                    </html>
                `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Completez votre enregistrement",
      },
    },
  };
};

exports.forgotPasswordEmailParams = (email, token) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: ` <html>
                <h1>Lien de réinitialisation de mot de passe</h1>
                <p>S'il vous plait Suivez ce lien pour réilitialiser votre mot de passe:</p>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
            </html>
        `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Réinitialisation de mot de passe",
      },
    },
  };
};
