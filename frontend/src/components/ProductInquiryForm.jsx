import { useState } from 'react';
import { Send, X } from 'lucide-react';
import { useInquiryStore } from '../store/useInquiryStore';
import toast from 'react-hot-toast';

const ProductInquiryForm = ({ product, onClose }) => {
  const { submitInquiry } = useInquiryStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiry: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create inquiry data with product info
      const inquiryData = {
        ...formData,
        productId: product._id,
        productName: product.name,
        inquiryType: 'pricing',
        timestamp: new Date()
      };

      // Submit inquiry using store method
      await submitInquiry(inquiryData);
      
      if (onClose) onClose();
    } catch (error) {
      // Error handling is done in the store
      console.error('Error submitting inquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-base-100 rounded-xl shadow-md p-5 border border-base-300/50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Request Pricing Information</h3>
        {onClose && (
          <button 
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      <p className="text-sm text-base-content/70 mb-5">
        Please provide your contact details and we'll get back to you with pricing information for <span className="font-semibold text-primary">{product.name}</span>.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered input-sm w-full"
              required
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email Address</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered input-sm w-full"
              required
            />
          </div>
        </div>
        
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Phone Number (Optional)</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input input-bordered input-sm w-full"
          />
        </div>
        
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Your Inquiry</span>
          </label>
          <textarea
            name="inquiry"
            value={formData.inquiry}
            onChange={handleChange}
            className="textarea textarea-bordered h-24"
            placeholder="Please specify quantity requirements, intended application, or any other details that will help us provide accurate pricing."
            required
          ></textarea>
        </div>
        
        <div className="form-control mt-4">
          <button 
            type="submit" 
            className="btn btn-primary w-full gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Submit Inquiry
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductInquiryForm;
