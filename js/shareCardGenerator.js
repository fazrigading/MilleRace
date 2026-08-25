/**
 * MilleRace - Social Media Result Screenshot Generator
 * Generates high-resolution 1:1 (Square) and 9:16 (Story) PNG cards
 * using HTML5 2D Canvas API and triggers automatic downloads.
 */

const ShareCardGenerator = {
  // Helper to load image as a Promise
  loadImage(src) {
    return new Promise((resolve) => {
      if (!src) {
        resolve(null);
        return;
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn(`[ShareCardGenerator] Failed to load image: ${src}`);
        resolve(null);
      };
      img.src = src;
    });
  },

  // Helper to draw rounded rectangles with robust corner clamping
  drawRoundRect(ctx, x, y, width, height, radius, fillStyle = null, strokeStyle = null, lineWidth = 1) {
    ctx.save();
    ctx.beginPath();
    let r = radius;
    if (typeof r === 'number') {
      r = { tl: r, tr: r, br: r, bl: r };
    }
    const maxR = Math.min(width / 2, height / 2);
    const tl = Math.min(r.tl || 0, maxR);
    const tr = Math.min(r.tr || 0, maxR);
    const br = Math.min(r.br || 0, maxR);
    const bl = Math.min(r.bl || 0, maxR);

    ctx.moveTo(x + tl, y);
    ctx.lineTo(x + width - tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + tr);
    ctx.lineTo(x + width, y + height - br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - br, y + height);
    ctx.lineTo(x + bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - bl);
    ctx.lineTo(x, y + tl);
    ctx.quadraticCurveTo(x, y, x + tl, y);
    ctx.closePath();

    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
    ctx.restore();
  },

  // Helper to draw circular progress ring with score at center
  drawCircleProgress(ctx, cx, cy, radius, lineWidth, progress, strokeColor, trackColor, scoreText, labelText = '') {
    ctx.save();

    // Background track ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = trackColor || 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // Glowing progress arc
    if (progress > 0) {
      const clampedProgress = Math.min(1, Math.max(0, progress));
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + clampedProgress * 2 * Math.PI;

      ctx.save();
      ctx.shadowColor = strokeColor || '#F3CD50';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.strokeStyle = strokeColor || '#F3CD50';
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();
    }

    // Centered score text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${Math.round(radius * 0.62)}px 'Cinzel', serif`;
    ctx.fillStyle = strokeColor || '#F3CD50';
    ctx.fillText(scoreText, cx, cy);

    // Optional label underneath
    if (labelText) {
      ctx.font = `bold ${Math.round(radius * 0.24)}px 'Cutive Mono', monospace`;
      ctx.fillStyle = '#CBD5E1';
      ctx.fillText(labelText, cx, cy + radius + lineWidth + 14);
    }

    ctx.restore();
  },

  // Helper to wrap text cleanly
  wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 10, align = 'left') {
    if (!text) return y;
    ctx.save();
    ctx.textAlign = align;
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    let linesCount = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
        linesCount++;
        if (linesCount >= maxLines - 1 && n < words.length - 1) {
          line += '...';
          break;
        }
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
    ctx.restore();
    return currentY + lineHeight;
  },

  // Helper to get character accent colors
  getCharColors(charName = '') {
    const name = (charName || '').toLowerCase();
    if (name.includes('jen')) {
      return {
        accent: '#00D2FF',
        glow: 'rgba(0, 210, 255, 0.45)',
        bgGlow: 'rgba(0, 210, 255, 0.18)',
        role: 'Fact Checker'
      };
    }
    if (name.includes('aidan')) {
      return {
        accent: '#10B981',
        glow: 'rgba(16, 185, 129, 0.45)',
        bgGlow: 'rgba(16, 185, 129, 0.18)',
        role: 'Source Detective'
      };
    }
    if (name.includes('lizzy')) {
      return {
        accent: '#EC4899',
        glow: 'rgba(236, 72, 153, 0.45)',
        bgGlow: 'rgba(236, 72, 153, 0.18)',
        role: 'Data Decoder'
      };
    }
    // Default Miller
    return {
      accent: '#F3CD50',
      glow: 'rgba(243, 205, 80, 0.45)',
      bgGlow: 'rgba(243, 205, 80, 0.18)',
      role: 'Clue Hunter'
    };
  },

  // Generate 1:1 Square PNG (1080 x 1080)
  async generateSquareImage(data) {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    const charColors = this.getCharColors(data.charName);
    const charImg = await this.loadImage(data.charAvatar || 'assets/images/characters/stills/Miller.png');
    const logoImg = await this.loadImage('assets/images/icons/favicon.svg');

    // 1. Deep Space Cosmic Background
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1080);
    bgGrad.addColorStop(0, '#0E0C16');
    bgGrad.addColorStop(0.5, '#1B132A');
    bgGrad.addColorStop(1, '#0C0A14');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1080);

    // 2. Ambient Character Nebula Glow
    const radGlow = ctx.createRadialGradient(760, 560, 60, 760, 560, 540);
    radGlow.addColorStop(0, charColors.glow);
    radGlow.addColorStop(0.6, charColors.bgGlow);
    radGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = radGlow;
    ctx.fillRect(0, 0, 1080, 1080);

    // 3. Subtle Outer Golden Border Frame
    this.drawRoundRect(ctx, 28, 28, 1024, 1024, 28, null, 'rgba(243, 205, 80, 0.4)', 2);
    this.drawRoundRect(ctx, 38, 38, 1004, 1004, 20, null, 'rgba(255, 255, 255, 0.08)', 1);

    // 4. Header Branding (Left) - Clearly separated from player badges
    if (logoImg) {
      ctx.drawImage(logoImg, 56, 54, 52, 52);
    }
    ctx.font = "bold 38px 'Cinzel', serif";
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Mille', 118, 92);
    ctx.fillStyle = '#F3CD50';
    ctx.fillText('Race', 228, 92);

    ctx.font = "bold 16px 'Cutive Mono', monospace";
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('UNESCO YOUTH HACKATHON 2026', 56, 134);

    // 5. Rank & Nickname Badge (Top Right) - No overlap with branding!
    const rankText = `🏆 RANK #${data.playerRank}`;
    const nickText = `👤 ${data.nickname || 'Racer'}`;

    this.drawRoundRect(ctx, 620, 50, 180, 64, 18, 'rgba(22, 18, 32, 0.9)', 'rgba(243, 205, 80, 0.7)', 1.5);
    ctx.font = "bold 24px 'Cinzel', serif";
    ctx.fillStyle = '#F3CD50';
    ctx.textAlign = 'center';
    ctx.fillText(rankText, 710, 91);

    this.drawRoundRect(ctx, 815, 50, 205, 64, 18, 'rgba(22, 18, 32, 0.9)', 'rgba(255, 255, 255, 0.25)', 1.5);
    ctx.font = "bold 22px 'Bona Nova', Georgia, serif";
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(nickText, 917, 91);
    ctx.textAlign = 'left';

    // 6. Left Column Main Card
    const cardX = 52;
    const cardY = 158;
    const cardW = 560;
    const cardH = 872;
    const cardRadius = 24;

    // Card background
    this.drawRoundRect(ctx, cardX, cardY, cardW, cardH, cardRadius, 'rgba(24, 18, 36, 0.92)', 'rgba(255, 255, 255, 0.16)', 1.5);

    // Top Accent strip (clipped inside card to prevent any side leakage)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cardX + cardRadius, cardY);
    ctx.lineTo(cardX + cardW - cardRadius, cardY);
    ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + cardRadius);
    ctx.lineTo(cardX + cardW, cardY + cardH - cardRadius);
    ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - cardRadius, cardY + cardH);
    ctx.lineTo(cardX + cardRadius, cardY + cardH);
    ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - cardRadius);
    ctx.lineTo(cardX, cardY + cardRadius);
    ctx.quadraticCurveTo(cardX, cardY, cardX + cardRadius, cardY);
    ctx.closePath();
    ctx.clip();

    ctx.fillStyle = charColors.accent;
    ctx.fillRect(cardX, cardY, cardW, 8);
    ctx.restore();

    // Character Title Banner
    this.drawRoundRect(ctx, cardX + 28, cardY + 28, cardW - 56, 56, 16, charColors.accent);
    ctx.font = "bold 28px 'Cinzel', serif";
    ctx.fillStyle = '#16141C';
    ctx.textAlign = 'center';
    ctx.fillText(`YOU ARE ${data.charName.toUpperCase()}!`, cardX + cardW / 2, cardY + 66);

    // Role Subtitle
    ctx.font = "bold 18px 'Cutive Mono', monospace";
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillText(charColors.role.toUpperCase(), cardX + cardW / 2, cardY + 116);
    ctx.textAlign = 'left';

    // 7. MIL Score Circular Progress & All 4 Stage Indicators Container
    const scoreBoxX = cardX + 28;
    const scoreBoxY = cardY + 136;
    const scoreBoxW = cardW - 56;
    const scoreBoxH = 224;

    this.drawRoundRect(ctx, scoreBoxX, scoreBoxY, scoreBoxW, scoreBoxH, 20, 'rgba(16, 12, 24, 0.92)', 'rgba(243, 205, 80, 0.45)', 1.5);

    // Circular MIL Score Ring (Left side of score box)
    const scoreCircleX = scoreBoxX + 96;
    const scoreCircleY = scoreBoxY + 98;
    const scoreCircleR = 56;
    const scoreCircleLineW = 12;
    const progressVal = Number(data.totalScore || 0) / 100;

    this.drawCircleProgress(
      ctx,
      scoreCircleX,
      scoreCircleY,
      scoreCircleR,
      scoreCircleLineW,
      progressVal,
      '#F3CD50',
      'rgba(255, 255, 255, 0.15)',
      `${data.totalScore}%`,
      'MIL SCORE'
    );

    // All 4 Stage Indicators (Right side of score box)
    const s1 = data.stageScores?.[1] ?? 0;
    const s2 = data.stageScores?.[2] ?? 0;
    const s3 = data.stageScores?.[3] ?? 0;
    const s4 = data.stageScores?.[4] ?? 0;

    const stagesList = [
      { name: '1. Visual AIAS', score: `${s1}/20`, color: '#F3CD50' },
      { name: '2. Literature', score: `${s2}/40`, color: '#00D2FF' },
      { name: '3. Text AIAS', score: `${s3}/20`, color: '#10B981' },
      { name: '4. Inference', score: `${s4}/20`, color: '#EC4899' }
    ];

    const stagePillX = scoreBoxX + 205;
    const stagePillW = scoreBoxW - 225;
    const stagePillH = 38;
    let stageCurrentY = scoreBoxY + 22;

    stagesList.forEach((st) => {
      this.drawRoundRect(ctx, stagePillX, stageCurrentY, stagePillW, stagePillH, 10, 'rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.12)', 1);
      ctx.font = "bold 15px 'Cutive Mono', monospace";
      ctx.fillStyle = '#E2E8F0';
      ctx.fillText(st.name, stagePillX + 12, stageCurrentY + 24);

      ctx.font = "bold 16px 'Cinzel', serif";
      ctx.fillStyle = st.color;
      ctx.textAlign = 'right';
      ctx.fillText(st.score, stagePillX + stagePillW - 12, stageCurrentY + 25);
      ctx.textAlign = 'left';

      stageCurrentY += 46;
    });

    // 8. Reading Levels Pills (2x font size)
    const pillY = cardY + 382;
    const pill1W = 240;
    const pill2W = cardW - 56 - pill1W - 16;

    this.drawRoundRect(ctx, cardX + 28, pillY, pill1W, 46, 16, 'rgba(0, 210, 255, 0.18)', '#00D2FF', 1.5);
    ctx.font = "bold 17px 'Bona Nova', Georgia, serif";
    ctx.fillStyle = '#E0F2FE';
    ctx.fillText(data.pisaLevel || 'PISA Reading Level 1-2', cardX + 44, pillY + 29);

    this.drawRoundRect(ctx, cardX + 28 + pill1W + 16, pillY, pill2W, 46, 16, 'rgba(192, 132, 252, 0.22)', '#C084FC', 1.5);
    ctx.fillStyle = '#F3E8FF';
    ctx.fillText(data.cefrLevel || 'Cambridge Reading A1-A2', cardX + 28 + pill1W + 30, pillY + 29);

    // 9. Quote Block (2x font size)
    ctx.font = "italic 21px 'Bona Nova', Georgia, serif";
    ctx.fillStyle = '#FFFFFF';
    const quoteY = pillY + 74;
    const nextY = this.wrapText(
      ctx,
      `“${data.quote || 'Think critically and question the digital maze!'}”`,
      cardX + 32,
      quoteY,
      cardW - 64,
      30,
      4
    );

    // 10. Bio Text
    ctx.font = "18px 'Bona Nova', Georgia, serif";
    ctx.fillStyle = '#CBD5E1';
    this.wrapText(
      ctx,
      data.bio || 'Curious and ready for new chapters! Continue reading and analyzing facts.',
      cardX + 32,
      Math.max(nextY + 12, cardY + 540),
      cardW - 64,
      26,
      6
    );

    // 11. Footer Watermark
    ctx.font = "bold 18px 'Cinzel', serif";
    ctx.fillStyle = '#F3CD50';
    ctx.fillText('ESCAPE THE MAZE AI WOVE FOR YOU', cardX + 32, cardY + 805);

    ctx.font = "bold 17px 'Cutive Mono', monospace";
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('https://millerace.vercel.app', cardX + 32, cardY + 838);

    // 12. Right Column Character Image (Anchored and properly scaled)
    if (charImg) {
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 24;
      const targetHeight = 840;
      const aspect = charImg.width / charImg.height;
      const targetWidth = targetHeight * aspect;
      ctx.drawImage(charImg, 1030 - targetWidth + 110, 1030 - targetHeight, targetWidth, targetHeight);
      ctx.restore();
    }

    return canvas;
  },

  // Generate 9:16 Story PNG (1080 x 1920)
  async generateStoryImage(data) {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    const charColors = this.getCharColors(data.charName);
    const charImg = await this.loadImage(data.charAvatar || 'assets/images/characters/stills/Miller.png');
    const logoImg = await this.loadImage('assets/images/icons/favicon.svg');

    // 1. Deep Space Vertical Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
    bgGrad.addColorStop(0, '#0C0914');
    bgGrad.addColorStop(0.35, '#22143C');
    bgGrad.addColorStop(0.7, '#170F28');
    bgGrad.addColorStop(1, '#0B0912');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // 2. Character Aura Radial Glows
    const topGlow = ctx.createRadialGradient(540, 580, 60, 540, 580, 520);
    topGlow.addColorStop(0, charColors.glow);
    topGlow.addColorStop(0.7, charColors.bgGlow);
    topGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = topGlow;
    ctx.fillRect(0, 0, 1080, 1920);

    // 3. Double Outer Border
    this.drawRoundRect(ctx, 36, 36, 1008, 1848, 36, null, 'rgba(243, 205, 80, 0.45)', 2);
    this.drawRoundRect(ctx, 48, 48, 984, 1824, 28, null, 'rgba(255, 255, 255, 0.08)', 1);

    // 4. Header Area (Top) - Sized with 2x fonts
    if (logoImg) {
      ctx.drawImage(logoImg, 540 - 32, 65, 64, 64);
    }

    ctx.font = "bold 56px 'Cinzel', serif";
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('Mille', 460, 172);
    ctx.fillStyle = '#F3CD50';
    ctx.fillText('Race', 625, 172);

    ctx.font = "bold 22px 'Cutive Mono', monospace";
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fillText('UNESCO YOUTH HACKATHON 2026', 540, 212);

    // Rank & Name Pill (2x font)
    this.drawRoundRect(ctx, 540 - 340, 236, 680, 64, 32, 'rgba(22, 18, 32, 0.92)', 'rgba(243, 205, 80, 0.75)', 1.5);
    ctx.font = "bold 28px 'Cinzel', serif";
    ctx.fillStyle = '#F3CD50';
    ctx.fillText(`🏆 GLOBAL RANK #${data.playerRank}`, 410, 277);
    ctx.font = "bold 26px 'Bona Nova', Georgia, serif";
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`  •  ${data.nickname || 'Racer'}`, 635, 277);

    // 5. Center Arched Door & Proportional Character Image (y: 320 - 790)
    const doorX = 540 - 220;
    const doorY = 320;
    const doorW = 440;
    const doorH = 470;

    // Arched Portal Backdrop
    this.drawRoundRect(
      ctx,
      doorX,
      doorY,
      doorW,
      doorH,
      { tl: 220, tr: 220, br: 28, bl: 28 },
      'rgba(26, 20, 38, 0.88)',
      charColors.accent,
      2.5
    );

    // Proportional Character Portrait inside portal (resized from 800px down to 500px)
    if (charImg) {
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 35;
      ctx.shadowOffsetY = 20;
      const targetH = 500;
      const aspect = charImg.width / charImg.height;
      const targetW = targetH * aspect;
      ctx.drawImage(charImg, 540 - targetW / 2, doorY + doorH - targetH + 20, targetW, targetH);
      ctx.restore();
    }

    // Character Gold Banner Overlay
    const bannerY = 808;
    this.drawRoundRect(ctx, 540 - 330, bannerY, 660, 72, 20, charColors.accent, '#FFFFFF', 1.5);
    ctx.font = "bold 38px 'Cinzel', serif";
    ctx.fillStyle = '#16141C';
    ctx.fillText(`YOU ARE ${data.charName.toUpperCase()}!`, 540, bannerY + 49);

    // Role Subtitle (2x font)
    ctx.font = "bold 24px 'Cutive Mono', monospace";
    ctx.fillStyle = '#E2E8F0';
    ctx.fillText(charColors.role.toUpperCase(), 540, bannerY + 115);

    // 6. Score & Metrics Showcase Box (y: 955 - 1565)
    const scoreBoxY = 955;
    const scoreBoxH = 610;
    const scoreBoxX = 70;
    const scoreBoxRadius = 32;
    const scoreBoxW = 940;
    this.drawRoundRect(ctx, scoreBoxX, scoreBoxY, scoreBoxW, scoreBoxH, scoreBoxRadius, 'rgba(28, 22, 44, 0.92)', 'rgba(255, 255, 255, 0.16)', 1.5);

    // Top Accent strip (clipped inside card to prevent any side leakage)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(scoreBoxX + scoreBoxRadius, scoreBoxY);
    ctx.lineTo(scoreBoxX + scoreBoxW - scoreBoxRadius, scoreBoxY);
    ctx.quadraticCurveTo(scoreBoxX + scoreBoxW, scoreBoxY, scoreBoxX + scoreBoxW, scoreBoxY + scoreBoxRadius);
    ctx.lineTo(scoreBoxX + scoreBoxW, scoreBoxY + scoreBoxH - scoreBoxRadius);
    ctx.quadraticCurveTo(scoreBoxX + scoreBoxW, scoreBoxY + scoreBoxH, scoreBoxX + scoreBoxW - scoreBoxRadius, scoreBoxY + scoreBoxH);
    ctx.lineTo(scoreBoxX + scoreBoxRadius, scoreBoxY + scoreBoxH);
    ctx.quadraticCurveTo(scoreBoxX, scoreBoxY + scoreBoxH, scoreBoxX, scoreBoxY + scoreBoxH - scoreBoxRadius);
    ctx.lineTo(scoreBoxX, scoreBoxY + scoreBoxRadius);
    ctx.quadraticCurveTo(scoreBoxX, scoreBoxY, scoreBoxX + scoreBoxRadius, scoreBoxY);
    ctx.closePath();
    ctx.clip();

    ctx.fillStyle = charColors.accent;
    ctx.fillRect(scoreBoxX, scoreBoxY, scoreBoxW, 12);
    ctx.restore();

    // // Top Accent line
    // this.drawRoundRect(ctx, 70, scoreBoxY + 20, 940, 8, { tl: 32, tr: 32, br: 0, bl: 0 }, '#F3CD50');

    ctx.font = "bold 28px 'Cinzel', serif";
    ctx.fillStyle = '#E2E8F0';
    ctx.fillText('MEDIA & INFORMATION LITERACY SCORE', 540, scoreBoxY + 48);

    // Circular MIL Score Gauge (Center of showcase box)
    const scoreGaugeY = scoreBoxY + 160;
    this.drawCircleProgress(
      ctx,
      540,
      scoreGaugeY,
      76,
      16,
      Number(data.totalScore || 0) / 100,
      '#F3CD50',
      'rgba(255, 255, 255, 0.15)',
      `${data.totalScore}%`
    );

    // All 4 Stage Scores in 2x2 Grid (2x font size)
    const s1 = data.stageScores?.[1] ?? 0;
    const s2 = data.stageScores?.[2] ?? 0;
    const s3 = data.stageScores?.[3] ?? 0;
    const s4 = data.stageScores?.[4] ?? 0;

    const gridY = scoreBoxY + 270;
    const cellW = 425;
    const cellH = 50;

    const gridItems = [
      { label: '1. Visual AIAS', score: `${s1}/20`, color: '#F3CD50', x: 105, y: gridY },
      { label: '2. Literature', score: `${s2}/40`, color: '#00D2FF', x: 550, y: gridY },
      { label: '3. Text AIAS', score: `${s3}/20`, color: '#10B981', x: 105, y: gridY + 60 },
      { label: '4. Critical Inference', score: `${s4}/20`, color: '#EC4899', x: 550, y: gridY + 60 }
    ];

    gridItems.forEach((item) => {
      this.drawRoundRect(ctx, item.x, item.y, cellW, cellH, 12, 'rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.12)', 1);
      ctx.font = "bold 22px 'Cutive Mono', monospace";
      ctx.fillStyle = '#E2E8F0';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, item.x + 16, item.y + 32);

      ctx.font = "bold 22px 'Cinzel', serif";
      ctx.fillStyle = item.color;
      ctx.textAlign = 'right';
      ctx.fillText(item.score, item.x + cellW - 16, item.y + 33);
    });

    // PISA & CEFR Reading Level Pills (2x font size)
    const storyPillY = gridY + 140;
    this.drawRoundRect(ctx, 105, storyPillY, cellW, 54, 18, 'rgba(0, 210, 255, 0.18)', '#00D2FF', 1.5);
    ctx.font = "bold 22px 'Bona Nova', serif";
    ctx.fillStyle = '#E0F2FE';
    ctx.textAlign = 'center';
    ctx.fillText(data.pisaLevel || 'PISA Reading Level 1-2', 105 + cellW / 2, storyPillY + 34);

    this.drawRoundRect(ctx, 550, storyPillY, cellW, 54, 18, 'rgba(192, 132, 252, 0.22)', '#C084FC', 1.5);
    ctx.fillStyle = '#F3E8FF';
    ctx.fillText(data.cefrLevel || 'Cambridge Reading A1-A2', 550 + cellW / 2, storyPillY + 34);

    // Quote in box (2x font size)
    ctx.font = "italic 26px 'Bona Nova', Georgia, serif";
    ctx.fillStyle = '#FFFFFF';
    this.wrapText(
      ctx,
      `“${data.quote || 'Think critically and question the digital maze!'}”`,
      540,
      storyPillY + 110,
      860,
      36,
      3,
      'center'
    );

    // 7. Bottom CTA & URL (y: 1590 - 1880)
    const ctaY = 1590;
    this.drawRoundRect(ctx, 70, ctaY, 940, 255, 28, 'rgba(20, 16, 28, 0.88)', 'rgba(243, 205, 80, 0.5)', 1.5);

    ctx.font = "bold 34px 'Cinzel', serif";
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('CAN YOU OUTREAD THE MACHINE?', 540, ctaY + 54);

    this.drawRoundRect(ctx, 540 - 280, ctaY + 82, 560, 68, 34, '#F3CD50');
    ctx.font = "bold 26px 'Cinzel', serif";
    ctx.fillStyle = '#16141C';
    ctx.fillText('PLAY NOW AT MILLERACE ➔', 540, ctaY + 124);

    ctx.font = "bold 24px 'Cutive Mono', monospace";
    ctx.fillStyle = '#F3CD50';
    ctx.fillText('https://millerace.vercel.app', 540, ctaY + 192);

    ctx.font = "18px 'Cutive Mono', monospace";
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('Mulawarman University • East Kalimantan, Indonesia', 540, ctaY + 230);

    return canvas;
  },

  // Trigger download helper
  downloadCanvasAsPNG(canvas, filename) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          resolve(true);
        }, 150);
      }, 'image/png');
    });
  },

  // Main entrypoint: Generates both 1:1 and 9:16 screenshots and triggers downloads
  async generateAndDownload(customData = {}) {
    const totalScore = typeof customData.totalScore === 'number'
      ? customData.totalScore
      : (typeof GameState !== 'undefined' ? GameState.getTotalScore() : 0);

    const charMatch = customData.charMatch || (typeof GameState !== 'undefined' ? GameState.getMatchedCharacter() : null);
    const charName = customData.charName || (charMatch ? charMatch.name : 'Miller');

    let playerRank = customData.playerRank || '1';
    if (typeof UI !== 'undefined' && typeof UI.getLeaderboardData === 'function') {
      const allEntries = UI.getLeaderboardData('all');
      if (allEntries && allEntries.length > 0) {
        const nickname = customData.nickname || (typeof GameState !== 'undefined' ? GameState.player.nickname : 'Racer');
        const found = allEntries.find(e => e.name === nickname && Number(e.score) === totalScore);
        if (found) {
          playerRank = String(found.rank);
        }
      }
    }

    const payload = {
      nickname: customData.nickname || (typeof GameState !== 'undefined' ? GameState.player.nickname : 'Racer'),
      playerRank: String(playerRank).startsWith('#') ? String(playerRank).replace('#', '') : String(playerRank),
      totalScore: totalScore,
      charName: charName,
      charAvatar: customData.charAvatar || (charMatch ? charMatch.avatar : 'assets/images/characters/stills/Miller.png'),
      pisaLevel: customData.pisaLevel || (charMatch ? charMatch.pisaLevel : 'PISA Reading Level 1-2'),
      cefrLevel: customData.cefrLevel || (charMatch ? charMatch.cefrLevel : 'Cambridge Reading A1-A2'),
      quote: customData.quote || (charMatch ? charMatch.quote : ''),
      bio: customData.bio || (charMatch ? charMatch.bio : ''),
      stageScores: customData.stageScores || (typeof GameState !== 'undefined' ? GameState.stageScores : { 1: 0, 2: 0, 3: 0, 4: 0 })
    };

    const sanitizedChar = charName.replace(/[^a-zA-Z0-9]/g, '');

    // 1. Generate & download 1:1 Square Card
    const squareCanvas = await this.generateSquareImage(payload);
    await this.downloadCanvasAsPNG(squareCanvas, `MilleRace_Result_${sanitizedChar}_1x1.png`);

    // 2. Generate & download 9:16 Story Card
    const storyCanvas = await this.generateStoryImage(payload);
    await this.downloadCanvasAsPNG(storyCanvas, `MilleRace_Result_${sanitizedChar}_9x16.png`);

    return {
      success: true,
      squareCanvas,
      storyCanvas
    };
  }
};

if (typeof window !== 'undefined') {
  window.ShareCardGenerator = ShareCardGenerator;
}
