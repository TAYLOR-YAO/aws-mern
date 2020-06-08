const AWS = require("aws-sdk");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const shortId = require("shortid");
const _ = require("lodash");
const {
  registerEmailParams,
  forgotPasswordEmailParams,
} = require("../../helpers/email");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const ses = new AWS.SES({ apiVersion: "2010-12-01" });

exports.register = (req, res) => {
  const { username, name, email, password } = req.body;
  // Check is user arlready exist in our database
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email déja pris",
      });
    }
    // generate token with username email and password
    const token = jwt.sign(
      { username, name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "10m",
      }
    );

    const params = registerEmailParams(email, token);

    const sendEmailOnRegister = ses.sendEmail(params).promise();

    sendEmailOnRegister
      .then((data) => {
        // console.log('email submitted to SES', data);
        res.json({
          message: `Un email a été envoyé a ${email}, suivez cet lien pour completer votre activation`,
        });
      })
      .catch((error) => {
        console.log("ses email on register", error);
        res.json({
          message: `Nous ne pouvons pas vérifier votre email. Essayez encore`,
        });
      });
  });
};
exports.login = (req, res) => {
  res.json({
    data: req.body,
  });
};
exports.registerActivated = (req, res) => {
  const { token } = req.body;
  //  console.log(token)
  jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (
    err,
    decoded
  ) {
    if (err) {
      return res.status(401).json({
        error: "Lien expiré. Essayer encore",
      });
    }

    const { username, name, email, password } = decoded;

    const uniqueName = shortId.generate();
    User.findOne({ email }).exec((err, user) => {
      if (user) {
        return res.status(401).json({
          error: "Email déja pris",
        });
      }
      const newUser = new User({ uniqueName, username, name, email, password });
      newUser.save((err, result) => {
        if (err) {
          return res.status(401).json({
            error:
              "Nous ne pouvons pas enragister votre email, essayer encore plus tard",
          });
        }
        return res.json({
          message:
            "Vous avez été enregitré avec success. acceder a votre compte",
        });
      });
    });
  });
};

//  Login Controler

exports.login = (req, res) => {
  const { email, password } = req.body;
  // console.table({ email, password });
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Nous avons aucun utilisateur de detenant ce email.",
      });
    }
    // authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Votre email et mot de pass do ne corresondent pas",
      });
    }
    // generate token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const { _id, name, username, uniqueName, email, role } = user;

    return res.json({
      token,
      user: { _id, name, email, username, uniqueName, role },
    });
  });
};

exports.requireSignin = expressJwt({ secret: process.env.JWT_SECRET }); // req.user
exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;
  User.findOne({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Utilisateur non trouvé",
      });
    }
    req.profile = user;
    next();
  });
};
exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  User.findOne({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Utilisateur non trouvé",
      });
    }

    if (user.role !== "admin") {
      return res.status(400).json({
        error: "Admin resource. Access refusé contactez votre administrateur",
      });
    }
    req.profile = user;
    next();
  });
};

exports.businessMiddleware = (req, res, next) => {
  const businessUserId = req.user._id;
  User.findOne({ _id: businessUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Utilisateur non trouvé",
      });
    }

    if (!(user.role == "admin" || user.role == "seller")) {
      return res.status(400).json({
        error:
          "Business resource. Access refusé contactez votre administrateur",
      });
    }
    req.profile = user;
    next();
  });
};

exports.sellerMiddleware = (req, res, next) => {
  const sellerUserId = req.user._id;
  User.findOne({ _id: sellerUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Utilisateur non trouvé",
      });
    }
    if (user.role !== "seller") {
      return res.status(400).json({
        error: "Vendeur. Access refusé contactez votre administrateur",
      });
    }
    req.profile = user;
    next();
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  // check if user exists with that email
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Nous n'avons aucun utilisateur avec cet email",
      });
    }
    // generate token and email to user
    const token = jwt.sign(
      { name: user.name },
      process.env.JWT_RESET_PASSWORD,
      { expiresIn: "10m" }
    );
    // send email
    const params = forgotPasswordEmailParams(email, token);

    // populate the db > user > resetPasswordLink
    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.status(400).json({
          error: "Renouvellement de mot de pass échoué. Essayer plus tard.",
        });
      }
      const sendEmail = ses.sendEmail(params).promise();
      sendEmail
        .then((data) => {
          console.log("Renouvellement de mot de passe réussi", data);
          return res.json({
            message: `Un email a ete envoyé ${email}. Cliquez sur le lien pour renouveller votre mot de passe`,
          });
        })
        .catch((error) => {
          console.log(
            "Renouvellement de mot de pass échoué. Essayer plus tard.",
            error
          );
          return res.json({
            message: `Nous ne pouvons pas verifier votre email. Essayer plus tard.`,
          });
        });
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  if (resetPasswordLink) {
    // check for expiry
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      (err, success) => {
        if (err) {
          return res.status(400).json({
            error: "Lien expiré. Essayez encore.",
          });
        }

        User.findOne({ resetPasswordLink }).exec((err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "Invalide token. Essayez encore",
            });
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
          };

          user = _.extend(user, updatedFields);

          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: "Reinitialisation échoué. Essayez encore",
              });
            }

            res.json({
              message: `Bonne nouvelle! You pouvez vous identifier avec votre nouveau mot de passe`,
            });
          });
        });
      }
    );
  }
};
exports.readUser = (req, res) => {
  const { email } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Utilisateur non trouvé",
      });
    }

    res.json({
      data: user,
    });
  });
};

exports.updateRole = (req, res) => {
  const { role } = req.params;
  const { email } = req.body;
  User.findOneAndUpdate(
    { email },
    {
      role,
    },
    { new: true }
  ).exec((err, updated) => {
    if (err) {
      return res.status(400).json({
        error: "Role assigné avec succès!",
      });
    }
    // console.log("UPDATED", updated);
    res.json(updated);
  });
};
