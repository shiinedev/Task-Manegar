import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Calendar, Edit2, Loader, MoreVertical, Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/apiClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { toast } from "sonner";

const STATUS_CONFIG = {
  pending: {
    variant: "secondary",
    label: "Pending",
    color: "text-yellow-600",
  },
  "in progress": {
    variant: "default",
    label: "In Progress",
    color: "text-white",
  },
  completed: {
    variant: "outline",
    label: "Completed",
    color: "text-green-600",
  },
};


const TaskCard = ({ task, isLoading = false, onEdit }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);




    const queryClient = useQueryClient();
    
   const deleteMutation = useMutation({
    mutationKey: ["tasks"],
    mutationFn: async () => {
      const response = await api.delete(`/tasks/${task._id}`,);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error deleting task: ${error.message}`);
      console.error("Error deleting task:", error);
    },
  });

  const onDelete = async () => {
    try {
      await deleteMutation.mutateAsync();
      setShowDeleteDialog(false)
    } catch (error) {
         console.error("Error confirming delete:", error);
        toast.error(`Error confirming delete: ${error.message}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate || task.status === "completed") return false;
    return new Date(dueDate) < new Date();
  };

  const dueDate = formatDate(task.dueDate);

  
  const overdue = isOverdue(task.dueDate);

  const statusConfig = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;

  return (
    <>
      <Card className="w-full transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg leading-tight">
              {task?.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant={statusConfig.variant}
                className={`${statusConfig.color} shrink-0`}>
                {statusConfig.label}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    variant="ghost"
                    size="sm"
                    // disabled={isLoading}
                    className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* description */}
          {task.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {task.description}
            </p>
          )}
          {/* due date */}

          {dueDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Due:</span>
              <Badge
                variant={overdue ? "destructive" : "outline"}
                className="text-xs">
                {dueDate}
                {overdue && " (Overdue)"}
              </Badge>
            </div>
          )}

          {/* Simple status indicator */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>Created: {formatDate(task.createdAt)}</span>
            <span className={statusConfig.color}>{statusConfig.label}</span>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              task "{task.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
              {deleteMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader size="sm" />
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskCard;
