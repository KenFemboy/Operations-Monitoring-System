import { useState } from 'react'
import { initialCredentials } from '../utils/constants'

function useAuthForm() {
  const [credentials, setCredentials] = useState(initialCredentials)

  const updateField = (field, value) => {
    setCredentials((current) => ({ ...current, [field]: value }))
  }

  return { credentials, updateField }
}

export default useAuthForm
