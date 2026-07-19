// Procedural 16-bit style music engine, built on Tone.js.
// Six tracks: title (loop), focus (loop, plays "at all times" outside boss/adventure),
// adventure (loop, plays during Adventures), boss (loop, plays during a boss fight),
// victory (one-shot, adventure/mock test completion) and victoryEpic (one-shot, boss defeat).
import * as Tone from "tone";

function barTime(bar, sixteenthStep) {
  const beat = Math.floor(sixteenthStep / 4);
  const sixteenth = sixteenthStep % 4;
  return `${bar}:${beat}:${sixteenth}`;
}
function eighthTime(bar, eighthStep) {
  const beat = Math.floor(eighthStep / 2);
  const sixteenth = (eighthStep % 2) * 2;
  return `${bar}:${beat}:${sixteenth}`;
}

// ---------------------------------------------------------------------------
// TITLE THEME — "Once Upon A Kangaroo", 128 BPM, 16 bars, C major lifting to D
// ---------------------------------------------------------------------------
function buildTitleTrack() {
  const comp = new Tone.Compressor({ threshold: -16, ratio: 3, attack: 0.006, release: 0.2 });
  const limiter = new Tone.Limiter(-1);
  const widener = new Tone.StereoWidener(0.55);
  const chorus = new Tone.Chorus({ frequency: 3.8, delayTime: 2.5, depth: 0.55, wet: 0.35 }).start();
  chorus.connect(widener); widener.connect(comp); comp.connect(limiter); limiter.toDestination();

  const masterVol = new Tone.Volume(-4); masterVol.connect(chorus);
  const wetBus = new Tone.Freeverb({ roomSize: 0.6, dampening: 3400 }); wetBus.wet.value = 0.22; wetBus.connect(masterVol);

  const leadFilter = new Tone.Filter({ frequency: 3400, type: "lowpass", rolloff: -12 });
  leadFilter.connect(masterVol); leadFilter.connect(wetBus);
  const lead = new Tone.Synth({ oscillator: { type: "fatsawtooth", count: 3, spread: 22 }, envelope: { attack: 0.003, decay: 0.2, sustain: 0.25, release: 0.2 } });
  lead.connect(leadFilter); lead.volume.value = -11;

  const leadClick = new Tone.FMSynth({ harmonicity: 4, modulationIndex: 8, envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.04 }, modulation: { type: "sine" }, modulationEnvelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.02 } });
  leadClick.connect(masterVol); leadClick.volume.value = -14;

  const harmonyFilter = new Tone.Filter({ frequency: 2600, type: "lowpass", rolloff: -12 });
  harmonyFilter.connect(masterVol); harmonyFilter.connect(wetBus);
  const harmony = new Tone.Synth({ oscillator: { type: "fatsawtooth", count: 2, spread: 18 }, envelope: { attack: 0.004, decay: 0.18, sustain: 0.2, release: 0.18 } });
  harmony.connect(harmonyFilter); harmony.volume.value = -17;

  const bassFilter = new Tone.Filter({ frequency: 1400, type: "lowpass", rolloff: -24 });
  const bass = new Tone.Synth({ oscillator: { type: "fatsquare", count: 2, spread: 12 }, envelope: { attack: 0.004, decay: 0.14, sustain: 0.05, release: 0.08 } });
  bass.connect(bassFilter); bassFilter.connect(masterVol); bass.volume.value = -12;

  const stab = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "fattriangle", count: 2, spread: 15 }, envelope: { attack: 0.002, decay: 0.18, sustain: 0, release: 0.1 } });
  stab.connect(masterVol); stab.connect(wetBus); stab.volume.value = -15;

  const pad = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "fatsine", count: 3, spread: 25 }, envelope: { attack: 0.35, decay: 0.4, sustain: 0.7, release: 1.4 } });
  pad.connect(masterVol); pad.connect(wetBus); pad.volume.value = -19;

  const sparkle = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.3, release: 0.15 }, harmonicity: 8, modulationIndex: 18, resonance: 6200, octaves: 1 });
  sparkle.connect(masterVol); sparkle.connect(wetBus); sparkle.volume.value = -16;

  const TOTAL_BARS = 16;
  const bars = [
    { chord: ["C4", "E4", "G4"], root: "C2" }, { chord: ["A3", "C4", "E4"], root: "A1" },
    { chord: ["F3", "A3", "C4"], root: "F1" }, { chord: ["G3", "B3", "D4"], root: "G1" },
    { chord: ["C4", "E4", "G4"], root: "C2" }, { chord: ["A3", "C4", "E4"], root: "A1" },
    { chord: ["D3", "F3", "A3"], root: "D2" }, { chord: ["G3", "B3", "D4"], root: "G1" },
    { chord: ["D4", "F#4", "A4"], root: "D2" }, { chord: ["B3", "D4", "F#4"], root: "B1" },
    { chord: ["G3", "B3", "D4"], root: "G1" }, { chord: ["A3", "C#4", "E4"], root: "A1" },
    { chord: ["D4", "F#4", "A4"], root: "D2" }, { chord: ["B3", "D4", "F#4"], root: "B1" },
    { chord: ["F3", "A3", "C4"], root: "F1" }, { chord: ["C4", "E4", "G4"], root: "C2" },
  ];
  const melody = [
    ["E5", "G5", "C6", "B5", "A5", "G5", "F5", "E5"], ["E5", "F5", "E5", "D5", "C5", "D5", "E5", "G5"],
    ["A5", "C6", "A5", "F5", "G5", "A5", "B5", "C6"], ["D6", "C6", "B5", "G5", "A5", "B5", "C6", "D6"],
    ["E5", "G5", "C6", "B5", "A5", "G5", "E5", "C5"], ["E5", "F5", "A5", "G5", "F5", "E5", "D5", "C5"],
    ["F5", "A5", "D6", "C6", "A5", "F5", "G5", "A5"], ["B5", "D6", "G6", "F6", "D6", "B5", "G5", "D6"],
    ["F#5", "A5", "D6", "C#6", "B5", "A5", "G5", "F#5"], ["F#5", "G5", "F#5", "E5", "D5", "E5", "F#5", "A5"],
    ["B5", "D6", "B5", "G5", "A5", "B5", "C#6", "D6"], ["E6", "D6", "C#6", "A5", "B5", "C#6", "D6", "E6"],
    ["F#5", "A5", "D6", "C#6", "B5", "A5", "F#5", "D5"], ["F#5", "G5", "B5", "A5", "G5", "F#5", "E5", "D5"],
    ["A5", "C6", "F6", "E6", "D6", "C6", "A5", "F5"], ["C6", "E6", "G6", "C7", null, null, null, null],
  ];

  const events = [];
  for (let bar = 0; bar < TOTAL_BARS; bar++) {
    const b = bars[bar];
    const inBSection = bar >= 8 && bar <= 13;
    const isFinalBar = bar === TOTAL_BARS - 1;
    events.push({ time: eighthTime(bar, 0), type: "pad", notes: b.chord });
    const rootNote = b.root;
    const fifthNote = Tone.Frequency(rootNote).transpose(7).toNote();
    const octaveNote = Tone.Frequency(rootNote).transpose(12).toNote();
    events.push({ time: eighthTime(bar, 0), type: "bass", note: rootNote });
    events.push({ time: eighthTime(bar, 2), type: "bass", note: octaveNote });
    events.push({ time: eighthTime(bar, 3), type: "bass", note: fifthNote });
    events.push({ time: eighthTime(bar, 4), type: "bass", note: rootNote });
    events.push({ time: eighthTime(bar, 6), type: "bass", note: octaveNote });
    events.push({ time: eighthTime(bar, 1), type: "stab", notes: b.chord });
    events.push({ time: eighthTime(bar, 5), type: "stab", notes: b.chord });
    melody[bar].forEach((n, i) => {
      if (n) {
        events.push({ time: eighthTime(bar, i), type: "lead", note: n });
        if (inBSection) events.push({ time: eighthTime(bar, i), type: "harmony", note: Tone.Frequency(n).transpose(-4).toNote() });
      }
    });
    if ([3, 7, 11, 13].includes(bar)) events.push({ time: eighthTime(bar, 7), type: "sparkle", note: "D7" });
    if (isFinalBar) {
      events.push({ time: eighthTime(bar, 0), type: "sparkle", note: "C7" });
      events.push({ time: eighthTime(bar, 2), type: "sparkle", note: "E7" });
      events.push({ time: eighthTime(bar, 4), type: "sparkle", note: "G7" });
    }
  }

  const part = new Tone.Part((time, ev) => {
    switch (ev.type) {
      case "pad": pad.triggerAttackRelease(ev.notes, "1m", time); break;
      case "bass": bass.triggerAttackRelease(ev.note, "16n", time); break;
      case "stab": stab.triggerAttackRelease(ev.notes, "16n", time); break;
      case "lead": lead.triggerAttackRelease(ev.note, "8n", time); leadClick.triggerAttackRelease(ev.note, "32n", time); break;
      case "harmony": harmony.triggerAttackRelease(ev.note, "8n", time); break;
      case "sparkle": sparkle.triggerAttackRelease(ev.note, "8n", time); break;
    }
  }, events);
  part.loop = true; part.loopEnd = `${TOTAL_BARS}m`;
  return { part, bpm: 128, totalBars: TOTAL_BARS };
}

// ---------------------------------------------------------------------------
// FOCUS LOOP — plays during lessons/practice/mocks (the "at all times" track), 64 BPM, 8 bars
// ---------------------------------------------------------------------------
function buildFocusTrack() {
  const comp = new Tone.Compressor({ threshold: -24, ratio: 2.5, attack: 0.01, release: 0.3 });
  const limiter = new Tone.Limiter(-1);
  const widener = new Tone.StereoWidener(0.3);
  const chorus = new Tone.Chorus({ frequency: 1.8, delayTime: 3.2, depth: 0.25, wet: 0.18 }).start();
  chorus.connect(widener); widener.connect(comp); comp.connect(limiter); limiter.toDestination();

  const masterVol = new Tone.Volume(-10); masterVol.connect(chorus);
  const wetBus = new Tone.Freeverb({ roomSize: 0.8, dampening: 2500 }); wetBus.wet.value = 0.4; wetBus.connect(masterVol);

  const pad = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "fatsine", count: 2, spread: 12 }, envelope: { attack: 1.8, decay: 0.8, sustain: 0.85, release: 3 } });
  pad.connect(masterVol); pad.connect(wetBus); pad.volume.value = -14;

  const bell = new Tone.FMSynth({ harmonicity: 3.2, modulationIndex: 4, envelope: { attack: 0.005, decay: 1.2, sustain: 0.05, release: 1.5 }, modulation: { type: "sine" }, modulationEnvelope: { attack: 0.005, decay: 0.6, sustain: 0, release: 0.8 } });
  bell.connect(masterVol); bell.connect(wetBus); bell.volume.value = -18;

  const TOTAL_BARS = 8;
  const chordsCycle = [["C3", "C4", "E4", "G4"], ["A2", "A3", "C4", "E4"], ["F2", "F3", "A3", "C4"], ["G2", "G3", "B3", "D4"]];
  const bellCycle = [{ note: "E5", step: 8 }, null, { note: "A5", step: 4 }, { note: "D6", step: 8 }, { note: "G5", step: 0 }, null, { note: "C6", step: 10 }, { note: "B5", step: 4 }];

  const events = [];
  for (let bar = 0; bar < TOTAL_BARS; bar++) {
    events.push({ time: barTime(bar, 0), type: "pad", notes: chordsCycle[bar % 4] });
    const b = bellCycle[bar];
    if (b) events.push({ time: barTime(bar, b.step), type: "bell", note: b.note });
  }
  const part = new Tone.Part((time, ev) => {
    if (ev.type === "pad") pad.triggerAttackRelease(ev.notes, "1m", time);
    else if (ev.type === "bell") bell.triggerAttackRelease(ev.note, "2n", time);
  }, events);
  part.loop = true; part.loopEnd = `${TOTAL_BARS}m`;
  return { part, bpm: 64, totalBars: TOTAL_BARS };
}

// ---------------------------------------------------------------------------
// ADVENTURE LOOP — plays during hero adventures, 104 BPM, 13 bars, A minor
// ---------------------------------------------------------------------------
function buildAdventureTrack() {
  const comp = new Tone.Compressor({ threshold: -20, ratio: 3, attack: 0.008, release: 0.25 });
  const limiter = new Tone.Limiter(-1);
  const widener = new Tone.StereoWidener(0.5);
  const chorus = new Tone.Chorus({ frequency: 3, delayTime: 2.6, depth: 0.45, wet: 0.3 }).start();
  chorus.connect(widener); widener.connect(comp); comp.connect(limiter); limiter.toDestination();

  const masterVol = new Tone.Volume(-7); masterVol.connect(chorus);
  const wetBus = new Tone.Freeverb({ roomSize: 0.72, dampening: 2800 }); wetBus.wet.value = 0.3; wetBus.connect(masterVol);

  const pad = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "fatsine", count: 3, spread: 22 }, envelope: { attack: 0.6, decay: 0.5, sustain: 0.75, release: 1.6 } });
  pad.connect(masterVol); pad.connect(wetBus); pad.volume.value = -16;

  const arp = new Tone.Synth({ oscillator: { type: "fatsawtooth", count: 2, spread: 18 }, envelope: { attack: 0.002, decay: 0.15, sustain: 0.05, release: 0.1 } });
  arp.connect(masterVol); arp.connect(wetBus); arp.volume.value = -15;

  const arpClick = new Tone.FMSynth({ harmonicity: 2, modulationIndex: 4, envelope: { attack: 0.002, decay: 0.06, sustain: 0, release: 0.04 }, modulation: { type: "sine" }, modulationEnvelope: { attack: 0.002, decay: 0.04, sustain: 0, release: 0.03 } });
  arpClick.connect(masterVol); arpClick.volume.value = -20;

  const bass = new Tone.Synth({ oscillator: { type: "fatsquare", count: 2, spread: 12 }, envelope: { attack: 0.005, decay: 0.2, sustain: 0.1, release: 0.15 } });
  bass.connect(masterVol); bass.volume.value = -11;

  const hat = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.04, release: 0.01 }, harmonicity: 5.1, modulationIndex: 12, resonance: 3800, octaves: 1 });
  hat.connect(masterVol); hat.volume.value = -28;

  const motif = new Tone.FMSynth({ harmonicity: 3.2, modulationIndex: 6, envelope: { attack: 0.003, decay: 0.4, sustain: 0.1, release: 0.5 }, modulation: { type: "sine" }, modulationEnvelope: { attack: 0.003, decay: 0.2, sustain: 0, release: 0.2 } });
  motif.connect(masterVol); motif.connect(wetBus); motif.volume.value = -11;

  const TOTAL_BARS = 13;
  const chordsCycle = [
    { pad: ["A3", "C4", "E4"], arp: ["A3", "C4", "E4", "A4", "E4", "C4", "A3", "C4"], root: "A1" },
    { pad: ["F3", "A3", "C4"], arp: ["F3", "A3", "C4", "F4", "C4", "A3", "F3", "A3"], root: "F1" },
    { pad: ["C4", "E4", "G4"], arp: ["C4", "E4", "G4", "C5", "G4", "E4", "C4", "E4"], root: "C2" },
    { pad: ["G3", "B3", "D4"], arp: ["G3", "B3", "D4", "G4", "D4", "B3", "G3", "B3"], root: "G1" },
  ];
  const turnaround = { pad: ["E3", "G#3", "B3"], arp: ["E3", "G#3", "B3", "E4", "B3", "G#3", "E3", "G#3"], root: "E1" };
  const motifNotes = ["A5", "C6", "E6", "C6"];

  const events = [];
  for (let bar = 0; bar < TOTAL_BARS; bar++) {
    const c = bar === 12 ? turnaround : chordsCycle[bar % 4];
    events.push({ time: barTime(bar, 0), type: "pad", notes: c.pad });
    c.arp.forEach((n, i) => events.push({ time: barTime(bar, i * 2), type: "arp", note: n }));
    events.push({ time: barTime(bar, 0), type: "bass", note: c.root });
    events.push({ time: barTime(bar, 8), type: "bass", note: c.root });
    for (let s = 2; s < 16; s += 4) events.push({ time: barTime(bar, s), type: "hat" });
    if (bar % 4 === 0 && bar < 12) motifNotes.forEach((n, i) => events.push({ time: barTime(bar, i * 4), type: "motif", note: n }));
  }
  const part = new Tone.Part((time, ev) => {
    switch (ev.type) {
      case "pad": pad.triggerAttackRelease(ev.notes, "1m", time); break;
      case "arp": arp.triggerAttackRelease(ev.note, "8n", time); arpClick.triggerAttackRelease(ev.note, "32n", time); break;
      case "bass": bass.triggerAttackRelease(ev.note, "8n", time); break;
      case "hat": hat.triggerAttackRelease("C6", "32n", time); break;
      case "motif": motif.triggerAttackRelease(ev.note, "4n", time); break;
    }
  }, events);
  part.loop = true; part.loopEnd = `${TOTAL_BARS}m`;
  return { part, bpm: 104, totalBars: TOTAL_BARS };
}

// ---------------------------------------------------------------------------
// BOSS LOOP — "OVERDRIVE", plays during a boss fight, 128 BPM, 16 bars, D minor
// ---------------------------------------------------------------------------
function buildBossTrack() {
  const comp = new Tone.Compressor({ threshold: -18, ratio: 4, attack: 0.003, release: 0.15 });
  const limiter = new Tone.Limiter(-1);
  const widener = new Tone.StereoWidener(0.45);
  const chorus = new Tone.Chorus({ frequency: 3.2, delayTime: 2, depth: 0.4, wet: 0.28 }).start();
  chorus.connect(widener); widener.connect(comp); comp.connect(limiter); limiter.toDestination();

  const masterVol = new Tone.Volume(-8).connect(chorus);
  const duckGain = new Tone.Gain(1).connect(masterVol);

  const kick = new Tone.MembraneSynth({ pitchDecay: 0.045, octaves: 6, envelope: { attack: 0.001, decay: 0.32, sustain: 0.001, release: 0.25 } }).connect(masterVol);
  kick.volume.value = -2;
  const clapNoise = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.16, sustain: 0 } });
  const clapFilter = new Tone.Filter(1400, "bandpass").connect(masterVol);
  clapNoise.connect(clapFilter); clapNoise.volume.value = -10;
  const hat = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.045, release: 0.01 }, harmonicity: 5.1, modulationIndex: 16, resonance: 3500, octaves: 1.2 }).connect(masterVol);
  hat.volume.value = -22;
  const openHat = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.22, release: 0.05 }, harmonicity: 5.1, modulationIndex: 20, resonance: 3000, octaves: 1.4 }).connect(masterVol);
  openHat.volume.value = -24;

  const bassFilter = new Tone.Filter(900, "lowpass").connect(duckGain);
  const bass = new Tone.MonoSynth({ oscillator: { type: "fatsawtooth", count: 3, spread: 20 }, envelope: { attack: 0.005, decay: 0.12, sustain: 0.65, release: 0.12 }, filterEnvelope: { attack: 0.01, decay: 0.15, sustain: 0.3, release: 0.2, baseFrequency: 200, octaves: 2.2 } }).connect(bassFilter);
  bass.volume.value = -7;

  const stabFilter = new Tone.Filter(2200, "lowpass").connect(masterVol);
  const stabDelay = new Tone.FeedbackDelay("8n.", 0.18); stabDelay.wet.value = 0.18; stabDelay.connect(masterVol);
  const stab = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "fatsquare", count: 2, spread: 18 }, envelope: { attack: 0.002, decay: 0.1, sustain: 0, release: 0.08 } });
  stab.connect(stabFilter); stab.connect(stabDelay); stab.volume.value = -15;

  const stabClick = new Tone.PolySynth(Tone.FMSynth, { harmonicity: 3, modulationIndex: 8, envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.03 }, modulation: { type: "square" }, modulationEnvelope: { attack: 0.001, decay: 0.03, sustain: 0, release: 0.02 } }).connect(masterVol);
  stabClick.volume.value = -20;

  const arpFilter = new Tone.Filter(1800, "lowpass").connect(masterVol);
  const arpLFO = new Tone.LFO({ frequency: "2m", min: 700, max: 3200 }); arpLFO.connect(arpFilter.frequency); arpLFO.start();
  const arpVol = new Tone.Volume(-100).connect(arpFilter);
  const arp = new Tone.Synth({ oscillator: { type: "fatsawtooth", count: 2, spread: 15 }, envelope: { attack: 0.001, decay: 0.08, sustain: 0.05, release: 0.05 } }).connect(arpVol);
  arp.volume.value = -8;

  const chordsCycle = [["D3", "F3", "A3", "C4"], ["C3", "E3", "G3", "C4"], ["A#2", "D3", "F3", "A#3"], ["A2", "C#3", "E3", "A3"]];
  const bassRootCycle = ["D2", "D2", "C2", "C2", "A#1", "A#1", "A1", "A1"];
  const arpCycle = [
    ["D3", "F3", "A3", "D4", "C4", "A3", "F3", "A3"], ["C3", "E3", "G3", "C4", "B3", "G3", "E3", "G3"],
    ["A#2", "D3", "F3", "A#3", "A3", "F3", "D3", "F3"], ["A2", "C#3", "E3", "A3", "G3", "E3", "C#3", "E3"],
  ];
  const TOTAL_BARS = 16, EIGHTHS_PER_BAR = 8;
  function sectionForBar(bar) { if (bar < 4) return "INTRO"; if (bar < 8) return "BUILD"; if (bar < 12) return "GROOVE"; return "PEAK"; }

  const events = [];
  for (let bar = 0; bar < TOTAL_BARS; bar++) {
    const section = sectionForBar(bar);
    const chordIdx = bar % 4;
    const chord = chordsCycle[chordIdx];
    const root = bassRootCycle[chordIdx];
    const arpNotes = arpCycle[chordIdx];
    const isFillBar = bar === TOTAL_BARS - 1;
    for (let step = 0; step < EIGHTHS_PER_BAR; step++) {
      const time = `${bar}:${Math.floor(step / 2)}:${(step % 2) * 2}`;
      if (step === 0 || step === 2 || step === 4 || step === 6) events.push({ time, type: "kick" });
      if (isFillBar && step === 7) events.push({ time, type: "kick" });
      if (section !== "INTRO" && (step === 2 || step === 6)) events.push({ time, type: "clap" });
      if (section !== "INTRO" && step % 2 === 1) events.push({ time, type: "hat" });
      if (section === "PEAK" && step === 7 && !isFillBar) events.push({ time, type: "openhat" });
      if ([0, 3, 4, 6].includes(step)) {
        const note = (step === 3 || step === 6) ? Tone.Frequency(root).transpose(12).toNote() : root;
        events.push({ time, type: "bass", note, dur: "8n" });
      }
      if ((section === "GROOVE" || section === "PEAK") && (step === 1 || step === 5)) events.push({ time, type: "stab", notes: chord });
      if (section === "PEAK") events.push({ time, type: "arp", note: arpNotes[step] });
    }
  }
  const part = new Tone.Part((time, ev) => {
    switch (ev.type) {
      case "kick":
        kick.triggerAttackRelease("C1", "8n", time);
        duckGain.gain.cancelScheduledValues(time);
        duckGain.gain.setValueAtTime(0.25, time);
        duckGain.gain.linearRampToValueAtTime(1, time + 0.16);
        break;
      case "clap": clapNoise.triggerAttackRelease("16n", time); break;
      case "hat": hat.triggerAttackRelease("C6", "32n", time); break;
      case "openhat": openHat.triggerAttackRelease("C6", "8n", time); break;
      case "bass": bass.triggerAttackRelease(ev.note, ev.dur, time); break;
      case "stab": stab.triggerAttackRelease(ev.notes, "16n", time); stabClick.triggerAttackRelease(ev.notes, "32n", time); break;
      case "arp": arp.triggerAttackRelease(ev.note, "16n", time); break;
    }
  }, events);
  part.loop = true; part.loopEnd = `${TOTAL_BARS}m`;

  // Arp fades in for the PEAK section and back out before the loop restarts.
  Tone.Transport.schedule((time) => {
    arpVol.volume.cancelScheduledValues(time);
    arpVol.volume.setValueAtTime(-100, time);
    arpVol.volume.linearRampToValueAtTime(-8, time + 0.5);
  }, "8m");
  Tone.Transport.schedule((time) => {
    arpVol.volume.cancelScheduledValues(time);
    arpVol.volume.linearRampToValueAtTime(-100, time + 0.3);
  }, "15:3:0");

  return { part, bpm: 128, totalBars: TOTAL_BARS };
}

// ---------------------------------------------------------------------------
// VICTORY (regular) — one-shot, ~5.2s, plays at the end of an adventure or mock test
// ---------------------------------------------------------------------------
function buildVictoryOneShot() {
  const comp = new Tone.Compressor({ threshold: -16, ratio: 3.5, attack: 0.003, release: 0.2 });
  const limiter = new Tone.Limiter(-1);
  const widener = new Tone.StereoWidener(0.5);
  const chorus = new Tone.Chorus({ frequency: 3.5, delayTime: 2.2, depth: 0.5, wet: 0.32 }).start();
  chorus.connect(widener); widener.connect(comp); comp.connect(limiter); limiter.toDestination();

  const reverb = new Tone.Freeverb({ roomSize: 0.6, dampening: 3000 }); reverb.wet.value = 0.3;
  const masterVol = new Tone.Volume(-4).connect(chorus); reverb.connect(masterVol);

  const run = new Tone.Synth({ oscillator: { type: "fatsawtooth", count: 2, spread: 15 }, envelope: { attack: 0.001, decay: 0.09, sustain: 0.05, release: 0.08 } }).connect(masterVol);
  run.connect(reverb); run.volume.value = -8;

  const chordSynth = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "fatsawtooth", count: 3, spread: 25 }, envelope: { attack: 0.005, decay: 0.5, sustain: 0.35, release: 1.1 } }).connect(masterVol);
  chordSynth.connect(reverb); chordSynth.volume.value = -5;

  const chordClick = new Tone.PolySynth(Tone.FMSynth, { harmonicity: 2.5, modulationIndex: 6, envelope: { attack: 0.002, decay: 0.15, sustain: 0, release: 0.1 }, modulation: { type: "square" }, modulationEnvelope: { attack: 0.002, decay: 0.1, sustain: 0, release: 0.06 } }).connect(masterVol);
  chordClick.volume.value = -14;

  const crash = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 1.1, release: 0.3 }, harmonicity: 4.2, modulationIndex: 24, resonance: 4000, octaves: 2.4 }).connect(masterVol);
  crash.connect(reverb); crash.volume.value = -14;

  const bell = new Tone.FMSynth({ harmonicity: 3.01, modulationIndex: 8, envelope: { attack: 0.002, decay: 1.4, sustain: 0.1, release: 1.8 }, modulation: { type: "sine" }, modulationEnvelope: { attack: 0.01, decay: 0.8, sustain: 0, release: 1 } }).connect(masterVol);
  bell.connect(reverb); bell.volume.value = -12;
  masterVol.volume.value = -4;

  function play() {
    const t0 = Tone.now() + 0.05;
    const runNotes = ["D4", "F#4", "A4", "D5", "F#5", "A5", "D6"];
    runNotes.forEach((note, i) => run.triggerAttackRelease(note, "32n", t0 + i * 0.075));
    const hitTime = t0 + runNotes.length * 0.075 + 0.02;
    chordSynth.triggerAttackRelease(["D4", "F#4", "A4", "D5", "F#5"], 1.6, hitTime);
    chordClick.triggerAttackRelease(["D4", "F#4", "A4", "D5", "F#5"], "16n", hitTime);
    crash.triggerAttackRelease("C5", 1.2, hitTime);
    ["A5", "F#5", "D5"].forEach((note, i) => bell.triggerAttackRelease(note, 1.2, hitTime + 0.35 + i * 0.28));
  }
  return { play, durationMs: 5200 };
}

// ---------------------------------------------------------------------------
// VICTORY EPIC — one-shot, ~9.7s orchestral fanfare, plays when a boss is defeated
// ---------------------------------------------------------------------------
function buildVictoryEpicOneShot() {
  const comp = new Tone.Compressor({ threshold: -14, ratio: 3, attack: 0.004, release: 0.3 });
  const limiter = new Tone.Limiter(-0.5);
  const widener = new Tone.StereoWidener(0.55);
  const chorus = new Tone.Chorus({ frequency: 3.4, delayTime: 2.4, depth: 0.55, wet: 0.35 }).start();
  chorus.connect(widener); widener.connect(comp); comp.connect(limiter); limiter.toDestination();

  const reverb = new Tone.Freeverb({ roomSize: 0.75, dampening: 2600 }); reverb.wet.value = 0.36;
  const masterVol = new Tone.Volume(-3).connect(chorus); reverb.connect(masterVol);

  const brassFilter = new Tone.Filter(2800, "lowpass").connect(masterVol); brassFilter.connect(reverb);
  const brass = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "fatsawtooth", count: 4, spread: 35 }, envelope: { attack: 0.006, decay: 0.2, sustain: 0.6, release: 0.4 } }).connect(brassFilter);
  brass.volume.value = -4;

  const brassClick = new Tone.PolySynth(Tone.FMSynth, { harmonicity: 3, modulationIndex: 8, envelope: { attack: 0.002, decay: 0.1, sustain: 0, release: 0.06 }, modulation: { type: "square" }, modulationEnvelope: { attack: 0.002, decay: 0.06, sustain: 0, release: 0.04 } }).connect(masterVol);
  brassClick.volume.value = -16;

  const descant = new Tone.Synth({ oscillator: { type: "fatsawtooth", count: 2, spread: 20 }, envelope: { attack: 0.004, decay: 0.15, sustain: 0.5, release: 0.3 } }).connect(brassFilter);
  descant.volume.value = -10;

  const lowBrass = new Tone.Synth({ oscillator: { type: "fatsawtooth", count: 3, spread: 15 }, envelope: { attack: 0.02, decay: 0.3, sustain: 0.75, release: 1.6 } }).connect(brassFilter);
  lowBrass.volume.value = -6;

  const tremolo = new Tone.Tremolo(9, 0.7).connect(masterVol).start();
  const stringFilter = new Tone.Filter(2200, "lowpass").connect(tremolo);
  const strings = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "fatsawtooth", count: 3, spread: 20 }, envelope: { attack: 0.3, decay: 0.4, sustain: 0.85, release: 1.8 } }).connect(stringFilter);
  strings.volume.value = -14;

  const timpani = new Tone.MembraneSynth({ pitchDecay: 0.09, octaves: 4, envelope: { attack: 0.001, decay: 0.55, sustain: 0.01, release: 0.4 } }).connect(masterVol);
  timpani.connect(reverb); timpani.volume.value = -2;

  const crashA = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 2.2, release: 0.8 }, harmonicity: 4.5, modulationIndex: 30, resonance: 4000, octaves: 2.8 }).connect(masterVol);
  crashA.connect(reverb); crashA.volume.value = -11;

  const crashB = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 1.4, release: 0.5 }, harmonicity: 6.1, modulationIndex: 22, resonance: 5200, octaves: 2 }).connect(masterVol);
  crashB.connect(reverb); crashB.volume.value = -16;

  const choirFilter = new Tone.Filter(1500, "lowpass").connect(masterVol); choirFilter.connect(reverb);
  const choir = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "fatsine", count: 3, spread: 25 }, envelope: { attack: 0.5, decay: 0.6, sustain: 0.85, release: 2.8 } }).connect(choirFilter);
  choir.volume.value = -8;

  const bell = new Tone.FMSynth({ harmonicity: 3.3, modulationIndex: 9, envelope: { attack: 0.002, decay: 1.8, sustain: 0.12, release: 2.4 }, modulation: { type: "sine" }, modulationEnvelope: { attack: 0.01, decay: 1, sustain: 0, release: 1.4 } }).connect(masterVol);
  bell.connect(reverb); bell.volume.value = -8;
  masterVol.volume.value = -2;

  function play() {
    const t0 = Tone.now() + 0.05;
    strings.triggerAttackRelease(["A3", "D4"], 1.7, t0);

    const call1 = [{ n: ["D5", "F#5"], t: 0.9 }, { n: ["D5", "F#5"], t: 1.06 }, { n: ["D5", "F#5"], t: 1.22 }];
    call1.forEach((c) => { brass.triggerAttackRelease(c.n, 0.14, t0 + c.t); brassClick.triggerAttackRelease(c.n, "32n", t0 + c.t); timpani.triggerAttackRelease("A1", "8n", t0 + c.t); });
    const hold1 = t0 + 1.42;
    brass.triggerAttackRelease(["F#5", "A5"], 0.5, hold1); descant.triggerAttackRelease("F#6", 0.5, hold1); timpani.triggerAttackRelease("D1", "4n", hold1);

    const callHigh = [{ n: ["A5", "D6"], t: 0 }, { n: ["A5", "D6"], t: 0.16 }, { n: ["A5", "D6"], t: 0.32 }];
    const t1 = hold1 + 0.62;
    callHigh.forEach((c) => { brass.triggerAttackRelease(c.n, 0.14, t1 + c.t); brassClick.triggerAttackRelease(c.n, "32n", t1 + c.t); timpani.triggerAttackRelease("A1", "8n", t1 + c.t); });
    const hold2 = t1 + 0.5;
    brass.triggerAttackRelease(["D6", "F#6"], 0.65, hold2); descant.triggerAttackRelease("A6", 0.65, hold2); timpani.triggerAttackRelease("D1", "4n", hold2); crashB.triggerAttackRelease("C5", 1, hold2);

    const rollStart = hold2 + 0.45;
    for (let i = 0; i < 10; i++) timpani.triggerAttackRelease("D2", "32n", rollStart + i * 0.045);

    const hitTime = rollStart + 0.5;
    brass.triggerAttackRelease(["D4", "F#4", "A4", "D5", "F#5", "A5", "D6"], 3, hitTime);
    brassClick.triggerAttackRelease(["D4", "F#4", "A4", "D5", "F#5", "A5", "D6"], "16n", hitTime);
    descant.triggerAttackRelease("F#6", 2.8, hitTime);
    lowBrass.triggerAttackRelease("D2", 3.2, hitTime);
    choir.triggerAttackRelease(["D4", "F#4", "A4", "D5", "F#5"], 3.4, hitTime);
    crashA.triggerAttackRelease("C5", 2.6, hitTime);
    crashB.triggerAttackRelease("G5", 2, hitTime + 0.04);
    timpani.triggerAttackRelease("D1", "2n", hitTime);
    timpani.triggerAttackRelease("D1", "2n", hitTime + 0.5);

    const flourishStart = hitTime + 1.9;
    ["D5", "F#5", "A5", "D6", "F#6", "A6", "D7"].forEach((n, i) => bell.triggerAttackRelease(n, 1.6, flourishStart + i * 0.16));
  }
  return { play, durationMs: 9700 };
}

// ---------------------------------------------------------------------------
// Engine: lazily builds each track on first use, manages the shared Transport.
// ---------------------------------------------------------------------------
const LOOP_BUILDERS = { title: buildTitleTrack, focus: buildFocusTrack, adventure: buildAdventureTrack, boss: buildBossTrack };
const ONESHOT_BUILDERS = { victory: buildVictoryOneShot, victoryEpic: buildVictoryEpicOneShot };

class MusicEngine {
  constructor() {
    this._loops = {};
    this._oneShots = {};
    this._started = false;
    this._currentLoop = null;
    this._muted = false;
  }
  async _ensureStarted() {
    if (this._started) return;
    try { await Tone.start(); this._started = true; } catch (e) {}
  }
  setMuted(muted) {
    this._muted = muted;
    if (muted) this.stopLoop();
  }
  _getLoop(key) {
    if (!this._loops[key]) this._loops[key] = LOOP_BUILDERS[key]();
    return this._loops[key];
  }
  async playLoop(key) {
    if (this._muted || !LOOP_BUILDERS[key]) return;
    await this._ensureStarted();
    if (this._currentLoop === key) return;
    Tone.Transport.stop();
    if (this._currentLoop && this._loops[this._currentLoop]) this._loops[this._currentLoop].part.stop(0);
    Tone.Transport.position = 0;
    const track = this._getLoop(key);
    Tone.Transport.bpm.value = track.bpm;
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = `${track.totalBars}m`;
    track.part.start(0);
    Tone.Transport.start();
    this._currentLoop = key;
  }
  stopLoop() {
    Tone.Transport.stop();
    if (this._currentLoop && this._loops[this._currentLoop]) this._loops[this._currentLoop].part.stop(0);
    Tone.Transport.position = 0;
    this._currentLoop = null;
  }
  async playOneShot(key) {
    if (this._muted || !ONESHOT_BUILDERS[key]) return;
    await this._ensureStarted();
    if (!this._oneShots[key]) this._oneShots[key] = ONESHOT_BUILDERS[key]();
    this._oneShots[key].play();
  }
}

export const musicEngine = new MusicEngine();

if (typeof window !== "undefined") {
  window.kqMusicDebug = () => ({
    currentLoop: musicEngine._currentLoop,
    muted: musicEngine._muted,
    started: musicEngine._started,
    contextState: Tone.context.state,
    transportState: Tone.Transport.state,
    bpm: Tone.Transport.bpm.value,
    position: Tone.Transport.position.toString(),
  });
}
