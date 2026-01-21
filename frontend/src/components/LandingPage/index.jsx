import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function LandingPage() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hi! Ask me anything about Digital Product Passports (DPPs).'
    }
  ]);
  const [input, setInput] = useState('');

  const sdgItems = [
    { id: 'sdg-12', label: 'SDG 12', title: 'Responsible Consumption' },
    { id: 'sdg-9', label: 'SDG 9', title: 'Industry & Innovation' },
    { id: 'sdg-13', label: 'SDG 13', title: 'Climate Action' }
  ];

  const quickAnswers = [
    {
      match: ['what is a dpp', 'what is dpp', 'define dpp'],
      response:
        'A Digital Product Passport is a structured record of a product’s materials, origin, lifecycle, and compliance data.'
    },
    {
      match: ['espr', 'regulation', 'eu'],
      response:
        'DPPs support ESPR compliance by keeping product data auditable and traceable across the lifecycle.'
    },
    {
      match: ['benefits', 'why'],
      response:
        'DPPs improve transparency, enable faster audits, and help prove sustainability claims.'
    },
    {
      match: ['data', 'fields'],
      response:
        'Typical fields include materials, origin, certifications, repairability, and lifecycle footprint.'
    }
  ];

  const handleChatSubmit = (event) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }
    const lower = trimmed.toLowerCase();
    const matched = quickAnswers.find((answer) =>
      answer.match.some((term) => lower.includes(term))
    );
    const reply =
      matched?.response ||
      'Great question. DPPs capture compliance and sustainability data so products can be verified throughout their lifecycle.';

    setMessages((prev) => [
      ...prev,
      { role: 'user', text: trimmed },
      { role: 'bot', text: reply }
    ]);
    setInput('');
  };

  return (
    <section className="landing">
      <div className="landing-hero">
        <div className="hero-copy">
          <p className="eyebrow">Digital Product Passport Platform</p>
          <h1>
            Empowering sustainability with Digital Product Passports.
          </h1>
          <p className="hero-lead">
            Advancing the SDGs through AI for Good by turning product data into
            transparent, audit-ready sustainability signals.
          </p>
          <div className="hero-logos">
            <span className="logo-badge">AI for Good</span>
            <span className="logo-badge">ITU</span>
            <span className="logo-badge">Young AI Leaders Paris Hub</span>
          </div>
          <div className="sdg-strip">
            {sdgItems.map((item, index) => (
              <div
                key={item.id}
                className="sdg-card"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <span className="sdg-label">{item.label}</span>
                <span className="sdg-title">{item.title}</span>
              </div>
            ))}
          </div>
          <div className="hero-actions">
            <Link className="btn btn-primary btn-hero" to="/get-started">
              Get started
            </Link>
          </div>
          <div className="hero-highlights">
            <div>
              <h3>Compliance-first</h3>
              <p>Structured fields + JSONB flexibility for changing regs.</p>
            </div>
            <div>
              <h3>Audit-ready</h3>
              <p>Upload existing passports and receive fast feedback.</p>
            </div>
            <div>
              <h3>AI-ready</h3>
              <p>Placeholder hooks for compliance scoring and transformers.</p>
            </div>
          </div>
        </div>
        <div className="hero-side">
          <div className="chatbot-panel">
            <div className="chatbot-header">
              <h3>DPP Assistant</h3>
              <span className="pill">Ask about DPPs</span>
            </div>
            <div className="chatbot-messages">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`chatbot-bubble ${message.role}`}>
                  {message.text}
                </div>
              ))}
            </div>
            <form className="chatbot-form" onSubmit={handleChatSubmit}>
              <input
                type="text"
                placeholder="Ask about ESPR, SDGs, or DPP data..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <button className="btn btn-secondary" type="submit">
                Send
              </button>
            </form>
          </div>
          <div className="hero-card">
            <div className="card-top">
              <p className="card-title">Live DPP Snapshot</p>
              <span className="pill">ESPR core</span>
            </div>
            <ul className="card-list">
              <li>Material origin: verified</li>
              <li>Lifecycle footprint: 18.4 kg CO2e</li>
              <li>Repairability: 8/10</li>
              <li>Compliance score: 92%</li>
            </ul>
            <Link className="btn btn-glow" to="/get-started">
              Get started
            </Link>
          </div>
        </div>
      </div>
      <div className="landing-flow">
        <div className="flow-item">
          <span>01</span>
          <h4>Capture</h4>
          <p>Collect product data across supply chain and certifications.</p>
        </div>
        <div className="flow-item">
          <span>02</span>
          <h4>Validate</h4>
          <p>Run automated checks for coverage, format, and compliance.</p>
        </div>
        <div className="flow-item">
          <span>03</span>
          <h4>Launch</h4>
          <p>Ship ready-to-share passports with audit trails.</p>
        </div>
      </div>
    </section>
  );
}
