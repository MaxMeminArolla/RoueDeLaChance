type Prize = {
  name: string;
  probability: number;
  color?: string;
};

const AROLLA_PALETTE = [
  { hex: "#0b3d91", label: "Bleu foncé" },
  { hex: "#1d9dd3", label: "Bleu clair" },
  { hex: "#f2a400", label: "Jaune" },
  { hex: "#e94b35", label: "Rouge" },
  { hex: "#6ab04c", label: "Vert clair" },
  { hex: "#8e44ad", label: "Violet" },
  { hex: "#0F3F18", label: "Vert foncé" }
];

const tbody = document.getElementById("prizesBody")!;
const addBtn = document.getElementById("addBtn")!;
const saveBtn = document.getElementById("saveBtn") as HTMLButtonElement;
const totalProbDiv = document.getElementById("totalProb")!;
const statusMsg = document.getElementById("statusMsg")!;
const probError = document.getElementById("probError")!;

let prizes: Prize[] = [];

async function loadPrizes() {
  try {
    const res = await fetch("/prizes");
    const arr = await res.json();
    prizes = arr.map((p: any) => ({
      name: p.name || p.Name || "",
      probability: Number(p.probability ?? p.Probability ?? 0),
      color: p.color || p.Color || AROLLA_PALETTE[6].hex
    }));
    renderTable();
  } catch (err) {
    statusMsg.innerText = "Erreur lors du chargement des lots.";
    statusMsg.style.color = "red";
  }
}

function renderTable() {
  tbody.innerHTML = "";
  prizes.forEach((p, index) => {
    const tr = document.createElement("tr");

    // Nom (Limite 100)
    const tdName = document.createElement("td");
    const inputName = document.createElement("input");
    inputName.type = "text";
    inputName.maxLength = 100;
    inputName.value = p.name;
    inputName.placeholder = "Ex: Livre Craft";
    inputName.oninput = (e) => { p.name = (e.target as HTMLInputElement).value; };
    tdName.appendChild(inputName);

    // Proba
    const tdProb = document.createElement("td");
    const inputProb = document.createElement("input");
    inputProb.type = "number";
    inputProb.step = "0.001";
    inputProb.min = "0";
    inputProb.max = "1";
    inputProb.value = p.probability.toString();
    inputProb.oninput = (e) => {
      p.probability = Number((e.target as HTMLInputElement).value);
      updateTotal();
    };
    tdProb.appendChild(inputProb);

    // Couleur
    const tdColor = document.createElement("td");
    const selectColor = document.createElement("select");
    const previewBox = document.createElement("div");
    previewBox.className = "color-preview";
    previewBox.style.backgroundColor = p.color!;

    AROLLA_PALETTE.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.hex;
      opt.textContent = `${c.label} (${c.hex})`;
      if (c.hex.toLowerCase() === p.color?.toLowerCase()) {
        opt.selected = true;
      }
      selectColor.appendChild(opt);
    });

    selectColor.onchange = (e) => {
      p.color = (e.target as HTMLSelectElement).value;
      previewBox.style.backgroundColor = p.color;
    };
    tdColor.appendChild(selectColor);
    tdColor.appendChild(previewBox);

    // Delete
    const tdAction = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-danger";
    delBtn.textContent = "🗑️";
    delBtn.onclick = () => {
      prizes.splice(index, 1);
      renderTable();
      updateTotal();
    };
    tdAction.appendChild(delBtn);

    tr.appendChild(tdName);
    tr.appendChild(tdProb);
    tr.appendChild(tdColor);
    tr.appendChild(tdAction);
    tbody.appendChild(tr);
  });
  updateTotal();
}

function updateTotal() {
  const sum = prizes.reduce((s, p) => s + p.probability, 0);
  totalProbDiv.textContent = `Somme: ${sum.toFixed(4)}`;

  if (Math.abs(sum - 1.0) > 0.0001) {
    totalProbDiv.style.color = "#c62828";
    probError.style.display = "block";
    saveBtn.disabled = true;
  } else {
    totalProbDiv.style.color = "#2e7d32";
    probError.style.display = "none";
    saveBtn.disabled = false;
  }
}

addBtn.onclick = () => {
  prizes.push({ name: "", probability: 0, color: AROLLA_PALETTE[0].hex });
  renderTable();
  updateTotal();
};

saveBtn.onclick = async () => {
  saveBtn.disabled = true;
  statusMsg.textContent = "Sauvegarde en cours...";
  statusMsg.style.color = "black";

  // Double check sum
  const sum = prizes.reduce((s, p) => s + p.probability, 0);
  if (Math.abs(sum - 1.0) > 0.0001) {
    statusMsg.textContent = "Erreur: La somme n'est pas à 1.0 !";
    statusMsg.style.color = "red";
    return;
  }

  // Double check title length
  if (prizes.some(p => p.name.length > 100)) {
    statusMsg.textContent = "Erreur: Un titre dépasse 100 caractères !";
    statusMsg.style.color = "red";
    return;
  }

  try {
    const res = await fetch("/config/prizes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prizes)
    });
    if (res.ok) {
      statusMsg.textContent = "✅ Configuration sauvegardée dans appsettings.json avec succès !";
      statusMsg.style.color = "green";
    } else {
      const errTxt = await res.text();
      throw new Error(errTxt);
    }
  } catch (err: any) {
    statusMsg.textContent = "❌ " + err.message;
    statusMsg.style.color = "red";
  } finally {
    updateTotal(); // Reactive le bouton si besoin
  }
};

// Initialisation
loadPrizes();
