const catalog = [
  ["Off-menu Special", "临时特调", "Signature", 128],
  ["Mezcal Negroni", "梅斯卡尔尼格罗尼", "Signature", 128],
  ["Perfect Manhattan", "完美曼哈顿", "Signature", 128],
  ["Sake Martini", "清酒马天尼", "Signature", 128],
  ["Lemon Cake", "柠檬蛋糕", "Signature", 128],
  ["Americano", "美国佬", "Other", 58],
  ["Aviation", "飞行", "Gin", 98],
  ["Bee’s Knees", "蜂膝", "Gin", 78],
  ["Black Russian", "黑俄罗斯", "Vodka", 78],
  ["Bloody Mary", "血腥玛丽", "Vodka", 78],
  ["Boulevardier", "花花公子", "Whiskey", 108],
  ["Cardinale", "卡迪纳尔", "Gin", 88],
  ["Clover Club", "三叶草俱乐部", "Gin", 88],
  ["Cosmopolitan", "大都会", "Vodka", 78],
  ["Cuba Libre", "自由古巴", "Rum", 68],
  ["Daiquiri", "大吉利", "Rum", 68],
  ["Dry Martini", "干马天尼", "Gin", 98],
  ["Espresso Martini", "意式浓缩马天尼", "Vodka", 88],
  ["French 75", "法式 75", "Gin", 108],
  ["French Martini", "法式马天尼", "Vodka", 78],
  ["Garibaldi", "加里波第", "Other", 68],
  ["Gin Fizz", "金菲士", "Gin", 78],
  ["Grand Margarita", "特级玛格丽特", "Tequila", 98],
  ["Hemingway special", "海明威", "Rum", 88],
  ["John Collins", "约翰·柯林斯", "Gin", 78],
  ["Last Word", "遗言", "Gin", 128],
  ["Long Island Iced Tea", "长岛冰茶", "Other", 108],
  ["Manhattan", "曼哈顿", "Whiskey", 98],
  ["Margarita", "玛格丽特", "Tequila", 88],
  ["Martinez", "马丁内斯", "Gin", 98],
  ["Negroni", "尼格罗尼", "Gin", 88],
  ["New York Sour", "纽约酸", "Whiskey", 98],
  ["Old Fashioned", "古典", "Whiskey", 78],
  ["Pisco Sour", "皮斯科酸", "Other", 88],
  ["Ramos Gin Fizz", "拉莫斯金菲士", "Gin", 98],
  ["Sea Breeze", "海风", "Vodka", 68],
  ["Sex on the beach", "性感沙滩", "Vodka", 68],
  ["Sidecar", "边车", "Brandy", 168],
  ["Tequila Sunrise", "龙舌兰日出", "Tequila", 78],
  ["Trinidad Sour", "特立尼达酸", "Other", 158],
  ["Whiskey Sour", "威士忌酸", "Whiskey", 88],
  ["White Lady", "白色佳人", "Gin", 88]
].map(([name, zh, base, price]) => ({ name, zh, base, price }));

const baseLabels = {
  All: "全部",
  Gin: "金酒",
  Vodka: "伏特加",
  Whiskey: "威士忌",
  Rum: "朗姆",
  Tequila: "龙舌兰",
  Brandy: "白兰地",
  Signature: "特调",
  Other: "其他"
};

const STORAGE_KEY = "nocturne-private-ledger-v2";
let activeBase = "All";
let state = loadState();
let toastTimer;

const searchInput = document.getElementById("ledger-search");
const filtersNode = document.getElementById("ledger-filters");
const catalogNode = document.getElementById("ledger-catalog");
const catalogEmpty = document.getElementById("catalog-empty");
const noteInput = document.getElementById("ledger-note");
const billLines = document.getElementById("bill-lines");
const billEmpty = document.getElementById("bill-empty");
const billBadge = document.getElementById("bill-badge");
const billTotal = document.getElementById("bill-total");
const billOriginal = document.getElementById("bill-original");
const discountSelect = document.getElementById("bill-discount");
const clearButton = document.getElementById("bill-clear");
const checkoutButton = document.getElementById("bill-checkout");
const historyNode = document.getElementById("ledger-history");
const historyEmpty = document.getElementById("ledger-history-empty");
const historySummary = document.getElementById("history-summary");
const toast = document.getElementById("ledger-toast");

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      current: saved?.current && typeof saved.current === "object" ? saved.current : {},
      note: typeof saved?.note === "string" ? saved.note : "",
      discount: [50, 55, 60, 65, 70, 75, 80, 85, 90, 100].includes(Number(saved?.discount)) ? Number(saved.discount) : 100,
      history: Array.isArray(saved?.history) ? saved.history : []
    };
  } catch {
    return { current: {}, note: "", discount: 100, history: [] };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);
}

function currentItems() {
  return Object.entries(state.current).map(([name, quantity]) => ({
    drink: catalog.find(item => item.name === name),
    quantity: Number(quantity) || 0
  })).filter(item => item.drink && item.quantity > 0);
}

function calculate(items = currentItems()) {
  const result = items.reduce((totals, item) => {
    totals.cups += item.quantity;
    totals.subtotal += item.drink.price * item.quantity;
    return totals;
  }, { cups: 0, subtotal: 0 });
  result.total = Math.round(result.subtotal * state.discount / 100);
  return result;
}

function discountLabel(discount) {
  return discount === 100 ? "原价" : `${discount / 10} 折`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
}

function renderFilters() {
  filtersNode.innerHTML = Object.entries(baseLabels).map(([value, label]) => `
    <button class="ledger-filter ${activeBase === value ? "active" : ""}" type="button" data-base="${value}">${label}</button>
  `).join("");
}

function renderCatalog() {
  const keyword = searchInput.value.trim().toLowerCase();
  const visible = catalog.filter(item => {
    const baseMatch = activeBase === "All" || item.base === activeBase;
    const searchMatch = !keyword || `${item.name} ${item.zh}`.toLowerCase().includes(keyword);
    return baseMatch && searchMatch;
  });

  catalogNode.innerHTML = visible.map((item, index) => `
    <button class="drink-button ${item.base === "Signature" ? "special" : ""}" type="button" data-drink="${item.name}">
      <small>${item.base === "Signature" ? "OFF MENU · 固定价格" : `N° ${String(catalog.indexOf(item)).padStart(2, "0")} · ${baseLabels[item.base]}`}</small>
      <strong>${item.name}</strong>
      <em>${item.zh}</em>
      <span>¥${item.price} · 点击加入</span>
    </button>
  `).join("");
  catalogNode.style.display = visible.length ? "grid" : "none";
  catalogEmpty.style.display = visible.length ? "none" : "block";
}

function renderBill() {
  const items = currentItems();
  const totals = calculate(items);
  billLines.innerHTML = items.map(({ drink, quantity }) => `
    <article class="bill-line">
      <div><strong>${drink.name}</strong><small>${drink.zh}</small></div>
      <div class="bill-line-right">
        <span class="bill-line-price">¥${drink.price * quantity}</span>
        <div class="quantity">
          <button type="button" data-change="-1" data-drink="${drink.name}" aria-label="减少一杯">−</button>
          <span>${quantity}</span>
          <button type="button" data-change="1" data-drink="${drink.name}" aria-label="增加一杯">＋</button>
        </div>
      </div>
    </article>
  `).join("");
  billLines.style.display = items.length ? "block" : "none";
  billEmpty.style.display = items.length ? "none" : "block";
  billBadge.textContent = `${totals.cups} 杯`;
  billTotal.textContent = `¥${totals.total}`;
  billOriginal.textContent = state.discount < 100 && totals.subtotal ? `原价 ¥${totals.subtotal}` : "";
  discountSelect.value = String(state.discount);
  noteInput.value = state.note;
  clearButton.disabled = items.length === 0;
  checkoutButton.disabled = items.length === 0;
}

function formatDate(timestamp) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
  }).format(new Date(timestamp));
}

function renderHistory() {
  historyNode.innerHTML = state.history.map(record => `
    <article class="history-card">
      <div class="history-head">
        <div><div class="history-date">${formatDate(record.createdAt)}</div>${record.note ? `<div class="history-note">${escapeHTML(record.note)}</div>` : ""}${record.discount && record.discount < 100 ? `<div class="history-note">${discountLabel(record.discount)} · 原价 ¥${record.subtotal}</div>` : ""}</div>
        <span class="history-price">¥${record.total}</span>
      </div>
      <div class="history-items">
        ${record.items.map(item => `<div class="history-row"><span>${escapeHTML(item.zh || item.name)} × ${item.quantity}</span><span>¥${item.subtotal}</span></div>`).join("")}
      </div>
    </article>
  `).join("");
  historyNode.style.display = state.history.length ? "grid" : "none";
  historyEmpty.style.display = state.history.length ? "none" : "block";
  const totalCups = state.history.reduce((sum, record) => sum + record.cups, 0);
  historySummary.textContent = state.history.length ? `${state.history.length} 次记录 · ${totalCups} 杯` : "尚无记录";
}

filtersNode.addEventListener("click", event => {
  const button = event.target.closest("[data-base]");
  if (!button) return;
  activeBase = button.dataset.base;
  renderFilters();
  renderCatalog();
});

searchInput.addEventListener("input", renderCatalog);
catalogNode.addEventListener("click", event => {
  const button = event.target.closest("[data-drink]");
  if (!button) return;
  state.current[button.dataset.drink] = (Number(state.current[button.dataset.drink]) || 0) + 1;
  saveState();
  renderBill();
  showToast(`${catalog.find(item => item.name === button.dataset.drink)?.zh || button.dataset.drink} 已加入`);
});

billLines.addEventListener("click", event => {
  const button = event.target.closest("[data-change]");
  if (!button) return;
  const name = button.dataset.drink;
  const next = (Number(state.current[name]) || 0) + Number(button.dataset.change);
  if (next > 0) state.current[name] = next;
  else delete state.current[name];
  saveState();
  renderBill();
});

noteInput.addEventListener("input", () => {
  state.note = noteInput.value;
  saveState();
});

discountSelect.addEventListener("change", () => {
  state.discount = Number(discountSelect.value);
  saveState();
  renderBill();
});

clearButton.addEventListener("click", () => {
  if (!currentItems().length || !window.confirm("确定清空当前账单吗？")) return;
  state.current = {};
  state.note = "";
  state.discount = 100;
  saveState();
  renderBill();
});

checkoutButton.addEventListener("click", () => {
  const items = currentItems();
  if (!items.length) return;
  const totals = calculate(items);
  state.history.unshift({
    id: Date.now(),
    createdAt: new Date().toISOString(),
    note: state.note.trim(),
    cups: totals.cups,
    subtotal: totals.subtotal,
    discount: state.discount,
    total: totals.total,
    items: items.map(({ drink, quantity }) => ({
      name: drink.name,
      zh: drink.zh,
      quantity,
      unitPrice: drink.price,
      subtotal: drink.price * quantity
    }))
  });
  state.history = state.history.slice(0, 100);
  state.current = {};
  state.note = "";
  state.discount = 100;
  saveState();
  renderBill();
  renderHistory();
  showToast("结账完成，记录已保存");
  document.querySelector(".history-panel").scrollIntoView({ behavior: "smooth", block: "start" });
});

renderFilters();
renderCatalog();
renderBill();
renderHistory();
