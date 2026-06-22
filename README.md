<div align="center">

<p><sub>AFTER MIDNIGHT · COCKTAIL ARCHIVE</sub></p>

# 𝑵𝒐𝒄𝒕𝒖𝒓𝒏𝒆

### 一份写给夜晚，并持续生长的调酒索引

<p>
  <a href="https://ying-iroha.github.io/Menu/"><img alt="Live Menu" src="https://img.shields.io/badge/LIVE_MENU-c9a86a?style=for-the-badge&labelColor=171013"></a>
  <img alt="Vanilla JavaScript" src="https://img.shields.io/badge/VANILLA_JS-9a4056?style=for-the-badge&labelColor=171013">
  <img alt="Local First" src="https://img.shields.io/badge/LOCAL_FIRST-c9a86a?style=for-the-badge&labelColor=171013">
</p>

[进入在线酒单](https://ying-iroha.github.io/Menu/) · [打开私人点单台](https://ying-iroha.github.io/Menu/ledger.html)

</div>

---

## About the night

Nocturne 是一个无框架、无后端的鸡尾酒酒单，也是一册属于深夜的私人饮用记录。

客人看到的是安静、可搜索的经典鸡尾酒档案；调酒师使用独立点单台记录酒款、数量、折扣、实收金额与每一次饮用。设计以黑莓酒红、旧金、纸张颗粒和装饰艺术线条为核心，希望它更像一本酒吧里的旧册页，而不只是一张网页。

## Two surfaces

| 客用酒单 | 私人点单台 |
| :--- | :--- |
| 中英文酒名与风味描述 | 快速搜索并加入当前账单 |
| 经典鸡尾酒 / 特调双层索引 | 数量增减与实时合计 |
| 六大基酒与「其他」筛选 | 原价至 5 折的心情折扣 |
| 点击展开配方 | 临时特调固定价记录 |
| 响应式手机排版 | 结账归档与饮用历史 |

> 私人点单台使用浏览器 `localStorage` 保存最近 100 次记录。没有账号、数据库或远程上传。

## The menu

当前酒单收录经典配方，并为继续加入特调预留了独立分类。搜索会同时匹配英文名、中文名、基酒、风味、价格和配方材料。

价格以人民币显示，主力区间控制在 ¥100 以下；用料或工序更特殊的酒款保留更高档位。私人点单台另设 ¥128 的「临时特调」，用于记录酒单外点单。

## Local ledger

访问 [`ledger.html`](./ledger.html) 可打开独立点单界面。它不会在客用酒单中出现入口，适合由调酒师根据客人口述自行记录。

每次结账会保存：

- 日期与时间
- 酒款及数量
- 本次备注
- 原价、折扣与实收金额

数据与访问它的浏览器绑定。清除站点数据、使用无痕模式或更换设备时，历史记录不会自动同步。GitHub Pages 上的页面文件本身仍然是公开资源，因此它是「个人使用界面」，并不是带身份认证的私密后台。

## Project anatomy

```text
Menu/
├── index.html          # 客用酒单
├── style.css           # 客用酒单视觉
├── script.js           # 酒款、配方、价格与筛选逻辑
├── ledger.html         # 私人点单台
├── ledger.css          # 点单台视觉
├── ledger.js           # 点单、折扣、结账与本地历史
└── assets/
    └── nocturne-menu-qr.png
```

这是一个纯静态项目，不需要构建步骤或依赖安装。直接打开 `index.html` 即可预览；使用本地 HTTP 服务时，`localStorage` 的行为会更接近 GitHub Pages。

## Updating the collection

客用酒款、配方与价格维护在 [`script.js`](./script.js) 中。私人点单台使用精简目录维护在 [`ledger.js`](./ledger.js) 中；增加酒款或调整价格时，需要同步更新两个文件。

公开酒单中的新特调可加入：

```js
{
  name: "Your Signature",
  zh: "你的特调",
  base: "Gin",
  collection: "signature",
  ingredients: ["45ml Gin", "..."],
}
```

## Scan the archive

<div align="center">
  <a href="https://ying-iroha.github.io/Menu/">
    <img src="./assets/nocturne-menu-qr.png" width="360" alt="Nocturne 鸡尾酒酒单二维码" />
  </a>
  <p><sub>扫码进入 Nocturne Cocktail Archive</sub></p>
</div>

---

<div align="center">
  <sub>Drink with intention · Record what mattered</sub>
</div>
