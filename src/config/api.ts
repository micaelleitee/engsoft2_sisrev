// Configuração da API
// Para desenvolvimento local, use o IP da sua máquina ao invés de localhost
// Exemplo: 'http://192.168.1.100:3000' (substitua pelo IP da sua máquina)

// Para encontrar seu IP no Linux:
// ip addr show | grep "inet " | grep -v 127.0.0.1

export const API_BASE_URL = __DEV__
  ? 'http://localhost:3000' // Para emulador Android/iOS
  : 'https://sua-api-em-producao.com'; // Para produção

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  
  // Laboratories
  LABORATORIES: '/api/laboratories',
  LABORATORY_BY_ID: (id: string) => `/api/laboratories/${id}`,
  
  // Reservations
  RESERVATIONS: '/api/reservations',
  RESERVATION_BY_ID: (id: string) => `/api/reservations/${id}`,
  
  // Users
  PROFILE: '/api/users/profile',
  
  // Notifications
  NOTIFICATIONS: '/api/notifications',
  MARK_NOTIFICATION_READ: (id: string) => `/api/notifications/${id}/read`,
} as const;
