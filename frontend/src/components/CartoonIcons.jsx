import React from 'react';

// Mascot: น้องคอปเปอร์ (Nong Copper)
export function NongCopper({ size = 80, mood = "happy", className = "" }) {
  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md select-none">
        <defs>
          <radialGradient id="copperNugget" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffb076" />
            <stop offset="40%" stopColor="#e87834" />
            <stop offset="85%" stopColor="#b85215" />
            <stop offset="100%" stopColor="#7a3107" />
          </radialGradient>
          <linearGradient id="yellowHelmet" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fed766" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        <ellipse cx="60" cy="110" rx="40" ry="8" fill="#000000" opacity="0.08" />

        <path
          d="M32 52 C20 62, 18 88, 35 100 C50 110, 72 110, 88 98 C102 86, 102 65, 88 52 C76 42, 45 42, 32 52 Z"
          fill="url(#copperNugget)"
        />

        <path
          d="M38 58 C32 66, 32 80, 40 88"
          stroke="#ffe6d2"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />
        <circle cx="48" cy="56" r="3" fill="#ffffff" opacity="0.9" />

        <path
          d="M26 44 C26 24, 94 24, 94 44 C96 46, 92 48, 88 48 L32 48 C28 48, 24 46, 26 44 Z"
          fill="url(#yellowHelmet)"
        />
        <rect x="22" y="44" width="76" height="6" rx="3" fill="#d97706" />
        <path d="M57 24 L57 44" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

        {mood === "wink" ? (
          <>
            <path d="M42 70 Q48 76 54 70" stroke="#331805" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="72" cy="70" r="5" fill="#331805" />
            <circle cx="74" cy="68" r="2" fill="#ffffff" />
          </>
        ) : (
          <>
            <circle cx="46" cy="69" r="5.5" fill="#331805" />
            <circle cx="48" cy="67" r="2" fill="#ffffff" />
            <circle cx="74" cy="69" r="5.5" fill="#331805" />
            <circle cx="76" cy="67" r="2" fill="#ffffff" />
          </>
        )}

        <ellipse cx="37" cy="76" rx="5" ry="3" fill="#ff4d4d" opacity="0.45" />
        <ellipse cx="83" cy="76" rx="5" ry="3" fill="#ff4d4d" opacity="0.45" />

        <path
          d="M52 76 Q60 85 68 76"
          stroke="#331805"
          strokeWidth="3"
          strokeLinecap="round"
          fill="#c02626"
        />

        <path
          d="M98 34 L100 28 L102 34 L108 36 L102 38 L100 44 L98 38 L92 36 Z"
          fill="#fcd34d"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}

// Cartoon Scrap & E-Waste Icons - ครบทุกหมวดหมู่สินค้าจริง
export function CartoonScrapIcon({ type, size = 48 }) {
  switch (type) {
    // 1. ทองแดงใหญ่ / ปอกสวย
    case 'cu_big':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" className="drop-shadow-sm select-none">
          <circle cx="40" cy="40" r="32" fill="#fff7ed" stroke="#fb923c" strokeWidth="2.5" />
          <path
            d="M24 42 C24 26, 56 26, 56 42 C56 56, 24 56, 24 42"
            fill="none"
            stroke="#ea580c"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M26 42 C26 30, 54 30, 54 42"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="35" cy="41" r="2.5" fill="#431407" />
          <circle cx="45" cy="41" r="2.5" fill="#431407" />
          <path d="M38 46 Q40 49 42 46" stroke="#431407" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M34 22 L37 26 L40 21 L43 26 L46 22 L45 28 L35 28 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
        </svg>
      );

    // 2. ทองแดงเล็ก / ช็อต / สายโทร
    case 'cu_small':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" className="drop-shadow-sm select-none">
          <circle cx="40" cy="40" r="32" fill="#fff7ed" stroke="#fed7aa" strokeWidth="2" />
          <path d="M22 36 Q38 24 54 34" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M24 42 Q40 30 56 40" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M22 48 Q38 36 54 46" stroke="#c2410c" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="36" cy="38" r="2.5" fill="#431407" />
          <circle cx="46" cy="38" r="2.5" fill="#431407" />
          <circle cx="37" cy="37" r="0.8" fill="#ffffff" />
          <circle cx="47" cy="37" r="0.8" fill="#ffffff" />
          <ellipse cx="32" cy="42" rx="2" ry="1.2" fill="#f87171" opacity="0.5" />
          <ellipse cx="50" cy="42" rx="2" ry="1.2" fill="#f87171" opacity="0.5" />
        </svg>
      );

    // 3. ทองแดงเผา
    case 'cu_burned':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" className="drop-shadow-sm select-none">
          <circle cx="40" cy="40" r="32" fill="#fef2f2" stroke="#fecaca" strokeWidth="2" />
          <path
            d="M26 42 C26 30, 54 30, 54 42 C54 54, 26 54, 26 42"
            fill="none"
            stroke="#78350f"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <ellipse cx="32" cy="43" rx="3.5" ry="2.5" fill="#451a03" opacity="0.6" />
          <circle cx="36" cy="40" r="2" fill="#ffffff" />
          <circle cx="44" cy="40" r="2" fill="#ffffff" />
          <ellipse cx="48" cy="23" rx="4" ry="3" fill="#cbd5e1" opacity="0.8" />
          <ellipse cx="54" cy="18" rx="5" ry="3.5" fill="#cbd5e1" opacity="0.6" />
        </svg>
      );

    // 4. ทองแดงชุบขาว
    case 'cu_plated':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" className="drop-shadow-sm select-none">
          <circle cx="40" cy="40" r="32" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="22" y="30" width="36" height="22" rx="5" fill="#ea580c" />
          <rect x="22" y="30" width="20" height="22" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
          <rect x="28" y="36" width="9" height="7" rx="2" fill="#0f172a" />
          <rect x="41" y="36" width="9" height="7" rx="2" fill="#0f172a" />
          <line x1="37" y1="39" x2="41" y2="39" stroke="#0f172a" strokeWidth="2" />
        </svg>
      );

    // 5. เม็ดเงินบริสุทธิ์ / แมกเนติก / เบรคเกอร์
    case 'silver':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" className="drop-shadow-sm select-none">
          <circle cx="40" cy="40" r="32" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="2" />
          {/* Silver Nuggets */}
          <ellipse cx="40" cy="43" rx="16" ry="11" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
          <ellipse cx="38" cy="39" rx="12" ry="7" fill="#ffffff" opacity="0.7" />
          <circle cx="35" cy="42" r="2.2" fill="#1e293b" />
          <circle cx="45" cy="42" r="2.2" fill="#1e293b" />
          <path d="M38 46 Q40 48 42 46" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Diamond Sparkles */}
          <polygon points="56,24 58,19 60,24 65,26 60,28 58,33 56,28 51,26" fill="#38bdf8" />
          <polygon points="22,28 23,25 24,28 27,29 24,30 23,33 22,30 19,29" fill="#0ea5e9" />
        </svg>
      );

    // 6. คาร์ไบด์ (ก้าน / เม็ด / ก้อน)
    case 'carbide':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" className="drop-shadow-sm select-none">
          <circle cx="40" cy="40" r="32" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
          {/* Tough Tungsten Rod */}
          <rect x="26" y="24" width="28" height="32" rx="4" fill="#475569" stroke="#1e293b" strokeWidth="2" />
          <path d="M26 32 L54 32 M26 48 L54 48" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="35" cy="40" r="2.2" fill="#ffffff" />
          <circle cx="45" cy="40" r="2.2" fill="#ffffff" />
          <path d="M37 44 L43 44" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // 7. แรมบาง / บอร์ดไม้บรรทัด
    case 'ram':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" className="drop-shadow-sm select-none">
          <circle cx="40" cy="40" r="32" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="2" />
          {/* Green PCB Stick */}
          <rect x="16" y="28" width="48" height="22" rx="3" fill="#059669" stroke="#065f46" strokeWidth="1.5" />
          {/* Black Memory Chips */}
          <rect x="21" y="32" width="8" height="10" rx="1" fill="#1e293b" />
          <rect x="31" y="32" width="8" height="10" rx="1" fill="#1e293b" />
          <rect x="41" y="32" width="8" height="10" rx="1" fill="#1e293b" />
          <rect x="51" y="32" width="8" height="10" rx="1" fill="#1e293b" />
          {/* Gold Finger Pins */}
          <rect x="18" y="47" width="44" height="4" fill="#fbbf24" />
          {/* Cute eyes on chips */}
          <circle cx="25" cy="36" r="1.2" fill="#ffffff" />
          <circle cx="35" cy="36" r="1.2" fill="#ffffff" />
        </svg>
      );

    // 8. CPU เขียว / ไม้
    case 'cpu':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" className="drop-shadow-sm select-none">
          <circle cx="40" cy="40" r="32" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
          <rect x="22" y="22" width="36" height="36" rx="4" fill="#16a34a" stroke="#14532d" strokeWidth="2" />
          <rect x="29" y="29" width="22" height="22" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Gold corners */}
          <polygon points="24,56 28,56 24,52" fill="#facc15" />
          {/* Face */}
          <circle cx="36" cy="38" r="2" fill="#1e293b" />
          <circle cx="44" cy="38" r="2" fill="#1e293b" />
          <path d="M38 43 Q40 45 42 43" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    // 9. การ์ดจอ / บอร์ด 2 ชิพ
    case 'gpu':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" className="drop-shadow-sm select-none">
          <circle cx="40" cy="40" r="32" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="2" />
          <rect x="16" y="27" width="48" height="26" rx="4" fill="#334155" stroke="#0f172a" strokeWidth="2" />
          {/* Dual Cooling Fans */}
          <circle cx="30" cy="40" r="8" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="50" cy="40" r="8" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Cute eyes in center of fans */}
          <circle cx="30" cy="40" r="2" fill="#a855f7" />
          <circle cx="50" cy="40" r="2" fill="#a855f7" />
          {/* Gold PCIe connector */}
          <rect x="24" y="52" width="28" height="4" fill="#eab308" />
        </svg>
      );

    // 10. บอร์ดคอม 0-1-2 ชิพ / บอร์ดเร้าเตอร์ / บอร์ดแต้มทอง / Pw เขียว
    case 'board':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" className="drop-shadow-sm select-none">
          <circle cx="40" cy="40" r="32" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
          <rect x="20" y="22" width="40" height="36" rx="4" fill="#15803d" stroke="#14532d" strokeWidth="1.5" />
          {/* IC Chip */}
          <rect x="28" y="28" width="16" height="14" rx="2" fill="#1e293b" />
          {/* Gold pads */}
          <circle cx="50" cy="30" r="2.5" fill="#facc15" />
          <circle cx="50" cy="38" r="2.5" fill="#facc15" />
          <rect x="26" y="48" width="28" height="4" rx="1" fill="#fbbf24" />
          {/* Cute Eyes on Chip */}
          <circle cx="33" cy="34" r="1.8" fill="#ffffff" />
          <circle cx="39" cy="34" r="1.8" fill="#ffffff" />
          <path d="M34 38 Q36 40 38 38" stroke="#ffffff" strokeWidth="1.2" fill="none" />
        </svg>
      );

    // 11. บอร์ดแดง / ขยะ TV
    case 'board_red':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" className="drop-shadow-sm select-none">
          <circle cx="40" cy="40" r="32" fill="#fef2f2" stroke="#fca5a5" strokeWidth="2" />
          <rect x="20" y="22" width="40" height="36" rx="4" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
          {/* Capacitors & Copper coils */}
          <circle cx="30" cy="32" r="5" fill="#1e293b" />
          <circle cx="48" cy="34" r="4" fill="#eab308" />
          <rect x="26" y="44" width="24" height="6" rx="2" fill="#fb923c" />
          <circle cx="36" cy="34" r="2" fill="#ffffff" />
          <circle cx="44" cy="34" r="2" fill="#ffffff" />
        </svg>
      );

    // 12. ฮาร์ดดิส (HDD) / Pw Box
    case 'hdd':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" className="drop-shadow-sm select-none">
          <circle cx="40" cy="40" r="32" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="23" y="18" width="34" height="44" rx="4" fill="#64748b" stroke="#334155" strokeWidth="2" />
          {/* Platter Disk */}
          <circle cx="40" cy="36" r="12" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="40" cy="36" r="4" fill="#475569" />
          {/* Cute Face */}
          <circle cx="35" cy="52" r="2" fill="#ffffff" />
          <circle cx="45" cy="52" r="2" fill="#ffffff" />
          <path d="M38 56 Q40 58 42 56" stroke="#ffffff" strokeWidth="1.5" fill="none" />
        </svg>
      );

    // 13. แผ่น CD / CD-ROM
    case 'cd':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" className="drop-shadow-sm select-none">
          <circle cx="40" cy="40" r="32" fill="#fdf4ff" stroke="#f0abfc" strokeWidth="2" />
          <circle cx="40" cy="40" r="22" fill="#e0e7ff" stroke="#a5b4fc" strokeWidth="2" />
          <path d="M40 18 L54 34 L40 40 Z" fill="#f472b6" opacity="0.4" />
          <path d="M40 62 L26 46 L40 40 Z" fill="#38bdf8" opacity="0.4" />
          <circle cx="40" cy="40" r="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="33" cy="36" r="2" fill="#334155" />
          <circle cx="47" cy="36" r="2" fill="#334155" />
        </svg>
      );

    // 14. ฟิล์ม X-Ray
    case 'xray':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" className="drop-shadow-sm select-none">
          <circle cx="40" cy="40" r="32" fill="#eff6ff" stroke="#93c5fd" strokeWidth="2" />
          <rect x="24" y="20" width="32" height="40" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          {/* Cute Ribs / Skeleton lines */}
          <path d="M40 26 L40 52 M32 32 L48 32 M31 38 L49 38 M32 44 L48 44" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="36" cy="28" r="1.5" fill="#ffffff" />
          <circle cx="44" cy="28" r="1.5" fill="#ffffff" />
        </svg>
      );

    // 15. เบรคเกอร์ / แมคเนติก / ดีเลย์ / ปิ๊กแป๊ก
    case 'breaker':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" className="drop-shadow-sm select-none">
          <circle cx="40" cy="40" r="32" fill="#fefce8" stroke="#fde047" strokeWidth="2" />
          <rect x="24" y="20" width="32" height="40" rx="4" fill="#334155" stroke="#0f172a" strokeWidth="2" />
          {/* Breaker Switch */}
          <rect x="33" y="28" width="14" height="10" rx="2" fill="#ef4444" />
          {/* Lightning Bolt */}
          <polygon points="42,40 36,48 40,48 38,56 46,46 41,46" fill="#facc15" />
          {/* Cute Eyes */}
          <circle cx="31" cy="25" r="1.8" fill="#ffffff" />
          <circle cx="49" cy="25" r="1.8" fill="#ffffff" />
        </svg>
      );

    // 16. ทองเหลืองหนา
    case 'brass_heavy':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" className="drop-shadow-sm select-none">
          <circle cx="40" cy="40" r="32" fill="#fefce8" stroke="#fef08a" strokeWidth="2" />
          <polygon points="40,24 55,32 55,48 40,56 25,48 25,32" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
          <circle cx="40" cy="40" r="8" fill="#fef08a" />
          <circle cx="37" cy="39" r="2" fill="#713f12" />
          <circle cx="43" cy="39" r="2" fill="#713f12" />
          <path d="M38 42 Q40 44 42 42" stroke="#713f12" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    // 17. อะลูมิเนียมสาย / หนา / บาง / ฟรอย
    case 'aluminum_wire':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" className="drop-shadow-sm select-none">
          <circle cx="40" cy="40" r="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
          <ellipse cx="40" cy="44" rx="18" ry="11" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
          <ellipse cx="40" cy="36" rx="18" ry="11" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="36" cy="35" r="2.5" fill="#334155" />
          <circle cx="44" cy="35" r="2.5" fill="#334155" />
        </svg>
      );

    // 18. เหล็กหนา / บาง
    case 'steel':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" className="drop-shadow-sm select-none">
          <circle cx="40" cy="40" r="32" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
          {/* Heavy Steel I-Beam */}
          <rect x="22" y="24" width="36" height="8" rx="2" fill="#475569" />
          <rect x="33" y="32" width="14" height="16" fill="#64748b" />
          <rect x="22" y="48" width="36" height="8" rx="2" fill="#475569" />
          <circle cx="37" cy="39" r="2" fill="#ffffff" />
          <circle cx="43" cy="39" r="2" fill="#ffffff" />
        </svg>
      );

    // 19. โทรศัพท์มือถือ
    case 'phone':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" className="drop-shadow-sm select-none">
          <circle cx="40" cy="40" r="32" fill="#f0f9ff" stroke="#7dd3fc" strokeWidth="2" />
          <rect x="26" y="18" width="28" height="44" rx="5" fill="#1e293b" />
          <rect x="29" y="23" width="22" height="32" rx="2" fill="#38bdf8" />
          <circle cx="36" cy="36" r="2.2" fill="#ffffff" />
          <circle cx="44" cy="36" r="2.2" fill="#ffffff" />
          <path d="M37 41 Q40 44 43 41" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <circle cx="40" cy="58" r="1.5" fill="#94a3b8" />
        </svg>
      );

    // 20. แบตเตอรี่เก่า
    case 'battery_old':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" className="drop-shadow-sm select-none">
          <circle cx="40" cy="40" r="32" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="2" />
          <rect x="26" y="28" width="28" height="30" rx="4" fill="#3b82f6" />
          <rect x="34" y="24" width="12" height="4" rx="2" fill="#1d4ed8" />
          <text x="30" y="37" fontSize="9" fontWeight="bold" fill="#ffffff">+</text>
          <text x="44" y="37" fontSize="10" fontWeight="bold" fill="#ffffff">-</text>
          <circle cx="36" cy="46" r="2" fill="#ffffff" />
          <circle cx="44" cy="46" r="2" fill="#ffffff" />
        </svg>
      );
  }
}

// Cartoon Reward Icons
export function CartoonRewardIcon({ id, size = 42 }) {
  switch (id) {
    case 'cash_custom':
      return (
        <svg width={size} height={size} viewBox="0 0 60 60" className="select-none">
          <rect x="12" y="10" width="36" height="40" rx="8" fill="#0284c7" />
          <rect x="16" y="14" width="28" height="32" rx="4" fill="#ffffff" />
          <path d="M24 24 L30 18 L36 24 M30 18 L30 38" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="42" cy="18" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
          <text x="40" y="21" fontSize="7" fontWeight="bold" fill="#ffffff">฿</text>
        </svg>
      );

    case 'wire_stripper':
      return (
        <svg width={size} height={size} viewBox="0 0 60 60" className="select-none">
          <rect x="14" y="20" width="32" height="26" rx="5" fill="#334155" />
          <circle cx="24" cy="32" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="36" cy="32" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
          <line x1="8" y1="32" x2="52" y2="32" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />
          <rect x="22" y="14" width="16" height="8" rx="2" fill="#0284c7" />
        </svg>
      );

    case 'diesel_fleet':
      return (
        <svg width={size} height={size} viewBox="0 0 60 60" className="select-none">
          <rect x="12" y="24" width="24" height="20" rx="4" fill="#059669" />
          <rect x="28" y="16" width="16" height="28" rx="3" fill="#10b981" />
          <rect x="32" y="20" width="10" height="8" rx="1" fill="#ecfdf5" />
          <circle cx="20" cy="45" r="4.5" fill="#0f172a" />
          <circle cx="38" cy="45" r="4.5" fill="#0f172a" />
          <rect x="34" y="10" width="18" height="12" rx="2" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
          <text x="37" y="18" fontSize="6" fontWeight="bold" fill="#78350f">FLEET</text>
        </svg>
      );

    case 'crane_hoist':
      return (
        <svg width={size} height={size} viewBox="0 0 60 60" className="select-none">
          <rect x="16" y="14" width="28" height="18" rx="4" fill="#dc2626" />
          <rect x="22" y="10" width="16" height="5" rx="1" fill="#991b1b" />
          <line x1="30" y1="32" x2="30" y2="42" stroke="#64748b" strokeWidth="2.5" />
          <path d="M30 42 C30 48, 36 48, 36 44" stroke="#d97706" strokeWidth="3" fill="none" strokeLinecap="round" />
          <text x="23" y="25" fontSize="8" fontWeight="bold" fill="#ffffff">1 TON</text>
        </svg>
      );

    case 'scale_2ton':
      return (
        <svg width={size} height={size} viewBox="0 0 60 60" className="select-none">
          <polygon points="12,38 48,38 52,48 8,48" fill="#475569" stroke="#1e293b" strokeWidth="1" />
          <line x1="16" y1="38" x2="16" y2="16" stroke="#94a3b8" strokeWidth="3" />
          <rect x="12" y="12" width="16" height="11" rx="2" fill="#0f172a" />
          <rect x="14" y="14" width="12" height="7" rx="1" fill="#059669" />
          <text x="15" y="19" fontSize="5" fontWeight="bold" fill="#ffffff">2000kg</text>
        </svg>
      );

    case 'cash_50k':
      return (
        <svg width={size} height={size} viewBox="0 0 60 60" className="select-none">
          <rect x="12" y="20" width="36" height="24" rx="4" fill="#15803d" />
          <rect x="16" y="24" width="28" height="16" rx="2" fill="#22c55e" />
          <circle cx="30" cy="32" r="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
          <text x="27" y="35" fontSize="9" fontWeight="bold" fill="#713f12">50K</text>
          <circle cx="44" cy="18" r="4.5" fill="#f59e0b" />
        </svg>
      );

    case 'cash_100k':
      return (
        <svg width={size} height={size} viewBox="0 0 60 60" className="select-none">
          <rect x="10" y="18" width="40" height="26" rx="5" fill="#b45309" stroke="#f59e0b" strokeWidth="1.5" />
          <rect x="14" y="22" width="32" height="18" rx="3" fill="#fef3c7" />
          <text x="16" y="34" fontSize="10" fontWeight="extrabold" fill="#b45309">100,000฿</text>
          <path d="M26 12 L28 16 L30 11 L32 16 L34 12 L33 18 L27 18 Z" fill="#eab308" />
        </svg>
      );

    case 'hydraulic_baler':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 60 60" className="select-none">
          <rect x="14" y="16" width="32" height="32" rx="4" fill="#1e293b" />
          <rect x="25" y="8" width="10" height="12" rx="2" fill="#e11d48" />
          <line x1="30" y1="20" x2="30" y2="30" stroke="#cbd5e1" strokeWidth="4" />
          <rect x="20" y="32" width="20" height="12" rx="2" fill="#ea580c" stroke="#fed7aa" strokeWidth="1" />
          <circle cx="40" cy="22" r="3" fill="#10b981" />
        </svg>
      );
  }
}
