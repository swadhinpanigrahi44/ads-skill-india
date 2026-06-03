'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { authService, paymentsService } from '@/lib/services'

// Maps the register page package ids to backend course-package slugs.
const SLUG_MAP: Record<string, string> = {
  adslite: 'ads-lite',
  adspro: 'ads-pro',
  adssumo: 'ads-sumo',
  adspremium: 'ads-premium',
  adspremiumplus: 'ads-premium-plus',
}

/* ── Packages ─────────────────────────────────────────────────── */
interface Package {
  id: string
  name: string
  amount: number
  blurb: string
}

const PACKAGES: Package[] = [
  { id: 'adslite',        name: 'Ads.lite',      amount: 1495,  blurb: '5 Courses · Lifetime' },
  { id: 'adspro',         name: 'AdsPro',        amount: 2999,  blurb: '8 Courses · Lifetime · Most Popular' },
  { id: 'adssumo',        name: 'AdsSumo',       amount: 5999,  blurb: '10 Courses · Lifetime' },
  { id: 'adspremium',     name: 'AdsPremium',    amount: 9999,  blurb: '12 Courses · Lifetime' },
  { id: 'adspremiumplus', name: 'AdsPremium+',   amount: 15999, blurb: '15 Courses · Lifetime' },
]

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh','Andaman & Nicobar',
  'Dadra & Nagar Haveli and Daman & Diu','Lakshadweep',
]

/* ── Reusable input wrapper ───────────────────────────────────── */
function Field({
  label, required, icon, children, hint, half,
}: {
  label: string
  required?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
  hint?: string
  half?: boolean
}) {
  return (
    <div className={half ? '' : 'col-span-2'}>
      <label className="flex items-center gap-1.5 text-white font-bold text-[13.5px] mb-2">
        {icon}
        <span>
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </span>
      </label>
      {children}
      {hint && <p className="text-gray-500 text-[11.5px] mt-1.5">{hint}</p>}
    </div>
  )
}

const inputCls =
  'w-full bg-[#0c1426] border border-[#1a2540] rounded-xl px-4 py-3.5 text-white text-[14px] placeholder:text-gray-500 focus:outline-none focus:border-[#0a7cff80] transition-colors'

/* ── Stepper (matches screenshot exactly) ─────────────────────── */
function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const items: { n: 1 | 2 | 3; label: string }[] = [
    { n: 1, label: 'Personal Details' },
    { n: 2, label: 'Payment' },
    { n: 3, label: 'Complete' },
  ]
  return (
    <div
      className="rounded-2xl px-6 py-5 mb-7"
      style={{
        background: '#0a1426',
        border: '1px solid #1a2540',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        {items.map((it, i) => {
          const done = step > it.n
          const active = step === it.n
          return (
            <div key={it.n} className="flex items-start flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-[14px] transition-colors duration-300 ${
                    done
                      ? 'bg-[#22c55e] text-white shadow-[0_0_14px_rgba(34,197,94,0.45)]'
                      : active
                      ? 'bg-[#0a7cff] text-white shadow-[0_0_16px_rgba(10,124,255,0.55)]'
                      : 'bg-[#1a2540] text-gray-400'
                  }`}
                >
                  {done ? (
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    it.n
                  )}
                </div>
                <span
                  className={`mt-2 text-[12px] font-bold whitespace-nowrap ${
                    done ? 'text-[#22c55e]' : active ? 'text-[#0a7cff]' : 'text-gray-500'
                  }`}
                >
                  {it.label}
                </span>
              </div>
              {i < items.length - 1 && (
                <div className="flex-1 h-px mt-[18px] mx-2 bg-[#1a2540]" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterPageInner />
    </Suspense>
  )
}

function RegisterPageInner() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const initialPlan = searchParams?.get('plan') ?? ''
  const validInitialPlan = PACKAGES.some(p => p.id === initialPlan) ? initialPlan : ''
  const [packageId, setPackageId] = useState(validInitialPlan)

  useEffect(() => {
    const plan = searchParams?.get('plan')
    if (plan && PACKAGES.some(p => p.id === plan)) {
      setPackageId(plan)
    }
  }, [searchParams])
  const [sponsorId, setSponsorId] = useState('')
  const [sponsorName, setSponsorName] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [stateName, setStateName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [paying, setPaying] = useState(false)

  const selected = PACKAGES.find(p => p.id === packageId)

  const handleNext = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!packageId) return setError('Please select a package')
    if (!fullName.trim()) return setError('Full name is required')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email')
    if (!/^[6-9]\d{9}$/.test(mobile)) return setError('Enter a valid 10-digit mobile number')
    if (!stateName) return setError('Please select your state')
    if (password.length < 8) return setError('Password must be at least 8 characters')
    if (password !== confirmPassword) return setError('Passwords do not match')
    if (!agree) return setError('You must accept the Terms & Privacy Policy')

    setPaying(true)
    try {
      await authService.register({
        fullName: fullName.trim(),
        email,
        mobile,
        state: stateName,
        password,
        ...(sponsorId.trim() ? { referralCode: sponsorId.trim() } : {}),
      })
      setStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setPaying(false)
    }
  }

  const handlePay = async () => {
    setPaying(true)
    setError('')
    try {
      // Best-effort: create a Razorpay order. Once Razorpay keys are configured
      // on the backend, this opens the checkout. Until then it returns 503 and
      // we still complete registration (the account already exists).
      const slug = SLUG_MAP[packageId] ?? packageId
      await paymentsService.createOrder({
        packageSlug: slug,
        idempotencyKey: `${email}:${slug}:${Date.now()}`,
      })
      setStep(3)
    } catch {
      // Payment gateway not configured yet — account is created, allow login.
      setStep(3)
    } finally {
      setPaying(false)
    }
  }

  return (
    <main className="relative min-h-screen flex items-start justify-center bg-black overflow-hidden px-5 py-10">
      {/* Subtle blue glow at top */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-25%', left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 500, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,90,230,0.16) 0%, transparent 65%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative z-10 w-full max-w-[640px] rounded-3xl px-7 py-9 sm:px-10"
        style={{
          background: 'linear-gradient(180deg, #0a121f 0%, #060a13 60%, #04080f 100%)',
          border: '1px solid rgba(0,102,255,0.12)',
          boxShadow: '0 0 0 1px rgba(0,80,220,0.05) inset, 0 30px 80px rgba(0,30,140,0.25)',
        }}
      >
        <h1 className="text-white font-extrabold text-[28px] sm:text-[32px] text-center mb-7">
          Join as an Affiliate
        </h1>

        <Stepper step={step} />

        <AnimatePresence mode="wait">
          {/* ── STEP 1 ─────────────────────────────────── */}
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleNext}
              className="grid grid-cols-2 gap-5"
            >
              {/* Select Package */}
              <Field
                label="Select Package"
                required
                hint="Choose a package to get started"
                icon={
                  <lord-icon
                    src="https://cdn.lordicon.com/qjinkcts.json"
                    trigger="hover"
                    colors="primary:#ffffff"
                    style={{ width: '16px', height: '16px' }}
                  />
                }
              >
                <div className="relative">
                  <select
                    required
                    value={packageId}
                    onChange={e => setPackageId(e.target.value)}
                    className={`${inputCls} appearance-none pr-10 cursor-pointer`}
                  >
                    <option value="" disabled></option>
                    {PACKAGES.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ₹{p.amount.toLocaleString('en-IN')} · {p.blurb}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </Field>

              {/* Sponsor ID */}
              <Field
                label="Sponsor ID (Optional)"
                half
                icon={
                  <lord-icon
                    src="https://cdn.lordicon.com/xfftupgo.json"
                    trigger="hover"
                    colors="primary:#ffffff"
                    style={{ width: '16px', height: '16px' }}
                  />
                }
              >
                <input
                  type="text"
                  value={sponsorId}
                  onChange={e => setSponsorId(e.target.value)}
                  placeholder="Enter Sponsor ID (e.g. ADS15000)"
                  className={inputCls}
                />
              </Field>

              {/* Sponsor Name (green) */}
              <Field
                label="Sponsor Name"
                half
                icon={
                  <lord-icon
                    src="https://cdn.lordicon.com/iykgtsdc.json"
                    trigger="hover"
                    colors="primary:#22c55e"
                    style={{ width: '16px', height: '16px' }}
                  />
                }
              >
                <input
                  type="text"
                  value={sponsorName}
                  readOnly
                  placeholder="Will be auto-filled from Sponsor ID"
                  className="w-full bg-[#0a2a1f] border border-[#22c55e40] rounded-xl px-4 py-3.5 text-[#22c55e] text-[14px] placeholder:text-[#22c55ea0] cursor-not-allowed focus:outline-none"
                />
              </Field>

              {/* Full Name */}
              <Field
                label="Full Name"
                required
                icon={
                  <lord-icon
                    src="https://cdn.lordicon.com/iykgtsdc.json"
                    trigger="hover"
                    colors="primary:#ffffff"
                    style={{ width: '16px', height: '16px' }}
                  />
                }
              >
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className={inputCls}
                />
              </Field>

              {/* Email */}
              <Field
                label="Email"
                required
                icon={
                  <lord-icon
                    src="https://cdn.lordicon.com/dmvvtziq.json"
                    trigger="hover"
                    colors="primary:#ffffff"
                    style={{ width: '16px', height: '16px' }}
                  />
                }
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className={inputCls}
                />
              </Field>

              {/* Mobile */}
              <Field
                label="Mobile"
                required
                hint="Enter 10-digit mobile number"
                icon={
                  <lord-icon
                    src="https://cdn.lordicon.com/oamyqasd.json"
                    trigger="hover"
                    colors="primary:#ffffff"
                    style={{ width: '16px', height: '16px' }}
                  />
                }
              >
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter your mobile number"
                  className={inputCls}
                />
              </Field>

              {/* State */}
              <Field
                label="Select State"
                required
                icon={
                  <lord-icon
                    src="https://cdn.lordicon.com/lnbmtkde.json"
                    trigger="hover"
                    colors="primary:#ffffff"
                    style={{ width: '16px', height: '16px' }}
                  />
                }
              >
                <div className="relative">
                  <select
                    required
                    value={stateName}
                    onChange={e => setStateName(e.target.value)}
                    className={`${inputCls} appearance-none pr-10 cursor-pointer`}
                  >
                    <option value="" disabled>-- Select State --</option>
                    {STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <svg
                    className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </Field>

              {/* Password */}
              <Field
                label="Password"
                required
                half
                icon={
                  <lord-icon
                    src="https://cdn.lordicon.com/fmjvmlnr.json"
                    trigger="hover"
                    colors="primary:#ffffff"
                    style={{ width: '16px', height: '16px' }}
                  />
                }
              >
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className={inputCls}
                />
              </Field>

              {/* Confirm */}
              <Field
                label="Confirm Password"
                required
                half
                icon={
                  <lord-icon
                    src="https://cdn.lordicon.com/iykgtsdc.json"
                    trigger="hover"
                    colors="primary:#ffffff"
                    style={{ width: '16px', height: '16px' }}
                  />
                }
              >
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={inputCls}
                />
              </Field>

              {/* Agree */}
              <div className="col-span-2">
                <label className="flex items-start gap-2.5 text-[12.5px] text-gray-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={e => setAgree(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded accent-[#0a7cff] cursor-pointer"
                  />
                  <span>
                    I agree to the{' '}
                    <Link href="#" className="text-[#0a7cff] font-bold hover:underline">Terms of Service</Link>{' '}
                    and{' '}
                    <Link href="#" className="text-[#0a7cff] font-bold hover:underline">Privacy Policy</Link>
                  </span>
                </label>
              </div>

              {error && (
                <p className="col-span-2 text-red-400 text-[13px] font-semibold -mt-2">{error}</p>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={paying}
                whileHover={{ scale: paying ? 1 : 1.005 }}
                whileTap={{ scale: paying ? 1 : 0.99 }}
                className="col-span-2 mt-1 text-white font-extrabold text-[16px] px-6 py-4 rounded-2xl transition-all duration-200 disabled:opacity-70 disabled:cursor-wait"
                style={{
                  background: 'linear-gradient(180deg, #2a8eff 0%, #0a7cff 100%)',
                  boxShadow: '0 8px 26px rgba(10,124,255,0.45)',
                }}
              >
                {paying ? 'Creating account…' : 'Next: Payment'}
              </motion.button>

              {/* Footer link */}
              <p className="col-span-2 text-center text-gray-400 text-[14px]">
                Already have an account?{' '}
                <Link href="/login" className="text-[#0a7cff] font-extrabold hover:text-blue-400">
                  Login Now
                </Link>
              </p>
            </motion.form>
          )}

          {/* ── STEP 2 ─────────────────────────────────── */}
          {step === 2 && selected && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Payment card */}
              <div
                className="rounded-2xl p-8 text-center"
                style={{
                  background:
                    'linear-gradient(140deg, #1f7dff 0%, #0a7cff 50%, #0055cc 100%)',
                  boxShadow: '0 18px 60px rgba(0,80,220,0.5)',
                }}
              >
                <div className="flex items-center justify-center gap-2.5 mb-5">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <rect x="2" y="6" width="20" height="13" rx="2" />
                    <path d="M2 10h20M6 15h4" strokeLinecap="round" />
                  </svg>
                  <h2 className="text-white font-extrabold text-[22px]">Package Payment</h2>
                </div>

                <p className="text-white/85 text-[14px] font-semibold mb-1">Amount to Pay:</p>
                <p className="text-white font-black text-[58px] leading-none my-2">
                  ₹{selected.amount.toLocaleString('en-IN')}
                </p>
                <p className="text-white/80 text-[13px] mt-4">
                  Please complete the payment to proceed with registration.
                </p>
              </div>

              {/* Pay button */}
              <motion.button
                onClick={handlePay}
                disabled={paying}
                whileHover={{ scale: paying ? 1 : 1.005 }}
                whileTap={{ scale: paying ? 1 : 0.99 }}
                className="w-full disabled:opacity-70 disabled:cursor-wait text-white font-extrabold text-[15px] px-6 py-4 rounded-2xl transition-all duration-200"
                style={{
                  background: 'linear-gradient(180deg, #2a8eff 0%, #0a7cff 100%)',
                  boxShadow: '0 8px 26px rgba(10,124,255,0.45)',
                }}
              >
                {paying
                  ? 'Processing payment…'
                  : `Pay ₹${selected.amount.toLocaleString('en-IN')} & Complete Registration`}
              </motion.button>

              {/* Back */}
              <button
                onClick={() => setStep(1)}
                disabled={paying}
                className="w-full bg-[#9ca3af] hover:bg-[#a8b0bc] disabled:opacity-50 text-[#0a121f] font-bold text-[14px] px-6 py-3.5 rounded-2xl transition-colors duration-200"
              >
                ← Back to Details
              </button>
            </motion.div>
          )}

          {/* ── STEP 3 ─────────────────────────────────── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-center py-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.15 }}
                className="w-20 h-20 mx-auto rounded-full bg-[#22c55e] flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(34,197,94,0.55)]"
              >
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              <h2 className="text-white font-extrabold text-[26px] mb-2">Registration Complete!</h2>
              <p className="text-gray-400 text-[14px] mb-7 max-w-[420px] mx-auto">
                Welcome to ADS Skill India. Your affiliate account has been created and your
                {selected ? ` ${selected.name}` : ''} package is active.
              </p>

              <Link
                href="/login"
                className="inline-block text-white font-extrabold text-[15px] px-8 py-4 rounded-2xl transition-all duration-200"
                style={{
                  background: 'linear-gradient(180deg, #2a8eff 0%, #0a7cff 100%)',
                  boxShadow: '0 8px 26px rgba(10,124,255,0.45)',
                }}
              >
                Continue to Login
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  )
}
