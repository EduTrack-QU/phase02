"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getStudentStatsAction } from "@/app/action/server-actions";


export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
            router.push('/login?error=admin_required');
        }
    }, [session, status, router]);

    if (status === 'loading') return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
        return (
            <div className="min-h-screen bg-white p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2 text-gray-800">Admin Dashboard</h1>
                    <p className="text-xl text-gray-600 mb-8">Welcome, {session?.user?.name || "Admin"}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <DashboardCard
                            title="Students"
                            count="..."
                            link="#"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            }
                        />
                        <DashboardCard
                            title="Instructors"
                            count="..."
                            link="#"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            }
                        />
                        <DashboardCard
                            title="Courses"
                            count="..."
                            link="#"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            }
                        />
                    </div>
                </div>
            </div>
        );
    }

    return <div className="flex justify-center items-center min-h-screen">Checking authorization...</div>;
}

function DashboardCard({ title, count, link, icon }) {
    const [stats, setStats] = useState(null);
    const [expanded, setExpanded] = useState(false);

    const [instructors, setInstructors] = useState([]);
    const [selectedInstructorId, setSelectedInstructorId] = useState("");
    const [instructorAverage, setInstructorAverage] = useState(0);

    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [totalStudents, setTotalStudents] = useState(0);
    const [gradeDistribution, setGradeDistribution] = useState(null);
    const [failureRate, setFailureRate] = useState("0");

    const handleToggleStats = async () => {
        if (!expanded) {
            if (title === "Students") {
                const studentStats = await getStudentStatsAction();
                setStats(studentStats);
            }


            if (title === "Courses") {
                const res = await fetch("/api/courses/stats");
                setStats(await res.json());

                const resList = await fetch("/api/courses/list");
                setCourses(await resList.json());
                setSelectedCourseId("");
                setTotalStudents(0);
                setGradeDistribution(null);
                setFailureRate("0");
            }

            if (title === "Instructors") {
                const resStats = await fetch("/api/instructors/stats");
                setStats(await resStats.json());

                const resList = await fetch("/api/instructors/list");
                setInstructors(await resList.json());
                setInstructorAverage(0);
                setSelectedInstructorId("");
            }
        }
        setExpanded(!expanded);
    };

    const handleSelectInstructor = async (e) => {
        const id = e.target.value;
        setSelectedInstructorId(id);
        if (id) {
            const res = await fetch(`/api/instructors/stats/${id}`);
            const data = await res.json();
            setInstructorAverage(data.averageGrade ?? 0);
        } else setInstructorAverage(0);
    };

    const handleSelectCourse = async (e) => {
        const id = e.target.value;
        setSelectedCourseId(id);
        if (id) {
            const resStudents = await fetch(`/api/courses/${id}/students`);
            const dataStudents = await resStudents.json();
            setTotalStudents(dataStudents.totalStudents ?? 0);

            const resGrades = await fetch(`/api/courses/${id}/distribution`);
            setGradeDistribution(await resGrades.json());

            const resFailure = await fetch(`/api/courses/${id}/failure`);
            const dataFailure = await resFailure.json();
            setFailureRate(dataFailure.failureRate ?? "0");
        } else {
            setTotalStudents(0);
            setGradeDistribution(null);
            setFailureRate("0");
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-gray-100">
                            {icon}
                        </div>
                        <h2 className="text-2xl font-semibold ml-3 text-gray-800">{title}</h2>
                    </div>
                    <p className="text-3xl font-bold text-gray-700">{count}</p>
                </div>

                <div className="flex justify-between items-center">
                    <a href={link} className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300">
                        Manage {title}
                    </a>

                    <button
                        onClick={handleToggleStats}
                        className="flex items-center space-x-1 text-gray-600 text-sm hover:text-gray-900 transition-colors duration-300 bg-gray-100 px-3 py-1 rounded-md"
                    >
                        <span>{expanded ? "Hide Stats" : "Show Stats"}</span>
                        <svg xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 transform transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>

            {expanded && stats && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    {title === "Students" && (
                        <div className="space-y-4">
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-medium text-gray-700">Average GPA:</span>
                                    <span className="font-bold text-[#1a73e8] text-lg">{stats.averageGpa}</span>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-medium text-gray-700">Highest Student GPA:</span>
                                    <span className="font-bold text-[#1a73e8] text-lg">{stats.highestGpa}</span>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-medium text-gray-700">Students Below 2.5:</span>
                                    <span className="font-bold text-red-600 text-lg">{stats.lowGPAStudents?.length ?? 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-700">Dean's List Students:</span>
                                    <span className="font-bold text-[#1a73e8] text-lg">{stats.deansList?.length ?? 0}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {title === "Instructors" && (
                        <div className="space-y-4">
                            <select value={selectedInstructorId} onChange={handleSelectInstructor}
                                className="w-full border border-gray-200 bg-white text-gray-800 rounded-md px-3 py-2 text-sm mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Select Instructor</option>
                                {instructors.map(inst => (
                                    <option key={inst.id} value={inst.id}>
                                        {inst.name} (ID: {inst.id})
                                    </option>
                                ))}
                            </select>
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-medium text-gray-700">Instructor's Average Grade:</span>
                                    <span className="font-bold text-[#1a73e8] text-lg">{instructorAverage}</span>
                                </div>
                                <div className="pt-2 border-t border-gray-200">
                                    <span className="font-medium text-gray-700 block mb-1">Most Active Instructor:</span>
                                    <span className="font-bold text-[#1a73e8] text-base">{stats.instructorWithMostCourses}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {title === "Courses" && (
                        <div className="space-y-4">
                            {/* General Course Statistics */}
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                <h3 className="font-bold text-gray-800 mb-3 text-center border-b border-gray-200 pb-2">System-Wide Course Statistics</h3>
                                <div className="space-y-3">
                                    <div className="pt-1">
                                        <span className="font-medium text-gray-700 block mb-1">Highest Enrollment:</span>
                                        {stats.coursesWithMostAndLeastStudents?.mostStudents && (
                                            <span className="font-bold text-[#1a73e8]">
                                                {stats.coursesWithMostAndLeastStudents.mostStudents.courseCode}
                                                <span className="ml-2 text-sm font-normal text-gray-500">
                                                    ({stats.coursesWithMostAndLeastStudents.mostStudents.studentCount} students)
                                                </span>
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <span className="font-medium text-gray-700 block mb-1">Lowest Enrollment:</span>
                                        {stats.coursesWithMostAndLeastStudents?.leastStudents?.length > 0 && (
                                            <span className="font-bold text-red-600">
                                                {stats.coursesWithMostAndLeastStudents.leastStudents.map(course => (
                                                    `${course.courseCode} `
                                                )).join(', ')}
                                                <span className="ml-2 text-sm font-normal text-gray-500">
                                                    ({stats.coursesWithMostAndLeastStudents.leastStudents[0].studentCount} students)
                                                </span>
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <span className="font-medium text-gray-700 block mb-1">Course with Most Failures:</span>
                                        {stats.mostFailedCourse ? (
                                            <span className="font-bold text-red-600">
                                                {stats.mostFailedCourse.courseCode}
                                                <span className="ml-2 text-sm font-normal text-gray-500">
                                                    ({stats.mostFailedCourse.failedCount} students)
                                                </span>
                                            </span>
                                        ) : (
                                            <span className="text-gray-500">None reported</span>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center pt-1">
                                        <span className="font-medium text-gray-700">Peak Class Hour:</span>
                                        <span className="font-bold text-[#1a73e8]">{stats.peakHour}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Course-Specific Statistics */}
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                <h3 className="font-bold text-gray-800 mb-3 text-center border-b border-gray-200 pb-2">Course-Specific Statistics</h3>

                                <select
                                    value={selectedCourseId}
                                    onChange={handleSelectCourse}
                                    className="w-full border border-gray-200 bg-white text-gray-800 rounded-md px-3 py-2 text-sm mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select Course</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.courseCode}
                                        </option>
                                    ))}
                                </select>

                                {selectedCourseId ? (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-700">Enrolled Students:</span>
                                            <span className="font-bold text-[#1a73e8]">{totalStudents}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-700">Course Failure Rate:</span>
                                            <span className="font-bold text-red-600">{failureRate}%</span>
                                        </div>

                                        <div className="mt-4">
                                            <h4 className="font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">Grade Distribution</h4>
                                            {gradeDistribution ? (
                                                <div>
                                                    <div className="grid grid-cols-5 gap-2">
                                                        {Object.entries(gradeDistribution).map(([grade, count]) => (
                                                            <div key={grade} className="bg-gray-100 p-2 rounded text-center">
                                                                <div className="font-bold text-sm text-gray-800">{grade}</div>
                                                                <div className="text-gray-700">{count}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <p className="mt-3 text-xs text-gray-500 italic">
                                                        Note: Only {Object.values(gradeDistribution).reduce((a, b) => a + b, 0)} of {totalStudents} students have been assigned grades.
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 italic">Loading grade distribution...</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic text-center">Select a course to view detailed statistics</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
