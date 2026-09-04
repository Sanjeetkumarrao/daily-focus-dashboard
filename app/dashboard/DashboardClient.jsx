"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    getTasks,
    logoutUser,
    updateTaskStatus,
    deleteTask,
    breakdownTask,
    createTasksBulk,
} from "@/lib/api";
import CreateTaskForm from "@/components/tasks/CreateTaskForm";
import EditTaskForm from "@/components/tasks/EditTaskForm";

export default function DashboardClient({ user }) {
    const router = useRouter();

    const [tasks, setTasks] = useState([]);
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // AI states
    const [aiSteps, setAiSteps] = useState({});
    const [aiLoading, setAiLoading] = useState(null);

    const [convertingTask, setConvertingTask] = useState(null);

    async function loadTasks() {
        try {
            setLoading(true);
            setError("");

            const data = await getTasks({
                status,
                priority,
            });

            setTasks(data.tasks || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTasks();
    }, [status, priority]);

    async function handleLogout() {
        try {
            await logoutUser();
            router.push("/login");
        } catch (error) {
            setError(error.message);
        }
    }

    async function handleStatusChange(task) {
        try {
            const newStatus =
                task.status === "completed"
                    ? "pending"
                    : "completed";

            await updateTaskStatus(
                task._id,
                newStatus
            );

            setTasks((currentTasks) =>
                currentTasks.map((currentTask) =>
                    currentTask._id === task._id
                        ? {
                              ...currentTask,
                              status: newStatus,
                              completedAt:
                                  newStatus === "completed"
                                      ? new Date().toISOString()
                                      : null,
                          }
                        : currentTask
                )
            );
        } catch (error) {
            setError(error.message);
        }
    }

    async function handleDelete(taskId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) return;

        try {
            await deleteTask(taskId);

            setTasks((currentTasks) =>
                currentTasks.filter(
                    (task) => task._id !== taskId
                )
            );

            // Remove AI steps of deleted task
            setAiSteps((currentSteps) => {
                const updatedSteps = { ...currentSteps };
                delete updatedSteps[taskId];
                return updatedSteps;
            });
        } catch (error) {
            setError(error.message);
        }
    }

    async function handleBreakdown(task) {
        setError("");
        setAiLoading(task._id);

        try {
            const response = await breakdownTask({
                title: task.title,
                description: task.description,
                priority: task.priority,
                category: task.category,
            });

            setAiSteps((prev) => ({
                ...prev,
                [task._id]: response.steps,
            }));
        } catch (error) {
            setError(error.message);
        } finally {
            setAiLoading(null);
        }
    }


    async function handleConvertToTasks(task) {
        const steps = aiSteps[task._id];

        if (!steps || steps.length === 0) {
            return;
        }

        setError("");
        setConvertingTask(task._id);

        try {
            const tasks = steps.map((step) => ({
                title: step,
                description: `Part of: ${task.title}`,
                priority: task.priority,
                category: task.category || "Other",
            }));

            const response = await createTasksBulk(tasks);

            setTasks((currentTasks) => [
                ...response.tasks,
                ...currentTasks,
            ]);

            setAiSteps((currentSteps) => {
                const updatedSteps = { ...currentSteps };
                delete updatedSteps[task._id];
                return updatedSteps;
            });

        } catch (error) {
            setError(error.message);
        } finally {
            setConvertingTask(null);
        }
    }

    return (
        <main className="min-h-screen bg-[#f3f0e8] text-[#171717]">

            {/* Navbar */}

            <nav className="border-b border-[#d8d4ca] bg-[#faf9f5]">
                <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 border-2 border-[#171717] flex items-center justify-center font-black">
                            D
                        </div>

                        <span className="font-bold tracking-wide">
                            DAILY FOCUS
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <span className="text-sm font-semibold">
                            {user.name}
                        </span>

                        <button
                            onClick={handleLogout}
                            className="text-sm font-semibold underline underline-offset-4 hover:text-[#e87532] transition"
                        >
                            Logout
                        </button>
                    </div>

                </div>
            </nav>


            {/* Main */}

            <section className="max-w-6xl mx-auto px-6 py-12">

                {/* Header */}

                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">

                    <div>
                        <p className="text-sm uppercase tracking-[0.18em] text-[#e87532] font-bold mb-3">
                            Your workspace
                        </p>

                        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
                            Good to see you,
                            <br />
                            {user.name}.
                        </h1>

                        <p className="text-[#77736b] mt-4">
                            Keep your priorities clear and your day focused.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-[#171717] text-white px-6 py-3 font-bold hover:bg-[#e87532] transition"
                    >
                        + New Task
                    </button>

                </div>


                {/* Filters */}

                <div className="border-y border-[#d8d4ca] py-5 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                    <div className="flex flex-wrap gap-2">

                        <button
                            onClick={() => setStatus("")}
                            className={`px-4 py-2 text-sm font-semibold border ${
                                status === ""
                                    ? "bg-[#171717] text-white border-[#171717]"
                                    : "border-[#c9c5bb] hover:border-[#171717]"
                            }`}
                        >
                            All
                        </button>

                        <button
                            onClick={() => setStatus("pending")}
                            className={`px-4 py-2 text-sm font-semibold border ${
                                status === "pending"
                                    ? "bg-[#171717] text-white border-[#171717]"
                                    : "border-[#c9c5bb] hover:border-[#171717]"
                            }`}
                        >
                            Pending
                        </button>

                        <button
                            onClick={() => setStatus("completed")}
                            className={`px-4 py-2 text-sm font-semibold border ${
                                status === "completed"
                                    ? "bg-[#171717] text-white border-[#171717]"
                                    : "border-[#c9c5bb] hover:border-[#171717]"
                            }`}
                        >
                            Completed
                        </button>

                    </div>


                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="bg-transparent border border-[#c9c5bb] px-4 py-2 text-sm outline-none focus:border-[#171717]"
                    >
                        <option value="">All priorities</option>
                        <option value="low">Low priority</option>
                        <option value="medium">Medium priority</option>
                        <option value="high">High priority</option>
                    </select>

                </div>


                {/* Error */}

                {error && (
                    <div className="border-l-4 border-red-500 bg-red-50 px-4 py-3 mb-6">
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    </div>
                )}


                {/* Task Heading */}

                <div className="flex items-center justify-between mb-5">

                    <h2 className="text-xl font-bold">
                        Your Tasks
                    </h2>

                    <span className="text-sm text-[#77736b]">
                        {tasks.length} task
                        {tasks.length !== 1 ? "s" : ""}
                    </span>

                </div>


                {/* Task List */}

                {loading ? (
                    <div className="bg-[#faf9f5] border border-[#d8d4ca] p-8">
                        <p className="text-[#77736b]">
                            Loading your tasks...
                        </p>
                    </div>

                ) : tasks.length === 0 ? (

                    <div className="bg-[#faf9f5] border border-dashed border-[#c9c5bb] p-12 text-center">

                        <p className="text-lg font-bold">
                            No tasks found.
                        </p>

                        <p className="text-sm text-[#77736b] mt-2">
                            Your workspace is clear for now.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-3">

                        {tasks.map((task) => (

                            <article
                                key={task._id}
                                className="bg-[#faf9f5] border border-[#d8d4ca] p-5 hover:border-[#171717] transition"
                            >

                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                                    {/* Task information */}

                                    <div className="flex-1">

                                        <div className="flex items-center gap-3 flex-wrap">

                                            <h3 className="text-lg font-bold">
                                                {task.title}
                                            </h3>

                                            <span className="text-xs uppercase tracking-wide border border-[#c9c5bb] px-2 py-1">
                                                {task.priority}
                                            </span>

                                        </div>

                                        <p className="text-sm text-[#77736b] mt-2">
                                            {task.description}
                                        </p>

                                        {task.dueDate && (
                                            <p className="text-xs text-[#99958c] mt-3">
                                                Due:{" "}
                                                {new Date(
                                                    task.dueDate
                                                ).toLocaleDateString()}
                                            </p>
                                        )}


                                        {/* AI Breakdown */}

                                        {aiSteps[task._id] && (
                                            <div className="mt-5 border-t border-[#d8d4ca] pt-4">

                                                <h4 className="text-sm font-bold uppercase tracking-wide mb-3">
                                                    AI Breakdown
                                                </h4>

                                                <ol className="list-decimal list-inside space-y-2">
                                                    {aiSteps[task._id].map(
                                                        (step, index) => (
                                                            <li
                                                                key={index}
                                                                className="text-sm text-[#55514a]"
                                                            >
                                                                {step}
                                                            </li>
                                                        )
                                                    )}
                                                </ol>

                                                <button
                                                    onClick={() => handleConvertToTasks(task)}
                                                    disabled={convertingTask === task._id}
                                                    className="mt-4 bg-[#171717] text-white px-4 py-2 text-sm font-bold hover:bg-[#e87532] transition disabled:opacity-50"
                                                >
                                                    {convertingTask === task._id
                                                        ? "Creating Tasks..."
                                                        : "Convert to Tasks"}
                                                </button>

                                            </div>
                                        )}

                                    </div>


                                    {/* Task actions */}

                                    <div className="flex items-center gap-5 flex-wrap">

                                        <span
                                            className={`text-xs font-bold uppercase tracking-wide ${
                                                task.status === "completed"
                                                    ? "text-[#e87532]"
                                                    : "text-[#77736b]"
                                            }`}
                                        >
                                            {task.status}
                                        </span>


                                        {/* AI Breakdown Button */}

                                        <button
                                            onClick={() =>
                                                handleBreakdown(task)
                                            }
                                            disabled={
                                                aiLoading === task._id
                                            }
                                            className="border border-[#171717] px-4 py-2 text-sm font-bold hover:bg-[#e87532] hover:text-white transition disabled:opacity-50"
                                        >
                                            {aiLoading === task._id
                                                ? "Thinking..."
                                                : "AI Breakdown"}
                                        </button>


                                        <button
                                            onClick={() =>
                                                setEditingTask(task)
                                            }
                                            className="text-sm font-semibold underline underline-offset-4 hover:text-[#e87532]"
                                        >
                                            Edit
                                        </button>


                                        <button
                                            onClick={() =>
                                                handleStatusChange(task)
                                            }
                                            className="border border-[#171717] px-4 py-2 text-sm font-bold hover:bg-[#171717] hover:text-white"
                                        >
                                            {task.status === "completed"
                                                ? "Mark pending"
                                                : "Complete"}
                                        </button>


                                        <button
                                            onClick={() =>
                                                handleDelete(task._id)
                                            }
                                            className="border border-[#171717] px-4 py-2 text-sm font-bold hover:bg-red-600 hover:text-white"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </section>


            {/* Create Task Modal */}

            {showCreateForm && (
                <CreateTaskForm
                    onCreated={(newTask) => {
                        setTasks((currentTasks) => [
                            newTask,
                            ...currentTasks,
                        ]);
                    }}
                    onClose={() => setShowCreateForm(false)}
                />
            )}


            {/* Edit Task Modal */}

            {editingTask && (
                <EditTaskForm
                    task={editingTask}
                    onUpdated={(updatedTask) => {
                        setTasks((currentTasks) =>
                            currentTasks.map((task) =>
                                task._id === updatedTask._id
                                    ? updatedTask
                                    : task
                            )
                        );
                    }}
                    onClose={() => setEditingTask(null)}
                />
            )}

        </main>
    );
}