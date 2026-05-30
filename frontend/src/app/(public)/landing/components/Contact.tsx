'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'

interface FormState {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.email.trim())   e.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.subject.trim()) e.subject = 'Subject is required'
    if (!form.message.trim()) e.message = 'Message is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (validate()) setSubmitted(true)
  }

  const inputClass = (err?: string) =>
    `w-full bg-[#040a18] border ${err ? 'border-red-500/60' : 'border-[#0066ff15]'} rounded-xl px-4 py-3 text-white text-[13.5px] placeholder:text-gray-600 focus:outline-none focus:border-[#0066ff60] transition-colors duration-200`

  return (
    <section id="contact" className="relative bg-[#030813] overflow-hidden py-20 lg:py-28">
      {/* Corner decorations */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '-3%', top: '0%',
          width: 220, height: 220, borderRadius: '0 0 50% 0',
          background: 'rgba(0,60,200,0.08)',
          border: '1px solid rgba(0,102,255,0.08)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          right: '-3%', top: '0%',
          width: 220, height: 220, borderRadius: '0 0 0 50%',
          background: 'rgba(0,60,200,0.08)',
          border: '1px solid rgba(0,102,255,0.08)',
        }}
      />

      <div className="relative z-10 max-w-[900px] mx-auto px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl p-8 sm:p-10"
          style={{
            background: 'linear-gradient(145deg, #060e22 0%, #050b1a 100%)',
            border: '1px solid rgba(0,102,255,0.15)',
          }}
        >
          {/* Label */}
          <div className="mb-5">
            <span className="inline-block bg-[#0066ff] text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full">
              Drop Your Messages
            </span>
          </div>

          <h2 className="text-white font-black text-[clamp(1.5rem,3vw,2rem)] mb-8">
            Contact information
          </h2>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-[#0066ff]/20 border border-[#0066ff]/40 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#0066ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white font-bold text-[16px] mb-2">Message sent!</p>
              <p className="text-gray-400 text-[13px]">We'll get back to you within 24 hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-white text-[13px] font-medium mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className={inputClass(errors.name)}
                    value={form.name}
                    onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })) }}
                  />
                  {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-white text-[13px] font-medium mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className={inputClass(errors.email)}
                    value={form.email}
                    onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })) }}
                  />
                  {errors.email && <p className="text-red-400 text-[11px] mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Row 2 */}
              <div className="mb-5">
                <label className="block text-white text-[13px] font-medium mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="Message subject"
                  className={inputClass(errors.subject)}
                  value={form.subject}
                  onChange={e => { setForm(p => ({ ...p, subject: e.target.value })); setErrors(p => ({ ...p, subject: '' })) }}
                />
                {errors.subject && <p className="text-red-400 text-[11px] mt-1">{errors.subject}</p>}
              </div>

              {/* Row 3 */}
              <div className="mb-7">
                <label className="block text-white text-[13px] font-medium mb-2">Message</label>
                <textarea
                  rows={5}
                  placeholder="Write your message..."
                  className={`${inputClass(errors.message)} resize-none`}
                  value={form.message}
                  onChange={e => { setForm(p => ({ ...p, message: e.target.value })); setErrors(p => ({ ...p, message: '' })) }}
                />
                {errors.message && <p className="text-red-400 text-[11px] mt-1">{errors.message}</p>}
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#0066ff] hover:bg-[#0055ee] text-white font-bold text-[14px] py-4 rounded-xl transition-all duration-200 shadow-[0_4px_24px_rgba(0,102,255,0.4)]"
              >
                Submit
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
