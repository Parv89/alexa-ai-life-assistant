import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Check, 
  Trash2, 
  Edit3, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Tag, 
  Mic, 
  Sparkles,
  X,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES = ['All', 'Work', 'Personal', 'Health', 'Home', 'Learning', 'Productivity'];
const PRIORITIES = [
  { id: 'all', label: 'All Priorities' },
  { id: 'urgent', label: 'Urgent', color: 'badge-urgent' },
  { id: 'high', label: 'High', color: 'badge-high' },
  { id: 'medium', label: 'Medium', color: 'badge-medium' },
  { id: 'low', label: 'Low', color: 'badge-low' },
];

export default function TaskManager({ 
  tasks = [], 
  isLoading, 
  error, 
  onCreateTask, 
  onUpdateTask, 
  onDeleteTask, 
  onToggleTask, 
  onRetry 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'completed'

  // Modal state for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Work',
    priority: 'medium',
    dueDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0],
  });

  const openCreateModal = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      category: 'Work',
      priority: 'medium',
      dueDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      category: task.category || 'Work',
      priority: task.priority || 'medium',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTask) {
      onUpdateTask(editingTask._id, formData);
    } else {
      onCreateTask(formData);
    }
    setIsModalOpen(false);
  };

  const handleToggleWithConfetti = (taskId, currentlyCompleted) => {
    if (!currentlyCompleted) {
      // Fire confetti burst!
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00F0FF', '#8B5CF6', '#10B981']
      });
    }
    onToggleTask(taskId);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || task.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesPriority = selectedPriority === 'all' || task.priority.toLowerCase() === selectedPriority.toLowerCase();
    const matchesStatus = statusFilter === 'all' 
      ? true 
      : statusFilter === 'completed' ? task.completed : !task.completed;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5">
        <div>
          <div className="flex items-center gap-2">
            <Layers size={20} className="text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Task Management Center</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Organize daily directives, deadlines, and voice-synchronized to-dos.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-primary self-start md:self-auto"
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks by title or keyword..."
              className="input-field pl-10"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-800 self-stretch sm:self-auto">
            {['all', 'pending', 'completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === st 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills & Priority Dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-cyan-500/30 to-purple-600/30 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-slate-900/80 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-cyan-400 font-mono"
            >
              {PRIORITIES.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task List Content */}
      {isLoading ? (
        /* Loading Skeleton State */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-panel p-5 space-y-3 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-3/4"></div>
              <div className="h-3 bg-slate-850 rounded w-1/2"></div>
              <div className="flex gap-2 pt-2">
                <div className="h-5 bg-slate-800 rounded-full w-16"></div>
                <div className="h-5 bg-slate-800 rounded-full w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error State */
        <div className="glass-panel p-10 text-center space-y-3">
          <AlertCircle size={36} className="text-rose-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Failed to load tasks</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">{error}</p>
          <button onClick={onRetry} className="btn-secondary text-xs mt-2">
            Retry Loading
          </button>
        </div>
      ) : filteredTasks.length === 0 ? (
        /* Empty State */
        <div className="glass-panel p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No tasks found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {searchTerm || selectedCategory !== 'All' || selectedPriority !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Your agenda is completely open! Add a new task or instruct Alexa via voice.'}
            </p>
          </div>
          <button onClick={openCreateModal} className="btn-primary text-xs mx-auto">
            <Plus size={15} />
            <span>Create First Task</span>
          </button>
        </div>
      ) : (
        /* Render Task Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => {
            const isOverdue = !task.completed && task.dueDate && new Date(task.dueDate) < new Date();
            return (
              <div
                key={task._id}
                className={`glass-panel p-5 space-y-3.5 transition-all group ${
                  task.completed ? 'opacity-65' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => handleToggleWithConfetti(task._id, task.completed)}
                      className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border mt-0.5 transition-all ${
                        task.completed 
                          ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_10px_rgba(0,240,255,0.4)]' 
                          : 'border-slate-600 hover:border-cyan-400 bg-slate-950/60'
                      }`}
                      aria-label="Toggle task completion"
                    >
                      {task.completed && <Check size={14} strokeWidth={3} />}
                    </button>

                    <div className="min-w-0">
                      <h3 className={`text-sm font-semibold leading-snug break-words ${
                        task.completed ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Priority Badge */}
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full capitalize font-semibold flex-shrink-0 ${
                    task.priority === 'urgent' ? 'badge-urgent' :
                    task.priority === 'high' ? 'badge-high' :
                    task.priority === 'medium' ? 'badge-medium' : 'badge-low'
                  }`}>
                    {task.priority}
                  </span>
                </div>

                {/* Footer metadata & buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
                      {task.category}
                    </span>

                    {task.dueDate && (
                      <span className={`flex items-center gap-1 font-mono text-[11px] ${
                        isOverdue ? 'text-rose-400 font-bold' : 'text-slate-400'
                      }`}>
                        <Clock size={12} />
                        {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        {isOverdue && ' (Overdue)'}
                      </span>
                    )}

                    {task.source === 'alexa' && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-800">
                        Alexa Voice
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                      title="Edit task"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task._id)}
                      className="p-1.5 rounded-lg hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="glass-panel p-6 w-full max-w-lg space-y-4 border-[rgba(0,240,255,0.3)] shadow-[0_25px_60px_rgba(0,0,0,0.7)] animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={16} className="text-cyan-400" />
                <span>{editingTask ? 'Edit Task' : 'Create New Task'}</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Prepare Alexa Hackathon Architecture Deck"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional context, sub-items, or instructions..."
                  className="input-field text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field text-xs font-mono"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="input-field text-xs font-mono"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="input-field text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
