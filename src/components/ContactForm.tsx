'use client'

import { useState } from 'react'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      })
      const data: { success?: boolean; error?: string; message?: string } = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error ?? '提交失败，请稍后重试')
      } else {
        setStatus('success')
        setMessage(data.message ?? '预约成功！')
        setName('')
        setPhone('')
      }
    } catch {
      setStatus('error')
      setMessage('网络错误，请检查连接后重试')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col items-center text-center py-4">
          <CheckCircle size={40} className="text-green-500 mb-3" />
          <h3 className="font-bold text-green-700 text-lg mb-1">预约成功！</h3>
          <p className="text-sm text-gray-500">{message}</p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-4 text-sm text-[#0A3D5C] underline hover:no-underline"
          >
            再次预约
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="font-bold text-[#0A3D5C] mb-1">免费咨询预约</h3>
      <p className="text-sm text-gray-500 mb-4">填写信息，招生顾问将在1小时内与您联系</p>
      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <input
          type="text"
          placeholder="您的姓名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={20}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#0A3D5C] transition-colors"
        />
        <input
          type="tel"
          placeholder="联系电话（11位手机号）"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          maxLength={11}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#0A3D5C] transition-colors"
        />
        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-500 text-xs">
            <AlertCircle size={14} />
            <span>{message}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-2.5 rounded-lg text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ backgroundColor: '#E8A020' }}
        >
          {status === 'loading' && <Loader size={14} className="animate-spin" />}
          {status === 'loading' ? '提交中...' : '预约免费咨询'}
        </button>
      </form>
    </div>
  )
}
