import { useMemo, useState } from 'react'

function normalizeOption(option) {
  if (typeof option === 'string') {
    return { label: option, value: option }
  }

  return option
}

function SelectDropdown({
  id,
  name,
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  enableSearch = false,
  searchPlaceholder = 'Search...',
}) {
  const [searchTerm, setSearchTerm] = useState('')

  const normalizedOptions = useMemo(() => options.map(normalizeOption), [options])

  const filteredOptions = useMemo(() => {
    if (!enableSearch || !searchTerm.trim()) {
      return normalizedOptions
    }

    const keyword = searchTerm.trim().toLowerCase()

    return normalizedOptions.filter((option) =>
      option.label.toLowerCase().includes(keyword),
    )
  }, [enableSearch, normalizedOptions, searchTerm])

  return (
    <div className={`form-group ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>
      {enableSearch ? (
        <input
          type="text"
          className="select-search-input"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder={searchPlaceholder}
          disabled={disabled}
        />
      ) : null}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {filteredOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SelectDropdown
