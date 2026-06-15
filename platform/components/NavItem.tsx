'use client'

import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface NavItemProps {
  href: string
  label: string
  active: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any
}

export default function NavItem({ href, label, active, icon }: NavItemProps) {
  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          padding: '8px',
          borderRadius: 16,
          width: '100%',
          boxSizing: 'border-box',
          background: active ? '#e6e6e6' : 'transparent',
          border: active ? '2px solid #d9d9d9' : '2px solid transparent',
          boxShadow: active
            ? '0px 0.6px 0.6px -1.25px rgba(0,0,0,0.18), 0px 2.29px 2.29px -2.5px rgba(0,0,0,0.16), 0px 10px 10px -3.75px rgba(0,0,0,0.06)'
            : 'none',
          transition: 'background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease',
        }}
      >
        <HugeiconsIcon
          icon={icon}
          size={20}
          color={active ? '#16a34a' : '#52555d'}
          strokeWidth={active ? 2 : 1.75}
          style={{ flexShrink: 0 }}
        />
        <span
          style={{
            fontFamily: '"Poppins", sans-serif',
            fontSize: 14,
            fontWeight: 500,
            fontStyle: 'normal',
            color: active ? '#000000' : '#52555d',
            lineHeight: '20px',
            letterSpacing: '0em',
            whiteSpace: 'pre',
          }}
        >
          {label}
        </span>
      </div>
    </Link>
  )
}
