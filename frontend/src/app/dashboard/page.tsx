import { ProtectedRoute } from '@/contexts/AuthContext'
import DashboardContent from '@/components/dashboard/DashboardContent'

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    )
} 