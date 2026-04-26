import Button from '../../shared/components/Button'

function SettingsForm({ form, onChange }) {
  return (
    <form>
      <div className="form-group">
        <label htmlFor="systemName">System Name</label>
        <input
          id="systemName"
          value={form.systemName}
          onChange={(event) => onChange('systemName', event.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="supportEmail">Support Email</label>
        <input
          id="supportEmail"
          value={form.supportEmail}
          onChange={(event) => onChange('supportEmail', event.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="timezone">Timezone</label>
        <select
          id="timezone"
          value={form.timezone}
          onChange={(event) => onChange('timezone', event.target.value)}
        >
          <option value="Asia/Manila">Asia/Manila</option>
          <option value="Asia/Singapore">Asia/Singapore</option>
          <option value="UTC">UTC</option>
        </select>
      </div>
      <Button>Save</Button>
    </form>
  )
}

export default SettingsForm
