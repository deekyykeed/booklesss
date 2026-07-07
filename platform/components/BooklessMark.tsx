/**
 * BooklessMark — the three-diamond brand mark.
 * Pure CSS, no image assets. Size prop controls the visual bounding box.
 */

interface BooklessMarkProps {
  size?: number
  className?: string
  /** Override the cream fill (inner ring). Defaults to brand cream #fffef2. */
  cream?: string
  /** Override the ink fill (outer + inner diamond). Defaults to #000000. */
  ink?: string
}

export function BooklessMark({
  size = 100,
  className,
  cream = '#fffef2',
  ink = '#000000',
}: BooklessMarkProps) {
  // The outer square rotated 45° creates a diamond whose tips touch the
  // edges of the size×size bounding box when the square side = size / √2.
  const outerSide = size / Math.SQRT2

  return (
    <div
      className={className}
      style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}
    >
      {/* Outer black diamond */}
      <div
        style={{
          position: 'absolute',
          width: outerSide,
          height: outerSide,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(45deg)',
          backgroundColor: ink,
        }}
      >
        {/* Middle cream diamond — inherits 45° rotation, appears as smaller diamond */}
        <div
          style={{
            position: 'absolute',
            width: '67%',
            height: '67%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: cream,
          }}
        >
          {/* Inner black diamond */}
          <div
            style={{
              position: 'absolute',
              width: '50%',
              height: '50%',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: ink,
            }}
          />
        </div>
      </div>
    </div>
  )
}
