'use client';

import { Check, X } from 'lucide-react';
import { checkPassword } from '@/lib/password';

/** Live password-requirement checklist. Each rule turns green as it's met. */
export function PasswordChecklist({ password }: { password: string }) {
  const c = checkPassword(password);
  const items: [boolean, string][] = [
    [c.length, 'At least 8 characters'],
    [c.upper, 'One uppercase letter (A–Z)'],
    [c.lower, 'One lowercase letter (a–z)'],
    [c.number, 'One number (0–9)'],
    [c.special, 'One special symbol (!@#$…)'],
  ];
  return (
    <ul className="mt-2.5 space-y-1.5">
      {items.map(([ok, label]) => (
        <li
          key={label}
          className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors ${
            ok ? 'text-green-400' : 'text-gray-500'
          }`}
        >
          <span
            className={`flex items-center justify-center w-4 h-4 rounded-full ${
              ok ? 'bg-green-500/20' : 'bg-white/5'
            }`}
          >
            {ok ? <Check size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}
          </span>
          {label}
        </li>
      ))}
    </ul>
  );
}
