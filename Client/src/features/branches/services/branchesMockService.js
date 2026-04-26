export const philippineRegionLocations = {
  'NCR - National Capital Region': [
    'Manila City',
    'Quezon City',
    'Makati City',
    'Taguig City',
    'Pasig City',
  ],
  'CAR - Cordillera Administrative Region': [
    'Abra',
    'Apayao',
    'Benguet',
    'Ifugao',
    'Kalinga',
    'Mountain Province',
    'Baguio City',
  ],
  'Region I - Ilocos Region': ['Ilocos Norte', 'Ilocos Sur', 'La Union', 'Pangasinan'],
  'Region II - Cagayan Valley': ['Batanes', 'Cagayan', 'Isabela', 'Nueva Vizcaya', 'Quirino'],
  'Region III - Central Luzon': [
    'Aurora',
    'Bataan',
    'Bulacan',
    'Nueva Ecija',
    'Pampanga',
    'Tarlac',
    'Zambales',
    'Angeles City',
    'Olongapo City',
  ],
  'Region IV-A - CALABARZON': ['Batangas', 'Cavite', 'Laguna', 'Quezon', 'Rizal'],
  'Region IV-B - MIMAROPA': ['Marinduque', 'Occidental Mindoro', 'Oriental Mindoro', 'Palawan', 'Romblon'],
  'Region V - Bicol Region': ['Albay', 'Camarines Norte', 'Camarines Sur', 'Catanduanes', 'Masbate', 'Sorsogon'],
  'Region VI - Western Visayas': ['Aklan', 'Antique', 'Capiz', 'Guimaras', 'Iloilo', 'Negros Occidental', 'Iloilo City', 'Bacolod City'],
  'Region VII - Central Visayas': ['Bohol', 'Cebu', 'Negros Oriental', 'Siquijor', 'Cebu City', 'Mandaue City', 'Lapu-Lapu City'],
  'Region VIII - Eastern Visayas': ['Biliran', 'Eastern Samar', 'Leyte', 'Northern Samar', 'Samar', 'Southern Leyte', 'Tacloban City'],
  'Region IX - Zamboanga Peninsula': ['Zamboanga del Norte', 'Zamboanga del Sur', 'Zamboanga Sibugay', 'Zamboanga City'],
  'Region X - Northern Mindanao': ['Bukidnon', 'Camiguin', 'Lanao del Norte', 'Misamis Occidental', 'Misamis Oriental', 'Cagayan de Oro City'],
  'Region XI - Davao Region': [
    'Davao de Oro',
    'Davao del Norte',
    'Davao del Sur',
    'Davao Occidental',
    'Davao Oriental',
    'Tagum City',
    'Davao City',
  ],
  'Region XII - SOCCSKSARGEN': [
    'Cotabato',
    'Sarangani',
    'South Cotabato',
    'Sultan Kudarat',
    'General Santos City',
    'Cotabato City',
  ],
  'Region XIII - Caraga': ['Agusan del Norte', 'Agusan del Sur', 'Dinagat Islands', 'Surigao del Norte', 'Surigao del Sur', 'Butuan City'],
  'BARMM - Bangsamoro Autonomous Region in Muslim Mindanao': ['Basilan', 'Lanao del Sur', 'Maguindanao del Norte', 'Maguindanao del Sur', 'Sulu', 'Tawi-Tawi', 'Marawi City', 'Lamitan City'],
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const parseResponse = async (response, fallbackMessage) => {
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result?.message || fallbackMessage)
  }

  return result
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const branchRows = [
  {
    id: 1,
    branchName: 'Tagum Main Branch',
    region: 'Region XI - Davao Region',
    location: 'Tagum City',
    address: 'Osmena St., Tagum City, Davao del Norte',
    description: 'Main operations branch',
    type: 'Main Branch',
    status: 'Operational',
  },
  {
    id: 2,
    branchName: 'Panabo Branch',
    region: 'Region XI - Davao Region',
    location: 'Davao del Norte',
    address: 'JP Laurel Ave., Panabo, Davao del Norte',
    description: 'North area service branch',
    type: 'Branch',
    status: 'Operational',
  },
  {
    id: 3,
    branchName: 'Quezon City Branch',
    region: 'NCR - National Capital Region',
    location: 'Quezon City',
    address: 'Timog Ave., Quezon City',
    description: 'Metro Manila support branch',
    type: 'Branch',
    status: 'Operational',
  },
]

export const branchesService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/branches/get-all`)
    const result = await parseResponse(response, 'Failed to fetch branches')

    return (result?.data || []).map((branch) => ({
      id: branch._id,
      branchName: branch.branchName,
      region: branch.region || '',
      provinceCity: branch.provinceCity || '',
      municipality: branch.municipality || '',
      specificLocation: branch.specificLocation || '',
      location: branch.location,
      address: branch.address,
      description: branch.description,
      type: branch.type || 'Branch',
      status: branch.status || 'Operational',
    }))
  },

  getByLocation: async (location) => {
    if (!location) {
      return branchesService.getAll()
    }

    const response = await fetch(
      `${API_BASE_URL}/api/branches/get-by-location/${encodeURIComponent(location)}`,
    )

    // If no exact backend match, fallback to client-side contains search from full list.
    if (response.status === 404) {
      const allBranches = await branchesService.getAll()
      const keyword = location.toLowerCase()
      return allBranches.filter((branch) =>
        `${branch.location} ${branch.address}`.toLowerCase().includes(keyword),
      )
    }

    const result = await parseResponse(response, 'Failed to fetch branches by location')
    return (result?.data || []).map((branch) => ({
      id: branch._id,
      branchName: branch.branchName,
      region: branch.region || '',
      provinceCity: branch.provinceCity || '',
      municipality: branch.municipality || '',
      specificLocation: branch.specificLocation || '',
      location: branch.location,
      address: branch.address,
      description: branch.description,
      type: branch.type || 'Branch',
      status: branch.status || 'Operational',
    }))
  },

  create: async (branchData) => {
    const response = await fetch(`${API_BASE_URL}/api/branches/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(branchData),
    })

    const result = await parseResponse(response, 'Failed to create branch')
    return result?.data
  },

  update: async (branchId, branchData) => {
    const response = await fetch(`${API_BASE_URL}/api/branches/${branchId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(branchData),
    })

    const result = await parseResponse(response, 'Failed to update branch')
    return result?.data
  },

  delete: async (branchId, authorizationPassword) => {
    const response = await fetch(`${API_BASE_URL}/api/branches/${branchId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ authorizationPassword }),
    })

    await parseResponse(response, 'Failed to delete branch')
    return true
  },
}
