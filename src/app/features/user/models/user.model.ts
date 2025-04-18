export interface RawUser {
  user_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  user_name: string;
  department: string;
  user_status: string;
}

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  department: string;
  status: string;
}

export interface UserResponse {
  success: boolean;
  id?: string;
  message?: string;
}
