import SettingsForm from '../components/SettingsForm'
import useSettingsForm from '../hooks/useSettingsForm'

function SettingsPage() {
  const { form, onChange } = useSettingsForm()

  return (
    <section>
      <header className="page-header">
        <h1>Settings</h1>
        <p>Manage Superadmin system preferences</p>
      </header>
      <section className="card" style={{ maxWidth: '540px' }}>
        <SettingsForm form={form} onChange={onChange} />
      </section>
    </section>
  )
}

export default SettingsPage
