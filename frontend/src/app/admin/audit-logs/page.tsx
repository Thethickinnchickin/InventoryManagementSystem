'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Pagination, IconButton, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

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
      const cookieString = document.cookie;
      const token = cookieString
        .split('; ')
        .find(row => row.startsWith('authToken'))
        ?.split('=')[1];

      if (!token) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return;
      }

      const response = await axios.get(`${process.env.API_URL || 'http://localhost:3000'}/reports/audit-log`, {
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
      console.error('Error fetching audit logs:', error);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [page, filters]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
    setPage(1); // Reset to the first page when filters change
  };
  

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
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Audit Logs
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Filter by Entity Name"
          name="entityName"
          value={filters.entityName}
          onChange={handleFilterChange}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Filter by Action"
          name="action"
          value={filters.action}
          onChange={handleFilterChange}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Filter by Performed By"
          name="performedBy"
          value={filters.performedBy}
          onChange={handleFilterChange}
          variant="outlined"
          fullWidth
        />
      </Box>

      {logs.length > 0 ? (
        <>
          {/* Audit Logs Table */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Entity Name</TableCell>
                <TableCell>Entity ID</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Changes</TableCell>
                <TableCell>Performed By</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell>{log.entityName}</TableCell>
                  <TableCell>{log.entityId}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => toggleExpand(log.id)}>
                      {expandedLogs.has(log.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                    <Collapse in={expandedLogs.has(log.id)} timeout="auto" unmountOnExit>
                      <pre>{typeof log.changes === 'object' ? JSON.stringify(log.changes, null, 2) : log.changes}</pre>
                    </Collapse>
                  </TableCell>
                  <TableCell>{log.performedBy}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      ) : (
        <Typography>No logs available.</Typography>
      )}
    </Container>
  );
}
