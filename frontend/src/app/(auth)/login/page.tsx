'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { authService } from '@/lib/services'
import { useAuthStore, AuthUser } from '@/store/authStore'
import { setAuthHint } from '@/lib/session'

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { accessToken, user } = await authService.login({ email, password })
      setAuth(accessToken, user as unknown as AuthUser)
      setAuthHint() // first-party cookie so middleware lets us into protected routes
      // Send admins to the admin panel, regular users to the dashboard.
      if (user.role === 'MASTER_ADMIN' || user.role === 'SUB_ADMIN') {
        router.push('/admin-panel')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden px-5 py-12">
      {/* Subtle blue glow at top */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-30%', left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 500, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,90,230,0.18) 0%, transparent 65%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative z-10 w-full max-w-[560px] rounded-3xl px-9 py-12 sm:px-12"
        style={{
          background:
            'linear-gradient(180deg, #0a121f 0%, #060a13 50%, #04080f 100%)',
          border: '1px solid rgba(0,102,255,0.12)',
          boxShadow: '0 0 0 1px rgba(0,80,220,0.05) inset, 0 30px 80px rgba(0,30,140,0.25)',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center mb-5">
          <Image
            src="/images/logo.png"
            alt="ADS Skill India"
            width={200}
            height={56}
            className="h-11 w-auto object-contain"
          />
        </Link>

        {/* Welcome badge */}
        <div className="flex justify-center mb-5">
          <span className="inline-block bg-[#0a7cff] text-white text-[13px] font-bold px-5 py-1.5 rounded-full">
            Welcome Back
          </span>
        </div>

        <h1 className="text-white font-extrabold text-[28px] sm:text-[30px] text-center mb-9">
          Login to your account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-white font-bold text-[14px] mb-2">
              <lord-icon
                src="https://cdn.lordicon.com/dmvvtziq.json"
                trigger="hover"
                colors="primary:#0a7cff"
                style={{ width: '18px', height: '18px' }}
              />
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-black border border-transparent rounded-xl px-4 py-4 text-white text-[14px] placeholder:text-gray-700 focus:outline-none focus:border-[#0a7cff60] transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center gap-2 text-white font-bold text-[14px] mb-2">
              <lord-icon
                src="https://cdn.lordicon.com/fmjvmlnr.json"
                trigger="hover"
                colors="primary:#0a7cff"
                style={{ width: '18px', height: '18px' }}
              />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-black border border-transparent rounded-xl px-4 py-4 pr-12 text-white text-[14px] placeholder:text-gray-700 focus:outline-none focus:border-[#0a7cff60] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                aria-label="Toggle password visibility"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-white transition-colors"
              >
                <lord-icon
                  src={showPassword ? "https://cdn.lordicon.com/dicvvczd.json" : "https://cdn.lordicon.com/dmvvtziq.json"}
                  trigger="hover"
                  colors="primary:#999999"
                  style={{ width: '20px', height: '20px' }}
                />
              </button>
            </div>
          </div>

          {/* Row: remember + forgot */}
          <div className="flex items-center justify-between text-[13.5px] pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="w-4 h-4 rounded accent-[#0a7cff] cursor-pointer"
              />
              <span className="text-white font-bold">Remember Me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-[#0a7cff] font-bold hover:text-blue-400 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          {error && (
            <p className="text-red-400 text-[13px] font-semibold text-center -mb-2">{error}</p>
          )}

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full mt-2 text-white font-extrabold text-[16px] px-6 py-4 rounded-2xl transition-all duration-200 disabled:opacity-70 disabled:cursor-wait"
            style={{
              background: 'linear-gradient(180deg, #2a8eff 0%, #0a7cff 100%)',
              boxShadow: '0 8px 26px rgba(10,124,255,0.45)',
            }}
          >
            {loading ? 'Logging in…' : 'Submit'}
          </motion.button>

          {/* Footer link */}
          <p className="text-center text-gray-400 text-[14px] pt-3">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-white font-extrabold hover:text-[#0a7cff] transition-colors"
            >
              Create an account
            </Link>
          </p>
        </form>
      </motion.div>
    </main>
  )
}
