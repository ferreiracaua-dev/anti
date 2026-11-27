// Dados genéricos e fictícios. Nenhum dado de pessoa real.
const DATA = {
  nomes: {
    BR: { m: ["João","Carlos","José","Antônio","Paulo","Marcos","Luiz","Pedro","Rafael","Sérgio","Roberto","Fábio"],
          f: ["Maria","Ana","Marlene","Sônia","Lúcia","Helena","Rita","Joana","Teresa","Cláudia","Regina","Vera"],
          s: ["Silva","Souza","Oliveira","Santos","Pereira","Costa","Rodrigues","Almeida","Nascimento","Lima","Araújo","Ribeiro"] },
    PT: { m: ["João","Manuel","António","Rui","Tiago","Nuno","Hugo"], f: ["Maria","Ana","Teresa","Inês","Fátima","Rosa"], s: ["Ferreira","Martins","Gomes","Marques","Carvalho","Pinto","Lopes"] },
    US: { m: ["James","Robert","John","Michael","David","William"], f: ["Mary","Patricia","Linda","Barbara","Susan","Karen"], s: ["Smith","Johnson","Brown","Miller","Davis","Wilson","Moore"] },
    AR: { m: ["Juan","Carlos","Luis","Jorge","Miguel","Ricardo"], f: ["María","Ana","Laura","Marta","Silvia","Graciela"], s: ["González","Rodríguez","Fernández","López","Díaz","Pérez","Sosa"] },
    ES: { m: ["Antonio","Manuel","José","Francisco","Javier","Pablo"], f: ["Carmen","María","Pilar","Dolores","Isabel","Rosario"], s: ["García","Martínez","López","Sánchez","Romero","Navarro","Ruiz"] }
  },
  paises: {
    BR: { nome: "Brasil", ruas: ["Rua das Flores","Avenida Brasil","Rua Sete de Setembro","Rua São José","Rua XV de Novembro","Avenida Paulista","Rua da Paz","Rua Santos Dumont","Avenida Getúlio Vargas","Rua Tiradentes","Rua das Palmeiras","Rua Dom Pedro II"],
      cidades: [["São Paulo","SP","11","01"],["Rio de Janeiro","RJ","21","20"],["Belo Horizonte","MG","31","30"],["Curitiba","PR","41","80"],["Porto Alegre","RS","51","90"],["Salvador","BA","71","40"],["Fortaleza","CE","85","60"],["Recife","PE","81","50"],["Goiânia","GO","62","74"],["Manaus","AM","92","69"],["Belém","PA","91","66"],["Campinas","SP","19","13"]], dominio: "example.com" },
    PT: { nome: "Portugal", ruas: ["Rua de Santa Catarina","Avenida da Liberdade","Rua Augusta","Rua do Comércio","Rua da Boavista"], cidades: [["Lisboa","","21","10"],["Porto","","22","40"],["Coimbra","","239","30"],["Braga","","253","47"]], dominio: "example.org" },
    US: { nome: "Estados Unidos", ruas: ["Main Street","Oak Avenue","Maple Drive","Cedar Lane","Washington Boulevard","Park Avenue"], cidades: [["Springfield","IL","217","627"],["Columbus","OH","614","432"],["Austin","TX","512","787"],["Denver","CO","303","802"]], dominio: "example.com" },
    AR: { nome: "Argentina", ruas: ["Avenida San Martín","Calle Belgrano","Avenida Rivadavia","Calle Mitre","Calle Sarmiento"], cidades: [["Córdoba","","351","X50"],["Rosario","","341","S20"],["Mendoza","","261","M55"]], dominio: "example.com" },
    ES: { nome: "Espanha", ruas: ["Calle Mayor","Calle de la Paz","Avenida de la Constitución","Calle del Sol","Paseo de la Castellana"], cidades: [["Madrid","","91","28"],["Valencia","","96","46"],["Sevilla","","95","41"],["Zaragoza","","976","50"]], dominio: "example.com" }
  },
  personas: {
    marlene: { nome: "Dona Marlene", desc: "72 anos, viúva, não entende de celular. Tem um neto chamado Lucas que \"mexe nessas coisas\".",
      fillers: ["Meu neto Lucas é que mexe nisso, filho.","Espera que eu vou pegar meus óculos.","Deus te abençoe, viu?","Ai, meu Deus do céu."] },
    antonio: { nome: "Seu Antônio", desc: "68 anos, aposentado, desconfiado mas atrapalhado. Fala devagar e se perde nos assuntos.",
      fillers: ["Pera aí que a luz piscou aqui.","Minha mulher tá chamando, já volto.","Isso aqui é segurança mesmo?","Eu nunca mexi nisso direito."] },
    ansioso: { nome: "Ricardo, o ansioso", desc: "45 anos, acredita em tudo e se desespera fácil, mas erra todos os passos.",
      fillers: ["Meu Deus, será que eu perdi meu dinheiro??","Calma calma, tô nervoso aqui.","Posso fazer isso depois do trabalho?","Tô tremendo aqui, me ajuda."] }
  },
  tipos: {
    auto: "Detectar automaticamente",
    generico: "Genérico / não sei", pix: "Pix / transferência", suporte: "Falso suporte de banco",
    entrega: "Falsa entrega / encomenda", emprego: "Oferta de emprego / renda extra",
    parente: "“Parente com número novo”", premio: "Prêmio / sorteio", codigo: "Pedido de código/senha"
  },
  // nível l: 1 pouco leigo, 2 médio, 3 muito leigo, 4 extremo
  respostas: {
    generico: [
      {l:[1,2],t:"Pode explicar de novo? Não entendi direito o que o senhor quer de mim."},
      {l:[1,2,3],t:"Eu tô no meio de uma coisa agora, posso te responder mais tarde?"},
      {l:[2,3],t:"Não sei mexer muito bem nesse celular, vai com calma que eu me perco."},
      {l:[3,4],t:"Como assim? Eu não sei o que é isso, filho. Fala mais devagar."},
      {l:[3,4],t:"Apareceu uma coisa aqui na tela e eu apertei sem querer. O que eu faço agora?"},
      {l:[2,3,4],t:"Peraí que eu vou pegar um papel pra anotar. Repete tudo desde o começo?"},
      {l:[1,2],t:"Isso é seguro mesmo? Meu genro disse pra ter cuidado."},
      {l:[4],t:"Alô? Tá me ouvindo? Eu escuto mal desse lado. Pode repetir?"}
    ],
    pix: [
      {l:[1,2],t:"Fiz o Pix agora, mas o banco falou que pode demorar até 2 horas pra cair. Você confere depois?"},
      {l:[2,3],t:"Apareceu uma mensagem de erro aqui no aplicativo. Não sei o que significa."},
      {l:[2,3,4],t:"Eu não sei onde fica o Pix. É aquele ícone verde ou o azul?"},
      {l:[3,4],t:"O que é chave? Eu tenho que ter uma chave? Tenho só a da porta, kkk."},
      {l:[1,2],t:"Deu erro de limite. Vou ligar pro gerente amanhã pra aumentar."},
      {l:[2,3],t:"Pedi a senha do app e não lembro, vou procurar onde anotei."},
      {l:[3,4],t:"Meu neto trocou meu celular e sumiu o aplicativo do banco. Como eu baixo de novo?"},
      {l:[1,2,3],t:"Pode me passar de novo o nome e o valor? Quero anotar certinho pra não errar."}
    ],
    suporte: [
      {l:[1,2],t:"Mas o banco nunca me ligou antes. Como sei que é do banco mesmo?"},
      {l:[2,3],t:"Tô vendo meu cartão aqui, mas sem os óculos não leio os números. Espera um pouco."},
      {l:[3,4],t:"Então o senhor é do banco? Qual banco? Eu tenho conta em mais de um, não lembro."},
      {l:[2,3,4],t:"Pera, vou ligar do telefone fixo pra confirmar com a agência. Qual o número da agência mesmo?"},
      {l:[1,2],t:"Vou entrar no app pra ver se tem alguma notificação. Demora porque a internet é lenta aqui."},
      {l:[3,4],t:"Meu neto falou pra nunca passar dado por telefone. Mas o senhor parece educado..."},
      {l:[2,3],t:"Apareceu uma tela pedindo uma coisa, mas tá em inglês. O que eu clico?"}
    ],
    entrega: [
      {l:[1,2],t:"Eu não lembro de ter comprado nada. Qual loja que era?"},
      {l:[2,3],t:"Clico onde? Tem tanto botão aqui que eu me perco."},
      {l:[3,4],t:"Pacote? Acho que é a encomenda do meu neto. Posso pedir pra ele ver isso à noite?"},
      {l:[1,2,3],t:"A taxa de quanto? Vou ver se acho a carteira, deixei na outra bolsa."},
      {l:[2,3,4],t:"O link não abriu aqui. Pode mandar de novo? Às vezes o celular trava."},
      {l:[3,4],t:"Eu moro de aluguel, o carteiro sempre deixa na vizinha. Será que ela pegou?"}
    ],
    emprego: [
      {l:[1,2],t:"Interessante! Mas quanto tempo por dia? Eu cuido da minha mãe e tenho pouco tempo."},
      {l:[2,3],t:"Não sei mexer em computador, só no celular. Precisa de computador?"},
      {l:[1,2,3],t:"Tem contrato? Meu cunhado é advogado, posso mostrar pra ele primeiro?"},
      {l:[3,4],t:"Eu só sei mandar mensagem de voz. Tem como explicar por áudio?"},
      {l:[2,3,4],t:"Deixa eu ver com a minha esposa e eu volto a falar contigo, tá?"},
      {l:[1,2],t:"E como eu recebo? Eu só tenho poupança e não sei se aceita."}
    ],
    parente: [
      {l:[1,2],t:"Calma, quem é? Fala seu nome completo que eu tô confusa."},
      {l:[2,3],t:"Esse é o número novo? Me liga que eu quero ouvir sua voz."},
      {l:[3,4],t:"Meu filho, é você mesmo? Qual o nome da sua mãe? Só pra eu ter certeza, viu?"},
      {l:[1,2,3],t:"Vou perguntar pro seu tio se ele tem esse número. Ele sabe tudo da família."},
      {l:[2,3,4],t:"Agora não posso, tô esperando o ônibus. Mais tarde a gente resolve, tá?"},
      {l:[4],t:"Ah que saudade! E como vai a vovó? Ela ainda faz aquele bolo?"}
    ],
    premio: [
      {l:[1,2],t:"Eu ganhei? Mas eu não participei de sorteio nenhum. Como foi isso?"},
      {l:[2,3],t:"Que maravilha! Mas tem que pagar alguma coisa? Meu marido disse que não é pra pagar."},
      {l:[3,4],t:"Nossa Senhora, que notícia! Vou contar pra minha vizinha, ela vai ficar com inveja."},
      {l:[1,2,3],t:"Pode mandar por correio? Eu não confio muito em internet."},
      {l:[2,3,4],t:"Qual o nome da empresa mesmo? Quero anotar pra procurar depois no Google."}
    ],
    codigo: [
      {l:[1,2],t:"Chegou uma mensagem aqui mas tá escrito pra eu não passar pra ninguém. Tá certo?"},
      {l:[2,3],t:"Apareceu um número de 6 dígitos, mas minha vista tá ruim. Espera que eu leio."},
      {l:[3,4],t:"Código? Que código? Aquele da porta do prédio?"},
      {l:[2,3,4],t:"Ih, a mensagem sumiu da tela. Como eu faço pra voltar nela?"},
      {l:[1,2,3],t:"O código não chegou. Pede de novo? Às vezes demora."},
      {l:[3,4],t:"Acho que o número é 4 8 1... não, espera, era 4 8 7... Deixa eu ver de novo."}
    ],
    desconfiou: [
      {l:[1,2,3,4],t:"Robô? Eu? Kkk, eu nem sei o que é isso. Sou só uma pessoa tentando resolver."},
      {l:[1,2,3,4],t:"Credo, que coisa feia desconfiar de mim. Eu tô aqui tentando ajudar."},
      {l:[2,3,4],t:"Ué, mas eu só queria entender direito. Se não confia, eu peço pro meu filho te ligar."}
    ],
    irritado: [
      {l:[2,3,4],t:"Calma, não grita comigo que eu fico nervosa e esqueço tudo. Vou fazer, só preciso de um minutinho."},
      {l:[3,4],t:"Ai, desculpa, eu sou lerda mesmo. Fala de novo, bem devagar, que eu faço direitinho."},
      {l:[1,2],t:"Tô fazendo o possível, viu? Não é fácil pra mim. Um momento."}
    ]
  },
  golpes: [
    {n:"Pix errado / devolução",d:"Dizem que mandaram Pix por engano e pedem devolução, ou mostram comprovante falso. Confira o saldo no app do banco, nunca em print."},
    {n:"Falso suporte de banco",d:"Ligam ou mandam mensagem dizendo que há movimentação suspeita e pedem senha, código ou que você instale um app. Banco nunca pede isso."},
    {n:"Falsa entrega",d:"Mensagem com link para “pagar taxa” de encomenda. O link rouba dados do cartão."},
    {n:"Parente com número novo",d:"“Oi, mãe, mudei de número” e logo pedem dinheiro. Ligue para o número antigo ou faça uma pergunta que só a pessoa saberia."},
    {n:"Emprego / renda extra",d:"Promessa de ganho fácil que começa pedindo depósito ou dados. Trabalho de verdade não cobra para você começar."},
    {n:"Prêmio / sorteio",d:"Você “ganhou”, mas precisa pagar uma taxa. Prêmio legítimo não cobra para ser entregue."},
    {n:"Pedido de código",d:"Pedem o código que chegou por SMS ou WhatsApp. Esse código é a chave da sua conta: nunca repasse."},
    {n:"Falso leilão / venda",d:"Produto com preço muito baixo e pressa para pagar fora da plataforma. Pague sempre pelos meios oficiais."}
  ]
};
