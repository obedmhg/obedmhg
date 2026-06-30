import Link from 'next/link';
import { Resume } from '@/components/Resume';
import { defaultResume } from '@/lib/defaultResume';

const homeData = {
  ...defaultResume,
  header: { ...defaultResume.header, photo: '/profile.png' },
};

export default function Home() {
  return (
    <main className="rb-home">
      <Resume data={homeData} theme="terminal" />
      <div className="rb-cta-wrap">
        <div className="rb-cta">
          <span className="rb-cta-text">
            <b>$ like this?</b> build your own resume in this exact format &amp; download it.
          </span>
          <Link className="rb-cta-link" href="/builder">
            create your own here →
          </Link>
        </div>
      </div>
    </main>
  );
}
