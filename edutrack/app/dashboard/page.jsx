"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import  { getStudentStatsAction } from "@/app/action/server-actions";


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

    return <div className="flex justify-center items-center min-h-screen">Checking authorization...</div>;
}

function DashboardCard({ title, count, link }) {
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
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-between">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-3xl font-bold mb-4">{count}</p>
            <a href={link} className="text-blue-600 hover:underline mb-4">Manage {title}</a>

            <div
                onClick={handleToggleStats}
                className="flex items-center space-x-1 text-gray-500 text-sm cursor-pointer hover:text-black"
            >
                <span>Show Stats</span>
                <svg xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transform transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                            <select value={selectedInstructorId} onChange={handleSelectInstructor}
                                className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm mt-3">
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
                            <select
                                value={selectedCourseId}
                                onChange={handleSelectCourse}
                                className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm mt-3"
                            >
                                <option value="">Select Course</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>
                                        {course.courseCode}
                                    </option>
                                ))}
                            </select>

                            <p>Total Students: {totalStudents}</p>
                            <p>Failure Rate: {failureRate}%</p>

                            {stats.coursesWithMostAndLeastStudents?.mostStudents && (
                                <p>
                                    Most Students: {stats.coursesWithMostAndLeastStudents.mostStudents.courseCode}
                                    → {stats.coursesWithMostAndLeastStudents.mostStudents.studentCount} students
                                </p>
                            )}

                            {stats.coursesWithMostAndLeastStudents?.leastStudents?.length > 0 && (
                                <p>
                                    Least Students: {stats.coursesWithMostAndLeastStudents.leastStudents.map(course => (
                                        `${course.courseCode} `
                                    )).join(', ')}
                                    → {stats.coursesWithMostAndLeastStudents.leastStudents[0].studentCount} students
                                </p>
                            )}

                            {stats.mostFailedCourse ? (
                                <p>
                                    Most Failed Course: {stats.mostFailedCourse.courseCode}
                                    → {stats.mostFailedCourse.failedCount} fails
                                </p>
                            ) : (
                                <p>Most Failed Course: None</p>
                            )}

                            <p>Peak Hour: {stats.peakHour}</p>

                            <h3 className="mt-4 font-bold">Grade Distribution for Course</h3>
                            {gradeDistribution ? (
                                <ul className="text-xs">
                                    {Object.entries(gradeDistribution).map(([grade, count]) => (
                                        <li key={grade}>{grade}: {count}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No data. Select a course.</p>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
