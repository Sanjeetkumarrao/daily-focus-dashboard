"use client";

import { useState } from "react";
import { updateTask } from "@/lib/api";

export default function EditTaskForm({ task, onUpdated, onClose }) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [category, setCategory] = useState(task.category || "");
    const [priority, setPriority] = useState(task.priority || "low");
    const [dueDate, setDueDate] = useState(
        task.dueDate ? task.dueDate.slice(0, 10) : ""
    );

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = {
                title,
                description,
                priority,
                category,
            };

            if (dueDate) {
                data.dueDate = dueDate;
            }

            const response = await updateTask(task._id, data);

            onUpdated(response.task);
            onClose();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-[#171717]/50 flex items-center justify-center p-5">
            <div className="w-full max-w-lg bg-[#faf9f5] border border-[#171717] shadow-[8px_8px_0px_#171717]">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#d8d4ca] px-6 py-5">
                    <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-[#e87532] font-bold">
                            Edit task
                        </p>

                        <h2 className="text-2xl font-black mt-1">
                            Make a change
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-2xl leading-none hover:text-[#e87532]"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-5"
                >
                    {/* Title */}
                    <div>
                        <label
                            htmlFor="edit-title"
                            className="block text-sm font-semibold mb-2"
                        >
                            Title *
                        </label>

                        <input
                            id="edit-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full bg-transparent border-b-2 border-[#c9c5bb] px-1 py-3 outline-none focus:border-[#e87532]"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="edit-description"
                            className="block text-sm font-semibold mb-2"
                        >
                            Description *
                        </label>

                        <textarea
                            id="edit-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={3}
                            className="w-full bg-[#f3f0e8] border border-[#c9c5bb] px-3 py-3 outline-none focus:border-[#171717] resize-none"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label
                            htmlFor="edit-category"
                            className="block text-sm font-semibold mb-2"
                        >
                            Category
                        </label>

                        <input
                            id="edit-category"
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-[#c9c5bb] px-1 py-3 outline-none focus:border-[#e87532]"
                        />
                    </div>

                    {/* Priority + Due Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                        <div>
                            <label
                                htmlFor="edit-priority"
                                className="block text-sm font-semibold mb-2"
                            >
                                Priority
                            </label>

                            <select
                                id="edit-priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full bg-[#f3f0e8] border border-[#c9c5bb] px-3 py-3 outline-none focus:border-[#171717]"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="edit-dueDate"
                                className="block text-sm font-semibold mb-2"
                            >
                                Due date
                            </label>

                            <input
                                id="edit-dueDate"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full bg-[#f3f0e8] border border-[#c9c5bb] px-3 py-3 outline-none focus:border-[#171717]"
                            />
                        </div>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="border-l-4 border-red-500 bg-red-50 px-4 py-3">
                            <p className="text-sm text-red-600">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-[#c9c5bb] py-3 font-semibold hover:border-[#171717]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-[#171717] text-white py-3 font-bold hover:bg-[#e87532] disabled:opacity-60"
                        >
                            {loading ? "Saving..." : "Save changes"}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}