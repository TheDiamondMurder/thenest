const birthdayAge = document.querySelector("#birthday-age");
const birthdayMessage = document.querySelector("#birthday-message");
const birthdayTimer = document.querySelector("#birthday-timer");
const timerDays = document.querySelector("#timer-days");
const timerHours = document.querySelector("#timer-hours");
const timerMinutes = document.querySelector("#timer-minutes");
const timerSeconds = document.querySelector("#timer-seconds");
const survivalPercentage = document.querySelector("#survival-percentage");
const typingTitle = document.querySelector(".typing-title");
const birthYear = 2007;
const birthdayMonth = 10;
const birthdayDay = 28;

function getBirthdayForYear(year) {
  return new Date(year, birthdayMonth, birthdayDay);
}

function getNextBirthday(now) {
  const birthdayThisYear = getBirthdayForYear(now.getFullYear());
  const isBirthday =
    now.getMonth() === birthdayMonth && now.getDate() === birthdayDay;

  if (isBirthday) {
    return { birthday: birthdayThisYear, isBirthday: true };
  }

  if (now > birthdayThisYear) {
    return { birthday: getBirthdayForYear(now.getFullYear() + 1), isBirthday: false };
  }

  return { birthday: birthdayThisYear, isBirthday: false };
}

function formatTimerValue(value, minLength = 2) {
  return String(value).padStart(minLength, "0");
}

function updateBirthdayCounter() {
  const now = new Date();
  const { birthday, isBirthday } = getNextBirthday(now);
  const age = birthday.getFullYear() - birthYear;

  birthdayAge.textContent = `turning ${age}`;

  if (isBirthday) {
    birthdayMessage.hidden = false;
    birthdayTimer.hidden = true;
    return;
  }

  birthdayMessage.hidden = true;
  birthdayTimer.hidden = false;

  const difference = birthday.getTime() - now.getTime();
  const totalSeconds = Math.max(0, Math.floor(difference / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  timerDays.textContent = String(days);
  timerHours.textContent = formatTimerValue(hours);
  timerMinutes.textContent = formatTimerValue(minutes);
  timerSeconds.textContent = formatTimerValue(seconds);
}

function formatSurvivalPercentage(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return "--%";
  return `${numericValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
}

function updateSurvivalChance() {
  fetch(`survival.json?live=${Date.now()}`)
    .then((response) => response.json())
    .then((data) => {
      survivalPercentage.textContent = formatSurvivalPercentage(data.percentage);
    })
    .catch(() => {
      survivalPercentage.textContent = "--%";
    });
}

function typeHeroTitle() {
  if (!typingTitle) return;
  const target = typingTitle.dataset.text || typingTitle.textContent;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    typingTitle.innerHTML = `<span>jakublabs.</span><span class="accent">xyz</span>`;
    typingTitle.classList.add("is-typed");
    return;
  }

  let index = 0;
  typingTitle.textContent = "";

  const tick = () => {
    index += 1;
    const current = target.slice(0, index);
    if (current.includes(".")) {
      const [base, suffix = ""] = current.split(".");
      typingTitle.innerHTML = `<span>${base}.</span><span class="accent">${suffix}</span>`;
    } else {
      typingTitle.textContent = current;
    }

    if (index < target.length) {
      setTimeout(tick, index < 5 ? 70 : 54);
      return;
    }

    setTimeout(() => typingTitle.classList.add("is-typed"), 550);
  };

  setTimeout(tick, 260);
}

function initScrollReveals() {
  const targets = document.querySelectorAll(".birthday-counter, .survival-card, .tool-card, .news-card, .announcement-article, .privacy-notice, .privacy-details, .link-button");
  if (!targets.length) return;

  targets.forEach((target, index) => {
    target.classList.add("reveal-on-scroll");
    target.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
  });

  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  targets.forEach((target) => observer.observe(target));
}

updateBirthdayCounter();
updateSurvivalChance();
typeHeroTitle();
initScrollReveals();
setInterval(updateBirthdayCounter, 1000);
