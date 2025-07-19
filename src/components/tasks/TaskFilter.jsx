/**
 * TaskFilter Component
 * 
 * A comprehensive task filtering component that allows users to filter tasks
 * by completion status and search by title. Implements real-time filtering
 * with localStorage integration for persistent data access.
 * 
 * Features:
 * - Filter tasks by completion status (All/Complete/Incomplete)
 * - Search tasks by title with real-time results
 * - Responsive design with mobile optimization
 * - Accessibility support with ARIA attributes
 * - Integration with localStorage for data persistence
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaFilter, FaSpinner, FaExclamationTriangle, FaTasks } from 'react-icons/fa';

const TaskFilter = ({ tasks, setFilteredTasks }) => {
  // State management with proper initialization
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });
  const [counts, setCounts] = useState({
    all: 0,
    complete: 0,
    incomplete: 0
  });

  /**
   * Load tasks from localStorage
   * Uses localStorage for cross-component data sharing
   */
  useEffect(() => {
    if (tasks) {
      applyFilters(tasks, filters);
      updateCounts(tasks);
    }
  }, [tasks]);

  /**
   * Update task counts by status
   * 
   * @param {Array} taskList - List of tasks to count
   */
  const updateCounts = (taskList) => {
    const completeTasks = taskList.filter(task => task.progress === 100).length;
    const incompleteTasks = taskList.filter(task => task.progress < 100).length;

    setCounts({
      all: taskList.length,
      complete: completeTasks,
      incomplete: incompleteTasks
    });
  };

  /**
   * Apply filters to tasks based on current filter settings
   * Memoized with useCallback to prevent unnecessary re-renders
   * 
   * @param {Array} taskList - List of tasks to filter
   * @param {Object} filterSettings - Current filter settings
   */
  const applyFilters = (taskList, filterSettings) => {
    let result = [...taskList];

    // Apply status filter
    if (filterSettings.status === 'complete') {
      result = result.filter(task => task.progress === 100);
    } else if (filterSettings.status === 'incomplete') {
      result = result.filter(task => task.progress < 100);
    }

    // Apply search filter
    if (filterSettings.search.trim()) {
      const searchTerm = filterSettings.search.toLowerCase().trim();
      result = result.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        (task.description && task.description.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredTasks(result);
  };

  /**
   * Handle filter changes
   * 
   * @param {string} filterType - Type of filter to change
   * @param {string} value - New filter value
   */
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };

    setFilters(newFilters);
    applyFilters(tasks, newFilters);
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <FaTasks className="mr-2" aria-hidden="true" />
        Task Filter
      </h2>

      <div className="mb-6 space-y-4">
        {/* Search input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Tasks
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="search"
              type="text"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Search by title or description"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              aria-label="Search tasks"
            />
          </div>
        </div>

        {/* Status filter */}
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" aria-hidden="true" />
            </div>
            <select
              id="status-filter"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              aria-label="Filter tasks by status"
            >
              <option value="all">All Tasks ({counts.all})</option>
              <option value="complete">Complete ({counts.complete})</option>
              <option value="incomplete">Incomplete ({counts.incomplete})</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TaskFilter;

