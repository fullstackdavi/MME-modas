import { 
  type User, type InsertUser, 
  type Appointment, type InsertAppointment,
  type Product, type InsertProduct,
  type GalleryImage, type InsertGalleryImage,
  users, appointments, products, galleryImages
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointments(): Promise<Appointment[]>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  updateAppointmentStatus(id: string, status: string): Promise<Appointment | undefined>;
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<void>;
  getGalleryImages(): Promise<GalleryImage[]>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  deleteGalleryImage(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private appointmentsMap: Map<string, Appointment>;
  private productsMap: Map<string, Product>;
  private galleryMap: Map<string, GalleryImage>;

  constructor() {
    this.users = new Map();
    this.appointmentsMap = new Map();
    this.productsMap = new Map();
    this.galleryMap = new Map();
    this.seedProducts();
    this.seedGallery();
  }

  private seedProducts() {
    const defaultProducts: Product[] = [
      { id: "1", name: "Camisa Social Premium", price: 189.90, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop", category: "camisas", active: true, createdAt: new Date() },
      { id: "2", name: "Jaqueta de Couro", price: 459.90, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop", category: "jaquetas", active: true, createdAt: new Date() },
      { id: "3", name: "Calça Slim Fit", price: 219.90, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop", category: "calcas", active: true, createdAt: new Date() },
      { id: "4", name: "Blazer Executivo", price: 389.90, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop", category: "blazers", active: true, createdAt: new Date() },
      { id: "5", name: "Camiseta Premium", price: 89.90, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop", category: "camisetas", active: true, createdAt: new Date() },
      { id: "6", name: "Terno Completo", price: 899.90, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop", category: "ternos", active: true, createdAt: new Date() },
    ];
    defaultProducts.forEach(p => this.productsMap.set(p.id, p));
  }

  private seedGallery() {
    const defaultImages: GalleryImage[] = [
      { id: "1", title: "Corte Moderno", image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop", createdAt: new Date() },
      { id: "2", title: "Barba Estilizada", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=400&fit=crop", createdAt: new Date() },
      { id: "3", title: "Fade Clássico", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop", createdAt: new Date() },
      { id: "4", title: "Corte Executivo", image: "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=600&h=400&fit=crop", createdAt: new Date() },
      { id: "5", title: "Degradê Perfeito", image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=400&fit=crop", createdAt: new Date() },
      { id: "6", title: "Barba Completa", image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=400&fit=crop", createdAt: new Date() },
    ];
    defaultImages.forEach(img => this.galleryMap.set(img.id, img));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      status: "confirmed",
      createdAt: new Date(),
    };
    this.appointmentsMap.set(id, appointment);
    return appointment;
  }

  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointmentsMap.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return Array.from(this.appointmentsMap.values()).filter(
      (apt) => apt.date === date && apt.status !== "cancelled"
    );
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment | undefined> {
    const appointment = this.appointmentsMap.get(id);
    if (appointment) {
      appointment.status = status;
      this.appointmentsMap.set(id, appointment);
      return appointment;
    }
    return undefined;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.productsMap.values()).filter(p => p.active);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.productsMap.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      active: true,
      createdAt: new Date(),
    };
    this.productsMap.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.productsMap.get(id);
    if (product) {
      const updated = { ...product, ...updates };
      this.productsMap.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = this.productsMap.get(id);
    if (product) {
      product.active = false;
      this.productsMap.set(id, product);
    }
  }

  async getGalleryImages(): Promise<GalleryImage[]> {
    return Array.from(this.galleryMap.values());
  }

  async createGalleryImage(insertImage: InsertGalleryImage): Promise<GalleryImage> {
    const id = randomUUID();
    const image: GalleryImage = {
      ...insertImage,
      id,
      createdAt: new Date(),
    };
    this.galleryMap.set(id, image);
    return image;
  }

  async deleteGalleryImage(id: string): Promise<void> {
    this.galleryMap.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db.insert(appointments).values(insertAppointment).returning();
    return appointment;
  }

  async getAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments).orderBy(desc(appointments.createdAt));
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return await db.select().from(appointments).where(
      and(eq(appointments.date, date), eq(appointments.status, "confirmed"))
    );
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment | undefined> {
    const [appointment] = await db.update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();
    return appointment;
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.active, true));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db.update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.update(products).set({ active: false }).where(eq(products.id, id));
  }

  async getGalleryImages(): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages).orderBy(desc(galleryImages.createdAt));
  }

  async createGalleryImage(insertImage: InsertGalleryImage): Promise<GalleryImage> {
    const [image] = await db.insert(galleryImages).values(insertImage).returning();
    return image;
  }

  async deleteGalleryImage(id: string): Promise<void> {
    await db.delete(galleryImages).where(eq(galleryImages.id, id));
  }
}

export const storage = new MemStorage();
