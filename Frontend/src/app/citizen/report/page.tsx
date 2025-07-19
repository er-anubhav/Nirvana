'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  MapPin, 
  FileText, 
  Tag, 
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ComplaintForm {
  title: string;
  description: string;
  category: string;
  location: string;
  landmark: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  images: File[];
}

const categories = [
  'Infrastructure',
  'Utilities',
  'Traffic',
  'Environment',
  'Public Safety',
  'Health & Sanitation',
  'Education',
  'Governance',
  'Other'
];

export default function ReportComplaintPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiPrediction, setAiPrediction] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [complaintId, setComplaintId] = useState<string>('');
  
  const [form, setForm] = useState<ComplaintForm>({
    title: '',
    description: '',
    category: '',
    location: '',
    landmark: '',
    urgency: 'medium',
    images: []
  });

  const [errors, setErrors] = useState<Partial<ComplaintForm>>({});

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (form.images.length + files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    setForm({...form, images: [...form.images, ...files]});
  };

  const removeImage = (index: number) => {
    const newImages = form.images.filter((_, i) => i !== index);
    setForm({...form, images: newImages});
  };

  const validateStep = (step: number) => {
    const newErrors: Partial<ComplaintForm> = {};
    
    if (step === 1) {
      if (!form.title.trim()) newErrors.title = 'Title is required';
      if (!form.description.trim()) newErrors.description = 'Description is required';
      if (form.description.length < 20) newErrors.description = 'Description must be at least 20 characters';
    }
    
    if (step === 2) {
      if (!form.location.trim()) newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const triggerAiPrediction = () => {
    // Mock AI prediction based on description
    const description = form.description.toLowerCase();
    let predicted = '';
    
    if (description.includes('road') || description.includes('street') || description.includes('light')) {
      predicted = 'Infrastructure';
    } else if (description.includes('water') || description.includes('electricity')) {
      predicted = 'Utilities';
    } else if (description.includes('traffic') || description.includes('parking')) {
      predicted = 'Traffic';
    } else if (description.includes('garbage') || description.includes('waste')) {
      predicted = 'Health & Sanitation';
    } else {
      predicted = 'Other';
    }
    
    setTimeout(() => {
      setAiPrediction(predicted);
      if (!form.category) {
        setForm({...form, category: predicted});
      }
    }, 1000);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 1 && !aiPrediction) {
        triggerAiPrediction();
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setIsSubmitting(true);
    
    // Mock submission
    setTimeout(() => {
      const mockId = `CMP-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      setComplaintId(mockId);
      setIsSubmitting(false);
      setShowConfirmation(true);
    }, 2000);
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0613] via-[#150d27] to-[#0a0613] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 text-center border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl"
        >
          <CheckCircle className="w-16 h-16 mx-auto mb-6 text-emerald-400" />
          <h2 className="mb-4 font-serif text-2xl text-white">
            Complaint Submitted Successfully!
          </h2>
          <p className="mb-6 text-purple-300/70">
            Your complaint has been registered with ID: <strong className="text-white">{complaintId}</strong>
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push(`/citizen/complaints/${complaintId}`)}
              className="w-full px-4 py-3 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              View Complaint Details
            </button>
            <button
              onClick={() => router.push('/citizen/dashboard')}
              className="w-full px-4 py-3 text-purple-300 transition-colors border rounded-lg border-purple-500/30 hover:bg-purple-500/10"
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0613] via-[#150d27] to-[#0a0613]">
      {/* Navigation */}
      <nav className="p-4 border-b bg-purple-500/5 backdrop-blur-sm border-purple-500/20">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Link href="/citizen/dashboard" className="text-purple-400 transition-colors hover:text-purple-300">
            ← Back to Dashboard
          </Link>
          <h1 className="font-serif text-xl text-white">Report New Complaint</h1>
          <div className="w-20" />
        </div>
      </nav>

      <div className="max-w-4xl p-6 mx-auto">
        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step <= currentStep 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-950/20 text-purple-400 border border-purple-500/30'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-4 rounded ${
                    step < currentStep ? 'bg-purple-600' : 'bg-purple-950/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <p className="text-center text-purple-300/70">
              Step {currentStep} of 3: {
                currentStep === 1 ? 'Describe the Issue' :
                currentStep === 2 ? 'Location & Category' :
                'Review & Submit'
              }
            </p>
          </div>
        </motion.div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="p-8 border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl"
        >
          {/* Step 1: Description */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="mb-8 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h2 className="mb-2 font-serif text-2xl text-white">
                  Describe Your Issue
                </h2>
                <p className="text-purple-300/70">
                  Provide a clear and detailed description of the problem
                </p>
              </div>

              <div>
                <label className="block mb-2 text-sm text-purple-300">
                  Complaint Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  placeholder="Brief title describing the issue"
                  className={`w-full px-4 py-3 bg-purple-950/20 border rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    errors.title ? 'border-red-500' : 'border-purple-500/30'
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-400">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm text-purple-300">
                  Detailed Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  placeholder="Provide a detailed description of the issue, including when it started, how it affects you, and any other relevant information..."
                  rows={6}
                  className={`w-full px-4 py-3 bg-purple-950/20 border rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none ${
                    errors.description ? 'border-red-500' : 'border-purple-500/30'
                  }`}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.description ? (
                    <p className="text-sm text-red-400">{errors.description}</p>
                  ) : (
                    <p className="text-sm text-purple-300/50">
                      {form.description.length}/500 characters (minimum 20 required)
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm text-purple-300">
                  Upload Images (Optional)
                </label>
                <div className="space-y-4">
                  <div className="p-6 text-center transition-colors border-2 border-dashed rounded-lg border-purple-500/30 hover:border-purple-500/50">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Camera className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                      <p className="mb-2 text-purple-300">Click to upload images</p>
                      <p className="text-sm text-purple-300/50">
                        Maximum 5 images, up to 10MB each
                      </p>
                    </label>
                  </div>

                  {form.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {form.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index + 1}`}
                            className="object-cover w-full h-24 rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute flex items-center justify-center w-6 h-6 text-white transition-opacity bg-red-500 rounded-full opacity-0 -top-2 -right-2 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location & Category */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="mb-8 text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h2 className="mb-2 font-serif text-2xl text-white">
                  Location & Category
                </h2>
                <p className="text-purple-300/70">
                  Help us route your complaint to the right department
                </p>
              </div>

              <div>
                <label className="block mb-2 text-sm text-purple-300">
                  Location *
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({...form, location: e.target.value})}
                  placeholder="Street address or area where the issue is located"
                  className={`w-full px-4 py-3 bg-purple-950/20 border rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    errors.location ? 'border-red-500' : 'border-purple-500/30'
                  }`}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-400">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm text-purple-300">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={form.landmark}
                  onChange={(e) => setForm({...form, landmark: e.target.value})}
                  placeholder="Nearby landmark to help locate the issue"
                  className="w-full px-4 py-3 text-white transition-all border rounded-lg bg-purple-950/20 border-purple-500/30 placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* AI Category Prediction */}
              {aiPrediction && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border rounded-lg bg-purple-600/10 border-purple-500/30"
                >
                  <div className="flex items-center mb-2 space-x-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-300">AI Suggestion</span>
                  </div>
                  <p className="text-sm text-purple-300/70">
                    Based on your description, this appears to be an <strong>{aiPrediction}</strong> issue.
                  </p>
                </motion.div>
              )}

              <div>
                <label className="block mb-2 text-sm text-purple-300">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                  className="w-full px-4 py-3 text-white transition-all border rounded-lg bg-purple-950/20 border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm text-purple-300">
                  Urgency Level
                </label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    { value: 'low', label: 'Low', color: 'bg-green-500/20 text-green-300' },
                    { value: 'medium', label: 'Medium', color: 'bg-yellow-500/20 text-yellow-300' },
                    { value: 'high', label: 'High', color: 'bg-orange-500/20 text-orange-300' },
                    { value: 'critical', label: 'Critical', color: 'bg-red-500/20 text-red-300' }
                  ].map((urgency) => (
                    <button
                      key={urgency.value}
                      type="button"
                      onClick={() => setForm({...form, urgency: urgency.value as any})}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        form.urgency === urgency.value
                          ? `${urgency.color} border-current`
                          : 'border-purple-500/30 text-purple-300 hover:bg-purple-500/10'
                      }`}
                    >
                      {urgency.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="mb-8 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h2 className="mb-2 font-serif text-2xl text-white">
                  Review & Submit
                </h2>
                <p className="text-purple-300/70">
                  Please review your complaint details before submitting
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-purple-950/20">
                  <h4 className="mb-2 text-white">Title</h4>
                  <p className="text-purple-300/70">{form.title}</p>
                </div>

                <div className="p-4 rounded-lg bg-purple-950/20">
                  <h4 className="mb-2 text-white">Description</h4>
                  <p className="text-purple-300/70">{form.description}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-purple-950/20">
                    <h4 className="mb-2 text-white">Category</h4>
                    <p className="text-purple-300/70">{form.category}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-purple-950/20">
                    <h4 className="mb-2 text-white">Urgency</h4>
                    <p className="capitalize text-purple-300/70">{form.urgency}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-purple-950/20">
                  <h4 className="mb-2 text-white">Location</h4>
                  <p className="text-purple-300/70">
                    {form.location}
                    {form.landmark && ` (Near ${form.landmark})`}
                  </p>
                </div>

                {form.images.length > 0 && (
                  <div className="p-4 rounded-lg bg-purple-950/20">
                    <h4 className="mb-2 text-white">Attached Images</h4>
                    <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
                      {form.images.map((image, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(image)}
                          alt={`Attachment ${index + 1}`}
                          className="object-cover w-full h-16 rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-6 mt-8 border-t border-purple-500/20">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              className="flex items-center px-6 py-3 space-x-2 text-purple-300 transition-colors border rounded-lg border-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-3 space-x-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center px-6 py-3 space-x-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-purple-600/50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 rounded-full border-white/20 border-t-white animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Complaint</span>
                    <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
