const { select, input, checkbox } = require('@inquirer/prompts')

let meta = {
   value: 'Tomar 3L de água por dia',
   checked: false,
}

let metas = [ meta ]

const cadastrarMeta = async () => {
   const meta = await input({message: "Digite a meta:"})
   
   if(meta.length == 0){
      console.log("A meta não pode ser vazia")
      return
   }

   // função push significa colocar alguma coisa dentro
   metas.push(
      { value: meta, checked: false }
   )
}

const listarMetas = async () => {
   const respostas = await checkbox({
      message: 'Use as setas para mudar de meta, o espaço para marcar ou desmascar e o Enter para finalizar essa etapa',
      // choices significa escolhas e [] que é um array, lista
      // ... fazer uma cópia do que tem em metas
      choices:[...metas],
      instructions: false,
   })

   if(respostas.length == 0){
      console.log("Nenhuma meta selecionada!")
      return
   }

   metas.forEach((m) => {
      m.checked = false
   } )

   // forEach() significa função para cada, no caso resposta
   respostas.forEach((resposta) => {
      //find() procura para cada meta se ela vai retornar verdadeiro ou falso
      const meta = metas.find((m) => {
         return m.value == resposta
      })

      meta.checked = true
   })

   console.log('Meta(s) marcadas como concluída(s)')
}
   
const start = async () => {
   
   while(true){
      
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
               name: "Sair",
               value: "sair"
            },
         ]
      })

      switch (opcao) {
         case "cadastrar":
            await cadastrarMeta()
            console.log(metas)
            break
         case "listar":
            await listarMetas()
            break
         case "sair":
            console.log("Até a próxima!")
            return
      }
   }
}

start()