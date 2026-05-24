import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAssignmentStore } from '../store/useAssignmentStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function useWebSocket(assignmentId: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const setStatus = useAssignmentStore((state) => state.setStatus);
  const setProgress = useAssignmentStore((state) => state.setProgress);
  const setError = useAssignmentStore((state) => state.setError);
  const fetchPaper = useAssignmentStore((state) => state.fetchPaper);

  useEffect(() => {
    if (!assignmentId) return;

    const newSocket = io(API_BASE_URL);

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('join-room', { assignmentId });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('generation:started', ({ message }) => {
      setStatus('processing');
      setProgress(20, message || 'AI is reading requirements...');
    });

    newSocket.on('generation:progress', ({ progress, message }) => {
      setStatus('processing');
      setProgress(progress, message);
    });

    newSocket.on('generation:completed', ({ paperId }) => {
      setProgress(100, 'Formatting complete!');
      setStatus('completed');
      fetchPaper(assignmentId);
    });

    newSocket.on('generation:failed', ({ error }) => {
      setStatus('failed');
      setError(error || 'Failed to generate assessment');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [assignmentId, setStatus, setProgress, setError, fetchPaper]);

  return { socket, isConnected };
}
