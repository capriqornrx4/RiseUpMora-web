export const departmentsByFaculty = {
  "Faculty of Engineering": [
    "Department of Chemical & Process Engineering",
    "Department of Civil Engineering",
    "Department of Computer Science & Engineering",
    "Department of Earth Resources Engineering",
    "Department of Electrical Engineering",
    "Department of Electronic & Telecommunication Engineering",
    "Department of Materials Science & Engineering",
    "Department of Mechanical Engineering",
    "Department of Textile & Apparel Engineering",
    "Department of Transport Management and Logistics Engineering",
  ],
  "Faculty of Information Technology": [
    "Department of Information Technology",
    "Department of Artificial Intelligence",
    "Department of Information Technology & Management",
  ],

} as const;

export type Faculty = keyof typeof departmentsByFaculty;

export const faculties = Object.keys(departmentsByFaculty) as Faculty[];

export function isFaculty(value: string): value is Faculty {
  return Object.hasOwn(departmentsByFaculty, value);
}

export function isDepartmentForFaculty(
  faculty: Faculty,
  department: string,
) {
  return (departmentsByFaculty[faculty] as readonly string[]).includes(department);
}
