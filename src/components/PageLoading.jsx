import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Progress } from './ui/progress';

const PageLoading = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (progress < 100) {
      const timeout = setTimeout(() => setProgress((p) => Math.min(p + 5, 100)), 40);
      return () => clearTimeout(timeout);
    } else {
      const timer = setTimeout(() => navigate('/login', { replace: true }), 400);
      return () => clearTimeout(timer);
    }
  }, [progress, navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: `radial-gradient(ellipse 80% 80% at 70% 20%, #e6f0ff 0%, #f2eaff 60%, #f8f9fb 100%),\nradial-gradient(ellipse 60% 60% at 20% 80%, #e0f7fa 0%, #f2eaff 80%, #f8f9fb 100%)`
      }}
    >
      <img src="/brand-logo.png" alt="Brand Logo" className="w-20 h-20 mb-8" />
      <div className="w-64">
        <Progress value={progress} />
      </div>
    </div>
  );
};

export default PageLoading;
