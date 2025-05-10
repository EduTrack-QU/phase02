import {getHighestGpa, getLowGPAStudents, getAverageGpa, getDeansList} from '@/repos/students';


export async function getAverageGpaAction() {
    const averageGpa = await getAverageGpa();
    return averageGpa;
}
export async function getHighestGpaAction() {
    const highestGpa = await getHighestGpa();
    return highestGpa;
}
export async function getLowGPAStudentsAction() {
    const lowGPAStudents = await getLowGPAStudents();
    return lowGPAStudents;
}
export async function getDeansListAction() {
    const deansList = await getDeansList();
    return deansList;
}
