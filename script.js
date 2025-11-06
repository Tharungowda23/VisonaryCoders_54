/* ------------------ SEARCH FUNCTION ------------------ */
const searchButton = document.querySelector(".input-row button");
const searchInput = document.querySelector(".input-row input");
const resultsSection = document.getElementById("results");
const resultsList = document.getElementById("results-list");
let userLat, userLng;

searchButton.onclick = async () => {
  const medicine = searchInput.value.trim();
  if (!medicine) return;

  const response = await fetch(`http://localhost:3000/search?name=${medicine}`);
  const data = await response.json();

  resultsList.innerHTML = "";
  resultsSection.style.display = "block";

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      userLat = position.coords.latitude;
      userLng = position.coords.longitude;

      data.sort((a, b) => {
        const distA = Math.hypot(a.lat - userLat, a.lng - userLng);
        const distB = Math.hypot(b.lat - userLat, b.lng - userLng);
        return distA - distB;
      });

      detectLocationAndShowMap(data);

      if (data.length === 0) {
        resultsList.innerHTML = `<p style="text-align:center;color:#777;">No pharmacies found 😕</p>`;
        return;
      }

      data.forEach(p => {
        const price = p.prices[medicine] ?? "-";
        const distance = calculateDistance(userLat, userLng, p.lat, p.lng);

        resultsList.innerHTML += `
          <div class="result-card" onclick="openPharmacyLocation(${p.lat}, ${p.lng})">
            <div class="result-name">${p.name}</div>
            <div class="result-info">
              ₹${price} <br>
              <small>${distance} km away</small>
            </div>
          </div>
        `;
      });

    });
  } else {
    detectLocationAndShowMap(data);
  }
};


/* ------------------ PRESCRIPTION UPLOAD ------------------ */
const uploadInput = document.getElementById("prescription-upload");
const fileStatus = document.getElementById("file-status");
const previewImage = document.getElementById("preview-image");

uploadInput.addEventListener("change", async function() {
  const file = this.files[0];
  if (!file) return;

  fileStatus.innerHTML = "<div class='loader'></div> Scanning...";

  const reader = new FileReader();
  reader.onload = function(e) {
    previewImage.src = e.target.result;
    previewImage.style.display = "block";
  };
  reader.readAsDataURL(file);

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData
  });

  const result = await res.json();

  fileStatus.textContent = `✅ Detected Medicine: ${result.detected.join(", ")}`;
});


/* ------------------ DISTANCE CALCULATION ------------------ */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(2);
}


/* ------------------ MAP + LOCATION ------------------ */
let mapInitialized = false;
let map;

function showMap(pharmacies) {
  document.getElementById("map-section").style.display = "block";

  if (!mapInitialized) {
    map = L.map('map').setView([12.907880, 77.480850], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map);

    mapInitialized = true;
  }

  pharmacies.forEach(p => {
    L.marker([p.lat, p.lng]).addTo(map)
      .bindPopup(`<b>${p.name}</b><br>₹${Object.values(p.prices)[0]}`);
  });
}

function detectLocationAndShowMap(pharmacies) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      map.setView([userLat, userLng], 14);

      L.marker([userLat, userLng])
        .addTo(map)
        .bindPopup("📍 You are here")
        .openPopup();

      showMap(pharmacies);
    }, () => {
      showMap(pharmacies);
    });
  } else {
    showMap(pharmacies);
  }
}

function openPharmacyLocation(lat, lng) {
  window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
}


/* ------------------ HAMBURGER MENU ------------------ */
const menuBtn = document.getElementById("menu-btn");
const sideMenu = document.getElementById("side-menu");
const overlay = document.getElementById("overlay");

menuBtn.onclick = () => {
  sideMenu.classList.add("open");
  overlay.style.display = "block";
};

overlay.onclick = () => {
  sideMenu.classList.remove("open");
  overlay.style.display = "none";
};


/* ------------------ LOGIN & SIGNUP POPUPS ------------------ */
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const loginPopup = document.getElementById("login-popup");
const signupPopup = document.getElementById("signup-popup");
const closeButtons = document.querySelectorAll(".close-popup");

loginBtn.onclick = () => {
  loginPopup.classList.add("show");
  overlay.style.display = "block";
};

signupBtn.onclick = () => {
  signupPopup.classList.add("show");
  overlay.style.display = "block";
};

closeButtons.forEach(btn => {
  btn.onclick = () => {
    loginPopup.classList.remove("show");
    signupPopup.classList.remove("show");
    overlay.style.display = "none";
  };
});


/* ------------------ LOGIN & SIGNUP FUNCTIONALITY ------------------ */
const signupSubmit = document.getElementById("signup-submit");
const loginSubmit = document.getElementById("login-submit");
const userGreeting = document.getElementById("user-greeting");

/* SIGN UP */
signupSubmit.onclick = () => {
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  if (!username || !email || !password) {
    alert("Please fill all fields.");
    return;
  }

  localStorage.setItem("userUsername", username);
  localStorage.setItem("userEmail", email);
  localStorage.setItem("userPassword", password);

  signupPopup.classList.remove("show");
  overlay.style.display = "none";

  updateGreeting();
};
const logoutBtn = document.getElementById("logout-btn");
logoutBtn.onclick = () => {
  localStorage.removeItem("userUsername");
  updateGreeting();
};



/* LOGIN */
loginSubmit.onclick = () => {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  const storedEmail = localStorage.getItem("userEmail");
  const storedPassword = localStorage.getItem("userPassword");

  if (email === storedEmail && password === storedPassword) {
    loginPopup.classList.remove("show");
    overlay.style.display = "none";
    updateGreeting();
  } else {
    alert("❌ Incorrect email or password");
  }
};
function updateGreeting() {
  const name = localStorage.getItem("userUsername");

  if (name) {
    userGreeting.textContent = `Hi, ${name} 👋`;
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
    logoutBtn.style.display = "block";
  } else {
    userGreeting.textContent = "Pharma Tracker";
    loginBtn.style.display = "block";
    signupBtn.style.display = "block";
    logoutBtn.style.display = "none";
  }
}
