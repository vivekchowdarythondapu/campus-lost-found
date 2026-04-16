import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Search, SlidersHorizontal, MapPin, Calendar, X } from 'lucide-react';

const categories = [
  'Electronics', 'Books', 'Clothing', 'Accessories',
  'Documents', 'Keys', 'Bags', 'Jewellery', 'Vehicles', 'Other'
];

const locations = [
  'Library', 'Cafeteria', 'Admin Block', 'SR Block',
  'Main Block', 'Hostel', 'Sports Complex', 'Parking',
  'Auditorium', 'Lab Block', 'Other'
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
    sortBy: searchParams.get('sortBy') || 'newest'
  });

  const activeFilterCount = [
    filters.type, filters.category, filters.location,
    filters.dateFrom, filters.dateTo
  ].filter(Boolean).length;

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.location) params.location = filters.location;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      params.limit = 20;

      const { data } = await API.get('/items', { params });
      setItems(data.items);
      setTotal(data.total);
    } catch {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // Update URL params
    const params = {};
    if (filters.search) params.q = filters.search;
    if (filters.type) params.type = filters.type;
    if (filters.category) params.category = filters.category;
    if (filters.location) params.location = filters.location;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;
    if (filters.sortBy !== 'newest') params.sortBy = filters.sortBy;
    setSearchParams(params);
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      category: '',
      location: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'newest'
    });
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen dot-grid">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            Search Items
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Find lost or found items across campus
          </p>
        </div>

        {/* Search Bar */}
        <div className="glass rounded-2xl border border-[var(--border)] p-4 mb-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--muted)' }} />
              <input
                type="text"
                placeholder="Search by title, description, location..."
                value={filters.search}
                onChange={e => updateFilter('search', e.target.value)}
                className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                autoFocus
              />
              {filters.search && (
                <button
                  onClick={() => updateFilter('search', '')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--muted)' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium glass border transition-all relative"
              style={{
                borderColor: showFilters || activeFilterCount > 0
                  ? 'var(--accent)'
                  : 'var(--border)',
                color: showFilters || activeFilterCount > 0
                  ? 'var(--accent)'
                  : 'var(--muted)'
              }}
            >
              <SlidersHorizontal size={15} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full text-white flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--accent)' }}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <select
              value={filters.sortBy}
              onChange={e => updateFilter('sortBy', e.target.value)}
              className="input-dark px-4 py-3 rounded-xl text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">

                {/* Type */}
                <div>
                  <label className="block text-xs font-medium mb-1.5"
                    style={{ color: 'var(--muted)' }}>Type</label>
                  <select
                    value={filters.type}
                    onChange={e => updateFilter('type', e.target.value)}
                    className="input-dark w-full px-3 py-2 rounded-lg text-sm"
                  >
                    <option value="">All Types</option>
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-medium mb-1.5"
                    style={{ color: 'var(--muted)' }}>Category</label>
                  <select
                    value={filters.category}
                    onChange={e => updateFilter('category', e.target.value)}
                    className="input-dark w-full px-3 py-2 rounded-lg text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-medium mb-1.5"
                    style={{ color: 'var(--muted)' }}>Location</label>
                  <select
                    value={filters.location}
                    onChange={e => updateFilter('location', e.target.value)}
                    className="input-dark w-full px-3 py-2 rounded-lg text-sm"
                  >
                    <option value="">All Locations</option>
                    {locations.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-xs font-medium mb-1.5"
                    style={{ color: 'var(--muted)' }}>Date From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={e => updateFilter('dateFrom', e.target.value)}
                    className="input-dark w-full px-3 py-2 rounded-lg text-sm"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-xs font-medium mb-1.5"
                    style={{ color: 'var(--muted)' }}>Date To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={e => updateFilter('dateTo', e.target.value)}
                    className="input-dark w-full px-3 py-2 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Clear filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-3 flex items-center gap-1.5 text-xs transition-colors"
                  style={{ color: 'var(--danger)' }}
                >
                  <X size={12} /> Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Active filter tags */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.type && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--accent)', border: '1px solid rgba(108,99,255,0.2)' }}>
                {filters.type}
                <button onClick={() => updateFilter('type', '')}><X size={10} /></button>
              </span>
            )}
            {filters.category && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--accent)', border: '1px solid rgba(108,99,255,0.2)' }}>
                {filters.category}
                <button onClick={() => updateFilter('category', '')}><X size={10} /></button>
              </span>
            )}
            {filters.location && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--accent)', border: '1px solid rgba(108,99,255,0.2)' }}>
                {filters.location}
                <button onClick={() => updateFilter('location', '')}><X size={10} /></button>
              </span>
            )}
            {filters.dateFrom && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--accent)', border: '1px solid rgba(108,99,255,0.2)' }}>
                From: {filters.dateFrom}
                <button onClick={() => updateFilter('dateFrom', '')}><X size={10} /></button>
              </span>
            )}
            {filters.dateTo && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--accent)', border: '1px solid rgba(108,99,255,0.2)' }}>
                To: {filters.dateTo}
                <button onClick={() => updateFilter('dateTo', '')}><X size={10} /></button>
              </span>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {loading ? 'Searching...' : `${total} result${total !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i}
                className="glass rounded-2xl border border-[var(--border)] h-64 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Search size={48} className="mx-auto mb-4 opacity-20"
              style={{ color: 'var(--muted)' }} />
            <h3 className="font-display text-xl font-semibold text-white mb-2">
              No items found
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
              Try different keywords or remove some filters
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="btn-primary px-6 py-2.5 rounded-xl text-sm font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item, i) => (
              <Link to={`/items/${item._id}`} key={item._id}>
                <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden item-card">
                  {item.image ? (
                    <img src={item.image} alt={item.title}
                      className="w-full h-44 object-cover" />
                  ) : (
                    <div className="w-full h-44 flex items-center justify-center text-4xl"
                      style={{
                        background: item.type === 'lost'
                          ? 'rgba(255,77,109,0.05)'
                          : 'rgba(0,214,143,0.05)'
                      }}>
                      {item.category === 'Electronics' ? '📱' :
                       item.category === 'Books' ? '📚' :
                       item.category === 'Keys' ? '🔑' :
                       item.category === 'Bags' ? '🎒' :
                       item.category === 'Jewellery' ? '💍' :
                       item.category === 'Vehicles' ? '🚗' :
                       item.type === 'lost' ? '❓' : '📦'}
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        item.type === 'lost' ? 'badge-lost' : 'badge-found'
                      }`}>{item.type.toUpperCase()}</span>
                      <span className="badge-category text-xs px-2.5 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm line-clamp-2 mb-3"
                      style={{ color: 'var(--muted)' }}>
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between text-xs"
                      style={{ color: 'var(--muted)' }}>
                      <span className="flex items-center gap-1">
                        <MapPin size={11} /> {item.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;