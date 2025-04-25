//   "biblioteca"
const express = require("express"); // Importa lib do Express
const sqlite3 = require("sqlite3"); // Importa lib do sqlite3
const bodyParser = require("body-parser"); // Importa o body-parser

const PORT = 8000; // Irá chamar a Porta TCP do servidor HTTP da aplicação

//Variáveis usadas para EJS (padrão)
let config = { titulo: "", rodape: "" };

const app = express(); // Instância para uso do Express

const db = new sqlite3.Database("user.db"); // Instância para uso do Sqlite3, e usa o arquivo 'user.db'

db.serialize(() => {
  // Este método permite enviar comandos SQL em modo 'sequencial'
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, email TEXT, celular TEXT, cpf TEXT, rg TEXT)"
  );
});

// _dirname é a variável interna do nodejs que guarda o caminho absoluto do projeto, no SO
//console.log(__dirname + "/static");

// Aqui será acrescentado uma rota "/static", para a pasta _dirname + "/static"
// O app.use é usado para acrenscentar rotas para o Express gerenciar e pode usar

// Middleware para isto, que neste caso é o express.static, que gerencia rotas estáticas.
app.use("/static", express.static(__dirname + "/static"));

// Middleware para processar as requisições do body Parameters do cliente
app.use(bodyParser.urlencoded({ extended: true }));

// Configura EJS como o motor de visualização
app.set("view engine", "ejs");

// const index =
//   "<a href='/home'> Home</a><a href='/sobre'> Sobre</a><a href='/login'> Login</a><a href='/cadastro'> Cadastro</a><a href='/info'> Info</a>";
// const home = 'Vc está na página "Home"<br><a href="/">Voltar</a>';
// const sobre = 'Vc está na página "Sobre"<br><a href="/">Voltar</a>';
// const login = 'Vc está na página "Login"<br><a href="/">Voltar</a>';
// const cadastro = 'Vc está na página "Cadastro"<br><a href="/">Voltar</a>';
// const info = 'Vc está na página "Info"<br><a href="/">Voltar</a>';

/* Método express.get necessita de dois parâmetros
// Na ARROW FUNCTION: o primeiro são os daods do servidor (REQUISITION - 'res'):
o segundo, são os dados que serão enviados ao cliente (RESULT - 'res') */

app.get("/", (req, res) => {
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:8000
  // res.send(index);
  console.log("GET /index");
  // res.render("pages/index");
  //res.redirect("/cadastro"); // Redireciona para a ROTA cadastro

  config = { titulo: "Blog da turma I2HNA - SESI Nova Odessa", rodape: "" };
  //config.rodape = "1";
  res.render("pages/index", config);
  // res.redirect("/cadastro"); // Redireciona para a ROTA cadastro
});

app.get("/usuarios", (req, res) => {
  const query = "SELECT * FROM users";
  db.all(query, (err, row) => {
    console.log(`GET /usarios ${JSON.stringify(row)}`);
    // res.send("Lista de usuários");
    res.render("partials/usertable", config);
  });
});

// GET do cadastro
app.get("/cadastro", (req, res) => {
  console.log("GET /cadastro");
  // Linha para depurar se está vindo dados no req.body
  res.render("pages/cadastro", config);
});

// POST do cadastro
app.post("/cadastro", (req, res) => {
  // req: Informação que é mandada pro servidor pelo cliente
  // res: É a resposta do servidor para o cliente
  console.log("POST /cadastro");
  // Linha para depurar se está vindo dados no req.nody
  !req.body
    ? console.log(JSON.stringify(req.body))
    : console.log(`Body vazio: ${req.body}`);

  const { username, password, email, celular, cpf, rg } = req.body;
  // Colocar aqui as validações e inclusão no banco de dados do cadastro do usuario
  // 1. Validar dados do usuário
  // 2. Saber-se ele já existe no banco
  const query =
    "SELECT * FROM users WHERE email=? OR cpf=? OR rg=? OR username=?";
  db.get(query, [email, cpf, rg, username], (err, row) => {
    if (err) throw err;
    console.log(`${JSON.stringify(row)}`);
    if (row) {
      // A variável 'row' irá retornar os dados do banco de dados,
      // executado através do SQL, variável query
      res.send("Usuário já cadastrado, refaça o cadastro");
    } else {
      // 3. Se o usuário não existe no banco cadastrar
      const insertQuery =
        "INSERT INTO users (username, password, email, celular, cpf, rg) VALUES (?,?,?,?,?,?)";
      db.run(
        insertQuery,
        [username, password, email, celular, cpf, rg],
        (err) => {
          // Inserir a lógica do INSERT
          if (err) throw err;
          res.send("Usuário cadastrado, com sucesso");
        }
      );
    }
  });

  // res.send(
  //   `Bem-vindo usuário: ${req.body.nome}, seu email é ${req.body.email}`
  // );
});

// app.get("/home", (req, res) => {
//   res.send(home);
// });

// Programação de rotas do método GET do HTTP 'app.get()'
app.get("/sobre", (req, res) => {
  console.log("GET /sobre");
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:8000/cadastro
  res.render("pages/sobre", config);
});

app.get("/login", (req, res) => {
  console.log("GET /login");
  // res.send(login);
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:8000/info
  res.render("pages/login", config);
});

app.post("/login", (req, res) => {
  res.send("Login ainda não implementado.");
});

// app.get("/foradecasa", (req, res) => {
//   // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:8000
//   // res.send(index);
//   console.log("GET /foradecasa");
//   res.render("foradecasa");
//   //res.redirect("/cadastro"); // Redirecinqa para a ROTA cadastro
// });

app.get("/dashboard", (req, res) => {
  console.log("GET /dashboard");
  res.render("pages/dashboard", config);
});

// app.get("/info", (req, res) => {
//   res.send(info);
// });

// app.get("/info", (req, res) => {
//   // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:8000/info
//   res.send(info);
// });

// app.listen() deve ser o último comando da aplicação (app.js)
app.listen(PORT, () => {
  console.log(`Servidor sendo executado na porta ${PORT}!`);
});
