const birthdayAge = document.querySelector("#birthday-age");
const birthdayMessage = document.querySelector("#birthday-message");
const birthdayTimer = document.querySelector("#birthday-timer");
const timerDays = document.querySelector("#timer-days");
const timerHours = document.querySelector("#timer-hours");
const timerMinutes = document.querySelector("#timer-minutes");
const timerSeconds = document.querySelector("#timer-seconds");
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

  timerDays.textContent = formatTimerValue(days, 3);
  timerHours.textContent = formatTimerValue(hours);
  timerMinutes.textContent = formatTimerValue(minutes);
  timerSeconds.textContent = formatTimerValue(seconds);
}

updateBirthdayCounter();
setInterval(updateBirthdayCounter, 1000);
