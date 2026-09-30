import { useState } from 'react'
import { Link } from 'react-router-dom'
import * as applicationService from '../data/sellerApplicationService'

const emptyForm = { name: '', email: '', storeName: '', bio: '', logo: null }

export default function VendorRegistration(){
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  const [application, setApplication] = useState(null)

  function handleChange(event){
    const { name, value } = event.target
    setForm(current => ({ ...current, [name]: value }))
    setErrors(current => ({ ...current, [name]: '' }))
  }

  function handleFile(event){
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setForm(current => ({ ...current, logo: null }))
      setErrors(current => ({ ...current, logo: 'Choose an image file.' }))
      event.target.value = ''
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setForm(current => ({ ...current, logo: null }))
      setErrors(current => ({ ...current, logo: 'Choose an image smaller than 2 MB.' }))
      event.target.value = ''
      return
    }
    setErrors(current => ({ ...current, logo: '' }))
    setForm(current => ({ ...current, logo: file }))
  }

  function handleSubmit(event){
    event.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Enter your full name.'
    if (!form.email.trim()) nextErrors.email = 'Enter an email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = 'Enter a valid email address.'
    if (!form.storeName.trim()) nextErrors.storeName = 'Enter a store name.'
    if (errors.logo) nextErrors.logo = errors.logo
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setStatus('submitting')
    const saved = applicationService.create({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      storeName: form.storeName.trim(),
      bio: form.bio.trim(),
      logoName: form.logo?.name || '',
    })
    setApplication(saved)
    setStatus('success')
  }

  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="bg-[#e5eee8] px-6 py-8 sm:px-10"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">Grow with Vendorly</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#172e27]">Bring your shop to life</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#50665c]">Tell us a little about you and your store. Your next chapter starts here.</p></div>
      <div className="p-6 sm:p-10">
        {status === 'success' ? (
          <div role={application?.persisted === false ? 'alert' : 'status'} className={`rounded-2xl border p-5 ${application?.persisted === false ? 'border-amber-200 bg-amber-50 text-amber-950' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>
            <p className="font-semibold">Application received in demo mode</p>
            <p className="mt-2 text-sm leading-6">{application?.storeName} is marked as pending review. {application?.persisted === false ? 'Browser storage is unavailable, so this application is available for this session only and may not survive a refresh.' : 'This preview stores the application in this browser only.'} It does not create an active account or send email.</p>
            <div className="mt-5 flex flex-wrap gap-3"><Link to="/" className="rounded-full bg-[#1d5a49] px-5 py-3 text-sm font-semibold text-white hover:bg-[#164638]">Back to marketplace</Link><Link to="/signin" state={{ demoApplication: application }} className="rounded-full border border-emerald-300 px-5 py-3 text-sm font-semibold text-emerald-900 hover:bg-white">Preview seller sign-in</Link></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
            <p className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">Demo application only. This form does not create or activate a seller account.</p>
            <div className="grid gap-4 md:grid-cols-2">
              <label htmlFor="seller-name" className="block text-sm font-medium text-slate-700">Full name
                <input id="seller-name" name="name" autoComplete="name" value={form.name} onChange={handleChange} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'seller-name-error' : undefined} className={`mt-1.5 block w-full rounded-xl border bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6] ${errors.name ? 'border-red-400' : 'border-slate-200'}`} />
                {errors.name && <span id="seller-name-error" role="alert" className="mt-1 block text-xs text-red-700">{errors.name}</span>}
              </label>
              <label htmlFor="seller-register-email" className="block text-sm font-medium text-slate-700">Email
                <input id="seller-register-email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'seller-email-error' : undefined} className={`mt-1.5 block w-full rounded-xl border bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6] ${errors.email ? 'border-red-400' : 'border-slate-200'}`} />
                {errors.email && <span id="seller-email-error" role="alert" className="mt-1 block text-xs text-red-700">{errors.email}</span>}
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label htmlFor="seller-store-name" className="block text-sm font-medium text-slate-700">Store name
                <input id="seller-store-name" name="storeName" autoComplete="organization" value={form.storeName} onChange={handleChange} aria-invalid={Boolean(errors.storeName)} aria-describedby={errors.storeName ? 'seller-store-error' : undefined} className={`mt-1.5 block w-full rounded-xl border bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6] ${errors.storeName ? 'border-red-400' : 'border-slate-200'}`} />
                {errors.storeName && <span id="seller-store-error" role="alert" className="mt-1 block text-xs text-red-700">{errors.storeName}</span>}
              </label>
            </div>

            <label htmlFor="seller-bio" className="block text-sm font-medium text-slate-700">Short store description
              <textarea id="seller-bio" name="bio" value={form.bio} onChange={handleChange} rows={4} placeholder="What do you make or sell?" className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" />
            </label>

            <label htmlFor="seller-logo" className="block text-sm font-medium text-slate-700">Store logo <span className="font-normal text-slate-500">(optional, max 2 MB)</span>
              <input id="seller-logo" type="file" accept="image/*" onChange={handleFile} aria-invalid={Boolean(errors.logo)} aria-describedby={errors.logo ? 'seller-logo-error' : 'seller-logo-hint'} className="mt-2 block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-[#e9f3ed] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#28644d]" />
              {errors.logo ? <span id="seller-logo-error" role="alert" className="mt-1 block text-xs text-red-700">{errors.logo}</span> : <span id="seller-logo-hint" className="mt-1 block text-xs text-slate-500">The image is not uploaded in the frontend demo.</span>}
              {form.logo && <span className="mt-1 block text-xs text-slate-600">Selected: {form.logo.name}</span>}
            </label>

            <div className="pt-2"><button type="submit" disabled={status === 'submitting'} className="inline-flex items-center rounded-full bg-[#1d5a49] px-6 py-3 text-sm font-semibold text-white hover:bg-[#164638] disabled:cursor-wait disabled:opacity-60">{status === 'submitting' ? 'Submitting...' : 'Submit seller application'}</button></div>
          </form>
        )}
      </div>
    </div>
  )
}
