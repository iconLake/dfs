# DFS - 去中心化文件系统 (Decentralized File System)

一个简单的文件服务器，用于提供文件访问服务。

## 功能特点

- 基于 Express 框架的轻量级文件服务器
- 支持通过 HTTP GET 请求访问文件
- 内置缓存控制，默认缓存时间为 30 天
- 使用 PM2 进行进程管理，支持自动重启和日志记录

## 安装

### 前置条件

- Node.js (推荐 v14 或更高版本)
- npm 或 pnpm 包管理器

### 安装步骤

1. 克隆仓库

    ```bash
    git clone https://github.com/iconLake/dfs.git
    cd dfs
    ```

1. 安装依赖

    ```bash
    pnpm install
    ```

## 使用方法

### 开发环境

在开发环境中运行服务器，支持文件监视和自动重启：

```bash
pnpm run dev
```

### 生产环境

在生产环境中运行服务器：

```bash
pnpm run pro
```

## 许可证

本项目采用 GNU Affero General Public License v3.0 (AGPL-3.0) 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

## 作者

- iconLake
