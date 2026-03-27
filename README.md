#  CF Worker 订阅网关

本指南将引导您在 Cloudflare Worker 上部署一个自动注册 Sushi 账号并生成订阅链接的脚本。此方法高效便捷，可用于获取新的订阅内容

## 部署指南

### 1. 登录 Cloudflare

- 打开 Cloudflare 官网：<https://www.cloudflare.com/>
- 登录你的账号

### 2. 创建 Worker

- 在左侧导航栏进入 `Workers & Pages`
- 点击 `Create application`
- 点击 `Create Worker`
- 为 Worker 命名，例如：`subscription-gateway`
- 点击 `Deploy`

### 3. 编辑代码

- 部署完成后，点击 `Edit Code`
- 删除编辑器中的默认示例代码
- 将本项目 `cf_worker_sushi.js` 的全部内容复制并粘贴进去

### 4. 保存并部署

- 点击右上角 `Save and deploy`
- 等待部署完成

## 如何使用

部署成功后，你会得到一个以 `.workers.dev` 结尾的地址，例如：

```text
https://subscription-gateway.yourname.workers.dev/
```

### 使用场景示例：
• 直接注册并获取订阅：

```text
https://sushi-reg.yourname.workers.dev/
```

#### 提示：

您可以直接在浏览器访问该 URL ，或者将其作为订阅链接填入 Clash、V2Ray 等客户端中，每次请求都会自动触发一次新账号的注册并返回订阅内容。

## 免责声明

请仅将本项目用于你自己拥有、控制或已明确获授权访问的服务。

请勿将其用于：

- 未经授权访问第三方接口
- 批量注册第三方账号
- 规避平台规则、配额、风控或付费机制
- 任何违反目标服务条款或当地法律法规的用途

使用者需自行承担部署和使用带来的合规与安全责任。
