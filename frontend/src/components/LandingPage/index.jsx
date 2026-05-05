import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

export default function LandingPage() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hi! Ask me anything about Digital Product Passports (DPPs).'
    }
  ]);
  const [input, setInput] = useState('');
  const messagesRef = useRef(null);

  const sdgItems = [
    { id: 'sdg-12', label: 'SDG 12', title: 'Responsible Consumption' },
    { id: 'sdg-9', label: 'SDG 9', title: 'Industry & Innovation' },
    { id: 'sdg-13', label: 'SDG 13', title: 'Climate Action' }
  ];

  const faqItems = [
    {
      id: 'espr-definition',
      question: 'What is the Ecodesign for Sustainable Products Regulation (ESPR)?',
      answer:
        'The Ecodesign for Sustainable Products Regulation (ESPR) is an EU regulation that improves product sustainability by requiring durability, repairability, recyclability, and energy efficiency across the full lifecycle.'
    },
    {
      id: 'espr-objectives',
      question: 'What are the main objectives of ESPR?',
      answer:
        'ESPR aims to reduce lifecycle environmental impact, improve durability and recyclability, prevent planned obsolescence, and boost transparency for circular economy practices.'
    },
    {
      id: 'dpp-definition',
      question: 'What is a Digital Product Passport (DPP)?',
      answer:
        'A Digital Product Passport (DPP) is a standardized digital record describing a product\'s sustainability, composition, and lifecycle data, accessible via a QR code or identifier.'
    },
    {
      id: 'dpp-espr',
      question: 'How does the Digital Product Passport support the goals of ESPR?',
      answer:
        'DPPs translate ESPR requirements into actionable data, enabling compliance monitoring, informed choices, repairability, recycling, and supply-chain transparency.'
    },
    {
      id: 'dpp-info',
      question: 'What types of information must be included in a Digital Product Passport?',
      answer:
        'Depending on the product, a DPP may include identification, materials, environmental footprint, repairability, spare parts, certifications, and end-of-life guidance.'
    },
    {
      id: 'dpp-owner',
      question: 'Who is responsible for creating and maintaining a Digital Product Passport?',
      answer:
        'Manufacturers are primarily responsible, with importers and distributors sharing obligations depending on supply-chain roles.'
    },
    {
      id: 'dpp-access',
      question: 'Who can access Digital Product Passport data, and for what purposes?',
      answer:
        'Consumers, regulators, repairers, recyclers, and manufacturers access DPP data for purchasing, compliance, repair, recycling, and design optimization; access levels vary by sensitivity.'
    },
    {
      id: 'dpp-governance',
      question: 'What are the main data governance challenges associated with DPPs?',
      answer:
        'Key challenges include data accuracy, access control, interoperability, security of sensitive data, and lifecycle data maintenance.'
    },
    {
      id: 'dpp-circular',
      question: 'How do Digital Product Passports support the circular economy?',
      answer:
        'DPPs improve traceability and reuse, enable repair and recycling, and reduce waste by making lifecycle data accessible.'
    },
    {
      id: 'dpp-importance',
      question: 'Why are ESPR and DPPs important for sustainable and compliant markets?',
      answer:
        'They make sustainability enforceable through transparent, auditable data, promoting accountability, compliance, and circularity across the EU market.'
    }
  ];

  const handleChatSubmit = (event) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }
    const lower = trimmed.toLowerCase();
    const matched = faqItems.find((item) => {
      const question = item.question.toLowerCase();
      return question === lower || question.includes(lower) || lower.includes(question);
    });
    const reply =
      matched?.answer ||
      'Great question. DPPs capture compliance and sustainability data so products can be verified throughout their lifecycle.';

    setMessages((prev) => [
      ...prev,
      { role: 'user', text: trimmed },
      { role: 'bot', text: reply }
    ]);
    setInput('');
  };

  const handleSuggestionClick = (question) => {
    const matched = faqItems.find((item) => item.question === question);
    if (!matched) {
      return;
    }
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: matched.question },
      { role: 'bot', text: matched.answer }
    ]);
  };

  useEffect(() => {
    if (!messagesRef.current) {
      return;
    }
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

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
              <span className="pill">
                <span className="status-dot" />
                Live guidance
              </span>
            </div>
            <div className="chatbot-messages" ref={messagesRef}>
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`chatbot-bubble ${message.role}`}
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <div className="chatbot-suggestions">
              <p>Try one of these:</p>
              <div className="suggestion-grid">
                {faqItems.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className="suggestion-chip"
                    onClick={() => handleSuggestionClick(item.question)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {item.question}
                  </button>
                ))}
              </div>
            </div>
            <form className="chatbot-form" onSubmit={handleChatSubmit}>
              <input
                type="text"
                placeholder="Ask about ESPR, DPPs, and compliance..."
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
