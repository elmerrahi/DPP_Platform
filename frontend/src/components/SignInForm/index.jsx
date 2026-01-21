import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../utils/api.js';

export default function SignInForm() {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const data = await signIn(formState);
      if (data?.access_token) {
        localStorage.setItem('dpp_token', data.access_token);
      }
      if (data?.user) {
        localStorage.setItem('dpp_user', JSON.stringify(data.user));
      }
      setMessage('Signed in. Redirecting to your dashboard...');
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (error) {
      setMessage('Sign in failed. Check your credentials.');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Welcome back</h2>
      <p>Securely access your DPP workspace.</p>
      <label>
        Email
        <input
          type="email"
          name="email"
          value={formState.email}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          name="password"
          value={formState.password}
          onChange={handleChange}
          required
        />
      </label>
      <button className="btn btn-primary" type="submit">
        Sign in
      </button>
      {message ? <span className="form-message">{message}</span> : null}
    </form>
  );
}
