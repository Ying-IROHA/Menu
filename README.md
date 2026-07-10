<div align="center">

<p><sub>AFTER MIDNIGHT · COCKTAIL ARCHIVE</sub></p>

# Nocturne 鸡尾酒酒单

### 一份写给夜晚，并持续生长的调酒索引

<p>
  <a href="https://ying-iroha.online/menu/index.html"><img alt="进入在线酒单" src="./assets/readme-live-menu.svg" height="46"></a>
  &nbsp;
  <a href="https://ying-iroha.online/menu/ledger.html"><img alt="打开私人点单台" src="./assets/readme-private-ledger.svg" height="46"></a>
</p>

<p><sub>VANILLA JS FRONTEND · FASTAPI + SQLITE BACKEND</sub></p>

</div>

---

## About

Nocturne 是一份鸡尾酒酒单，也是一套给吧台使用的轻量记录工具。客人看到的是可搜索、可筛选、可展开配方的经典鸡尾酒档案；调酒师可以通过独立点单台记录酒款、数量、折扣、备注和结账历史；管理员可以在后台维护酒单和留言。

项目没有前端构建步骤。页面是原生 HTML/CSS/JavaScript，数据由 `backend/` 中的 FastAPI 服务提供，并保存在本地 SQLite 数据库里。

## Surfaces

| 页面 | 路径 | 用途 |
| :--- | :--- | :--- |
| 客用酒单 | `/menu.html` 或 `/menu/` | 浏览经典与特调酒款、搜索基酒/风味/配方、展开查看配方 |
| 私人点单台 | `/menu/ledger.html` | 快速加入酒款、调整数量、选择折扣、结账并保存历史 |
| 留言墙 | `/menu/guestbook.html` | 访客公开留言，后台可删除 |
| 管理后台 | `/menu/admin.html` | 新增、编辑、删除酒款，并管理留言 |
| API 文档 | `/docs` | FastAPI 自动生成的接口文档 |

## Features

- 客用酒单支持经典酒款和特调两层分类，并按基酒继续筛选。
- 搜索会匹配英文名、中文名、基酒、风味描述、价格和配方材料。
- 点单台从后端读取同一份酒单，支持临时特调、数量增减、备注、折扣和结账历史。
- 管理后台可以维护酒款名称、中文名、基酒、分类、价格、风味、配方和点单台置顶顺序。
- 留言墙支持公开读取和提交，删除留言需要管理员认证。
- 首次启动会自动创建 `backend/bar_menu.db` 并写入初始酒单数据。

> 正在编辑、尚未结账的点单会暂存在浏览器 `localStorage`，用于防止刷新页面时丢失当前账单；已经结账的记录会写入后端数据库。

## Project Anatomy

```text
BarMenu/
├─ index.html                 # 静态环境下跳转到 Menu/
├─ README.md
├─ assets/                    # README 按钮、二维码等展示资源
├─ backend/
│  ├─ main.py                 # FastAPI 路由、鉴权、静态文件托管
│  ├─ models.py               # SQLAlchemy 数据模型
│  ├─ schemas.py              # Pydantic 请求/响应模型
│  ├─ database.py             # SQLite 连接与 session
│  ├─ seed_data.py            # 首次启动写入的初始酒单
│  ├─ requirements.txt
│  └─ Dockerfile
└─ Menu/
   ├─ index.html              # 客用酒单
   ├─ script.js
   ├─ style.css
   ├─ ledger.html             # 私人点单台
   ├─ ledger.js
   ├─ ledger.css
   ├─ guestbook.html          # 留言墙
   ├─ guestbook.js
   ├─ guestbook.css
   ├─ admin.html              # 管理后台
   ├─ admin.js
   ├─ admin.css
   └─ assets/
```

## Local Run

需要 Python 3.10 或以上版本。

```powershell
cd "C:\Users\ALIENWARE\Desktop\Programs\BarMenu\backend"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

启动后打开：

- 客用酒单：http://127.0.0.1:8000/menu.html
- 私人点单台：http://127.0.0.1:8000/menu/ledger.html
- 留言墙：http://127.0.0.1:8000/menu/guestbook.html
- 管理后台：http://127.0.0.1:8000/menu/admin.html
- API 文档：http://127.0.0.1:8000/docs

第一次运行时会自动生成 `backend/bar_menu.db`。这个文件是本地运行数据源，已经被 `.gitignore` 忽略；如果要迁移或备份酒单、点单历史和留言，备份这个数据库文件即可。

## LAN Use

如果希望同一 Wi-Fi 下的手机或平板访问点单台，可以把服务监听到局域网：

```powershell
uvicorn main:app --host 0.0.0.0 --port 8000
```

然后在其他设备浏览器中访问：

```text
http://<这台电脑的局域网 IP>:8000/menu/ledger.html
```

## Admin Security

`/menu/admin.html` 和酒单写操作接口已经使用 HTTP Basic Auth 保护。默认账号密码是：

```text
admin / nocturne
```

这只适合本地测试。部署到公网前务必通过环境变量改掉：

```powershell
$env:ADMIN_USERNAME="your-admin-name"
$env:ADMIN_PASSWORD="a-long-private-password"
uvicorn main:app --host 0.0.0.0 --port 8000
```

Linux 或 systemd 环境可以设置同名环境变量：

```ini
[Service]
Environment=ADMIN_USERNAME=your-admin-name
Environment=ADMIN_PASSWORD=a-long-private-password
```

生产环境还应放在 HTTPS 后面，否则 Basic Auth 密码会在 HTTP 明文传输中暴露。

## API Overview

| 方法 | 路径 | 用途 |
| :--- | :--- | :--- |
| `GET` | `/api/health` | 健康检查 |
| `GET` | `/api/cocktails` | 获取全部酒款 |
| `GET` | `/api/cocktails/{id}` | 获取单个酒款 |
| `POST` | `/api/cocktails` | 新增酒款，需要管理员认证 |
| `PUT` | `/api/cocktails/{id}` | 编辑酒款，需要管理员认证 |
| `DELETE` | `/api/cocktails/{id}` | 删除酒款，需要管理员认证 |
| `GET` | `/api/ledger/catalog` | 点单台目录，包含临时特调 |
| `GET` | `/api/orders?limit=100` | 结账历史 |
| `POST` | `/api/orders` | 新建结账记录 |
| `DELETE` | `/api/orders/{id}` | 删除结账记录 |
| `GET` | `/api/guestbook?limit=200` | 留言列表 |
| `POST` | `/api/guestbook` | 新增留言 |
| `DELETE` | `/api/guestbook/{id}` | 删除留言，需要管理员认证 |

完整交互式文档见运行后的 `/docs`。

## Updating the Menu

推荐通过管理后台维护酒单：

```text
http://127.0.0.1:8000/menu/admin.html
```

保存后，客用酒单和私人点单台会在下次加载时自动读取最新数据，不需要手动修改 `Menu/script.js` 或 `Menu/ledger.js`。

## Deployment Notes

这个项目现在依赖 FastAPI 后端，单纯的 GitHub Pages 只能托管静态文件，不能运行 SQLite 和 API。要让完整功能在线可用，需要部署到能运行 Python 服务的平台，例如云服务器、Render、Railway、Fly.io，或使用 Docker：

```powershell
docker build -f backend/Dockerfile -t nocturne-bar .
docker run -d --name nocturne -p 8000:8000 -v nocturne-data:/app/backend nocturne-bar
```

`-v nocturne-data:/app/backend` 会把数据库所在目录挂载为持久卷，容器重建后数据不会丢失。

## Scan

<div align="center">
  <a href="https://ying-iroha.github.io/Menu/Menu/">
    <img src="./assets/nocturne-menu-qr.png" width="360" alt="Nocturne 鸡尾酒酒单二维码" />
  </a>
  <p><sub>Scan to open Nocturne Cocktail Archive</sub></p>
</div>

---

<div align="center">
  <sub>Drink with intention · Record what mattered</sub>
</div>
