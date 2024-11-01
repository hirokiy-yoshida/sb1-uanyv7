import React, { useState } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockUsers';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: 'USER' as const,
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      ...newUser,
      id: `user-${users.length + 1}`,
    };
    setUsers([...users, user]);
    setShowAddUser(false);
    setNewUser({ email: '', name: '', role: 'USER' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">ユーザー管理</h2>
        <button
          onClick={() => setShowAddUser(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          ユーザーを追加
        </button>
      </div>

      {showAddUser && (
        <form onSubmit={handleAddUser} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                名前
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                権限
              </label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'ADMIN' | 'USER' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              >
                <option value="USER">一般ユーザー</option>
                <option value="ADMIN">システム管理者</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowAddUser(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                追加
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <span className={`inline-block px-2 py-1 text-xs rounded ${
                user.role === 'ADMIN' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user.role === 'ADMIN' ? 'システム管理者' : '一般ユーザー'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}