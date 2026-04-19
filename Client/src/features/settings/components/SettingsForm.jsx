import Button from '../../shared/components/Button'
import { payrollCycles } from '../utils/payrollCycles'

function SettingsForm({ form, onChange }) {
  return (
    <form>
      <div className="form-group">
        <label htmlFor="companyName">Company Name</label>
        <input
          id="companyName"
          value={form.companyName}
          onChange={(event) => onChange('companyName', event.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="payrollCycle">Payroll Cycle</label>
        <select
          id="payrollCycle"
          value={form.payrollCycle}
          onChange={(event) => onChange('payrollCycle', event.target.value)}
        >
          {payrollCycles.map((cycle) => (
            <option key={cycle} value={cycle}>
              {cycle}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="buffetAdultPrice">Buffet Price - Adult</label>
        <input
          id="buffetAdultPrice"
          value={form.buffetAdultPrice}
          onChange={(event) => onChange('buffetAdultPrice', event.target.value)}
          placeholder="499"
        />
      </div>
      <div className="form-group">
        <label htmlFor="buffetKidPrice">Buffet Price - Kid</label>
        <input
          id="buffetKidPrice"
          value={form.buffetKidPrice}
          onChange={(event) => onChange('buffetKidPrice', event.target.value)}
          placeholder="299"
        />
      </div>
      <div className="form-group">
        <label htmlFor="buffetSeniorPrice">Buffet Price - Senior</label>
        <input
          id="buffetSeniorPrice"
          value={form.buffetSeniorPrice}
          onChange={(event) => onChange('buffetSeniorPrice', event.target.value)}
          placeholder="399"
        />
      </div>
      <Button>Save</Button>
    </form>
  )
}

export default SettingsForm
