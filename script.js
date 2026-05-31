
const phraseology = [
  { phrase: "Байдики бити",                meaning: "Нічого не робити, ледарювати, марно витрачати час" },
  { phrase: "Вішати локшину на вуха",      meaning: "Навмисно вводити когось в оману, розповідати небилиці" },
  { phrase: "Зарубати на носі",            meaning: "Дуже добре запам'ятати щось важливе, щоб ніколи не забути" },
  { phrase: "Пекти раків",                 meaning: "Сильно червоніти від сорому або збентеження" },
  { phrase: "Товкти воду в ступі",         meaning: "Займатися безглуздою, марною справою без жодного результату" },
  { phrase: "Ведмідь на вухо наступив",    meaning: "Про людину без музичного слуху, яка не вміє правильно відтворювати мелодію" },
  { phrase: "Крутитися як білка в колесі", meaning: "Весь час бути зайнятим, без перерви вирішувати багато справ одночасно" },
  { phrase: "Як сніг на голову",            meaning: "Про щось несподіване, що сталося раптово і без попередження" },
  { phrase: "Говорити на різних мовах",    meaning: "Не розуміти один одного, бути нездатними порозумітися через різні погляди або інтереси" },
  { phrase: "Зарубати на носі",            meaning: "Дуже добре запам'ятати щось важливе, щоб ніколи не забути" },
];

// ─── MASCOT CONFIG ───────────────────────────────────
const MASCOTS = {
  hello:   "приві.png",
  correct: "тестфулл.png",
  wrong:   "неправильно.png",
  finish:  "тестфулл.png"
};

// ─── STATE ───────────────────────────────────────────
const quiz = {
  questions: [], current: 0, correct: 0, wrong: 0,
  answered: false, limit: 5   // default
};

// ─── DOM ─────────────────────────────────────────────
const cardsGrid        = document.getElementById("cardsGrid");
const quizSetup        = document.getElementById("quizSetup");
const quizMain         = document.getElementById("quizMain");
const quizCard         = document.getElementById("quizCard");
const quizPhrase       = document.getElementById("quizPhrase");
const quizOptions      = document.getElementById("quizOptions");
const quizCounter      = document.getElementById("quizCounter");
const quizScore        = document.getElementById("quizScore");
const quizProgressFill = document.getElementById("quizProgressFill");
const quizResult       = document.getElementById("quizResult");
const resultIcon       = document.getElementById("resultIcon");
const resultTitle      = document.getElementById("resultTitle");
const resultText       = document.getElementById("resultText");
const restartBtn       = document.getElementById("restartBtn");
const mascotWrap       = document.getElementById("mascotWrap");
const mascotText       = document.getElementById("mascotText");
const mascotImg        = document.getElementById("mascotImg");
const mascotFallback   = document.getElementById("mascotFallback");

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active");
    p.style.animation = "none";
  });
  const target = document.getElementById(`page-${pageId}`);
  if (!target) return;
  target.classList.add("active");
  void target.offsetWidth;
  target.style.animation = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.querySelectorAll(".nav-btn[data-page]").forEach(b =>
    b.classList.toggle("active", b.dataset.page === pageId)
  );
  closeNav();
}

function showTopic(topicId) {
  showPage(topicId);
  if (topicId === "phraseology") {
    switchTab("learn");
    buildCards();
  }
}

document.addEventListener("click", e => {
  const topicBtn = e.target.closest("[data-topic]");
  const pageBtn  = e.target.closest("[data-page]");
  if (topicBtn && !topicBtn.disabled) { showTopic(topicBtn.dataset.topic); return; }
  if (pageBtn) showPage(pageBtn.dataset.page);
});

const burgerBtn = document.getElementById("burgerBtn");
const mainNav   = document.getElementById("mainNav");
burgerBtn.addEventListener("click", () => {
  burgerBtn.classList.toggle("open");
  mainNav.classList.toggle("open");
});
function closeNav() {
  burgerBtn.classList.remove("open");
  mainNav.classList.remove("open");
}

document.querySelectorAll(".tab-btn").forEach(btn =>
  btn.addEventListener("click", () => switchTab(btn.dataset.tab))
);
function switchTab(tabId) {
  document.querySelectorAll(".tab-btn").forEach(b =>
    b.classList.toggle("active", b.dataset.tab === tabId)
  );
  document.querySelectorAll(".tab-content").forEach(t => {
    t.classList.remove("active"); t.style.animation = "none";
  });
  const tc = document.getElementById(`tab-${tabId}`);
  if (!tc) return;
  tc.classList.add("active");
  void tc.offsetWidth;
  tc.style.animation = "";
  if (tabId === "quiz") showQuizSetup();
}

function buildCards() {
  cardsGrid.innerHTML = "";
  phraseology.forEach((item, idx) => {
    const card = document.createElement("div");
    card.className = "flashcard";
    card.innerHTML = `
      <div class="flashcard-inner">
        <div class="card-front">
          <div class="card-phrase">${item.phrase}</div>
          <div class="card-hint">Натисни, щоб дізнатися значення</div>
        </div>
        <div class="card-back">
          <div class="card-back-label">Значення</div>
          <div class="card-meaning">${item.meaning}</div>
        </div>
      </div>`;
    card.addEventListener("click", () => card.classList.toggle("flipped"));
    card.style.animation = `fadeUp .45s var(--ease) ${idx * 0.07}s both`;
    cardsGrid.appendChild(card);
  });
}

function showQuizSetup() {
  quizSetup.classList.remove("hidden");
  quizMain.classList.add("hidden");
  quizResult.classList.add("hidden");

  document.querySelectorAll(".count-btn").forEach(b =>
    b.classList.toggle("active", parseInt(b.dataset.count) === quiz.limit || (b.dataset.count === "all" && quiz.limit === phraseology.length))
  );
}

document.querySelectorAll(".count-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    quiz.limit = btn.dataset.count === "all" ? phraseology.length : parseInt(btn.dataset.count);
    document.querySelectorAll(".count-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

document.getElementById("startQuizBtn").addEventListener("click", () => {
  quizSetup.classList.add("hidden");
  quizMain.classList.remove("hidden");
  initQuiz();
});

const shuffle = arr => [...arr].sort(() => Math.random() - .5);

function getWrongs(correctIdx) {
  return shuffle(phraseology.filter((_, i) => i !== correctIdx).map(p => p.meaning)).slice(0, 3);
}

function initQuiz() {
  const pool = shuffle(phraseology).slice(0, quiz.limit);
  quiz.questions = pool.map((item, idx) => ({
    phrase: item.phrase,
    correct: item.meaning,
    wrongs: getWrongs(phraseology.indexOf(item))
  }));
  quiz.current = 0; quiz.correct = 0; quiz.wrong = 0; quiz.answered = false;
  quizResult.classList.add("hidden");
  quizCard.style.display = "";
  renderQuestion();
}

function renderQuestion() {
  const { current, questions } = quiz;
  const total = questions.length;
  if (current >= total) { showResult(); return; }

  const q = questions[current];
  quizProgressFill.style.width = `${(current / total) * 100}%`;
  quizCounter.textContent = `Питання ${current + 1} / ${total}`;
  updateScore();
  quizPhrase.textContent = q.phrase;

  quizOptions.innerHTML = "";
  shuffle([q.correct, ...q.wrongs]).forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => handleAnswer(btn, opt, q.correct));
    quizOptions.appendChild(btn);
  });
  quiz.answered = false;
}

function handleAnswer(btn, chosen, correct) {
  if (quiz.answered) return;
  quiz.answered = true;
  const allBtns = quizOptions.querySelectorAll(".option-btn");
  allBtns.forEach(b => b.disabled = true);

  if (chosen === correct) {
    btn.classList.add("correct"); quiz.correct++;
    showMascot("correct", "Круто! Правильно! 🎉");
  } else {
    btn.classList.add("wrong"); quiz.wrong++;
    allBtns.forEach(b => { if (b.textContent === correct) b.classList.add("correct"); });
    showMascot("wrong", "Не здавайся, спробуй ще! 💪");
  }
  updateScore();
  setTimeout(() => { quiz.current++; renderQuestion(); }, 1800);
}

function updateScore() {
  quizScore.textContent = `✅ ${quiz.correct}   ❌ ${quiz.wrong}`;
}

function showResult() {
  quizProgressFill.style.width = "100%";
  quizCard.style.display = "none";
  quizResult.classList.remove("hidden");

  const { correct, questions } = quiz;
  const pct = Math.round((correct / questions.length) * 100);
  const levels = [
    [100, "🏆", "Ідеально!",          `Усі ${questions.length} відповіді правильні. Ти справжній знавець!`],
    [70,  "🌟", "Чудовий результат!", `Правильно: ${correct} із ${questions.length} (${pct}%). Ще трохи — і ти досконалий!`],
    [40,  "💡", "Непогано!",          `Правильно: ${correct} із ${questions.length} (${pct}%). Спробуй ще раз!`],
    [0,   "📚", "Варто повторити!",   `Правильно: ${correct} із ${questions.length}. Поверніться до карток і спробуйте ще!`],
  ];
  const [, icon, title, text] = levels.find(([min]) => pct >= min);
  resultIcon.textContent = icon;
  resultTitle.textContent = title;
  resultText.textContent  = text;

  showMascot("finish", pct >= 70
    ? "Молодець! Так тримати! 🥳"
    : "Гарна спроба! Ти стараєшся — це головне! 💛"
  , 6000);
}

restartBtn.addEventListener("click", showQuizSetup);

let mTimer1, mTimer2;

function showMascot(type, text, duration = 3000) {
  clearTimeout(mTimer1); clearTimeout(mTimer2);
  mascotWrap.classList.remove("show", "hide");

  const src = MASCOTS[type];
  if (src) {
    mascotImg.style.display = "";
    mascotFallback.style.display = "none";
    mascotImg.src = src;
    mascotImg.onerror = () => {
      mascotImg.style.display = "none";
      mascotFallback.style.display = "flex";
    };
  }

  mascotText.textContent = text;

  mTimer1 = setTimeout(() => {
    mascotWrap.classList.add("show");
    mTimer2 = setTimeout(hideMascot, duration);
  }, 60);
}

function hideMascot() {
  mascotWrap.classList.remove("show");
  mascotWrap.classList.add("hide");
}

function mascotEntrance() {
  showMascot("hello", "Привіт! Вивчаймо українську разом!", 4000);
}

mascotEntrance();
