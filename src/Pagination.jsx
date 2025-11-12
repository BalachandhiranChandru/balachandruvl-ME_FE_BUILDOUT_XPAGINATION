import React, { useState, useEffect } from 'react';
import styles from './Pagination.module.css';

const API_ENDPOINT = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';
const ROWS_PER_PAGE = 10;

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
            {/* <style>{styles}</style> */}
            <div className={styles.container}>
                <div className={styles['table-wrapper']}>
                    <h2 className="table-title">Employee Data Table</h2>

                    <table className={styles['employee-table']}>
                        <thead>
                            <tr className={styles['header-row']}>
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
                        <div className={styles['pagination-controls']}>
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>

                            <span className={styles['page-number']}>{currentPage}</span>

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