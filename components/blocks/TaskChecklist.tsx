"use client";

import { useState } from "react";

interface Task {
  id: string;
  label: string;
  completed: boolean;
}

const INITIAL_TASKS: Task[] = [
  { id: "1", label: "Book the studio", completed: false },
  { id: "2", label: "Send the estimate", completed: false },
  { id: "3", label: "Pick a typeface", completed: false },
  { id: "4", label: "Add new task", completed: false },
];

export function TaskChecklist() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div
      className="w-[260px] p-5 rounded-[20px] bg-[#1f2024] dark:bg-[#1f2024] border border-white/5 select-none pointer-events-auto cursor-default"
      style={{
        boxShadow: "0 8px 32px -8px rgba(0, 0, 0, 0.35)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-3.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={(e) => {
              e.stopPropagation();
              toggleTask(task.id);
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div
              className={`w-4 h-4 rounded-[5px] border flex items-center justify-center transition-colors ${
                task.completed
                  ? "bg-[#eceae5] border-[#eceae5] text-black"
                  : "border-[#4e5058] group-hover:border-[#72747d]"
              }`}
            >
              {task.completed && (
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="1 4.5 3.5 7 9 1.5" />
                </svg>
              )}
            </div>
            <span
              className={`text-[13px] font-normal transition-colors ${
                task.id === "4"
                  ? "text-[#71747d] group-hover:text-[#9ea0a8]"
                  : task.completed
                  ? "line-through text-[#6b6d75]"
                  : "text-[#d1d3d9] group-hover:text-[#eceae5]"
              }`}
            >
              {task.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
