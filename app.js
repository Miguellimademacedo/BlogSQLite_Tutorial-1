//   "biblioteca"
const express = require("express"); // Importa lib do Express
const sqlite3 = require("sqlite3"); // Importa lib do sqlite3
const session = require("express-session");

const PORT = 8000; // Irá chamar a Porta TCP do servidor HTTP da aplicação

//Variáveis usadas para EJS (padrão)
let config = { titulo: "", rodape: "" };
const bodyParser = require("body-parser"); // Importa o body-parser

const app = express(); // Instância para uso do Express

const db = new sqlite3.Database("user.db"); // Instância para uso do Sqlite3, e usa o arquivo 'user.db'

db.serialize(() => {
  // Este método permite enviar comandos SQL em modo 'sequencial'
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, email TEXT, celular TEXT, cpf TEXT, rg TEXT)"
  );
});

//Configuração para o uso de sessão (cookies) com Express
app.use(
  session({
    secret: "qualquersenha",
    resave: true,
    saveUninitialized: true,
  })
);

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
config = { titulo: "Blog da turma I2HNA - SESI Nova Odessa", rodape: "" };

app.get("/", (req, res) => {
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:8000
  // res.send(index);
  console.log("GET /index");
  // res.render("pages/index");
  //res.redirect("/cadastro"); // Redireciona para a ROTA cadastro

  config.rodape = "";
  res.render("pages/index", { ...config, req: req });
  // res.redirect("/cadastro"); // Redireciona para a ROTA cadastro
});

app.get("/usuarios", (req, res) => {
  const query = "SELECT * FROM users  ";
  db.all(query, (err, row) => {
    console.log(`GET /usarios ${JSON.stringify(row)}`);
    // res.send("Lista de usuários");
    res.render("partials/usertable", { ...config, req: req });
  });
});

// GET do cadastro
app.get("/cadastro", (req, res) => {
  console.log("GET /cadastro");
  // Linha para depurar se está vindo dados no req.body
  res.render("pages/cadastro", { ...config, req: req });
});

// POST do cadastro
app.post("/cadastro", (req, res) => {
  // req: Informação que é mandada pro servidor pelo cliente
  // res: É a resposta do servidor para o cliente
  console.log("POST /cadastro");
  // Linha para depurar se está vindo dados no req.nody
  // !req.body
  //   ? console.log(JSON.stringify(req.body))
  //   : console.log(`Body vazio: ${req.body}`);

  const { username, password, email, celular, cpf, rg } = req.body;
  console.log(req.body);
  // Colocar aqui as validações e inclusão no banco de dados do cadastro do usuario
  // 1. Validar dados do usuário
  // 2. Saber-se ele já existe no banco
  const query =
    "SELECT * FROM users WHERE username=?";
  db.get(query, [username], (err, row) => {

    //    "SELECT * FROM users WHERE email=? OR cpf=? OR rg=? OR username=?";
    //  db.get(query, [email, cpf, rg, username], (err, row) => {

    if (err) throw err;
    console.log(`row: ${JSON.stringify(row)}`);
    if (row) {

      // A variável 'row' irá retornar os dados do banco de dados,
      // executado através do SQL, variável query
      res.render("pages/usuario_existente", { ...config, req: req });
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
          res.render("pages/usuario_cadastrado", { ...config, req: req });
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
  res.render("pages/sobre", { ...config, req: req });
});

app.get("/login", (req, res) => {
  console.log("GET /login");
  // res.send(login);
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:8000/info
  res.render("pages/login", { ...config, req: req });
});

app.post("/login", (req, res) => {
  console.log("POST /login");
  const { username, password } = req.body;
  console.log(`${JSON.stringify(req.body)}`);
  // Consultar o usuário no banco de dados
  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.get(query, [username, password], (err, row) => {
    if (err) throw err;

    // Se o usuário válido -> registra a sessão e redireciona para o dashboard
    if (row) {
      console.log("POST /login: ", row);

      req.session.loggedin = true;
      req.session.username = username;
      res.redirect("/dashboard");
    } // Se não, envia a mensagem de erro (Usuário inválido)
    else {
      console.log("POST /login - usuário Inválido");
      res.render("pages/usuario_invalido", { ...config, req: req });

    }
  });
});

// app.get("/foradecasa", (req, res) => {
//   // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:8000
//   // res.send(index);
//   console.log("GET /foradecasa");
//   res.render("foradecasa");
//   //res.redirect("/cadastro"); // Redirecinqa para a ROTA cadastro
// });


app.get("/dashboard", (req, res) => {
  if (req.session.loggedin) {
    db.all("SELECT * FROM users", [], (err, row) => {
      if (err) throw err;
      res.render("pages/dashboard", {
        ...config,
        dados: row,
        req: req,
      });
    });
  } else {
    console.log("Tentativa de acesso a área restrita");
  }
});

app.get("/home", (req, res) => {
  console.log("GET /home");
  res.render("pages/home", { ...config, req: req });
});

// Rota para processar a saida (logout) do usuário
// Utilize-o para encerrar a sessão do usuário
// Dica 1: Coloque um link de 'SAIR' na sua aplicação web
// Dica 2: Você pode implementar um controle de tempo de sessão e encerrar a sessão do usuário caso este tempo passe.
app.get("/logout", (req, res) => {
  console.log("GET /logout");
  // Exemplo de uma rota (END POINT) controlado pela sessão do usuário logado.
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// app.get("/info", (req, res) => {
//   res.send(info);
// });

// app.get("/info", (req, res) => {
//   // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:8000/info
//   res.send(info);
// });

// app.listen() deve ser o último comando da aplicação (app.js)

// Middleware para capturar rotas não existentes
app.use("*", (req, res) => {
  console.log("ERRO 404");
  //Envia uma resposta de erro 404
  config.titulo = "Página não encontrada - ERRO 404";
  res.status(404).render("pages/404", { ...config, req: req });
});

app.listen(PORT, () => {
  console.log(`Servidor sendo executado na porta ${PORT}!`);
});

