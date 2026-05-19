/**
 * Identity Service API
 *
 * LocalStorage-backed identity contract used by the app.
 */

import { UserDTO } from "../../../shared/contracts/dtos/UserDTO.js";
import { UserRegisteredEvent, UserLoggedInEvent, UserLoggedOutEvent } from '../../../shared/contracts/events/IdentityEvents.js';
import { eventBus } from '../../../shared/eventBus/EventBus.js';

const USERS_STORAGE_KEY = 'identity_service_users';
const SESSION_STORAGE_KEY = 'identity_service_current_user';

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const users = JSON.parse(raw);
    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function getSessionUser() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading current user:', error);
    return null;
  }
}

function saveSession(user) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

function normalizeUser(user) {
  if (!user) {
    return null;
  }

  const dto = user instanceof UserDTO ? user : new UserDTO(user);
  const fullName = `${dto.lastName || ''} ${dto.firstName || ''}`.trim();

  return {
    ...dto.toJSON(),
    id: dto.userId,
    userId: dto.userId,
    name: fullName,
    Name: fullName,
    email: dto.email,
    Email: dto.email,
    currentRole: dto.currentRole
  };
}

function findUserIndexByEmail(users, email) {
  const targetEmail = (email || '').trim().toLowerCase();
  return users.findIndex(user => (user.email || '').trim().toLowerCase() === targetEmail);
}

function findUserIndexById(users, userId) {
  return users.findIndex(user => user.userId === userId);
}

export class IdentityServiceAPI {
  static async login(email, password) {
    try {
      if (!email || !password) {
        return { success: false, error: 'Имэйл болон нууц үг оруулна уу' };
      }

      const users = readUsers();
      const index = findUserIndexByEmail(users, email);

      if (index === -1 || users[index].password !== password) {
        return { success: false, error: 'Имэйл эсвэл нууц үг буруу байна' };
      }

      const user = normalizeUser(users[index]);
      saveSession(user);
      eventBus.publish(new UserLoggedInEvent(user.userId));

      return {
        success: true,
        user: new UserDTO(user),
        token: `token-${user.userId}-${Date.now()}`
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async register(userData) {
    try {
      const firstName = (userData.firstName || userData.FirstName || '').trim();
      const lastName = (userData.lastName || userData.LastName || '').trim();
      const email = (userData.email || userData.Email || '').trim().toLowerCase();
      const password = (userData.password || userData.Password || '').trim();

      if (!firstName || !lastName || !email || !password) {
        return { success: false, error: 'Бүх талбарыг бөглөнө үү' };
      }

      const users = readUsers();
      if (findUserIndexByEmail(users, email) !== -1) {
        return { success: false, error: 'Энэ имэйл бүртгэлтэй байна' };
      }

      const newUser = {
        userId: `user-${Date.now()}`,
        firstName,
        lastName,
        email,
        password,
        currentRole: userData.currentRole || 'User',
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);

      eventBus.publish(new UserRegisteredEvent(newUser.userId, newUser));

      return {
        success: true,
        user: new UserDTO(newUser)
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static getCurrentUser() {
    return getSessionUser();
  }

  static async getUserById(userId) {
    try {
      const users = readUsers();
      const user = users.find(item => item.userId === userId);
      return user ? new UserDTO(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  static isAdmin(user = null) {
    const target = user || getSessionUser();
    return (target?.currentRole || '') === 'Admin';
  }

  static getRedirectRoute(user = null) {
    const target = user || getSessionUser();
    if (!target) {
      return '/UI/logIn.html';
    }

    return this.isAdmin(target) ? '/UI/dashboard.html' : '/UI/profile.html';
  }

  static checkAuthAndRedirect(redirectTo = '/UI/logIn.html') {
    const currentUser = getSessionUser();
    if (currentUser) {
      return true;
    }

    window.location.href = redirectTo;
    return false;
  }

  static async updateProfile(userId, updates = {}) {
    try {
      const users = readUsers();
      const index = findUserIndexById(users, userId);

      if (index === -1) {
        return { success: false, error: 'Хэрэглэгч олдсонгүй' };
      }

      users[index] = {
        ...users[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      saveUsers(users);

      const sessionUser = getSessionUser();
      if (sessionUser?.userId === userId) {
        saveSession(normalizeUser(users[index]));
      }

      return {
        success: true,
        user: new UserDTO(users[index])
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async logout() {
    try {
      const currentUser = getSessionUser();
      if (currentUser) {
        eventBus.publish(new UserLoggedOutEvent(currentUser.userId));
      }

      clearSession();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default IdentityServiceAPI;
