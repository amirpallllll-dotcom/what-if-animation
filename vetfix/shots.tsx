import React from 'react';
import {
  ShotProps, camT, kf, easeOut, clamp, lerp, basePose, Pose, LEG_LEN, Sparkle, Gear,
  DOS, Chip, Stamp, Card, Checklist, CounterChip, StatusCard, PunchWord, MarkPop, DuskHills,
  Person, actionPose, FONT,
  VLOOKS, Vet, CaseFile, Medal, Headstone, Flag, NightForest, Banner, Folder, WarRoom,
} from '../../engine';
// "VetTest": the hook and entry 1 (Henry Johnson) of "7 legendary veterans". Every shot is one spoken phrase.
// FIXED: real fight choreography in J3b, mark above the head in J2, matching scales in J4b,
// chips off the moon, medals fully in frame, flat cap / combed hair instead of the stray hair tuft.
const G = 880;
const dark = (o: number) => <rect width={1920} height={1080} fill="#000" opacity={o} />;

// ---------------- HOOK ----------------
// H1: "They fought in the worst battles in American history."
export const H1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.09]]))}>
    <DuskHills t={t} id="h1" sunX={1400} />
    {[0, 1, 2].map((i) => (
      <Vet key={i} pose={actionPose('walk', t + i * 7, { x: 300 + i * 330, ground: G + i * 14, scale: 1.1, speed: 3.2, facing: 1 })} look={VLOOKS.soldier} helm={i === 1 ? 'ww1' : 'ww2'} />
    ))}
    <Chip x={90} y={100} t={t} d={18} text="THE WORST BATTLES" />
  </g>
);
// H2: "Some of them survived the war"
export const H2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
    <DuskHills t={t} id="h2" sunX={600} />
    <Vet pose={actionPose('nod', t, { x: 700, ground: G + 20, scale: 1.45, facing: 1 })} look={VLOOKS.soldier} helm="ww2" />
    <Stamp x={1260} y={450} t={t} d={14} text="SURVIVED" color={DOS.green} rot={-8} size={92} />
  </g>
);
// H3: "and then lost something worse."
export const H3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
    <WarRoom />
    <Vet pose={actionPose('sad', t, { x: 520, ground: 940, scale: 1.45, facing: 1 })} look={VLOOKS.soldier} helm="ww2" />
    <Checklist
      x={1280}
      y={520}
      t={t}
      d={4}
      title="CAME HOME TO"
      items={[
        { text: 'HEALTH', at: 10, mark: 'cross', markAt: 24 },
        { text: 'MONEY', at: 20, mark: 'cross', markAt: 36 },
        { text: 'RESPECT', at: 30, mark: 'cross', markAt: 48 },
      ]}
    />
  </g>
);
// H4: "No parades waited for them."
export const H4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <DuskHills t={t} id="h4" sunX={1500} />
    <Banner x={960} y={640} t={t} d={2} text="WELCOME HOME" />
    <Vet pose={actionPose('walk', t, { x: 300, ground: 930, scale: 1.2, speed: 8, facing: 1, expr: 'tired' })} look={VLOOKS.soldier} helm="ww2" />
  </g>
);
// H5: "No easy peace."
export const H5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <NightForest t={t} id="h5" />
    <Vet pose={actionPose('sad', t, { x: 960, ground: 940, scale: 1.55, facing: 1, expr: 'tired' })} look={VLOOKS.soldier} helm="ww2" />
  </g>
);
// H6: "Seven veterans."  (FIX: the pilot gets a leather cap instead of the stray hair tuft)
export const H6: React.FC<ShotProps> = ({ t }) => {
  const looks = [VLOOKS.soldierDark, VLOOKS.soldier, VLOOKS.sailorDark, VLOOKS.medic, VLOOKS.soldier, VLOOKS.pilot, VLOOKS.soldierDark];
  const helms = ['ww1', 'ww1', 'sailor', 'medic', 'ww2', 'none', 'ww2'] as const;
  return (
    <g>
      <WarRoom />
      {looks.map((lk, i) => {
        const k = clamp((t - i * 4) / 5);
        if (k <= 0) return null;
        const p = actionPose('idle', t, { x: 260 + i * 230, ground: 800, scale: 0.8 * easeOut(k), facing: 1 });
        return (
          <g key={i}>
            <Vet pose={p} look={lk} helm={helms[i]} />
            {i === 5 ? <Gear pose={p} kind="pilot" /> : null}
          </g>
        );
      })}
      <CounterChip x={650} y={940} t={t} d={0} label="VETERANS" from={0} to={7} at={2} dur={30} />
    </g>
  );
};
// H7: "Seven endings."
export const H7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <DuskHills t={t} id="h7" sunX={960} sunY={600} />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <Headstone key={i} x={280 + i * 227} y={900} t={t} d={i * 4} scale={0.48} />
    ))}
  </g>
);
// H8: "And a few of them will surprise you."
export const H8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
    <WarRoom />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <Folder key={i} x={330 + i * 210} y={i === 3 ? 520 : 640} t={t} d={i * 3} n={String(i + 1)} rot={(i - 3) * 4} scale={i === 3 ? 1.15 : 0.95} />
    ))}
    <MarkPop x={960} y={260} t={t} d={24} mark="!?" hold={40} />
  </g>
);

// ---------------- 1. HENRY JOHNSON ----------------
// J0: "Number one."
export const J0: React.FC<ShotProps> = ({ t }) => (
  <g>
    <WarRoom />
    <PunchWord x={960} y={720} t={t} d={2} text="1" color="#FFD54A" size={520} rot={-2} />
  </g>
);
// J1: "Henry Johnson was a railway porter from Albany, New York."
export const J1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
    <WarRoom />
    <CaseFile
      x={960}
      y={520}
      t={t}
      d={0}
      name="HENRY JOHNSON"
      lines={[
        { k: 'JOB', v: 'RAILWAY PORTER', at: 12 },
        { k: 'FROM', v: 'ALBANY, NEW YORK', at: 26 },
        { k: 'WAR', v: 'WORLD WAR I', at: 44 },
      ]}
    />
  </g>
);
// J2: "In May 1918, in a French forest, a German raiding party hit his post."
// FIX: the "!" now pops ABOVE his helmet (was sitting on his face), scales matched.
export const J2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1020]]), 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <NightForest t={t} id="j2" />
    {[0, 1, 2].map((i) => (
      <Vet key={i} pose={actionPose('walk', t + i * 5, { x: 2050 + i * 170, ground: 900 + i * 16, scale: 1.3, speed: 4.2, facing: -1 })} look={VLOOKS.enemy} helm="ww1" helmColor="#4A4F55" />
    ))}
    <Vet pose={actionPose('idle', t, { x: 640, ground: 900, scale: 1.35, facing: 1, expr: 'worried' })} look={VLOOKS.soldierDark} helm="ww1" />
    <MarkPop x={640} y={350} t={t} d={64} mark="!" hold={50} />
    <Chip x={90} y={100} t={t} d={6} text="MAY 1918" />
    <Chip x={90} y={200} t={t} d={26} text="FRANCE" />
  </g>
);
// J3a: "Out of grenades and bullets,"
export const J3a: React.FC<ShotProps> = ({ t }) => (
  <g>
    <NightForest t={t} id="j3a" />
    <Vet pose={actionPose('shock', t, { x: 520, ground: 920, scale: 1.35, facing: 1 })} look={VLOOKS.soldierDark} helm="ww1" />
    <StatusCard x={1330} y={500} t={t} d={2} title="AMMO" rows={[{ label: 'GRENADES', from: 1, to: 0 }, { label: 'BULLETS', from: 0.8, to: 0 }]} zoom={1.2} at={8} dur={28} />
  </g>
);
// J3b: "he fought with a rifle butt, a bolo knife, and his fists."
// FIX: a real three-beat fight. Beat 1 (t6) rifle butt knocks enemy A down; beat 2 (t36) bolo
// puts B down; beat 3 (t66) fists drop A again after he gets up. Impacts land on the fx flashes
// already in timeline.json (frames 848 / 878 / 910 = local t 4 / 34 / 66). Chips moved off the moon.
export const J3b: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.35;
  const hx = kf(t, [[0, 700], [2, 700], [6, 840], [30, 840], [34, 990], [62, 990], [65, 1130], [109, 1130]]);
  const swing = kf(t, [[0, 140], [4, 150], [7, 50], [28, 55], [34, 110], [37, 15], [62, 30], [66, 92], [70, 92], [78, 45]]);
  const hero: Pose = {
    ...basePose,
    x: hx,
    y: 920 - LEG_LEN * sc,
    scale: sc,
    facing: 1,
    tilt: kf(t, [[0, 0], [6, 8], [37, 10], [66, 12], [109, 6]]),
    armR: { a: swing, b: t > 62 && t < 78 ? 0 : -12 },
    armL: { a: -25, b: -50 },
    expr: t < 4 ? 'worried' : 'shock',
  };
  // enemy A: down at t10, back up at t46, down for good at t70
  const aFall = t < 46 ? clamp((t - 10) / 8) : t < 54 ? 1 - clamp((t - 46) / 8) : clamp((t - 70) / 8);
  const aX = kf(t, [[0, 1060], [6, 1060], [10, 1260], [46, 1260], [54, 1190], [66, 1190], [70, 1460], [109, 1460]]);
  const A: Pose = {
    ...basePose,
    x: aX,
    y: lerp(930 - LEG_LEN * sc, 930 - 25, aFall),
    scale: sc,
    facing: -1,
    spin: 90 * aFall,
    tilt: -12 * clamp((t - 6) / 4) * (1 - aFall),
    expr: aFall > 0.5 ? 'dizzy' : t >= 6 ? 'shock' : 'worried',
  };
  // enemy B: down at t38, stays down
  const bFall = clamp((t - 38) / 8);
  const bX = kf(t, [[0, 1320], [34, 1320], [38, 1520], [109, 1520]]);
  const B: Pose = {
    ...basePose,
    x: bX,
    y: lerp(940 - LEG_LEN * sc, 940 - 25, bFall),
    scale: sc,
    facing: -1,
    spin: 90 * bFall,
    tilt: -12 * clamp((t - 34) / 4) * (1 - bFall),
    expr: bFall > 0.5 ? 'dizzy' : t >= 34 ? 'shock' : 'worried',
  };
  return (
    <g transform={camT(kf(t, [[0, 940], [30, 940], [36, 1080], [62, 1080], [68, 1180], [109, 1180]]), 560, kf(t, [[0, 1.02], [len, 1.08]]))}>
      <NightForest t={t} id="j3b" />
      <Vet pose={B} look={VLOOKS.enemy} helm="ww1" helmColor="#4A4F55" />
      <Vet pose={A} look={VLOOKS.enemy} helm="ww1" helmColor="#4A4F55" />
      <Vet pose={hero} look={VLOOKS.soldierDark} helm="ww1" />
      <Sparkle x={980} y={560} t={t - 6} s={1.4} />
      <Sparkle x={1120} y={560} t={t - 36} s={1.4} />
      <Sparkle x={1260} y={560} t={t - 66} s={1.4} />
      <Chip x={110} y={170} t={t} d={4} text="RIFLE BUTT" />
      <Chip x={110} y={290} t={t} d={34} text="BOLO KNIFE" />
      <Chip x={110} y={410} t={t} d={66} text="FISTS" />
    </g>
  );
};
// J4a: "Reports say he took twenty-one wounds,"
export const J4a: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <NightForest t={t} id="j4a" />
    <Vet pose={actionPose('sad', t, { x: 640, ground: 920, scale: 1.35, facing: 1, expr: 'worried' })} look={VLOOKS.soldierDark} helm="ww1" />
    <CounterChip x={1000} y={470} t={t} d={4} label="WOUNDS" from={0} to={21} at={10} dur={46} zoom={1.7} />
  </g>
);
// J4b: "but he saved his wounded friend, Needham Roberts."
// FIX: same scale for both, and Henry's arm now goes AROUND Roberts (he no longer points away from him).
export const J4b: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.4;
  const sc2 = 1.35;
  const henry: Pose = { ...actionPose('idle', t, { x: 780, ground: 930, scale: sc, facing: 1, expr: 'worried' }), armR: { a: 95, b: -15 } };
  const rob: Pose = { ...basePose, x: 1060, y: 940 - LEG_LEN * sc2, scale: sc2, facing: -1, tilt: -8, headTilt: -6, armL: { a: 12, b: -20 }, armR: { a: -12, b: -20 }, expr: 'tired' };
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <NightForest t={t} id="j4b" />
      <Vet pose={rob} look={VLOOKS.soldierDark} helm="ww1" />
      <Vet pose={henry} look={VLOOKS.soldierDark} helm="ww1" />
      <Chip x={860} y={300} t={t} d={10} text="NEEDHAM ROBERTS" />
    </g>
  );
};
// J5: "France gave him its top medal."  (FIX: medal fully in frame)
export const J5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
    <WarRoom />
    <Vet pose={actionPose('salute', t - 4, { x: 560, ground: 940, scale: 1.4, facing: 1 })} look={VLOOKS.officer} helm="ww1" helmColor="#2F3E5C" />
    <Vet pose={actionPose('idle', t, { x: 1380, ground: 940, scale: 1.4, facing: -1, expr: 'happy' })} look={VLOOKS.soldierDark} helm="ww1" />
    <Medal x={960} y={260} t={t} d={6} kind="croix" scale={1.5} />
    <Chip x={760} y={900} t={t} d={20} text="FRANCE" />
  </g>
);
// J6: "America gave him nothing for decades."
export const J6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <WarRoom />
    <Card x={960} y={520} w={640} h={300} t={t} d={0} title="AMERICA" zoom={1.4}>
      <text x={40} y={150} fontFamily={FONT.ui} fontSize={30} letterSpacing={3} fill={DOS.ink}>MEDAL ........</text>
      <text x={40} y={210} fontFamily={FONT.ui} fontSize={30} letterSpacing={3} fill={DOS.ink}>THANKS .......</text>
      <text x={40} y={270} fontFamily={FONT.ui} fontSize={30} letterSpacing={3} fill={DOS.ink}>HELP .........</text>
    </Card>
    <Stamp x={1090} y={560} t={t} d={14} text="NOTHING" color={DOS.red} rot={-9} size={100} />
  </g>
);
// J7a: "He struggled to find work,"  (FIX: flat cap instead of the hair tuft)
export const J7a: React.FC<ShotProps> = ({ t, len }) => {
  const p = actionPose('sad', t, { x: 520, ground: 940, scale: 1.45, facing: 1, expr: 'worried' });
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <WarRoom />
      <Vet pose={p} look={VLOOKS.civilianDark} />
      <Gear pose={p} kind="cap" color="#4A3A2C" />
      <Card x={1260} y={500} w={520} h={300} t={t} d={0} title="WORK" zoom={1.3}>
        <text x={40} y={160} fontFamily={FONT.ui} fontSize={32} letterSpacing={3} fill={DOS.ink}>JOBS: 0</text>
        <text x={40} y={230} fontFamily={FONT.ui} fontSize={32} letterSpacing={3} fill={DOS.ink}>PAY: 0</text>
      </Card>
      <Stamp x={1290} y={600} t={t} d={14} text="NO WORK" color={DOS.red} rot={-8} size={84} />
    </g>
  );
};
// J7b: "and he came home sick,"
export const J7b: React.FC<ShotProps> = ({ t, len }) => {
  const p = actionPose('sad', t, { x: 860, ground: 940, scale: 1.55, facing: 1, expr: 'tired' });
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <DuskHills t={t} id="j7b" sunX={1500} />
      {dark(0.25)}
      <Vet pose={p} look={VLOOKS.civilianDark} />
      <Gear pose={p} kind="cap" color="#4A3A2C" />
      <Chip x={1180} y={330} t={t} d={8} text="SICK" color="#E9C7C0" />
    </g>
  );
};
// J7c: "and died in 1929, aged just thirty-six."
export const J7c: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
    <DuskHills t={t} id="j7c" sunX={960} sunY={640} />
    {dark(0.35)}
    <Headstone x={640} y={930} t={t} d={4} name="HENRY JOHNSON" dates="DIED 1929" scale={1.35} />
    <CounterChip x={1050} y={520} t={t} d={20} label="AGE" from={0} to={36} at={24} dur={40} zoom={1.7} />
  </g>
);
// J8a: "His Medal of Honor came in 2015,"  (FIX: medal fully in frame)
export const J8a: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <WarRoom />
    <Medal x={960} y={300} t={t} d={2} kind="moh" scale={1.8} />
    <PunchWord x={960} y={960} t={t} d={16} text="2015" color="#FFD54A" size={190} rot={-2} />
  </g>
);
// J8b: "ninety-seven years after the fight,"
export const J8b: React.FC<ShotProps> = ({ t }) => {
  const p = clamp((t - 6) / 36);
  return (
    <g>
      <WarRoom />
      <Chip x={160} y={760} t={t} d={0} text="1918" />
      <Chip x={1420} y={760} t={t} d={26} text="2015" />
      <line x1={420} y1={760} x2={420 + 960 * easeOut(p)} y2={760} stroke={DOS.paper} strokeWidth={8} strokeDasharray="22 14" />
      <CounterChip x={640} y={430} t={t} d={4} label="YEARS LATER" from={0} to={97} at={8} dur={40} zoom={1.8} />
    </g>
  );
};
// J8c: "from President Obama."  (FIX: combed hair instead of the tuft)
export const J8c: React.FC<ShotProps> = ({ t, len }) => {
  const obama: Pose = { ...VLOOKS.suit, extra: 'suit' } as never; // look override happens below via cast
  const p = actionPose('idle', t, { x: 700, ground: 930, scale: 1.45, facing: 1 });
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <DuskHills t={t} id="j8c" sunX={960} sunY={650} />
      {dark(0.25)}
      <Flag x={230} y={300} t={t} d={0} />
      <Vet pose={p} look={{ ...VLOOKS.suit, extra: 'suit' }} />
      <Headstone x={1450} y={940} t={t} d={0} rise={false} name="HENRY JOHNSON" dates="DIED 1929" scale={1.2} />
      <Medal x={kf(t, [[6, 900], [len, 1320]])} y={560} t={t} d={4} kind="moh" scale={1.0} />
      <Chip x={90} y={80} t={t} d={4} text="PRESIDENT OBAMA, 2015" />
    </g>
  );
};
// J9: "He never lived to hear it."
export const J9: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 640, kf(t, [[0, 1.0], [len, 1.14]]))}>
      <DuskHills t={t} id="j9" sunX={960} sunY={690} />
      {dark(0.4)}
      <Headstone x={960} y={960} t={t} d={0} rise={false} name="HENRY JOHNSON" dates="DIED 1929" scale={1.5} />
      <Medal x={960} y={500} t={t} d={4} kind="moh" scale={0.75} />
    </g>
    {dark(clamp((t - (len - 36)) / 30))}
  </g>
);
