// progress.js – handles tracking, streaks, storage, sync

const today = new Date().toLocaleDateString();
const progressLog = JSON.parse(localStorage.getItem("progressLog") || "[]");

export function saveHabits(habitElements) {
  const completedHabits = [];

  habitElements.forEach(el => {
    const name = el.nextElementSibling.textContent;
    const status = el.checked;
    completedHabits.push({ name, status });
  });

  const completedCount = completedHabits.filter(h => h.status).length;

  const emoji = completedCount === habitElements.length
    ? "✅"
    : completedCount >= habitElements.length / 2
    ? "🔁"
    : "❌";

  const logEntry = {
    date: today,
    emoji,
    habits: completedHabits,
    completedTasks: completedCount
  };

  const filtered = progressLog.filter(entry => entry.date !== today);
  filtered.push(logEntry);
  localStorage.setItem("progressLog", JSON.stringify(filtered));
  updateStreak(filtered);
}

export function getTodayHabits() {
  return progressLog.find(p => p.date === today);
}

export function updateStreak(log = progressLog) {
  let streak = 0;
  let maxStreak = Number(localStorage.getItem("maxStreak") || 0);
  let current = new Date();

  for (let i = log.length - 1; i >= 0; i--) {
    const logDate = new Date(log[i].date);
    const diff = (current - logDate) / (1000 * 60 * 60 * 24);

    if (Math.round(diff) === 0 || Math.round(diff) === 1) {
      streak++;
      current = logDate;
    } else {
      break;
    }
  }

  if (streak > maxStreak) {
    localStorage.setItem("maxStreak", streak);
  }

  localStorage.setItem("currentStreak", streak);
}

export function applyTodayHabitState(habitElements) {
  const todayLog = getTodayHabits();
  if (!todayLog) return;

  habitElements.forEach(el => {
    const name = el.nextElementSibling.textContent;
    const match = todayLog.habits.find(h => h.name === name);
    if (match) el.checked = match.status;
  });
}

export function saveReflection(text) {
  const journal = JSON.parse(localStorage.getItem("dailyJournal") || "{}");
  journal[today] = text;
  localStorage.setItem("dailyJournal", JSON.stringify(journal));
}

export function getReflection(date = today) {
  const journal = JSON.parse(localStorage.getItem("dailyJournal") || "{}");
  return journal[date] || "";
}

export function getMaxStreak() {
  return Number(localStorage.getItem("maxStreak") || 0);
}

export function getCurrentStreak() {
  return Number(localStorage.getItem("currentStreak") || 0);
}

export function getProgressLog() {
  return progressLog;
}

export function clearProgressLog() {
  localStorage.removeItem("progressLog");
  localStorage.removeItem("currentStreak");
  localStorage.removeItem("maxStreak");
}