import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../utils/api.js';

export default function SignUpForm() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: ''
  });
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
      const data = await signUp(formState);
      if (data?.access_token) {
        localStorage.setItem('dpp_token', data.access_token);
      }
      if (data?.user) {
        localStorage.setItem('dpp_user', JSON.stringify(data.user));
      }
      setMessage('Account created. Redirecting to your dashboard...');
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (error) {
      setMessage('Sign up failed. Please try again.');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Create your account</h2>
      <p>Join the DPP platform built by Young AI Leaders Paris Hub.</p>
      <label>
        Full name
        <input
          type="text"
          name="name"
          value={formState.name}
          onChange={handleChange}
          required
        />
      </label>
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
        Create account
      </button>
      {message ? <span className="form-message">{message}</span> : null}
    </form>
  );
}
