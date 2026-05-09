const newsList = document.querySelector("#news-list");

function formatDate(value) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function renderAnnouncements(announcements) {
  if (!announcements.length) {
    newsList.innerHTML = `
      <article class="news-card">
        <span class="tool-number">empty</span>
        <h2>no announcements yet</h2>
        <p>quiet day at jakublabs headquarters.</p>
      </article>
    `;
    return;
  }

  newsList.replaceChildren(
    ...announcements
      .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
      .map((announcement, index) => {
        const card = document.createElement("a");
        card.className = "news-card";
        card.href = `announcements/${encodeURIComponent(announcement.slug)}/`;
        card.innerHTML = `
          <span class="tool-number">${String(index + 1).padStart(2, "0")}</span>
          <time>${formatDate(announcement.datetime)}</time>
          <h2>${announcement.title}</h2>
          <p>${announcement.summary || "Read the full announcement."}</p>
        `;
        return card;
      }),
  );
}

async function loadAnnouncements() {
  try {
    const response = await fetch(`data/index.json?v=${Date.now()}`);
    if (!response.ok) throw new Error("Could not load announcements.");
    renderAnnouncements(await response.json());
  } catch {
    newsList.innerHTML = `
      <article class="news-card">
        <span class="tool-number">error</span>
        <h2>announcements failed to load</h2>
        <p>the JSON file could not be read.</p>
      </article>
    `;
  }
}

loadAnnouncements();
