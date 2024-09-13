const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises

let mensagem = "Bem-vindo ao App de Metas/Rotina";

let metas 
const carregarMetas = async () => {
   try {
      const dados = await fs.readFile("metas.json","utf-8")
      metas = JSON.parse(dados)
   }
   catch(erro) {
      metas = []
   }
}

const salvarMetas = async () => {
   await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const cadastrarMeta = async () => {
   const meta = await input({message: "Digite a meta:"})
   
   if(meta.length == 0){
      mensagem = "A meta não pode ser vazia" 
      return
   }

   // função push significa colocar alguma coisa dentro
   metas.push(
      { value: meta, checked: false }
   )

   mensagem = "Meta cadastrada com sucesso! :)"
}

const listarMetas = async () => {
   if(metas.length == 0) {
      mensagem = "Não existem metas!"
      return
   }
   const respostas = await checkbox({
      message: 'Use as setas para mudar de meta, o espaço para marcar ou desmascar e o Enter para finalizar essa etapa',
      // choices significa escolhas e [] que é um array, lista
      // ... fazer uma cópia do que tem em metas
      choices:[...metas],
      instructions: false,
   })

   metas.forEach((m) => {
      m.checked = false
   } )
   
   if(respostas.length == 0){
      mensagem = "Nenhuma meta selecionada!"
      return
   }

   // forEach() significa função para cada, no caso resposta
   respostas.forEach((resposta) => {
      //find() procura para cada meta se ela vai retornar verdadeiro ou falso
      const meta = metas.find((m) => {
         return m.value == resposta
      })

      meta.checked = true
   })

   mensagem = 'Meta(s) marcada(s) como concluída(s)'
}

const metasRealizadas = async () => {
   if(metas.length == 0) {
      mensagem = "Não existem metas!"
      return
   }

   const realizadas = metas.filter((meta) => {

      // é uma HOF pois sempre vai receber uma 
      //função () => {} e nessa ela vai pegar uma meta
      //  por vez, fileter, retorno verdadeiro ele vai colocar numa nova lista
      
      return meta.checked   
   }) 
   
   if(realizadas.length == 0){
      mensagem = 'Não existem metas realizadas! :('
      return
   }

      await select({
         message: realizadas.length + ' Meta(s) Realizada(s)',
         choices: [...realizadas]
      })
}

const metasAbertas = async () => {
   if(metas.length == 0) {
      mensagem = "Não existem metas!"
      return
   }
   // metasAbertas = async () => ,RECEBE UMA FUNÇÃO ASSÍCRONA
   const abertas = metas.filter((meta) => {
      // cada filtro vai rodar uma função para cada meta
      return meta.checked != true
      // foi feito esse diferente pois a meta pode não estar concluia, oou seja, retornando falso , com isso me possibilita retornar verdadeiro
      // retornando verdadeiro essa meta é entendida como faz parte do filtro, estando na lista de metas abertas 
   })

   if(abertas.length == 0){
      mensagem = "Não existem metas abertas! :)"
      return 
   }

   await select({
      message:  abertas.length + " Meta(s) Aberta(s)",
      choices: [...abertas]
   })
}

const deletarMetas = async () => {
   if(metas.length == 0) {
      mensagem = "Não existem metas!"
      return
   }
   
   const metasDesmarcadas = metas.map((meta) => {
      return { value: meta.value, checked : false }
   })

   const itensADeletar = await checkbox({
      message: 'Selecione item para deletar',
      choices:[...metasDesmarcadas],
      instructions: false,
   })

   if(itensADeletar.length == 0) {
      mensagem = "Nenhum item para deletar!" 
      return
   }

   itensADeletar.forEach((item) => {
      metas = metas.filter((meta) => {
         return meta.value != item
      })
   })

   mensagem = "Meta(s) deletada(s) com sucesso!"
}

const mostrarMensagem = () => {
   console.clear();

   if(mensagem != "") {
      console.log("")
      console.log(mensagem)
      console.log("")
      mensagem = ""
   }
}
const start = async () => {
   await carregarMetas()

   while(true){
      mostrarMensagem()
      await salvarMetas()

      const opcao = await select({
         message: "Menu >",
         choices: [
            {
               name: "Cadastrar meta",
               value: "cadastrar"
            },

            {
               name: "Listar metas",
               value: "listar"
            },

            {
               name: "Metas realizadas",
               value: "realizadas"
            },

            {
               name: "Metas abertas",
               value: "abertas"
            }, 

            {
               name: "Deletar metas",
               value: "deletar"
            }, 

            {
               name: "Sair",
               value: "sair"
            },
         ]
      })

      switch (opcao) {
         case "cadastrar":
            await cadastrarMeta()
            break

         case "listar":
            await listarMetas()
            break

         case "realizadas":
            await metasRealizadas()
            break

         case "abertas":
              await metasAbertas()
            break

         case "deletar":
              await deletarMetas()
             break
 

         case "sair":
            console.log("Até a próxima!")
            return
      }
   }
}

start()