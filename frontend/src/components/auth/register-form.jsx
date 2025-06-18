import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/apiClient";
import { errorExtract } from "@/utils/errorUtils";
import { LoaderCircle } from "lucide-react";

export function RegisterForm({ className, ...props }) {
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await api.post("/auth/register", userData);
      console.log(response);

      return response.data;
    },
    onSuccess: () => {
      navigate("/login");
    },
    onError: (err) => {
      console.log(err);

      setError(errorExtract(err));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    setError(null);
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("password do not matched");
      return;
    }

    registerMutation.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className={"text-center"}>Join us today</CardTitle>
          <CardDescription className={"text-center"}>
            Create an account with just few steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {error && (
                <p className="p-3  bg-destructive/10 rounded-md text-center text-red-500 text-sm">
                  {error}
                </p>
              )}
              <div className="grid gap-3">
                <Label htmlFor="name">Username</Label>
                <Input
                  value={formData.name}
                  onChange={handleChange}
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Username"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="m@example.com"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="******"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">ConfirmPassword</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="******"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full cursor-pointer">
                  {registerMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <LoaderCircle /> Creating account...{" "}
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
