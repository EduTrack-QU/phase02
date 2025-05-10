import {getHighestGpa, getLowGPAStudents, getAverageGpa, getDeansList} from '@/repos/students';


export async function getAverageGpaAction() {
    const averageGpa = await getAverageGpa();
    return averageGpa;
}