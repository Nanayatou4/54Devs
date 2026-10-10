export const styles = {
  page: 'min-h-screen bg-gray-50',
  inner: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12',

  /* Header */
  header: 'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8',
  headerLeft: 'flex-1',
  title: 'text-3xl md:text-4xl font-bold text-gray-900 mb-1',
  subtitle: 'text-gray-500 text-sm',
  headerActions: 'flex items-center gap-3 shrink-0',
  publishButton: 'inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition',
  myProjectsLink: 'inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition',

  /* Search & Filters */
  filtersSection: 'bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-8',
  searchRow: 'mb-4',
  searchInput: 'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition',
  filtersGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3',
  filterSelect: 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition',
  filterInput: 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition',
  filterLabel: 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1',

  /* Project cards grid */
  projectsGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8',

  /* Project card */
  projectCard: 'bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition group flex flex-col',
  cardBody: 'p-5 flex-1 flex flex-col',
  cardHeaderRow: 'flex items-start justify-between gap-2 mb-2',
  cardTitle: 'font-bold text-gray-900 group-hover:text-primary transition text-base',
  cardStatus: 'text-[10px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0',
  cardDescription: 'text-gray-500 text-sm line-clamp-2 mb-3',
  cardSkills: 'flex flex-wrap gap-1.5 mb-3',
  cardSkillPill: 'text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary',
  cardFooter: 'mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400',
  cardCreator: 'flex items-center gap-1',
  cardPlaces: 'font-medium',
  cardBadgeClosed: 'text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-600 whitespace-nowrap shrink-0',

  /* Loading skeleton */
  loadingWrapper: 'flex items-center justify-center py-20',
  skeletonGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8',
  skeletonCard: 'bg-white rounded-2xl border border-gray-200 p-5 animate-pulse',
  skeletonLine: 'h-4 bg-gray-200 rounded mb-3',
  skeletonLineShort: 'h-4 bg-gray-200 rounded w-2/3 mb-3',
  skeletonLineXs: 'h-3 bg-gray-200 rounded w-1/3',

  /* Empty state */
  emptyState: 'bg-white rounded-2xl border border-gray-200 p-16 text-center',
  emptyIconWrapper: 'w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-5',
  emptyTitle: 'text-xl font-bold text-gray-900 mb-2',
  emptyText: 'text-gray-500 max-w-md mx-auto mb-6',
  clearFiltersButton: 'inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold transition',
  emptyCreateButton: 'inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition',

  /* Error state */
  errorState: 'bg-white rounded-2xl border border-red-200 p-16 text-center',
  errorIconWrapper: 'w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5',
  errorTitle: 'text-xl font-bold text-gray-900 mb-2',
  errorText: 'text-gray-500 max-w-md mx-auto mb-6',
  retryButton: 'inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition',

  /* Pagination */
  pagination: 'flex items-center justify-center gap-2 mt-2',
  pageButton: 'px-3.5 py-2 rounded-lg text-sm font-medium transition',
  pageButtonActive: 'bg-primary text-white',
  pageButtonInactive: 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50',
  pageButtonDisabled: 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200',
}
