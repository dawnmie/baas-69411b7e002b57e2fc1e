# OceanBase AI产品建议留言板

这是一个专门为OceanBase数据库公司设计的产品建议收集平台，专注于收集用户对OceanBase数据库AI应用功能的建议和需求。

## 🌟 项目特色

- **友好的多步骤表单**：引导用户循序渐进地提供有价值的建议
- **针对性问题设计**：专门针对OceanBase AI功能的使用场景和需求
- **用户体验优化**：美观的界面设计，让用户愿意完成整个反馈流程
- **数据持久化**：使用Appwrite后端服务存储所有建议数据

## 📋 收集的信息

1. **使用经验水平**：了解用户的技术背景
2. **当前使用场景**：识别OceanBase的实际应用场景
3. **AI功能需求**：收集具体的AI功能建议（如智能SQL优化、自动索引推荐等）
4. **功能优先级**：了解需求的紧急程度
5. **详细描述**：获取更深入的需求细节

## 🚀 快速开始

```bash
npm install
npm run dev
```

## ⚙️ 配置

Appwrite客户端配置在 `src/appwrite.js`:

- **Endpoint**: https://appbuild.store/v1
- **Project ID**: 69411b7e002b57e2fc1e

## 🗄️ 数据库结构

- **数据库**: `oceanbase_suggestions` (ID: 69411cc40015de9bf700)
- **表**: `suggestions` (ID: 69411cc600041a9ec5fd)
- **字段**:
  - `userId`: 用户ID
  - `userName`: 用户姓名
  - `userEmail`: 用户邮箱
  - `experienceLevel`: 经验水平
  - `currentUseCase`: 当前使用场景
  - `aiFeatureRequest`: AI功能需求
  - `priority`: 优先级
  - `detailedDescription`: 详细描述

## 🎯 目标用户

- OceanBase数据库的现有用户
- 对数据库AI功能感兴趣的开发者
- 企业技术决策者
- 数据库管理员和架构师

## 💡 使用说明

1. 用户需要先注册或登录账户
2. 系统会引导用户通过5个步骤完成建议提交
3. 每个步骤都有清晰的问题和选项
4. 提交成功后会显示感谢信息
5. 所有建议都会安全存储在Appwrite数据库中

## 🤝 贡献

欢迎为OceanBase AI功能的发展贡献您的宝贵建议！