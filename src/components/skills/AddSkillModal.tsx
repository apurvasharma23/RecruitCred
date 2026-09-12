import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Skill } from '../../types';
import {
  X,
  Plus,
  ShieldCheck,
  Search,
  Check,
  ChevronDown,
  Sparkles,
  Layers
} from 'lucide-react';

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type SkillCategoryOption =
  | 'Programming'
  | 'Web Development'
  | 'Data & AI'
  | 'Mechanical Engineering'
  | 'CAD & Design'
  | 'Electronics & Embedded'
  | 'Robotics'
  | 'Manufacturing'
  | 'Business & Professional'
  | 'Other';

export interface LibrarySkillItem {
  name: string;
  category: SkillCategoryOption;
  mappedAppCategory: Skill['category'];
  description: string;
}

export const COMPREHENSIVE_SKILL_LIBRARY: LibrarySkillItem[] = [
  // Programming
  { name: 'Python', category: 'Programming', mappedAppCategory: 'Backend', description: 'Core Python syntax, list comprehensions, decorators, OOP & data structures' },
  { name: 'C', category: 'Programming', mappedAppCategory: 'Systems', description: 'Pointers, memory management, C structs, and systems fundamentals' },
  { name: 'C++', category: 'Programming', mappedAppCategory: 'Systems', description: 'Modern C++, STL containers, RAII, templates & virtual dispatch' },
  { name: 'Java', category: 'Programming', mappedAppCategory: 'Backend', description: 'JVM architecture, multithreading, Spring Boot & enterprise OOP' },
  { name: 'JavaScript', category: 'Programming', mappedAppCategory: 'Frontend', description: 'ES6+, event loop, closures, async/await, and prototypes' },
  { name: 'TypeScript', category: 'Programming', mappedAppCategory: 'Frontend', description: 'Static type checking, generics, union types, and TS compiler' },

  // Web Development
  { name: 'React', category: 'Web Development', mappedAppCategory: 'Frontend', description: 'React 18 concurrency, custom hooks, Virtual DOM, and state management' },
  { name: 'HTML', category: 'Web Development', mappedAppCategory: 'Frontend', description: 'Semantic HTML5, accessibility (a11y), DOM structure, and SEO tags' },
  { name: 'CSS', category: 'Web Development', mappedAppCategory: 'Frontend', description: 'Flexbox, Grid, animations, CSS variables, and responsive design' },
  { name: 'Next.js', category: 'Web Development', mappedAppCategory: 'Frontend', description: 'Server-side rendering (SSR), App Router, dynamic routes, and API endpoints' },

  // Data & AI
  { name: 'SQL', category: 'Data & AI', mappedAppCategory: 'Backend', description: 'Relational queries, complex joins, indexing, ACID, and aggregations' },
  { name: 'Pandas', category: 'Data & AI', mappedAppCategory: 'AI & ML', description: 'Dataframe manipulation, time series cleaning, aggregations & filtering' },
  { name: 'NumPy', category: 'Data & AI', mappedAppCategory: 'AI & ML', description: 'Multidimensional matrix operations, vectorization, and linear algebra' },
  { name: 'Data Analysis', category: 'Data & AI', mappedAppCategory: 'AI & ML', description: 'Exploratory data analysis, statistical modeling, and telemetry reporting' },
  { name: 'Machine Learning', category: 'Data & AI', mappedAppCategory: 'AI & ML', description: 'Supervised/unsupervised models, regression, gradient boosting, and evaluation' },
  { name: 'Computer Vision', category: 'Data & AI', mappedAppCategory: 'AI & ML', description: 'Image segmentation, CNNs, object detection, and visual recognition' },
  { name: 'OpenCV', category: 'Data & AI', mappedAppCategory: 'AI & ML', description: 'Real-time image filtering, edge detection, video feeds, and transforms' },

  // Mechanical Engineering & CAD
  { name: 'AutoCAD', category: 'CAD & Design', mappedAppCategory: 'Systems', description: '2D drafting, geometric dimensioning, architectural & mechanical schematics' },
  { name: 'SolidWorks', category: 'CAD & Design', mappedAppCategory: 'Systems', description: '3D parametric solid modeling, assembly mates, and engineering drawings' },
  { name: 'Fusion 360', category: 'CAD & Design', mappedAppCategory: 'Systems', description: 'Cloud parametric modeling, generative design, and CAM toolpaths' },
  { name: 'CATIA', category: 'CAD & Design', mappedAppCategory: 'Systems', description: 'Surface modeling, aerospace/automotive sheet metal & assemblies' },
  { name: '3D Modeling', category: 'CAD & Design', mappedAppCategory: 'Systems', description: 'Mesh geometry, volumetric solid modeling, and rendering' },
  { name: 'CAD Design', category: 'CAD & Design', mappedAppCategory: 'Systems', description: 'Computer-aided design standards, tolerances, and mechanical parts' },
  { name: 'Mechanical Design', category: 'Mechanical Engineering', mappedAppCategory: 'Systems', description: 'Stress deformation analysis, material selection, and mechanism synthesis' },
  { name: 'Manufacturing', category: 'Manufacturing', mappedAppCategory: 'Systems', description: 'CNC machining, injection molding, GD&T, and process quality control' },

  // Electronics & Embedded
  { name: 'Robotics', category: 'Robotics', mappedAppCategory: 'Systems', description: 'Kinematics, PID motor control, ROS nodes, and sensor fusion' },
  { name: 'Arduino', category: 'Electronics & Embedded', mappedAppCategory: 'Systems', description: 'Microcontroller I/O, UART/I2C protocols, and prototyping' },
  { name: 'ESP32', category: 'Electronics & Embedded', mappedAppCategory: 'Systems', description: 'Wi-Fi/Bluetooth IoT nodes, FreeRTOS tasks, and low-power telemetry' },
  { name: 'Embedded C', category: 'Electronics & Embedded', mappedAppCategory: 'Systems', description: 'Bare-metal register manipulation, timer interrupts, and memory constraints' },
  { name: 'Microcontrollers', category: 'Electronics & Embedded', mappedAppCategory: 'Systems', description: 'ARM Cortex-M architecture, ADC/DAC peripherals, and clocks' },
  { name: 'PCB Design', category: 'Electronics & Embedded', mappedAppCategory: 'Systems', description: 'Schematic capture, PCB layout routing, trace impedance, and Gerber outputs' },
  { name: 'Sensors & Instrumentation', category: 'Electronics & Embedded', mappedAppCategory: 'Systems', description: 'Signal conditioning, transducer calibration, and analog data acquisition' },
  { name: 'Electronics Fundamentals', category: 'Electronics & Embedded', mappedAppCategory: 'Systems', description: 'Ohm’s law, circuit analysis, semiconductors, and power electronics' },

  // Business & Professional Skills
  { name: 'Problem Solving', category: 'Business & Professional', mappedAppCategory: 'Systems', description: 'Algorithmic logic, edge-case analysis, and structured troubleshooting' },
  { name: 'Technical Communication', category: 'Business & Professional', mappedAppCategory: 'Systems', description: 'Engineering documentation, API specifications, and stakeholder briefings' },
  { name: 'Project Management', category: 'Business & Professional', mappedAppCategory: 'Systems', description: 'Agile/Scrum roadmaps, sprint scoping, risk matrices, and delivery' },
  { name: 'Teamwork', category: 'Business & Professional', mappedAppCategory: 'Systems', description: 'Cross-functional engineering collaboration and peer code reviews' },
  { name: 'Leadership', category: 'Business & Professional', mappedAppCategory: 'Systems', description: 'Technical squad mentorship, task delegation, and architectural direction' },
  { name: 'Technical Presentation', category: 'Business & Professional', mappedAppCategory: 'Systems', description: 'Demoing engineering prototypes and pitching to technical evaluators' }
];

export const AddSkillModal: React.FC<AddSkillModalProps> = ({ isOpen, onClose }) => {
  const { addSkill, currentUser } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSkill, setSelectedSkill] = useState<LibrarySkillItem | null>(null);
  const [customSkillName, setCustomSkillName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories: string[] = [
    'All',
    'Programming',
    'Web Development',
    'Data & AI',
    'Mechanical Engineering',
    'CAD & Design',
    'Electronics & Embedded',
    'Robotics',
    'Manufacturing',
    'Business & Professional',
    'Other'
  ];

  const existingSkillNames = useMemo(() => {
    return currentUser.skills.map(s => s.name.toLowerCase());
  }, [currentUser.skills]);

  const filteredSkills = useMemo(() => {
    return COMPREHENSIVE_SKILL_LIBRARY.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Reset highlight index when filtered list changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredSkills.length]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleSelectSkill = (item: LibrarySkillItem) => {
    if (existingSkillNames.includes(item.name.toLowerCase())) {
      return; // duplicate prevention
    }
    setSelectedSkill(item);
    setSearchQuery(item.name);
    setCustomSkillName('');
    setIsDropdownOpen(false);
  };

  const handleClearSelection = () => {
    setSelectedSkill(null);
    setSearchQuery('');
    setCustomSkillName('');
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsDropdownOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % Math.max(1, filteredSkills.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev - 1 + filteredSkills.length) % Math.max(1, filteredSkills.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSkills[highlightedIndex]) {
        handleSelectSkill(filteredSkills[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const skillNameToAdd = selectedSkill ? selectedSkill.name : (customSkillName.trim() || searchQuery.trim());
    if (!skillNameToAdd) return;

    if (existingSkillNames.includes(skillNameToAdd.toLowerCase())) {
      alert(`The skill "${skillNameToAdd}" is already in your profile.`);
      return;
    }

    const mappedCat = selectedSkill
      ? selectedSkill.mappedAppCategory
      : (selectedCategory === 'Frontend' || selectedCategory === 'Web Development' ? 'Frontend' :
         selectedCategory === 'Data & AI' || selectedCategory === 'AI & ML' ? 'AI & ML' :
         selectedCategory === 'Mechanical Engineering' || selectedCategory === 'CAD & Design' || selectedCategory === 'Electronics & Embedded' || selectedCategory === 'Robotics' || selectedCategory === 'Manufacturing' || selectedCategory === 'Business & Professional' ? 'Systems' : 'Backend');

    // Add skill initially classified as CLAIMED (not automatically verified)
    addSkill(skillNameToAdd, mappedCat);

    setSelectedSkill(null);
    setSearchQuery('');
    setCustomSkillName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Add a Skill</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select technical skills from our multi-disciplinary engineering library to strengthen your profile.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Skill Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Skill Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSkill(null);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Engineering Domains' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Search Skills Field with Searchable Dropdown */}
          <div ref={dropdownRef} className="relative">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Search Skills
              </label>
              {selectedSkill && (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Clear Selection
                </button>
              )}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                  if (selectedSkill && e.target.value !== selectedSkill.name) {
                    setSelectedSkill(null);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search for a skill (e.g. Python, SolidWorks, React, OpenCV)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setIsDropdownOpen(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1.5 max-h-60 overflow-y-auto bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl divide-y divide-slate-800">
                {filteredSkills.length > 0 ? (
                  filteredSkills.map((item, index) => {
                    const isAdded = existingSkillNames.includes(item.name.toLowerCase());
                    const isSelected = selectedSkill?.name === item.name;
                    const isHighlighted = index === highlightedIndex;

                    return (
                      <div
                        key={item.name}
                        onClick={() => !isAdded && handleSelectSkill(item)}
                        className={`p-3 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          isAdded
                            ? 'opacity-50 cursor-not-allowed bg-slate-900/40'
                            : isSelected
                            ? 'bg-indigo-600/30 text-white'
                            : isHighlighted
                            ? 'bg-slate-800 text-white'
                            : 'hover:bg-slate-800/80 text-slate-200'
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center gap-2">
                            <span>{item.name}</span>
                            <span className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                              {item.category}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {item.description}
                          </div>
                        </div>

                        {isAdded ? (
                          <span className="text-[10px] text-slate-500 font-semibold shrink-0">Already Added</span>
                        ) : isSelected ? (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : null}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No matching skills found in library.
                    <button
                      type="button"
                      onClick={() => {
                        setCustomSkillName(searchQuery);
                        setIsDropdownOpen(false);
                      }}
                      className="block mx-auto mt-2 text-indigo-400 font-bold hover:underline"
                    >
                      Add &ldquo;{searchQuery}&rdquo; as a custom skill
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Skill Preview Card */}
          {selectedSkill && (
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-indigo-400">Selected Skill:</span>
                <div className="font-bold text-white text-sm">{selectedSkill.name}</div>
                <div className="text-[11px] text-slate-300 mt-0.5">{selectedSkill.category}</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono font-semibold text-slate-300">
                Initial Status: Claimed
              </span>
            </div>
          )}

          {/* Verification Protocol Notice */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-200 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              RecruitCred Skill Status Lifecycle:
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>• <strong className="text-slate-300">CLAIMED:</strong> Self-reported on profile.</div>
              <div>• <strong className="text-indigo-300">EVIDENCE-BACKED:</strong> Repo/project attached.</div>
              <div>• <strong className="text-cyan-300">ASSESSED:</strong> Test completed.</div>
              <div>• <strong className="text-emerald-300">VERIFIED:</strong> Meets platform criteria.</div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedSkill && !searchQuery.trim()}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Skill
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
