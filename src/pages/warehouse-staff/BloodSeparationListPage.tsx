import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { fetchSeparationJobs } from '../../api/bloodSeparationService';
import type {  SeparationJob } from '../../data/mockSeparation';

export const BloodSeparationListPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<SeparationJob[]>([]);

  useEffect(() => {
    (async () => {
      const data = await fetchSeparationJobs();
      // sort newest first
      const sorted = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setJobs(sorted);
    })();
  }, []);

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen">
      <h2 className="text-2xl font-semibold text-center text-[#236afe] mb-6">Danh sách mẫu cần phân tách</h2>
      <Card className="shadow-md">
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader className="bg-[#f3f4f6]">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nhóm máu</TableHead>
                <TableHead>Thành phần</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map(job => (
                <TableRow key={job._id} className="hover:bg-[#f9fafb]">
                  <TableCell>{job._id}</TableCell>
                  <TableCell>{job.blood_group_name}</TableCell>
                  <TableCell>{job.blood_component_name}</TableCell>
                  <TableCell>{job.status}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      onClick={() => navigate(`/dashboard-staff-warehouse/blood-separation-process/${job._id}`)}
                    >
                      Xử lý
                    </Button> 
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};