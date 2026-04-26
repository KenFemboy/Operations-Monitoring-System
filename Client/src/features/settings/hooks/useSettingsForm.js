import { useState } from 'react'
import { settingsDefaults } from '../services/settingsMockService'

function useSettingsForm() {
  const [form, setForm] = useState(settingsDefaults)

  const onChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  return { form, onChange }
}

export default useSettingsForm
