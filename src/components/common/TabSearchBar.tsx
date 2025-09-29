import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Divider,
} from '@mui/material';
import { IconSearch, IconX } from '@tabler/icons-react';

interface SearchResult {
    id: string;
    title: string;
    subtitle?: string;
    data: any;
}

interface TabSearchBarProps {
    placeholder?: string;
    data: any[];
    searchFields: string[];
    onResultClick?: (result: SearchResult) => void;
    onFilterChange?: (filteredData: any[]) => void;
    maxResults?: number;
    disabled?: boolean;
}

// Global state to track open dropdowns
let globalDropdownState = {
    isOpen: false,
    closeCallback: null as (() => void) | null,
};

const TabSearchBar: React.FC<TabSearchBarProps> = ({
    placeholder = "Search...",
    data = [],
    searchFields = [],
    onResultClick,
    onFilterChange,
    maxResults = 10,
    disabled = false,
}) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Helper function to get nested object values
    const getNestedValue = (obj: any, path: string): string => {
        return path.split('.').reduce((current, key) => current?.[key], obj) || '';
    };

    // Filter data based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setShowResults(false);
            // Reset filtered data when search is cleared
            if (onFilterChange) {
                onFilterChange(data);
            }
            return;
        }

        const filtered = data
            .filter((item) => {
                return searchFields.some((field) => {
                    const value = getNestedValue(item, field);
                    return value && value.toString().toLowerCase().includes(searchQuery.toLowerCase());
                });
            });

        // Update the parent component's filtered data
        if (onFilterChange) {
            onFilterChange(filtered);
        }

        // Create dropdown results (limited to maxResults)
        const dropdownResults = filtered
            .slice(0, maxResults)
            .map((item) => {
                // Get the primary title (first search field)
                const primaryTitle = getNestedValue(item, searchFields[0]);

                // For quizzes, show subject as title and lesson as subtitle
                let title = primaryTitle || 'Untitled';
                let subtitle = undefined;

                // Check if this is a quiz item (has subject property)
                if (item.subject?.name) {
                    title = item.subject.name;
                    if (item.topic?.name) {
                        subtitle = item.topic.name;
                    } else if (item.name) {
                        subtitle = item.name;
                    } else {
                        subtitle = 'Quiz';
                    }
                } else {
                    // For non-quiz items, use original logic
                    if (title === 'Untitled' && item.name) {
                        title = item.name;
                    }

                    // Get subtitle (second search field if different from primary)
                    if (searchFields.length > 1) {
                        const subtitleValue = getNestedValue(item, searchFields[1]);
                        if (subtitleValue && subtitleValue !== title) {
                            subtitle = subtitleValue;
                        }
                    }
                }

                return {
                    id: item._id || item.id || Math.random().toString(),
                    title: title,
                    subtitle: subtitle,
                    data: item,
                };
            });

        setSearchResults(dropdownResults);
        // Do NOT auto-open here to avoid reopen-after-close. Opening is controlled by focus/typing.
    }, [searchQuery, data, searchFields, maxResults, onFilterChange]);

    // Close and reset on route change to avoid blocking navigation/highlight
    useEffect(() => {
        const handleRouteStart = () => {
            setShowResults(false);
            setSearchQuery('');
            if (onFilterChange) {
                onFilterChange(data);
            }
        };

        router.events.on('routeChangeStart', handleRouteStart);
        return () => {
            router.events.off('routeChangeStart', handleRouteStart);
        };
    }, [router.events, onFilterChange, data]);

    // Global click handler - only one instance
    useEffect(() => {
        const handleGlobalClick = (event: MouseEvent) => {
            const target = event.target as Element;
            const searchElement = searchRef.current;
            if (!searchElement) return;
            if (searchElement.contains(target)) return; // inside

            // Always defer closing to the next tick so navigation handlers run first
            setTimeout(() => {
                setShowResults(false);
                try { inputRef.current?.blur(); } catch { }
                globalDropdownState.isOpen = false;
                globalDropdownState.closeCallback = null;
            }, 0);
        };

        const handleGlobalEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowResults(false);
                globalDropdownState.isOpen = false;
                globalDropdownState.closeCallback = null;
            }
        };

        // Use capture phase to ensure we don't get prevented by internal handlers
        document.addEventListener('click', handleGlobalClick, true);
        document.addEventListener('keydown', handleGlobalEscape, false);

        return () => {
            document.removeEventListener('click', handleGlobalClick, true);
            document.removeEventListener('keydown', handleGlobalEscape, false);
        };
    }, []);

    // Keep a minimal global signal only; avoid storing callbacks that change each render
    useEffect(() => {
        globalDropdownState.isOpen = showResults;
        if (!showResults) {
            globalDropdownState.closeCallback = null;
        }
    }, [showResults]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setShowResults(true);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setShowResults(false);
    };

    const handleResultClick = (result: SearchResult) => {
        if (onResultClick) {
            onResultClick(result);
        }
        setShowResults(false);
        setSearchQuery('');
    };

    const handleInputFocus = () => {
        if (searchQuery.trim() && searchResults.length > 0) {
            setShowResults(true);
        }
    };

    return (
        <Box ref={searchRef} sx={{ position: 'relative', width: '100%', maxWidth: 400 }}>
            <TextField
                ref={inputRef}
                fullWidth
                variant="outlined"
                placeholder={placeholder}
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleInputFocus}
                disabled={disabled}
                size="small"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconSearch size={18} />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            {searchQuery && (
                                <IconButton onClick={handleClearSearch} size="small">
                                    <IconX size={16} />
                                </IconButton>
                            )}
                        </InputAdornment>
                    ),
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                        backgroundColor: 'background.paper',
                    },
                }}
            />

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                        mt: 0.5,
                        maxHeight: 300,
                        overflow: 'auto',
                        boxShadow: 3,
                    }}
                >
                    <List dense>
                        {searchResults.map((result, index) => (
                            <React.Fragment key={result.id}>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => handleResultClick(result)}>
                                        <ListItemText
                                            primary={result.title}
                                            secondary={result.subtitle}
                                            primaryTypographyProps={{
                                                variant: 'body2',
                                                fontWeight: 500,
                                            }}
                                            secondaryTypographyProps={{
                                                variant: 'caption',
                                                color: 'text.secondary',
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                                {index < searchResults.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            )}

            {/* No Results Message */}
            {showResults && searchQuery && searchResults.length === 0 && (
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                        mt: 0.5,
                        p: 2,
                        boxShadow: 3,
                    }}
                >
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        No results found
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default TabSearchBar;