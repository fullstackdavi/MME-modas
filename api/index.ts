import express, { type Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// In-memory storage for Vercel serverless
interface Appointment {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  service: string;
  status: string;
  createdAt: Date;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  active: boolean;
  createdAt: Date;
}

interface GalleryImage {
  id: string;
  title: string;
  image: string;
  createdAt: Date;
}

// Note: In serverless, this data resets on each cold start
// For persistent data, use a database like Neon, Supabase, or PlanetScale
const appointmentsMap = new Map<string, Appointment>();
const productsMap = new Map<string, Product>();
const galleryMap = new Map<string, GalleryImage>();

// Seed products
const defaultProducts: Product[] = [
  { id: "1", name: "Camisa Social Premium", price: 189.90, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop", category: "camisas", active: true, createdAt: new Date() },
  { id: "2", name: "Jaqueta de Couro", price: 459.90, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop", category: "jaquetas", active: true, createdAt: new Date() },
  { id: "3", name: "Calça Slim Fit", price: 219.90, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop", category: "calcas", active: true, createdAt: new Date() },
  { id: "4", name: "Blazer Executivo", price: 389.90, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop", category: "blazers", active: true, createdAt: new Date() },
  { id: "5", name: "Camiseta Premium", price: 89.90, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop", category: "camisetas", active: true, createdAt: new Date() },
  { id: "6", name: "Terno Completo", price: 899.90, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop", category: "ternos", active: true, createdAt: new Date() },
];
defaultProducts.forEach(p => productsMap.set(p.id, p));

// Seed gallery
const defaultImages: GalleryImage[] = [
  { id: "1", title: "Corte Moderno", image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop", createdAt: new Date() },
  { id: "2", title: "Barba Estilizada", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=400&fit=crop", createdAt: new Date() },
  { id: "3", title: "Fade Clássico", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop", createdAt: new Date() },
  { id: "4", title: "Corte Executivo", image: "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=600&h=400&fit=crop", createdAt: new Date() },
  { id: "5", title: "Degradê Perfeito", image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=400&fit=crop", createdAt: new Date() },
  { id: "6", title: "Barba Completa", image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=400&fit=crop", createdAt: new Date() },
];
defaultImages.forEach(img => galleryMap.set(img.id, img));

// API Routes
app.post("/api/appointments", async (req, res) => {
  try {
    const id = randomUUID();
    const appointment: Appointment = {
      ...req.body,
      id,
      status: "confirmed",
      createdAt: new Date(),
    };
    appointmentsMap.set(id, appointment);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: "Invalid appointment data" });
  }
});

app.get("/api/appointments", async (req, res) => {
  try {
    const appointments = Array.from(appointmentsMap.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

app.get("/api/appointments/available/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const booked = Array.from(appointmentsMap.values()).filter(
      (apt) => apt.date === date && apt.status !== "cancelled"
    );
    const bookedTimes = booked.map(apt => apt.time);
    
    const allSlots = [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
    ];
    
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));
    res.json({ date, available: availableSlots, booked: bookedTimes });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch available slots" });
  }
});

app.patch("/api/appointments/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["confirmed", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const appointment = appointmentsMap.get(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    appointment.status = status;
    appointmentsMap.set(id, appointment);
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to update appointment" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const productsList = Array.from(productsMap.values()).filter(p => p.active);
    res.json(productsList);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const id = randomUUID();
    const product: Product = {
      ...req.body,
      id,
      active: true,
      createdAt: new Date(),
    };
    productsMap.set(id, product);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: "Invalid product data" });
  }
});

app.patch("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = productsMap.get(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const updated = { ...product, ...req.body };
    productsMap.set(id, updated);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = productsMap.get(id);
    if (product) {
      product.active = false;
      productsMap.set(id, product);
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

app.get("/api/gallery", async (req, res) => {
  try {
    const images = Array.from(galleryMap.values());
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

app.post("/api/gallery", async (req, res) => {
  try {
    const id = randomUUID();
    const image: GalleryImage = {
      ...req.body,
      id,
      createdAt: new Date(),
    };
    galleryMap.set(id, image);
    res.status(201).json(image);
  } catch (error) {
    res.status(400).json({ error: "Invalid image data" });
  }
});

app.delete("/api/gallery/:id", async (req, res) => {
  try {
    const { id } = req.params;
    galleryMap.delete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete gallery image" });
  }
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;
