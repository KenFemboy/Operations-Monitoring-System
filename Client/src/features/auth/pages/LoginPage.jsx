import LoginForm from '../components/LoginForm'

function LoginPage() {
  return (
    <div className="login-screen">
      <section className="login-card">
        <div className="page-header">
          <h1>Ally's Restaurant Management System</h1>
          <p>Sign in to access the frontend-only prototype</p>
        </div>
        <LoginForm />
      </section>
    </div>
  )
}

export default LoginPage
