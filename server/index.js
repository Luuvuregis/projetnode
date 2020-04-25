const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const request = require('request') 
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;
var sessionstorage = require('sessionstorage');
var validator = require('email-validator')
const clientLogins = {
  user: 'ncqgkgyhpwzjpp',
  host: 'ec2-52-207-93-32.compute-1.amazonaws.com',
  database: 'dk5gbddn3ssl',
  password: 'b2f4224e7deb2dc6d473a5ae55de371a6cc4c74397b7cff8fc8cdfc2762b74e5',
  port: 5432,
  ssl:true
}

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} 
else {
  const app = express();

  // Parse URL-encoded bodies (as sent by HTML forms)
  app.use(express.urlencoded({ extended: true }));

  // Parse JSON bodies (as sent by API clients)
  app.use(express.json());

  //Authorize Access From Front-End to Back-End
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  // Answer API requests.
  app.get('/', function (req, res) {
    var data = {connected: false, idUser: '', nameUser: '', emailUser: '',
    firstnameUser: '', lastnameUser:'', idLocalisation:'', isAdmin: ''};
    if(sessionstorage.getItem("idUser") != null) {
      data.connected = true;
      data.idUser = sessionstorage.getItem("idUser");
      data.nameUser = sessionstorage.getItem("nameUser");
      data.emailUser = sessionstorage.getItem("emailUser");
      data.firstnameUser = sessionstorage.getItem("firstnameUser");
      data.lastnameUser = sessionstorage.getItem("lastnameUser");
      data.idLocalisation = sessionstorage.getItem("idLocalisation");
      data.isAdmin = sessionstorage.getItem("isAdmin");
    }
    res.send(data);
  });

  app.get('/disconnect', function (req, res) {
    var data = {message: 'You have been succesfully disconnected'};
    sessionstorage.clear();
    res.send(data)
  });

  app.get('/getAllLocalisations', function (req, res) {
    const client = new Client(clientLogins)
    client.connect();
    
    client.query('SELECT * FROM users.localisation;', (err, res1) => {
      if (err) throw err;
      var data = [];
      var cpt = 0;
      for (let row of res1.rows) {
        console.log(JSON.stringify(row.nameLocalisation));
        data.push({"idLocalisation": row.idLocalisation, "nameLocalisation":row.nameLocalisation});
      }
      res.send(data)
      client.end();
    });
  })

  /**
   * 
   * USER REGISTRATION TO WEBSITE
   * 
   */
  app.post('/register', function(request, response){
    const nameUser = request.body.user.name.trim();
    const pwdUser = request.body.user.pwd;
    const confirmPwd = request.body.user.confirmPwd;
    const emailUser = request.body.user.email.trim();
    var data = { message: '', success: false };
    if(validator.validate(emailUser) == false){data.message = "Votre email est incorrect."; response.send(JSON.stringify(data));}
    else if(nameUser.length < 5){data.message = "Votre pseudo est trop court (au moins 5 caractères)."; response.send(JSON.stringify(data));}
    else if(pwdUser != confirmPwd) {data.message = "Les mots de passe ne concordent pas."; response.send(JSON.stringify(data));}
    else if(pwdUser.trim().length < 8) {data.message = "Votre mot de passe est trop court (au moins 8 caractères)."; response.send(JSON.stringify(data));}
    else {
      const client = new Client(clientLogins);
      client.connect();
      const queryCheck = `SELECT * FROM users.users where "nameUser" = '${nameUser}' OR "emailUser" = '${emailUser}'`;
      client.query(queryCheck, (err, res2) => {
        if(res2.rows.length > 0) {
          data.message = res2.rows[0].nameUser == nameUser ? "Ce pseudo est déjà pris." : "Cet email est déjà pris.";
          response.send(JSON.stringify(data));
        }
        else {
          data.message = "L'inscription est un succès. Vous pouvez dès à présent vous connecter.";
          data.success = true;
          const client2 = new Client(clientLogins);
          client2.connect();
          bcrypt.hash(pwdUser, saltRounds)
          .then(function(hash) {
            const queryRegister = `INSERT INTO users.users("nameUser", "pwdUser", "emailUser", "firstnameUser", "lastnameUser", "idLocalisation", "isAdmin") 
                                    VALUES ('${nameUser}', '${hash}', '${emailUser}', '', '', 0, FALSE)`;
            client2.query(queryRegister, (err1, res3) => {console.log(err1, res3); client2.end();});
            response.send(JSON.stringify(data));
          });
        }
        client.end();
      });
    }
  });


  /**
   * 
   * USER AUTHENTIFICATION TO WEBSITE
   * 
   */
  app.post('/login', function(request, response){
    const loginInfo = request.body.user.name;
    const pwdUser = request.body.user.pwd;
    const client = new Client(clientLogins);
    const query = `SELECT * FROM users.users where "emailUser" = '${loginInfo}'`;
    client.connect();
    client.query(query, (err, res1) => {
      var data = {message : 'Password/Pseudo are wrong', success: false, idUser: '', nameUser: '', emailUser: '',
        firstnameUser: '', lastnameUser:'', idLocalisation:'', isAdmin: ''};
      if(res1.rows.length == 1) {
        var hash = res1.rows[0].pwdUser
        bcrypt.compare(pwdUser, hash).then(function(result) {
          if(result)
          {
            data.success = true; 
            data.message = 'Welcome ! The authentification is a success. You can now close this form.';
            data.idUser = res1.rows[0].idUser;
            data.nameUser = res1.rows[0].nameUser;
            data.emailUser = res1.rows[0].emailUser;
            data.firstnameUser = res1.rows[0].firstnameUser;
            data.lastnameUser = res1.rows[0].lastnameUser;
            data.idLocalisation = res1.rows[0].idLocalisation;
            data.isAdmin = res1.rows[0].isAdmin;
            console.log(data.isAdmin);
            sessionstorage.setItem("idUser", data.idUser);
            sessionstorage.setItem("nameUser", data.nameUser);
            sessionstorage.setItem("emailUser", data.emailUser);
            sessionstorage.setItem("firstnameUser", data.firstnameUser);
            sessionstorage.setItem("lastnameUser", data.lastnameUser);
            sessionstorage.setItem("idLocalisation", data.idLocalisation);
            sessionstorage.setItem("isAdmin", data.isAdmin);
            sessionstorage.setItem("connected", true);
          }
          response.send(data);
          client.end();
        });
      }
      else {
        response.send(data)
        client.end();
      }
    });
  });

  /**
   * 
   * USER UPDATE EMAIL
   * 
   */
  app.put('/changeEmailUser', function(request, response){
    const emailUser = request.body.user.email.trim();
    const idUser = request.body.user.id;
    var data = { message: '', success: false };
    if(emailUser.length == 0) {
      data.message = 'Aucun changement n\'a été effectué.';
      data.success = true;
      response.send(data);
    }
    else if(validator.validate(emailUser) == false){
      data.message = "Votre email est incorrect"; 
      response.send(data);
    }
    else {
      const client2 = new Client(clientLogins);
      client2.connect();
      const queryCheck = `SELECT * FROM users.users where "emailUser" = '${emailUser}'`;
      client2.query(queryCheck, (err2, res2) => {
        if(res2.rows.length > 0) {
          data.message = "Cet email est déjà pris.";
          response.send(data);
        }
        else {
          const client = new Client(clientLogins);
          client.connect();
          const query = `UPDATE users.users SET "emailUser" = '${emailUser}' WHERE "idUser" = ${idUser}`;
          client.query(query, (err1, res1) => {
            console.log(err1, res1);
            data.message = 'Les changements ont été effectués avec succès.';
            data.success = true;
            response.send(data);
            client.end();
          });
        }
        client2.end();
      });
    }
  });

  /**
   * 
   * USER UPDATE PASSWORD
   * 
   */
  app.put('/changePasswordUser', function(request, response){
    const idUser = request.body.user.id;
    const pwdUser = request.body.user.pwd.trim();
    const confirmPwd = request.body.user.confirmPwd.trim();
    var data = { message: '', success: false };
    if(pwdUser.length == 0 && pwdUser.length == 0) { data.message = 'Aucun changement n\'a été effectué.'; data.success = true;response.send(data);}
    else if(pwdUser != confirmPwd) {data.message = "Les mots de passe sont différents."; response.send(data);}
    else if(pwdUser.length < 8) {data.message = "Le mot de passe est trop courts (au moins 8 caractères)."; response.send(data);}
    else {
      data.message = 'Les changements ont été effectués avec succès.';
      data.success = true;
      const client = new Client(clientLogins);
      client.connect();
      bcrypt.hash(pwdUser, saltRounds)
      .then(function(hash) {
        const queryUpdate = `UPDATE users.users SET "pwdUser" = '${hash}' WHERE "idUser" = ${idUser}`;
        client.query(queryUpdate, (err1, res3) => {
          console.log(err1, res3); 
          client.end();
        });
        response.send(data);
      });
    }
    response.send(data);
  });

  /**
   * 
   * UPDATE FIRSTNAME, LASTNAME AND LOCALISATION OF A USER
   * 
   */
  app.put('/updateIdentity', function(request, response){
    const idUser = request.body.identity.idUser;
    const firstnameUser = request.body.identity.firstnameUser.trim();
    const lastnameUser = request.body.identity.lastnameUser.trim();
    const idLocalisation = request.body.identity.idLocalisation;
    console.log(idUser);
    var data = { message: '', success: false };
    var digitsRegex = /\d+/;
    if(firstnameUser.match(digitsRegex) != null || lastnameUser.match(digitsRegex) != null) {
      data.message = "Pas de chiffres dans votre nom/prenom.";
      response.send(data);
    }
    else if(idLocalisation == 0) {
      data.message = "Veuillez choisir votre localisation.";
      response.send(data);
    }
    else {
      var firstnameParams = firstnameUser.length == 0 ? '' : `"firstnameUser" = '${firstnameUser}',`;
      var laststnameParams = lastnameUser.length == 0 ? '' : `"lastnameUser" = '${lastnameUser}',`;
      var idLocalisationParams = `"idLocalisation" = ${idLocalisation}`;
      const query = `UPDATE users.users SET ${firstnameParams} ${laststnameParams} ${idLocalisationParams} WHERE "idUser" = ${idUser}`;
      console.log(query);
      const client = new Client(clientLogins);
      client.connect();
      client.query(query, (err1, res1) => {
        console.log(err1, res1);
        data.message = 'Les changements ont été effectués avec succès.';
        data.success = true;
        sessionstorage.setItem("firstnameUser", firstnameUser);
        sessionstorage.setItem("lastnameUser", lastnameUser);
        sessionstorage.setItem("idLocalisation", idLocalisation);
        response.send(data);
        client.end();
      });
    }
  });

  app.post('/addElection', function(request, response){
    const nomElection = request.body.election.nomElection.trim();
    const dateElection = request.body.election.dateElection.trim();
    const idLocalisation = request.body.election.idLocalisation;
    const tourElection = request.body.election.tourElection;
    console.log(dateElection);
    var data = { message: '', success: false };
    if(nomElection.length == 0) {
      data.message = "Veuillez indiquer le nom de l'élection."
      response.send(data);
    }
    else {
      const client = new Client(clientLogins);
      client.connect();
      const query = `INSERT INTO users.elections("nomElection", "dateElection", "idLocalisation", "tourElection") VALUES ('${nomElection}', '${dateElection}', ${idLocalisation}, ${tourElection})`;
      console.log(query);
      client.query(query, (err1, res1) => {
        console.log(err1, res1);
        data.message = "L'élection a été ajoutée avec succès.";
        data.success = true;
        response.send(data);
        client.end();
      });
    }
  });

  app.post('/addVision', function(request,response){
    const nomVision = request.body.vision.nomVision.trim();
    var data = { message: '', success: false };
    if(nomVision.length == 0) {
      data.message = "Veuillez insérer le nom de la vision politique souhaitée";
    }
    else {
      const client = new Client(clientLogins);
      client.connect();
      const query = `INSERT INTO users.vision("nomVision") VALUES ('${nomVision}')`;
      console.log(query);
      client.query(query, (err1, res1) => {
        console.log(err1, res1);
        data.message = "La vision politique a été ajoutée avec succès.";
        data.success = true;
        response.send(data);
        client.end();
      });
    }
  });

  app.get('/getAllElections', function(request, response){
    const client = new Client(clientLogins)
    client.connect();
    
    client.query('SELECT * FROM users.elections e, users.localisation l WHERE e."idLocalisation" = l."idLocalisation"', (err, res1) => {
      if (err) throw err;
      var data = res1.rows;
      console.log(data);
      response.send(data)
      client.end();
    });
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });
}
