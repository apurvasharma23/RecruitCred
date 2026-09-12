import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Users, Plus } from 'lucide-react';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose }) => {
  const { hackathons, createTeam } = useApp();
  
  const [name, setName] = useState('');
  const [hackathonId, setHackathonId] = useState(hackathons[0].id);
  const [description, setDescription] = useState('');
  const [openRoles, setOpenRoles] = useState('Machine Learning Engineer, UI/UX Designer');
  const [requiredSkills, setRequiredSkills] = useState('Python, PyTorch, Figma');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const targetHack = hackathons.find(h => h.id === hackathonId);

    createTeam({
      name: name.trim(),
      hackathonId,
      hackathonName: targetHack?.title || 'Hackathon 2026',
      description: description.trim(),
      maxSize: 4,
      openRoles: openRoles.split(',').map(r => r.trim()).filter(Boolean),
      requiredSkills: requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-dropdown rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Create a Hackathon Team</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Set your project vision, target hackathon, and list open complementary roles.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Team Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Team Hyperion, NeuralPulse"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Target Hackathon
            </label>
            <select
              value={hackathonId}
              onChange={(e) => setHackathonId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              {hackathons.map((hack) => (
                <option key={hack.id} value={hack.id}>
                  {hack.title} ({hack.prizePool})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Project Vision & Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you planning to build and what problem are you solving?"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Open Roles Needed (comma separated)
            </label>
            <input
              type="text"
              value={openRoles}
              onChange={(e) => setOpenRoles(e.target.value)}
              placeholder="e.g. ML Engineer, UI/UX Designer, DevOps"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Required Verified Skills
            </label>
            <input
              type="text"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="e.g. Python, React, PyTorch"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/25"
            >
              <Plus className="w-4 h-4" />
              Create Team
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
