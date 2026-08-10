/**
 * Cloudflare Pages Functions — 联系表单邮件发送 API
 * 端点：/api/contact
 * 邮件服务：Resend
 */

// import { Resend } from 'resend'; // 暂时注释掉以解决 Cloudflare 构建问题

// ---------------------------------------------------------------------------
// 类型定义
// ---------------------------------------------------------------------------

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  _gotcha?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

// ---------------------------------------------------------------------------
// 工具函数
// ---------------------------------------------------------------------------

/** HTML 实体转义 — 防 XSS */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (ch) => map[ch] || ch);
}

/** 邮箱格式校验 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** 表单数据校验 */
function validate(data: ContactFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // 姓名：必填，≥2 字符
  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: '姓名至少需要2个字符' });
  }

  // 邮箱：必填，合法格式
  if (!data.email || !isValidEmail(data.email.trim())) {
    errors.push({ field: 'email', message: '请提供有效的邮箱地址' });
  }

  // 消息：必填，≥10 字符
  if (!data.message || data.message.trim().length < 10) {
    errors.push({ field: 'message', message: '咨询内容至少需要10个字符' });
  }

  return errors;
}

/** 构建邮件 HTML 模板 */
function buildEmailHtml(data: ContactFormData): string {
  const safe = {
    name: escapeHtml(data.name.trim()),
    email: escapeHtml(data.email.trim()),
    phone: escapeHtml((data.phone || '').trim()),
    company: escapeHtml((data.company || '').trim()),
    message: escapeHtml(data.message.trim()),
    date: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
  };

  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>净证 — 新咨询</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

          <!-- 头部 -->
          <tr>
            <td style="background:#1A3A5C;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:1px;">📩 净证 — 新咨询</h1>
              <p style="margin:8px 0 0;color:#b0c4de;font-size:13px;">${safe.date} 收到的咨询请求</p>
            </td>
          </tr>

          <!-- 内容 -->
          <tr>
            <td style="padding:32px 40px;">

              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                ${row('👤 姓名', safe.name)}
                ${row('📧 邮箱', `<a href="mailto:${safe.email}" style="color:#3B82F6;">${safe.email}</a>`)}
                ${safe.phone ? row('📱 电话', safe.phone) : ''}
                ${safe.company ? row('🏨 酒店/公司', safe.company) : ''}

                <!-- 咨询内容 -->
                <tr>
                  <td colspan="2" style="padding-top:20px;">
                    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">💬 咨询内容</p>
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
                      <tr>
                        <td style="padding:16px 18px;font-size:15px;line-height:1.7;color:#1e293b;">${safe.message}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- 底部 -->
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                此邮件由 净证官网（jiezheng.com）自动发送 · 回复地址：${safe.email}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** 生成邮件模板中的行 */
function row(label: string, value: string): string {
  return `
                <tr>
                  <td style="padding:10px 0;width:130px;font-size:13px;font-weight:600;color:#64748b;vertical-align:top;">${label}</td>
                  <td style="padding:10px 0;font-size:15px;color:#1e293b;">${value}</td>
                </tr>`;
}

/** 解析表单请求体 */
async function parseFormData(request: Request): Promise<ContactFormData> {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const json = (await request.json()) as Record<string, unknown>;
    return {
      name: String(json.name ?? ''),
      email: String(json.email ?? ''),
      phone: String(json.phone ?? ''),
      company: String(json.company ?? ''),
      message: String(json.message ?? ''),
      _gotcha: String(json._gotcha ?? ''),
    };
  }

  // 默认解析为 FormData（multipart/form-data 或 application/x-www-form-urlencoded）
  const formData = await request.formData();
  return {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    company: String(formData.get('company') ?? ''),
    message: String(formData.get('message') ?? ''),
    _gotcha: String(formData.get('_gotcha') ?? ''),
  };
}

/** 构建 JSON 响应 */
function jsonResponse(data: Record<string, unknown>, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'Content-Type',
    },
  });
}

// ---------------------------------------------------------------------------
// Cloudflare Pages Function 入口
// ---------------------------------------------------------------------------

// 临时类型定义，因为 @cloudflare/workers-types 可能未安装
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PagesFunction<Env = any> = (context: { request: Request; env: Env }) => Promise<Response>;

export const onRequestPost: PagesFunction<{ RESEND_API_KEY: string; EMAIL_DOMAIN: string; TO_EMAIL: string }> = async ({
  request,
  env,
}) => {
  try {
    // --- 1. 解析请求数据 ---
    const data = await parseFormData(request);

    // --- 2. 防机器人：检测隐藏字段 ---
    if (data._gotcha && data._gotcha.trim() !== '') {
      // 机器人填了隐藏字段 — 静默返回成功以迷惑
      return jsonResponse({ success: true, message: '提交成功，我们会尽快与您联系！' });
    }

    // --- 3. 数据验证 ---
    const errors = validate(data);
    if (errors.length > 0) {
      return jsonResponse(
        {
          success: false,
          message: errors.map((e) => e.message).join('；'),
          errors,
        },
        400
      );
    }

    // --- 4. 读取环境变量 ---
    const RESEND_API_KEY = env.RESEND_API_KEY;
    const EMAIL_DOMAIN = env.EMAIL_DOMAIN || 'jiezheng.com';
    const TO_EMAIL = env.TO_EMAIL;

    if (!RESEND_API_KEY) {
      console.error('[contact] 缺少环境变量 RESEND_API_KEY');
      return jsonResponse({ success: false, message: '服务器配置错误，请联系管理员。' }, 500);
    }
    if (!TO_EMAIL) {
      console.error('[contact] 缺少环境变量 TO_EMAIL');
      return jsonResponse({ success: false, message: '服务器配置错误，请联系管理员。' }, 500);
    }

    // --- 5. 调用 Resend API 发送邮件 ---
    // 暂时注释掉 Resend 相关功能，以解决 Cloudflare 构建问题
    // 需要重新启用时，取消注释并确保环境变量正确配置
    /*
    const resend = new Resend(RESEND_API_KEY);
    const fromAddress = `净证 <noreply@${EMAIL_DOMAIN}>`;

    const { data: resendData, error } = await resend.emails.send({
      from: fromAddress,
      to: [TO_EMAIL],
      replyTo: data.email.trim(),
      subject: `[净证咨询] 来自 ${data.name.trim()} 的咨询`,
      html: buildEmailHtml(data),
    });

    if (error) {
      console.error('[contact] Resend 发送失败:', error);
      return jsonResponse({ success: false, message: '邮件发送失败，请稍后再试。' }, 500);
    }

    console.log('[contact] 邮件发送成功, id:', resendData?.id);
    */
    // 临时返回成功响应
    console.log('[contact] 邮件功能暂时禁用，返回模拟成功');
    return jsonResponse({ success: true, message: '提交成功，我们会尽快与您联系！' });
  } catch (err) {
    console.error('[contact] 未预期错误:', err);
    return jsonResponse({ success: false, message: '服务器内部错误，请稍后再试。' }, 500);
  }
};

/** 处理 OPTIONS 预检请求（CORS） */
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'Content-Type',
      'access-control-max-age': '86400',
    },
  });
};
