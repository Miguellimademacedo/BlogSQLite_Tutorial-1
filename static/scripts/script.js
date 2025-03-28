console.log("JS CONECTADO");

const formulario = document.getElementById("cadastroForm");
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const password = document.getElementById("password");
const ConfirmarSenha = document.getElementById("ConfirmarSenha");
const celular = document.getElementById("celular");
const cpf = document.getElementById("cpf");
const rg = document.getElementById("rg");
const msgError = document.getElementsByClassName("msgError");

/* ------ FUNÇÃO PARA RENDERIZAR AS DIFERENTES MENSAGENS DE ERRO! ----------------- */
const createDisplayMsgError = (mensagem) => {
  msgError[0].textContent = mensagem;
};

/* ---------------------------------------------------------------------------- */

/* ---------------- FUNÇÃO PARA VERIFICAR O NOME ---------------------------- */
const chekNome = () => {
  const nomeRegex = /^[A-Za-zÀ-ÿ\s]+$/;
  return nomeRegex.test(nome.value);
};

/* --------------------------------------------------------------------- */

/* ---------- FUNÇÃO PARA VERIFICAR O EMAIL -------------------------- */
const chekEmail = (email) => {
  const partesEmail = email.split("@");

  if (
    (partesEmail.length === 2 &&
      partesEmail[1].toLowerCase() === "gmail.com") ||
    (partesEmail.length === 2 &&
      partesEmail[1].toLowerCase() === "outlook.com") ||
    (partesEmail.length === 2 && partesEmail[1].toLowerCase() === "hotmail.com")
  ) {
    return true;
  } else {
    return false;
  }
};

/* ----------------------------------------------------------------------------- */

/* ---------- FUNÇÃO PARA VERIFICAR IGUALDADE DAS SENHAS --------------------- */
function chekPasswordMatch() {
  return password.value === ConfirmarSenha.value ? true : false;
}

/* ----------------------------------------------------------------------- */

/* ----------- FUNÇÃO PARA INSERIR MASCARA NO TELEFONE ----------------- */
function maskPhoneNumber(event) {
  let celular = event.target.value;

  if (/[A-Za-zÀ-ÿ]/.test(celular)) {
    createDisplayMsgError("O celular deve conter apenas números!");
  } else {
    createDisplayMsgError("");
  }

  celular = celular.replace(/\D/g, "");

  if (celular.length > 11) {
    celular = celular.substring(0, 11);
  }

  if (celular.length > 2) {
    celular = `(${celular.substring(0, 2)}) ${celular.substring(2)}`;
  } else if (celular.length > 0) {
    celular = `(${celular})`;
  }

  if (celular.length > 10) {
    celular = celular.replace(/(\(\d{2}\)) (\d{5})(\d{1,4})/, "$1 $2-$3");
  }

  event.target.value = celular;
}

/* -------------------------------------------------------------------------- */

/* ----------- FUNÇÃO PARA INSERIR MASCARA NO CPF ------------------------- */
document.getElementById("cpf").addEventListener("input", function (event) {
  let maskCPF = event.target.value.replace(/\D/g, "");
  maskCPF = maskCPF.substring(0, 11);

  if (maskCPF.length > 9) {
    maskCPF = maskCPF.replace(/(\d{3})(\d{3})(\d{3})/, "$1.$2.$3-");
  } else if (maskCPF.length > 6) {
    maskCPF = maskCPF.replace(/(\d{3})(\d{3})/, "$1.$2.");
  } else if (maskCPF.length > 3) {
    maskCPF = maskCPF.replace(/(\d{3})/, "$1.");
  }
  event.target.value = maskCPF;
});
/* --------------------------------------------------------------------- */

/* ----------- FUNÇÃO PARA INSERIR MASCARA NO RG -------------------------------------- */
document.getElementById("rg").addEventListener("input", function (event) {
  let maskRG = event.target.value.replace(/\D/g, "");
  maskRG = maskRG.substring(0, 9);

  if (maskRG.length > 8) {
    maskRG = maskRG.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2.$3-");
  }
  event.target.value = maskRG;
});
/* ----------------------------------------------------------------- */

/* ------------- FUNÇÃO PARA VERIFICAR FORÇA DA SENHA ---------- */
function chekPasswordStrength(password) {
  if (!/[a-z]/.test(password)) {
    return "A senha deve ter pelo menos uma letra minúscula!";
  }
  if (!/[A-Z]/.test(password)) {
    return "A senha deve ter pelo menos uma letra maiúscula!";
  }
  if (!/[\W_]/.test(password)) {
    return "A senha deve ter pelo menos uma letra especial!";
  }
  if (!/\d/.test(password)) {
    return "A senha deve ter pelo menos um número!";
  }
  if (password.length < 8) {
    return "A senha deve ter pelo menos 8 caracteres!";
  }

  return null;
}
/* -------------------------------------------------------------------------- */

/* ------------- FUNÇÃO PARA CRIAR "CHUVA" NO FORMULÁRIO ------------------ */

const rainFunction = () => {
  let rain = document.createElement("span");
  // let cont_rain = document.getElementsByClassName("container_rain");
  let cont_rain = document.querySelector(".container_rain");
  let left = Math.floor(Math.random() * (310 - 65) + 65);
  let duration = Math.random() * 5;

  rain.classList.add("rain");
  // cont_rain[0].appendChild(rain);
  cont_rain.appendChild(rain);
  rain.style.left = left + "px";
  rain.style.animationDuration = 1 + duration;

  setTimeout(() => {
    // cont_rain[0].removeChild(rain);
    cont_rain.removeChild(rain);
  }, 1500);
};

setInterval(() => {
  rainFunction();
}, 250);

/* ----------------------------------------------------------------------- */

/* ------------- FUNÇÃO PARA VERIFICAR E ENVIAR DADOS ------------------ */
function fetchDatas(event) {
  event.preventDefault();

  if (!chekNome(nome.value)) {
    createDisplayMsgError(
      "O nome não pode conter números ou caracteres especiais!"
    );
    return;
  }

  if (!chekEmail(email.value)) {
    createDisplayMsgError(
      "O nome não pode conter números ou caracteres especiais!"
    );
    return;
  }

  if (!chekPasswordMatch()) {
    createDisplayMsgError("As senhas digitadas não coincidem!");
    return;
  }

  const senhaError = checkPasswordStrength(senha.value);
  if (senhaError) {
    createDisplayMsgError(senhaError);
    return;
  }

  if (celular.value && /[A-Za-zÀ-ÿ]/.test(celular.value)) {
    createDisplayMsgError("O telefone deve conter apenas números");
    return;
  }

  const formData = {
    nome: nome.value,
    email: email.value,
    senha: password.value,
    celular: celular.value,
    cpf: cpf.value,
    rg: rg.value,
  };

  console.log("Formulário Enviado: ", JSON.stringify(formData, null, 2));
}

// formulario.addEventListener("submit", fetchDatas);

nome.addEventListener("input", () => {
  if (nome.value && !chekNome()) {
    createDisplayMsgError(
      "O Nome não pode conter números ou caracteres especiais!"
    );
  } else {
    createDisplayMsgError("");
  }
});

email.addEventListener("input", () => {
  if (email.value && !chekEmail(email.value)) {
    createDisplayMsgError("O Email digitado não é válido!");
  } else {
    createDisplayMsgError("");
  }
});

password.addEventListener("input", () => {
  if (password.value && chekPasswordStrength(password.value)) {
    createDisplayMsgError(chekPasswordStrength(password.value));
  } else {
    createDisplayMsgError("");
  }
});

// ConfirmarSenha.addEventListener("input", () => {
//   if (ConfirmarSenha.value && !chekEmail(ConfirmarSenha.value)) {
//     createDisplayMsgError("");
//   } else {
//     createDisplayMsgError("");
//   }
// });

celular.addEventListener("input", maskPhoneNumber);
