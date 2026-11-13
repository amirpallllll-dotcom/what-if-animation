import React from 'react';
import { defineEpisode, ShotFrame, type ShotProps } from '../engine/episode';
import { Hero, basePose, poseAt } from '../engine/rig';
import { kf, easeOut, easeInOut, easeIn } from '../engine/anim';

const CatchShot: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 820, y: 760, tilt: 0, expr: 'neutral' } },
    { f: 18, p: { x: 820, y: 790, tilt: -13, headTilt: 8, armL: { a: -35, b: 25 }, armR: { a: -35, b: 25 }, expr: 'shock' }, ease: easeInOut },
    { f: 32, p: { x: 820, y: 760, tilt: 8, armL: { a: -55, b: 10 }, armR: { a: -55, b: 10 }, legL: { a: -18, b: 25 }, legR: { a: 18, b: 25 } }, ease: easeOut },
    { f: 48, p: { x: 970, y: 620, tilt: 5, squash: -0.12, armL: { a: -75, b: -20 }, armR: { a: -75, b: -20 }, legL: { a: 25, b: 15 }, legR: { a: -25, b: 15 }, expr: 'happy' }, ease: easeOut },
    { f: 66, p: { x: 1100, y: 570, tilt: -4, squash: -0.08, armL: { a: -95, b: -15 }, armR: { a: -95, b: -15 }, legL: { a: 12, b: 20 }, legR: { a: -12, b: 20 } }, ease: easeInOut },
    { f: 76, p: { x: 1100, y: 570, tilt: 5, squash: 0.02, armL: { a: -80, b: 15 }, armR: { a: -80, b: 15 }, expr: 'cool' } },
    { f: 94, p: { x: 1100, y: 760, tilt: -8, squash: 0.18, legL: { a: 0, b: 0 }, legR: { a: 0, b: 0 } }, ease: easeIn },
    { f: 108, p: { x: 1100, y: 760, tilt: 3, squash: -0.04, armL: { a: -20, b: 5 }, armR: { a: -20, b: 5 } } },
    { f: 132, p: { x: 1100, y: 760, tilt: 0, squash: 0, headTilt: 0, sway: 0, expr: 'happy', armL: { a: 10, b: -8 }, armR: { a: 10, b: -8 } } },
    { f: 149, p: { x: 1100, y: 760, tilt: 0, squash: 0, expr: 'happy' } },
  ], basePose);

  const ballX = kf(t, [[0, 1580], [38, 1370], [62, 1190], [76, 1100], [149, 1100]], easeInOut);
  const ballY = t < 76 ? 790 + Math.sin(t * 0.22) * 12 : 790;
  const ballScale = t < 76 ? 1 : 0.001;

  return (
    <ShotFrame>
      <defs>
        <linearGradient id="testBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#252342" />
          <stop offset="100%" stopColor="#111321" />
        </linearGradient>
        <radialGradient id="ballGlow">
          <stop offset="0%" stopColor="#FFF1A8" />
          <stop offset="100%" stopColor="#F39B38" />
        </radialGradient>
      </defs>

      <rect width="1920" height="1080" fill="url(#testBg)" />
      <circle cx="1500" cy="210" r="190" fill="#6B5B9A" opacity="0.12" />
      <path d="M0 900 Q480 875 960 900 T1920 900 V1080 H0Z" fill="#29283B" />
      <path d="M0 900 H1920" stroke="#77718F" strokeWidth="5" opacity="0.6" />

      <ellipse cx={pose.x} cy="910" rx={95} ry={15} fill="#000" opacity="0.25" />
      <g opacity={ballScale}>
        <circle cx={ballX} cy={ballY} r="48" fill="url(#ballGlow)" stroke="#FFE4A0" strokeWidth="7" />
        <path d={`M${ballX - 25} ${ballY - 10} Q${ballX} ${ballY - 35} ${ballX + 25} ${ballY - 10}`} fill="none" stroke="#A75B2C" strokeWidth="6" />
      </g>

      <Hero pose={pose} />
      <text x="960" y="130" fill="#F5EEDC" fontSize="34" textAnchor="middle" opacity="0.8">
        ANTICIPATION • ACTION • FOLLOW-THROUGH
      </text>
    </ShotFrame>
  );
};

const timeline = {
  slug: 'animation-learning-test',
  title: 'Animation Learning Test',
  fps: 30,
  total: 150,
  segments: [{ shot: 'S1', a: 0, b: 150, t0: 0, t1: 150 }],
  shots: [{ id: 'S1', size: '1920x1080', key: 75, len: 150, first: 0 }],
  fx: [],
  audio: {},
};

export const animationLearningTest = defineEpisode('AnimationLearningTest', {
  timeline,
  shots: { S1: CatchShot },
  grain: false,
  vignette: true,
  bg: '#111321',
});
