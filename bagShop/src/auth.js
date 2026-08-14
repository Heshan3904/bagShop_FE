const USER_STORAGE_KEY = "bagshop-current-user";
const USERS_STORAGE_KEY = "bagshop-users";

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || "{}") || {};
  } catch {
    return {};
  }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const setCurrentUser = (user) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const signup = async (email, password, confirmPassword) => {
  if (!email?.trim() || !password?.trim() || !confirmPassword?.trim()) {
    throw new Error("Please fill in all fields.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users[normalizedEmail]) {
    throw new Error("An account with this email already exists.");
  }

  users[normalizedEmail] = {
    username: normalizedEmail.split("@")[0],
    password,
    role: "user",
  };

  saveUsers(users);
  setCurrentUser({ username: normalizedEmail.split("@")[0], email: normalizedEmail, role: "user" });
  return { success: true };
};

export const signin = async (email, password) => {
  if (!email?.trim() || !password?.trim()) {
    throw new Error("Please fill in all fields.");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();

  if (normalizedEmail === "shopadmin@gmail.com" && password === "Admin") {
    const user = { username: "Admin", email: normalizedEmail, role: "admin" };
    setCurrentUser(user);
    return user;
  }

  const storedUser = users[normalizedEmail];
  if (!storedUser || storedUser.password !== password) {
    throw new Error("Invalid email or password.");
  }

  const user = {
    username: storedUser.username,
    email: normalizedEmail,
    role: storedUser.role || "user",
  };

  setCurrentUser(user);
  return user;
};

export const logout = async () => {
  localStorage.removeItem(USER_STORAGE_KEY);
  return Promise.resolve();
};

export const getUsername = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || "null")?.username || null;
  } catch {
    return null;
  }
};

export const isAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || "null")?.role === "admin";
  } catch {
    return false;
  }
};
