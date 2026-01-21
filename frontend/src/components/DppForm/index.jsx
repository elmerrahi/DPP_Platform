import { useState } from 'react';
import { createDpp } from '../../utils/api.js';

const initialState = {
  productName: '',
  productId: '',
  manufacturer: '',
  category: '',
  origin: '',
  materials: '',
  lifecycleFootprint: '',
  certifications: ''
};

export default function DppForm() {
  const [formState, setFormState] = useState(initialState);
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      await createDpp(formState);
      setMessage('DPP submitted. You can track it in your dashboard.');
      setFormState(initialState);
    } catch (error) {
      setMessage('DPP creation failed. Please retry.');
    }
  };

  return (
    <form className="dpp-form" onSubmit={handleSubmit}>
      <h2>Create a Digital Product Passport</h2>
      <p>Capture structured data and flexible JSONB fields for ESPR readiness.</p>
      <div className="form-grid">
        <label>
          Product name
          <input
            name="productName"
            value={formState.productName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Product ID
          <input
            name="productId"
            value={formState.productId}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Manufacturer
          <input
            name="manufacturer"
            value={formState.manufacturer}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Category
          <input
            name="category"
            value={formState.category}
            onChange={handleChange}
          />
        </label>
        <label>
          Origin
          <input
            name="origin"
            value={formState.origin}
            onChange={handleChange}
          />
        </label>
        <label>
          Materials
          <input
            name="materials"
            value={formState.materials}
            onChange={handleChange}
          />
        </label>
        <label>
          Lifecycle footprint
          <input
            name="lifecycleFootprint"
            value={formState.lifecycleFootprint}
            onChange={handleChange}
          />
        </label>
        <label>
          Certifications
          <input
            name="certifications"
            value={formState.certifications}
            onChange={handleChange}
          />
        </label>
      </div>
      <button className="btn btn-primary" type="submit">
        Submit DPP
      </button>
      {message ? <span className="form-message">{message}</span> : null}
    </form>
  );
}