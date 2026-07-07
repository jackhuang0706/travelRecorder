# 🌍 旅行紀錄器

一顆可以旋轉的 3D 地球,記錄你在世界各地的足跡。點擊地球上的標記,即可查看該地的文字紀錄、照片、影音與旅遊時間。

## 技術棧

- [react-globe.gl](https://github.com/vasturiano/react-globe.gl) — 3D 地球渲染
- Tailwind CSS — 樣式
- Supabase — 資料庫、登入驗證、照片影音儲存
- Vite + React

## 快速開始

```bash
npm install
npm run dev
```

尚未設定 Supabase 時,前台會以**示範模式**顯示範例資料,可先預覽效果。

## 連接 Supabase

1. 到 [supabase.com](https://supabase.com) 建立專案。
2. 在 Dashboard → **SQL Editor** 貼上並執行 `supabase/schema.sql`(建立資料表、權限與儲存空間)。
3. 在 Dashboard → **Authentication → Users** 手動新增一位管理員帳號(Email + 密碼)。
4. 複製 `.env.example` 為 `.env`,填入 Project Settings → API 中的 URL 與 anon key:

   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

5. 重新啟動 `npm run dev`。

## 功能

### 前台(`/`)

- 3D 地球自動旋轉,標記顯示所有旅行地點(一個國家可存多個)
- 點擊標記 → 鏡頭飛到該地,側欄顯示文字紀錄、照片牆、影片與旅遊時間

### 管理後台(`/admin`)

- 前台不顯示入口,請直接在網址列輸入 `/admin` 進入
- 需以 Supabase 帳號登入才能修改
- 在地球上點擊即可精準選取座標(顯示紅點),自動帶入表單
- 撰寫文字紀錄、設定旅遊起訖日期、上傳多張照片與影音
- 點擊既有標記可編輯,也可刪除標記或單一檔案(連同儲存空間中的檔案一併清除)

## 部署

```bash
npm run build
```

產出的 `dist/` 可部署到 Vercel、Netlify 或任何靜態主機;記得在部署平台設定上述兩個環境變數。
