import { useQueryClient } from "@tanstack/react-query";

// Custom hook that returns a function to refetch all active queries
const useRefetch = () => {
    const queryClient = useQueryClient();
    return async() => {

        // Refetch all queries that are currently active (mounted and used)
        await queryClient.refetchQueries({
            type: "active"  // Only refetch queries that are in use (not stale or inactive)
        })
    };
}

export default useRefetch;

// ✅ When to use this:
// After a mutation (e.g., createProject, deleteProject, etc.) to make sure UI reflects latest server state.
// In optimistic updates: do mutation → refetch queries to sync real state.
// In dashboards where many dependent queries are being used, and you want a centralized "refresh" button.

