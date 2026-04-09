import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';
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

const AddPropertyPage: React.FC = () => {
  const navigate = useNavigate();

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

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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

    const fileArray = Array.from(files);
    setImages(fileArray);

    const urls = fileArray.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
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

    navigate('/owner');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Add New Property</h1>
        <p className="text-muted-foreground mb-6">
          Fill in the property details below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Box */}
          <div>
            <label className="block text-sm font-medium mb-3">Upload Images</label>

            <label className="w-full min-h-[320px] border-2 border-dashed border-border rounded-2xl flex items-center justify-center cursor-pointer bg-muted/40 hover:bg-muted/60 transition relative overflow-hidden">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />

              {previewUrls.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <UploadCloud size={42} />
                  <p className="mt-3 text-sm">Click to upload property images</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full h-full p-4">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="rounded-xl overflow-hidden border border-border bg-background h-40"
                    >
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </label>
          </div>

          {/* Form Fields */}
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

          <div className="flex gap-3">
            <Button type="submit">Save Property</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/owner')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyPage;