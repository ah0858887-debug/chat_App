interface LoginCredentials {
  email?: string;
  phone?: string;
  password: string;
}

interface SignupCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
  needsOTP?: boolean;
  user?: any;
}

class AuthServiceClass {
  private currentUser: any = null;

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      // Simulate API call
      await this.simulateDelay(1500);

      // Mock validation
      if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
        this.currentUser = {
          id: '1',
          email: credentials.email,
          firstName: 'Demo',
          lastName: 'User',
          phone: '+1234567890',
        };
        return { success: true };
      }

      if (credentials.phone && credentials.password === 'demo123') {
        this.currentUser = {
          id: '1',
          phone: credentials.phone,
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@example.com',
        };
        return { success: true, needsOTP: true };
      }

      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  async signup(credentials: SignupCredentials): Promise<AuthResult> {
    try {
      // Simulate API call
      await this.simulateDelay(2000);

      // Mock successful signup
      this.currentUser = {
        id: Date.now().toString(),
        ...credentials,
      };

      return { success: true, needsOTP: true };
    } catch (error) {
      return { success: false, error: 'Failed to create account' };
    }
  }

  async verifyOTP(otp: string): Promise<AuthResult> {
    try {
      // Simulate API call
      await this.simulateDelay(1000);

      // Mock OTP verification (accept any 6-digit code for demo)
      if (otp.length === 6) {
        return { success: true };
      }

      return { success: false, error: 'Invalid OTP' };
    } catch (error) {
      return { success: false, error: 'Failed to verify OTP' };
    }
  }

  async resendOTP(): Promise<void> {
    // Simulate API call
    await this.simulateDelay(500);
    // In real implementation, would send new OTP
  }

  async getCurrentUser(): Promise<any> {
    // In real implementation, check stored auth token
    return this.currentUser;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    // In real implementation, clear stored tokens
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const AuthService = new AuthServiceClass();