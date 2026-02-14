'use client';

import { useState, useEffect } from 'react';
import { queueService, QueueItem } from '@/lib/services/queue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, AlertCircle } from 'lucide-react';

export default function QueueManagement() {
  const [queues, setQueues] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQueues();
    const interval = setInterval(loadQueues, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadQueues = async () => {
    try {
      const data = await queueService.getQueues();
      setQueues(data);
    } catch (error) {
      console.error('Failed to load queues:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'IN_PROGRESS' | 'COMPLETED') => {
    try {
      await queueService.updateQueueStatus(id, { status });
      loadQueues();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WAITING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const waiting = queues.filter(q => q.status === 'WAITING');
  const inProgress = queues.filter(q => q.status === 'IN_PROGRESS');

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Queue Management</h1>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-bold text-yellow-600">{waiting.length}</p>
            <p className="text-sm text-gray-500">Waiting</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-bold text-blue-600">{inProgress.length}</p>
            <p className="text-sm text-gray-500">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-bold text-green-600">{queues.filter(q => q.status === 'COMPLETED').length}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Waiting Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {waiting.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{item.patientId}</span>
                  </div>
                  <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </span>
                  <Badge variant="outline">{item.queueType}</Badge>
                  {item.priority > 5 && <AlertCircle className="w-4 h-4 text-red-500" />}
                </div>
                <Button size="sm" onClick={() => updateStatus(item.id, 'IN_PROGRESS')} className="w-full">
                  Start
                </Button>
              </div>
            ))}
            {waiting.length === 0 && <p className="text-center text-gray-500 py-8">No patients waiting</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>In Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {inProgress.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg bg-blue-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{item.patientId}</span>
                  </div>
                  <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </span>
                  <Badge variant="outline">{item.queueType}</Badge>
                </div>
                <Button size="sm" onClick={() => updateStatus(item.id, 'COMPLETED')} className="w-full">
                  Complete
                </Button>
              </div>
            ))}
            {inProgress.length === 0 && <p className="text-center text-gray-500 py-8">No active patients</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
