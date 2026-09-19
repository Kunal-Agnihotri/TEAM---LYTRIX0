import React, { useState } from 'react';
import { ShieldCheck, UserCheck, AlertTriangle, Plus, CheckCircle, Trash2 } from 'lucide-react';

export const TeamDashboard: React.FC = () => {
  const [tasks, setTasks] = useState([
    {
      id: 'TASK-1',
      name: 'PEL project',
      deadline: '20/09/2026',
      description: 'Keerti Verma - BTech CSE from Lovely Professional University. Managing platform verification and data accuracy.'
    }
  ]);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('2026-09-30');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName) return;
    const parts = newTaskDeadline.split('-');
    const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : newTaskDeadline;
    
    setTasks([
      ...tasks,
      {
        id: 'TASK-' + (tasks.length + 1),
        name: newTaskName,
        deadline: formattedDate,
        description: newTaskDesc || 'No additional notes.'
      }
    ]);
    setShowTaskModal(false);
    setNewTaskName('');
    setNewTaskDesc('');
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#b8cd91] p-6 rounded-2xl shadow-sm text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team & Admin Control Center</h2>
          <p className="text-sm opacity-90 mt-1">Monitor user verifications, resolve contract disputes, and oversee platform operations.</p>
        </div>
        <button
          onClick={() => setShowTaskModal(true)}
          className="bg-[#628543] hover:bg-[#566b49] text-white font-bold px-5 py-3 rounded-xl shadow-md transition flex items-center gap-2 text-sm"
        >
          <Plus className="w-5 h-5" />
          <span>New Team Task</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[rgba(98,133,67,0.12)] shadow-sm">
          <p className="text-xs uppercase tracking-wider text-[#8a987f] font-semibold mb-1">Pending Verifications</p>
          <p className="text-3xl font-bold text-[#628543]">3</p>
          <p className="text-xs text-[#7d8c72] mt-2">Farmer ID & GST reviews</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[rgba(98,133,67,0.12)] shadow-sm">
          <p className="text-xs uppercase tracking-wider text-[#8a987f] font-semibold mb-1">Platform Disputes</p>
          <p className="text-3xl font-bold text-[#628543]">0</p>
          <p className="text-xs text-[#7d8c72] mt-2">Fully resolved or clear</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[rgba(98,133,67,0.12)] shadow-sm">
          <p className="text-xs uppercase tracking-wider text-[#8a987f] font-semibold mb-1">Active Team Tasks</p>
          <p className="text-3xl font-bold text-[#628543]">{tasks.length}</p>
          <p className="text-xs text-[#7d8c72] mt-2">Coordinated administration</p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white p-6 rounded-2xl border border-[rgba(98,133,67,0.12)] shadow-sm">
        <h3 className="text-lg font-bold text-[#628543] mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          <span>Team Project & Task Board</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-[#789b55] text-white p-5 rounded-2xl shadow-md relative flex flex-col justify-between min-h-[180px]">
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-lg">{task.name}</h4>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-white/80 hover:text-white p-1"
                    title="Complete / Remove Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs font-semibold mt-1 text-[#fff9dc]">Deadline: {task.deadline}</p>
                <p className="text-xs mt-3 line-clamp-3 text-white/90">{task.description}</p>
              </div>
              <div className="pt-3 mt-auto border-t border-white/20 flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-[#fff9dc] text-[#628543] px-2.5 py-1 rounded-md">
                  Active Task
                </span>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="px-3 py-1 bg-[#fff9dc] text-[#628543] hover:bg-[#fffce9] text-xs font-bold rounded-lg transition"
                >
                  Complete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-[#27364a] max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setShowTaskModal(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-200"
            >
              X
            </button>
            <h3 className="text-xl font-bold text-[#628543] mb-4">Add New Team Task</h3>
            
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#173c3c] mb-1">TASK NAME</label>
                <input
                  type="text"
                  required
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="Enter task name"
                  className="w-full h-11 px-3 rounded-xl border border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#1f2937] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173c3c] mb-1">DEADLINE</label>
                <input
                  type="date"
                  required
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#1f2937] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173c3c] mb-1">DESCRIPTION & NOTES</label>
                <textarea
                  rows={3}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Enter task details..."
                  className="w-full p-3 rounded-xl border border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#1f2937] outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#789b55] hover:bg-[#628543] text-white text-xs font-bold rounded-xl"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
