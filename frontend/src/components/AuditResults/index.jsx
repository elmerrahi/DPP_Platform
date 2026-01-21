import { useState } from 'react';
import { auditDpp } from '../../utils/api.js';

export default function AuditResults() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Upload a file to run an audit.');
      return;
    }
    setMessage('');
    try {
      const response = await auditDpp(file);
      setResult(response);
    } catch (error) {
      setMessage('Audit failed. Try again with a supported file.');
    }
  };

  return (
    <div className="audit-panel">
      <div className="audit-card">
        <h2>Audit a DPP</h2>
        <p>Upload a PDF, JSON, or XML passport to receive compliance feedback.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept=".pdf,.json,.xml"
            onChange={(event) => setFile(event.target.files[0])}
          />
          <button className="btn btn-primary" type="submit">
            Run audit
          </button>
        </form>
        {message ? <span className="form-message">{message}</span> : null}
      </div>
      <div className="audit-results">
        <h3>Compliance Snapshot</h3>
        {result ? (
          <div className="results-grid">
            <div>
              <span>Score</span>
              <strong>{result.score ?? 'N/A'}%</strong>
            </div>
            <div>
              <span>Coverage</span>
              <strong>{result.coverage ?? 'N/A'}</strong>
            </div>
            <div>
              <span>Findings</span>
              <strong>{result.findings ?? 'N/A'}</strong>
            </div>
          </div>
        ) : (
          <p className="results-empty">No audit yet. Upload a file to begin.</p>
        )}
      </div>
    </div>
  );
}