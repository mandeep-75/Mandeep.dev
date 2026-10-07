/* The alternating side column. Every block of page content lives in one of
   these, pinned to the left or right edge so the middle of the viewport stays
   clear for the WebGL model parked behind the page.

   - Below `lg` it collapses to a single centred `max-w-2xl` column: the
     zigzag is a desktop composition, and two tracks at 390px would be cramped
     and would risk horizontal overflow.
   - At `lg` the track is 36% of the padded container, capped at 36rem. With
     the page padding that leaves the centre 25-33% of the viewport empty at
     every desktop width — the band the model reads through.
   - `stagger` offsets a right-hand block downwards so the two tracks
     interleave instead of sitting as two parallel columns.

   These wrappers carry no transform of their own — plain margins and widths
   only — so nothing here can collide with a Tailwind `translate-*` or with a
   framer-written `transform` on a child. */
export default function SideColumn({
  side = 'left',
  stagger = false,
  className = '',
  children,
}) {
  const track = side === 'left' ? 'lg:ml-0 lg:mr-auto' : 'lg:mr-0 lg:ml-auto';

  return (
    <div className="px-5 sm:px-8 lg:px-10 xl:px-16">
      <div
        className={`mx-auto w-full max-w-2xl lg:w-[36%] lg:max-w-[36rem] ${track} ${
          stagger ? 'lg:mt-24' : ''
        } ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
