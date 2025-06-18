import { ClipboardCheck, Loader, Search } from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import TaskCard from "./TaskCard";

const TaskList = ({
  tasks = [],
  isLoading,
  onEdit,
  onChangeStatus,
}) => {



  
  const [searchTerm, setSearchTerm] = useState("");

  const searchFiltered = tasks.filter(task =>{
    const matchedSearch = task.title.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
              (task.description && task.description.toLowerCase().includes(searchTerm.toLocaleLowerCase()))
    return matchedSearch
  })

  

  const getTasks = () => {
    const filteredTasks = {
      all: searchFiltered,
      pending: searchFiltered.filter((task) => task.status === "pending"),
      inProgress: searchFiltered.filter((task) => task.status === "in progress"),
      completed: searchFiltered.filter((task) => task.status === "completed"),
    };

    const stats = {
        total : filteredTasks.all.length,
        pending : filteredTasks.pending.length,
        inProgress: filteredTasks.inProgress.length,
        completed: filteredTasks.completed.length
    }

    
    return { stats,filteredTasks };
  };

  const { stats , filteredTasks } = getTasks();

  const percentageInprogress = ((stats.total - stats.completed) / stats.total) * 100 || 0;
  
  

   if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader className="animate-spin" />
      </div>
    );
  }


  const TaskGrid = ({tasks, emptyMessage}) => {
    if (tasks.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-sm font-medium text-foreground">
              No tasks found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {
        tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEdit}
            
          />
        ))}
      </div>
      
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Total</p>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Pending</p>
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>

        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              In Progress
            </p>
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
        </div>

        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Completed
            </p>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
         <div className="bg-card p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Progress
            </p>
            <div className="h-2 w-2 rounded-full bg-violet-500"></div>
          </div>
          <p className="text-2xl flex items-center gap-2 font-bold text-violet-600">
            {percentageInprogress.toFixed(2)}%
            <Badge variant={percentageInprogress > 0 ? "secondary" : "default"}>
              {percentageInprogress > 0 ? "in-progress" : "completed"}
            </Badge>
            </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <div className="relative flex-1 max-w-4xl">
          <Search className="absolute left-3 top-1/2  h-4 w-4 text-muted-foreground transform -translate-y-1/2" />

          <Input
            type="text"
            name="search"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All
            <Badge variant="secondary">{stats.total}</Badge>
          </TabsTrigger>

          <TabsTrigger value="pending" className="flex items-center gap-2">
            Pending
            <Badge variant="secondary">{stats.pending}</Badge>
          </TabsTrigger>

          <TabsTrigger value="in-progress" className="flex items-center gap-2">
            In Progress
            <Badge variant="secondary">{stats.inProgress}</Badge>
          </TabsTrigger>

          <TabsTrigger value="completed" className="flex items-center gap-2">
            Completed
            <Badge variant="secondary">{stats.completed}</Badge>
          </TabsTrigger>
        </TabsList>
        <div className="mt-5">
        <TabsContent value="all" >
           <TaskGrid 
                tasks={filteredTasks.all}
            />
        </TabsContent>
        <TabsContent value="pending">
            <TaskGrid 
                tasks={filteredTasks.pending}
                emptyMessage={"no pending tasks found"}
            />
        </TabsContent>
        <TabsContent value="in-progress">
            <TaskGrid 
                tasks={filteredTasks.inProgress}
                emptyMessage={"no progress tasks found"}
            />
        </TabsContent>
        <TabsContent value="completed">
             <TaskGrid 
                tasks={filteredTasks.completed}
                emptyMessage={"no completed tasks found"}
            />
        </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TaskList;
