import { LeaveService } from '../../src/services/leaveService';
import { LeaveType, LeaveStatus } from '@prisma/client';

describe('Leave Service & State Machine Unit Tests', () => {
  const testEmployeeId = 'EMP_TEST_001';

  beforeEach(async () => {
    // Ensure fresh balance initialized
    await LeaveService.getOrCreateBalance(testEmployeeId);
  });

  test('should return correct initial balance quota', async () => {
    const summary = await LeaveService.getBalanceSummary(testEmployeeId);
    expect(summary.paid_leave.total).toBe(18);
    expect(summary.sick_leave.total).toBe(12);
    expect(summary.paid_leave.available).toBeGreaterThan(0);
  });

  test('should reject leave application if start date is after end date', async () => {
    await expect(
      LeaveService.applyLeave(testEmployeeId, 'Test User', 'test@dayflow.com', {
        leave_type: LeaveType.PAID,
        start_date: '2026-09-10',
        end_date: '2026-09-05',
        remarks: 'Invalid dates',
      })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  test('should reject paid leave application when requested days exceed quota', async () => {
    await expect(
      LeaveService.applyLeave(testEmployeeId, 'Test User', 'test@dayflow.com', {
        leave_type: LeaveType.PAID,
        start_date: '2026-09-01',
        end_date: '2026-09-25', // 25 days > 14 available
        remarks: 'Excessive vacation',
      })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  test('should allow applying for leave within quota limits and set status to PENDING', async () => {
    const request = await LeaveService.applyLeave(testEmployeeId, 'Test User', 'test@dayflow.com', {
      leave_type: LeaveType.PAID,
      start_date: '2026-09-01',
      end_date: '2026-09-02', // 2 days
      remarks: 'Personal errands',
    });

    expect(request.status).toBe(LeaveStatus.PENDING);
    expect(request.total_days).toBe(2);
  });

  test('should deduct leave balance when approved by Admin', async () => {
    const initialBal = await LeaveService.getBalanceSummary(testEmployeeId);
    const initialPaidAvailable = initialBal.paid_leave.available;

    const request = await LeaveService.applyLeave(testEmployeeId, 'Test User', 'test@dayflow.com', {
      leave_type: LeaveType.PAID,
      start_date: '2026-10-01',
      end_date: '2026-10-02', // 2 days
      remarks: 'Vacation',
    });

    const approved = await LeaveService.approveLeave(
      request.id,
      'HR Admin',
      'Approved for test'
    );

    expect(approved.status).toBe(LeaveStatus.APPROVED);
    expect(approved.approved_by).toBe('HR Admin');

    const updatedBal = await LeaveService.getBalanceSummary(testEmployeeId);
    expect(updatedBal.paid_leave.available).toBe(initialPaidAvailable - 2);
  });

  test('should prevent double approval or approving a rejected request', async () => {
    const request = await LeaveService.applyLeave(testEmployeeId, 'Test User', 'test@dayflow.com', {
      leave_type: LeaveType.SICK,
      start_date: '2026-11-01',
      end_date: '2026-11-01', // 1 day
      remarks: 'Dentist',
    });

    await LeaveService.approveLeave(request.id, 'HR Admin');

    // Attempting to approve again must throw 400
    await expect(LeaveService.approveLeave(request.id, 'HR Admin')).rejects.toMatchObject({
      statusCode: 400,
    });
  });
});

