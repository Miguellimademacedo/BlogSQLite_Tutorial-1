// Para usar o prompt no nodejs é preciso instalar essa lib "prompt-sync"

let prompt = require("prompt-sync");
prompt = prompt();

//Parte 1: Operadores Aritméticos:
//1.1 Cálculo de Desconto
let preco = parseFloat(prompt("Qual o preço do produto: "));
let desconto = parseFloat(prompt("Qual o valor do desconto?: "));

function calcularDesconto(preco, desconto) {
  const resultado = preco - (preco * desconto) / 100;
  console.log("O valor com desconto é: ", resultado);
}
calcularDesconto(preco, desconto);

//1.2 Conversor de Temperatura
let temp = parseFloat(prompt("Digite um número: "));

function celsiusParaFahrenheit(temp) {
  const fahrenheit = (temp * 9) / 5 + 32;
  console.log("A temperatura em Fahrenheit é: ", fahrenheit);
}
celsiusParaFahrenheit(temp);

//1.3 Cálculo de Juros Simples
let P = parseFloat(prompt("Qual o valor principal?: "));
let R = parseFloat(prompt("Qual o valor da taxa?: "));
let T = parseFloat(prompt("Qual o tempo?: "));

function calcularJuros(principal, taxa, tempo) {
  const Juros = P * (R / 100) * T;
  console.log("O valor cobrado será: ", Juros);
}

calcularJuros;

//Parte 2: Operadores Relacionais:
//2.1 Maior Número

let numb1 = parseFloat(prompt("Digite o primeiro número: "));
let numb2 = parseFloat(prompt("Digite o segundo número: "));

function maiorNumero(num1, num2) {
  if (numb1 > numb2) {
    console.log("Primeiro número é maior");
  } else if (numb1 < numb2) {
    console.log("Segundo número é maior");
  } else {
    console.log("Ambos números são iguais");
  }
}
maiorNumero(num1, num2);

//2.2 Classificar de idade
let idade = parseFloat(prompt("Digite uma idade: "));

function ClassificarIdade(idade) {
  if (idade < 12) {
    console.log("Criança");
  } else if (idade < 18) {
    console.log("Adolescente");
  } else {
    console.log("Adulto");
  }
}

ClassificarIdade(idade);

//2.3 Validação de Nota

let nota = parseFloat(prompt("Digite uma nota: "));

function validarNota(nota) {
  if (nota < 0) {
    console.log("false");
  } else if (nota > 10) {
    console.log("false");
  } else {
    console.log("true");
  }
}

validarNota(nota);

//Parte 3: Operadores Lógicos:
//3.1 Aprovado ou Reprovado
let media = parseFloat(prompt("Digite a média: "));
let falta = parseFloat(prompt("Digite a % de falta: "));
let faltas = 0;

faltas = falta / 100;

function verificarAprovacao(media, falta) {
  if (media >= 7 && falta < 25) {
    console.log("Aprovado!");
  } else {
    console.log("Reprovado!");
  }
}

verificarAprovacao(media, falta);

//3.2 Intervalo de Valores

let valor = parseFloat(prompt("Digite um valor: "));

function estaNoIntervalo(valor, min, max) {
  if (valor >= min && valor <= max) {
    console.log("O valor esta no intervalo");
  } else {
    console.log("O valor não esta no intervalo");
  }
}

estaNoIntervalo(valor, 1, 10);

//3.3 Verificação de Login
let user = prompt("Digite seu Usuário: ");
let passw = prompt("Digite sua Senha: ");

function verificarLogin(username, senha) {
  if (user === "admin" && passw === "1234") {
    console.log("Login bem-sucedido");
  } else {
    console.log("Usuário ou senha incorretos");
  }
}

verificarLogin(user, passw);
