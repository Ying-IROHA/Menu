// 留言墙：留言存在后端数据库里（见 backend/），谁都能看、谁都能留言，
// 删除留言是管理员的事（走 /api/guestbook/{id} 的 DELETE，不在这个页面里）。

const MARKS = ["✦", "♥", "☾", "✎", "✧"];

let messages = [];
let activeMark = MARKS[0];
let toastTimer;

const form = document.getElementById("gb-form");
const nameInput = document.getElementById("gb-name");
const messageInput = document.getElementById("gb-message");
const countLabel = document.getElementById("gb-count");
const marksNode = document.getElementById("gb-marks");
const submitButton = document.getElementById("gb-submit");
const wallNode = document.getElementById("gb-wall");
const emptyNode = document.getElementById("gb-empty");
const summaryNode = document.getElementById("gb-summary");
const toast = document.getElementById("gb-toast");

function escapeHTML(value = "") {
  return String(value).replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
}

function formatDate(timestamp) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    timeZone: "Asia/Shanghai"
  }).format(new Date(timestamp));
}

function renderMarks() {
  marksNode.innerHTML = MARKS.map(mark => `
    <button type="button" class="gb-mark ${mark === activeMark ? "active" : ""}" data-mark="${mark}" aria-label="选择印记 ${mark}">${mark}</button>
  `).join("");
}

function renderWall() {
  wallNode.innerHTML = messages.map(entry => `
    <article class="gb-card">
      <div class="gb-card-top">
        <span class="gb-card-mark" aria-hidden="true">${entry.mark}</span>
        <span class="gb-card-date">${formatDate(entry.created_at)}</span>
      </div>
      <p class="gb-card-message">${escapeHTML(entry.message)}</p>
      <span class="gb-card-name">— ${entry.name ? escapeHTML(entry.name) : "一位深夜来客"}</span>
    </article>
  `).join("");
  wallNode.style.display = messages.length ? "grid" : "none";
  emptyNode.style.display = messages.length ? "none" : "block";
  summaryNode.textContent = messages.length ? `${messages.length} 条印记` : "尚无印记";
}

async function loadMessages() {
  const response = await fetch("/api/guestbook?limit=200");
  if (!response.ok) throw new Error(`加载留言失败：${response.status}`);
  messages = await response.json();
}

marksNode.addEventListener("click", event => {
  const button = event.target.closest("[data-mark]");
  if (!button) return;
  activeMark = button.dataset.mark;
  renderMarks();
});

messageInput.addEventListener("input", () => {
  countLabel.textContent = String(messageInput.value.length);
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (!message) {
    showToast("写点什么再留下印记吧");
    messageInput.focus();
    return;
  }

  submitButton.disabled = true;
  try {
    const response = await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameInput.value.trim(),
        message,
        mark: activeMark
      })
    });
    if (!response.ok) throw new Error(`留言失败：${response.status}`);
    const entry = await response.json();

    messages.unshift(entry);
    renderWall();
    form.reset();
    activeMark = MARKS[0];
    renderMarks();
    countLabel.textContent = "0";
    showToast("印记已留下");
    wallNode.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    console.error(error);
    showToast("留言失败，请检查后端服务是否在运行");
  } finally {
    submitButton.disabled = false;
  }
});

async function init() {
  renderMarks();
  summaryNode.textContent = "正在加载…";
  try {
    await loadMessages();
    renderWall();
  } catch (error) {
    console.error(error);
    wallNode.innerHTML = "";
    emptyNode.style.display = "block";
    emptyNode.querySelector("p").textContent = "加载失败，请确认后端服务已启动，然后刷新页面。";
    summaryNode.textContent = "加载失败";
  }
}

init();
