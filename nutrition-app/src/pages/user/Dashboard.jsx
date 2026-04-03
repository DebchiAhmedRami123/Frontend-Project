import React from 'react';
import Sidebar from '../../components/shared/Sidebar';
import DashboardOverview from './DashboardOverview';

export default function Dashboard() {
  return (
    <Sidebar>
      <DashboardOverview />
    </Sidebar>
  );
}