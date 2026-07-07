// 私人点单台：酒款目录与结账历史现在都存在后端数据库里（见 backend/），
// 不再只存在这台设备的 localStorage 中，换设备/换浏览器也能看到同一份记录。
// 当前正在编辑、还没结账的账单（current/note/discount）仍然缓存在
// localStorage 里，纯粹是为了防止刷新页面时丢失正在录入的账单。

const CART_STORAGE_KEY = "nocturne-ledger-cart-v1";
let activeBase = "All";
let catalog = [];
let orders = [];
let cart = loadCart();
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

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    return {
      current: saved?.current && typeof saved.current === "object" ? saved.current : {},
      note: typeof saved?.note === "string" ? saved.note : "",
      discount: [50, 55, 60, 65, 70, 75, 80, 85, 90, 100].includes(Number(saved?.discount)) ? Number(saved.discount) : 100
    };
  } catch {
    return { current: {}, note: "", discount: 100 };
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);
}

function currentItems() {
  return Object.entries(cart.current).map(([name, quantity]) => ({
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
  result.total = Math.round(result.subtotal * cart.discount / 100);
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

// 把后端字段名（created_at / unit_price）转成前端一直在用的驼峰写法，
// 这样下面的渲染逻辑不用改。
function normalizeOrder(order) {
  return {
    id: order.id,
    createdAt: order.created_at,
    note: order.note,
    discount: order.discount,
    cups: order.cups,
    subtotal: order.subtotal,
    total: order.total,
    items: order.items.map(item => ({
      name: item.name,
      zh: item.zh,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      subtotal: item.subtotal
    }))
  };
}

async function loadCatalog() {
  const response = await fetch("/api/ledger/catalog");
  if (!response.ok) throw new Error(`加载酒款目录失败：${response.status}`);
  catalog = await response.json();
}

async function loadHistory() {
  const response = await fetch("/api/orders?limit=100");
  if (!response.ok) throw new Error(`加载历史记录失败：${response.status}`);
  const data = await response.json();
  orders = data.map(normalizeOrder);
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

  catalogNode.innerHTML = visible.map(item => `
    <button class="drink-button ${item.is_off_menu ? "special" : ""}" type="button" data-drink="${item.name}">
      <small>${item.is_off_menu ? "OFF MENU · 固定价格" : `${baseLabels[item.base] || item.base}`}</small>
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
  billOriginal.textContent = cart.discount < 100 && totals.subtotal ? `原价 ¥${totals.subtotal}` : "";
  discountSelect.value = String(cart.discount);
  noteInput.value = cart.note;
  clearButton.disabled = items.length === 0;
  checkoutButton.disabled = items.length === 0;
}

function formatDate(timestamp) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
  }).format(new Date(timestamp));
}

function renderHistory() {
  historyNode.innerHTML = orders.map(record => `
    <article class="history-card" data-order-id="${record.id}">
      <div class="history-head">
        <div><div class="history-date">${formatDate(record.createdAt)}</div>${record.note ? `<div class="history-note">${escapeHTML(record.note)}</div>` : ""}${record.discount && record.discount < 100 ? `<div class="history-note">${discountLabel(record.discount)} · 原价 ¥${record.subtotal}</div>` : ""}</div>
        <div class="history-head-right">
          <span class="history-price">¥${record.total}</span>
          <button type="button" class="history-delete" data-order-id="${record.id}" title="删除这条记录" aria-label="删除这条记录">✕</button>
        </div>
      </div>
      <div class="history-items">
        ${record.items.map(item => `<div class="history-row"><span>${escapeHTML(item.zh || item.name)} × ${item.quantity}</span><span>¥${item.subtotal}</span></div>`).join("")}
      </div>
    </article>
  `).join("");
  historyNode.style.display = orders.length ? "grid" : "none";
  historyEmpty.style.display = orders.length ? "none" : "block";
  const totalCups = orders.reduce((sum, record) => sum + record.cups, 0);
  historySummary.textContent = orders.length ? `${orders.length} 次记录 · ${totalCups} 杯` : "尚无记录";
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
  cart.current[button.dataset.drink] = (Number(cart.current[button.dataset.drink]) || 0) + 1;
  saveCart();
  renderBill();
  showToast(`${catalog.find(item => item.name === button.dataset.drink)?.zh || button.dataset.drink} 已加入`);
});

billLines.addEventListener("click", event => {
  const button = event.target.closest("[data-change]");
  if (!button) return;
  const name = button.dataset.drink;
  const next = (Number(cart.current[name]) || 0) + Number(button.dataset.change);
  if (next > 0) cart.current[name] = next;
  else delete cart.current[name];
  saveCart();
  renderBill();
});

noteInput.addEventListener("input", () => {
  cart.note = noteInput.value;
  saveCart();
});

discountSelect.addEventListener("change", () => {
  cart.discount = Number(discountSelect.value);
  saveCart();
  renderBill();
});

clearButton.addEventListener("click", () => {
  if (!currentItems().length || !window.confirm("确定清空当前账单吗？")) return;
  cart.current = {};
  cart.note = "";
  cart.discount = 100;
  saveCart();
  renderBill();
});

checkoutButton.addEventListener("click", async () => {
  const items = currentItems();
  if (!items.length) return;

  checkoutButton.disabled = true;
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        note: cart.note.trim(),
        discount: cart.discount,
        items: items.map(({ drink, quantity }) => ({ name: drink.name, quantity }))
      })
    });
    if (!response.ok) throw new Error(`结账失败：${response.status}`);
    const order = await response.json();

    orders.unshift(normalizeOrder(order));
    cart.current = {};
    cart.note = "";
    cart.discount = 100;
    saveCart();
    renderBill();
    renderHistory();
    showToast("结账完成，记录已保存到服务器");
    document.querySelector(".history-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    console.error(error);
    showToast("结账失败，请检查后端服务是否在运行");
  } finally {
    checkoutButton.disabled = currentItems().length === 0;
  }
});

historyNode.addEventListener("click", async event => {
  const button = event.target.closest(".history-delete");
  if (!button) return;
  if (!window.confirm("确定删除这条记录吗？此操作无法撤销。")) return;

  const orderId = button.dataset.orderId;
  try {
    const response = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
    if (!response.ok && response.status !== 204) throw new Error(`删除失败：${response.status}`);
    orders = orders.filter(record => String(record.id) !== String(orderId));
    renderHistory();
    showToast("记录已删除");
  } catch (error) {
    console.error(error);
    showToast("删除失败，请重试");
  }
});

async function init() {
  renderFilters();
  renderBill();
  catalogNode.innerHTML = `<p style="opacity:.6;padding:24px">正在加载酒款…</p>`;
  historyNode.innerHTML = "";
  historySummary.textContent = "正在加载…";

  try {
    await Promise.all([loadCatalog(), loadHistory()]);
    renderCatalog();
    renderBill();
    renderHistory();
  } catch (error) {
    console.error(error);
    catalogNode.innerHTML = `<p style="opacity:.6;padding:24px">加载失败，请确认后端服务已启动，然后刷新页面。</p>`;
    catalogEmpty.style.display = "none";
    historySummary.textContent = "加载失败";
  }
}

init();
