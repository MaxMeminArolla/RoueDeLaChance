type Prize = {
  name: string;
  quantity?: number;
  probability: number;
  color?: string;
};

const AROLLA_PALETTE = [
  "#0b3d91", "#1d9dd3", "#f2a400", "#e94b35", "#6ab04c", "#8e44ad"
];

async function fetchPrizes(): Promise<Prize[]> {
  const res = await fetch("/prizes");
  if (!res.ok) throw new Error(`Failed to fetch prizes: ${res.status}`);
  const arr = await res.json();
  return (arr || []).map((p: any, i: number) => ({
    name: (p.name ?? p.Name ?? `Lot ${i + 1}`) as string,
    probability: Number(p.probability ?? p.Probability ?? 0),
    quantity: Number(p.quantity ?? p.Quantity ?? 0),
    color: p.color ?? AROLLA_PALETTE[i % AROLLA_PALETTE.length]
  }));
}

interface SliceMeta {
  startDeg: number;
  sweepDeg: number;
  prize: Prize;
}

const canvas = document.getElementById("wheel") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const spinBtn = document.getElementById("spinBtn") as HTMLButtonElement;
const resultDiv = document.getElementById("result")!;
let slices: SliceMeta[] = [];
let currentRotation = 0;

function degToRad(d: number): number {
  return (d * Math.PI) / 180;
}

function drawWheel(prizes: Prize[]): void {
  const total = prizes.reduce((s, p) => s + (p.probability || 0), 0) || prizes.length;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = Math.min(cx, cy) - 4;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let start = 0;
  slices = [];

  for (let i = 0; i < prizes.length; i++) {
    const p = prizes[i];
    const sweep = ((p.probability || 0) / total) * 360 || 360 / prizes.length;
    const startDeg = start;
    const endDeg = start + sweep;

    // Draw arc
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.fillStyle = p.color ?? AROLLA_PALETTE[i % AROLLA_PALETTE.length];
    ctx.arc(cx, cy, r, degToRad(startDeg), degToRad(endDeg));
    ctx.closePath();
    ctx.fill();

    // Draw border
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw label
    const mid = degToRad(startDeg + sweep / 2);
    ctx.save();
    ctx.translate(cx + Math.cos(mid) * r * 0.6, cy + Math.sin(mid) * r * 0.6);
    ctx.rotate(mid);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    wrapText(ctx, p.name, 0, 0, 110, 14);
    ctx.restore();

    slices.push({ startDeg, sweepDeg: sweep, prize: p });
    start += sweep;
  }
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): void {
  const words = text.split(" ");
  let line = "";
  let lineY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = context.measureText(testLine);

    if (metrics.width > maxWidth && n > 0) {
      context.fillText(line, x, lineY);
      line = words[n] + " ";
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  }

  context.fillText(line, x, lineY);
}

function findSliceByName(prizeName: string): SliceMeta | undefined {
  return slices.find((s) => s.prize.name.toLowerCase() === prizeName.toLowerCase());
}

function computeRotationForSlice(s: SliceMeta): number {
  const centerOfSlice = s.startDeg + s.sweepDeg / 2;
  const randomOffset = (Math.random() - 0.5) * Math.min(6, s.sweepDeg);
  const targetAngle = centerOfSlice + randomOffset;
  const fullRotations = 5;
  return fullRotations * 360 + (360 - targetAngle);
}

async function doSpin(): Promise<void> {
  spinBtn.disabled = true;
  resultDiv.textContent = "Tirage en cours...";

  try {
    const res = await fetch("/spin", { method: "POST" });
    if (!res.ok) throw new Error(`Spin failed: ${res.status}`);

    const json = await res.json();
    const isWin = json.isWin ?? json.IsWin ?? (json.prizeName ?? json.PrizeName ? true : false);
    const prizeName = String(json.prizeName ?? json.PrizeName ?? json.prize ?? "");

    const slice = findSliceByName(prizeName);
    let rotationTarget = 360 * 5 + Math.random() * 360;

    if (slice) {
      rotationTarget = computeRotationForSlice(slice);
    } else if (json.angle ?? json.Angle) {
      const serverAngle = Number(json.angle ?? json.Angle);
      rotationTarget = 360 * 5 + serverAngle;
    }

    currentRotation = (currentRotation + rotationTarget) % 360000;
    canvas.style.transition = "transform 5s cubic-bezier(.17,.67,.83,.67)";
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    const onEnd = () => {
      canvas.removeEventListener("transitionend", onEnd);
      const displayName = prizeName || (isWin ? "Gagné" : "Perdu");
      resultDiv.textContent = isWin
        ? `🎉 Vous avez gagné : ${displayName}`
        : `❌ Résultat : ${displayName}`;
      spinBtn.disabled = false;
      loadAndDraw();
    };

    canvas.addEventListener("transitionend", onEnd, { once: true });
  } catch (err) {
    resultDiv.textContent = "❌ Erreur lors du tirage.";
    spinBtn.disabled = false;
    console.error(err);
  }
}

async function loadAndDraw(): Promise<void> {
  try {
    const prizes = await fetchPrizes();
    drawWheel(prizes);
  } catch (err) {
    resultDiv.textContent = "❌ Erreur lors du chargement.";
    console.error(err);
  }
}

spinBtn.addEventListener("click", () => {
  doSpin();
});

loadAndDraw();
