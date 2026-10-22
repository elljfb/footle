import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const gameOgImageSize = {
  width: 1200,
  height: 630,
};

export const gameOgImageContentType = 'image/png';

export async function createGameOgImage(title: string, subtitle = 'Daily football games, quizzes & player puzzles') {
  const logo = await readFile(join(process.cwd(), 'public', 'footle-logo-main.png'));
  const logoDataUri = `data:image/png;base64,${logo.toString('base64')}`;
  const titleFontSize = title.length > 26 ? 54 : title.length > 20 ? 66 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          padding: '58px 72px',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#111827',
          backgroundImage: 'radial-gradient(circle at 85% 30%, rgba(3,230,144,.16), transparent 34%), linear-gradient(135deg, #111827 0%, #0b1516 100%)',
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src={logoDataUri} style={{ width: 310, height: 124, objectFit: 'contain' }} />
          <div
            style={{
              display: 'flex',
              border: '2px solid rgba(3,230,144,.55)',
              borderRadius: 999,
              padding: '12px 22px',
              color: '#03E690',
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 3,
            }}
          >
            FOOTBALL QUIZ
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 940, gap: 20 }}>
          <div style={{ display: 'flex', color: '#03E690', fontSize: 22, fontWeight: 700, letterSpacing: 5 }}>
            PLAY FOOTLE
          </div>
          <div style={{ display: 'flex', fontSize: titleFontSize, lineHeight: 1.05, fontWeight: 800, letterSpacing: -2 }}>
            {title}
          </div>
          <div style={{ display: 'flex', color: '#D1D5DB', fontSize: 27, lineHeight: 1.35 }}>
            {subtitle}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#9CA3AF', fontSize: 20 }}>
          <span style={{ display: 'flex', width: 14, height: 14, borderRadius: 99, backgroundColor: '#03E690' }} />
          footle.club
        </div>
      </div>
    ),
    gameOgImageSize,
  );
}
