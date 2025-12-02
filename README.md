# 🏝️ 旅遊清單 Travel Packing List

一款用 React Hooks 打造的旅遊打包清單工具，支援 新增、刪除、編輯、排序、勾選、全部勾選、進度條、localStorage、RWD。
介面活潑、互動直覺，是非常適合作為作品集展示的小型前端應用程式。

🔗 Live Demo https://travel-list-sheng.netlify.app/

## ✨ 功能 Features

### 新增項目

- 可輸入名稱＋數量

- 空白輸入會被防呆

- 若輸入重複項目 → 跳提示，可選擇是否增加原項目數量

### 編輯項目

- 可修改「名稱」與「數量」

- 支援 Enter 儲存、Esc 取消

### 勾選 / 取消

- 點 checkbox 代表已經打包

- 完成項目會自動加上刪除線與淡化效果

### 排序

- 依照加入時間

- 依照名稱筆畫

- 依照是否打包完成（已完成會排後面）

### 一鍵全部勾選

- Actions 區塊提供 全部標記為已打包

- 若全部都是完成狀態 → 按鈕會自動 disabled（不可點）

### 清空全部項目

- 提供確認視窗，避免誤刪

### 進度條

- 視覺化顯示打包進度，使用 transform: scaleX() 動畫順暢顯示：

- 未完成 → 百分比動態更新

- 100% → 顯示「可以出發了」🎉

### RWD 全面支援

- 手機、平板、自動調整排版

- 表單區由橫排 → 改為直向排列

- 清單自動收縮成單欄顯示

- 整個 App 永遠保持「一頁」呈現，只有清單區域獨立捲動

### localStorage 永久保存

- 重新整理頁面不會消失

- 讓旅遊清單能長期使用

## 🧩 使用的技術 Tech Stack

- React 18 + Hooks（useState, useEffect）

- CSS Grid + Flexbox

- LocalStorage 持久化

- RWD（Media Queries、overflow-y）

- Array Methods：map / filter / sort

## 💡 可改進方向

- 篩選功能（只看未打包 / 只看已完成）

- 自訂 Modal 取代 window.confirm

- 分類（衣物、證件、生活用品…）
