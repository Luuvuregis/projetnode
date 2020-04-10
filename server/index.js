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
const key = '108745517437252';
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
  const heroTab = []

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
    const client = new Client(clientLogins)
    client.connect();
    
    client.query('SELECT * FROM users.users;', (err, res1) => {
      if (err) throw err;
      var data = [];
      for (let row of res1.rows) {
        console.log(JSON.stringify(row));
        data.push(JSON.stringify(row));
      }
      res.send(data)
      client.end();
    });
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
    if(validator.validate(emailUser) == false){data.message = "This is not an email"; response.send(JSON.stringify(data));}
    else if(nameUser.length < 5){data.message = "Your pseudo must have at least 5"; response.send(JSON.stringify(data));}
    else if(pwdUser != confirmPwd) {data.message = "The passwords are differents"; response.send(JSON.stringify(data));}
    else if(pwdUser.trim().length < 8) {data.message = "The password is too short (at least 8 characters)"; response.send(JSON.stringify(data));}
    else {
      const client = new Client(clientLogins);
      client.connect();
      const queryCheck = `SELECT * FROM users.users where "nameUser" = '${nameUser}' OR "emailUser" = '${emailUser}'`;
      client.query(queryCheck, (err, res2) => {
        if(res2.rows.length > 0) {
          data.message = res2.rows[0].nameUser == nameUser ? "This pseudo already exists" : "This email already exists";
          response.send(JSON.stringify(data));
        }
        else {
          data.message = "The registration is truly a success. You can now login to the website.";
          data.success = true;
          const client2 = new Client(clientLogins);
          client2.connect();
          bcrypt.hash(pwdUser, saltRounds)
          .then(function(hash) {
            const queryRegister = `INSERT INTO users.users("nameUser", "pwdUser", "emailUser") VALUES ('${nameUser}', '${hash}', '${emailUser}')`;
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
      var data = {message : 'Password/Pseudo are wrong', success: false, id: '', nameUser: '', emailUser: ''};
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
    var data = { message: 'yooo', success: false };
    if(emailUser.length == 0) {
      data.message = 'We didn\'t change your email, Sir';
      data.success = true;
      response.send(data);
    }
    else if(validator.validate(emailUser) == false){
      data.message = "This is not an email"; 
      response.send(data);
    }
    else {
      const client2 = new Client(clientLogins);
      client2.connect();
      const queryCheck = `SELECT * FROM users.users where "emailUser" = '${emailUser}'`;
      client2.query(queryCheck, (err2, res2) => {
        if(res2.rows.length > 0) {
          data.message = "This email is already taken";
          response.send(data);
        }
        else {
          const client = new Client(clientLogins);
          client.connect();
          const query = `UPDATE users.users SET "emailUser" = '${emailUser}' WHERE "idUser" = ${idUser}`;
          client.query(query, (err1, res1) => {
            console.log(err1, res1);
            data.message = 'Changes has been successfully made, Sir';
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
    if(pwdUser.length == 0 && pwdUser.length == 0) { data.message = 'We didn\'t change your password, Sir'; data.success = true;response.send(data);}
    else if(pwdUser != confirmPwd) {data.message = "The passwords are differents"; response.send(data);}
    else if(pwdUser.length < 8) {data.message = "The password is too short (at least 8 characters)"; response.send(data);}
    else {
      data.message = 'Changes has been successfully made, Sir';
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

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });
}
