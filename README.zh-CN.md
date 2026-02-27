<div align="center">

# Afterglow

**将任何视频变成交互式跟读工作台**

AI 智能分句 · 单句循环 · 键盘快捷操作 · 100% 本地离线运行

[![License](https://img.shields.io/badge/license-CC-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.13+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/react-19-blue.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/fastapi-0.115+-green.svg)](https://fastapi.tiangolo.com/)

[English](README.md) | [中文](README.zh-CN.md)

</div>

---

## Afterglow 是什么？

Afterglow 是一款**本地优先的语言学习播放器**
，专为 [影子跟读法（Shadowing）](https://en.wikipedia.org/wiki/Speech_shadowing) 设计。导入任意视频文件，Afterglow 将：

1. 使用 [Faster-Whisper](https://github.com/SYSTRAN/faster-whisper) **自动转录**为带时间戳的文本
2. 将语音**智能分割**为逻辑句子单元
3. 支持**单句循环 + 间隔暂停**，让你听一句、停一停、跟一句

无需云端 API，无需付费订阅，所有处理在你的电脑上完成。

---

## 功能演示

<p align="center">
  <img src="docs/images/1. overview.gif" alt="Afterglow 功能总览" width="720" />
</p>

---

## 功能特性

| 功能          | 说明                                           |
|-------------|----------------------------------------------|
| **AI 语音转录** | 基于 Faster-Whisper（base 模型，约 143 MB），首次运行自动下载 |
| **单句循环**    | 当前句子重复 1 / 2 / 3 / 5 / ∞ 次后自动跳转下一句           |
| **智能间隔**    | 句间自动暂停，为你留出跟读时间                              |
| **快捷键**     | `空格` 播放/暂停 · `回车` 重放 · `←→` 上/下句 · `↑↓` 调速   |
| **分句合并**    | 一键合并被错误拆分的句子                                 |
| **字幕遮挡**    | 遮挡视频内嵌字幕，让你专注听力                              |
| **智能缓存**    | SHA-256 文件哈希 → 重复导入秒加载，无需重复转录                |
| **变速播放**    | 0.3× 到 3.0×，步进 0.1×                          |

### 播放模式组合

|          | 间隔关闭        | 间隔开启           |
|----------|-------------|----------------|
| **循环关闭** | 正常连续播放      | 每句播完自动暂停       |
| **循环开启** | 重复 N 次后跳下一句 | 重复 → 暂停 → 重复循环 |

---

## 快速开始

### 环境要求

- **Python** 3.13+
- **Node.js** 22+（含 npm）

### 一键启动（Windows）

```bash
git clone https://github.com/your-username/Afterglow.git
cd Afterglow
start.bat
```

脚本会自动安装依赖、查找可用端口、启动前后端服务，并打开浏览器。

### 手动启动（所有系统）

**后端：**

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**前端：**

```bash
cd frontend
npm install
npm run dev -- --port 5173
```

然后在浏览器打开 `http://localhost:5173`。

---

## 项目结构

```
Afterglow/
├── frontend/                # React 19 + TypeScript + Vite
│   ├── src/
│   │   ├── components/      # UI 组件（VideoPlayer、TranscriptPanel 等）
│   │   ├── hooks/           # 自定义 Hooks（useShadowPlayer、useHotkeys 等）
│   │   ├── services/        # API 客户端 & 文件哈希
│   │   └── types/           # TypeScript 类型定义
│   └── vite.config.ts
│
├── backend/                 # FastAPI + Faster-Whisper
│   ├── app/
│   │   ├── routers/         # /api/transcribe, /api/cache
│   │   └── services/        # Whisper 模型封装
│   └── requirements.txt
│
├── docs/                    # 需求文档 & 计划
├── start.bat                # Windows 启动脚本
└── README.md
```

**运行时数据**存储在 `~/.afterglow/`：

```
~/.afterglow/
├── cache/       # 转录缓存（JSON，以 SHA-256 为键）
└── models/      # Whisper 模型文件（自动下载）
```

---

## API 接口

| 方法     | 端点                  | 说明                   |
|--------|---------------------|----------------------|
| `POST` | `/api/transcribe`   | 上传视频文件 → 返回带时间戳的分句结果 |
| `GET`  | `/api/cache/{hash}` | 根据文件哈希获取缓存的转录结果      |
| `PUT`  | `/api/cache/{hash}` | 存储转录结果到缓存            |

---

## 技术栈

| 层级   | 技术                                 |
|------|------------------------------------|
| 前端   | React 19, TypeScript, Vite 7, CSS3 |
| 后端   | Python 3.13, FastAPI, Uvicorn      |
| 语音识别 | Faster-Whisper (CTranslate2)       |
| 缓存   | SHA-256 哈希 → 本地 JSON 文件            |

---

## 路线图

- [x] 核心视频播放器与转录面板
- [x] AI 语音转录（Faster-Whisper）
- [x] 单句循环 & 智能间隔
- [x] 快捷键操作
- [x] 分句合并
- [x] 转录缓存
- [ ] 录音与回放对比
- [ ] 发音评分
- [ ] 桌面应用打包（Electron / Tauri）

---

## 许可证

本项目基于 [CC 许可证](LICENSE) 开源。

---

<div align="center">
  <sub>为相信刻意练习的语言学习者而造。</sub>
</div>
