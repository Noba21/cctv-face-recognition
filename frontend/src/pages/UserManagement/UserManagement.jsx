import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiAlertCircle,
  FiDownload,
  FiUpload
} from 'react-icons/fi';
import { personsAPI } from '../../api/persons';
import Card from '../../components/Common/Card';
import Loader from '../../components/Common/Loader';
import Modal from '../../components/Common/Modal';
import AddUserModal from './AddUserModal';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [loading, setLoading] = useState(true);
  const [persons, setPersons] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
    per_page: 20
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    risk_level: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchPersons();
  }, [pagination.page, filters]);

  const fetchPersons = async () => {
    setLoading(true);
    try {
      const response = await personsAPI.getAll({
        page: pagination.page,
        per_page: pagination.per_page,
        ...filters
      });
      setPersons(response.items);
      setPagination({
        page: response.page,
        total: response.total,
        pages: response.pages,
        per_page: response.per_page
      });
    } catch (error) {
      console.error('Failed to fetch persons:', error);
      toast.error('Failed to load persons');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await personsAPI.delete(selectedUser.id);
      toast.success('User archived successfully');
      fetchPersons();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const getRiskBadgeColor = (risk) => {
    const colors = {
      low: 'bg-green-500/20 text-green-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      high: 'bg-orange-500/20 text-orange-400',
      critical: 'bg-red-500/20 text-red-400'
    };
    return colors[risk] || 'bg-secondary-500/20 text-secondary-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-secondary-400 mt-1">
            Manage suspects and persons of interest
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-secondary flex items-center space-x-2">
            <FiUpload />
            <span>Import</span>
          </button>
          <button className="btn-secondary flex items-center space-x-2">
            <FiDownload />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <FiPlus />
            <span>Add Person</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500" />
            <input
              type="text"
              placeholder="Search by name, ID, or address..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>

          {/* Risk Filter */}
          <select
            value={filters.risk_level}
            onChange={(e) => setFilters({ ...filters, risk_level: e.target.value })}
            className="px-4 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
          >
            <option value="">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
            <option value="critical">Critical Risk</option>
          </select>

          {/* Filter Button */}
          <button
            onClick={() => fetchPersons()}
            className="btn-secondary flex items-center space-x-2"
          >
            <FiFilter />
            <span>Apply Filters</span>
          </button>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        {loading ? (
          <div className="py-20">
            <Loader />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="px-6 py-3 text-left">Photo</th>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">National ID</th>
                    <th className="px-6 py-3 text-left">Age/Gender</th>
                    <th className="px-6 py-3 text-left">Risk Level</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Date Added</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-700">
                  {persons.map((person) => (
                    <motion.tr
                      key={person.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="table-row"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={person.photo_path || '/default-avatar.png'}
                          alt={person.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{person.full_name}</p>
                      </td>
                      <td className="px-6 py-4 text-secondary-300">
                        {person.national_id || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-secondary-300">
                        {person.age || '?'} / {person.gender}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskBadgeColor(person.risk_level)}`}>
                          {person.risk_level?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          person.status === 'active' 
                            ? 'bg-green-500/20 text-green-400'
                            : person.status === 'inactive'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-secondary-500/20 text-secondary-400'
                        }`}>
                          {person.status?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-secondary-300">
                        {new Date(person.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/users/${person.id}`}
                            className="p-2 text-secondary-400 hover:text-white hover:bg-secondary-700 rounded-lg transition-colors"
                          >
                            <FiEye size={18} />
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedUser(person);
                              // Handle edit
                            }}
                            className="p-2 text-secondary-400 hover:text-white hover:bg-secondary-700 rounded-lg transition-colors"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(person);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-secondary-400 hover:text-accent-red hover:bg-secondary-700 rounded-lg transition-colors"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {persons.length > 0 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-secondary-400">
                  Showing {((pagination.page - 1) * pagination.per_page) + 1} to{' '}
                  {Math.min(pagination.page * pagination.per_page, pagination.total)} of{' '}
                  {pagination.total} results
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 bg-secondary-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-600 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-primary-600 text-white rounded-lg">
                    {pagination.page}
                  </span>
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 bg-secondary-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-600 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          fetchPersons();
          setShowAddModal(false);
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Archive Person"
        size="sm"
      >
        <div className="space-y-6">
          <div className="flex items-center space-x-4 text-yellow-500">
            <FiAlertCircle size={24} />
            <p className="text-white">
              Are you sure you want to archive <span className="font-semibold">{selectedUser?.full_name}</span>?
              This person will be moved to archived status.
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="btn-danger"
            >
              Archive
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;