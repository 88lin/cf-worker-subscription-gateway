export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  },
};

const BASE_URL = "https://soonvpn.net";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

// 白名单邮箱域名
const WHITELIST_DOMAINS = [
  "gmail.com",
  "qq.com",
  "163.com",
  "yahoo.com",
  "sina.com",
  "126.com",
  "yeah.net",
  "foxmail.com",
];

async function handleRequest(request) {
  try {
    // 1. 注册并获取 token
    const email = randomEmail();
    const password = randomPassword();
    const registerUrl = `${BASE_URL}/api/v1/passport/auth/register`;

    const regResp = await fetch(registerUrl, {
      method: "POST",
      headers: {
        ...HEADERS,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!regResp.ok) {
      const errorText = await regResp.text();
      throw new Error(`注册失败: ${regResp.status} - ${errorText}`);
    }

    const regJson = await regResp.json();
    if (regJson.status !== "success") {
      throw new Error(`注册失败: ${regJson.message || "未知错误"}`);
    }

    const token = regJson?.data?.auth_data;
    if (!token) {
      return new Response("未获取到 token", { status: 400 });
    }

    // 2. 获取订阅配置链接
    const subUrl = `${BASE_URL}/api/v1/user/getSubscribe`;
    const subResp = await fetch(subUrl, {
      method: "GET",
      headers: {
        ...HEADERS,
        Authorization: token,
      },
    });

    if (!subResp.ok) {
      throw new Error(`获取订阅失败: ${subResp.status}`);
    }

    const subJson = await subResp.json();
    const subToken = subJson?.data?.token;

    if (!subToken) {
      return new Response("未找到订阅 Token", { status: 404 });
    }

    // 构建订阅链接 (SoonVPN 逻辑: /config?token=xxx)
    const subscribeUrl = `${BASE_URL}/config?token=${subToken}`;

    // 3. 请求订阅内容并返回
    const targetUa = request.headers.get("User-Agent") || HEADERS["User-Agent"];
    const targetResp = await fetch(subscribeUrl, {
      headers: { "User-Agent": targetUa },
    });

    // 复制响应头，确保内容类型等正确
    const newResponse = new Response(targetResp.body, targetResp);
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    return newResponse;
  } catch (e) {
    return new Response(`发生错误: ${e.message}`, {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

// 生成随机邮箱 (从白名单中随机选择域名)
function randomEmail() {
  const domain =
    WHITELIST_DOMAINS[Math.floor(Math.random() * WHITELIST_DOMAINS.length)];
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let str = "";
  for (let i = 0; i < 10; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str + "@" + domain;
}

// 生成随机密码
function randomPassword(len = 12) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let str = "";
  for (let i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
}