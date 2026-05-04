"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState, useRef } from "react";
import { Camera, Leaf, MapPin } from "lucide-react";

export default function AddPlantPage() {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("Cutting");
  const [category, setCategory] = useState("Houseplants");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGetLocation = () => {
    setGettingLocation(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGettingLocation(false);
      },
      (err) => {
        setError("Failed to get location. Please check browser permissions.");
        setGettingLocation(false);
      }
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey || apiKey === "placeholder_imgbb_key") {
        throw new Error("Please configure a valid ImgBB API Key in .env.local");
      }

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setImageUrl(data.data.url);
      } else {
        throw new Error(data.error?.message || "Failed to upload image");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          type, 
          category, 
          description, 
          imageUrl,
          location: location ? { type: "Point", coordinates: [location.lng, location.lat] } : undefined
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create listing");
      }

      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[800px] mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-primary mb-2">Add a Plant</h1>
        <p className="text-foreground/70">List a cutting or full plant to trade with the community.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div 
              className={`w-full h-48 border-2 border-dashed rounded-2xl overflow-hidden relative cursor-pointer group transition-colors ${uploadingImage ? 'border-primary bg-primary/5' : 'border-surface-dim hover:border-primary'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              
              <img
                src={imageUrl || "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&h=300&fit=crop&q=70"}
                alt="Plant preview"
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageUrl ? 'opacity-100' : 'opacity-30 group-hover:opacity-50'}`}
              />
              
              {(!imageUrl || uploadingImage) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground/60 group-hover:text-primary transition-colors bg-white/20 backdrop-blur-[2px]">
                  {uploadingImage ? (
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                      <span className="font-semibold text-sm text-primary">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-10 h-10 mb-2" />
                      <span className="font-semibold text-sm px-4 py-1.5 bg-white rounded-full shadow-sm">
                        Click to upload a photo
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input 
                label="Plant Name" 
                placeholder="e.g. Monstera Deliciosa" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-foreground">Listing Type</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-12 bg-white border border-[#c2c9bb] rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="Cutting">Cutting</option>
                  <option value="Rooted Plant">Rooted Plant</option>
                  <option value="Full Plant">Full Plant</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-foreground">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-12 bg-white border border-[#c2c9bb] rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="Houseplants">Houseplants</option>
                  <option value="Succulents">Succulents</option>
                  <option value="Cacti">Cacti</option>
                  <option value="Tropicals">Tropicals</option>
                  <option value="Herbs">Herbs</option>
                  <option value="Rare">Rare</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-foreground">Location (Optional)</label>
                <Button 
                  type="button"
                  variant={location ? "secondary" : "outline"} 
                  className="w-full h-12 justify-start font-normal"
                  onClick={handleGetLocation}
                  disabled={gettingLocation}
                >
                  {gettingLocation ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <MapPin className={`w-4 h-4 mr-2 ${location ? 'text-primary' : 'text-foreground/40'}`} />
                  )}
                  {location ? "Location Set" : "Attach My Location"}
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">Description & Care Needs</label>
              <textarea 
                rows={4}
                placeholder="Describe your plant, its current health, and what you might be looking for in return..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-[#c2c9bb] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            <div className="pt-4 border-t border-surface-dim flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={loading || uploadingImage}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={loading} disabled={uploadingImage}>
                <Leaf className="w-4 h-4 mr-2" />
                Publish Listing
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
