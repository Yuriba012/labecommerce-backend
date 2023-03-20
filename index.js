console.log(`${process.argv[2]} ${process.argv[3]}`);

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const isParImpar = (num) => (num % 2 == 0 ? "par" : "impar");

const pcNumber = getRndInteger(0, 9);

const userParidade = process.argv[2];

const userNumber = process.argv[3];

const paridadeGenerator = () => (userParidade == "par" ? "impar" : "par");

const pcParidade = paridadeGenerator();

const sum = +(userNumber) + pcNumber;

const result = isParImpar(sum);

console.log(`
Seu número: ${userNumber}
Sua esolha: ${userParidade}
Número da máquina: ${pcNumber}
Escolha da máquina: ${pcParidade}
Soma: ${sum}
`)

if (userParidade == result){
    console.log("Você venceu")
}else{
    console.log("Você perdeu, seu lixo")
}