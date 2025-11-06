import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
app.use(cors());
app.use(express.json());

// Image upload setup (store file in memory)
const upload = multer({ storage: multer.memoryStorage() });

// Fake pharmacy database
const PHARMACIES = [
  { 
    name: "City Med Store", 
    lat: 12.907200, 
    lng: 77.479900, 
    prices: { 
      Paracetamol: 24,
      "Dolo 650": 28,
      Cetrizine: 12,
      "Febrex Plus": 30,
      Grenil: 18,
      Calpol: 26,
      Omeprazole: 22,
      Albendazole: 14,
      Azithromycin: 78,
      Sinarest: 32,
      "Vicks Action 500": 20,
      "Alex Tablet": 65,
      "Ascoril Cough Syrup": 110,
      Benadryl: 95
    }
  },

  { 
    name: "WellCare Pharmacy", 
    lat: 12.909300, 
    lng: 77.482200, 
    prices: { 
      Paracetamol: 29,
      "Dolo 650": 31,
      Cetrizine: 10,
      "Febrex Plus": 35,
      Grenil: 20,
      Calpol: 25,
      Omeprazole: 19,
      Albendazole: 15,
      Azithromycin: 82,
      Sinarest: 30,
      "Vicks Action 500": 19,
      "Alex Tablet": 70,
      "Ascoril Cough Syrup": 115,
      Benadryl: 100
    }
  },

  { 
    name: "MedPlus Kengeri", 
    lat: 12.905800, 
    lng: 77.476500, 
    prices: { 
      Paracetamol: 27,
      "Dolo 650": 30,
      Cetrizine: 11,
      "Febrex Plus": 34,
      Grenil: 19,
      Calpol: 27,
      Omeprazole: 21,
      Albendazole: 16,
      Azithromycin: 75,
      Sinarest: 29,
      "Vicks Action 500": 21,
      "Alex Tablet": 68,
      "Ascoril Cough Syrup": 108,
      Benadryl: 98
    }
  }
];



// SEARCH API
app.get("/search", (req, res) => {
  const q = (req.query.name || "").toLowerCase();
  const results = PHARMACIES.filter(p =>
    Object.keys(p.prices).map(x => x.toLowerCase()).includes(q)
  );
  res.json(results);
});

// UPLOAD PRESCRIPTION API (Fake OCR result)
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    detected: ["Paracetamol"], // ← Fake AI extracted medicine (for demo)
    message: "AI scan successful ✅"
  });
});

// START SERVER
app.listen(3000, () => console.log("✅ Backend running at http://localhost:3000"));
