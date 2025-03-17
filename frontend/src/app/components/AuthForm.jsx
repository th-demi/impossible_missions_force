import { useState } from 'react';

const AuthForm = ({ onSubmit, isRegister = false }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'agent'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const result = await onSubmit(formData);
      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <label htmlFor="username" className="block mb-2 text-sm font-medium">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="input w-full"
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="password" className="block mb-2 text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="input w-full"
          required
        />
      </div>
      
      {isRegister && (
        <div className="mb-4">
          <label htmlFor="role" className="block mb-2 text-sm font-medium">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="input w-full"
          >
            <option value="agent">Agent</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
      )}
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <button type="submit" className="btn-primary w-full">
        {isRegister ? 'Register' : 'Login'}
      </button>
    </form>
  );
};

export default AuthForm;