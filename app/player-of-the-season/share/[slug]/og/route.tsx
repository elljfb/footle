import { ImageResponse } from 'next/og';
import {
  getPlayerPositionLabel,
  getSeasonAwards,
  getSeasonSummaryLabel,
} from '../../../../../lib/player-of-the-season';
import { getPlayerOfTheSeasonShareBySlug } from '../../../../../services/playerOfTheSeasonShareService';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const share = await getPlayerOfTheSeasonShareBySlug(slug);
    if (!share) return new Response('Not found', { status: 404 });

    const { player_build: player, season } = share;
    const seasonAwards = getSeasonAwards(season);
    const headline = seasonAwards[0] ?? getSeasonSummaryLabel(season, player.age);
    const additionalAwards = seasonAwards.slice(1);
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 54,
            color: '#ffffff',
            background: 'linear-gradient(135deg, #07111f 0%, #10233d 48%, #050816 100%)',
            fontFamily: 'Arial',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 40,
              border: '2px solid rgba(3, 230, 144, 0.45)',
              borderRadius: 32,
              background: 'rgba(5, 14, 28, 0.68)',
              height: '100%',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', color: '#03e690', fontSize: 24, fontWeight: 800, letterSpacing: 6 }}>
                FOOTLE
              </div>
              <div style={{ display: 'flex', color: '#94a3b8', fontSize: 18, fontWeight: 800, letterSpacing: 3 }}>
                PREMIER LEAGUE · PLAYER OF THE SEASON
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 30 }}>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ display: 'flex', color: '#fcd34d', fontSize: 20, fontWeight: 900, letterSpacing: 3 }}>
                  {headline.toUpperCase()}
                </div>
                <div style={{ display: 'flex', marginTop: 10, fontSize: 72, lineHeight: 1, fontWeight: 900, letterSpacing: -2 }}>
                  {player.name}
                </div>
                <div style={{ display: 'flex', marginTop: 12, color: '#cbd5e1', fontSize: 30, fontWeight: 700 }}>
                  {season.club.name}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 176, height: 128, marginLeft: 26, border: '2px solid rgba(3, 230, 144, 0.7)', borderRadius: 24, background: 'rgba(3, 230, 144, 0.12)' }}>
                <div style={{ display: 'flex', color: '#86efac', fontSize: 15, fontWeight: 900, letterSpacing: 3 }}>POSITION</div>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 8, color: '#ffffff', fontSize: 17, fontWeight: 900, whiteSpace: 'nowrap' }}>{getPlayerPositionLabel(player.position)}</div>
              </div>
            </div>
            {additionalAwards.length > 0 && (
              <div style={{ display: 'flex', marginTop: 16, color: '#fcd34d', fontSize: 18, fontWeight: 800 }}>
                ALSO WON · {additionalAwards.join(' · ')}
              </div>
            )}
            <div style={{ display: 'flex', gap: 18, marginTop: 'auto', marginBottom: 24 }}>
              {[
                ['GOALS', season.goals],
                ['ASSISTS', season.assists],
                ['APPS', season.appearances],
                ['LEAGUE', `${season.tablePosition}${season.tablePosition === 1 ? 'st' : season.tablePosition === 2 ? 'nd' : season.tablePosition === 3 ? 'rd' : 'th'}`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: 220,
                    height: 118,
                    padding: '18px 22px',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    borderRadius: 20,
                    background: '#0b1220',
                  }}
                >
                  <div style={{ display: 'flex', color: '#94a3b8', fontSize: 17, fontWeight: 800, letterSpacing: 2 }}>{label}</div>
                  <div style={{ display: 'flex', marginTop: 8, color: '#ffffff', fontSize: 38, fontWeight: 900 }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 21, fontWeight: 700 }}>
              <div style={{ display: 'flex' }}>{season.averageRating.toFixed(2)} average rating</div>
              <div style={{ display: 'flex' }}>footle.club</div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
        },
      },
    );
  } catch (error) {
    console.error('Error generating Player of the Season share image:', error);
    return new Response('Unable to generate share image', { status: 500 });
  }
}
