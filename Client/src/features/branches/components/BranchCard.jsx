import { useEffect, useState } from 'react'
import Button from '../../shared/components/Button'
import { getBranchStatusClass } from '../utils/branchHelpers'
import { useBranchContext } from '../../shared/store/branchContext'
import { useNavigate } from 'react-router-dom'

function BranchCard() {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  const { setActiveBranch } = useBranchContext()
  const navigate = useNavigate()
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(`${API_BASE_URL}/api/branches/get-all`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result?.message || 'Failed to load branches.')
        }

        setBranches(result?.data || [])
      } catch (err) {
        setError(err.message || 'Something went wrong while loading branches.')
      } finally {
        setLoading(false)
      }
    }

    fetchBranches()
  }, [API_BASE_URL])

  const handleViewBranch = (branchName) => {
    setActiveBranch(branchName)
    navigate('/dashboard')
  }

  if (loading) return <p>Loading branches...</p>
  if (error) return <p className="error">{error}</p>
  if (!branches.length) return <p>No branches found.</p>

  return (
    <div className="branch-cards-container">
      {branches.map((branch) => (
        <article key={branch._id} className="branch-card">
          <h3>{branch.branchName}</h3>
          <p><strong>Location:</strong> {branch.location || 'N/A'}</p>
          <p><strong>Description:</strong> {branch.description || '-'}</p>
          <p><strong>Address:</strong> {branch.address || '-'}</p>
          <Button variant="outline" onClick={() => handleViewBranch(branch.branchName)}>View Branch</Button>
        </article>
      ))}
    </div>
  )
}

export default BranchCard
