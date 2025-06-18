import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/apiClient";
import { errorExtract } from "@/utils/errorUtils";
import { Loader } from "lucide-react";
import { toast } from "sonner";

const TASK_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "in progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const TaskForm = ({ open, onOpenChange, task }) => {
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
  });

  const [validateError, setValidateError] = useState(null);

  useEffect(() => {
    if (task) {
      console.log("taskId", task._id);

      setFormValues({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "pending",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      setFormValues({
        title: "",
        description: "",
        status: "pending",
        dueDate: "",
      });
    }
    setValidateError(null);
  }, [task, open]);

  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: async (taskData) => {
      const response = await api.post("/tasks", taskData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tasks"]);
      onOpenChange?.(false);
      setFormValues({
        title: "",
        description: "",
        status: "pending",
        dueDate: "",
      });
      toast("task created successfully")
      console.log("task created successfully:", data);
    },
    onError: (err) => {
      console.error("Error creating task:", err);
      toast.error(`Error creating task: ${errorExtract(err)}`, {
        description: "Please try again.",
      });
      setValidateError(errorExtract(err));
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (taskData) => {
      const response = await api.put(`/tasks/${task._id}`, taskData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Task updated successfully", {
        description: "Your task has been updated.",
      });
      queryClient.invalidateQueries(["tasks"]);
      onOpenChange?.(false);
      setFormValues({
        title: "",
        description: "",
        status: "pending",
        dueDate: "",
      });
      console.log("Task updated successfully:", data);
    },
    onError: (error) => {
      console.error("Error updating task:", error);
      toast.error(`Error updating task: ${errorExtract(error)}`, {
        description: "Please try again.",
      });
      setValidateError(errorExtract(error));
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleStatusChange = (value) => {
    console.log("passed", value);

    setFormValues({
      ...formValues,
      status: value,
    });
  };

  const handleCancel = () => {
    onOpenChange?.(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formValues.title) {
      setValidateError("title is required");
    }

    const taskData = {
      title: formValues.title.trim(),
      description: formValues.description,
      status: formValues.status || "pending",
      dueDate: formValues.dueDate
        ? new Date(formValues.dueDate).toISOString()
        : null,
    };

    console.log(taskData);
    

    if (task) {
      updateTaskMutation.mutate(taskData);
    } else {
      registerMutation.mutate(taskData);
    }
  };

  const displayError = validateError
    ? errorExtract(registerMutation.error)
    : errorExtract(updateTaskMutation.isError);

  const isLoading = registerMutation.isPending || updateTaskMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create New Task
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Fill in the details below to create a new task.
          </DialogDescription>
        </DialogHeader>

        {/* inputs */}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {displayError && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {displayError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formValues.title}
              onChange={handleInputChange}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Description</Label>
            <Textarea
              id="description"
              name="description"
              type="text"
              value={formValues.description}
              onChange={handleInputChange}
              placeholder="Enter task description"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formValues.status}
              onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formValues.dueDate}
              onChange={handleInputChange}
            />
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader size="sm" />
                  {task ? "Updating..." : "Creating..."}
                </span>
              ) : task ? (
                "Update Task"
              ) : (
                "Create Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
