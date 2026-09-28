import { useState } from "react";
import { sendOnboardingEmail } from '../services/notificationService'

export default function VendorRegistration({ onDone }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    storeName: "",
    password: "",
    bio: "",
    logo: null,
  });
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setForm((s) => ({ ...s, logo: file }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};
    if (!form.name) nextErrors.name = "Required";
    if (!form.email) nextErrors.email = "Required";
    if (!form.storeName) nextErrors.storeName = "Required";
    if (!form.password || form.password.length < 6)
      nextErrors.password = "Password must be at least 6 characters";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus("submitting");
    await new Promise((r) => setTimeout(r, 800));
    console.log("Vendor registration payload:", form);
    setStatus("success");
    // send onboarding email (demo)
    sendOnboardingEmail(form).catch(e => console.error('onboard notify', e))
    if (onDone) setTimeout(() => onDone(), 1000);
  }

  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="bg-[#e5eee8] px-6 py-8 sm:px-10"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#488367]">Grow with Vendorly</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#172e27]">Bring your shop to life</h2><p className="mt-2 max-w-xl text-sm leading-6 text-[#50665c]">Tell us a little about you and your store. Your next chapter starts here.</p></div>
      <div className="p-6 sm:p-10">

      {status === "success" ? (
        <div className="p-3 bg-emerald-100 rounded-md text-emerald-800">
          Registration successful — check your email for next steps.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">Full name</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`mt-1.5 block w-full rounded-xl border bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6] ${errors.name ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </label>

            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`mt-1.5 block w-full rounded-xl border bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6] ${errors.email ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">Store name</span>
              <input
                name="storeName"
                value={form.storeName}
                onChange={handleChange}
                className={`mt-1.5 block w-full rounded-xl border bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6] ${errors.storeName ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.storeName && <p className="text-xs text-red-600 mt-1">{errors.storeName}</p>}
            </label>

            <label className="block">
              <span className="text-sm font-medium">Password</span>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                minLength={6}
                className={`mt-1.5 block w-full rounded-xl border bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6] ${errors.password ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium">Short bio / description</span>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Store logo (optional)</span>
            <input type="file" accept="image/*" onChange={handleFile} className="mt-2 block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-[#e9f3ed] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#28644d]" />
            {form.logo && <p className="text-sm text-gray-600 mt-1">Selected: {form.logo.name}</p>}
          </label>

          <div className="pt-2">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex items-center rounded-full bg-[#1d5a49] px-6 py-3 text-sm font-semibold text-white hover:bg-[#164638] disabled:opacity-60"
            >
              {status === "submitting" ? "Submitting..." : "Create account"}
            </button>
          </div>
        </form>
      )}
      </div>
    </div>
  );
}
