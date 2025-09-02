import { useState, useEffect, useRef } from "react";
import { Search, Check, MapPin } from "lucide-react";

interface LawSchool {
  id: number;
  name: string;
  slug: string;
}

interface LawSchoolSearchProps {
  selectedSchool?: LawSchool | null;
  onSelect: (school: LawSchool | null) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function LawSchoolSearch({ 
  selectedSchool, 
  onSelect, 
  placeholder = "Search for your law school...",
  required = false,
  className = ""
}: LawSchoolSearchProps) {
  const [query, setQuery] = useState(selectedSchool?.name || "");
  const [schools, setSchools] = useState<LawSchool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search for schools
  useEffect(() => {
    const searchSchools = async () => {
      if (query.length < 2) {
        setSchools([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/law-schools/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setSchools(Array.isArray(data) ? data : []);
        } else {
          setSchools([]);
        }
      } catch (error) {
        console.error('Failed to search law schools:', error);
        setSchools([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchSchools, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(true);
    setHighlightedIndex(-1);
    
    // Clear selection if query doesn't match selected school
    if (selectedSchool && !selectedSchool.name.toLowerCase().includes(newQuery.toLowerCase())) {
      onSelect(null);
    }
  };

  // Handle school selection
  const handleSelect = (school: LawSchool) => {
    setQuery(school.name);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onSelect(school);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || schools.length === 0) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < schools.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : schools.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < schools.length) {
          handleSelect(schools[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          className="w-full p-4 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200"
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />
        
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>

        {selectedSchool && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Check className="w-5 h-5 text-green-500" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (schools.length > 0 || query.length >= 2) && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-64 overflow-y-auto"
          role="listbox"
        >
          {schools.length > 0 ? (
            schools.map((school, index) => (
              <button
                key={school.id}
                onClick={() => handleSelect(school)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 first:rounded-t-2xl last:rounded-b-2xl border-b border-gray-100 last:border-b-0 ${
                  highlightedIndex === index ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                }`}
                role="option"
                aria-selected={highlightedIndex === index}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{school.name}</div>
                  </div>
                </div>
              </button>
            ))
          ) : query.length >= 2 ? (
            <div className="px-4 py-3 text-gray-500 text-center">
              {isLoading ? 'Searching...' : 'No law schools found'}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
