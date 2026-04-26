import { useNavigate } from 'react-router-dom'
import Button from '../../shared/components/Button'
import useAuthForm from '../hooks/useAuthForm'

function LoginForm() {
  const navigate = useNavigate()
  const { credentials, updateField } = useAuthForm()

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={credentials.username}
          onChange={(event) => updateField('username', event.target.value)}
          placeholder="Enter username"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={credentials.password}
          onChange={(event) => updateField('password', event.target.value)}
          placeholder="Enter password"
        />
      </div>
      <Button type="submit">Login</Button>
    </form>
  )
}

export default LoginForm
