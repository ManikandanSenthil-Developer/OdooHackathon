import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { CheckInPage } from "./pages/attendance/CheckInPage";
import { TodayAttendance } from "./pages/attendance/TodayAttendance";
import { WeeklyAttendance } from "./pages/attendance/WeeklyAttendance";
import { AdminAttendance } from "./pages/attendance/AdminAttendance";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/attendance" element={<CheckInPage />} />
      <Route path="/attendance/today" element={<TodayAttendance />} />
      <Route path="/attendance/week" element={<WeeklyAttendance />} />
      <Route path="/attendance/admin" element={<AdminAttendance />} />
      <Route path="*" element={<Navigate to="/attendance" replace />} />
    </Routes>
  );
};

export default App;