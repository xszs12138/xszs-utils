# xszs-utils

一个实用的工具库 monorepo，包含了一些常用的工具函数。

## 项目结构

这是一个使用 pnpm workspace 的 monorepo 项目：

- `packages/utils` - 核心工具函数库 `@xszs/utils`
- `playground` - 开发测试 playground

## 安装

```bash
pnpm add @xszs/utils
```

## 使用

```ts
import { chunk, unique } from '@xszs/utils'

const arr = [1, 2, 3, 4, 5]

console.log(chunk(arr, 2)) // [[1, 2], [3, 4], [5]]
console.log(unique(arr)) // [1, 2, 3, 4, 5]
```

## 开发

```bash
# 安装依赖
pnpm install

# 构建 utils
pnpm utils:build

# 运行 playground
pnpm playground:dev
```
