import { useState, useEffect, useRef } from 'react';
import { router, usePage, Link } from '@inertiajs/react';
import { PageProps, SearchBarType } from '~/types';
import axios from 'axios';
import styles from '~styles/components/ui/searchbar.module.scss';

export const Searchbar = ({ placeholder, initialValue = "", variant = 'default' }: SearchBarType) => {
    const { props } = usePage<PageProps>();

    const isHeaderMode = variant === 'header';
    const brandContextId = (props.brand as any)?.id || (props.beverage as any)?.brand_id || null;

    const [query, setQuery] = useState(initialValue);
    const [results, setResults] = useState<{ brands: any[], beverages: any[] }>({ brands: [], beverages: [] });
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const searchRef = useRef<HTMLDivElement>(null);

    const flatResults = [
        ...results.brands.map(b => ({ ...b, type: 'brand' })),
        ...results.beverages.map(b => ({ ...b, type: 'beverage' }))
    ];

    // helper to reset search bar state completely
    const closeAndClear = () => {
        setIsOpen(false);
        setQuery('');
        setResults({ brands: [], beverages: [] });
        setActiveIndex(-1);
    };

    // handle active search for Collectors page
    useEffect(() => {
        if (isHeaderMode) return;
        const delayDebounceFn = setTimeout(() => {
            if (query !== initialValue) {
                router.get(window.location.pathname, { search: query }, {
                    preserveState: true,
                    replace: true,
                    only: ['collectors', 'filters']
                });
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // handle live API search for Header dropdown
    useEffect(() => {
        if (!isHeaderMode) return;
        if (query.length < 2) {
            setResults({ brands: [], beverages: [] });
            setIsOpen(false);
            return;
        }

        const fetchResults = setTimeout(async () => {
            try {
                const res = await axios.get('/api/search', {
                    params: { q: query, brand_id: brandContextId }
                });
                setResults(res.data);
                if (res.data.brands.length > 0 || res.data.beverages.length > 0) {
                    setIsOpen(true);
                } else {
                    setIsOpen(false);
                }
                setActiveIndex(-1);
            } catch (err) {
                console.error("Search API Error:", err);
            }
        }, 200);

        return () => clearTimeout(fetchResults);
    }, [query, isHeaderMode]);

    // close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || !isHeaderMode) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(p => (p < flatResults.length - 1 ? p + 1 : p)); }
        if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(p => (p > 0 ? p - 1 : -1)); }
        if (e.key === 'Enter' && activeIndex >= 0) {
            const item = flatResults[activeIndex];
            const targetUrl = item.type === 'brand'
                ? `/catalogue/${item.slug}`
                : `/catalogue/${item.brand.slug}/${item.slug}`;

            router.visit(targetUrl);
            closeAndClear();
        }
    };

    return (
        <div className={`${styles['search-container']} ${isHeaderMode ? styles['variant-header'] : styles['variant-default']}`} ref={searchRef}>
            <input
                type="text"
                value={query}
                placeholder={isHeaderMode ? "Search the database..." : placeholder}
                onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
                onKeyDown={handleKeyDown}
                className={styles['search-input']}
                autoComplete="off"
            />

            {isHeaderMode && isOpen && (results.brands.length > 0 || results.beverages.length > 0) && (
                <div className={styles['dropdown']}>
                    {results.brands.length > 0 && (
                        <div className={styles['dropdown__section']}>
                            <label>Brands</label>
                            {results.brands.map((brand, idx) => (
                                <Link
                                    key={`br-${brand.id}`}
                                    href={`/catalogue/${brand.slug}`}
                                    className={`${styles['item']} ${activeIndex === idx ? styles['active'] : ''}`}
                                    onClick={closeAndClear}
                                >
                                    {brand.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {results.beverages.length > 0 && (
                        <div className={styles['dropdown__section']}>
                            <label>Beverages</label>
                            {results.beverages.map((bev, idx) => {
                                const globalIdx = results.brands.length + idx;
                                return (
                                    <Link
                                        key={`be-${bev.id}`}
                                        href={`/catalogue/${bev.brand.slug}/${bev.slug}`}
                                        className={`${styles['item']} ${activeIndex === globalIdx ? styles['active'] : ''}`}
                                        onClick={closeAndClear}
                                    >
                                        <div className={styles['item__info']}>
                                            <span className={styles['item__info__name']}>{bev.name}</span>
                                            <span className={styles['item__info__brand-tag']}>{bev.brand.name}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};