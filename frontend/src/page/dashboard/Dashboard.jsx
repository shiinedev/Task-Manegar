import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardWelcome from "@/components/Dashboard/DashboardWelcome";
import TaskForm from "@/components/Dashboard/TaskForm";
import TaskList from "@/components/Dashboard/TaskList";
import api from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React, { useState } from "react";

const Dashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const queryMutation = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await api.get("/tasks");
      return response.data;
    },
    retry:1
  });

 
  
  const handleEdit = (task) => {
     setEditingTask(task);
     setShowCreateForm(true);
  };

  

  const onChangeStatus = () => {};

  const handleCreateTask = () => {
    setShowCreateForm(true);
  };
  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingTask(null);
  };

 
  if (queryMutation.isError) {
    <div className="h-screen flex justify-center items-center">
        <h1>{queryMutation.isError}</h1>
    </div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* header */}

      <DashboardHeader />

      <main className="max-w-7xl mx-auto  px-4 py-8 space-y-6">
        <DashboardWelcome
          showCreateForm={showCreateForm}
          onCreateTask={handleCreateTask}
        />

        <TaskList
          tasks={queryMutation.data || []}
          isLoading={queryMutation.isLoading}
          onEdit={handleEdit}
          onChangeStatus={onChangeStatus}
        />
      </main>

      {/* Task Dialog Form */}

      <TaskForm
        open={showCreateForm || !!editingTask}
        onOpenChange={handleFormClose}
        task={editingTask}
      />
    </div>
  );
};

export default Dashboard;
