import SignInForm from '../components/SignInForm/index.jsx';
import SignUpForm from '../components/SignUpForm/index.jsx';

export default function AuthChoice() {
  return (
    <section className="page-shell auth-choice">
      <div className="auth-choice-header">
        <h2>Get started</h2>
        <p>Sign up to create your first DPP or sign in to continue.</p>
      </div>
      <div className="auth-choice-grid">
        <SignUpForm />
        <SignInForm />
      </div>
    </section>
  );
}
