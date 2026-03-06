import { useState } from 'react'
import { govSchemes, jobListings, helplines } from '../data/seed'
import { Card, SectionHeader, Chip } from '../components/UI'

// ── SIP Calculator ────────────────────────────────────────────────────────────
function SIPCalculator() {
  const [monthly, setMonthly] = useState(1000)
  const [years, setYears] = useState(10)
  const [rate, setRate] = useState(12)

  const months = years * 12
  const r = rate / 100 / 12
  const fv = r === 0
    ? monthly * months
    : monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r)
  const invested = monthly * months

  const fmt = n => n >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : `₹${Math.round(n).toLocaleString('en-IN')}`

  return (
    <Card className="p-4 mb-4">
      <p className="font-display text-[16px] font-semibold text-ink mb-4">SIP Growth Calculator</p>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-xs text-sub font-body">Monthly SIP</label>
            <span className="text-xs font-semibold text-terra font-body">₹{monthly.toLocaleString('en-IN')}</span>
          </div>
          <input type="range" min="100" max="50000" step="100" value={monthly}
            onChange={e => setMonthly(+e.target.value)}
            className="w-full accent-terra" />
        </div>

        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-xs text-sub font-body">Duration</label>
            <span className="text-xs font-semibold text-terra font-body">{years} years</span>
          </div>
          <input type="range" min="1" max="30" step="1" value={years}
            onChange={e => setYears(+e.target.value)}
            className="w-full accent-terra" />
        </div>

        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-xs text-sub font-body">Expected return (p.a.)</label>
            <span className="text-xs font-semibold text-terra font-body">{rate}%</span>
          </div>
          <input type="range" min="4" max="20" step="0.5" value={rate}
            onChange={e => setRate(+e.target.value)}
            className="w-full accent-terra" />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[11px] text-muted font-body">Invested</p>
          <p className="font-display text-base font-semibold text-ink mt-0.5">{fmt(invested)}</p>
        </div>
        <div>
          <p className="text-[11px] text-muted font-body">Returns</p>
          <p className="font-display text-base font-semibold text-sage mt-0.5">{fmt(fv - invested)}</p>
        </div>
        <div>
          <p className="text-[11px] text-muted font-body">Total Value</p>
          <p className="font-display text-base font-semibold text-terra mt-0.5">{fmt(fv)}</p>
        </div>
      </div>
    </Card>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const SECTIONS = ['Schemes', 'Calculator', 'Jobs']

export default function Resources() {
  const [section, setSection] = useState('Schemes')

  return (
    <div className="animate-fade-up px-4 pt-5">
      <h1 className="font-display text-[22px] font-semibold text-ink mb-1">Resources</h1>
      <p className="text-[13px] text-muted font-body mb-4">Tools and opportunities for you</p>

      {/* Section tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {SECTIONS.map(s => (
          <Chip key={s} label={s} active={section === s} onClick={() => setSection(s)} />
        ))}
      </div>

      {/* Gov Schemes */}
      {section === 'Schemes' && (
        <div className="animate-fade-in">
          {govSchemes.map(s => (
            <Card key={s.id} className="p-4 mb-3">
              <div className="flex gap-3 items-start">
                <span className="text-2xl flex-shrink-0">{s.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-semibold text-[14px] text-ink font-body leading-snug">{s.title}</p>
                    <span className="text-[10px] bg-terra-light text-terra px-2 py-0.5 rounded-full font-semibold font-body flex-shrink-0">{s.tag}</span>
                  </div>
                  <p className="text-[12px] text-sub font-body leading-relaxed mt-1.5">{s.desc}</p>
                  <a href={s.link} target="_blank" rel="noopener noreferrer"
                    className="text-[11px] text-terra font-body mt-2 inline-block">
                    Learn more →
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Calculator */}
      {section === 'Calculator' && (
        <div className="animate-fade-in">
          <SIPCalculator />
          <Card className="p-4 bg-sage-light border-sage/20">
            <p className="text-[13px] text-sage font-body leading-relaxed">
              💡 Even ₹500/month invested in a mutual fund for 15 years at 12% return grows to over <strong>₹2.5 lakhs</strong>. Start small, start today.
            </p>
          </Card>
        </div>
      )}

      {/* Jobs */}
      {section === 'Jobs' && (
        <div className="animate-fade-in">
          {jobListings.map(j => (
            <Card key={j.id} className="p-4 mb-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-[14px] text-ink font-body">{j.title}</p>
                  <p className="text-[12px] text-muted font-body mt-0.5">{j.company} · {j.type}</p>
                  <p className="text-[12px] font-semibold text-terra font-body mt-1.5">{j.salary}</p>
                </div>
                <span className={`text-[10px] font-semibold font-body px-2 py-0.5 rounded-full flex-shrink-0 ${
                  j.tag === 'Full-time' ? 'bg-sage-light text-sage' :
                  j.tag === 'Part-time' ? 'bg-terra-light text-terra' :
                  'bg-[#F0EEFF] text-[#5B4EA8]'
                }`}>{j.tag}</span>
              </div>
              <button className="mt-3 text-[12px] font-semibold text-terra font-body border border-terra/30 rounded-lg px-3 py-1.5">
                Apply →
              </button>
            </Card>
          ))}
        </div>
      )}

      {/* Discreet helplines at the bottom */}
      <div className="mt-6 mb-4">
        <p className="text-[11px] text-muted font-body uppercase tracking-widest mb-3">Need someone to talk to?</p>
        <div className="grid grid-cols-2 gap-2">
          {helplines.map(h => (
            <button key={h.name}
              className="bg-surface border border-border rounded-2xl p-3 text-left">
              <p className="text-[12px] font-semibold text-ink font-body">{h.name}</p>
              <p className="text-[11px] text-muted font-body mt-0.5">{h.desc}</p>
              <p className="text-[13px] font-bold text-terra font-body mt-1.5">{h.number}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
