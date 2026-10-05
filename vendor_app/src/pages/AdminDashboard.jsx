import { useMemo, useState } from 'react'
import Container from '../components/Container'
import * as applicationService from '../data/sellerApplicationService'
import { useAuth } from '../context/AuthContext'

const statusStyles = {
  pending_review: 'bg-amber-100 text-amber-800',
  verified: 'bg-emerald-100 text-emerald-800',
  banned: 'bg-red-100 text-red-800',
  rejected: 'bg-slate-200 text-slate-700',
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState(() => applicationService.list())

  const stats = useMemo(() => {
    const counts = { pending_review: 0, verified: 0, banned: 0, rejected: 0 }
    applications.forEach((application) => {
      counts[application.status] = (counts[application.status] || 0) + 1
    })
    return counts
  }, [applications])

  function updateStatus(id, status) {
    applicationService.updateStatus(id, status)
    setApplications(applicationService.list())
  }

  return (
    <Container>
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">Marketplace control</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Company Admin Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Signed in as {user?.email || 'company admin'}.</p>
          </div>
          <div className="rounded-full border border-[#dfece4] bg-[#eff7f1] px-4 py-2 text-sm font-medium text-[#1d5a49]">
            Admin authorization enabled
          </div>
        </div>

        <div className="mb-7 grid grid-cols-4 gap-2 sm:gap-3">
          <StatCard label="Pending" value={stats.pending_review || 0} tone="bg-amber-50 text-amber-700" />
          <StatCard label="Verified" value={stats.verified || 0} tone="bg-emerald-50 text-emerald-700" />
          <StatCard label="Banned" value={stats.banned || 0} tone="bg-red-50 text-red-700" />
          <StatCard label="Total" value={applications.length} tone="bg-slate-100 text-slate-700" />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-semibold text-slate-900">Seller authorization queue</h2>
          </div>

          <div className="divide-y divide-slate-200">
            {applications.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">No seller applications yet. New registrations will appear here.</div>
            ) : (
              applications.map((application) => (
                <div key={application.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-base font-semibold text-slate-900">{application.storeName || 'Unnamed store'}</h3>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[application.status] || 'bg-slate-100 text-slate-700'}`}>
                        {application.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">Owner: {application.name} · {application.email}</p>
                    <p className="mt-1 text-sm text-slate-500">{application.bio || 'No store description provided.'}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => updateStatus(application.id, 'verified')} className="rounded-full bg-[#1d5a49] px-4 py-2 text-xs font-semibold text-white hover:bg-[#164638]">
                      Verify seller
                    </button>
                    <button type="button" onClick={() => updateStatus(application.id, 'banned')} className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100">
                      Ban seller
                    </button>
                    <button type="button" onClick={() => updateStatus(application.id, 'rejected')} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}

function StatCard({ label, value, tone }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:p-4">
      <p className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-500 sm:text-[10px]">{label}</p>
      <p className={`mt-2 text-lg font-semibold tracking-tight sm:mt-3 sm:text-2xl ${tone}`}>{value}</p>
    </div>
  )
}
