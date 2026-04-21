import { lastCommitDate } from "./version.js";

type Prize = {
  name: string;
  probability: number;
  color?: string;
};

const AROLLA_PALETTE = [
  "#0b3d91", "#1d9dd3", "#f2a400", "#e94b35", "#6ab04c", "#8e44ad"
];

async function fetchPrizes(): Promise<Prize[]> {
  const res = await fetch("/prizes");
  if (!res.ok) throw new Error(`Problème lors de la récupération des lots: ${res.status}`);
  const arr = await res.json();
  const prizes = (arr || []).map((p: any, i: number) => ({
    name: (p.name ?? p.Name ?? `Lot ${i + 1}`) as string,
    probability: Number(p.probability ?? p.Probability ?? 0),
    color: p.color ?? AROLLA_PALETTE[i % AROLLA_PALETTE.length]
  }));

  // Validation de la somme des probabilités
  const total = prizes.reduce((sum: number, p: Prize) => sum + p.probability, 0);
  if (Math.abs(total - 1) > 0.00001) {
    console.log(`Attention: La somme des probabilités est de ${total.toFixed(4)} au lieu de 1.0000`, prizes);
    showToast(`Attention: La somme des probabilités est de ${total.toFixed(4)} au lieu de 1.0000`, 'error');
  }
  console.log("Tout va bien...sur Prizes", prizes);
  return prizes;
}

function showToast(message: string, type: 'error' | 'success' = 'success'): void {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icon = document.createElement('span');
  icon.textContent = type === 'error' ? '⚠️' : '✅';

  const text = document.createElement('span');
  text.textContent = message;

  toast.appendChild(icon);
  toast.appendChild(text);
  container.appendChild(toast);

  // Auto-suppression après 5 secondes
  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 5000);
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
const footer = document.getElementById("footer")!;
let slices: SliceMeta[] = [];
let currentRotation = 0;
let cachedPrizes: Prize[] = [];

function degToRad(d: number): number {
  return (d * Math.PI) / 180;
}

function resizeCanvas(): void {
  const container = canvas.parentElement;
  if (!container) return;

  // On prend la taille réelle affichée. Si c'est trop petit (ex: 0 au chargement), on met un minimum.
  const displaySize = Math.max(container.clientWidth, 300);

  if (canvas.width !== displaySize || canvas.height !== displaySize) {
    canvas.width = displaySize;
    canvas.height = displaySize;

    if (cachedPrizes.length > 0) {
      drawWheel(cachedPrizes);
      // Maintenir la rotation actuelle
      canvas.style.transition = "none";
      canvas.style.transform = `rotate(${currentRotation}deg)`;
    }
  }
}

function drawWheel(prizes: Prize[]): void {
  cachedPrizes = prizes;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = Math.min(cx, cy) - 10;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let start = 0;
  slices = [];

  for (let i = 0; i < prizes.length; i++) {
    const p = prizes[i];
    const sweep = 360 / prizes.length;
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
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw label
    const baseFontSize = canvas.width > 400 ? 14 : 11;
    const fontSize = sweep < 20 ? (sweep < 10 ? baseFontSize - 4 : baseFontSize - 2) : baseFontSize;
    ctx.font = `bold ${fontSize}px Arial`;
    const mid = degToRad(startDeg + sweep / 2);
    const labelR = sweep < 15 ? r * 0.85 : r * 0.72;

    ctx.save();
    ctx.translate(cx + Math.cos(mid) * labelR, cy + Math.sin(mid) * labelR);
    ctx.rotate(mid);
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#0B2617";
    ctx.lineWidth = 3;
    ctx.textAlign = "center";
    wrapText(ctx, p.name, 0, 0, r * 0.45, fontSize);
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
      context.strokeText(line, x, lineY);
      context.fillText(line, x, lineY);
      line = words[n] + " ";
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.strokeText(line, x, lineY);
  context.fillText(line, x, lineY);
}

function findSliceByName(prizeName: string): SliceMeta | undefined {
  return slices.find((s) => s.prize.name.toLowerCase() === prizeName.toLowerCase());
}

function computeRotationForSlice(s: SliceMeta, startFrom: number): number {
  const centerOfSlice = s.startDeg + s.sweepDeg / 2;
  const pointerAngle = 270;
  const currentMod = startFrom % 360;
  const desiredMod = ((pointerAngle - centerOfSlice) % 360 + 360) % 360;
  const diff = (desiredMod - currentMod + 360) % 360;
  return startFrom + (5 * 360) + diff;
}

async function loadHistory(): Promise<void> {
  try {
    const res = await fetch("/history");
    if (!res.ok) return;
    const entries: { prizeName: string; isWin: boolean; spunAt: string }[] = await res.json();

    const historyList = document.getElementById("history-list");
    if (!historyList) return;

    historyList.innerHTML = "";
    for (const entry of entries) {
      const li = document.createElement("li");
      const icon = entry.isWin ? "🎉" : "❌";
      li.textContent = `${entry.spunAt} — ${icon} ${entry.prizeName}`;
      historyList.appendChild(li);
    }
  } catch (err) {
    console.error("Erreur chargement historique:", err);
  }
}

async function doSpin(): Promise<void> {
  if (spinBtn.disabled) return;
  spinBtn.disabled = true;
  resultDiv.textContent = "Tirage en cours...";

  try {
    const res = await fetch("/spin", { method: "POST" });
    if (!res.ok) throw new Error(`Spin failed: ${res.status}`);

    const json = await res.json();
    const isWin = json.isWin ?? json.IsWin ?? (json.prizeName ?? json.PrizeName ? true : false);
    const prizeName = String(json.prizeName ?? json.PrizeName ?? json.prize ?? "");

    const slice = findSliceByName(prizeName);
    let rotationTarget = currentRotation + (360 * 5) + Math.random() * 360;

    if (slice) {
      rotationTarget = computeRotationForSlice(slice, currentRotation);
    }

    currentRotation = rotationTarget;
    canvas.style.transition = "transform 5s cubic-bezier(0.1, 0.9, 0, 1)";
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    const onEnd = async () => {
      canvas.removeEventListener("transitionend", onEnd);
      const displayName = prizeName ? prizeName : isWin ? "Gagné" : "Perdu";
      resultDiv.textContent = isWin
        ? `🎉 Vous avez gagné : ${displayName}`
        : `❌ Résultat : ${displayName}`;

      // Rafraîchit l'historique complet depuis le serveur (source de vérité partagée)
      await loadHistory();

      spinBtn.disabled = false;
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
    if (footer) footer.textContent = `dernier commit: ${lastCommitDate}`;
    const prizes = await fetchPrizes();
    resizeCanvas();
    drawWheel(prizes);
    await loadHistory();
  } catch (err) {
    resultDiv.textContent = "❌ Erreur lors du chargement.";
    console.error(err);
  }
}

// Event Listeners
window.addEventListener("resize", resizeCanvas);
spinBtn.addEventListener("click", doSpin);

loadAndDraw();
