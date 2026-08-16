# Point System & Scoring Matrix 🎯

> Comprehensive breakdown of point allocations, graduated scoring rubrics, and tie-breaking algorithms across all 4 stages of **MilleRace**.

---

## 📊 Stage-by-Stage Point Distribution

The scoring system evaluates performance across distinct literacy and analytical dimensions, totaling **100 points maximum**:

| Stage | Guardian | Domain & Competency Focus | Items | Scoring Rule | Stage Max |
|---|---|---|---|---|---|
| **Stage 1** | Miller | Visual AIAS Discrimination | 4 Questions | 5 pts per correct answer | **20 pts** |
| **Stage 2** | Jen | Literary Title Reconstruction | 10 Questions | 4 pts per correct answer | **40 pts** |
| **Stage 3** | Aidan | Textual Authenticity Rating | 5 Passages | Graduated scale (see below) | **20 pts** |
| **Stage 4** | Lizzy | High-Order PISA Inferencing | 4 Questions | Weighted (0, 3, or 5 pts) | **20 pts** |
| **Total** | — | **Full MilleRace Relay** | **23 Items** | — | **100 pts** |

---

## 🔍 Stage 3 Graduated Scoring Matrix

Stage 3 assesses the reader's fine-grained ability to distinguish genuine human writing from AI-generated prose. Unlike a binary right/wrong test, Stage 3 awards partial credit based on how close the player's rating is to the authentic ground truth.

| Passage / Item | Target Origin | Human (`5 pts`) | Somewhat Human (`3 pts`) | Barely Human (`1 pt`) | Not Human (`0 pts`) |
|---|---|:---:|:---:|:---:|:---:|
| **Q1 (Axolotls)** | Authentic Human | **5 pts** | 3 pts | 1 pt | 0 pts |
| **Q2 (English Breakfast)** | Authentic Human | **5 pts** | 3 pts | 1 pt | 0 pts |
| **Q3 (Valentine's Day)** | AI Generated | 0 pts | 1 pt | 3 pts | **5 pts** |
| **Q4 (1920s Uniforms)** | AI Generated | 0 pts | 1 pt | 3 pts | **5 pts** |
| **Q5 (Chopsticks History)** | Authentic Human | **5 pts** | 3 pts | 1 pt | 0 pts |

> [!NOTE]
> Stage 3 total score is capped at **20 points**, preserving the balanced 100-point total even if a player achieves 25 raw points across all 5 passages.

---

## 🧠 Stage 4 Weighted Inferential Scoring Matrix

Stage 4 presents nuanced reading passages with multiple plausible interpretations. Options are scored according to their depth of inferential reasoning:

- **Optimal Critical Inference (5 pts):** Synthesizes subtle subtext, authorial bias, and implicit meaning accurately.
- **Partial Literal / Surface Reading (3 pts):** Correctly captures literal information or secondary points, but misses the core thematic inference.
- **Misguided / Distractor Option (0 pts):** Misinterprets the text or relies on unwarranted assumptions.

$$\text{Stage 4 Score} = \sum_{i=1}^{4} \text{Weight}_i \quad (\text{Max } 20 \text{ pts})$$

---

## ⏱️ Leaderboard Ranking & Tie-Breaking Logic

When two or more players achieve identical total scores:
1. **Primary Sort:** Total Score (`score`) in **Descending** order ($100 \rightarrow 0$).
2. **Secondary Sort:** Time Elapsed / Submission Timestamp (`timestamp`) in **Ascending** order (earlier submissions rank higher).

---

[⬅️ The 4-Stage Relay Journey](gameplay-and-stages.md) | [Next: Character Archetypes & Matching ➔](character-archetypes.md)
