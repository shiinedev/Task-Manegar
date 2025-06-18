import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router"
import { errorExtract } from "@/utils/errorUtils"
import api from "@/lib/apiClient"
import { useAuthStore } from "@/lib/store/authStore"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { LoaderCircle } from "lucide-react"

export function LoginForm({
  className,
  ...props
}) {

 const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",

  });

  const {setAuth} = useAuthStore();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const loginMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await api.post("/auth/login", userData);
     

      return response.data;
    },
    onSuccess: (data) => {
       console.log(data);
      if(data.token) {

        const user = data.user;
        const token = data.token;
        setAuth(user,token);

        navigate("/dashboard");
      }
      
    },
    onError: (err) => {
     
      setError(errorExtract(err));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    setError(null);
    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }


    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card >
        <CardHeader >
          <CardTitle className={"text-center"}>Login to your account</CardTitle>
          <CardDescription className={"text-center"}>
            Enter your email below to login to your account
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
                <Label htmlFor="email">Email</Label>
                <Input 
                 id="email"
                 type="email"
                  name="email" 
                 value={formData.email}
                 onChange={handleChange}
                 placeholder="m@example.com" 
                 required />
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
                required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full cursor-pointer">
                 {loginMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <LoaderCircle /> Login...{" "}
                    </span>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
