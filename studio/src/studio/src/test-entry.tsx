import React from 'react';
import {Composition, registerRoot, useCurrentFrame} from 'remotion';

const FPS = 30, W = 1920, H = 1080, DUR = 600;
const INK = '#2a2622';
const u = (f: number, a: number, b: number) => Math.max(0, Math.min(1, (f - a) / (b - a)));
const ease = (t: number) => t * t * (3 - 2 * t);
const rnd = (i: number) => { const v = Math.sin(i * 127.1) * 43758.5453; return v - Math.floor(v); };
const FONT = 'DejaVu Sans, Arial, sans-serif';

type SolProps = {x: number; y: number; s?: number; flip?: boolean; roman?: boolean;
  arm?: number; lean?: number; down?: boolean; eyes?: 'dot' | 'x' | 'shut'; plume?: string};

const Soldier: React.FC<SolProps> = ({x, y, s = 1, flip = false, roman = true, arm = 0,
  lean = 0, down = false, eyes = 'dot', plume = '#b8352f'}) => {
  const skin = '#f2e3cf', helm = '#c9bd8e';
  const tunic = roman ? '#8d9199' : '#f0ece0', skirt = roman ? '#b8352f' : '#3f6b4a';
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) rotate(${down ? 90 : lean})`}>
      <rect x={-16} y={54} width={12} height={26} fill={skin} stroke={INK} strokeWidth={3} />
      <rect x={4} y={54} width={12} height={26} fill={skin} stroke={INK} strokeWidth={3} />
      <path d="M -26 34 L 26 34 L 22 60 L -22 60 Z" fill={skirt} stroke={INK} strokeWidth={3} />
      <rect x={-24} y={-6} width={48} height={44} rx={8} fill={tunic} stroke={INK} strokeWidth={3} />
      <rect x={-24} y={22} width={48} height={8} fill="#5a5f66" stroke={INK} strokeWidth={2} />
      <g transform={`rotate(${arm} 22 6)`}>
        <rect x={18} y={0} width={10} height={30} rx={5} fill={skin} stroke={INK} strokeWidth={3} />
        <path d="M 23 -4 L 23 -62" stroke="#cfd4d8" strokeWidth={7} strokeLinecap="round" />
      </g>
      <ellipse cx={-26} cy={16} rx={16} ry={26} fill={roman ? '#b8352f' : '#e8e4d8'} stroke={INK} strokeWidth={3} />
      <circle cx={-26} cy={16} r={5} fill="#e0b64a" stroke={INK} strokeWidth={2} />
      <ellipse cx={0} cy={-38} rx={30} ry={32} fill={skin} stroke={INK} strokeWidth={3} />
      <path d="M -31 -44 A 31 30 0 0 1 31 -44 L 31 -38 L -31 -38 Z" fill={helm} stroke={INK} strokeWidth={3} />
      <path d="M 0 -74 q 10 -16 2 -26 q 14 8 12 26 Z" fill={plume} stroke={INK} strokeWidth={2} />
      {eyes === 'x' ? (
        <g stroke={INK} strokeWidth={3}>
          <path d="M -14 -34 l 8 8 M -6 -34 l -8 8" /><path d="M 6 -34 l 8 8 M 14 -34 l -8 8" />
        </g>
      ) : eyes === 'shut' ? (
        <g stroke={INK} strokeWidth={3} fill="none">
          <path d="M -14 -30 q 4 4 8 0" /><path d="M 6 -30 q 4 4 8 0" />
        </g>
      ) : (
        <g fill={INK}><circle cx={-10} cy={-30} r={3.2} /><circle cx={10} cy={-30} r={3.2} /></g>
      )}
      <path d="M -6 -18 q 6 4 12 0" stroke={INK} strokeWidth={2.5} fill="none" />
    </g>
  );
};

const Camp: React.FC<{f: number}> = ({f}) => {
  const snore = 1 + 0.02 * Math.sin(f * 0.25);
  return (
    <g transform={`scale(${1 + 0.0004 * f})`}>
      <rect width={W} height={H} fill="#2f322c" />
      <rect y={620} width={W} height={460} fill="#3d4a33" />
      <circle cx={1650} cy={150} r={54} fill="#e8e6d8" opacity={0.85} />
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 180 + i * 360, y = 560 + (i % 2) * 40;
        return (
          <g key={i}>
            <path d={`M ${x - 150} ${y + 190} L ${x - 90} ${y} L ${x + 90} ${y} L ${x + 150} ${y + 190} Z`}
              fill="#6f6759" stroke={INK} strokeWidth={4} />
            <path d={`M ${x - 30} ${y + 190} L ${x - 30} ${y + 60} L ${x + 30} ${y + 60} L ${x + 30} ${y + 190} Z`}
              fill="#4a4438" stroke={INK} strokeWidth={3} />
          </g>
        );
      })}
      <g transform={`translate(300 830) scale(1 ${snore})`}>
        <Soldier x={0} y={0} s={1.5} eyes="shut" lean={-6} />
      </g>
      <g transform={`translate(1600 850) scale(1 ${snore})`}>
        <Soldier x={0} y={0} s={1.5} flip eyes="shut" lean={5} plume="#3a5ab0" />
      </g>
      <rect width={W} height={H} fill="#0a0e18" opacity={0.35} />
    </g>
  );
};

const MapView: React.FC<{f: number}> = ({f}) => {
  const p = ease(u(f, 0, 120));
  return (
    <g>
      <rect width={W} height={H} fill="#b9cf8f" />
      <path d="M 0 760 Q 400 700 760 780 Q 1200 860 1920 800 L 1920 1080 L 0 1080 Z" fill="#3f6fd0" />
      <path d="M 0 700 Q 500 640 900 720 Q 1400 800 1920 740" stroke="#fff" strokeWidth={8} fill="none" />
      {Array.from({length: 130}).map((_, i) => {
        const x = rnd(i) * W, y = 60 + rnd(i + 99) * 520;
        return <path key={i} d={`M ${x} ${y} l 12 30 l -24 0 Z`} fill="#3f5f4f" opacity={0.85} />;
      })}
      {Array.from({length: 8}).map((_, i) => {
        const x = 1150 - i * 90 - p * 260, y = 220 + i * 40 + p * 190;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${-20 + i * 3})`}>
            <rect x={-42} y={-28} width={84} height={56} fill="#fff" stroke={INK} strokeWidth={4} />
            <path d="M -42 -28 L 42 28 M 42 -28 L -42 28" stroke={INK} strokeWidth={3} />
          </g>
        );
      })}
      {Array.from({length: 6}).map((_, i) => (
        <g key={i} transform={`translate(${520 + i * 95} ${690}) rotate(${-8 + i * 2})`}>
          <rect x={-38} y={-26} width={76} height={52} fill="#d8332f" stroke={INK} strokeWidth={4} />
          <path d="M -38 -26 L 38 26 M 38 -26 L -38 26" stroke={INK} strokeWidth={3} />
        </g>
      ))}
    </g>
  );
};

const Battle: React.FC<{f: number}> = ({f}) => {
  const sw = Math.sin(f * 0.5) * 45;
  const fog = 0.55 + 0.15 * Math.sin(f * 0.05);
  return (
    <g>
      <rect width={W} height={H} fill="#9fb489" />
      <rect y={780} width={W} height={300} fill="#6f9fd8" />
      {Array.from({length: 9}).map((_, i) => (
        <Soldier key={'r' + i} x={200 + i * 130} y={700 + (i % 3) * 30} s={1.5}
          arm={-30 + sw} eyes={i < 2 ? 'x' : 'dot'} down={i < 1} />
      ))}
      {Array.from({length: 9}).map((_, i) => (
        <Soldier key={'c' + i} x={1750 - i * 130} y={690 + (i % 3) * 30} s={1.5} flip
          roman={false} plume="#7a6a4a" arm={-30 - sw} down={i < 2} eyes={i < 2 ? 'x' : 'dot'} />
      ))}
      <rect width={W} height={H} fill="#eef2ee" opacity={fog} />
    </g>
  );
};

const StatCard: React.FC<{f: number}> = ({f}) => {
  const n1 = Math.round(50000 * ease(u(f, 10, 70)));
  const n2 = Math.round(30000 * ease(u(f, 30, 90)));
  return (
    <g>
      <rect width={W} height={H} fill="#000" />
      <text x={W / 2} y={190} fill="#fff" fontSize={72} fontFamily={FONT} textAnchor="middle"
        letterSpacing={6}>TRASIMENE · 217 BC</text>
      <line x1={520} y1={230} x2={1400} y2={230} stroke="#fff" strokeWidth={4} />
      <text x={W / 2} y={330} fill="#bbb" fontSize={38} fontFamily={FONT} textAnchor="middle">STRENGTH</text>
      <text x={520} y={470} fill="#fff" fontSize={110} fontFamily={FONT} textAnchor="middle">~{n1.toLocaleString('en-US')}</text>
      <text x={1400} y={470} fill="#fff" fontSize={110} fontFamily={FONT} textAnchor="middle">~{n2.toLocaleString('en-US')}</text>
      <text x={W / 2} y={620} fill="#e07a7a" fontSize={40} fontFamily={FONT} textAnchor="middle">KILLED OR CAPTURED</text>
      <text x={520} y={760} fill="#e07a7a" fontSize={96} fontFamily={FONT} textAnchor="middle">~2,000</text>
      <text x={1400} y={760} fill="#e07a7a" fontSize={96} fontFamily={FONT} textAnchor="middle">~30,000</text>
      <text x={W / 2} y={900} fill="#ddd" fontSize={40} fontFamily={FONT} textAnchor="middle">An entire army wiped out</text>
    </g>
  );
};

const Aftermath: React.FC<{f: number}> = ({f}) => {
  const p = ease(u(f, 0, 90));
  return (
    <g>
      <rect width={W} height={H} fill="#cfe0ea" />
      <rect y={300} width={W} height={780} fill="#7fa06a" />
      <path d="M 0 620 Q 500 560 900 660 L 900 1080 L 0 1080 Z" fill={`rgb(${120 + 60 * p},${60 - 20 * p},${70 - 20 * p})`} />
      {Array.from({length: 60}).map((_, i) => (
        <ellipse key={i} cx={60 + rnd(i) * 800} cy={680 + rnd(i + 7) * 380} rx={16} ry={11}
          fill="#c9bd8e" stroke={INK} strokeWidth={2} opacity={p} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Soldier key={i} x={1250 + i * 150} y={520 + i * 60} s={1.4} lean={-10} eyes="shut" />
      ))}
    </g>
  );
};

const Test: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 120) return <svg width={W} height={H}><Camp f={f} /></svg>;
  if (f < 240) return <svg width={W} height={H}><MapView f={f - 120} /></svg>;
  if (f < 390) return <svg width={W} height={H}><Battle f={f - 240} /></svg>;
  if (f < 510) return <svg width={W} height={H}><StatCard f={f - 390} /></svg>;
  return <svg width={W} height={H}><Aftermath f={f - 510} /></svg>;
};

const Root: React.FC = () => (
  <Composition id="Trasimene" component={Test} durationInFrames={DUR} fps={FPS} width={W} height={H} />
);

registerRoot(Root);
