const ROLE = {
  USER: "User",
  ADMIN: "Admin",
};

// Туршилтын нэвтрэлтийн өгөгдөл (backend unavailable үед fallback болон QA-д ашиглана).
export const TEST_LOGIN_USERS = [
  {
    id: "test-user-1",
    FirstName: "Туршилт",
    LastName: "Хэрэглэгч",
    Name: "Хэрэглэгч Туршилт",
    Email: "user@test.mn",
    Password: "UserTest123",
    currentRole: ROLE.USER,
    role: { User: ROLE.USER, Admin: ROLE.ADMIN },
    pets: [],
    appointments: [],
    isTestAccount: true,
  },
  {
    id: "test-admin-1",
    FirstName: "Систем",
    LastName: "Админ",
    Name: "Админ Систем",
    Email: "admin@test.mn",
    Password: "AdminTest123",
    currentRole: ROLE.ADMIN,
    role: { User: ROLE.USER, Admin: ROLE.ADMIN },
    pets: [],
    appointments: [],
    isTestAccount: true,
  },
];

export function authenticateTestCredentials(email, password) {
  const normalizedEmail = (email || "").trim().toLowerCase();
  return (
    TEST_LOGIN_USERS.find(
      (user) => user.Email.toLowerCase() === normalizedEmail && user.Password === password
    ) || null
  );
}
