const title = document.querySelector("#announcement-title");
const time = document.querySelector("#announcement-time");
const content = document.querySelector("#announcement-content");

function formatDate(value) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(value));
}

function createBlock(block) {
  if (block.type === "heading") {
    const heading = document.createElement("h2");
    heading.textContent = block.text;
    return heading;
  }

  if (block.type === "bullets") {
    const list = document.createElement("ul");
    (block.items || []).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.append(li);
    });
    return list;
  }

  const paragraph = document.createElement("p");
  paragraph.textContent = block.text || "";
  return paragraph;
}

async function loadAnnouncement() {
  const slug = new URLSearchParams(window.location.search).get("slug");
  if (!slug) {
    title.textContent = "announcement not found";
    content.innerHTML = "<p>No announcement slug was provided in the URL.</p>";
    return;
  }

  try {
    const response = await fetch(`data/announcements/${encodeURIComponent(slug)}.json?v=${Date.now()}`);
    if (!response.ok) throw new Error("Missing announcement.");
    const announcement = await response.json();

    document.title = `${announcement.title} | jakublabs.xyz`;
    title.textContent = announcement.title;
    time.dateTime = announcement.datetime;
    time.textContent = formatDate(announcement.datetime);
    content.replaceChildren(...(announcement.content || []).map(createBlock));
  } catch {
    title.textContent = "announcement not found";
    time.textContent = "";
    content.innerHTML = "<p>That announcement JSON could not be loaded.</p>";
  }
}

loadAnnouncement();
