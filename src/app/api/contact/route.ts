import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  let body: { name?: string; phone?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 })
  }

  const { name, phone } = body

  if (!name?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: '姓名和电话不能为空' }, { status: 422 })
  }

  if (!/^1[3-9]\d{9}$/.test(phone.trim())) {
    return NextResponse.json({ error: '请输入有效的11位手机号码' }, { status: 422 })
  }

  const resendKey = process.env.RESEND_API_KEY
  const contactEmail = process.env.CONTACT_EMAIL ?? 'info@baili-academy.com'

  if (resendKey) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from: 'noreply@baili-academy.com',
        to: contactEmail,
        subject: `【佰利学院】新咨询预约 - ${name.trim()}`,
        html: `
          <h2>新咨询预约</h2>
          <p><strong>姓名：</strong>${name.trim()}</p>
          <p><strong>电话：</strong>${phone.trim()}</p>
          <p><strong>时间：</strong>${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>
        `,
      })
    } catch (err) {
      console.error('Email send failed:', err)
    }
  }

  return NextResponse.json({ success: true, message: '预约成功！招生顾问将在1小时内与您联系。' })
}
