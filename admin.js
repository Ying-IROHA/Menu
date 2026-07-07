// 酒单管理后台：对 /api/cocktails 做增删改查。
// 保存后，客用酒单（script.js）和私人点单台（ledger.js）会在下次加载时
// 自动读到最新数据 —— 它们都从同一个后端 API 读取，不用再手改任何 JS 文件。

let cocktails = [];
let editingId = null;
let toastTimer;

const form = document.getElementById("cocktail-form");
const fieldName = document.getElementById("field-name");
const fieldZh = document.getElementById("field-zh");
const fieldBase = document.getElementById("field-base");
const fieldCollection = document.getElementById("field-collection");
const fieldPrice = document.getElementById("field-price");
const fieldLedgerPriority = document.getElementById("field-ledger-priority");
const fieldTasteNote = document.getElementById("field-taste-note");
const fieldIngredients = document.getElementById("field-ingredients");
const formError = document.getElementById("form-error");
const formTitle = document.getElementById("form-title");
const formModeIndex = document.getElementById("form-mode-index");
const formCancel = document.getElementById("form-cancel");
const formReset = document.getElementById("form-reset");
const formSubmit = document.getElementById("form-submit");

const searchInput = document.getElementById("admin-search");
const tableNode = document.getElementById("cocktail-table");
const emptyNode = document.getElementById("cocktail-empty");
const countNode = document.getElementById("cocktail-count");
const toast = document.getElementById("admin-toast");

const baseLabels = {
  Gin: "金酒", Vodka: "伏特加", Whiskey: "威士忌", Rum: "朗姆", Tequila: "龙舌兰",
  Brandy: "白兰地", Cognac: "干邑", Campari: "Campari", Mezcal: "梅斯卡尔",
  Pisco: "皮斯科", Bitters: "苦精", Mixed: "混合基酒", Other: "其他"
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);
}

async function loadCocktails() {
  const response = await fetch("/api/cocktails");
  if (!response.ok) throw new Error(`加载失败：${response.status}`);
  cocktails = await response.json();
}

function renderTable() {
  const keyword = searchInput.value.trim().toLowerCase();
  const visible = cocktails.filter(c => {
    if (!keyword) return true;
    return `${c.name} ${c.zh} ${c.base}`.toLowerCase().includes(keyword);
  });

  tableNode.innerHTML = visible.map(c => `
    <article class="cocktail-row" data-id="${c.id}">
      <div class="cocktail-row-main">
        <div class="name-line">
          <strong>${escapeHTML(c.name)}</strong>
          ${c.zh ? `<em>${escapeHTML(c.zh)}</em>` : ""}
          ${c.collection === "signature" ? `<em class="tag-signature">特调</em>` : ""}
        </div>
        <div class="meta-line">
          ${baseLabels[c.base] || c.base} · <span class="price">¥${c.price}</span>
          ${c.ledger_priority != null ? ` · 点单台置顶 #${c.ledger_priority}` : ""}
        </div>
      </div>
      <div class="cocktail-row-actions">
        <button type="button" class="edit-btn" data-id="${c.id}">编辑</button>
        <button type="button" class="delete-btn" data-id="${c.id}">删除</button>
      </div>
    </article>
  `).join("");

  tableNode.style.display = visible.length ? "grid" : "none";
  emptyNode.hidden = visible.length !== 0;
  countNode.textContent = `共 ${cocktails.length} 款`;
}

function resetForm() {
  editingId = null;
  form.reset();
  fieldBase.value = "Gin";
  fieldCollection.value = "classic";
  formTitle.textContent = "新增酒款";
  formModeIndex.textContent = "01";
  formCancel.hidden = true;
  formSubmit.textContent = "保存酒款";
  formError.hidden = true;
  formError.textContent = "";
}

function startEdit(id) {
  const cocktail = cocktails.find(c => c.id === id);
  if (!cocktail) return;

  editingId = id;
  fieldName.value = cocktail.name;
  fieldZh.value = cocktail.zh || "";
  fieldBase.value = cocktail.base;
  fieldCollection.value = cocktail.collection;
  fieldPrice.value = cocktail.price;
  fieldLedgerPriority.value = cocktail.ledger_priority ?? "";
  fieldTasteNote.value = cocktail.taste_note || "";
  fieldIngredients.value = (cocktail.ingredients || []).join("\n");

  formTitle.textContent = `编辑 · ${cocktail.name}`;
  formModeIndex.textContent = "01";
  formCancel.hidden = false;
  formSubmit.textContent = "保存修改";
  formError.hidden = true;
  formError.textContent = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function buildPayload() {
  const ingredients = fieldIngredients.value
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  const ledgerPriorityRaw = fieldLedgerPriority.value.trim();

  return {
    name: fieldName.value.trim(),
    zh: fieldZh.value.trim(),
    base: fieldBase.value,
    collection: fieldCollection.value,
    price: Number(fieldPrice.value) || 0,
    taste_note: fieldTasteNote.value.trim(),
    ingredients,
    ledger_priority: ledgerPriorityRaw ? Number(ledgerPriorityRaw) : null
  };
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const payload = buildPayload();
  if (!payload.name) return;

  formSubmit.disabled = true;
  try {
    const url = editingId ? `/api/cocktails/${editingId}` : "/api/cocktails";
    const method = editingId ? "PUT" : "POST";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      throw new Error(detail.detail || `保存失败：${response.status}`);
    }

    await loadCocktails();
    renderTable();
    showToast(editingId ? "已保存修改" : "已新增酒款");
    resetForm();
  } catch (error) {
    formError.textContent = error.message;
    formError.hidden = false;
  } finally {
    formSubmit.disabled = false;
  }
});

formCancel.addEventListener("click", resetForm);
formReset.addEventListener("click", resetForm);

searchInput.addEventListener("input", renderTable);

tableNode.addEventListener("click", async event => {
  const editBtn = event.target.closest(".edit-btn");
  const deleteBtn = event.target.closest(".delete-btn");

  if (editBtn) {
    startEdit(Number(editBtn.dataset.id));
    return;
  }

  if (deleteBtn) {
    const cocktail = cocktails.find(c => c.id === Number(deleteBtn.dataset.id));
    if (!cocktail) return;
    if (!window.confirm(`确定删除「${cocktail.name}」吗？此操作无法撤销。`)) return;

    try {
      const response = await fetch(`/api/cocktails/${cocktail.id}`, { method: "DELETE" });
      if (!response.ok && response.status !== 204) throw new Error(`删除失败：${response.status}`);
      if (editingId === cocktail.id) resetForm();
      await loadCocktails();
      renderTable();
      showToast("已删除");
    } catch (error) {
      showToast(error.message || "删除失败");
    }
  }
});

async function init() {
  resetForm();
  tableNode.innerHTML = `<p style="opacity:.6;padding:12px 4px">正在加载…</p>`;
  try {
    await loadCocktails();
    renderTable();
  } catch (error) {
    console.error(error);
    tableNode.innerHTML = `<p style="opacity:.6;padding:12px 4px">加载失败，请确认后端服务已启动，然后刷新页面。</p>`;
    countNode.textContent = "加载失败";
  }
}

init();
