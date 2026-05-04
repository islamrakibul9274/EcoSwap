"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState, useRef } from "react";
import { Camera, Save, Trash2, MapPin } from "lucide-react";

interface PlantData {
  id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  imageUrl?: string;
  location?: {
    type: string;
    coordinates: number[];
  };
}

export default function EditPlantClient({ plant }: { plant: PlantData }) {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: plant.name,
    type: plant.type,
    category: plant.category || "Houseplants",
    description: plant.description,
    imageUrl: plant.imageUrl || "",
    location: plant.location
  });
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
        setFormData(prev => ({
          ...prev,
          location: {
            type: "Point",
            coordinates: [position.coords.longitude, position.coords.latitude]
          }
        }));
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

    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey || apiKey === "placeholder_imgbb_key") {
        throw new Error("Please configure a valid ImgBB API Key in .env.local");
      }

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, imageUrl: data.data.url }));
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
      const res = await fetch(`/api/listings/${plant.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update listing");
      }

      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const res = await fetch(`/api/listings/${plant.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-[800px] mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">Edit Plant</h1>
          <p className="text-foreground/70">Update the details of your listing.</p>
        </div>
        <Button variant="outline" className="hidden md:flex text-red-600 border-red-200 hover:bg-red-50" onClick={handleDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Listing
        </Button>
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
                src={formData.imageUrl || "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&h=300&fit=crop&q=70"}
                alt="Plant"
                className={`w-full h-full object-cover transition-opacity duration-300 ${formData.imageUrl ? 'opacity-100 group-hover:opacity-60' : 'opacity-30 group-hover:opacity-50'}`}
              />
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {uploadingImage ? (
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-3 rounded-full flex items-center text-primary font-semibold shadow-sm">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                    Uploading...
                  </div>
                ) : (
                  <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold flex items-center text-foreground group-hover:text-primary transition-colors shadow-sm pointer-events-auto">
                    <Camera className="w-4 h-4 mr-2" /> {formData.imageUrl ? "Change Photo" : "Upload Photo"}
                  </span>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input 
                label="Plant Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-foreground">Listing Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full h-12 bg-white border border-[#c2c9bb] rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="Cutting">Cutting</option>
                  <option value="Rooted Plant">Rooted Plant</option>
                  <option value="Full Plant">Full Plant</option>
                  <option value="Seeds">Seeds</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-foreground">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
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
                  variant={formData.location ? "secondary" : "outline"} 
                  className="w-full h-12 justify-start font-normal"
                  onClick={handleGetLocation}
                  disabled={gettingLocation}
                >
                  {gettingLocation ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <MapPin className={`w-4 h-4 mr-2 ${formData.location ? 'text-primary' : 'text-foreground/40'}`} />
                  )}
                  {formData.location ? "Location Set" : "Attach My Location"}
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-foreground">Description & Care Needs</label>
              <textarea 
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-white border border-[#c2c9bb] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            <div className="pt-4 border-t border-surface-dim flex justify-between md:justify-end gap-4">
              <Button type="button" variant="outline" className="md:hidden text-red-600 border-red-200 hover:bg-red-50" onClick={handleDelete} disabled={loading || uploadingImage}>
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={loading || uploadingImage}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={loading} disabled={uploadingImage}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
