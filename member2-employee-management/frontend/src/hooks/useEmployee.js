import { useState, useEffect, useCallback } from 'react';
import { getEmployee, getMyProfile, updateMyProfile, updateEmployee } from '../services/employeeApi';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook to fetch and manage employee profile state
 * @param {string} targetEmployeeId - Specific employee ID to fetch (optional, defaults to auth user's employeeId)
 */
export function useEmployee(targetEmployeeId) {
  const { employeeId: authEmployeeId, updateAvatarInAuth } = useAuth();
  const activeId = targetEmployeeId || authEmployeeId;

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!activeId) return;
    setLoading(true);
    setError(null);
    try {
      let data;
      if (!targetEmployeeId) {
        data = await getMyProfile(activeId);
      } else {
        data = await getEmployee(activeId);
      }
      setEmployee(data);
    } catch (err) {
      console.error('Error fetching employee profile:', err);
      setError(err.message || 'Unable to load employee profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [activeId, targetEmployeeId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /**
   * Save employee self updates (phone, address, avatar)
   */
  const saveMyProfile = async (formData) => {
    setIsUpdating(true);
    try {
      const updated = await updateMyProfile({
        employeeId: activeId,
        ...formData
      });
      setEmployee(updated);
      if (formData.avatarUrl) {
        updateAvatarInAuth(formData.avatarUrl);
      }
      return { success: true, data: updated };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update profile' };
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Save admin-level updates (all fields)
   */
  const saveEmployeeAdmin = async (formData) => {
    setIsUpdating(true);
    try {
      const updated = await updateEmployee(activeId, formData);
      setEmployee(updated);
      return { success: true, data: updated };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update employee details' };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    employee,
    loading,
    error,
    isUpdating,
    refetch: fetchProfile,
    saveMyProfile,
    saveEmployeeAdmin
  };
}
