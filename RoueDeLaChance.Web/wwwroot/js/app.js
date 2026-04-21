import { lastCommitDate } from "./version.js";
const AROLLA_PALETTE = [
    "#0b3d91", "#1d9dd3", "#f2a400", "#e94b35", "#6ab04c", "#8e44ad"
];
async function fetchPrizes() {
    const res = await fetch("/prizes");
    if (!res.ok)
        throw new Error(`Problème lors de la récupération des lots: ${res.status}`);
    const arr = await res.json();
    const prizes = (arr || []).map((p, i) => {
        var _a, _b, _c, _d, _e;
        return ({
            name: ((_b = (_a = p.name) !== null && _a !== void 0 ? _a : p.Name) !== null && _b !== void 0 ? _b : `Lot ${i + 1}`),
            probability: Number((_d = (_c = p.probability) !== null && _c !== void 0 ? _c : p.Probability) !== null && _d !== void 0 ? _d : 0),
            color: (_e = p.color) !== null && _e !== void 0 ? _e : AROLLA_PALETTE[i % AROLLA_PALETTE.length]
        });
    });
    // Validation de la somme des probabilités
    const total = prizes.reduce((sum, p) => sum + p.probability, 0);
    if (Math.abs(total - 1) > 0.0001) {
        showToast(`Attention: La somme des probabilités est de ${total.toFixed(4)} au lieu de 1.0000`, 'error');
    }
    return prizes;
}
function showToast(message, type = 'success') {
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
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const resultDiv = document.getElementById("result");
const footer = document.getElementById("footer");
let slices = [];
let currentRotation = 0;
let cachedPrizes = [];
function degToRad(d) {
    return (d * Math.PI) / 180;
}
function resizeCanvas() {
    const container = canvas.parentElement;
    if (!container)
        return;
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
function drawWheel(prizes) {
    var _a;
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
        ctx.fillStyle = (_a = p.color) !== null && _a !== void 0 ? _a : AROLLA_PALETTE[i % AROLLA_PALETTE.length];
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
function wrapText(context, text, x, y, maxWidth, lineHeight) {
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
        }
        else {
            line = testLine;
        }
    }
    context.strokeText(line, x, lineY);
    context.fillText(line, x, lineY);
}
function findSliceByName(prizeName) {
    return slices.find((s) => s.prize.name.toLowerCase() === prizeName.toLowerCase());
}
function computeRotationForSlice(s, startFrom) {
    const centerOfSlice = s.startDeg + s.sweepDeg / 2;
    const pointerAngle = 270;
    const currentMod = startFrom % 360;
    const desiredMod = ((pointerAngle - centerOfSlice) % 360 + 360) % 360;
    const diff = (desiredMod - currentMod + 360) % 360;
    return startFrom + (5 * 360) + diff;
}
async function loadHistory() {
    try {
        const res = await fetch("/history");
        if (!res.ok)
            return;
        const entries = await res.json();
        const historyList = document.getElementById("history-list");
        if (!historyList)
            return;
        historyList.innerHTML = "";
        for (const entry of entries) {
            const li = document.createElement("li");
            const icon = entry.isWin ? "🎉" : "❌";
            li.textContent = `${entry.spunAt} — ${icon} ${entry.prizeName}`;
            historyList.appendChild(li);
        }
    }
    catch (err) {
        console.error("Erreur chargement historique:", err);
    }
}
async function doSpin() {
    var _a, _b, _c, _d, _e, _f;
    if (spinBtn.disabled)
        return;
    spinBtn.disabled = true;
    resultDiv.textContent = "Tirage en cours...";
    try {
        const res = await fetch("/spin", { method: "POST" });
        if (!res.ok)
            throw new Error(`Spin failed: ${res.status}`);
        const json = await res.json();
        const isWin = (_b = (_a = json.isWin) !== null && _a !== void 0 ? _a : json.IsWin) !== null && _b !== void 0 ? _b : (((_c = json.prizeName) !== null && _c !== void 0 ? _c : json.PrizeName) ? true : false);
        const prizeName = String((_f = (_e = (_d = json.prizeName) !== null && _d !== void 0 ? _d : json.PrizeName) !== null && _e !== void 0 ? _e : json.prize) !== null && _f !== void 0 ? _f : "");
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
    }
    catch (err) {
        resultDiv.textContent = "❌ Erreur lors du tirage.";
        spinBtn.disabled = false;
        console.error(err);
    }
}
async function loadHistory() {
    try {
        const res = await fetch("/history");
        if (!res.ok)
            return;
        const entries = await res.json();
        const historyList = document.getElementById("history-list");
        if (!historyList)
            return;
        historyList.innerHTML = "";
        for (const entry of entries) {
            const li = document.createElement("li");
            const icon = entry.isWin ? "🎉" : "❌";
            li.textContent = `${entry.spunAt} — ${icon} ${entry.prizeName}`;
            historyList.appendChild(li);
        }
    }
    catch (err) {
        console.error("Erreur chargement historique:", err);
    }
}
async function loadAndDraw() {
    try {
        if (footer)
            footer.textContent = `dernier commit: ${lastCommitDate}`;
        const prizes = await fetchPrizes();
        resizeCanvas();
        drawWheel(prizes);
        await loadHistory();
    }
    catch (err) {
        resultDiv.textContent = "❌ Erreur lors du chargement.";
        console.error(err);
    }
}
// Event Listeners
window.addEventListener("resize", resizeCanvas);
spinBtn.addEventListener("click", doSpin);
loadAndDraw();
