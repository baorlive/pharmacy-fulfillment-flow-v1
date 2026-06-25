'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import type { FilterKey } from '@/lib/types';
import Icon from '@/components/ui/Icon';

interface FilterBarProps {
  filter: FilterKey;
  search: string;
  stageCounts: Record<string, number>;
  onSetFilter: (f: FilterKey) => void;
  onSetSearch: (s: string) => void;
}

const PRIMARY_FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'new_waiting_payment', label: 'New' },
  { key: 'packing', label: 'Preparing' },
  { key: 'ready_to_ship', label: 'Packed' },
];

const DROPDOWN_FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'delivering', label: 'Delivering' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'rejected', label: 'Reject' },
];

const DROPDOWN_FILTER_KEYS = new Set(DROPDOWN_FILTERS.map(f => f.key));
const SEARCH_COLLAPSED_WIDTH_PX = 54;
const SEARCH_WIDTH_SIDE_PADDING_PX = 32;
const SEARCH_WIDTH_BORDER_ALLOWANCE_PX = 3;
const SEARCH_MAX_WIDTH_PX = 360;
const SEARCH_FOCUS_DELAY_MS = 10;

export default function FilterBar({ filter, search, stageCounts, onSetFilter, onSetSearch }: FilterBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchExpandedWidth, setSearchExpandedWidth] = useState(SEARCH_COLLAPSED_WIDTH_PX);
  const filtersRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isDropdownActive = DROPDOWN_FILTER_KEYS.has(filter);
  const othersCount =
    (stageCounts.delivering ?? 0) +
    (stageCounts.delivered ?? 0) +
    (stageCounts.completed ?? 0) +
    (stageCounts.cancelled ?? 0) +
    (stageCounts.rejected ?? 0);
  const activeDropdownLabel = DROPDOWN_FILTERS.find(f => f.key === filter)?.label ?? 'Others';

  function handleSearchContainerClick() {
    if (!searchExpanded) {
      setSearchExpanded(true);
      setTimeout(() => searchInputRef.current?.focus(), SEARCH_FOCUS_DELAY_MS);
    }
  }

  function handleSearchBlur() {
    setTimeout(() => {
      if (document.activeElement !== searchInputRef.current && !search.trim()) {
        setSearchExpanded(false);
      }
    }, 0);
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      onSetSearch('');
      searchInputRef.current?.blur();
      setSearchExpanded(false);
    }
  }

  useEffect(() => {
    function onClickOutside() {
      if (dropdownOpen) setDropdownOpen(false);
    }
    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    const filtersEl = filtersRef.current;
    const tabsEl = tabsRef.current;
    if (!filtersEl || !tabsEl) return;

    const recalcSearchWidth = () => {
      const filtersWidth = filtersEl.clientWidth;
      const tabsNaturalWidth = Array.from(tabsEl.children).reduce((width, child) => (
        width + (child as HTMLElement).getBoundingClientRect().width
      ), 0);
      const freeWidth = filtersWidth - tabsNaturalWidth - SEARCH_WIDTH_SIDE_PADDING_PX - SEARCH_WIDTH_BORDER_ALLOWANCE_PX;
      const next = Math.floor(Math.max(SEARCH_COLLAPSED_WIDTH_PX, Math.min(SEARCH_MAX_WIDTH_PX, freeWidth)));
      setSearchExpandedWidth(next);
    };

    recalcSearchWidth();
    const resizeObserver = new ResizeObserver(recalcSearchWidth);
    resizeObserver.observe(filtersEl);
    resizeObserver.observe(tabsEl);
    window.addEventListener('resize', recalcSearchWidth);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', recalcSearchWidth);
    };
  }, []);

  const searchStyle = useMemo(() => (
    { ['--search-expanded-width' as string]: `${searchExpandedWidth}px` }
  ), [searchExpandedWidth]);

  return (
    <div className="list-filters" ref={filtersRef}>
      <div className="topbar-mid" ref={tabsRef}>
        {PRIMARY_FILTERS.map(({ key, label }) => (
          <button
            key={key}
            className={`stat-chip ${filter === key ? 'active' : ''}`}
            data-filter={key}
            type="button"
            onClick={() => { setDropdownOpen(false); onSetFilter(key); }}
          >
            {label}
            <span className="stat-chip-badge">{stageCounts[key] ?? 0}</span>
          </button>
        ))}

        <div
          className={`stat-dropdown-wrap ${isDropdownActive ? 'active' : ''} ${dropdownOpen ? 'open' : ''}`}
          onClick={e => e.stopPropagation()}
        >
          <button
            className="stat-dropdown-trigger"
            type="button"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            onClick={() => setDropdownOpen(prev => !prev)}
          >
            <span>{isDropdownActive ? activeDropdownLabel : 'Others'}</span>
            <span className="stat-chip-badge">{othersCount}</span>
            <span className="stat-dropdown-caret" aria-hidden="true" />
          </button>
          <div className="stat-dropdown-menu" role="menu">
            {DROPDOWN_FILTERS.map(({ key, label }) => (
              <button
                key={key}
                className={`stat-dropdown-item ${filter === key ? 'active' : ''}`}
                type="button"
                data-filter={key}
                role="menuitem"
                onClick={() => { onSetFilter(key); setDropdownOpen(false); }}
              >
                <span>{label}</span>
                <span className="stat-chip-badge">{stageCounts[key] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`list-search ${searchExpanded ? 'is-expanded' : ''}`}
        style={searchStyle}
        role="search"
        aria-expanded={searchExpanded}
        tabIndex={searchExpanded ? -1 : 0}
        onClick={handleSearchContainerClick}
        onKeyDown={e => { if (!searchExpanded && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); handleSearchContainerClick(); } }}
      >
        <div className="search-wrap">
          <span className="search-icon" aria-hidden="true">
            <Icon name="search" />
          </span>
          <input
            ref={searchInputRef}
            className="search-input"
            type="text"
            placeholder="Search name or order ID…"
            value={search}
            onChange={e => onSetSearch(e.target.value)}
            onBlur={handleSearchBlur}
            onKeyDown={handleSearchKeyDown}
            aria-label="Search orders"
          />
        </div>
      </div>
    </div>
  );
}
