import { useState, useEffect, useRef, memo, useCallback, useMemo } from "react";
import logoImage from "@assets/generated_images/mme_modas_letters_only_transparent.png";
import agendamentoImage from "@assets/image_1764960192255.png";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Menu,
  X,
  Scissors,
  ShoppingBag,
  ShoppingCart,
  Calendar,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Product, BarberService, InsertAppointment, GalleryImage } from "@shared/schema";
import { insertAppointmentSchema } from "@shared/schema";
import { useCart } from "@/lib/cart-context";

const BARBER_SERVICES: readonly BarberService[] = Object.freeze([
  { id: "1", name: "Corte Masculino", price: 45.00, description: "Corte moderno com acabamento perfeito", icon: "scissors" },
  { id: "2", name: "Barba Completa", price: 35.00, description: "Barba alinhada com toalha quente", icon: "beard" },
  { id: "3", name: "Corte + Barba", price: 70.00, description: "Pacote completo com desconto", icon: "package" },
  { id: "4", name: "Sobrancelha", price: 15.00, description: "Design de sobrancelha masculina", icon: "eyebrow" },
]);

const NAV_ITEMS = Object.freeze([
  { label: "Home", id: "hero" },
  { label: "Moda Masculina", id: "produtos" },
  { label: "Barbearia", id: "barbearia" },
  { label: "Galeria", id: "galeria" },
  { label: "Agendamento", id: "agendamento" },
  { label: "Contato", id: "contato" },
]);

const VIDEO_POSTER_MOBILE = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=600&fit=crop&q=75";
const VIDEO_POSTER_DESKTOP = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1920&h=1080&fit=crop&q=80";
const VIDEO_SRC = "https://cdn.pixabay.com/video/2016/05/12/3125-166335844_large.mp4";

const appointmentFormSchema = insertAppointmentSchema.extend({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().min(10, "Telefone inválido").max(15),
  service: z.string().min(1, "Selecione um serviço"),
  date: z.string().min(1, "Selecione uma data"),
  time: z.string().min(1, "Selecione um horário"),
});

type AppointmentFormData = InsertAppointment;

function useScrollAnimation() {
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-up");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              entry.target.classList.add("animate-in");
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, setIsOpen: setCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/95 backdrop-blur-md shadow-lg" : "bg-black/70 backdrop-blur-sm"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center hover-cursor"
            data-testid="link-logo"
          >
            <img 
              src={logoImage} 
              alt="MME Modas" 
              className="h-14 md:h-16 w-auto object-contain"
              loading="eager"
              decoding="async"
            />
          </button>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-medium text-muted-foreground hover:text-white transition-colors duration-200"
                data-testid={`link-nav-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white"
              onClick={() => setCartOpen(true)}
              data-testid="button-cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="button-mobile-menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden bg-black/95 backdrop-blur-md overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="block w-full text-left py-3 px-4 text-base font-medium text-muted-foreground hover:text-white hover:bg-secondary/50 rounded-lg transition-colors"
              data-testid={`link-mobile-nav-${item.id}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

const HeroSection = memo(function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(checkIOS);
    setIsMobile(window.innerWidth < 768);
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion) return;

    const playVideo = async () => {
      try {
        video.muted = true;
        await video.play();
      } catch (error) {
        video.muted = true;
        video.play().catch(() => {});
      }
    };

    playVideo();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        playVideo();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [prefersReducedMotion]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={isIOS ? { minHeight: '-webkit-fill-available' } : undefined}
      data-testid="section-hero"
    >
      {!prefersReducedMotion && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={isMobile ? VIDEO_POSTER_MOBILE : VIDEO_POSTER_DESKTOP}
          className="absolute inset-0 w-full h-full object-cover"
          style={isIOS ? { 
            WebkitTransform: 'translateZ(0)',
            minHeight: '-webkit-fill-available',
            height: '100%',
            objectFit: 'cover'
          } : { WebkitTransform: 'translateZ(0)' }}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      )}
      {prefersReducedMotion && (
        <img 
          src={isMobile ? VIDEO_POSTER_MOBILE : VIDEO_POSTER_DESKTOP}
          alt="MME Modas"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/80"
        style={isIOS ? { minHeight: '-webkit-fill-available' } : undefined}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="fade-up opacity-0 translate-y-4 transition-all duration-500 will-change-transform">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            MME Modas
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-white/80 font-light mb-8">
            Moda Masculina & Barbearia Premium
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="min-w-[180px] text-base font-semibold"
              onClick={() => scrollToSection("produtos")}
              data-testid="button-ver-roupas"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Ver Roupas
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="min-w-[180px] text-base font-semibold bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
              onClick={() => scrollToSection("agendamento")}
              data-testid="button-agendar-corte"
            >
              <Scissors className="w-5 h-5 mr-2" />
              Agendar corte
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent backdrop-blur-sm" />
    </section>
  );
});

const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <Card className="group overflow-visible bg-card border-card-border transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-[4/5] overflow-hidden rounded-t-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-1" data-testid={`text-product-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-xl font-bold text-primary mb-3" data-testid={`text-product-price-${product.id}`}>
          R$ {product.price.toFixed(2).replace(".", ",")}
        </p>
        <Button className="w-full" onClick={() => addItem(product)} data-testid={`button-comprar-${product.id}`}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Adicionar
        </Button>
      </div>
    </Card>
  );
});

const ProductsSection = memo(function ProductsSection() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  return (
    <section id="produtos" className="py-20 md:py-28 bg-background" data-testid="section-produtos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 fade-up opacity-0 translate-y-4 transition-all duration-500 will-change-transform">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Moda <span className="text-primary">Masculina</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Roupas de alta qualidade para o homem moderno. Estilo e conforto em cada peça.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

const HaircutIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="6" cy="6" r="3" />
    <circle cx="18" cy="6" r="3" />
    <path d="M8.12 8.12L12 12" />
    <path d="M15.88 8.12L12 12" />
    <path d="M12 12v6" />
    <path d="M9 18h6" />
  </svg>
);

const BeardIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="8" rx="6" ry="5" />
    <path d="M6 10c0 6 2 10 6 12 4-2 6-6 6-12" />
    <path d="M8 10v2c0 2 1.5 4 4 5 2.5-1 4-3 4-5v-2" />
    <circle cx="9" cy="7" r="0.5" fill="currentColor" />
    <circle cx="15" cy="7" r="0.5" fill="currentColor" />
  </svg>
);

const HaircutBeardIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="4" cy="4" r="2" />
    <circle cx="10" cy="4" r="2" />
    <path d="M6 5.5L7 8" />
    <path d="M8 5.5L7 8" />
    <ellipse cx="17" cy="9" rx="4" ry="3.5" />
    <path d="M13 11c0 4 1.5 7 4 8.5 2.5-1.5 4-4.5 4-8.5" />
    <circle cx="15.5" cy="8.5" r="0.5" fill="currentColor" />
    <circle cx="18.5" cy="8.5" r="0.5" fill="currentColor" />
  </svg>
);

const EyebrowIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 10c3-4 6-5 9-5s6 1 9 5" strokeWidth="2.5" />
    <path d="M6 14l4 4 6-8" />
    <circle cx="16" cy="10" r="1" fill="currentColor" />
  </svg>
);

const ServiceCard = memo(function ServiceCard({ service, onSchedule }: { service: BarberService; onSchedule: () => void }) {
  const getIcon = () => {
    switch (service.icon) {
      case "scissors":
        return <HaircutIcon className="w-8 h-8" />;
      case "beard":
        return <BeardIcon className="w-8 h-8" />;
      case "package":
        return <HaircutBeardIcon className="w-8 h-8" />;
      case "eyebrow":
        return <EyebrowIcon className="w-8 h-8" />;
      default:
        return <HaircutIcon className="w-8 h-8" />;
    }
  };

  return (
    <Card className="overflow-visible bg-card border-card-border p-6 text-center transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {getIcon()}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2" data-testid={`text-service-name-${service.id}`}>
        {service.name}
      </h3>
      <p className="text-muted-foreground text-sm mb-4 flex-grow">{service.description}</p>
      <p className="text-2xl font-bold text-primary mb-4" data-testid={`text-service-price-${service.id}`}>
        R$ {service.price.toFixed(2).replace(".", ",")}
      </p>
      <Button className="w-full mt-auto" onClick={onSchedule} data-testid={`button-agendar-${service.id}`}>
        Agendar
      </Button>
    </Card>
  );
});

const BarberSection = memo(function BarberSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      id="barbearia" 
      className="py-20 md:py-28 relative section-bg-responsive section-bg-barber" 
      data-testid="section-barbearia"
      style={{
        backgroundImage: `url(https://cdn.pixabay.com/photo/2023/09/15/04/25/clipper-8254064_1280.jpg)`,
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="fade-up opacity-0 translate-y-4 transition-all duration-500 will-change-transform">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Barbearia <span className="text-primary">Premium</span>
            </h2>
            <p className="text-lg text-gray-200 mb-6">
              Cortes modernos, barba alinhada, atendimento premium. Nossos barbeiros são especialistas em 
              criar o visual perfeito para você.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-gray-200">
                <Clock className="w-5 h-5 text-primary" />
                <span>Atendimento rápido</span>
              </div>
              <div className="flex items-center gap-2 text-gray-200">
                <Scissors className="w-5 h-5 text-primary" />
                <span>Profissionais experientes</span>
              </div>
            </div>
          </div>
          <div className="fade-up opacity-0 translate-y-4 transition-all duration-500 will-change-transform" style={{ transitionDelay: "100ms" }}>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop"
                alt="Barbearia MME"
                className="rounded-lg w-full h-48 object-cover"
                loading="lazy"
              decoding="async"
            />
              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"
                alt="Corte de cabelo"
                className="rounded-lg w-full h-48 object-cover"
                loading="lazy"
              decoding="async"
            />
              <img
                src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=300&fit=crop"
                alt="Barba"
                className="rounded-lg w-full h-48 object-cover col-span-2"
                loading="lazy"
              decoding="async"
            />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BARBER_SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} onSchedule={() => scrollToSection("agendamento")} />
          ))}
        </div>
      </div>
    </section>
  );
});

const GallerySection = memo(function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const { data: images, isLoading } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });

  const goToPrevious = () => {
    if (!images || !selectedImage) return;
    const currentIndex = images.findIndex(img => img.id === selectedImage.id);
    const previousIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setSelectedImage(images[previousIndex]);
  };

  const goToNext = () => {
    if (!images || !selectedImage) return;
    const currentIndex = images.findIndex(img => img.id === selectedImage.id);
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(images[nextIndex]);
  };

  return (
    <section id="galeria" className="py-20 md:py-28 bg-background" data-testid="section-galeria">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 fade-up opacity-0 translate-y-4 transition-all duration-500 will-change-transform">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nossa <span className="text-primary">Galeria</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Confira alguns dos nossos trabalhos e inspire-se para o seu próximo visual.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images?.map((image) => (
              <div
                key={image.id}
                className="cursor-pointer group"
                onClick={() => setSelectedImage(image)}
                data-testid={`gallery-image-${image.id}`}
              >
                <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                  <img
                    src={image.image}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                    <span className="text-white font-medium p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      {image.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none" data-testid="modal-lightbox">
          <div className="relative">
            {selectedImage && (
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[80vh] object-contain"
                decoding="async"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70"
              onClick={goToPrevious}
              data-testid="button-lightbox-prev"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70"
              onClick={goToNext}
              data-testid="button-lightbox-next"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="text-white text-lg font-medium">{selectedImage?.title}</h3>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
});

const BookingSection = memo(function BookingSection() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  
  const { data: availability } = useQuery<{ date: string; available: string[]; booked: string[] }>({
    queryKey: ["/api/appointments/available", selectedDate],
    enabled: !!selectedDate,
  });

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      service: "",
      date: "",
      time: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      const response = await apiRequest("POST", "/api/appointments", data);
      return response;
    },
    onSuccess: () => {
      setShowSuccess(true);
      form.reset();
      setSelectedDate("");
    },
    onError: (error) => {
      console.error("Erro ao agendar:", error);
    },
  });

  const onSubmit = (data: AppointmentFormData) => {
    mutation.mutate(data);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    form.setValue("date", date);
    form.setValue("time", "");
  };

  const availableSlots = availability?.available || [];

  return (
    <section 
      id="agendamento" 
      className="py-20 md:py-28 relative section-bg-responsive section-bg-booking" 
      data-testid="section-agendamento"
      style={{
        backgroundImage: `url(${agendamentoImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Agende seu <span className="text-primary">Horário</span>
          </h2>
          <p className="text-lg text-gray-200">
            Escolha o serviço, data e horário de sua preferência.
          </p>
        </div>
          
          <Card className="overflow-visible p-6 md:p-8 bg-card/95 backdrop-blur-sm border-card-border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Seu nome"
                        {...field}
                        data-testid="input-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone / WhatsApp</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(00) 00000-0000"
                        {...field}
                        data-testid="input-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serviço</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-service">
                          <SelectValue placeholder="Selecione um serviço" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BARBER_SERVICES.map((service) => (
                          <SelectItem key={service.id} value={service.name}>
                            {service.name} - R$ {service.price.toFixed(2).replace(".", ",")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          {...field}
                          onChange={(e) => handleDateChange(e.target.value)}
                          data-testid="input-date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={!selectedDate || availableSlots.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-time">
                            <SelectValue placeholder={
                              !selectedDate 
                                ? "Selecione uma data" 
                                : availableSlots.length === 0 
                                ? "Sem horários" 
                                : "Selecione"
                            } />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedDate && availableSlots.length === 0 && (
                        <p className="text-sm text-destructive">Todos os horários estão ocupados para esta data.</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full text-base font-semibold"
                disabled={mutation.isPending}
                data-testid="button-submit-agendamento"
              >
                {mutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Agendando...
                  </span>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 mr-2" />
                    Agendar
                  </>
                )}
              </Button>
            </form>
          </Form>
        </Card>
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md" data-testid="modal-success">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              Agendamento <span className="text-primary">Confirmado!</span>
            </DialogTitle>
            <DialogDescription className="text-center pt-4">
              Seu agendamento foi realizado com sucesso. Aguardamos você em nossa loja!
              <br /><br />
              <span className="text-primary font-medium">Dica:</span> Salve nosso WhatsApp para confirmar seu horário.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 pt-4">
            <Button 
              onClick={() => {
                window.open("https://wa.me/5535987116814?text=Olá! Acabei de fazer um agendamento na MME Modas.", "_blank");
              }}
              data-testid="button-whatsapp-confirm"
            >
              <Phone className="w-4 h-4 mr-2" />
              Confirmar via WhatsApp
            </Button>
            <Button variant="outline" onClick={() => setShowSuccess(false)} data-testid="button-close-modal">
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
});

const ContactSection = memo(function ContactSection() {
  const openWhatsApp = () => {
    window.open("https://wa.me/5535987116814?text=Olá! Gostaria de mais informações sobre a MME Modas.", "_blank");
  };

  return (
    <section id="contato" className="py-20 md:py-28 bg-secondary/30" data-testid="section-contato">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 fade-up opacity-0 translate-y-4 transition-all duration-500 will-change-transform">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Entre em <span className="text-primary">Contato</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Visite nossa loja ou entre em contato conosco.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          <div className="fade-up opacity-0 translate-y-4 transition-all duration-500 will-change-transform space-y-8">
            <Card className="overflow-visible p-6 bg-card border-card-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Endereço</h3>
                  <p className="text-muted-foreground" data-testid="text-endereco">
                    Rua Wellington Pereira, 168<br />
                    Vila Floresta - Varginha, MG
                  </p>
                </div>
              </div>
            </Card>

            <Card className="overflow-visible p-6 bg-card border-card-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Horário de Funcionamento</h3>
                  <p className="text-muted-foreground" data-testid="text-horario">
                    Terça a Sexta: 09h às 20h<br />
                    Sábado: 09h às 18h<br />
                    Domingo e Segunda: Fechado
                  </p>
                </div>
              </div>
            </Card>

            <Card className="overflow-visible p-6 bg-card border-card-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Telefone / WhatsApp</h3>
                  <p className="text-muted-foreground" data-testid="text-telefone">
                    (35) 98711-6814
                  </p>
                  <Button variant="default" size="sm" className="mt-3" onClick={openWhatsApp} data-testid="button-whatsapp">
                    <Phone className="w-4 h-4 mr-2" />
                    Chamar no WhatsApp
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="fade-up opacity-0 translate-y-4 transition-all duration-500 will-change-transform" style={{ transitionDelay: "100ms" }}>
            <Card className="overflow-hidden h-full min-h-[400px] bg-card border-card-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3712.0!2d-45.43!3d-21.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRua%20Wellington%20Pereira%2C%20168%20-%20Vila%20Floresta%2C%20Varginha%20-%20MG!5e0!3m2!1spt-BR!2sbr!4v1701234567890!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização MME Modas"
                data-testid="map-google"
              />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
});

const Footer = memo(function Footer() {
  const openWhatsApp = () => {
    window.open("https://wa.me/5535987116814", "_blank");
  };

  const openInstagram = () => {
    window.open("https://www.instagram.com/m.m.e_modas?igsh=MWhzYmQ3ODN1Y3BqMw==", "_blank");
  };

  return (
    <footer className="bg-black py-12 border-t border-border" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="text-center md:text-left">
            <img 
              src={logoImage} 
              alt="MME Modas" 
              className="h-10 w-auto mx-auto md:mx-0"
            />
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={openInstagram} data-testid="link-instagram">
              <Instagram className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={openWhatsApp} data-testid="link-whatsapp">
              <Phone className="w-5 h-5" />
            </Button>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground" data-testid="text-copyright">
              © {new Date().getFullYear()} MME Modas. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default function Home() {
  useScrollAnimation();

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .fade-up.animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
      html {
        scroll-behavior: smooth;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <ProductsSection />
        <BarberSection />
        <GallerySection />
        <BookingSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
