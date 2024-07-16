'use client'

import { getAllUsers } from "@/src/lib/auth/getAllUsersServerAction";
import { useEffect, useState } from "react";

export const AdminPage: React.FC = () => {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      const resUsers = await getAllUsers(limit, offset);
      if (resUsers) {
        if (resUsers.length === 0) {
          setHasMoreUsers(false); // No more users to load
        }
        setUsers(resUsers);
      }
    }
    getUsers();
  }, [limit, offset]);

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    setOffset(offset + limit);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    setOffset(Math.max(offset - limit, 0));
    setHasMoreUsers(true); // Reset hasMoreUsers flag when going back
  };


  return (
    <main className="flex flex-col justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center">
        <h2>Admin Page</h2>
        <p>This Page is only accessible to users with the ADMIN role</p>
        <a className="text-blue-500" href="/dashboard">Go to Dashboard</a>
      </div>
      
      <div className="overflow-x-auto mt-8">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200">
                <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Previous
        </button>
        <span className="text-gray-700 mr-4 ml-4"> Page: {currentPage} </span>
        <button
          onClick={nextPage}
          disabled={!hasMoreUsers}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Next
        </button>
      </div>
    </main>
  );
};