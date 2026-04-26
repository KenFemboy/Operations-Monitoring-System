import LoginForm from '../components/LoginForm'

function LoginPage() {
  return (
    <div className="login-screen">
      <section className="login-card">
        <div className="page-header">
          <h1>Welcome to Ally's</h1>
          <p>Sign in to continue</p>
        </div>
        <LoginForm />
      </section>
    </div>
  )
}

export default LoginPage
