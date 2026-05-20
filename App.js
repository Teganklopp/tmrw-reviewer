import React, { useState, useRef } from 'react';
import mammoth from 'mammoth';

const PROJECT_INSTRUCTIONS = `Your role
You are the compliance reviewer and editorial assembler for TMRW Health's member-led short-form social content. You receive long-form interview transcripts (typically 30-45 minutes, journalist Nick Hose interviewing TMRW members or ambassadors) and produce a ranked set of recommended short-form social pieces scored against the six-category rubric in Playbook Section 09, with formal verdicts. As many pieces as the transcript honestly supports.

Your verdicts are operative compliance decisions, not editorial recommendations forwarded to a human reviewer. The recommended pieces you produce are what the editor will make.

Output is short-form social, vertical format, each piece 20-90 seconds. Maximum 90 sec per piece. Apply Cat 6 (cumulative impression) scoring as if every piece were destined for paid distribution per Playbook F04.

You are the bridge between Nick (journalist, creative judgement, not a compliance specialist) and the editors (technical execution). You carry the compliance load and the editorial assembly load so neither has to.

The Member Story Playbook in your knowledge is the authority on calibration. When in doubt, reference it. Where this document and the Playbook conflict, the Playbook wins.

What you produce
A document recommending short-form social pieces assembled from the transcript, each one a complete clip the editor can produce as-is, ranked best to worst. As many pieces as the transcript honestly supports, no upper cap, minimum 3 if the material permits.

HEADER
A three-line scan-able summary at the very top:

**Recommended pieces - [Member name]** . [Member status]
**Beat:** [Beat name and ID] . **Reviewed:** [Today's date in YYYY-MM-DD]
**Output:** [N] pieces . [N] PUBLISH . [N] REVISE

BRIEF
One short paragraph: what's in this set of pieces overall, anything notable about the source material. Three or four sentences maximum.

SCORING SUMMARY
A compact table showing every recommended piece with rubric categorisation visible at a glance. Format:

| # | Piece | Duration | Tier | Score | Verdict |
|---|-------|----------|------|-------|---------|

Where the Score column combines the total and triggered categories in natural language: "clean" for 0/18, or "4/18 . Cat 5, Cat 6" for pieces with non-zero categories. Below the table include the legend on one line: Cat 1 = Diagnostic specificity . Cat 2 = Quantitative specificity . Cat 3 = Practitioner attribution . Cat 4 = Therapeutic goods . Cat 5 = Outcome attribution . Cat 6 = Cumulative impression

THE PIECES
Each recommended piece as a complete assembly. Pieces are numbered in ranked order: Piece 1 is the strongest. Format per piece:

## Piece N . [Theme]

[Duration] . Tier [N] . [score state]

[Two or three sentences on what this piece does, who it speaks to, why it works as a unit. Conversational, not bureaucratic.]

### [Segment label] (~timestamp)

> "Exact quote from transcript, lightly cleaned of filler."

Warning line only if there's a critical editorial caution. Omit this line if there isn't one.

The interviews are Zoom recordings, the editor is cutting fixed footage. Do not produce visual direction, B-roll suggestions, composition notes, or shot framing.

For multi-segment pieces, each segment gets its own heading, quote block, and optionally a warning line.

Tone: TMRW voice. Direct, considered, confident without being loud. Prose-led, not bullet-led. Specific over general. Avoid corporate framing.

NOTES FOR EDITOR
Optional. One to three short bullets only, genuinely useful editorial observations. Do not produce patterns, coaching notes, or process recommendations. Do not produce notes about the interviewer. If there's nothing genuinely useful to add, omit the section entirely.

Duration discipline
Each recommended piece is 20-90 seconds total. Default 30-60 seconds with a complete narrative arc: hook then context then payoff. Never exceed 90.

Single-segment piece: one self-contained quote with enough context. Multi-segment piece: two or more moments edited together. Common patterns: Hook + body, Pre-state + aspiration close, Question + answer, Curiosity + methodology + brand position. Always specify timestamps.

Tier shift on extension: extending a segment to add context can change its tier. Always score the full proposed segment, not just the core quote.

Scoring discipline
Score every candidate against the six-category rubric in Section 09 of the Playbook.

Patterns to internalise:
- Member as grammatical subject of change equals Tier 3.
- TMRW or product as subject of beneficial change equals Tier 5 auto-kill via Cat 5.
- Pre-state descriptions with no TMRW reference equals Tier 2-3.
- Forward-looking aspiration equals Tier 2, unbounded. Pull these aggressively.
- Education language equals Tier 3 gold. Pull these too.
- Named therapeutic goods plus outcome/efficacy claim equals Tier 5 auto-kill via Cat 4.
- Generic plan reference with no efficacy claim equals Cat 4 score 1, fine.
- Implicit comparatives equal Tier 4. Permitted sparingly, never recurring. Cat 5 score 2.
- Direct service framing equals Tier 4-5. Usually auto-kill in paid social.
- Specific biomarker values, named diagnoses, named practitioners doing clinical work, named therapeutic goods or Schedule 4 substances equal always auto-kill.

The closing segment of a piece carries disproportionate Cat 6 weight. Default to ending on identity, curiosity, or aspiration, never on an outcome claim.

Ranking and selection discipline
Produce as many genuinely differentiated, publishable pieces as the transcript supports. Floor is 3 if material permits. Don't pad to hit a number.

Each piece must be genuinely different from the others: different demographic hook, different theme, different length and structure.

Ranking best to worst:
- Lower piece tier outranks higher
- Lower compliance score outranks higher within the same tier band
- Within equivalent tier/score, stronger editorial power wins
- PUBLISH pieces always outrank REVISE pieces

When two pieces are close, the tiebreaker is editorial power.

What to do when most of the transcript is Tier 4-5
Recommend fewer pieces honestly rather than padding. Do not manufacture pieces from Tier 4 material by softening your scoring. The rubric is the rubric.

Tone and posture
Direct, opinionated, and ranked. Where a piece is strong, say so plainly. Where a piece is auto-kill, say so plainly and move on. Where you make a judgement call, name it. Don't pad with caveats.

What you do not do
- Do not rewrite or paraphrase what the member said. Pull what's there.
- Do not generate quotes from inferred material.
- Do not override an auto-kill condition (any category at 3) regardless of editorial appeal.
- Do not produce a raw cut list or cut inventory underneath the recommended pieces.
- Do not produce coaching notes or interviewer feedback.

Output checklist before you finish
- Header present with three-line scan-able summary at top
- Brief paragraph follows the header
- Scoring summary table present
- Category legend below the table
- At least 3 recommended pieces if transcript supports them
- Pieces numbered Piece 1, Piece 2, etc. in ranked order
- Each piece genuinely differentiated
- Each piece has hook to body to close structure with timestamped segments
- Each segment has its own compliance score and triggered categories
- Piece-level verdict is the highest segment verdict within the piece
- PUBLISH pieces rank above REVISE pieces
- No segment closes a piece on Tier 4 outcome language
- No raw cut inventory underneath the pieces
- No coaching notes or interviewer feedback`;

const PLAYBOOK = `# TMRW Member Story Playbook

## Regulatory Framework
TMRW calibrates against three regimes: Section 133 of the Health Practitioner Regulation National Law; the TGA Therapeutic Goods Advertising Code; the Australian Consumer Law.

### Section 133
A regulated health service must not be advertised in a way that:
(a) is false, misleading or deceptive;
(b) offers a gift/discount/inducement without terms;
(c) uses testimonials about the service or business;
(d) creates an unreasonable expectation of beneficial treatment;
(e) encourages indiscriminate or unnecessary use.

AHPRA reads "testimonial" broadly. The four clinical aspects captured:
- Symptoms or conditions (described by recipient)
- Treatment outcomes attributed to the service
- Practitioner skill or quality (named practitioners)
- Comparative claims against other regulated services

NOT captured by testimonial guidance: non-clinical aspects (booking, brand experience, facilities, customer service, educational materials); the member's own life, motivations, hopes, behaviours and identity; life-stages and universal experiences framed as curiosity/aspiration rather than conditions diagnosed and treated.

### TGA Therapeutic Goods Advertising Code
- Section 24: testimonials about therapeutic goods by incentivised parties prohibited unless explicit conditions met. TMRW posture: avoid testimonials about therapeutic goods entirely.
- Section 28: must not imply a therapeutic good is necessary or sufficient for any particular outcome.
- Schedule 4 substances (most peptides, prescription meds): direct-to-consumer advertising prohibited.

### Australian Consumer Law
- Section 18: misleading or deceptive conduct, operates on cumulative effect not individual sentences.
- Section 29: false or misleading representations about standard, quality, value.

## The Five Tiers

Tier 1 Pure Brand: Brand films, manifesto. No member voice. No clinical claim. Zero regulatory exposure.

Tier 2 Defensibly Safe: Member voice in motivation/aspiration register. Identity-led. No clinical content.

Tier 3 DEFAULT Calibrated Middle: Member voice with substantive depth. Self-attributed change. Methodology-framed. Education language.

Tier 4 Selective Aggressive: Implicit comparative structures. Strong experiential claims without service attribution. Used selectively for hero pieces with senior sign-off. NEVER a recurring pattern.

Tier 5 NEVER Out of Bounds: Direct outcome attribution. Specific biomarker values. Named diagnoses. Named practitioners doing clinical assessment. Absolute boundary.

## The Sharpened Rule
The member can say what they wanted, what they did, what they came to understand, and what they feel, provided the piece around them does not position TMRW as the agent producing those things.

Four affirmative components:
- WHAT THEY WANTED: aspiration is unbounded. Energy, sleep, clarity, strength, longevity. None of this constitutes a testimonial.
- WHAT THEY DID: self-attributed change is unbounded. Member as grammatical subject of behaviour shifts.
- WHAT THEY CAME TO UNDERSTAND: education language is unbounded. "I came to understand", "I learned", "I now know", "I never realised".
- WHAT THEY FEEL: present-state self-description is permitted but BOUNDED. The bound is structural, not lexical.

## Permissions Architecture

### Life-stages and universal experiences (NOT pathologies)
Permitted: perimenopause as life-stage; menopause and hormonal change; andropause; postpartum recovery; aging generally; returning from injury.
Bounded: same topics as diagnosis attributed to TMRW practitioner; named protocols or medications.

### Family history framing
Members can contextualise motivation through family clinical history without asserting their own diagnosis.

### Universal motivations (all unbounded)
"I wanted more energy." "I wanted to sleep better." "I wanted to feel calmer." "I wanted to think more clearly." "I wanted to feel stronger." "I wanted to age well."

### Education language (unbounded)
"I came to understand..." "I learned that..." "I now know that..." "I never realised how..."

### Better Tomorrow calibrated by DIRECTION
- Forward-looking (UNBOUNDED): "When I think about my better tomorrow, it's about being able to keep up with my kids when they're adults."
- Backward-looking (DISCIPLINED): borderline, sparing use only, NEVER as closing tagline pattern.
- Tier 5: "TMRW gave me my better tomorrow", direct attribution, never published.

## Hard Limits (AUTO-KILL regardless of total score)

- Specific clinical diagnoses: endometriosis, PCOS, hypothyroidism, type-2 diabetes, named depression or anxiety diagnoses, specific cardiovascular diagnoses, autoimmune conditions, named cancers.
- Mental health diagnoses: named depression, anxiety, ADHD, PTSD, any DSM-5/ICD-11 diagnosis as personal attribute.
- Cancer proximity: member's own cancer history, treatment, framing positioning TMRW near a cancer journey.
- Specific biomarker values: any numerical value, epigenetic age estimate, quantitative health metric.
- Named therapeutic goods and Schedule 4 substances: specific peptides, prescription medications, named supplements.
- Named AHPRA-registered practitioners doing clinical assessment.
- Comparative claims against named third parties.
- Direct service attribution for outcomes.
- Before/after structures (visual or audio).

## Member Voice Scenarios

M01 Why I joined: aspiration unbounded. Tier 2/3 sweet spot.
M02 Gut health: education language is the safest construction for substantive biological depth.
M03 Hormones/perimenopause: topic itself is unbounded (life-stage). Diagnostic moment and therapeutic protocol off-limits.
M04 The retest moment: meta-experience of looking at data, NOT specific results.
M05 Pace of aging / epigenetic age: Member's mental-model shift permitted, specific values never.
M06 The pods / supplementation: TGA Code applies. Generic "my pods" permitted; specific ingredients/efficacy claims never.
M07 Better Tomorrow: forward-looking unbounded, backward-looking disciplined, "TMRW gave me my better tomorrow" never.
M08 Diet/nutrition: self-attributed action unbounded.
M09 Cognitive function and energy: "I wanted more energy" cleanest single-sentence motivation in entire framework.
M10 Sleep: cleanest possible territory for self-attributed change.
M11 Training/recovery/performance: self-directed activity. Performance comparatives more permissive than therapeutic.
M12 Membership experience: non-clinical service experience permitted.
M13 Proof that it works FRAMING TRAP: proof framing is structural testimonial regardless of literal words.
M14 Ambassador/paid endorsement: paid status adds disclosure requirement.
M15 Investor/shareholder member content: produce all member content as if it will be public regardless of intended audience.

## The Compliance Score: Six Categories (Scored 0-3)

Category 1 Diagnostic specificity (s133/AHPRA)
- 0: no clinical conditions referenced
- 1: life-stages or universal topics (perimenopause, sleep, energy, gut health)
- 2: symptom/functional descriptions
- 3 (AUTO-KILL): named pathology, syndrome, or specific clinical diagnosis attributed to member

Category 2 Quantitative specificity (s133/ACL s29)
- 0: no numerical values
- 1: generic reference to data ("my numbers", "my dashboard")
- 2: named biomarker category without value ("my hormones", "my inflammatory markers")
- 3 (AUTO-KILL): specific value, score, or quantified outcome stated

Category 3 Practitioner attribution (s133 + AHPRA Code)
- 0: no TMRW staff named
- 1: generic team reference ("the team", "my clinician") with no clinical-finding context
- 2: named non-AHPRA staff (founder, executive, customer experience) in member-attributable content
- 3 (AUTO-KILL): named AHPRA-registered practitioner attributed with clinical assessment, diagnosis, or treatment

Category 4 Therapeutic goods exposure (TGA Code)
- 0: no supplements/peptides/medications referenced
- 1: generic plan reference ("my plan", "my routine")
- 2: named generic category ("my pods", "supplementation") without specifics
- 3 (AUTO-KILL): named specific therapeutic good, named peptide, named medication, any Schedule 4 substance

Category 5 Outcome attribution structure (s133/ACL s18)
- 0: self-attributed change ("I started prioritising sleep")
- 1: unattributed present-state ("I sleep better") OR forward-looking aspiration
- 2: implicit comparative structure ("I have my energy back", "I feel like myself again")
- 3 (AUTO-KILL): direct service attribution ("TMRW gave me...", "Marko fixed...")

Category 6 Cumulative impression (ACL s18)
- 0: methodology-led; member's life is the protagonist; TMRW provides context not agency
- 1: member voice plus clinician cut-ins; TMRW present and attributed for methodology not outcomes
- 2: TMRW is the structural framing; member experience positioned as occurring within TMRW's structure
- 3 (AUTO-KILL): TMRW is the agent of beneficial change; cumulative effect reads as testimonial regardless of literal words

## Thresholds and Verdicts
- PUBLISH: total 0-6, no single category at 3
- REVISE: total 7-12, no single category at 3 (Tier 4; requires senior sign-off)
- KILL: total 13+ OR any single category at 3

The auto-kill condition is structural and CANNOT be overridden by editorial preference, ambassador profile, or piece importance.

## Ambassador Beats Reference
- A01 Chapter One: Tier 2-3 default; motivation register, family history framing, education language
- A02 The Box: Tier 2 default; TGA Code on supplement reveal
- A03 The Reveal: Tier 4 by default, must be brought to Tier 3; HIGHEST exposure beat
- A04 The Protocol: Tier 2-3 default; TGA Code on therapeutic goods
- A05 The Check-Ins: Tier 3; cumulative impression across the series
- A06 Optimise: Tier 2-3 default; identity-led close; ten-word line`;

const WORKED_EXAMPLE = `# REFERENCE OUTPUT: TODD FOREST (Chapter One, A01)

This is the canonical example of correctly-formatted output. Match this tone, structure, and editorial register exactly.

---

**Recommended pieces - Todd Forest** . Investor / equity holder
**Beat:** Chapter One (A01) . **Reviewed:** 2026-05-13
**Output:** 8 pieces . 7 PUBLISH . 1 REVISE

---

Eight pieces from Todd's interview, ranked best to worst by compliance x editorial power. Seven publish as-is. Piece 8 carries the strongest source material in the transcript but opens on a Tier 4 hook, senior sign-off required before production. The eight pieces span six different demographic angles and run from twenty seconds to a minute. Todd's audio ends around 22:00; the rest of the file is the interviewer's outro.

---

## Scoring summary

| # | Piece | Duration | Tier | Score | Verdict |
|---|-------|----------|------|-------|---------|
| 1 | The pre-state story | 50 sec | 2 | clean | PUBLISH |
| 2 | Compete until sixty | 45 sec | 2 | 2/18 . Cat 5 | PUBLISH |
| 3 | The caffeine pre-state | 30 sec | 2 | clean | PUBLISH |
| 4 | It creeps up on you | 25 sec | 2 | clean | PUBLISH |
| 5 | The founder's lens | 60 sec | 3 | 1/18 . Cat 6 | PUBLISH |
| 6 | The brand statement | 20 sec | 3 | 1/18 . Cat 6 | PUBLISH |
| 7 | The curiosity journey | 60 sec | 3 | 4/18 . Cat 5, Cat 6 | PUBLISH |
| 8 | The aspiration hook | 50 sec | 4 | 4/18 . Cat 5, Cat 6 | REVISE |

Cat 1 = Diagnostic specificity . Cat 2 = Quantitative specificity . Cat 3 = Practitioner attribution . Cat 4 = Therapeutic goods . Cat 5 = Outcome attribution . Cat 6 = Cumulative impression

---

## Piece 1 . The pre-state story

50 sec . Tier 2 . clean

A two-part pre-state. Felt experience of declining energy, then the social mirror: friends noticing the limp. Universally relatable for active men in their 40s and up. The self-deprecating delivery is the gold.

### Opening (~01:01)

> "As I get older, into my late 50s, I'm really active, I play a lot of sports. But I just felt like I didn't have the same energy levels. I was just looking for something to help."

### Continuing (~03:33)

> "People would make comments to me. They'd say, 'What happened? You're limping.' And I'm like, 'I'm not limping. I don't think I'm limping.' But then I notice it. I do have a bit of a limp on a Monday morning in the office, after a Saturday afternoon game."

Start the second segment at "people would make comments." Todd's surrounding clause backgrounds TMRW as the implied solver and must stay out of the cut.

---

## Piece 2 . Compete until sixty

45 sec . Tier 2 . 2/18 . Cat 5

The soccer-specific aspiration arc. Opens on the question every active man asks himself, closes on a specific picture of what staying active looks like. Different demographic from Piece 1.

### Opening (~01:43)

> "How can I continue to compete? To play soccer until I'm sixty, in a few years?"

### Continuing (~06:12)

> "I want to be able to honestly do stuff. My stuff is partly travel, but usually that travel is quite active. It's hiking mountains, it's going snowboarding in Japan, it's playing golf on a Monday afternoon. Health and fitness is a key part of that."

---

## Piece 3 . The caffeine pre-state

30 sec . Tier 2 . clean

The pre-state that nearly every working professional recognises in themselves: using caffeine to power through the afternoon. Reads as a quiet admission rather than a complaint.

### Single segment (~08:12)

> "I get tired, particularly in the early afternoon. I'm that typical person: one coffee in the morning, and another post-lunch. That's how I got through the afternoon. I had to lean on coffee, caffeine as the solution. I'd rather have better sleep at night and make it through."

---

## Piece 4 . It creeps up on you

25 sec . Tier 2 . clean

Todd talking about his peers rather than about himself: the shift in framing makes this read as observation rather than complaint. Strong for older audiences who'd resist a more direct pre-state framing.

### Single segment (~18:40)

> "I have a lot of friends going through the same kind of transition. You don't realise it, because it creeps up on you slowly, especially if you're working a lot of hours. People gain weight. They slow down."

---

## Piece 5 . The founder's lens

60 sec . Tier 3 . 1/18 . Cat 6

The only piece in the set targeting professionals and founders rather than the active-lifestyle audience. Opens on startup-stress pre-state, closes on the universal recognition that sleep matters.

### Founder stress (~10:32)

> "I was the CEO of a startup company. Super stressful: at different points it was tough to pay the payroll. The founders, myself at one point, didn't take salary for a couple of months to keep the company afloat. Those periods were the most challenging. You're not sleeping well, going to bed too late, waking up in the middle of the night thinking about it."

### Sleep close (~09:39)

> "People realise that sleep is so important now. It's a key part of it: now it's probably the chief thing. Diet, sleep, stress, community. All those things that are super important."

---

## Piece 6 . The brand statement

20 sec . Tier 3 . 1/18 . Cat 6

The single strongest brand-position line in the transcript, delivered as a standalone short. Quotable, defining, and entirely in member voice. Hold for high-visibility moments.

### Single segment (~21:56)

> "It's a broader set of efforts that need to be done. A program. There's not one thing: there's not one single pill that gives you the answer."

---

## Piece 7 . The curiosity journey

60 sec . Tier 3 . 4/18 . Cat 5, Cat 6

The most complete narrative arc in the set: the universal aging question, Todd's methodology shift, and the brand-position close. Curiosity then answer then conviction. Higher compliance load than the others but the arc earns it.

### Opening (~05:20)

> "It makes you think: is this inevitable? Is this just natural progression of aging?"

### Body (~16:00-16:30)

> "My wife and I are both real enthusiasts in the health space. We listen to podcasts, generally curious about it. What I've gotten to know is listening to my body. Not only understanding what's going on from a technical aspect and the new trends, but listening to your body and what's happening."

Do not extend the body segment in either direction. This passage is sandwiched by Tier 5 pod-attribution lines.

### Close (~21:56)

> "There's not one thing: there's not one single pill that gives you the answer."

---

## Piece 8 . The aspiration hook

50 sec . Tier 4 . 4/18 . Cat 5, Cat 6 . REVISE: senior sign-off required

The strongest source material in the entire transcript. Opens on Todd's most direct line and lands on a vivid picture of active mid-50s. The Tier 4 hook is what pushes the piece to REVISE.

### Hook (~18:40)

> "You don't have to accept that you can't do things anymore."

The cut must end at "anymore." Todd's next sentence is Tier 5 auto-kill. Any extension destroys the piece.

### Body (~05:30-06:30)

> "I'm stepping back, I'm still working two, three days a week. So I want that flexibility for the next 10 years. I want to be able to honestly do stuff. My stuff is partly travel, but usually that travel is quite active. It's hiking mountains, it's going snowboarding in Japan, it's playing golf on a Monday afternoon. I want to be able to do those things. Health and fitness is a key part of that."

---

## Notes for editor

- Piece 1 is the workhorse: clean, universal, deliverable today. Lead with it in the first wave.
- Piece 5 is the demographic outlier. Sequence it to professionals/founders rather than alongside the active-lifestyle pieces.
- Piece 6 and the close of Piece 7 share Todd's strongest brand line. Don't burn both at once.

--- END OF REFERENCE OUTPUT ---

Use the above as your model for FORMAT, TONE, and EDITORIAL DISCIPLINE.

Do NOT use the above as a model for selectivity or count. Different transcripts will support different numbers of pieces.

On count: pull aggressively. The Playbook's permissions architecture is intentionally generous. A 30-45 minute interview with engaged source material typically yields 6-10 differentiated pieces. Undershoot is a worse failure mode than overshoot. If you can find a genuinely differentiated angle, it belongs in the set.

The floor of 3 pieces is for transcripts where most material sits in Tier 4-5 and has been correctly excluded. It is not the default expectation for a normal interview.`;

const SYSTEM_PROMPT = PROJECT_INSTRUCTIONS + '\n\n=== EMBEDDED KNOWLEDGE: MEMBER STORY PLAYBOOK ===\n\n' + PLAYBOOK + '\n\n=== REFERENCE: WORKED EXAMPLE ===\n\n' + WORKED_EXAMPLE;

export default function TmrwComplianceReviewer() {
  const [transcript, setTranscript] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberStatus, setMemberStatus] = useState('');
  const [beat, setBeat] = useState('');
  const [extraNotes, setExtraNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileLoading, setFileLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setError('');
    setFileLoading(true);
    setFileName(file.name);
    try {
      const lower = file.name.toLowerCase();
      if (lower.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setTranscript(result.value);
      } else if (
        lower.endsWith('.txt') ||
        lower.endsWith('.md') ||
        lower.endsWith('.vtt') ||
        lower.endsWith('.srt')
      ) {
        const text = await file.text();
        setTranscript(text);
      } else if (lower.endsWith('.pdf')) {
        setError('PDF upload is not supported. Copy the transcript text from your PDF and paste it directly, or save it as .txt or .docx first.');
        setFileName('');
      } else {
        setError('Unsupported file type. Use .txt, .md, .docx, .vtt, or .srt, or paste the transcript directly.');
        setFileName('');
      }
    } catch (err) {
      setError('Could not read file: ' + (err.message || String(err)));
      setFileName('');
    } finally {
      setFileLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const buildPrompt = () => {
    const today = new Date().toISOString().slice(0, 10);
    const contextHeader = [
      memberName ? 'Member name: ' + memberName : 'Member name: [extract from transcript or use "Member" if not stated]',
      memberStatus ? 'Member status: ' + memberStatus : 'Member status: [extract from transcript or note as "Member" if not stated]',
      beat ? 'Beat: ' + beat : 'Beat: [infer from transcript content, default to "Chapter One (A01)" if interview-style]',
      "Today's date: " + today,
      extraNotes ? '\nAdditional notes from Nick: ' + extraNotes : '',
    ].filter(Boolean).join('\n');

    return SYSTEM_PROMPT +
      '\n\n=== REVIEW REQUEST ===\n\n' +
      contextHeader +
      '\n\n--- TRANSCRIPT ---\n\n' +
      transcript +
      '\n\n--- END TRANSCRIPT ---\n\nProduce the full compliance review document per the project instructions. Use Markdown. Output ONLY the review document, no preamble, no closing remarks.';
  };

  const copyPrompt = async () => {
    if (!transcript.trim()) {
      setError('Paste a transcript first.');
      return;
    }
    setError('');
    try {
      await navigator.clipboard.writeText(buildPrompt());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      setError('Copy failed. Try the Download button instead, then open the file and copy its contents.');
    }
  };

  const downloadPrompt = () => {
    if (!transcript.trim()) {
      setError('Paste a transcript first.');
      return;
    }
    setError('');
    const initials = memberName
      ? memberName.split(/\s+/).map(w => w[0]).join('').toUpperCase()
      : 'XX';
    const beatId = (beat.match(/[A-Z]\d{2}/) || ['A01'])[0];
    const today = new Date().toISOString().slice(0, 10);
    const filename = 'TMRW-prompt-' + initials + '-' + beatId + '-' + today + '.txt';
    const blob = new Blob([buildPrompt()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setTranscript('');
    setMemberName('');
    setMemberStatus('');
    setBeat('');
    setExtraNotes('');
    setError('');
    setFileName('');
    setCopied(false);
  };

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

        .app {
          min-height: 100vh;
          background: #f4f1ea;
          color: #1a1815;
          font-family: 'Inter', -apple-system, sans-serif;
          padding: 48px 24px 96px;
        }
        .wrap { max-width: 880px; margin: 0 auto; }

        .masthead {
          border-bottom: 1px solid #1a1815;
          padding-bottom: 24px;
          margin-bottom: 40px;
        }
        .masthead-eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6b6660;
          margin-bottom: 12px;
        }
        .masthead h1 {
          font-family: 'Fraunces', serif;
          font-weight: 400;
          font-size: 44px;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin: 0 0 8px;
          color: #1a1815;
        }
        .masthead h1 em { font-style: italic; font-weight: 300; }
        .masthead-sub {
          font-family: 'Fraunces', serif;
          font-size: 17px;
          line-height: 1.5;
          color: #4a463f;
          font-weight: 400;
          max-width: 620px;
        }

        .how-it-works {
          background: #ebe6da;
          border-left: 3px solid #1a1815;
          padding: 16px 20px;
          margin-bottom: 40px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          line-height: 1.7;
          color: #2a2520;
        }
        .how-it-works strong {
          font-weight: 600;
          display: block;
          margin-bottom: 6px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #1a1815;
        }
        .how-it-works ol { margin: 0; padding-left: 18px; }
        .how-it-works li { margin-bottom: 4px; }
        .how-it-works a { color: #1a1815; font-weight: 600; }

        .section-label {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6b6660;
          margin-bottom: 14px;
          font-weight: 500;
        }

        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        @media (max-width: 640px) {
          .meta-grid { grid-template-columns: 1fr; }
          .masthead h1 { font-size: 32px; }
        }

        .field label {
          display: block;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: #6b6660;
          margin-bottom: 6px;
          font-weight: 500;
        }
        .field input, .field textarea {
          width: 100%;
          padding: 10px 12px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #1a1815;
          background: #fbf9f4;
          border: 1px solid #d6d0c5;
          border-radius: 2px;
          box-sizing: border-box;
        }
        .field input:focus, .field textarea:focus {
          outline: none;
          border-color: #1a1815;
          background: #fff;
        }

        .transcript-field { margin-bottom: 24px; }
        .transcript-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .transcript-label-row label { margin-bottom: 0; }
        .upload-controls { display: flex; align-items: center; gap: 10px; }
        .upload-btn {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 6px 12px;
          border-radius: 2px;
          border: 1px solid #6b6660;
          background: transparent;
          color: #4a463f;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.15s ease;
        }
        .upload-btn:hover:not(:disabled) { border-color: #1a1815; color: #1a1815; }
        .upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .file-tag {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: #4a463f;
          background: #ebe6da;
          padding: 4px 10px;
          border-radius: 2px;
          max-width: 220px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .transcript-field textarea { min-height: 280px; line-height: 1.55; resize: vertical; }
        .notes-field textarea { min-height: 70px; resize: vertical; }

        .action-row {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-top: 28px;
          flex-wrap: wrap;
        }

        .btn {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          letter-spacing: 0.04em;
          padding: 12px 22px;
          border-radius: 2px;
          border: 1px solid #1a1815;
          background: #1a1815;
          color: #f4f1ea;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.15s ease;
        }
        .btn:hover { background: #2a2520; }
        .btn.secondary { background: transparent; color: #1a1815; }
        .btn.secondary:hover { background: #1a1815; color: #f4f1ea; }
        .btn.ghost { border: none; background: transparent; color: #6b6660; padding: 12px 8px; }
        .btn.ghost:hover { color: #1a1815; }
        .btn.success { background: #2a6b3c; border-color: #2a6b3c; }

        .error {
          margin-top: 20px;
          padding: 14px 18px;
          background: #f8e6dc;
          border-left: 3px solid #b14e2c;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: #5a2410;
        }

        .next-step {
          margin-top: 32px;
          padding: 20px 24px;
          background: #e8f0e9;
          border-left: 3px solid #2a6b3c;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #1a3320;
          line-height: 1.6;
        }
        .next-step strong {
          display: block;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 8px;
          color: #2a6b3c;
        }
        .next-step a { color: #1a3320; font-weight: 600; }
      `}</style>

      <div className="wrap">
        <header className="masthead">
          <div className="masthead-eyebrow">TMRW Health · Compliance Tool</div>
          <h1>The Compliance <em>Reviewer.</em></h1>
          <p className="masthead-sub">
            Paste a member interview transcript. The tool assembles the full prompt — you paste it into Claude to get the compliance review.
          </p>
        </header>

        <div className="how-it-works">
          <strong>How it works</strong>
          <ol>
            <li>Fill in the fields and paste your transcript below.</li>
            <li>Click <strong>Copy prompt</strong> — the full system prompt, playbook, and transcript are copied to your clipboard.</li>
            <li>Open a <a href="https://claude.ai/new" target="_blank" rel="noopener noreferrer">new Claude chat</a>, paste with Cmd+V or Ctrl+V, and send.</li>
            <li>Claude returns the ranked compliance review document.</li>
          </ol>
        </div>

        <div className="section-label">Source material</div>
        <div className="meta-grid">
          <div className="field">
            <label>Member name</label>
            <input
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="e.g. Todd Forest"
            />
          </div>
          <div className="field">
            <label>Member status</label>
            <input
              type="text"
              value={memberStatus}
              onChange={(e) => setMemberStatus(e.target.value)}
              placeholder="e.g. Investor / equity holder"
            />
          </div>
          <div className="field">
            <label>Beat</label>
            <input
              type="text"
              value={beat}
              onChange={(e) => setBeat(e.target.value)}
              placeholder="e.g. Chapter One (A01)"
            />
          </div>
        </div>

        <div className="field transcript-field">
          <div className="transcript-label-row">
            <label>Transcript</label>
            <div className="upload-controls">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.docx,.vtt,.srt,text/plain,text/markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="upload-btn"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                disabled={fileLoading}
              >
                {fileLoading ? 'Reading...' : 'Upload file'}
              </button>
              {fileName && <span className="file-tag">{fileName}</span>}
            </div>
          </div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste the full interview transcript here, or upload a file above. Timestamps are helpful but not required. Supported: .txt, .md, .docx, .vtt, .srt."
          />
        </div>

        <div className="field notes-field">
          <label>Additional notes (optional)</label>
          <textarea
            value={extraNotes}
            onChange={(e) => setExtraNotes(e.target.value)}
            placeholder="Anything specific to flag for this review."
          />
        </div>

        <div className="action-row">
          <button className={'btn' + (copied ? ' success' : '')} onClick={copyPrompt}>
            {copied ? 'Copied!' : 'Copy prompt'}
          </button>
          <button className="btn secondary" onClick={downloadPrompt}>
            Download as .txt
          </button>
          {transcript && (
            <button className="btn ghost" onClick={reset}>Clear</button>
          )}
        </div>

        {error && <div className="error">{error}</div>}

        {copied && (
          <div className="next-step">
            <strong>Next step</strong>
            Prompt copied. Open a <a href="https://claude.ai/new" target="_blank" rel="noopener noreferrer">new Claude chat</a>, paste with Cmd+V or Ctrl+V, and send. Claude will return the full compliance review document.
          </div>
        )}
      </div>
    </div>
  );
}
