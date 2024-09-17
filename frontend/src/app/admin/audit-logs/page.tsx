"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AuditLogPage.module.css';

export default function AuditLogPage() {
  // State to hold the fetched logs
  const [logs, setLogs] = useState([]);
  // State to manage the current page of logs being viewed
  const [page, setPage] = useState(1);
  // State to manage the total number of pages available
  const [totalPages, setTotalPages] = useState(1);
  // State to manage the filters applied to the logs
  const [filters, setFilters] = useState({
    entityName: '',
    action: '',
    performedBy: '',
  });
  // State to manage which logs are expanded
  const [expandedLogs, setExpandedLogs] = useState<Set<number>>(new Set());

  const limit = 10; // Number of logs to display per page

  /**
   * Fetch audit logs from the server with the current filters and pagination settings.
   */
  const fetchAuditLogs = async () => {
    try {
      // Retrieve authentication token from cookies
      const cookieString = document.cookie;
      const token = cookieString
        .split('; ')
        .find(row => row.startsWith('authToken'))
        ?.split('=')[1];

      // Redirect to login page if token is not found
      if (!token) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return;
      }

      try {
        // Make an API request to fetch audit logs
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/reports/audit-log`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page,
            limit,
            ...filters,
          },
        });
        const data = response.data;
        const pages = typeof data.lastPage === 'number' ? data.lastPage : 1;
        setLogs(data.data);
        setTotalPages(pages);
      } catch (error) {
        console.error('Failed to fetch protected data', error);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  // Fetch logs whenever page or filters change
  useEffect(() => {
    fetchAuditLogs();
  }, [page, filters]);

  /**
   * Handle page change for pagination controls.
   * @param newPage - The new page number to set.
   */
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  /**
   * Handle changes to filter inputs.
   * @param e - The change event from the input field.
   */
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
    setPage(1); // Reset to the first page when filters change
  };

  /**
   * Toggle the expansion of a specific log entry.
   * @param id - The ID of the log entry to toggle.
   */
  const toggleExpand = (id: number) => {
    setExpandedLogs(prev => {
      const newExpandedLogs = new Set(prev);
      if (newExpandedLogs.has(id)) {
        newExpandedLogs.delete(id);
      } else {
        newExpandedLogs.add(id);
      }
      return newExpandedLogs;
    });
  };

  return (
    <div className={styles.container}>
      <h1>Audit Logs</h1>
      <div className={styles.filters}>
        <input
          type="text"
          name="entityName"
          value={filters.entityName}
          onChange={handleFilterChange}
          placeholder="Filter by Entity Name"
          className={styles.filterInput}
        />
        <input
          type="text"
          name="action"
          value={filters.action}
          onChange={handleFilterChange}
          placeholder="Filter by Action"
          className={styles.filterInput}
        />
        <input
          type="text"
          name="performedBy"
          value={filters.performedBy}
          onChange={handleFilterChange}
          placeholder="Filter by Performed By"
          className={styles.filterInput}
        />
      </div>
      {logs.length > 0 ? (
        <>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>Entity Name</th>
                <th>Entity ID</th>
                <th>Action</th>
                <th>Changes</th>
                <th>Performed By</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any) => (
                <tr key={log.id}>
                  <td>{log.entityName}</td>
                  <td>{log.entityId}</td>
                  <td>{log.action}</td>
                  <td>
                    <button
                      className={styles.toggleButton}
                      onClick={() => toggleExpand(log.id)}
                    >
                      {expandedLogs.has(log.id) ? 'Collapse' : 'Expand'}
                    </button>
                    {expandedLogs.has(log.id) && (
                      <pre className={styles.changesContent}>
                        {typeof log.changes === 'object' ? JSON.stringify(log.changes, null, 2) : log.changes}
                      </pre>
                    )}
                  </td>
                  <td>{log.performedBy}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </button>
            <span>{page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No logs available.</p>
      )}
    </div>
  );
}
