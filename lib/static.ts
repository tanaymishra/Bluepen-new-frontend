/**
 * Static credentials and user data for development/testing.
 * Replace with real API calls when backend is integrated.
 */

export type UserRole = "admin" | "student" | "freelancer" | "PM" | "HR" | "Admin" | "Tech";

export interface StaticUser {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    role: UserRole;
    password: string;
    token: string;
}

export const STATIC_USERS: StaticUser[] = [
    {
        id: "stu_001",
        firstname: "Rahul",
        lastname: "Sharma",
        email: "student@bluepen.co.in",
        phone: "+919876543210",
        role: "student",
        password: "Student@123",
        token: "static_jwt_student_001",
    },
    {
        id: "adm_001",
        firstname: "Admin",
        lastname: "User",
        email: "admin@bluepen.co.in",
        phone: "+919876543211",
        role: "admin",
        password: "Admin@123",
        token: "static_jwt_admin_001",
    },
    {
        id: "frl_001",
        firstname: "Priya",
        lastname: "Patel",
        email: "freelancer@bluepen.co.in",
        phone: "+919876543212",
        role: "freelancer",
        password: "Freelancer@123",
        token: "static_jwt_freelancer_001",
    },
];

/**
 * Validates credentials against static users.
 * Returns the user object (without password) or null.
 */
export function validateCredentials(
    email: string,
    password: string
): Omit<StaticUser, "password"> | null {
    const user = STATIC_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return null;
    const { password: _, ...safeUser } = user;
    return safeUser;
}

/**
 * Checks if an email is already registered.
 */
export function isEmailTaken(email: string): boolean {
    return STATIC_USERS.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
    );
}

/**
 * Simulates user registration. Returns the new user object.
 * In production, this would be an API call.
 */
export function registerUser(data: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    password: string;
}): Omit<StaticUser, "password"> {
    const newUser: StaticUser = {
        id: `stu_${Date.now()}`,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
        role: "student",
        password: data.password,
        token: `static_jwt_${Date.now()}`,
    };
    // In a real app, you'd persist this. For now, just return it.
    STATIC_USERS.push(newUser);
    const { password: _, ...safeUser } = newUser;
    return safeUser;
}
