// olá, mundo!
const mensagem = "olá mundo!"

// {} significa escopo diferente, novo escopo, dentro de chave 
//é considerado local e o que está fora é global 

{
    const mensagem = "Olá, kalyla"
    console.log(mensagem)
}
console.log(mensagem);
