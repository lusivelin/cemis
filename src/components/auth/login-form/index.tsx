import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { Label } from '@/lib/components/ui/label';
import { cn } from '@/lib/utils';
import { login } from '@/server/auth/actions';
import Link from 'next/link';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">Enter your email below to login to your account</p>
      </div>
      <div className="grid gap-6">
        <form className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input name="email" id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input name="password" id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full" formAction={login}>
            Login
          </Button>
        </form>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="#" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </div>
  );
}
