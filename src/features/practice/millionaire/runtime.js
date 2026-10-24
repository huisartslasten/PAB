function shuffle(values, random = Math.random) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

const PRIZES = Object.freeze([0, 100, 500, 1000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000]);

export function createMillionaireRuntime({ questions = [], distractorService = null, random = Math.random } = {}) {
  let bank = shuffle(questions.filter(item => item?.question && item?.answer), random);
  let index = 0;
  let score = 0;
  let finished = false;
  let lifelines = { fiftyFifty: true, askSomeone: true, askAudience: true };
  let current = null;
  let options = [];
  let activeOptions = [];
  let message = '';

  function start() {
    bank = shuffle(bank, random);
    index = 0;
    score = 0;
    finished = bank.length === 0;
    lifelines = { fiftyFifty: true, askSomeone: true, askAudience: true };
    current = null;
    options = [];
    activeOptions = [];
    message = '';
    return snapshot();
  }

  async function buildOptions(item) {
    const existing = Array.isArray(item.answer_options) ? item.answer_options.filter(Boolean).map(String) : [];
    if (existing.length >= 2) return shuffle([...new Set([String(item.answer), ...existing])], random).slice(0, 4);
    if (!distractorService) throw new Error('De centrale MC-distractorservice is niet beschikbaar.');
    const distractors = await distractorService.generateMultipleChoiceDistractors({
      question: item.question,
      correctAnswer: item.answer,
      subject: item.subject,
      subvak: item.subvak,
      context: { lessonType: item.type || 'questions', theme: item.title || item.subject },
      optionCount: 4
    });
    return shuffle([String(item.answer), ...distractors], random).slice(0, 4);
  }

  async function next() {
    if (finished) return snapshot();
    current = bank[index] || null;
    if (!current) {
      finished = true;
      return snapshot();
    }
    options = await buildOptions(current);
    activeOptions = [...options];
    message = '';
    return snapshot();
  }

  function choose(answer) {
    if (finished || !current) return snapshot();
    const correct = String(answer) === String(current.answer);
    if (!correct) {
      finished = true;
      message = `Helaas! Het juiste antwoord was: ${current.answer}`;
      return snapshot();
    }
    score = PRIZES[Math.min(index + 1, PRIZES.length - 1)];
    index += 1;
    if (score >= 1000000 || index >= bank.length) {
      finished = true;
      message = '🎉 1.000.000 botjes!';
      return snapshot();
    }
    current = null;
    activeOptions = [];
    message = 'Goed!';
    return snapshot();
  }

  function useFiftyFifty() {
    if (!lifelines.fiftyFifty || !current) return snapshot();
    lifelines = { ...lifelines, fiftyFifty: false };
    const incorrect = activeOptions.filter(option => String(option) !== String(current.answer));
    const keepIncorrect = shuffle(incorrect, random).slice(0, Math.max(1, Math.ceil(incorrect.length / 2) - 1));
    activeOptions = shuffle([current.answer, ...keepIncorrect], random);
    return snapshot();
  }

  function useAskSomeone() {
    if (!lifelines.askSomeone || !current) return snapshot();
    lifelines = { ...lifelines, askSomeone: false };
    const likely = random() < 0.72 ? current.answer : activeOptions.find(option => String(option) !== String(current.answer));
    message = `📞 Vraag iemand: ${likely || current.answer}`;
    return snapshot();
  }

  function useAskAudience() {
    if (!lifelines.askAudience || !current) return snapshot();
    lifelines = { ...lifelines, askAudience: false };
    const total = activeOptions.length || 4;
    const correctShare = 52 + Math.floor(random() * 24);
    const remaining = 100 - correctShare;
    const others = activeOptions.filter(option => String(option) !== String(current.answer));
    const shares = new Map([[String(current.answer), correctShare]]);
    let left = remaining;
    others.forEach((option, optionIndex) => {
      const share = optionIndex === others.length - 1 ? left : Math.floor(random() * (left + 1));
      shares.set(String(option), share);
      left -= share;
    });
    message = `📊 Publiek: ${shares.get(String(current.answer)) || Math.round(100 / total)}% kiest ${current.answer}.`;
    return snapshot();
  }

  function snapshot() {
    return Object.freeze({
      prize: score,
      nextPrize: PRIZES[Math.min(index + 1, PRIZES.length - 1)],
      questionNumber: current ? index + 1 : index,
      totalQuestions: bank.length,
      current,
      options: [...activeOptions],
      lifelines: { ...lifelines },
      finished,
      message
    });
  }

  return Object.freeze({ start, next, choose, useFiftyFifty, useAskSomeone, useAskAudience, snapshot });
}
