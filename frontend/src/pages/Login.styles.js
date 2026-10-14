export const styles = {
  page: 'min-h-screen bg-[#101915] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-body selection:bg-[#C9F06A] selection:text-black',
  pageBgGlow: 'absolute -top-40 -left-40 w-96 h-96 bg-[#C9F06A]/10 rounded-full blur-3xl pointer-events-none',
  pageBgGlowRight: 'absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none',
  wrapper: 'w-full max-w-5xl grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl bg-[#16221C] border border-white/10 relative z-10 backdrop-blur-2xl',
  
  /* Left Panel */
  leftPanel: 'hidden lg:flex flex-col justify-between p-10 xl:p-12 bg-[#0E1015] border-r border-white/10 relative overflow-hidden',
  leftBgNetwork: 'absolute inset-0 opacity-15 bg-[radial-gradient(#C9F06A_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none',
  logo: 'inline-flex items-center gap-2 text-2xl font-bold text-white font-display',
  logoIcon: 'text-[#C9F06A] font-mono font-black',
  
  heroCopy: 'my-auto py-8',
  heroTitle: 'text-4xl xl:text-5xl font-extrabold text-white leading-tight font-display tracking-tight mb-5',
  heroHighlight: 'text-[#C9F06A] block',
  heroSubtitle: 'text-white/65 text-sm xl:text-base leading-relaxed max-w-sm',
  
  /* Right Panel */
  rightPanel: 'bg-[#16221C] p-8 sm:p-12 flex flex-col justify-center text-white',
  title: 'text-3xl font-extrabold text-white font-display tracking-tight mb-2',
  subtitle: 'text-white/55 text-sm mb-8',
  
  form: 'space-y-4',
  field: 'space-y-1.5',
  label: 'block text-xs font-bold uppercase tracking-wider text-[#C9F06A] font-mono',
  inputWrapper: 'relative',
  inputIcon: 'absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none',
  input: 'w-full pl-10 pr-4 py-3 bg-[#18251E] border border-white/15 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C9F06A] focus:ring-2 focus:ring-[#C9F06A]/20 transition-all',
  
  passwordToggle: 'absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1',
  forgotLink: 'text-xs font-semibold text-[#C9F06A] hover:underline float-right',
  
  checkboxRow: 'flex items-center gap-2 pt-1',
  checkbox: 'rounded border-white/20 bg-[#18251E] text-[#C9F06A] focus:ring-[#C9F06A] w-4 h-4',
  checkboxLabel: 'text-xs font-medium text-white/70 select-none cursor-pointer',
  
  submitButton: 'w-full inline-flex items-center justify-center gap-2 bg-[#C9F06A] hover:bg-[#D8F87C] text-black font-bold py-3.5 px-4 rounded-full text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#C9F06A]/25 hover:-translate-y-0.5 disabled:opacity-60',
  
  dividerRow: 'relative my-6 text-center',
  dividerLine: 'absolute inset-0 flex items-center',
  dividerBorder: 'w-full border-t border-white/10',
  dividerText: 'relative px-3 bg-[#16221C] text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono',
  
  socialGrid: 'grid grid-cols-2 gap-3',
  socialButton: 'inline-flex items-center justify-center gap-2 py-2.5 px-4 border border-white/15 bg-white/5 rounded-xl text-xs font-semibold text-white/80 hover:bg-white/10 hover:border-white/30 transition-all',
  
  footer: 'text-center text-xs text-white/60 mt-8',
  footerLink: 'text-[#C9F06A] font-bold hover:underline ml-1',
}
