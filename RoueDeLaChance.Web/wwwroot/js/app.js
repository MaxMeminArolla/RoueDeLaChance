"use strict";
const AROLLA_PALETTE = [
    "#0b3d91", "#1d9dd3", "#f2a400", "#e94b35", "#6ab04c", "#8e44ad"
];
async function fetchPrizes() {
    const res = await fetch("/prizes");
    if (!res.ok)
        throw new Error(`Failed to fetch prizes: ${res.status}`);
    const arr = await res.json();
    return (arr || []).map((p, i) => {
        var _a, _b, _c, _d, _e, _f, _g;
        return ({
            name: ((_b = (_a = p.name) !== null && _a !== void 0 ? _a : p.Name) !== null && _b !== void 0 ? _b : `Lot ${i + 1}`),
            probability: Number((_d = (_c = p.probability) !== null && _c !== void 0 ? _c : p.Probability) !== null && _d !== void 0 ? _d : 0),
            color: (_g = p.color) !== null && _g !== void 0 ? _g : AROLLA_PALETTE[i % AROLLA_PALETTE.length]
        });
    });
}
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const resultDiv = document.getElementById("result");
let slices = [];
let currentRotation = 0;
function degToRad(d) {
    return (d * Math.PI) / 180;
}
function drawWheel(prizes) {
    var _a;
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
        ctx.fillStyle = (_a = p.color) !== null && _a !== void 0 ? _a : AROLLA_PALETTE[i % AROLLA_PALETTE.length];
        ctx.arc(cx, cy, r, degToRad(startDeg), degToRad(endDeg));
        ctx.closePath();
        ctx.fill();
        // Draw border
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();
        // Draw label
        const fontSize = sweep < 20 ? (sweep < 10 ? 9 : 11) : 14;
        ctx.font = `bold ${fontSize}px Arial`;
        const mid = degToRad(startDeg + sweep / 2);
        const labelR = sweep < 15 ? r * 0.82 : r * 0.75;
        
        ctx.save();
        ctx.translate(cx + Math.cos(mid) * labelR, cy + Math.sin(mid) * labelR);
        ctx.rotate(mid - Math.PI / 2);
        
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#0B2617";
        ctx.lineWidth = 3;
        ctx.textAlign = "center";
        wrapText(ctx, p.name, 0, 0, 100, fontSize);
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
    const pointerAngle = 270; // pointe vers le haut (12h)
    const currentMod = startFrom % 360;
    const desiredMod = ((pointerAngle - centerOfSlice) % 360 + 360) % 360;
    const diff = (desiredMod - currentMod + 360) % 360;
    return startFrom + (5 * 360) + diff;
}
async function doSpin() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    spinBtn.disabled = true;
    resultDiv.textContent = "Tirage en cours...";
    try {
        const res = await fetch("/spin", { method: "POST" });
        if (!res.ok)
            throw new Error(`Spin failed: ${res.status}`);
        const json = await res.json();
        console.log("Server response:", json);
        const isWin = (_b = (_a = json.isWin) !== null && _a !== void 0 ? _a : json.IsWin) !== null && _b !== void 0 ? _b : (((_c = json.prizeName) !== null && _c !== void 0 ? _c : json.PrizeName) ? true : false);
        const prizeName = String((_f = (_e = (_d = json.prizeName) !== null && _d !== void 0 ? _d : json.PrizeName) !== null && _e !== void 0 ? _e : json.prize) !== null && _f !== void 0 ? _f : "");
        const prizeIndex = json.prizeIndex ?? json.PrizeIndex;
        const serverAngle = Number((_h = json.angle) !== null && _h !== void 0 ? _h : json.Angle);
        console.log("Parsed values - prizeName:", prizeName, "prizeIndex:", prizeIndex, "serverAngle:", serverAngle);
        let rotationTarget = currentRotation + (360 * 5) + Math.random() * 360;

        if (!Number.isNaN(serverAngle) && serverAngle !== null && serverAngle !== undefined) {
            console.log("Using serverAngle:", serverAngle);
            const currentMod = currentRotation % 360;
            const diff = (serverAngle - currentMod + 360) % 360;
            rotationTarget = currentRotation + (360 * 5) + diff;
        }
        else if (typeof prizeIndex === "number" && prizeIndex >= 0 && prizeIndex < slices.length) {
            console.log("Using prizeIndex:", prizeIndex);
            rotationTarget = computeRotationForSlice(slices[prizeIndex], currentRotation);
        }
        else {
            const slice = findSliceByName(prizeName);
            if (slice) {
                console.log("Using findSliceByName:", prizeName);
                rotationTarget = computeRotationForSlice(slice, currentRotation);
            }
        }
        console.log("Final rotationTarget:", rotationTarget);
        canvas.style.transition = "transform 5s cubic-bezier(.17,.67,.83,.67)";
        canvas.style.transform = `rotate(${rotationTarget}deg)`;
        currentRotation = rotationTarget;
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
    }
    catch (err) {
        resultDiv.textContent = "❌ Erreur lors du tirage.";
        spinBtn.disabled = false;
        console.error(err);
    }
}
async function loadAndDraw() {
    try {
        const prizes = await fetchPrizes();
        drawWheel(prizes);
    }
    catch (err) {
        resultDiv.textContent = "❌ Erreur lors du chargement.";
        console.error(err);
    }
}
spinBtn.addEventListener("click", () => {
    doSpin();
});
loadAndDraw();
