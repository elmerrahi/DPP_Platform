import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDpp } from '../../utils/api.js';

// Initial form state — flat for ergonomics; assembled into the nested
// schema payload at submit time. Required fields only — optional fields
// (carbon footprint, materials, performance, circularity) are left for a
// future PR that will add multi-page navigation.
const initialState = {
  passport_id: '',
  model_id: '',
  serial_number: '',
  manufacturer_name: '',
  manufacturer_address: '',
  country: '',
  manufacturing_date: '',
  battery_category: 'LMT',
  total_kg: '',
  battery_status: 'Original',
  separate_collection_symbol: true,
  labels_meaning: '',
  eu_doc_id: '',
  due_diligence_url: ''
};

const BATTERY_CATEGORIES = [
  { value: 'LMT', label: 'Light Means of Transport (e-bike, e-scooter)' },
  { value: 'INDUSTRIAL_OVER_2KWH', label: 'Industrial battery (> 2 kWh)' },
  {
    value: 'INDUSTRIAL_STATIONARY_STORAGE_OVER_2KWH',
    label: 'Stationary energy storage (> 2 kWh)'
  },
  { value: 'EV', label: 'Electric vehicle' }
];

const BATTERY_STATUSES = [
  'Original',
  'Repurposed',
  'Re-used',
  'Remanufactured',
  'Waste'
];

function buildPayload(state) {
  return {
    general_info: {
      battery_passport_identification: state.passport_id.trim(),
      battery_identification: {
        model_identification: state.model_id.trim(),
        serial_number: state.serial_number.trim()
      },
      manufacturer_identification: {
        name: state.manufacturer_name.trim(),
        postal_address: state.manufacturer_address.trim()
      },
      manufacturing_place: {
        country: state.country.trim().toUpperCase()
      },
      manufacturing_date: state.manufacturing_date,
      battery_category: state.battery_category,
      battery_weight: {
        total_kg: Number(state.total_kg)
      },
      battery_status: state.battery_status
    },
    compliance: {
      separate_collection_symbol_displayed: Boolean(state.separate_collection_symbol),
      labels_meaning: state.labels_meaning.trim(),
      eu_declaration_of_conformity_id: state.eu_doc_id.trim()
    },
    supply_chain_due_diligence: {
      due_diligence_report_url: state.due_diligence_url.trim()
    }
  };
}

export default function DppForm() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [genericMessage, setGenericMessage] = useState('');

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerErrors([]);
    setGenericMessage('');
    setSubmitting(true);

    try {
      await createDpp({ payload: buildPayload(formState) });
      navigate('/dashboard', {
        state: { flash: 'Battery DPP created successfully.' }
      });
    } catch (error) {
      if (error.status === 422 && Array.isArray(error.body?.detail?.errors)) {
        setServerErrors(error.body.detail.errors);
      } else if (error.status === 401) {
        setGenericMessage('You need to be signed in to create a DPP.');
      } else {
        setGenericMessage(
          'Submission failed. Check the form values and try again.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Map server error paths back to UI fields so the closest input gets the
  // error message inline rather than dumping all errors at the top.
  const errorByField = serverErrors.reduce((acc, err) => {
    acc[err.path] = err.message;
    return acc;
  }, {});

  const fieldError = (path) => errorByField[path];

  return (
    <form className="dpp-form" onSubmit={handleSubmit} noValidate>
      <h2>Create a Battery Digital Product Passport</h2>
      <p>
        Required fields per Regulation (EU) 2023/1542 Article 77 + Annex
        XIII. Optional sections (carbon footprint, materials, performance,
        circularity) will be added in a follow-up.
      </p>

      <fieldset>
        <legend>General information</legend>
        <div className="form-grid">
          <label>
            Battery passport identifier
            <input
              name="passport_id"
              value={formState.passport_id}
              onChange={handleChange}
              required
              placeholder="BAT-LMT-FR-2026-000001"
            />
            {fieldError('general_info.battery_passport_identification') && (
              <span className="field-error">
                {fieldError('general_info.battery_passport_identification')}
              </span>
            )}
          </label>
          <label>
            Battery model
            <input
              name="model_id"
              value={formState.model_id}
              onChange={handleChange}
              required
              placeholder="VeloCity-X1"
            />
          </label>
          <label>
            Serial number
            <input
              name="serial_number"
              value={formState.serial_number}
              onChange={handleChange}
              required
              placeholder="SN-2026-000001"
            />
          </label>
          <label>
            Battery category
            <select
              name="battery_category"
              value={formState.battery_category}
              onChange={handleChange}
              required
            >
              {BATTERY_CATEGORIES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Battery weight (kg)
            <input
              name="total_kg"
              type="number"
              step="0.001"
              min="0.001"
              value={formState.total_kg}
              onChange={handleChange}
              required
              placeholder="2.5"
            />
            {fieldError('general_info.battery_weight.total_kg') && (
              <span className="field-error">
                {fieldError('general_info.battery_weight.total_kg')}
              </span>
            )}
          </label>
          <label>
            Manufacturing date (YYYY-MM)
            <input
              name="manufacturing_date"
              value={formState.manufacturing_date}
              onChange={handleChange}
              required
              placeholder="2026-04"
              pattern="\d{4}-(0[1-9]|1[0-2])"
            />
            {fieldError('general_info.manufacturing_date') && (
              <span className="field-error">
                {fieldError('general_info.manufacturing_date')}
              </span>
            )}
          </label>
          <label>
            Battery status
            <select
              name="battery_status"
              value={formState.battery_status}
              onChange={handleChange}
              required
            >
              {BATTERY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Manufacturer</legend>
        <div className="form-grid">
          <label>
            Manufacturer name
            <input
              name="manufacturer_name"
              value={formState.manufacturer_name}
              onChange={handleChange}
              required
              placeholder="Vélo Manufacturer SAS"
            />
          </label>
          <label>
            Postal address
            <input
              name="manufacturer_address"
              value={formState.manufacturer_address}
              onChange={handleChange}
              required
              placeholder="12 Rue de la Batterie, 75001 Paris, France"
            />
          </label>
          <label>
            Manufacturing country (ISO 3166-1 alpha-2)
            <input
              name="country"
              value={formState.country}
              onChange={handleChange}
              required
              maxLength={2}
              minLength={2}
              placeholder="FR"
            />
            {fieldError('general_info.manufacturing_place.country') && (
              <span className="field-error">
                {fieldError('general_info.manufacturing_place.country')}
              </span>
            )}
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Compliance &amp; labels</legend>
        <div className="form-grid">
          <label className="checkbox-row">
            <input
              type="checkbox"
              name="separate_collection_symbol"
              checked={formState.separate_collection_symbol}
              onChange={handleChange}
            />
            <span>Separate collection symbol displayed on the battery</span>
          </label>
          <label>
            EU declaration of conformity ID
            <input
              name="eu_doc_id"
              value={formState.eu_doc_id}
              onChange={handleChange}
              required
              placeholder="EU-DOC-2026-LMT-000001"
            />
          </label>
          <label className="span-2">
            Meaning of labels &amp; symbols
            <textarea
              name="labels_meaning"
              value={formState.labels_meaning}
              onChange={handleChange}
              required
              rows={2}
              placeholder="Plain-language explanation of every label/symbol on the battery."
            />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Supply chain due diligence</legend>
        <div className="form-grid">
          <label className="span-2">
            Due diligence report URL
            <input
              type="url"
              name="due_diligence_url"
              value={formState.due_diligence_url}
              onChange={handleChange}
              required
              placeholder="https://example.com/due-diligence/2026/lmt-001.pdf"
            />
            {fieldError('supply_chain_due_diligence.due_diligence_report_url') && (
              <span className="field-error">
                {fieldError('supply_chain_due_diligence.due_diligence_report_url')}
              </span>
            )}
          </label>
        </div>
      </fieldset>

      {serverErrors.length > 0 && (
        <div className="form-errors">
          <strong>Validation failed.</strong> Please fix the highlighted
          fields. Full server-side report:
          <ul>
            {serverErrors.map((err, idx) => (
              <li key={idx}>
                <code>{err.path}</code>: {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {genericMessage && <p className="form-message">{genericMessage}</p>}

      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit DPP'}
      </button>
    </form>
  );
}
