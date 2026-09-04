const API_BASE_URL = "/api";

async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}


// ---------- AUTH ----------

export async function loginUser(data) {
    return apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function signupUser(data) {
    return apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function logoutUser() {
    return apiRequest("/auth/logout", {
        method: "POST",
    });
}

export async function getCurrentUser() {
    return apiRequest("/auth/me");
}


// ---------- TASKS ----------

export async function getTasks({ status, priority } = {}) {
    const params = new URLSearchParams();

    if (status) {
        params.set("status", status);
    }

    if (priority) {
        params.set("priority", priority);
    }

    const query = params.toString();

    return apiRequest(
        `/tasks${query ? `?${query}` : ""}`
    );
}

export async function createTask(data) {
    return apiRequest("/tasks", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function updateTask(taskId, data) {
    return apiRequest(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

export async function deleteTask(taskId) {
    return apiRequest(`/tasks/${taskId}`, {
        method: "DELETE",
    });
}

export async function updateTaskStatus(taskId, status) {
    return apiRequest(`/tasks/${taskId}/complete`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });
}

export async function breakdownTask(data) {
    return apiRequest("/ai/breakdown", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function createTasksBulk(tasks) {
    return apiRequest("/tasks/bulk", {
        method: "POST",
        body: JSON.stringify({
            tasks,
        }),
    });
}