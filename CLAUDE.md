@AGENTS.md

## 设计规范（强制执行）

### 事前 — 写代码之前必须做的
- **任何涉及 UI、前端页面、组件、样式的工作**，必须先调用 `brainstorming` skill，确认设计方向、目标用户、风格偏好后再动手
- **确定方向后、写任何 UI 代码前**，必须调用 `frontend-design` skill 生成设计方案
- **涉及图片/视频等媒体内容生成**，必须调用 `libtv-skill`

### 事中 — 写代码时
- 遵循 `karpathy-guidelines` — 避免过度设计、做最小外科改动、先验证再声称完成

### 事后 — 提交前必须做的
- **UI 完成后**，调用 `impeccable` 或 `ui-ux-pro-max` 做设计审查
- **声称"完成"之前**，必须实际运行验证命令（`verification-before-completion`）
- **功能开发完成后**，调用 `requesting-code-review`

### 禁止事项
- 禁止在不经 `brainstorming` 的情况下直接写 UI 代码
- 禁止使用通用模板风格（generic AI aesthetics）
- 禁止在未验证的情况下声称"完成"或"通过"
