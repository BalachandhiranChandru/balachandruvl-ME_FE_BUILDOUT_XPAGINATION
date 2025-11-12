import React, { useState, useEffect } from 'react';

const API_ENDPOINT = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';
const ROWS_PER_PAGE = 10;

const styles = `
body {
  font-family: 'Inter', sans-serif;
  background-color: #f4f7f6;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
}

.table-title {
  margin-bottom: 25px;
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
}

/* Table Styling */
.table-wrapper {
  width: 100%;
//   max-width: 1000px;
  background-color: white;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
}

.employee-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  margin-bottom: 20px;
}

.header-row {
  background-color: #008080; /* Teal/Green color */
  color: white;
  font-weight: bold;
}

.employee-table th, .employee-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
}

.employee-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.employee-table tr:hover {
  background-color: #e6f7f3; /* Light green hover effect for usability */
}

/* Pagination Styling */
.pagination-controls {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.pagination-controls button {
  padding: 8px 15px;
  cursor: pointer;
  border: 1px solid #008080;
  border-radius: 4px;
  background-color: #fff;
  color: #008080;
  transition: background-color 0.3s;
}

.pagination-controls button:not([disabled]):hover {
  background-color: #008080;
  color: white;
}

.pagination-controls button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
  border-color: #ccc;
  color: #555;
  background-color: #eee;
}

.page-number {
  padding: 8px 12px;
  font-weight: bold;
  border: 1px solid #008080;
  border-radius: 4px;
  background-color: #008080;
  color: white;
  display: inline-block;
  min-width: 30px;
  text-align: center;
}

.loading-state, .no-data-state {
  padding: 50px;
  font-size: 1.2em;
  color: #555;
  text-align: center;
}
`;

function Pagination() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_ENDPOINT);
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.status);
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                alert('Failed to fetch data');
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);

    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    const currentData = data.slice(startIndex, endIndex);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (loading) {
        return <div className="loading-state">Loading Employee Data...</div>;
    }

    if (data.length === 0 && !loading) {
        return <div className="no-data-state">No employee data available.</div>;
    }

    return (
        <>
            <style>{styles}</style>
            <div className="container">
                <div className="table-wrapper">
                    <h2 className="table-title">Employee Data Table</h2>

                    <table className="employee-table">
                        <thead>
                            <tr className="header-row">
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map(member => (
                                <tr key={member.id}>
                                    <td>{member.id}</td>
                                    <td>{member.name}</td>
                                    <td>{member.email}</td>
                                    <td>{member.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {totalPages > 1 && (
                        <div className="pagination-controls">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>

                            <span className="page-number">{currentPage}</span>

                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Pagination;