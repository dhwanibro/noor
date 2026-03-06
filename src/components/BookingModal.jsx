import { useState } from 'react'
import { Avatar, Modal, Button } from './UI'

const SLOTS = ['Today, 3:00 PM', 'Today, 5:30 PM', 'Tomorrow, 10:00 AM', 'Tomorrow, 2:00 PM']

export default function BookingModal({ advisor, onClose }) {
  const [booked, setBooked] = useState(null)

  // Reset booked state when modal closes
  const handleClose = () => {
    setBooked(null)
    onClose()
  }

  // Guard — don't render content if no advisor
  if (!advisor) return null

  return (
    <Modal open={true} onClose={handleClose}>
      <div className="p-6">
        {!booked ? (
          <>
            <div className="flex gap-3 items-center mb-5">
              <Avatar initials={advisor.initials} size={44} />
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">{advisor.name}</h3>
                <p className="text-xs text-muted font-body">{advisor.specialty} · {advisor.fee} per session</p>
              </div>
            </div>
            <p className="text-sm font-body text-sub mb-4">Select a time slot:</p>
            <div className="space-y-2.5 mb-4">
              {SLOTS.map(slot => (
                <button
                  key={slot}
                  onClick={() => setBooked(slot)}
                  className="w-full border border-border rounded-xl px-4 py-3.5 text-[13px] font-body font-medium text-ink text-left hover:border-terra-mid transition-colors"
                >
                  {slot}
                </button>
              ))}
            </div>
            <Button variant="outline" onClick={handleClose} fullWidth>Cancel</Button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-sage-light mx-auto mb-4 flex items-center justify-center text-2xl">✓</div>
            <h3 className="font-display text-xl font-semibold text-ink mb-2">You're booked!</h3>
            <p className="text-sm text-sub font-body leading-relaxed">
              Session with <strong className="text-ink">{advisor.name}</strong><br />
              confirmed for <strong className="text-ink">{booked}</strong>.
            </p>
            <p className="text-xs text-muted font-body mt-2">A reminder will be sent before the call.</p>
            <Button variant="primary" onClick={handleClose} className="mt-5 px-10">Done</Button>
          </div>
        )}
      </div>
    </Modal>
  )
}
