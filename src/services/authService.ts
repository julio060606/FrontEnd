import axios from 'axios';
import { AuthResponse, UserProfile } from '../types/auth.types';
import {
  LoginFormValues,
  RegisterFormValues,
  ForgotPasswordFormValues,
  ResetPasswordFormValues,
} from '../validations/auth.schema';
import { MOCK_AUTH_RESPONSE, MOCK_TEST_USER } from '../mocks/authMocks';

// Desactivar mocks para el Sprint 2 (consumo directo de Spring Boot)
const USE_MOCKS = false;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const simulateDelay = <T>(data: T, ms: number = 400): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
};

export const authService = {
  /**
   * Inicia sesión con credenciales de usuario
   */
  async login(credentials: LoginFormValues): Promise<AuthResponse> {
    if (USE_MOCKS) {
      await simulateDelay(null, 500);

      // Simulación de validación de credenciales
      if (credentials.email.toLowerCase() === 'error@correo.com') {
        throw new Error('Credenciales inválidas. Verifique su correo o contraseña.');
      }

      const response: AuthResponse = {
        ...MOCK_AUTH_RESPONSE,
        user: {
          ...MOCK_TEST_USER,
          email: credentials.email,
        },
      };

      // Guardar token en storage si rememberMe está activo
      if (credentials.rememberMe) {
        localStorage.setItem('auth_token', response.accessToken);
      } else {
        sessionStorage.setItem('auth_token', response.accessToken);
      }

      return response;
    }

    try {
      const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/login`, {
        email: credentials.email.trim(),
        password: credentials.password,
      });

      const authData = response.data;
      if (credentials.rememberMe) {
        localStorage.setItem('auth_token', authData.accessToken);
        localStorage.setItem('auth_user', JSON.stringify(authData.user));
      } else {
        sessionStorage.setItem('auth_token', authData.accessToken);
        sessionStorage.setItem('auth_user', JSON.stringify(authData.user));
      }

      window.dispatchEvent(new Event('chasquifly:auth-change'));
      return authData;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Credenciales inválidas. Verifique su correo o contraseña.');
    }
  },

  /**
   * Registra una nueva cuenta de usuario
   */
  async register(data: RegisterFormValues): Promise<{ userId: string; message: string }> {
    if (USE_MOCKS) {
      await simulateDelay(null, 600);

      if (data.email.toLowerCase() === 'existente@correo.com') {
        throw new Error('El correo electrónico ya se encuentra registrado.');
      }

      return {
        userId: 'usr-' + Math.random().toString(36).substring(2, 9),
        message: 'Usuario registrado exitosamente',
      };
    }

    try {
      const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/register`, {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        password: data.password,
        phone: data.phone?.trim() || null,
      });

      return {
        userId: response.data.user.id,
        message: 'Usuario registrado exitosamente',
      };
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('El correo electrónico ya se encuentra registrado.');
    }
  },

  /**
   * Solicita el restablecimiento de contraseña mediante correo
   */
  async forgotPassword(data: ForgotPasswordFormValues): Promise<{ message: string }> {
    if (USE_MOCKS) {
      await simulateDelay(null, 500);
      return {
        message: `Hemos enviado un enlace de recuperación a ${data.email}`,
      };
    }
    return { message: `Hemos enviado un enlace de recuperación a ${data.email}` };
  },

  /**
   * Resetea la contraseña con un token
   */
  async resetPassword(token: string, data: ResetPasswordFormValues): Promise<{ message: string }> {
    if (USE_MOCKS) {
      await simulateDelay(null, 500);
      return {
        message: 'Tu contraseña ha sido actualizada con éxito',
      };
    }
    return { message: 'Tu contraseña ha sido actualizada con éxito' };
  },

  /**
   * Cierra la sesión activa
   */
  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
    window.dispatchEvent(new Event('chasquifly:auth-change'));
  },

  /**
   * Retorna el perfil del usuario autenticado actualmente
   */
  getCurrentUser(): UserProfile | null {
    const raw = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  },

  /**
   * Retorna el token JWT activo
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  },

  /**
   * Indica si existe una sesión activa
   */
  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  },
};

