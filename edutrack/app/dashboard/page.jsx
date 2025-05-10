"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState,useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {

    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/login?error=admin_required');
    }
  }, [session, status, router]);

  // Display loading state
  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // Only show dashboard if authenticated and admin
  if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <p className="mb-4">Welcome, {session.user.name || session.user.email}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard title="Students" count="..." link="#" />
          <DashboardCard title="Instructors" count="..." link="#" />
          <DashboardCard title="Courses" count="..." link="#" />
        </div>
      </div>
    );
  }

  // Return loading UI while redirects happen
  return <div className="flex justify-center items-center min-h-screen">Checking authorization...</div>;
}

function DashboardCard({ title, count, link }) {
  const [stats, setStats] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const [instructors, setInstructors] = useState([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState("");
  const [instructorAverage, setInstructorAverage] = useState(0);

  const handleToggleStats = async () => {
    if (!expanded) {
      if (title === "Students") {
        const res = await fetch("/api/students/statistics");
        const data = await res.json();
        setStats(data);
      }

      if (title === "Instructors") {
        const resStats = await fetch("/api/instructors/stats");
        const dataStats = await resStats.json();
        setStats(dataStats);

        const resList = await fetch("/api/instructors/list");
        const dataList = await resList.json();
        setInstructors(dataList);
        setInstructorAverage(0);                
        setSelectedInstructorId("");           
      }
    }
    setExpanded(!expanded);
  };

  const handleSelectChange = async (e) => {
    const id = e.target.value;
    setSelectedInstructorId(id);

    if (id) {
      const res = await fetch(`/api/instructors/stats/${id}`);
      const data = await res.json();
      setInstructorAverage(data.averageGrade ?? 0);
    } else {
      setInstructorAverage(0);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-between">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-3xl font-bold mb-4">{count}</p>
      <a href={link} className="text-blue-600 hover:underline mb-4">Manage {title}</a>

      <div
        onClick={handleToggleStats}
        className="flex items-center space-x-1 text-gray-500 text-sm cursor-pointer hover:text-black"
      >
        <span>Show Stats</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transform transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {expanded && stats && (
        <div className="mt-4 text-sm text-center text-gray-600 w-full">
          {title === "Students" && (
            <>
              <p>Avg GPA: {stats.averageGpa}</p>
              <p>Highest GPA: {stats.highestGpa}</p>
              <p>Low GPA Students: {stats.lowGPAStudents?.length ?? 0}</p>
              <p>Deans List: {stats.deansList?.length ?? 0}</p>
            </>
          )}

          {title === "Instructors" && (
            <>
            <select
                value={selectedInstructorId}
                onChange={handleSelectChange}
                className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm mt-3"
              >
                <option value="">Select Instructor</option>
                {instructors.map(inst => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} (ID: {inst.id})
                  </option>
                ))}
              </select>
              <p>Average Grade: {instructorAverage}</p>
              <p>Top Instructor: {stats.instructorWithMostCourses}</p>
            </>
          )}
          {title === "Courses" && (
            <>
            
            </>
          )}
        </div>
      )}
    </div>
  );
}
