/* ============================================================
   JOGO DA FORCA - LÓGICA (JavaScript puro)

   Ideia central: o jogo inteiro vive em um objeto chamado
   "state" (estado). Toda ação do jogador faz duas coisas:
     1) ALTERA o state (ex.: adiciona uma letra aos erros);
     2) chama render(), que DESENHA a tela a partir do state.
   Separar "dados" de "desenho" deixa o código simples de entender.
   ============================================================ */

/* Envolvemos tudo em uma função que se executa sozinha (IIFE).
   Assim as variáveis ficam "privadas" e não poluem a página.
   'use strict' ativa um modo que ajuda a evitar erros comuns. */
   (function () {
    'use strict';
  
    /* ---------- 1. CONFIGURAÇÃO ---------- */
  
    var MAX_ERRORS = 6; // limite de erros: no 6º erro o jogador perde
  
    // Banco de palavras. "c" = categoria, "w" = palavra, "h" = 3 dicas (da mais vaga à mais clara).
    // Para adicionar uma palavra, basta incluir uma nova linha neste formato.
    var WORDS = [
      { c: 'Animais', w: 'COELHO', h: ['Tem duas orelhas compridas', 'Dá saltos e adora cenoura', 'Mamífero fofo que vive em tocas'] },
      { c: 'Animais', w: 'TUBARÃO', h: ['Vive no mar', 'Sua nadadeira dorsal assusta banhistas', 'Peixe predador de dentes afiados'] },
      { c: 'Animais', w: 'ELEFANTE', h: ['Animal', 'É o maior mamífero que anda em terra firme', 'Tem presas de marfim e uma tromba longa'] },
      { c: 'Animais', w: 'BORBOLETA', h: ['Animal', 'Antes de ser assim, passou por um casulo', 'Inseto de asas coloridas que visita flores'] },
      { c: 'Animais', w: 'RINOCERONTE', h: ['Pesado e de pele grossa', 'Vive na savana africana e na Ásia', 'Tem um ou dois chifres sobre o nariz'] },
      { c: 'Animais', w: 'ORNITORRINCO', h: ['Vive na Austrália', 'É um mamífero que põe ovos', 'Tem bico de pato e cauda de castor'] },
      { c: 'Comida', w: 'ABACAXI', h: ['Fruta', 'Usa uma coroa de folhas pontiagudas', 'Casca áspera, polpa amarela e ácida'] },
      { c: 'Comida', w: 'BANANA', h: ['Fruta amarela', 'Vem em cachos', 'Descasca-se e é a favorita dos macacos'] },
      { c: 'Comida', w: 'CHOCOLATE', h: ['Comida', 'Nasce de uma semente tropical', 'Doce que derrete na boca, feito de cacau'] },
      { c: 'Comida', w: 'MACARRÃO', h: ['Prato italiano muito popular', 'Cozinha-se em água fervente', 'Vem em formatos como espaguete e penne'] },
      { c: 'Comida', w: 'BRIGADEIRO', h: ['Doce de festa infantil brasileiro', 'Feito com leite condensado e chocolate', 'Bolinha coberta de granulado'] },
      { c: 'Comida', w: 'PÃO-DE-QUEIJO', h: ['Típico de Minas Gerais', 'Lanche quentinho, ótimo com café', 'Bolinha assada de polvilho e queijo'] },
      { c: 'Natureza', w: 'VULCÃO', h: ['Tem uma cratera no topo', 'Pode entrar em erupção', 'Montanha que expele lava e cinzas'] },
      { c: 'Natureza', w: 'CASCATA', h: ['Água em movimento', 'A água despenca de um desnível', 'Queda de água em um rio, formando espuma'] },
      { c: 'Natureza', w: 'MONTANHA', h: ['Natureza', 'Quanto mais alta, mais fria', 'Grande elevação natural, às vezes com neve no topo'] },
      { c: 'Natureza', w: 'FLORESTA', h: ['Cheia de árvores', 'Abriga muitos animais e plantas', 'A Amazônia é a maior do tipo tropical'] },
      { c: 'Natureza', w: 'TEMPESTADE', h: ['Muda o tempo de repente', 'Traz nuvens escuras, vento e chuva forte', 'Tem relâmpagos e trovões'] },
      { c: 'Natureza', w: 'CORDILHEIRA', h: ['Fica em terreno bem alto', 'Os Andes são um exemplo', 'Longa sequência de montanhas encadeadas'] },
      { c: 'Lugares', w: 'FAROL', h: ['Lugar', 'Fica à beira-mar', 'Torre de luz giratória que orienta os navios'] },
      { c: 'Lugares', w: 'PRAIA', h: ['Faz calor e tem gente de chinelo', 'Areia, mar e guarda-sol', 'Faixa de areia à beira do mar'] },
      { c: 'Lugares', w: 'PIRÂMIDE', h: ['Lugar', 'Faraós descansavam dentro de uma', 'Monumento egípcio de base quadrada e quatro faces triangulares'] },
      { c: 'Lugares', w: 'AEROPORTO', h: ['Sempre cheio de malas', 'Tem pistas e portões de embarque', 'Onde os aviões pousam e decolam'] },
      { c: 'Lugares', w: 'BIBLIOTECA', h: ['Lugar', 'O silêncio é a regra da casa', 'Estantes cheias de livros para ler e emprestar'] },
      { c: 'Lugares', w: 'LABORATÓRIO', h: ['Local de trabalho de cientistas', 'Tem tubos de ensaio e microscópios', 'Cientistas fazem experimentos aqui'] },
      { c: 'Objetos', w: 'RELÓGIO', h: ['Objeto', 'Anda sem parar, mas nunca sai do lugar', 'Seus ponteiros marcam as horas'] },
      { c: 'Objetos', w: 'VIOLÃO', h: ['Música', 'Tem seis cordas', 'Instrumento de madeira, presença certa em rodas de samba'] },
      { c: 'Objetos', w: 'LANTERNA', h: ['Ajuda no escuro', 'Funciona com pilhas', 'Projeta um facho de luz e se carrega na mão'] },
      { c: 'Objetos', w: 'BICICLETA', h: ['Meio de transporte sem motor', 'Anda movida pela força das pernas', 'Duas rodas, guidão, pedais e corrente'] },
      { c: 'Objetos', w: 'GUARDA-CHUVA', h: ['Objeto', 'Aparece quando o tempo fecha', 'Abre-se sobre a cabeça para proteger da água'] },
      { c: 'Objetos', w: 'TELESCÓPIO', h: ['Aponta para o céu', 'Os astrônomos o usam', 'Instrumento com lentes que aproxima estrelas e planetas'] },
      { c: 'Tecnologia', w: 'TECLADO', h: ['Tecnologia', 'Tem mais de uma centena de teclas', 'Periférico em que se digita'] },
      { c: 'Tecnologia', w: 'MONITOR', h: ['Fica sobre a mesa do escritório', 'Mostra imagens', 'Tela que exibe o que o computador processa'] },
      { c: 'Tecnologia', w: 'INTERNET', h: ['Conecta o mundo todo', 'Funciona com Wi-Fi ou cabo', 'Rede mundial de computadores'] },
      { c: 'Tecnologia', w: 'NAVEGADOR', h: ['Programa usado todos os dias', 'Chrome e Firefox são exemplos', 'Abre sites e páginas da web'] },
      { c: 'Tecnologia', w: 'JAVASCRIPT', h: ['Tecnologia', 'Roda dentro do navegador', 'Linguagem que dá comportamento às páginas web'] },
      { c: 'Tecnologia', w: 'COMPUTADOR', h: ['Tecnologia', 'Processa dados em silêncio', 'Máquina com tela, teclado e processador'] }
    ];
  
    /* ---------- 2. REFERÊNCIAS AOS ELEMENTOS DA PÁGINA ----------
       Buscamos cada elemento UMA vez e guardamos aqui,
       em vez de procurá-los de novo a cada jogada. */
    var el = {
      word: document.getElementById('word'),         // onde aparecem as lacunas
      used: document.getElementById('used'),         // lista de letras usadas
      counter: document.getElementById('counter'),   // "2 / 6"
      msg: document.getElementById('msg'),           // mensagens ao jogador
      kb: document.getElementById('kb'),             // teclado virtual
      parts: document.querySelectorAll('.part'),     // as 6 partes do boneco (em ordem)
      hintList: document.getElementById('hintList'), // lista de dicas
      hintBtn: document.getElementById('hintBtn'),   // botão "Pedir dica"
      newBtn: document.getElementById('new'),        // botão "Nova partida"
      confetti: document.getElementById('confetti'), // camada da comemoração
      setup: document.getElementById('setup'),       // tela de configuração
      name: document.getElementById('name'),         // campo do nome
      levels: document.getElementById('levels'),     // botões de dificuldade
      hintChoices: document.getElementById('hintChoices'), // botões de nº de dicas
      setupNote: document.getElementById('setupNote'),
      startBtn: document.getElementById('startBtn'),
      player: document.getElementById('player'),     // linha "Jogador · Dificuldade · Categoria"
      cats: document.getElementById('cats'),         // botões de categoria
      result: document.getElementById('result'),     // tela de resultado
      resultTitle: document.getElementById('resultTitle'),
      resultText: document.getElementById('resultText'),
      resultWord: document.getElementById('resultWord'),
      resultStats: document.getElementById('resultStats'),
      resultScore: document.getElementById('resultScore'),
      againBtn: document.getElementById('againBtn'),
      changeBtn: document.getElementById('changeBtn'),
      viewBtn: document.getElementById('viewBtn')
    };

    /* Dificuldades: "max" = maior nº de letras da palavra; "hints" = dicas sugeridas.
       O jogador pode mudar as dicas na tela de configuração. */
    var LEVELS = {
      easy:   { label: 'Fácil',   max: 7,        hints: 3, note: 'Palavras de até 7 letras.' },
      medium: { label: 'Médio',   max: 9,        hints: 2, note: 'Palavras de 8 a 9 letras.' },
      hard:   { label: 'Difícil', max: Infinity, hints: 1, note: 'Palavras de 10 letras ou mais.' }
    };
    var settings = { name: '', level: 'medium', hints: 2, cat: 'all', score: { w: 0, l: 0 } }; // escolhas atuais + placar da sessão
    var resultTimer; // temporizador que abre a tela de resultado
  
    var state;     // guarda os dados da partida atual (criado em newGame)
    var last = ''; // última palavra sorteada (para não repetir em seguida)
    var confettiTimer; // guarda o temporizador que limpa os confetes (para poder cancelá-lo)
  
    /* ---------- 3. FUNÇÕES AUXILIARES ---------- */
  
    // Remove acentos e põe em maiúscula: "ç" -> "C", "ã" -> "A".
    // normalize('NFD') separa a letra do acento; o replace apaga só os acentos.
    // Assim "violão" é comparado como "VIOLAO" e o jogador não precisa digitar acento.
    function norm(c) {
      return c.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    }
  
    // Confere se o texto é exatamente uma letra de A a Z (expressão regular).
    function isLetter(c) { return /^[A-Z]$/.test(c); }
  
    // Classifica a palavra pela quantidade de letras (hífen não conta).
    function levelOf(word) {
      var n = norm(word).replace(/[^A-Z]/g, '').length;
      return n <= LEVELS.easy.max ? 'easy' : n <= LEVELS.medium.max ? 'medium' : 'hard';
    }

    // Palavras que combinam com a categoria ("all" = todas) e a dificuldade.
    function poolFor(cat, level) {
      return WORDS.filter(function (x) {
        return (cat === 'all' || x.c === cat) && levelOf(x.w) === level;
      });
    }

    // Formata milissegundos como m:ss.
    function fmtTime(ms) {
      var s = Math.round(ms / 1000);
      return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
    }

    // Mostra uma mensagem; "cls" escolhe a cor (warn, win ou lose).
    function say(text, cls) {
      el.msg.textContent = text;
      el.msg.className = cls || '';
    }
  
    /* ---------- 4. INICIAR PARTIDA ---------- */
  
    function newGame() {
      // Sorteia uma palavra da dificuldade escolhida (sem repetir a anterior).
      var pool = poolFor(settings.cat, settings.level);
      var i;
      do { i = Math.floor(Math.random() * pool.length); } while (pool[i].w === last && pool.length > 1);
      var entry = pool[i];
      last = entry.w;
  
      // Cria o estado do zero: aqui "reiniciamos tudo" de uma vez.
      state = {
        word: entry.w,         // palavra original, com acentos (para exibir)
        key: norm(entry.w),    // versão sem acentos (para comparar)
        hints: entry.h.slice(0, settings.hints), // só as dicas a que o jogador tem direito
        hintsShown: 0,         // quantas dicas já foram reveladas
        hits: [],              // letras acertadas
        misses: [],            // letras erradas
        over: false,           // true quando o jogo termina
        lost: false,           // true se terminou em derrota
        start: Date.now(),     // hora de início (para o tempo de jogo)
        elapsed: 0             // duração da partida, definida em finish()
      };

      // Fecha a tela de resultado da partida anterior.
      clearTimeout(resultTimer);
      el.result.hidden = true;
  
      // Remove qualquer comemoração da partida anterior.
      clearTimeout(confettiTimer);
      el.confetti.innerHTML = '';
  
      // Destrava e limpa o teclado virtual (remove as classes hit/miss).
      el.kb.classList.remove('locked');
      el.kb.querySelectorAll('button').forEach(function (b) { b.className = ''; });
  
      say('Escolha uma letra.', 'warn');
      render(); // desenha a tela com o estado zerado
    }
  
    /* ---------- 5. DESENHAR A TELA (render) ----------
       Lê o state e atualiza tudo o que o jogador vê.
       Não toma decisões de jogo: só mostra o estado atual. */
  
    function render() {
      // 5.1 PALAVRA: monta uma célula por caractere.
      el.word.innerHTML = '';
      state.word.split('').forEach(function (ch, i) {
        var k = state.key[i]; // mesma posição na versão sem acento
        var span = document.createElement('span');
        span.className = 'cell';
  
        if (!isLetter(k)) {
          // Hífen e afins: aparecem direto, sem lacuna.
          span.className += ' gap';
          span.textContent = ch;
        } else if (state.hits.indexOf(k) > -1) {
          // Letra já acertada: mostra (com o acento original).
          span.textContent = ch;
          // Se o jogador venceu, a letra recebe a classe "win" (animação de salto).
          // --i guarda a posição da letra, usada no CSS para escalonar a animação.
          if (state.over && !state.lost) {
            span.className += ' win';
            span.style.setProperty('--i', i);
          }
        } else if (state.lost) {
          // Perdeu: revela as letras que faltavam, em outra cor.
          span.className += ' reveal';
          span.textContent = ch;
        }
        // Caso contrário a célula fica vazia: só o traço da lacuna.
        el.word.appendChild(span);
      });
  
      // 5.2 LETRAS USADAS: acertos e erros juntos, cada um com sua classe de cor.
      var all = state.hits.map(function (l) { return '<span class="hit">' + l + '</span>'; })
        .concat(state.misses.map(function (l) { return '<span class="miss">' + l + '</span>'; }));
      el.used.innerHTML = all.join(' ') || '<span style="color:var(--muted)">—</span>';
  
      // 5.3 CONTADOR e DESENHO: a parte i aparece se o número de erros for maior que i.
      // Ex.: com 2 erros, as partes 0 (cabeça) e 1 (corpo) recebem a classe "show".
      el.counter.textContent = state.misses.length + ' / ' + MAX_ERRORS;
      el.parts.forEach(function (p, i) { p.classList.toggle('show', i < state.misses.length); });
  
      // 5.4 DICAS: lista só as que o jogador já pediu.
      el.hintList.innerHTML = '';
      for (var n = 0; n < state.hintsShown; n++) {
        var li = document.createElement('li');
        li.textContent = state.hints[n];
        el.hintList.appendChild(li);
      }
      var left = state.hints.length - state.hintsShown;           // dicas restantes
      el.hintBtn.disabled = state.over || left === 0;             // desativa se acabou o jogo ou as dicas
      el.hintBtn.textContent = state.hints.length === 0 ? 'Sem dicas nesta partida'
        : left === 0 ? 'Sem mais dicas' : 'Pedir dica (' + left + ')';
    }
  
    /* ---------- 6. REGRAS DE VITÓRIA E DERROTA ---------- */
  
    // Venceu quando TODA letra da palavra já está entre as acertadas.
    // every() devolve true só se a condição valer para todos os itens.
    function hasWon() {
      return state.key.split('').every(function (k) {
        return !isLetter(k) || state.hits.indexOf(k) > -1;
      });
    }
  
    // Comemoração: chuva de confetes feita com <div> e animação CSS.
    function celebrate() {
      var colors = ['#7a2e2e', '#b08d57', '#1c1b19', '#c9a9a6', '#d9c7a0']; // paleta discreta
      var total = 80; // quantidade de confetes
  
      for (var n = 0; n < total; n++) {
        var p = document.createElement('div');
        p.className = 'confetto';
        p.style.left = Math.random() * 100 + 'vw';                              // posição horizontal aleatória
        p.style.background = colors[Math.floor(Math.random() * colors.length)]; // cor aleatória da paleta
        p.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';           // cada um cai numa velocidade
        p.style.animationDelay = (Math.random() * 0.8) + 's';                    // saem em momentos diferentes
        p.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');          // deslize lateral (-80 a +80px)
        p.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');       // giro durante a queda
        el.confetti.appendChild(p);
      }
  
      // Depois de 6 segundos todos já caíram: limpamos para não acumular elementos.
      confettiTimer = setTimeout(function () { el.confetti.innerHTML = ''; }, 6000);
    }
  
    // Encerra a partida: bloqueia entradas, atualiza o placar e abre a tela de resultado.
    function finish(lost) {
      state.over = true;
      state.lost = lost;
      state.elapsed = Date.now() - state.start;
      el.kb.classList.add('locked'); // deixa o teclado "apagado"
      if (lost) {
        settings.score.l++;
        say('Fim de jogo, ' + settings.name + '. A palavra era ' + state.word + '.', 'lose');
      } else {
        settings.score.w++;
        say('Vitória, ' + settings.name + '! Você descobriu a palavra.', 'win');
        celebrate(); // só comemora quando o jogador vence
      }
      // Espera um instante: dá tempo de ver a palavra (e a onda de letras na vitória).
      clearTimeout(resultTimer);
      resultTimer = setTimeout(showResult, lost ? 900 : 1500);
    }

    // Frase de desempenho para a tela de vitória.
    function praise() {
      var e = state.misses.length;
      if (e === 0 && state.hintsShown === 0) return 'Partida perfeita: nenhum erro e nenhuma dica.';
      if (e === 0) return 'Sem nenhum erro!';
      if (e <= 2) return 'Excelente: apenas ' + e + (e === 1 ? ' erro.' : ' erros.');
      if (e <= 4) return 'Bem jogado. A forca passou perto.';
      return 'Vitória no limite: faltou pouco!';
    }

    // Monta e abre a tela de resultado a partir do state.
    function showResult() {
      var lost = state.lost;
      var uniq = state.key.split('').filter(function (k, i, a) { return isLetter(k) && a.indexOf(k) === i; }).length;
      var hintsTxt = state.hints.length ? state.hintsShown + ' de ' + state.hints.length : 'Sem dicas';
      var stats = lost
        ? [['Letras certas', state.hits.length + ' de ' + uniq], ['Erros', state.misses.length + ' de ' + MAX_ERRORS], ['Tempo', fmtTime(state.elapsed)]]
        : [['Erros', state.misses.length + ' de ' + MAX_ERRORS], ['Dicas', hintsTxt], ['Tempo', fmtTime(state.elapsed)]];

      el.result.className = 'result ' + (lost ? 'lose' : 'win');
      el.resultTitle.textContent = lost ? 'Não foi dessa vez, ' + settings.name : 'Vitória, ' + settings.name + '!';
      el.resultText.textContent = lost ? 'Você usou as ' + MAX_ERRORS + ' chances. A palavra era:' : praise();
      el.resultWord.textContent = state.word;

      el.resultStats.innerHTML = '';
      stats.forEach(function (st) {
        var d = document.createElement('div');
        var dt = document.createElement('dt'); dt.textContent = st[0];
        var dd = document.createElement('dd'); dd.textContent = st[1];
        d.appendChild(dt); d.appendChild(dd);
        el.resultStats.appendChild(d);
      });

      var w = settings.score.w, l = settings.score.l;
      el.resultScore.textContent = 'Sessão: ' + w + (w === 1 ? ' vitória' : ' vitórias') + ' · ' + l + (l === 1 ? ' derrota' : ' derrotas');
      el.againBtn.textContent = lost ? 'Tentar outra palavra' : 'Jogar de novo';

      el.result.hidden = false;
      el.againBtn.focus();
    }

    /* ---------- 7. PROCESSAR UMA TENTATIVA ----------
       Recebe o texto digitado/clicado e decide o que fazer.
       A ordem das verificações importa: do bloqueio ao resultado. */
  
    function guess(raw) {
      // 1) Jogo não começou ou já acabou? Ignora qualquer tentativa.
      if (!state || state.over) return;
  
      // 2) Entrada inválida (número, símbolo, mais de um caractere)? Só avisa.
      var c = norm(raw);
      if (raw.length !== 1 || !isLetter(c)) {
        say('Digite apenas letras de A a Z.', 'warn');
        return;
      }
  
      // 3) Letra repetida? Avisa e NÃO altera o estado (sem penalidade).
      if (state.hits.indexOf(c) > -1 || state.misses.indexOf(c) > -1) {
        say('A letra ' + c + ' já foi usada.', 'warn');
        return;
      }
  
      // 4) Tentativa válida: é acerto ou erro?
      var btn = el.kb.querySelector('[data-k="' + c + '"]'); // tecla virtual correspondente
      if (state.key.indexOf(c) > -1) {
        state.hits.push(c);          // acerto: guarda a letra
        btn.className = 'hit';
        say('A letra ' + c + ' está na palavra.', '');
      } else {
        state.misses.push(c);        // erro: soma ao contador (o desenho avança no render)
        btn.className = 'miss';
        if (state.misses.length === MAX_ERRORS - 1) say('A letra ' + c + ' não está na palavra. Atenção: última chance!', 'alert');
        else say('A letra ' + c + ' não está na palavra.', '');
      }
  
      // 5) Verifica se a partida terminou (vitória tem prioridade).
      if (hasWon()) finish(false);
      else if (state.misses.length >= MAX_ERRORS) finish(true);
  
      // 6) Atualiza a tela com o novo estado.
      render();
    }
  
    /* ---------- 8. EVENTOS (ligam o jogador ao código) ---------- */
  
    // 8.1 Teclado virtual: cria um botão para cada letra de A a Z.
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function (l) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = l;
      b.setAttribute('data-k', l); // "etiqueta" usada para achar a tecla depois
      b.addEventListener('click', function () { guess(l); }); // clique = tentativa
      el.kb.appendChild(b);
    });
  
    // 8.2 Teclado físico: escuta qualquer tecla pressionada na página.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !el.result.hidden) { el.result.hidden = true; return; }
      if (!el.setup.hidden) return;                          // digitando o nome: não é jogada
      if (e.ctrlKey || e.metaKey || e.altKey) return;        // deixa atalhos (Ctrl+C...) em paz
      if (e.key.length !== 1 || e.key === ' ') return;       // ignora Enter, Shift, setas e espaço
      guess(e.key);
    });
  
    // 8.3 Botão de dica: libera a próxima dica (sem penalidade).
    el.hintBtn.addEventListener('click', function () {
      if (state.over || state.hintsShown >= state.hints.length) return;
      state.hintsShown++;
      render();
    });
  
    // 8.4 Botão de nova partida.
    el.newBtn.addEventListener('click', newGame);
  
    /* ---------- 9. TELA DE CONFIGURAÇÃO ---------- */

    // Marca como selecionado o botão cujo atributo (data-level / data-n) bate com o valor.
    function mark(group, attr, value) {
      group.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-checked', String(b.getAttribute(attr) === String(value)));
      });
    }

    function refreshSetup() {
      mark(el.cats, 'data-cat', settings.cat);
      mark(el.levels, 'data-level', settings.level);
      mark(el.hintChoices, 'data-n', settings.hints);
      var n = poolFor(settings.cat, settings.level).length;
      el.setupNote.textContent = LEVELS[settings.level].note + ' ' + n + (n === 1 ? ' palavra disponível' : ' palavras disponíveis') + ' nesta combinação.';
      el.startBtn.disabled = el.name.value.trim() === '';
    }

    function openSetup() {
      clearTimeout(resultTimer);
      clearTimeout(confettiTimer);
      el.confetti.innerHTML = '';
      el.result.hidden = true;
      el.name.value = settings.name;
      el.setup.hidden = false;
      refreshSetup();
      el.name.focus();
    }

    // Ao trocar a dificuldade, sugere o nº de dicas dela (o jogador ainda pode mudar).
    el.cats.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      settings.cat = b.getAttribute('data-cat');
      refreshSetup();
    });
    el.levels.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      settings.level = b.getAttribute('data-level');
      settings.hints = LEVELS[settings.level].hints;
      refreshSetup();
    });
    el.hintChoices.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      settings.hints = Number(b.getAttribute('data-n'));
      refreshSetup();
    });
    el.name.addEventListener('input', refreshSetup);

    function start() {
      var n = el.name.value.trim();
      if (!n) { el.name.focus(); return; }
      if (n !== settings.name) settings.score = { w: 0, l: 0 }; // novo jogador, placar zerado
      settings.name = n;
      el.setup.hidden = true;
      el.player.innerHTML = '';
      el.player.appendChild(document.createTextNode(n + ' · ' + LEVELS[settings.level].label + ' · ' + (settings.cat === 'all' ? 'Todas as categorias' : settings.cat))); // textContent: seguro contra HTML digitado
      var change = document.createElement('button');
      change.type = 'button'; change.className = 'link'; change.textContent = 'Alterar';
      change.addEventListener('click', openSetup);
      el.player.appendChild(change);
      newGame();
    }
    el.startBtn.addEventListener('click', start);

    // Botões da tela de resultado.
    el.againBtn.addEventListener('click', newGame);
    el.changeBtn.addEventListener('click', openSetup);
    el.viewBtn.addEventListener('click', function () { el.result.hidden = true; });
    el.name.addEventListener('keydown', function (e) { if (e.key === 'Enter') start(); });

    /* ---------- 10. COMEÇAR ---------- */
    openSetup(); // pergunta nome, dificuldade e dicas antes da primeira partida
  })();