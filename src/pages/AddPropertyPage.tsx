import React, { useRef, useState } from 'react';
import { UploadCloud, X, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PropertyFormData = {
  title: string;
  price: string;
  location: string;
  address: string;
  type: string;
  purpose: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  description: string;
  features: string;
};

type AddPropertyModalProps = {
  onClose: () => void;
  onSave?: () => void;
};

const MAX_IMAGES = 10;

const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ onClose, onSave }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    price: '',
    location: '',
    address: '',
    type: '',
    purpose: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    description: '',
    features: '',
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [imageError, setImageError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setImageError('');

    const selectedFiles = Array.from(files);
    const remainingSlots = MAX_IMAGES - previewUrls.length;

    if (remainingSlots <= 0) {
      setImageError(`You can upload up to ${MAX_IMAGES} images only.`);
      e.target.value = '';
      return;
    }

    const filesToAdd = selectedFiles.slice(0, remainingSlots);
    const newUrls = filesToAdd.map((file) => URL.createObjectURL(file));

    setPreviewUrls((prev) => [...prev, ...newUrls]);

    if (selectedFiles.length > remainingSlots) {
      setImageError(`Only ${remainingSlots} more image(s) were added. Maximum is ${MAX_IMAGES}.`);
    }

    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setImageError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProperty = {
      ...formData,
      id: Date.now(),
      status: 'Active',
      views: 0,
      features: formData.features
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      images: previewUrls,
      image: previewUrls[0] || '',
    };

    const existingProperties = JSON.parse(localStorage.getItem('properties') || '[]');
    localStorage.setItem('properties', JSON.stringify([...existingProperties, newProperty]));

    if (onSave) onSave();
    onClose();
  };

  return (
    <div className="max-h-[85vh] overflow-y-auto pr-1">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Add New Property</h2>
        <p className="text-muted-foreground mt-1">
          Fill in the property details below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3 gap-3">
            <label className="block text-sm font-medium">Upload Images</label>
            <span className="text-xs text-muted-foreground">
              {previewUrls.length}/{MAX_IMAGES} images
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />

          {previewUrls.length === 0 ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full min-h-[280px] border-2 border-dashed border-border rounded-2xl flex items-center justify-center cursor-pointer bg-muted/40 hover:bg-muted/60 transition relative overflow-hidden"
            >
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <UploadCloud size={42} />
                <p className="mt-3 text-sm">Click to upload property images</p>
                <p className="mt-1 text-xs">You can upload up to 10 images</p>
              </div>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative rounded-xl overflow-hidden border border-border bg-background h-40"
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {previewUrls.length < MAX_IMAGES && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-40 rounded-xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition flex flex-col items-center justify-center text-muted-foreground"
                  >
                    <ImagePlus size={28} />
                    <span className="mt-2 text-sm font-medium">Add More</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {imageError && (
            <p className="text-sm text-red-500 mt-2">{imageError}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">Property Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Modern Seaside Villa"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="1250000"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Miami, FL"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Ocean Drive, Miami, FL 33139"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select type</option>
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Studio">Studio</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Purpose</label>
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select purpose</option>
              <option value="Sale">Sale</option>
              <option value="Rent">Rent</option>
              <option value="Installment">Installment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              placeholder="4"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              placeholder="3"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Area (sqft)</label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="3200"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Write property description..."
            className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Features / Amenities</label>
          <textarea
            name="features"
            value={formData.features}
            onChange={handleChange}
            rows={3}
            placeholder="Swimming Pool, Smart Home System, Ocean View"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Separate each feature with a comma.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit">Save Property</Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPropertyModal;