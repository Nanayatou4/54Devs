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
  
  stepsList: 'my-auto py-8 space-y-7 relative z-10',
  stepRow: 'flex items-start gap-4',
  stepNumberActive: 'w-8 h-8 rounded-full bg-[#C9F06A] text-black font-extrabold text-sm flex items-center justify-center ring-4 ring-[#C9F06A]/20 shrink-0',
  stepNumberInactive: 'w-8 h-8 rounded-full bg-white/5 border border-white/15 text-white/40 font-bold text-sm flex items-center justify-center shrink-0',
  stepTitleActive: 'text-white font-bold text-sm font-display',
  stepTitleInactive: 'text-white/60 font-semibold text-sm font-display',
  stepSubtitle: 'text-white/40 text-xs mt-0.5',
  
  communityBadge: 'inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-xs font-semibold text-white/80 w-fit backdrop-blur-sm',
  communityBadgeHighlight: 'text-[#C9F06A] font-bold',
  
  /* Right Panel */
  rightPanel: 'bg-[#16221C] p-8 sm:p-10 flex flex-col justify-center text-white',
  title: 'text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight mb-1',
  subtitle: 'text-white/55 text-xs sm:text-sm mb-6',
  
  socialGrid: 'grid grid-cols-2 gap-3 mb-5',
  socialButton: 'inline-flex items-center justify-center gap-2 py-2.5 px-3 border border-white/15 bg-white/5 rounded-xl text-xs font-semibold text-white/80 hover:bg-white/10 hover:border-white/30 transition-all shadow-sm',
  
  dividerRow: 'relative my-4 text-center',
  dividerLine: 'absolute inset-0 flex items-center',
  dividerBorder: 'w-full border-t border-white/10',
  dividerText: 'relative px-3 bg-[#16221C] text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono',
  
  form: 'space-y-3.5',
  nameGrid: 'grid grid-cols-2 gap-3',
  field: 'space-y-1',
  label: 'block text-xs font-bold uppercase tracking-wider text-[#C9F06A] font-mono',
  input: 'w-full px-3.5 py-2.5 bg-[#18251E] border border-white/15 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C9F06A] focus:ring-2 focus:ring-[#C9F06A]/20 transition-all',
  
  passwordWrapper: 'relative',
  passwordToggle: 'absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1',
  
  strengthSection: 'space-y-1 pt-0.5',
  strengthBarContainer: 'flex gap-1.5 h-1.5 w-full',
  strengthBar: 'flex-1 rounded-full bg-white/10 transition-all duration-300',
  strengthLabel: 'text-[10px] font-bold uppercase tracking-wider text-[#C9F06A]',
  
  checkboxRow: 'flex items-start gap-2 pt-1.5',
  checkbox: 'rounded border-white/20 bg-[#18251E] text-[#C9F06A] focus:ring-[#C9F06A] w-4 h-4 mt-0.5 shrink-0',
  checkboxText: 'text-[11px] text-white/60 leading-normal select-none cursor-pointer',
  
  submitButton: 'w-full inline-flex items-center justify-center gap-2 bg-[#C9F06A] hover:bg-[#D8F87C] text-black font-bold py-3.5 px-4 rounded-full text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#C9F06A]/25 hover:shadow-[#C9F06A]/40 hover:-translate-y-0.5 disabled:opacity-60',
  
  footer: 'text-center text-xs text-white/60 mt-5',
  footerLink: 'text-[#C9F06A] font-bold hover:underline ml-1',
}
